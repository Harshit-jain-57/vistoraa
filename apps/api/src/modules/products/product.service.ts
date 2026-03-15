import { StatusCodes } from 'http-status-codes';

import { RoleName, VisibilityAudience } from '@vistora/shared';

import type { UpdateProductDto, UpsertProductDto, PublicProductQuery } from './product.types';

import { AppError } from '../../common/errors/app-error';
import { buildPaginationMeta, getPagination } from '../../common/utils/pagination';
import { toSlug } from '../../common/utils/slug';
import { auditService } from '../audit/audit.service';
import { categoryRepository } from '../categories/category.repository';
import { productRepository, type ProductRecord } from './product.repository';
import { visibilityPolicyService } from './visibility-policy.service';

export class ProductService {
  private getAudience(role?: RoleName): VisibilityAudience {
    if (role === RoleName.OWNER || role === RoleName.ADMIN) {
      return VisibilityAudience.ADMIN;
    }

    if (role === RoleName.STAFF) {
      return VisibilityAudience.STAFF;
    }

    return VisibilityAudience.PUBLIC;
  }

  public async listPublicProducts(storeId: string, query: PublicProductQuery) {
    const pagination = getPagination(query);
    const [products, total, rules] = await Promise.all([
      productRepository.listPublicCatalogue(storeId, query, pagination.skip, pagination.limit),
      productRepository.countPublicCatalogue(storeId, query),
      productRepository.findVisibilityRules(storeId),
    ]);

    return {
      data: products.map((product) =>
        visibilityPolicyService.shapeProduct(product, VisibilityAudience.PUBLIC, rules),
      ),
      pagination: buildPaginationMeta(pagination.page, pagination.limit, total),
    };
  }

  public async getPublicProduct(storeId: string, slug: string) {
    const [product, rules] = await Promise.all([
      productRepository.findPublicBySlug(storeId, slug),
      productRepository.findVisibilityRules(storeId),
    ]);

    if (!product) {
      throw new AppError(StatusCodes.NOT_FOUND, 'PRODUCT_NOT_FOUND', 'Product not found.');
    }

    return visibilityPolicyService.shapeProduct(product, VisibilityAudience.PUBLIC, rules);
  }

  public async listAdminProducts(storeId: string, query: PublicProductQuery, role: RoleName) {
    const audience = this.getAudience(role);
    const pagination = getPagination(query);
    const [products, total, rules] = await Promise.all([
      productRepository.listAdminCatalogue(storeId, query, pagination.skip, pagination.limit),
      productRepository.countAdminCatalogue(storeId, query),
      productRepository.findVisibilityRules(storeId),
    ]);

    return {
      data: products.map((product) => visibilityPolicyService.shapeProduct(product, audience, rules)),
      pagination: buildPaginationMeta(pagination.page, pagination.limit, total),
    };
  }

  public async createProduct(storeId: string, actorUserId: string, dto: UpsertProductDto) {
    if (dto.categoryId) {
      const category = await categoryRepository.findById(storeId, dto.categoryId);

      if (!category) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'INVALID_CATEGORY', 'Category does not exist for this store.');
      }
    }

    const slug = dto.slug ? toSlug(dto.slug) : toSlug(dto.name);
    const conflict = await productRepository.findConflict(storeId, dto.sku, slug);

    if (conflict) {
      throw new AppError(
        StatusCodes.CONFLICT,
        'PRODUCT_CONFLICT',
        'A product with the same SKU or slug already exists in this store.',
      );
    }

    const created = await productRepository.create(storeId, actorUserId, {
      ...dto,
      slug,
    });

    await auditService.log({
      storeId,
      userId: actorUserId,
      entityType: 'Product',
      entityId: created.id,
      action: 'CREATE',
      newValue: created,
    });

    const rules = await productRepository.findVisibilityRules(storeId);
    return visibilityPolicyService.shapeProduct(created as ProductRecord, VisibilityAudience.ADMIN, rules);
  }

  public async updateProduct(storeId: string, productId: string, actorUserId: string, dto: UpdateProductDto, role: RoleName) {
    const current = await productRepository.findAdminById(storeId, productId);

    if (!current) {
      throw new AppError(StatusCodes.NOT_FOUND, 'PRODUCT_NOT_FOUND', 'Product not found.');
    }

    if (dto.categoryId) {
      const category = await categoryRepository.findById(storeId, dto.categoryId);

      if (!category) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'INVALID_CATEGORY', 'Category does not exist for this store.');
      }
    }

    const nextSlug = dto.slug ? toSlug(dto.slug) : dto.name ? toSlug(dto.name) : current.slug;
    const nextSku = dto.sku ?? current.sku;
    const conflict = await productRepository.findConflict(storeId, nextSku, nextSlug, productId);

    if (conflict) {
      throw new AppError(
        StatusCodes.CONFLICT,
        'PRODUCT_CONFLICT',
        'A product with the same SKU or slug already exists in this store.',
      );
    }

    const updated = await productRepository.update(storeId, productId, actorUserId, {
      ...dto,
      slug: nextSlug,
      sku: nextSku,
    });

    await auditService.log({
      storeId,
      userId: actorUserId,
      entityType: 'Product',
      entityId: productId,
      action: 'UPDATE',
      oldValue: current,
      newValue: updated,
    });

    const rules = await productRepository.findVisibilityRules(storeId);
    return visibilityPolicyService.shapeProduct(updated, this.getAudience(role), rules);
  }

  public async archiveProduct(storeId: string, productId: string, actorUserId: string) {
    const current = await productRepository.findAdminById(storeId, productId);

    if (!current) {
      throw new AppError(StatusCodes.NOT_FOUND, 'PRODUCT_NOT_FOUND', 'Product not found.');
    }

    await productRepository.archive(storeId, productId, actorUserId);
    await auditService.log({
      storeId,
      userId: actorUserId,
      entityType: 'Product',
      entityId: productId,
      action: 'ARCHIVE',
      oldValue: current,
      newValue: {
        isArchived: true,
      },
    });
  }

  public async ensureRequestableProducts(storeId: string, productIds: string[]) {
    const products = await productRepository.findActivePublicProductsByIds(storeId, productIds);

    if (products.length !== productIds.length) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'UNAVAILABLE_PRODUCTS',
        'One or more shortlisted products are archived, unavailable, or no longer public.',
      );
    }

    return products;
  }
}

export const productService = new ProductService();

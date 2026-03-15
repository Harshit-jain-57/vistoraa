import { StatusCodes } from 'http-status-codes';

import type { CreateCategoryDto, UpdateCategoryDto } from './category.types';

import { AppError } from '../../common/errors/app-error';
import { omitUndefined } from '../../common/utils/object';
import { toSlug } from '../../common/utils/slug';
import { auditService } from '../audit/audit.service';
import { categoryRepository } from './category.repository';

export class CategoryService {
  public async listPublicCategories(storeId: string) {
    const categories = await categoryRepository.listPublic(storeId);

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: category.parentId,
      productCount: category._count.products,
    }));
  }

  public async listAdminCategories(storeId: string) {
    return categoryRepository.listAdmin(storeId);
  }

  public async createCategory(storeId: string, actorUserId: string, dto: CreateCategoryDto) {
    const slug = dto.slug ? toSlug(dto.slug) : toSlug(dto.name);
    const existing = await categoryRepository.findBySlug(storeId, slug);

    if (existing) {
      throw new AppError(StatusCodes.CONFLICT, 'DUPLICATE_CATEGORY_SLUG', 'Category slug already exists for this store.');
    }

    if (dto.parentId) {
      const parent = await categoryRepository.findById(storeId, dto.parentId);

      if (!parent) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'INVALID_PARENT_CATEGORY', 'Parent category does not exist.');
      }
    }

    const category = await categoryRepository.create({
      storeId,
      name: dto.name,
      slug,
      description: dto.description,
      parentId: dto.parentId,
      isActive: dto.isActive ?? true,
    });

    await auditService.log({
      storeId,
      userId: actorUserId,
      entityType: 'Category',
      entityId: category.id,
      action: 'CREATE',
      newValue: category,
    });

    return category;
  }

  public async updateCategory(storeId: string, categoryId: string, actorUserId: string, dto: UpdateCategoryDto) {
    const current = await categoryRepository.findById(storeId, categoryId);

    if (!current) {
      throw new AppError(StatusCodes.NOT_FOUND, 'CATEGORY_NOT_FOUND', 'Category not found.');
    }

    const nextSlug = dto.slug ? toSlug(dto.slug) : dto.name ? toSlug(dto.name) : undefined;

    if (nextSlug && nextSlug !== current.slug) {
      const existing = await categoryRepository.findBySlug(storeId, nextSlug);

      if (existing && existing.id !== categoryId) {
        throw new AppError(StatusCodes.CONFLICT, 'DUPLICATE_CATEGORY_SLUG', 'Category slug already exists for this store.');
      }
    }

    if (dto.parentId) {
      if (dto.parentId === categoryId) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'CATEGORY_RECURSION', 'A category cannot be its own parent.');
      }

      let cursor = await categoryRepository.findById(storeId, dto.parentId);

      while (cursor) {
        if (cursor.parentId === categoryId) {
          throw new AppError(
            StatusCodes.BAD_REQUEST,
            'CATEGORY_RECURSION',
            'This parent assignment would create a recursive category tree.',
          );
        }

        if (!cursor.parentId) {
          break;
        }

        cursor = await categoryRepository.findById(storeId, cursor.parentId);
      }
    }

    const updated = await categoryRepository.update(
      storeId,
      categoryId,
      omitUndefined({
        name: dto.name,
        slug: nextSlug,
        description: dto.description,
        parentId: dto.parentId,
        isActive: dto.isActive,
      }),
    );

    await auditService.log({
      storeId,
      userId: actorUserId,
      entityType: 'Category',
      entityId: categoryId,
      action: 'UPDATE',
      oldValue: current,
      newValue: updated,
    });

    return updated;
  }
}

export const categoryService = new CategoryService();

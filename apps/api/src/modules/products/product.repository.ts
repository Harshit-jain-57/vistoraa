import { AvailabilityStatus as PrismaAvailabilityStatus, Prisma } from '@prisma/client';

import type { PublicProductQuery, UpdateProductDto, UpsertProductDto } from './product.types';

import { omitUndefined } from '../../common/utils/object';
import { BaseRepository } from '../../common/database/base.repository';

const productInclude = {
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  images: {
    orderBy: {
      sortOrder: 'asc',
    },
  },
  tags: {
    include: {
      tag: true,
    },
  },
  attributeValues: {
    include: {
      attributeDefinition: {
        select: {
          id: true,
          name: true,
          slug: true,
          isPublic: true,
        },
      },
    },
  },
} satisfies Prisma.ProductInclude;

export type ProductRecord = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;

export class ProductRepository extends BaseRepository {
  private buildCatalogueWhere(storeId: string, query: PublicProductQuery, publicOnly: boolean): Prisma.ProductWhereInput {
    return {
      storeId,
      deletedAt: null,
      ...(publicOnly
        ? {
            isPublic: true,
            isArchived: false,
            availabilityStatus: {
              not: PrismaAvailabilityStatus.DISCONTINUED,
            },
          }
        : {}),
      ...(query.category
        ? {
            category: {
              slug: query.category,
            },
          }
        : {}),
      ...(query.featured !== undefined
        ? {
            isFeatured: query.featured,
          }
        : {}),
      ...(query.q
        ? {
            OR: [
              { name: { contains: query.q, mode: 'insensitive' } },
              { description: { contains: query.q, mode: 'insensitive' } },
              { fabric: { contains: query.q, mode: 'insensitive' } },
              { colour: { contains: query.q, mode: 'insensitive' } },
              { brand: { contains: query.q, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(query.colour
        ? {
            colour: {
              equals: query.colour,
              mode: 'insensitive',
            },
          }
        : {}),
      ...(query.fabric
        ? {
            fabric: {
              equals: query.fabric,
              mode: 'insensitive',
            },
          }
        : {}),
      ...(query.occasion
        ? {
            occasion: {
              equals: query.occasion,
              mode: 'insensitive',
            },
          }
        : {}),
    };
  }

  public listPublicCatalogue(storeId: string, query: PublicProductQuery, skip: number, take: number) {
    return this.prisma.product.findMany({
      where: this.buildCatalogueWhere(storeId, query, true),
      include: productInclude,
      skip,
      take,
      orderBy: [{ isFeatured: 'desc' }, { updatedAt: 'desc' }],
    });
  }

  public countPublicCatalogue(storeId: string, query: PublicProductQuery) {
    return this.prisma.product.count({
      where: this.buildCatalogueWhere(storeId, query, true),
    });
  }

  public findPublicBySlug(storeId: string, slug: string) {
    return this.prisma.product.findFirst({
      where: {
        storeId,
        slug,
        deletedAt: null,
        isPublic: true,
        isArchived: false,
      },
      include: productInclude,
    });
  }

  public listAdminCatalogue(storeId: string, query: PublicProductQuery, skip: number, take: number) {
    return this.prisma.product.findMany({
      where: this.buildCatalogueWhere(storeId, query, false),
      include: productInclude,
      skip,
      take,
      orderBy: [{ updatedAt: 'desc' }],
    });
  }

  public countAdminCatalogue(storeId: string, query: PublicProductQuery) {
    return this.prisma.product.count({
      where: this.buildCatalogueWhere(storeId, query, false),
    });
  }

  public findAdminById(storeId: string, productId: string) {
    return this.prisma.product.findFirst({
      where: {
        id: productId,
        storeId,
        deletedAt: null,
      },
      include: productInclude,
    });
  }

  public findVisibilityRules(storeId: string) {
    return this.prisma.visibilityRule.findMany({
      where: {
        storeId,
      },
    });
  }

  public findConflict(storeId: string, sku: string, slug: string, excludeId?: string) {
    const where: Prisma.ProductWhereInput = {
      storeId,
      deletedAt: null,
      OR: [{ sku }, { slug }],
    };

    if (excludeId) {
      where.id = {
        not: excludeId,
      };
    }

    return this.prisma.product.findFirst({
      where,
      select: {
        id: true,
        sku: true,
        slug: true,
      },
    });
  }

  public findActivePublicProductsByIds(storeId: string, productIds: string[]) {
    return this.prisma.product.findMany({
      where: {
        storeId,
        id: {
          in: productIds,
        },
        deletedAt: null,
        isPublic: true,
        isArchived: false,
        availabilityStatus: {
          notIn: [PrismaAvailabilityStatus.DISCONTINUED, PrismaAvailabilityStatus.OUT_OF_STOCK],
        },
      },
      include: productInclude,
    });
  }

  public create(storeId: string, actorUserId: string, dto: UpsertProductDto) {
    const imageCreates = dto.images?.map((image, index) => ({
      imageUrl: image.imageUrl,
      altText: image.altText ?? null,
      sortOrder: image.sortOrder ?? index,
      isPrimary: image.isPrimary ?? index === 0,
    }));

    return this.prisma.product.create({
      data: {
        storeId,
        categoryId: dto.categoryId,
        name: dto.name,
        slug: dto.slug!,
        description: dto.description,
        sku: dto.sku,
        publicCode: dto.publicCode,
        fabric: dto.fabric,
        colour: dto.colour,
        pattern: dto.pattern,
        occasion: dto.occasion,
        brand: dto.brand,
        visiblePrice: dto.visiblePrice,
        internalCost: dto.internalCost,
        margin: dto.margin,
        supplierName: dto.supplierName,
        stockQty: dto.stockQty ?? 0,
        availabilityStatus: dto.availabilityStatus as unknown as PrismaAvailabilityStatus | undefined,
        isFeatured: dto.isFeatured ?? false,
        isPublic: dto.isPublic ?? true,
        createdById: actorUserId,
        updatedById: actorUserId,
        images: imageCreates
          ? {
              create: imageCreates,
            }
          : undefined,
        tags: dto.tagIds
          ? {
              create: dto.tagIds.map((tagId) => ({
                tagId,
              })),
            }
          : undefined,
        attributeValues: dto.attributes
          ? {
              create: dto.attributes.map((attribute) => ({
                attributeDefinitionId: attribute.attributeDefinitionId,
                value: attribute.value,
              })),
            }
          : undefined,
      },
      include: productInclude,
    });
  }

  public update(_storeId: string, productId: string, actorUserId: string, dto: UpdateProductDto) {
    const data: Prisma.ProductUpdateInput = omitUndefined({
      category:
        dto.categoryId !== undefined ? (dto.categoryId ? { connect: { id: dto.categoryId } } : { disconnect: true }) : undefined,
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      sku: dto.sku,
      publicCode: dto.publicCode,
      fabric: dto.fabric,
      colour: dto.colour,
      pattern: dto.pattern,
      occasion: dto.occasion,
      brand: dto.brand,
      visiblePrice: dto.visiblePrice,
      internalCost: dto.internalCost,
      margin: dto.margin,
      supplierName: dto.supplierName,
      stockQty: dto.stockQty,
      availabilityStatus: dto.availabilityStatus as unknown as PrismaAvailabilityStatus | undefined,
      isFeatured: dto.isFeatured,
      isPublic: dto.isPublic,
      updatedBy: {
        connect: {
          id: actorUserId,
        },
      },
    });

    if (dto.images) {
      data.images = {
        deleteMany: {},
        create: dto.images.map((image, index) => ({
          imageUrl: image.imageUrl,
          altText: image.altText ?? null,
          sortOrder: image.sortOrder ?? index,
          isPrimary: image.isPrimary ?? index === 0,
        })),
      };
    }

    if (dto.tagIds) {
      data.tags = {
        deleteMany: {},
        create: dto.tagIds.map((tagId) => ({
          tagId,
        })),
      };
    }

    if (dto.attributes) {
      data.attributeValues = {
        deleteMany: {},
        create: dto.attributes.map((attribute) => ({
          attributeDefinitionId: attribute.attributeDefinitionId,
          value: attribute.value,
        })),
      };
    }

    return this.prisma.product.update({
      where: {
        id: productId,
      },
      data,
      include: productInclude,
    });
  }

  public archive(_storeId: string, productId: string, actorUserId: string) {
    return this.prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        isArchived: true,
        deletedAt: new Date(),
        updatedById: actorUserId,
      },
    });
  }
}

export const productRepository = new ProductRepository();

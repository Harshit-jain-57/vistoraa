import { BaseRepository } from '../../common/database/base.repository';

export class CategoryRepository extends BaseRepository {
  public listPublic(storeId: string) {
    return this.prisma.category.findMany({
      where: {
        storeId,
        isActive: true,
        deletedAt: null,
      },
      orderBy: [
        {
          parentId: 'asc',
        },
        {
          name: 'asc',
        },
      ],
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
  }

  public listAdmin(storeId: string) {
    return this.prisma.category.findMany({
      where: {
        storeId,
        deletedAt: null,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
  }

  public findById(storeId: string, categoryId: string) {
    return this.prisma.category.findFirst({
      where: {
        id: categoryId,
        storeId,
        deletedAt: null,
      },
    });
  }

  public create(input: {
    storeId: string;
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
    isActive?: boolean;
  }) {
    return this.prisma.category.create({
      data: input,
    });
  }

  public update(_storeId: string, categoryId: string, data: {
    name?: string;
    slug?: string;
    description?: string;
    parentId?: string | null;
    isActive?: boolean;
  }) {
    return this.prisma.category.update({
      where: {
        id: categoryId,
      },
      data,
    });
  }

  public findBySlug(storeId: string, slug: string) {
    return this.prisma.category.findFirst({
      where: {
        storeId,
        slug,
        deletedAt: null,
      },
    });
  }
}

export const categoryRepository = new CategoryRepository();

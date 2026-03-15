import { BaseRepository } from '../../common/database/base.repository';

export class AttributeRepository extends BaseRepository {
  public list(storeId: string) {
    return this.prisma.attributeDefinition.findMany({
      where: { storeId },
      orderBy: { name: 'asc' },
    });
  }

  public findById(storeId: string, id: string) {
    return this.prisma.attributeDefinition.findFirst({
      where: { id, storeId },
    });
  }

  public findBySlug(storeId: string, slug: string) {
    return this.prisma.attributeDefinition.findFirst({
      where: { storeId, slug },
    });
  }

  public create(input: {
    storeId: string;
    name: string;
    slug: string;
    dataType: string;
    isFilterable?: boolean;
    isPublic?: boolean;
  }) {
    return this.prisma.attributeDefinition.create({
      data: input as never,
    });
  }

  public update(id: string, data: {
    name?: string;
    slug?: string;
    dataType?: string;
    isFilterable?: boolean;
    isPublic?: boolean;
  }) {
    return this.prisma.attributeDefinition.update({
      where: { id },
      data: data as never,
    });
  }
}

export const attributeRepository = new AttributeRepository();

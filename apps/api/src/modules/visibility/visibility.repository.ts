import { BaseRepository } from '../../common/database/base.repository';

export class VisibilityRepository extends BaseRepository {
  public list(storeId: string) {
    return this.prisma.visibilityRule.findMany({
      where: { storeId },
      orderBy: { fieldName: 'asc' },
    });
  }

  public findById(storeId: string, id: string) {
    return this.prisma.visibilityRule.findFirst({
      where: { id, storeId },
    });
  }

  public findByFieldName(storeId: string, fieldName: string) {
    return this.prisma.visibilityRule.findFirst({
      where: { storeId, fieldName },
    });
  }

  public create(input: {
    storeId: string;
    fieldName: string;
    isPublic?: boolean;
    visibleToStaff?: boolean;
    visibleToAdminOnly?: boolean;
  }) {
    return this.prisma.visibilityRule.create({ data: input });
  }

  public update(id: string, data: {
    fieldName?: string;
    isPublic?: boolean;
    visibleToStaff?: boolean;
    visibleToAdminOnly?: boolean;
  }) {
    return this.prisma.visibilityRule.update({
      where: { id },
      data,
    });
  }
}

export const visibilityRepository = new VisibilityRepository();

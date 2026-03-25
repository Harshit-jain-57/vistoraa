import { BaseRepository } from '../../common/database/base.repository';

export class StoreRepository extends BaseRepository {
  public findById(storeId: string) {
    return this.prisma.store.findUnique({
      where: {
        id: storeId,
      },
    });
  }

  public update(storeId: string, data: {
    name?: string;
    logoUrl?: string | null;
    themeConfig?: object;
    contactDetails?: object;
    address?: object;
    isActive?: boolean;
  }) {
    return this.prisma.store.update({
      where: {
        id: storeId,
      },
      data,
    });
  }
}

export const storeRepository = new StoreRepository();

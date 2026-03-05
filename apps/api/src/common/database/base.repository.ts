import { prisma } from '../../database/prisma';

export abstract class BaseRepository {
  protected readonly prisma = prisma;

  protected withStoreScope<T extends object>(storeId: string, where: T = {} as T): T & { storeId: string } {
    return {
      ...where,
      storeId,
    };
  }
}

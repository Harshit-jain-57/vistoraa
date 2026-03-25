import { StatusCodes } from 'http-status-codes';

import type { UpdateStoreDto } from './store.types';

import { AppError } from '../../common/errors/app-error';
import { omitUndefined } from '../../common/utils/object';
import { auditService } from '../audit/audit.service';
import { storeRepository } from './store.repository';

export class StoreService {
  public async getStoreSettings(storeId: string) {
    const store = await storeRepository.findById(storeId);

    if (!store) {
      throw new AppError(StatusCodes.NOT_FOUND, 'STORE_NOT_FOUND', 'Store not found.');
    }

    return store;
  }

  public async updateStoreSettings(storeId: string, actorUserId: string, dto: UpdateStoreDto) {
    const current = await storeRepository.findById(storeId);

    if (!current) {
      throw new AppError(StatusCodes.NOT_FOUND, 'STORE_NOT_FOUND', 'Store not found.');
    }

    const updated = await storeRepository.update(
      storeId,
      omitUndefined({
        name: dto.name,
        logoUrl: dto.logoUrl,
        themeConfig: dto.themeConfig,
        contactDetails: dto.contactDetails,
        address: dto.address,
        isActive: dto.isActive,
      }),
    );

    await auditService.log({
      storeId,
      userId: actorUserId,
      entityType: 'Store',
      entityId: storeId,
      action: 'UPDATE',
      oldValue: current,
      newValue: updated,
    });

    return updated;
  }
}

export const storeService = new StoreService();

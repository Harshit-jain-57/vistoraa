import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BaseResponseBuilder } from '../../common/http/base-response.builder';
import { storeService } from './store.service';

export class StoreController {
  public async getStore(request: Request, response: Response): Promise<Response> {
    const store = await storeService.getStoreSettings(request.storeContext!.id);
    return response.status(StatusCodes.OK).json(BaseResponseBuilder.success(store, 'Store fetched successfully'));
  }

  public async updateStore(request: Request, response: Response): Promise<Response> {
    const store = await storeService.updateStoreSettings(request.storeContext!.id, request.auth!.userId, request.body);
    return response.status(StatusCodes.OK).json(BaseResponseBuilder.success(store, 'Store updated successfully'));
  }
}

export const storeController = new StoreController();

import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BaseResponseBuilder } from '../../common/http/base-response.builder';
import { shortlistService } from './shortlist.service';

export class ShortlistController {
  public async list(request: Request, response: Response): Promise<Response> {
    const shortlist = await shortlistService.listShortlist(request.storeContext!.id, request.query.sessionToken?.toString());
    return response.status(StatusCodes.OK).json(BaseResponseBuilder.success(shortlist, 'Shortlist fetched successfully'));
  }

  public async addItem(request: Request, response: Response): Promise<Response> {
    const shortlist = await shortlistService.addItem(request.storeContext!.id, request.body);
    return response.status(StatusCodes.CREATED).json(BaseResponseBuilder.success(shortlist, 'Shortlist updated successfully'));
  }

  public async removeItem(request: Request, response: Response): Promise<Response> {
    const shortlist = await shortlistService.removeItem(
      request.storeContext!.id,
      request.query.sessionToken?.toString() ?? '',
      request.params.id as string,
    );
    return response.status(StatusCodes.OK).json(BaseResponseBuilder.success(shortlist, 'Shortlist updated successfully'));
  }
}

export const shortlistController = new ShortlistController();

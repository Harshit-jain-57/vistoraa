import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BaseResponseBuilder } from '../../common/http/base-response.builder';
import { visibilityService } from './visibility.service';

export class VisibilityController {
  public async list(request: Request, response: Response): Promise<Response> {
    const rules = await visibilityService.list(request.storeContext!.id);
    return response.status(StatusCodes.OK).json(BaseResponseBuilder.success(rules, 'Visibility rules fetched successfully'));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const rule = await visibilityService.create(request.storeContext!.id, request.auth!.userId, request.body);
    return response.status(StatusCodes.CREATED).json(BaseResponseBuilder.success(rule, 'Visibility rule created successfully'));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const rule = await visibilityService.update(
      request.storeContext!.id,
      request.params.id as string,
      request.auth!.userId,
      request.body,
    );
    return response.status(StatusCodes.OK).json(BaseResponseBuilder.success(rule, 'Visibility rule updated successfully'));
  }
}

export const visibilityController = new VisibilityController();

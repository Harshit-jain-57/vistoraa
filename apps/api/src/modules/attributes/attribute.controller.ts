import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BaseResponseBuilder } from '../../common/http/base-response.builder';
import { attributeService } from './attribute.service';

export class AttributeController {
  public async list(request: Request, response: Response): Promise<Response> {
    const attributes = await attributeService.list(request.storeContext!.id);
    return response.status(StatusCodes.OK).json(BaseResponseBuilder.success(attributes, 'Attributes fetched successfully'));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const attribute = await attributeService.create(request.storeContext!.id, request.auth!.userId, request.body);
    return response.status(StatusCodes.CREATED).json(BaseResponseBuilder.success(attribute, 'Attribute created successfully'));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const attribute = await attributeService.update(
      request.storeContext!.id,
      request.params.id as string,
      request.auth!.userId,
      request.body,
    );
    return response.status(StatusCodes.OK).json(BaseResponseBuilder.success(attribute, 'Attribute updated successfully'));
  }
}

export const attributeController = new AttributeController();

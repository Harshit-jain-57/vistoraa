import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BaseResponseBuilder } from '../../common/http/base-response.builder';
import { tagService } from './tag.service';

export class TagController {
  public async list(request: Request, response: Response): Promise<Response> {
    const tags = await tagService.list(request.storeContext!.id);
    return response.status(StatusCodes.OK).json(BaseResponseBuilder.success(tags, 'Tags fetched successfully'));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const tag = await tagService.create(request.storeContext!.id, request.auth!.userId, request.body);
    return response.status(StatusCodes.CREATED).json(BaseResponseBuilder.success(tag, 'Tag created successfully'));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const tag = await tagService.update(request.storeContext!.id, request.params.id as string, request.auth!.userId, request.body);
    return response.status(StatusCodes.OK).json(BaseResponseBuilder.success(tag, 'Tag updated successfully'));
  }
}

export const tagController = new TagController();

import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BaseResponseBuilder } from '../../common/http/base-response.builder';
import { mediaService } from './media.service';

export class MediaController {
  public async upload(request: Request, response: Response): Promise<Response> {
    const result = await mediaService.uploadImage(request.file);
    return response.status(StatusCodes.CREATED).json(BaseResponseBuilder.success(result, 'Media uploaded successfully'));
  }
}

export const mediaController = new MediaController();

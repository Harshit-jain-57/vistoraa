import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BaseResponseBuilder } from '../../common/http/base-response.builder';
import { requestService } from './request.service';

export class RequestController {
  public async create(request: Request, response: Response): Promise<Response> {
    const result = await requestService.submitRequest(request.storeContext!.id, request.body);
    return response
      .status(StatusCodes.CREATED)
      .json(BaseResponseBuilder.success(result, 'Showroom request submitted successfully'));
  }

  public async listAdmin(request: Request, response: Response): Promise<Response> {
    const result = await requestService.listAdminRequests(request.storeContext!.id, request.query as never);
    return response
      .status(StatusCodes.OK)
      .json(BaseResponseBuilder.paginated(result.data, result.pagination, 'Requests fetched successfully'));
  }

  public async updateStatus(request: Request, response: Response): Promise<Response> {
    const result = await requestService.updateStatus(
      request.storeContext!.id,
      request.params.id as string,
      request.auth!.userId,
      request.body,
    );
    return response.status(StatusCodes.OK).json(BaseResponseBuilder.success(result, 'Request updated successfully'));
  }
}

export const requestController = new RequestController();

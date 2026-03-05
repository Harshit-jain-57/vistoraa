import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BaseResponseBuilder } from '../http/base-response.builder';

export const notFoundMiddleware = (request: Request, response: Response): Response => {
  return response
    .status(StatusCodes.NOT_FOUND)
    .json(BaseResponseBuilder.error('NOT_FOUND', `No route found for ${request.method} ${request.path}.`));
};

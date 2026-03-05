import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';

import { logger } from '../../config/logger';
import { AppError } from '../errors/app-error';
import { BaseResponseBuilder } from '../http/base-response.builder';

export const errorMiddleware = (
  error: unknown,
  request: Request,
  response: Response,
  _next: NextFunction,
): Response => {
  if (error instanceof ZodError) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .json(BaseResponseBuilder.error('VALIDATION_ERROR', 'The request payload is invalid.', error.flatten()));
  }

  if (error instanceof AppError) {
    return response.status(error.statusCode).json(BaseResponseBuilder.error(error.code, error.message, error.details));
  }

  logger.error(
    {
      err: error,
      path: request.path,
      requestId: request.requestId,
    },
    'Unhandled API error',
  );

  return response
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(BaseResponseBuilder.error('INTERNAL_SERVER_ERROR', 'Something went wrong while processing the request.'));
};

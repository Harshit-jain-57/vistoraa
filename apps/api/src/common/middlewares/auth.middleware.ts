import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '../errors/app-error';
import { jwtService } from '../security/jwt.service';

export const authenticate = (request: Request, _response: Response, next: NextFunction): void => {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    return next(new AppError(StatusCodes.UNAUTHORIZED, 'AUTH_REQUIRED', 'A valid bearer token is required.'));
  }

  const token = authorization.replace('Bearer ', '').trim();

  try {
    request.auth = jwtService.verifyAccessToken(token);
    return next();
  } catch (error) {
    return next(new AppError(StatusCodes.UNAUTHORIZED, 'INVALID_TOKEN', 'The access token is invalid or expired.', error));
  }
};

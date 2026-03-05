import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import type { RoleName } from '@vistora/shared';

import { AppError } from '../errors/app-error';

export const authorize =
  (allowedRoles: RoleName[]) =>
  (request: Request, _response: Response, next: NextFunction): void => {
    if (!request.auth) {
      return next(new AppError(StatusCodes.UNAUTHORIZED, 'AUTH_REQUIRED', 'Authentication is required.'));
    }

    if (!allowedRoles.includes(request.auth.role)) {
      return next(
        new AppError(StatusCodes.FORBIDDEN, 'FORBIDDEN', 'You do not have permission to access this resource.'),
      );
    }

    return next();
  };

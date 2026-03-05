import crypto from 'node:crypto';

import type { NextFunction, Request, Response } from 'express';

export const requestContextMiddleware = (request: Request, _response: Response, next: NextFunction): void => {
  request.requestId = request.headers['x-request-id']?.toString() ?? crypto.randomUUID();
  return next();
};

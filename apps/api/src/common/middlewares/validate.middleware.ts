import type { NextFunction, Request, Response } from 'express';
import type { AnyZodObject } from 'zod';

export const validate =
  (schema: AnyZodObject) =>
  (request: Request, _response: Response, next: NextFunction): void => {
    const parsed = schema.parse({
      body: request.body,
      query: request.query,
      params: request.params,
    });

    request.body = parsed.body;
    request.query = parsed.query;
    request.params = parsed.params;

    return next();
  };

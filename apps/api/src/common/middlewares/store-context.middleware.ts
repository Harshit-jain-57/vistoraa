import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { env } from '../../config/env';
import { prisma } from '../../database/prisma';
import { AppError } from '../errors/app-error';

export const storeContextMiddleware = async (
  request: Request,
  _response: Response,
  next: NextFunction,
): Promise<void> => {
  const storeSlug = request.headers['x-store-slug']?.toString() ?? env.DEFAULT_STORE_SLUG;
  const store = await prisma.store.findFirst({
    where: {
      slug: storeSlug,
      isActive: true,
    },
    select: {
      id: true,
      slug: true,
      name: true,
    },
  });

  if (!store) {
    return next(new AppError(StatusCodes.NOT_FOUND, 'STORE_NOT_FOUND', `Store '${storeSlug}' was not found.`));
  }

  request.storeContext = store;
  return next();
};

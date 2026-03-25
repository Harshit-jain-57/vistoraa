import { Router } from 'express';

import { validate } from '../../common/middlewares/validate.middleware';
import { asyncHandler } from '../../common/utils/async-handler';
import { shortlistController } from './shortlist.controller';
import { addShortlistItemSchema, removeShortlistItemSchema, shortlistQuerySchema } from './shortlist.validation';

export const shortlistRouter = Router();

shortlistRouter.get('/', validate(shortlistQuerySchema), asyncHandler((request, response) => shortlistController.list(request, response)));
shortlistRouter.post(
  '/items',
  validate(addShortlistItemSchema),
  asyncHandler((request, response) => shortlistController.addItem(request, response)),
);
shortlistRouter.delete(
  '/items/:id',
  validate(removeShortlistItemSchema),
  asyncHandler((request, response) => shortlistController.removeItem(request, response)),
);

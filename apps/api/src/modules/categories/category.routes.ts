import { Router } from 'express';

import { RoleName } from '@vistora/shared';

import { authenticate } from '../../common/middlewares/auth.middleware';
import { authorize } from '../../common/middlewares/rbac.middleware';
import { validate } from '../../common/middlewares/validate.middleware';
import { asyncHandler } from '../../common/utils/async-handler';
import { categoryController } from './category.controller';
import { createCategorySchema, publicCategoryListSchema, updateCategorySchema } from './category.validation';

export const publicCategoryRouter = Router();
export const adminCategoryRouter = Router();

publicCategoryRouter.get(
  '/',
  validate(publicCategoryListSchema),
  asyncHandler((request, response) => categoryController.listPublic(request, response)),
);

adminCategoryRouter.use(authenticate, authorize([RoleName.OWNER, RoleName.ADMIN, RoleName.STAFF]));
adminCategoryRouter.get('/', asyncHandler((request, response) => categoryController.listAdmin(request, response)));
adminCategoryRouter.post(
  '/',
  authorize([RoleName.OWNER, RoleName.ADMIN]),
  validate(createCategorySchema),
  asyncHandler((request, response) => categoryController.create(request, response)),
);
adminCategoryRouter.patch(
  '/:id',
  authorize([RoleName.OWNER, RoleName.ADMIN]),
  validate(updateCategorySchema),
  asyncHandler((request, response) => categoryController.update(request, response)),
);

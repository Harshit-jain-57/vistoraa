import { Router } from 'express';

import { RoleName } from '@vistora/shared';

import { authenticate } from '../../common/middlewares/auth.middleware';
import { authorize } from '../../common/middlewares/rbac.middleware';
import { validate } from '../../common/middlewares/validate.middleware';
import { asyncHandler } from '../../common/utils/async-handler';
import { productController } from './product.controller';
import {
  adminProductListSchema,
  createProductSchema,
  productIdParamSchema,
  productSlugParamSchema,
  publicProductListSchema,
  updateProductSchema,
} from './product.validation';

export const publicProductRouter = Router();
export const adminProductRouter = Router();

publicProductRouter.get(
  '/',
  validate(publicProductListSchema),
  asyncHandler((request, response) => productController.listPublic(request, response)),
);
publicProductRouter.get(
  '/:slug',
  validate(productSlugParamSchema),
  asyncHandler((request, response) => productController.getPublicBySlug(request, response)),
);

adminProductRouter.use(authenticate, authorize([RoleName.OWNER, RoleName.ADMIN, RoleName.STAFF]));
adminProductRouter.get(
  '/',
  validate(adminProductListSchema),
  asyncHandler((request, response) => productController.listAdmin(request, response)),
);
adminProductRouter.post(
  '/',
  authorize([RoleName.OWNER, RoleName.ADMIN]),
  validate(createProductSchema),
  asyncHandler((request, response) => productController.create(request, response)),
);
adminProductRouter.patch(
  '/:id',
  authorize([RoleName.OWNER, RoleName.ADMIN]),
  validate(updateProductSchema),
  asyncHandler((request, response) => productController.update(request, response)),
);
adminProductRouter.delete(
  '/:id',
  authorize([RoleName.OWNER, RoleName.ADMIN]),
  validate(productIdParamSchema),
  asyncHandler((request, response) => productController.archive(request, response)),
);

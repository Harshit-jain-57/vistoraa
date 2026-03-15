import { Router } from 'express';

import { RoleName } from '@vistora/shared';

import { authenticate } from '../../common/middlewares/auth.middleware';
import { authorize } from '../../common/middlewares/rbac.middleware';
import { validate } from '../../common/middlewares/validate.middleware';
import { asyncHandler } from '../../common/utils/async-handler';
import { attributeController } from './attribute.controller';
import { createAttributeSchema, updateAttributeSchema } from './attribute.validation';

export const attributeRouter = Router();

attributeRouter.use(authenticate, authorize([RoleName.OWNER, RoleName.ADMIN]));
attributeRouter.get('/', asyncHandler((request, response) => attributeController.list(request, response)));
attributeRouter.post(
  '/',
  validate(createAttributeSchema),
  asyncHandler((request, response) => attributeController.create(request, response)),
);
attributeRouter.patch(
  '/:id',
  validate(updateAttributeSchema),
  asyncHandler((request, response) => attributeController.update(request, response)),
);

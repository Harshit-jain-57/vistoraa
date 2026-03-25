import { Router } from 'express';

import { RoleName } from '@vistora/shared';

import { authenticate } from '../../common/middlewares/auth.middleware';
import { authorize } from '../../common/middlewares/rbac.middleware';
import { validate } from '../../common/middlewares/validate.middleware';
import { asyncHandler } from '../../common/utils/async-handler';
import { visibilityController } from './visibility.controller';
import { createVisibilityRuleSchema, updateVisibilityRuleSchema } from './visibility.validation';

export const visibilityRouter = Router();

visibilityRouter.use(authenticate, authorize([RoleName.OWNER, RoleName.ADMIN]));
visibilityRouter.get('/', asyncHandler((request, response) => visibilityController.list(request, response)));
visibilityRouter.post(
  '/',
  validate(createVisibilityRuleSchema),
  asyncHandler((request, response) => visibilityController.create(request, response)),
);
visibilityRouter.patch(
  '/:id',
  validate(updateVisibilityRuleSchema),
  asyncHandler((request, response) => visibilityController.update(request, response)),
);

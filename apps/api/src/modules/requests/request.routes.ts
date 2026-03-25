import { Router } from 'express';

import { RoleName } from '@vistora/shared';

import { authenticate } from '../../common/middlewares/auth.middleware';
import { authorize } from '../../common/middlewares/rbac.middleware';
import { validate } from '../../common/middlewares/validate.middleware';
import { asyncHandler } from '../../common/utils/async-handler';
import { requestController } from './request.controller';
import { adminRequestListSchema, createShowroomRequestSchema, updateRequestStatusSchema } from './request.validation';

export const publicRequestRouter = Router();
export const adminRequestRouter = Router();

publicRequestRouter.post(
  '/',
  validate(createShowroomRequestSchema),
  asyncHandler((request, response) => requestController.create(request, response)),
);

adminRequestRouter.use(authenticate, authorize([RoleName.OWNER, RoleName.ADMIN, RoleName.STAFF]));
adminRequestRouter.get(
  '/',
  validate(adminRequestListSchema),
  asyncHandler((request, response) => requestController.listAdmin(request, response)),
);
adminRequestRouter.patch(
  '/:id/status',
  validate(updateRequestStatusSchema),
  asyncHandler((request, response) => requestController.updateStatus(request, response)),
);

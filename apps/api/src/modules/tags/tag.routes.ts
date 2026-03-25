import { Router } from 'express';

import { RoleName } from '@vistora/shared';

import { authenticate } from '../../common/middlewares/auth.middleware';
import { authorize } from '../../common/middlewares/rbac.middleware';
import { validate } from '../../common/middlewares/validate.middleware';
import { asyncHandler } from '../../common/utils/async-handler';
import { tagController } from './tag.controller';
import { createTagSchema, updateTagSchema } from './tag.validation';

export const tagRouter = Router();

tagRouter.use(authenticate, authorize([RoleName.OWNER, RoleName.ADMIN]));
tagRouter.get('/', asyncHandler((request, response) => tagController.list(request, response)));
tagRouter.post('/', validate(createTagSchema), asyncHandler((request, response) => tagController.create(request, response)));
tagRouter.patch('/:id', validate(updateTagSchema), asyncHandler((request, response) => tagController.update(request, response)));

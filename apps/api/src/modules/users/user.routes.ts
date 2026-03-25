import { Router } from 'express';

import { RoleName } from '@vistora/shared';

import { authenticate } from '../../common/middlewares/auth.middleware';
import { authorize } from '../../common/middlewares/rbac.middleware';
import { validate } from '../../common/middlewares/validate.middleware';
import { asyncHandler } from '../../common/utils/async-handler';
import { userController } from './user.controller';
import { createUserSchema } from './user.validation';

export const userRouter = Router();

userRouter.use(authenticate, authorize([RoleName.OWNER, RoleName.ADMIN]));

userRouter.get('/', asyncHandler((request, response) => userController.listUsers(request, response)));
userRouter.post('/', validate(createUserSchema), asyncHandler((request, response) => userController.createUser(request, response)));

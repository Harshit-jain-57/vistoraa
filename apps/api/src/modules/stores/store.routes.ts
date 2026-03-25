import { Router } from 'express';

import { RoleName } from '@vistora/shared';

import { authenticate } from '../../common/middlewares/auth.middleware';
import { authorize } from '../../common/middlewares/rbac.middleware';
import { validate } from '../../common/middlewares/validate.middleware';
import { asyncHandler } from '../../common/utils/async-handler';
import { storeController } from './store.controller';
import { updateStoreSchema } from './store.validation';

export const storeRouter = Router();

storeRouter.use(authenticate, authorize([RoleName.OWNER, RoleName.ADMIN]));

storeRouter.get('/', asyncHandler((request, response) => storeController.getStore(request, response)));
storeRouter.patch('/', validate(updateStoreSchema), asyncHandler((request, response) => storeController.updateStore(request, response)));

import { Router } from 'express';

import { asyncHandler } from '../../common/utils/async-handler';
import { healthController } from './health.controller';

export const healthRouter = Router();

healthRouter.get('/', asyncHandler((request, response) => healthController.check(request, response)));

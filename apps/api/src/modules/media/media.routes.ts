import { Router } from 'express';
import multer from 'multer';

import { RoleName } from '@vistora/shared';

import { env } from '../../config/env';
import { authenticate } from '../../common/middlewares/auth.middleware';
import { authorize } from '../../common/middlewares/rbac.middleware';
import { asyncHandler } from '../../common/utils/async-handler';
import { mediaController } from './media.controller';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.MAX_UPLOAD_SIZE_MB * 1024 * 1024,
  },
});

export const mediaRouter = Router();

mediaRouter.use(authenticate, authorize([RoleName.OWNER, RoleName.ADMIN]));
mediaRouter.post('/upload', upload.single('file'), asyncHandler((request, response) => mediaController.upload(request, response)));

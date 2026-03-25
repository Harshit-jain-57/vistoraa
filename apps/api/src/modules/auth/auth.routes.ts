import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import { validate } from '../../common/middlewares/validate.middleware';
import { asyncHandler } from '../../common/utils/async-handler';
import { authController } from './auth.controller';
import { loginSchema, refreshSchema } from './auth.validation';

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1_000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRouter = Router();

authRouter.post('/login', authLimiter, validate(loginSchema), asyncHandler((request, response) => authController.login(request, response)));
authRouter.post('/refresh', authLimiter, validate(refreshSchema), asyncHandler((request, response) => authController.refresh(request, response)));
authRouter.post('/logout', authLimiter, validate(refreshSchema), asyncHandler((request, response) => authController.logout(request, response)));

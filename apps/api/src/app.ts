import crypto from 'node:crypto';

import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';

import { env } from './config/env';
import { logger } from './config/logger';
import { setupSwagger } from './config/swagger';
import { errorMiddleware } from './common/middlewares/error.middleware';
import { notFoundMiddleware } from './common/middlewares/not-found.middleware';
import { requestContextMiddleware } from './common/middlewares/request-context.middleware';
import { router } from './routes';

export const createApp = () => {
  const app = express();

  app.use(
    pinoHttp({
      logger,
      genReqId: (request) => request.headers['x-request-id']?.toString() ?? crypto.randomUUID(),
    }),
  );
  app.use(requestContextMiddleware);
  app.use(helmet());
  app.use(
    cors({
      origin: env.WEB_URL,
      credentials: true,
    }),
  );
  app.use(compression());
  app.use(cookieParser());
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use('/uploads', express.static(env.UPLOAD_DIR));

  setupSwagger(app);
  app.use(router);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
};

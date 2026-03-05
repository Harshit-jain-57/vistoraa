import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';

const app = createApp();

app.listen(env.API_PORT, () => {
  logger.info({ port: env.API_PORT }, 'Vistora API is running');
});

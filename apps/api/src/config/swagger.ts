import path from 'node:path';

import type { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

export const setupSwagger = (app: Express): void => {
  const openApiPath = path.resolve(__dirname, '..', '..', 'openapi', 'v1.yaml');
  const swaggerDocument = YAML.load(openApiPath);

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

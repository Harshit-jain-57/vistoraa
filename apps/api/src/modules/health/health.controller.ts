import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { prisma } from '../../database/prisma';
import { BaseResponseBuilder } from '../../common/http/base-response.builder';

export class HealthController {
  public async check(_request: Request, response: Response): Promise<Response> {
    await prisma.$queryRaw`SELECT 1`;

    return response.status(StatusCodes.OK).json(
      BaseResponseBuilder.success(
        {
          status: 'ok',
          database: 'reachable',
        },
        'Service healthy',
      ),
    );
  }
}

export const healthController = new HealthController();

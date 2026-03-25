import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { env } from '../../config/env';
import { BaseResponseBuilder } from '../../common/http/base-response.builder';
import { authService } from './auth.service';

export class AuthController {
  public async login(request: Request, response: Response): Promise<Response> {
    const result = await authService.login(request.storeContext!.id, request.body);

    response.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1_000,
    });

    return response.status(StatusCodes.OK).json(BaseResponseBuilder.success(result, 'Login successful'));
  }

  public async refresh(request: Request, response: Response): Promise<Response> {
    const rawRefreshToken = request.body.refreshToken ?? request.cookies.refreshToken;
    const result = await authService.refresh(rawRefreshToken);

    response.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1_000,
    });

    return response.status(StatusCodes.OK).json(BaseResponseBuilder.success(result, 'Token refreshed successfully'));
  }

  public async logout(request: Request, response: Response): Promise<Response> {
    await authService.logout(request.body.refreshToken ?? request.cookies.refreshToken);
    response.clearCookie('refreshToken');

    return response.status(StatusCodes.OK).json(BaseResponseBuilder.success(null, 'Logout successful'));
  }
}

export const authController = new AuthController();

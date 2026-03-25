import { StatusCodes } from 'http-status-codes';

import type { AuthTokenPayload } from '../../common/security/jwt.service';
import type { LoginDto } from './auth.types';

import { AppError } from '../../common/errors/app-error';
import { jwtService } from '../../common/security/jwt.service';
import { passwordService } from '../../common/security/password.service';
import { durationToMilliseconds } from '../../common/utils/duration';
import { sha256 } from '../../common/utils/hash';
import { env } from '../../config/env';
import { auditService } from '../audit/audit.service';
import { userRepository } from '../users/user.repository';
import { authRepository } from './auth.repository';

export class AuthService {
  private buildPayload(user: {
    id: string;
    storeId: string;
    email: string;
    role: {
      name: string;
    };
  }): AuthTokenPayload {
    return {
      userId: user.id,
      storeId: user.storeId,
      email: user.email,
      role: user.role.name as AuthTokenPayload['role'],
    };
  }

  public async login(storeId: string, dto: LoginDto) {
    const user = await userRepository.findByEmail(storeId, dto.email);

    if (!user || user.deletedAt || !user.isActive) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'INVALID_CREDENTIALS', 'Invalid email or password.');
    }

    const isPasswordValid = await passwordService.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'INVALID_CREDENTIALS', 'Invalid email or password.');
    }

    const payload = this.buildPayload(user);
    const accessToken = jwtService.generateAccessToken(payload);
    const refreshToken = jwtService.generateRefreshToken(payload);

    await authRepository.createRefreshToken(
      user.id,
      sha256(refreshToken),
      new Date(Date.now() + durationToMilliseconds(env.REFRESH_TOKEN_TTL)),
    );
    await userRepository.updateLastLogin(user.id);
    await auditService.log({
      storeId,
      userId: user.id,
      entityType: 'AuthSession',
      entityId: user.id,
      action: 'LOGIN',
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
    };
  }

  public async refresh(rawRefreshToken: string) {
    let payload: AuthTokenPayload;

    try {
      payload = jwtService.verifyRefreshToken(rawRefreshToken);
    } catch (error) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'INVALID_REFRESH_TOKEN', 'Refresh token is invalid or expired.', error);
    }

    const refreshTokenRecord = await authRepository.findRefreshToken(sha256(rawRefreshToken));

    if (!refreshTokenRecord || refreshTokenRecord.user.deletedAt || !refreshTokenRecord.user.isActive) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'INVALID_REFRESH_TOKEN', 'Refresh token is invalid or revoked.');
    }

    if (refreshTokenRecord.expiresAt.getTime() < Date.now()) {
      await authRepository.revokeRefreshToken(refreshTokenRecord.id);
      throw new AppError(StatusCodes.UNAUTHORIZED, 'REFRESH_TOKEN_EXPIRED', 'Refresh token has expired.');
    }

    if (refreshTokenRecord.user.storeId !== payload.storeId) {
      throw new AppError(StatusCodes.FORBIDDEN, 'STORE_SCOPE_MISMATCH', 'Token scope does not match the store.');
    }

    const nextPayload = this.buildPayload(refreshTokenRecord.user);
    const accessToken = jwtService.generateAccessToken(nextPayload);
    const nextRefreshToken = jwtService.generateRefreshToken(nextPayload);

    await authRepository.revokeRefreshToken(refreshTokenRecord.id);
    await authRepository.createRefreshToken(
      refreshTokenRecord.user.id,
      sha256(nextRefreshToken),
      new Date(Date.now() + durationToMilliseconds(env.REFRESH_TOKEN_TTL)),
    );
    await authRepository.touchRefreshToken(refreshTokenRecord.id);

    return {
      accessToken,
      refreshToken: nextRefreshToken,
      user: {
        id: refreshTokenRecord.user.id,
        name: refreshTokenRecord.user.name,
        email: refreshTokenRecord.user.email,
        role: refreshTokenRecord.user.role.name,
      },
    };
  }

  public async logout(rawRefreshToken: string | undefined): Promise<void> {
    if (!rawRefreshToken) {
      return;
    }

    const refreshTokenRecord = await authRepository.findRefreshToken(sha256(rawRefreshToken));

    if (refreshTokenRecord) {
      await authRepository.revokeRefreshToken(refreshTokenRecord.id);
    }
  }
}

export const authService = new AuthService();

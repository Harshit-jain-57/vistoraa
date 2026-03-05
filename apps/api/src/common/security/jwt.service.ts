import jwt from 'jsonwebtoken';

import type { RoleName } from '@vistora/shared';

import { env } from '../../config/env';

export interface AuthTokenPayload {
  userId: string;
  storeId: string;
  email: string;
  role: RoleName;
}

class JwtService {
  public generateAccessToken(payload: AuthTokenPayload): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.ACCESS_TOKEN_TTL as jwt.SignOptions['expiresIn'],
    });
  }

  public generateRefreshToken(payload: AuthTokenPayload): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.REFRESH_TOKEN_TTL as jwt.SignOptions['expiresIn'],
    });
  }

  public verifyAccessToken(token: string): AuthTokenPayload {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthTokenPayload;
  }

  public verifyRefreshToken(token: string): AuthTokenPayload {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as AuthTokenPayload;
  }
}

export const jwtService = new JwtService();

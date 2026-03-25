import { BaseRepository } from '../../common/database/base.repository';

export class AuthRepository extends BaseRepository {
  public createRefreshToken(userId: string, tokenHash: string, expiresAt: Date) {
    return this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });
  }

  public findRefreshToken(tokenHash: string) {
    return this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
      },
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  public revokeRefreshToken(id: string) {
    return this.prisma.refreshToken.update({
      where: {
        id,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  public touchRefreshToken(id: string) {
    return this.prisma.refreshToken.update({
      where: {
        id,
      },
      data: {
        lastUsedAt: new Date(),
      },
    });
  }
}

export const authRepository = new AuthRepository();

import type { RoleName } from '@vistora/shared';

import { BaseRepository } from '../../common/database/base.repository';

export class UserRepository extends BaseRepository {
  public findByEmail(storeId: string, email: string) {
    return this.prisma.user.findFirst({
      where: {
        storeId,
        email,
        deletedAt: null,
      },
      include: {
        role: true,
      },
    });
  }

  public findById(storeId: string, userId: string) {
    return this.prisma.user.findFirst({
      where: {
        id: userId,
        storeId,
        deletedAt: null,
      },
      include: {
        role: true,
      },
    });
  }

  public listByStore(storeId: string) {
    return this.prisma.user.findMany({
      where: {
        storeId,
        deletedAt: null,
      },
      include: {
        role: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  public findRoleByName(roleName: RoleName) {
    return this.prisma.role.findUnique({
      where: {
        name: roleName,
      },
    });
  }

  public create(input: {
    storeId: string;
    name: string;
    email: string;
    phone?: string;
    passwordHash: string;
    roleId: string;
  }) {
    return this.prisma.user.create({
      data: input,
      include: {
        role: true,
      },
    });
  }

  public updateLastLogin(userId: string) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        lastLoginAt: new Date(),
      },
    });
  }
}

export const userRepository = new UserRepository();

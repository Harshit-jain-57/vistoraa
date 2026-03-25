import { StatusCodes } from 'http-status-codes';

import type { CreateUserDto } from './user.types';

import { AppError } from '../../common/errors/app-error';
import { passwordService } from '../../common/security/password.service';
import { auditService } from '../audit/audit.service';
import { userRepository } from './user.repository';

export class UserService {
  public async listUsers(storeId: string) {
    const users = await userRepository.listByStore(storeId);

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role.name,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    }));
  }

  public async createUser(storeId: string, actorUserId: string, dto: CreateUserDto) {
    const existingUser = await userRepository.findByEmail(storeId, dto.email);

    if (existingUser) {
      throw new AppError(StatusCodes.CONFLICT, 'DUPLICATE_USER', 'A user with this email already exists for the store.');
    }

    const role = await userRepository.findRoleByName(dto.role);

    if (!role) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'ROLE_NOT_FOUND', `Role '${dto.role}' does not exist.`);
    }

    const passwordHash = await passwordService.hash(dto.password);
    const user = await userRepository.create({
      storeId,
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      passwordHash,
      roleId: role.id,
    });

    await auditService.log({
      storeId,
      userId: actorUserId,
      entityType: 'User',
      entityId: user.id,
      action: 'CREATE',
      newValue: {
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role.name,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
}

export const userService = new UserService();

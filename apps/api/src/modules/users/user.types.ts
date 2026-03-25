import type { RoleName } from '@vistora/shared';

export interface CreateUserDto {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: RoleName;
}

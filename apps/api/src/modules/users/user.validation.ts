import { z } from 'zod';

import { RoleName } from '@vistora/shared';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email(),
    phone: z.string().trim().min(8).max(20).optional(),
    password: z.string().min(8).max(128),
    role: z.nativeEnum(RoleName),
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
});

import { z } from 'zod';

export const updateStoreSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120).optional(),
    logoUrl: z.string().url().nullable().optional(),
    themeConfig: z.record(z.string(), z.unknown()).optional(),
    contactDetails: z.record(z.string(), z.unknown()).optional(),
    address: z.record(z.string(), z.unknown()).optional(),
    isActive: z.boolean().optional(),
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
});

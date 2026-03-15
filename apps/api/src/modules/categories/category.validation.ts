import { z } from 'zod';

export const publicCategoryListSchema = z.object({
  body: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
});

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    slug: z.string().trim().min(2).max(120).optional(),
    description: z.string().trim().max(500).optional(),
    parentId: z.string().cuid().optional(),
    isActive: z.boolean().optional(),
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
});

export const updateCategorySchema = z.object({
  body: createCategorySchema.shape.body.partial(),
  query: z.object({}).passthrough(),
  params: z.object({
    id: z.string().cuid(),
  }),
});

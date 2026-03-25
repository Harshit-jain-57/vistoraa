import { z } from 'zod';

export const createTagSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80),
    slug: z.string().trim().min(2).max(80).optional(),
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
});

export const updateTagSchema = z.object({
  body: createTagSchema.shape.body.partial(),
  query: z.object({}).passthrough(),
  params: z.object({
    id: z.string().cuid(),
  }),
});

import { z } from 'zod';

export const createVisibilityRuleSchema = z.object({
  body: z.object({
    fieldName: z.string().trim().min(2).max(80),
    isPublic: z.boolean().optional(),
    visibleToStaff: z.boolean().optional(),
    visibleToAdminOnly: z.boolean().optional(),
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
});

export const updateVisibilityRuleSchema = z.object({
  body: createVisibilityRuleSchema.shape.body.partial(),
  query: z.object({}).passthrough(),
  params: z.object({
    id: z.string().cuid(),
  }),
});

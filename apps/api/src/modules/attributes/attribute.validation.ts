import { AttributeDataType } from '@prisma/client';
import { z } from 'zod';

export const createAttributeSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100),
    slug: z.string().trim().min(2).max(100).optional(),
    dataType: z.nativeEnum(AttributeDataType),
    isFilterable: z.boolean().optional(),
    isPublic: z.boolean().optional(),
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
});

export const updateAttributeSchema = z.object({
  body: createAttributeSchema.shape.body.partial(),
  query: z.object({}).passthrough(),
  params: z.object({
    id: z.string().cuid(),
  }),
});

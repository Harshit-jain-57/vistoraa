import { z } from 'zod';

import { AvailabilityStatus } from '@vistora/shared';

const imageSchema = z.object({
  imageUrl: z.string().url(),
  altText: z.string().trim().max(255).optional(),
  sortOrder: z.number().int().min(0).optional(),
  isPrimary: z.boolean().optional(),
});

const attributeSchema = z.object({
  attributeDefinitionId: z.string().cuid(),
  value: z.string().trim().min(1).max(255),
});

export const publicProductListSchema = z.object({
  body: z.object({}).passthrough(),
  query: z.object({
    q: z.string().trim().optional(),
    category: z.string().trim().optional(),
    colour: z.string().trim().optional(),
    fabric: z.string().trim().optional(),
    occasion: z.string().trim().optional(),
    featured: z
      .union([z.literal('true'), z.literal('false')])
      .transform((value) => value === 'true')
      .optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(12),
  }),
  params: z.object({}).passthrough(),
});

export const productSlugParamSchema = z.object({
  body: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
  params: z.object({
    slug: z.string().trim().min(2),
  }),
});

export const adminProductListSchema = z.object({
  body: z.object({}).passthrough(),
  query: publicProductListSchema.shape.query,
  params: z.object({}).passthrough(),
});

export const createProductSchema = z.object({
  body: z.object({
    categoryId: z.string().cuid().optional(),
    name: z.string().trim().min(2).max(200),
    slug: z.string().trim().min(2).max(200).optional(),
    description: z.string().trim().max(2_000).optional(),
    sku: z.string().trim().min(2).max(80),
    publicCode: z.string().trim().max(80).optional(),
    fabric: z.string().trim().max(80).optional(),
    colour: z.string().trim().max(80).optional(),
    pattern: z.string().trim().max(80).optional(),
    occasion: z.string().trim().max(80).optional(),
    brand: z.string().trim().max(80).optional(),
    visiblePrice: z.number().nonnegative().optional(),
    internalCost: z.number().nonnegative().optional(),
    margin: z.number().nonnegative().optional(),
    supplierName: z.string().trim().max(120).optional(),
    stockQty: z.number().int().nonnegative().optional(),
    availabilityStatus: z.nativeEnum(AvailabilityStatus).optional(),
    isFeatured: z.boolean().optional(),
    isPublic: z.boolean().optional(),
    images: z.array(imageSchema).max(10).optional(),
    tagIds: z.array(z.string().cuid()).max(20).optional(),
    attributes: z.array(attributeSchema).max(30).optional(),
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
});

export const updateProductSchema = z.object({
  body: createProductSchema.shape.body.partial(),
  query: z.object({}).passthrough(),
  params: z.object({
    id: z.string().cuid(),
  }),
});

export const productIdParamSchema = z.object({
  body: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
  params: z.object({
    id: z.string().cuid(),
  }),
});

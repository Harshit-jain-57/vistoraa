import { z } from 'zod';

import { ShowroomRequestItemStatus, ShowroomRequestStatus } from '@vistora/shared';

export const createShowroomRequestSchema = z.object({
  body: z.object({
    sessionToken: z.string().trim().min(1),
    customerName: z.string().trim().min(2).max(100).optional(),
    mobileNumber: z.string().trim().min(8).max(20).optional(),
    notes: z.string().trim().max(500).optional(),
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
});

export const adminRequestListSchema = z.object({
  body: z.object({}).passthrough(),
  query: z.object({
    status: z.nativeEnum(ShowroomRequestStatus).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
  }),
  params: z.object({}).passthrough(),
});

export const updateRequestStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(ShowroomRequestStatus),
    notes: z.string().trim().max(500).optional(),
    items: z
      .array(
        z.object({
          productId: z.string().cuid(),
          status: z.nativeEnum(ShowroomRequestItemStatus),
          remark: z.string().trim().max(250).optional(),
        }),
      )
      .optional(),
  }),
  query: z.object({}).passthrough(),
  params: z.object({
    id: z.string().cuid(),
  }),
});

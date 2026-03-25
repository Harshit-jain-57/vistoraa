import { z } from 'zod';

export const shortlistQuerySchema = z.object({
  body: z.object({}).passthrough(),
  query: z.object({
    sessionToken: z.string().trim().optional(),
  }),
  params: z.object({}).passthrough(),
});

export const addShortlistItemSchema = z.object({
  body: z.object({
    sessionToken: z.string().trim().optional(),
    customerName: z.string().trim().min(2).max(100).optional(),
    mobileNumber: z.string().trim().min(8).max(20).optional(),
    productId: z.string().cuid(),
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
});

export const removeShortlistItemSchema = z.object({
  body: z.object({}).passthrough(),
  query: z.object({
    sessionToken: z.string().trim(),
  }),
  params: z.object({
    id: z.string().cuid(),
  }),
});

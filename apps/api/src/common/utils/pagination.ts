import type { PaginationMeta } from '@vistora/shared';

export interface PaginationInput {
  page: number;
  limit: number;
}

export const getPagination = ({ page, limit }: PaginationInput) => {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(Math.max(limit, 1), 50);

  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
  };
};

export const buildPaginationMeta = (page: number, limit: number, total: number): PaginationMeta => {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

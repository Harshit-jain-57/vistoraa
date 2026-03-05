import type { PaginationMeta } from '@vistora/shared';

export class BaseResponseBuilder {
  public static success<T>(data: T, message = 'Request successful') {
    return {
      success: true as const,
      message,
      data,
    };
  }

  public static paginated<T>(data: T[], pagination: PaginationMeta, message = 'Request successful') {
    return {
      success: true as const,
      message,
      data,
      pagination,
    };
  }

  public static error(code: string, message: string, details?: unknown) {
    return {
      success: false as const,
      error: {
        code,
        message,
        details,
      },
    };
  }
}

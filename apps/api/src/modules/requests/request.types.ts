import type { ShowroomRequestItemStatus, ShowroomRequestStatus } from '@vistora/shared';

export interface CreateShowroomRequestDto {
  sessionToken: string;
  customerName?: string;
  mobileNumber?: string;
  notes?: string;
}

export interface UpdateShowroomRequestStatusDto {
  status: ShowroomRequestStatus;
  notes?: string;
  items?: Array<{
    productId: string;
    status: ShowroomRequestItemStatus;
    remark?: string;
  }>;
}

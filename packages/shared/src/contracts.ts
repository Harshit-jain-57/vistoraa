export enum RoleName {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum AvailabilityStatus {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  BACKORDER = 'BACKORDER',
  DISCONTINUED = 'DISCONTINUED',
}

export enum ShowroomRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  PICKING = 'PICKING',
  READY_TO_SHOW = 'READY_TO_SHOW',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  UNAVAILABLE = 'UNAVAILABLE',
}

export enum ShowroomRequestItemStatus {
  REQUESTED = 'REQUESTED',
  PICKED = 'PICKED',
  READY = 'READY',
  SHOWN = 'SHOWN',
  UNAVAILABLE = 'UNAVAILABLE',
  CANCELLED = 'CANCELLED',
}

export enum VisibilityAudience {
  PUBLIC = 'PUBLIC',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN',
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiPaginated<T> {
  success: true;
  message: string;
  data: T[];
  pagination: PaginationMeta;
}

export interface PublicProductCard {
  slug: string;
  name: string;
  publicCode: string | null;
  description: string | null;
  category: {
    name: string;
    slug: string;
  } | null;
  fabric: string | null;
  colour: string | null;
  occasion: string | null;
  brand: string | null;
  visiblePrice: number | null;
  availabilityStatus: AvailabilityStatus;
  isFeatured: boolean;
  primaryImageUrl: string | null;
  tags: string[];
}

export interface PublicProductDetail extends PublicProductCard {
  pattern: string | null;
  gallery: Array<{
    imageUrl: string;
    altText: string | null;
    isPrimary: boolean;
  }>;
  attributes: Array<{
    name: string;
    value: string;
  }>;
}

export interface AdminProductRecord extends PublicProductDetail {
  id: string;
  sku: string;
  stockQty: number;
  internalCost: number | null;
  margin: number | null;
  supplierName: string | null;
  isPublic: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogueFilters {
  q?: string;
  category?: string;
  colour?: string;
  fabric?: string;
  occasion?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export interface ShortlistLine {
  id: string;
  productSlug: string;
  productName: string;
  publicCode: string | null;
  primaryImageUrl: string | null;
  addedAt: string;
}

export interface ShowroomRequestReceipt {
  requestNumber: string;
  status: ShowroomRequestStatus;
  itemCount: number;
  customerName: string | null;
}

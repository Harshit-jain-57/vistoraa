import type { AvailabilityStatus, CatalogueFilters } from '@vistora/shared';

export interface ProductImageInput {
  imageUrl: string;
  altText?: string;
  sortOrder?: number;
  isPrimary?: boolean;
}

export interface ProductAttributeValueInput {
  attributeDefinitionId: string;
  value: string;
}

export interface UpsertProductDto {
  categoryId?: string;
  name: string;
  slug?: string;
  description?: string;
  sku: string;
  publicCode?: string;
  fabric?: string;
  colour?: string;
  pattern?: string;
  occasion?: string;
  brand?: string;
  visiblePrice?: number;
  internalCost?: number;
  margin?: number;
  supplierName?: string;
  stockQty?: number;
  availabilityStatus?: AvailabilityStatus;
  isFeatured?: boolean;
  isPublic?: boolean;
  images?: ProductImageInput[];
  tagIds?: string[];
  attributes?: ProductAttributeValueInput[];
}

export type UpdateProductDto = Partial<UpsertProductDto>;

export interface PublicProductQuery extends CatalogueFilters {
  page: number;
  limit: number;
}

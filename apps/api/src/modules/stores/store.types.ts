export interface UpdateStoreDto {
  name?: string;
  logoUrl?: string | null;
  themeConfig?: Record<string, unknown>;
  contactDetails?: Record<string, unknown>;
  address?: Record<string, unknown>;
  isActive?: boolean;
}

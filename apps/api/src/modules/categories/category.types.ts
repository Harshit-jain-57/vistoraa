export interface CreateCategoryDto {
  name: string;
  slug?: string;
  description?: string;
  parentId?: string;
  isActive?: boolean;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

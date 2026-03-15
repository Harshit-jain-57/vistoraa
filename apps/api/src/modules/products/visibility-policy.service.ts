import type { VisibilityRule } from '@prisma/client';

import { VisibilityAudience } from '@vistora/shared';

import type { ProductRecord } from './product.repository';

const defaultPublicFields = new Set([
  'name',
  'slug',
  'description',
  'publicCode',
  'fabric',
  'colour',
  'pattern',
  'occasion',
  'brand',
  'visiblePrice',
  'availabilityStatus',
  'isFeatured',
  'images',
  'attributes',
  'tags',
  'category',
]);

const defaultStaffFields = new Set([...defaultPublicFields, 'stockQty']);

const decimalToNumber = (value: { toNumber(): number } | null): number | null => {
  return value ? value.toNumber() : null;
};

export class VisibilityPolicyService {
  private isVisible(fieldName: string, audience: VisibilityAudience, rules: VisibilityRule[]): boolean {
    if (audience === VisibilityAudience.ADMIN) {
      return true;
    }

    const rule = rules.find((entry) => entry.fieldName === fieldName);

    if (!rule) {
      return audience === VisibilityAudience.PUBLIC
        ? defaultPublicFields.has(fieldName)
        : defaultStaffFields.has(fieldName);
    }

    if (audience === VisibilityAudience.PUBLIC) {
      return rule.isPublic && !rule.visibleToAdminOnly;
    }

    return (rule.visibleToStaff || rule.isPublic) && !rule.visibleToAdminOnly;
  }

  public shapeProduct(product: ProductRecord, audience: VisibilityAudience, rules: VisibilityRule[]) {
    const base = {
      slug: product.slug,
      name: product.name,
      publicCode: this.isVisible('publicCode', audience, rules) ? product.publicCode : null,
      description: this.isVisible('description', audience, rules) ? product.description : null,
      category: product.category
        ? {
            name: product.category.name,
            slug: product.category.slug,
          }
        : null,
      fabric: this.isVisible('fabric', audience, rules) ? product.fabric : null,
      colour: this.isVisible('colour', audience, rules) ? product.colour : null,
      occasion: this.isVisible('occasion', audience, rules) ? product.occasion : null,
      brand: this.isVisible('brand', audience, rules) ? product.brand : null,
      visiblePrice: this.isVisible('visiblePrice', audience, rules) ? decimalToNumber(product.visiblePrice) : null,
      availabilityStatus: product.availabilityStatus,
      isFeatured: product.isFeatured,
      primaryImageUrl: product.images.find((image) => image.isPrimary)?.imageUrl ?? product.images[0]?.imageUrl ?? null,
      tags: this.isVisible('tags', audience, rules) ? product.tags.map((tag) => tag.tag.name) : [],
      pattern: this.isVisible('pattern', audience, rules) ? product.pattern : null,
      gallery: this.isVisible('images', audience, rules)
        ? product.images.map((image) => ({
            imageUrl: image.imageUrl,
            altText: image.altText,
            isPrimary: image.isPrimary,
          }))
        : [],
      attributes: product.attributeValues
        .filter((attribute) => audience !== VisibilityAudience.PUBLIC || attribute.attributeDefinition.isPublic)
        .map((attribute) => ({
          name: attribute.attributeDefinition.name,
          value: attribute.value,
        })),
    };

    if (audience === VisibilityAudience.PUBLIC) {
      return base;
    }

    return {
      ...base,
      id: product.id,
      sku: product.sku,
      stockQty: this.isVisible('stockQty', audience, rules) ? product.stockQty : 0,
      internalCost: this.isVisible('internalCost', audience, rules) ? decimalToNumber(product.internalCost) : null,
      margin: this.isVisible('margin', audience, rules) ? decimalToNumber(product.margin) : null,
      supplierName: this.isVisible('supplierName', audience, rules) ? product.supplierName : null,
      isPublic: product.isPublic,
      isArchived: product.isArchived,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }
}

export const visibilityPolicyService = new VisibilityPolicyService();

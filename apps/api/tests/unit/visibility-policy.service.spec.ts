import { VisibilityAudience } from '@vistora/shared';

import { visibilityPolicyService } from '../../src/modules/products/visibility-policy.service';

const createProduct = () =>
  ({
    id: 'prod_1',
    slug: 'royal-zari-banarasi',
    name: 'Royal Zari Banarasi',
    sku: 'BAN-001',
    publicCode: 'VST-BAN-001',
    description: 'Rich wedding saree',
    fabric: 'Silk Blend',
    colour: 'Teal',
    pattern: 'Zari Floral',
    occasion: 'Wedding',
    brand: 'Vistora',
    visiblePrice: { toNumber: () => 3250 },
    internalCost: { toNumber: () => 2400 },
    margin: { toNumber: () => 850 },
    supplierName: 'Kashi Loom House',
    stockQty: 12,
    availabilityStatus: 'IN_STOCK',
    isFeatured: true,
    isPublic: true,
    isArchived: false,
    createdAt: new Date('2026-01-01T10:00:00.000Z'),
    updatedAt: new Date('2026-01-02T10:00:00.000Z'),
    category: {
      id: 'cat_1',
      name: 'Banarasi Sarees',
      slug: 'banarasi-sarees',
    },
    images: [
      {
        imageUrl: 'https://example.com/image.jpg',
        altText: 'Product image',
        isPrimary: true,
      },
    ],
    tags: [{ tag: { name: 'Wedding' } }],
    attributeValues: [
      {
        value: 'Heavy Zari',
        attributeDefinition: {
          id: 'attr_1',
          name: 'Work Type',
          slug: 'work-type',
          isPublic: true,
        },
      },
      {
        value: 'SUP-11',
        attributeDefinition: {
          id: 'attr_2',
          name: 'Supplier Batch',
          slug: 'supplier-batch',
          isPublic: false,
        },
      },
    ],
  }) as never;

describe('VisibilityPolicyService', () => {
  it('hides internal fields from public responses', () => {
    const result = visibilityPolicyService.shapeProduct(createProduct(), VisibilityAudience.PUBLIC, []);

    expect(result).not.toHaveProperty('internalCost');
    expect(result).not.toHaveProperty('supplierName');
    expect(result.attributes).toHaveLength(1);
  });

  it('exposes internal fields to admin responses', () => {
    const result = visibilityPolicyService.shapeProduct(createProduct(), VisibilityAudience.ADMIN, []);

    expect(result).toHaveProperty('internalCost', 2400);
    expect(result).toHaveProperty('supplierName', 'Kashi Loom House');
    expect(result.attributes).toHaveLength(2);
  });
});

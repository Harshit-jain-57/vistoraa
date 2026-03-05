import bcrypt from 'bcryptjs';
import { PrismaClient, RoleName, AvailabilityStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const roleSeeds = [
    { name: RoleName.OWNER, description: 'Store owner with full access.' },
    { name: RoleName.ADMIN, description: 'Store admin with management access.' },
    { name: RoleName.STAFF, description: 'Operational staff with limited access.' },
    { name: RoleName.SUPER_ADMIN, description: 'Platform super admin for SaaS management.' },
  ];

  for (const role of roleSeeds) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role,
    });
  }

  const store = await prisma.store.upsert({
    where: { slug: 'vistora-demo' },
    update: {
      name: 'Vistora Demo Textiles',
      themeConfig: {
        peachCream: '#ffebd0',
        deepAqua: '#278783',
        deepAquaDark: '#1d6b68',
        deepAquaLight: '#34a39e',
      },
      contactDetails: {
        phone: '+91-9876543210',
        email: 'hello@vistora.demo',
      },
      address: {
        city: 'Surat',
        market: 'Ring Road Textile Hub',
      },
    },
    create: {
      name: 'Vistora Demo Textiles',
      slug: 'vistora-demo',
      logoUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
      themeConfig: {
        peachCream: '#ffebd0',
        deepAqua: '#278783',
        deepAquaDark: '#1d6b68',
        deepAquaLight: '#34a39e',
      },
      contactDetails: {
        phone: '+91-9876543210',
        email: 'hello@vistora.demo',
      },
      address: {
        city: 'Surat',
        market: 'Ring Road Textile Hub',
      },
    },
  });

  const ownerRole = await prisma.role.findUniqueOrThrow({ where: { name: RoleName.OWNER } });
  const staffRole = await prisma.role.findUniqueOrThrow({ where: { name: RoleName.STAFF } });

  const passwordHash = await bcrypt.hash('Admin@123', 12);

  const owner = await prisma.user.upsert({
    where: {
      storeId_email: {
        storeId: store.id,
        email: 'owner@vistora.demo',
      },
    },
    update: {
      name: 'Riya Shah',
      passwordHash,
      roleId: ownerRole.id,
    },
    create: {
      storeId: store.id,
      name: 'Riya Shah',
      email: 'owner@vistora.demo',
      phone: '+91-9000000001',
      passwordHash,
      roleId: ownerRole.id,
    },
  });

  await prisma.user.upsert({
    where: {
      storeId_email: {
        storeId: store.id,
        email: 'staff@vistora.demo',
      },
    },
    update: {
      name: 'Arjun Mehta',
      passwordHash,
      roleId: staffRole.id,
    },
    create: {
      storeId: store.id,
      name: 'Arjun Mehta',
      email: 'staff@vistora.demo',
      phone: '+91-9000000002',
      passwordHash,
      roleId: staffRole.id,
    },
  });

  const categories = await Promise.all(
    [
      { name: 'Banarasi Sarees', slug: 'banarasi-sarees', description: 'Rich woven sarees for weddings and festive wear.' },
      { name: 'Dress Materials', slug: 'dress-materials', description: 'Semi-stitched and unstitched dress sets.' },
      { name: 'Printed Fabrics', slug: 'printed-fabrics', description: 'Wholesale fabrics for boutique sourcing.' },
    ].map((category) =>
      prisma.category.upsert({
        where: {
          storeId_slug: {
            storeId: store.id,
            slug: category.slug,
          },
        },
        update: category,
        create: {
          ...category,
          storeId: store.id,
        },
      }),
    ),
  );

  const tags = await Promise.all(
    ['Wedding', 'Premium', 'Festive', 'Cotton', 'New Arrival'].map((name) =>
      prisma.tag.upsert({
        where: {
          storeId_slug: {
            storeId: store.id,
            slug: name.toLowerCase().replace(/\s+/g, '-'),
          },
        },
        update: {
          name,
        },
        create: {
          storeId: store.id,
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
        },
      }),
    ),
  );

  const attributeDefinitions = await Promise.all(
    [
      { name: 'Work Type', slug: 'work-type', isFilterable: true, isPublic: true },
      { name: 'Blouse Included', slug: 'blouse-included', isFilterable: true, isPublic: true },
      { name: 'Supplier Batch', slug: 'supplier-batch', isFilterable: false, isPublic: false },
    ].map((attribute) =>
      prisma.attributeDefinition.upsert({
        where: {
          storeId_slug: {
            storeId: store.id,
            slug: attribute.slug,
          },
        },
        update: attribute,
        create: {
          ...attribute,
          storeId: store.id,
        },
      }),
    ),
  );

  const visibilityRules = [
    { fieldName: 'visiblePrice', isPublic: true, visibleToStaff: true, visibleToAdminOnly: false },
    { fieldName: 'stockQty', isPublic: false, visibleToStaff: true, visibleToAdminOnly: false },
    { fieldName: 'internalCost', isPublic: false, visibleToStaff: false, visibleToAdminOnly: true },
    { fieldName: 'margin', isPublic: false, visibleToStaff: false, visibleToAdminOnly: true },
    { fieldName: 'supplierName', isPublic: false, visibleToStaff: false, visibleToAdminOnly: true },
  ];

  for (const rule of visibilityRules) {
    await prisma.visibilityRule.upsert({
      where: {
        storeId_fieldName: {
          storeId: store.id,
          fieldName: rule.fieldName,
        },
      },
      update: rule,
      create: {
        storeId: store.id,
        ...rule,
      },
    });
  }

  const products = [
    {
      name: 'Royal Zari Banarasi',
      slug: 'royal-zari-banarasi',
      sku: 'BAN-001',
      publicCode: 'VST-BAN-001',
      categoryId: categories[0]!.id,
      description: 'Rich aqua-toned Banarasi saree with intricate zari work and bridal drape.',
      fabric: 'Silk Blend',
      colour: 'Teal',
      pattern: 'Zari Floral',
      occasion: 'Wedding',
      brand: 'Vistora Signature',
      visiblePrice: 3250,
      internalCost: 2400,
      margin: 850,
      supplierName: 'Kashi Loom House',
      stockQty: 12,
      availabilityStatus: AvailabilityStatus.IN_STOCK,
      isFeatured: true,
      tagSlugs: ['wedding', 'premium'],
      attributes: [
        { slug: 'work-type', value: 'Heavy Zari Weave' },
        { slug: 'blouse-included', value: 'Yes' },
        { slug: 'supplier-batch', value: 'BL-2026-APR-03' },
      ],
      images: [
        'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    {
      name: 'Festival Bloom Dress Set',
      slug: 'festival-bloom-dress-set',
      sku: 'DRS-021',
      publicCode: 'VST-DRS-021',
      categoryId: categories[1]!.id,
      description: 'Peach cream ethnic dress material set with printed dupatta and soft fall.',
      fabric: 'Cotton Silk',
      colour: 'Peach',
      pattern: 'Floral Print',
      occasion: 'Festive',
      brand: 'Heritage Edit',
      visiblePrice: 1480,
      internalCost: 980,
      margin: 500,
      supplierName: 'Jaipur Craft Lane',
      stockQty: 26,
      availabilityStatus: AvailabilityStatus.IN_STOCK,
      isFeatured: true,
      tagSlugs: ['festive', 'new-arrival'],
      attributes: [
        { slug: 'work-type', value: 'Foil Print' },
        { slug: 'blouse-included', value: 'Not Applicable' },
        { slug: 'supplier-batch', value: 'DM-2026-APR-09' },
      ],
      images: [
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    {
      name: 'Boutique Indigo Fabric Roll',
      slug: 'boutique-indigo-fabric-roll',
      sku: 'FAB-104',
      publicCode: 'VST-FAB-104',
      categoryId: categories[2]!.id,
      description: 'Wholesale printed fabric roll suited for kurtas, co-ord sets, and boutique sampling.',
      fabric: 'Pure Cotton',
      colour: 'Indigo',
      pattern: 'Block Print',
      occasion: 'Daily Wear',
      brand: 'Loom Street',
      visiblePrice: 290,
      internalCost: 210,
      margin: 80,
      supplierName: 'Ahmedabad Print Works',
      stockQty: 90,
      availabilityStatus: AvailabilityStatus.LOW_STOCK,
      isFeatured: false,
      tagSlugs: ['cotton'],
      attributes: [
        { slug: 'work-type', value: 'Screen Print' },
        { slug: 'blouse-included', value: 'Not Applicable' },
        { slug: 'supplier-batch', value: 'FAB-ROLL-11' },
      ],
      images: [
        'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
      ],
    },
  ];

  for (const product of products) {
    const saved = await prisma.product.upsert({
      where: {
        storeId_slug: {
          storeId: store.id,
          slug: product.slug,
        },
      },
      update: {
        name: product.name,
        sku: product.sku,
        publicCode: product.publicCode,
        categoryId: product.categoryId,
        description: product.description,
        fabric: product.fabric,
        colour: product.colour,
        pattern: product.pattern,
        occasion: product.occasion,
        brand: product.brand,
        visiblePrice: product.visiblePrice,
        internalCost: product.internalCost,
        margin: product.margin,
        supplierName: product.supplierName,
        stockQty: product.stockQty,
        availabilityStatus: product.availabilityStatus,
        isFeatured: product.isFeatured,
        createdById: owner.id,
        updatedById: owner.id,
      },
      create: {
        storeId: store.id,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        publicCode: product.publicCode,
        categoryId: product.categoryId,
        description: product.description,
        fabric: product.fabric,
        colour: product.colour,
        pattern: product.pattern,
        occasion: product.occasion,
        brand: product.brand,
        visiblePrice: product.visiblePrice,
        internalCost: product.internalCost,
        margin: product.margin,
        supplierName: product.supplierName,
        stockQty: product.stockQty,
        availabilityStatus: product.availabilityStatus,
        isFeatured: product.isFeatured,
        createdById: owner.id,
        updatedById: owner.id,
      },
    });

    await prisma.productImage.deleteMany({ where: { productId: saved.id } });
    await prisma.productTag.deleteMany({ where: { productId: saved.id } });
    await prisma.productAttributeValue.deleteMany({ where: { productId: saved.id } });

    await prisma.productImage.createMany({
      data: product.images.map((imageUrl, index) => ({
        productId: saved.id,
        imageUrl,
        altText: product.name,
        sortOrder: index,
        isPrimary: index === 0,
      })),
    });

    await prisma.productTag.createMany({
      data: product.tagSlugs.map((slug) => {
        const tag = tags.find((entry) => entry.slug === slug);
        return {
          productId: saved.id,
          tagId: tag!.id,
        };
      }),
    });

    await prisma.productAttributeValue.createMany({
      data: product.attributes.map((attribute) => {
        const definition = attributeDefinitions.find((entry) => entry.slug === attribute.slug);
        return {
          productId: saved.id,
          attributeDefinitionId: definition!.id,
          value: attribute.value,
        };
      }),
    });
  }

  console.log('Seed complete. Demo owner login: owner@vistora.demo / Admin@123');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import type { PublicProductDetail } from '@vistora/shared';

import { AvailabilityStatus } from '@vistora/shared';

export const storeBranding = {
  name: 'Vistora Demo Textiles',
  tagline: 'Wholesale discovery that feels calm, curated, and fast.',
  location: 'Ring Road, Surat',
};

export const mockCategories = [
  { name: 'Banarasi Sarees', slug: 'banarasi-sarees', productCount: 48 },
  { name: 'Dress Materials', slug: 'dress-materials', productCount: 76 },
  { name: 'Printed Fabrics', slug: 'printed-fabrics', productCount: 122 },
];

export const mockProducts: PublicProductDetail[] = [
  {
    slug: 'royal-zari-banarasi',
    name: 'Royal Zari Banarasi',
    publicCode: 'VST-BAN-001',
    description: 'Bridal-ready Banarasi saree with signature zari bloom motif and elegant fall.',
    category: { name: 'Banarasi Sarees', slug: 'banarasi-sarees' },
    fabric: 'Silk Blend',
    colour: 'Teal',
    occasion: 'Wedding',
    brand: 'Vistora Signature',
    visiblePrice: 3250,
    availabilityStatus: AvailabilityStatus.IN_STOCK,
    isFeatured: true,
    primaryImageUrl:
      'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?auto=format&fit=crop&w=1200&q=80',
    tags: ['Wedding', 'Premium'],
    pattern: 'Zari Floral',
    gallery: [
      {
        imageUrl:
          'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?auto=format&fit=crop&w=1200&q=80',
        altText: 'Royal zari saree',
        isPrimary: true,
      },
    ],
    attributes: [
      { name: 'Work Type', value: 'Heavy Zari Weave' },
      { name: 'Blouse Included', value: 'Yes' },
    ],
  },
  {
    slug: 'festival-bloom-dress-set',
    name: 'Festival Bloom Dress Set',
    publicCode: 'VST-DRS-021',
    description: 'Soft festive dress material with printed dupatta and luminous peach tones.',
    category: { name: 'Dress Materials', slug: 'dress-materials' },
    fabric: 'Cotton Silk',
    colour: 'Peach',
    occasion: 'Festive',
    brand: 'Heritage Edit',
    visiblePrice: 1480,
    availabilityStatus: AvailabilityStatus.IN_STOCK,
    isFeatured: true,
    primaryImageUrl:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
    tags: ['Festive', 'New Arrival'],
    pattern: 'Floral Print',
    gallery: [
      {
        imageUrl:
          'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
        altText: 'Festival bloom dress set',
        isPrimary: true,
      },
    ],
    attributes: [
      { name: 'Work Type', value: 'Foil Print' },
      { name: 'Dupatta', value: 'Printed Organza' },
    ],
  },
  {
    slug: 'boutique-indigo-fabric-roll',
    name: 'Boutique Indigo Fabric Roll',
    publicCode: 'VST-FAB-104',
    description: 'Boutique-friendly printed cotton fabric for sampling, kurtas, and capsule collections.',
    category: { name: 'Printed Fabrics', slug: 'printed-fabrics' },
    fabric: 'Pure Cotton',
    colour: 'Indigo',
    occasion: 'Daily Wear',
    brand: 'Loom Street',
    visiblePrice: 290,
    availabilityStatus: AvailabilityStatus.LOW_STOCK,
    isFeatured: false,
    primaryImageUrl:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
    tags: ['Cotton'],
    pattern: 'Block Print',
    gallery: [
      {
        imageUrl:
          'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
        altText: 'Indigo fabric roll',
        isPrimary: true,
      },
    ],
    attributes: [
      { name: 'Work Type', value: 'Screen Print' },
      { name: 'Width', value: '44 inches' },
    ],
  },
];

export const mockDashboard = {
  activeProducts: 246,
  pendingRequests: 14,
  staffOnline: 6,
  conversionAssist: '32%',
};

export const mockRequests = [
  {
    requestNumber: 'VR-MI5P6W-311',
    customer: 'Kiran Traders',
    status: 'PICKING',
    itemCount: 3,
    updatedAt: '2 mins ago',
  },
  {
    requestNumber: 'VR-MI5P89-412',
    customer: 'Walk-in Buyer',
    status: 'READY_TO_SHOW',
    itemCount: 5,
    updatedAt: '6 mins ago',
  },
  {
    requestNumber: 'VR-MI5P8Q-768',
    customer: 'Lavanya Boutique',
    status: 'PENDING',
    itemCount: 2,
    updatedAt: '11 mins ago',
  },
];

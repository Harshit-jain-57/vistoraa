import { FilterSidebar } from '@/components/customer/filter-sidebar';
import { ProductCard } from '@/components/customer/product-card';
import { StoreHeader } from '@/components/customer/store-header';
import { SectionHeading } from '@/components/shared/section-heading';
import { mockProducts } from '@/lib/data/mock';

export default function CataloguePage() {
  return (
    <main className="pb-16">
      <StoreHeader />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Catalogue"
          title="Searchable inventory built for busy textile floors."
          description="The UI stays clean on the surface while the API underneath can scale to role-based visibility, pagination, and tenant-safe queries."
        />
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
          <FilterSidebar />
          <div className="space-y-6">
            <div className="glass-card rounded-[var(--radius)] px-5 py-4 text-sm text-[var(--text-muted)]">
              246 products found. Filters are wired as UI-ready placeholders for the backend catalogue API.
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {mockProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

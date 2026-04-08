import { ArrowRight, Layers3, Search, Shirt } from 'lucide-react';

import { ProductCard } from '@/components/customer/product-card';
import { ShortlistStrip } from '@/components/customer/shortlist-strip';
import { StoreHeader } from '@/components/customer/store-header';
import { SectionHeading } from '@/components/shared/section-heading';
import { Button } from '@/components/ui/button';
import { Pill } from '@/components/ui/pill';
import { mockCategories, mockProducts, storeBranding } from '@/lib/data/mock';

export default function HomePage() {
  const heroProduct = mockProducts[0]!;

  return (
    <main className="pb-20">
      <StoreHeader />

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-20">
        <div className="space-y-8">
          <Pill>Digital Storefront for Wholesale Floors</Pill>
          <div className="space-y-6">
            <h1 className="display-font text-6xl font-semibold leading-none text-[var(--text-dark)] sm:text-7xl">
              Browse first. Pull stock later.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--text-muted)]">{storeBranding.tagline}</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button href="/catalogue" className="gap-2">
              Open catalogue <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/admin/login" variant="secondary">
              Staff login
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: <Search className="h-5 w-5" />, title: 'Faster discovery', text: 'Customers filter before staff starts unfolding products.' },
              { icon: <Layers3 className="h-5 w-5" />, title: 'Curated shortlists', text: 'Products can be shortlisted in sessions without full account creation.' },
              { icon: <Shirt className="h-5 w-5" />, title: 'Assisted selling', text: 'Staff receives a focused request instead of vague walk-in browsing.' },
            ].map((feature) => (
              <article key={feature.title} className="glass-card rounded-[var(--radius)] p-5">
                <div className="mb-4 inline-flex rounded-full bg-[rgba(39,135,131,0.1)] p-3 text-[var(--deep-aqua)]">{feature.icon}</div>
                <h2 className="mb-2 text-lg font-semibold">{feature.title}</h2>
                <p className="text-sm leading-6 text-[var(--text-muted)]">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="glass-card relative overflow-hidden rounded-[32px] p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,235,208,0.75)] via-transparent to-[rgba(52,163,158,0.12)]" />
          <div className="relative space-y-6">
            <img
              src={heroProduct.primaryImageUrl ?? ''}
              alt={heroProduct.name}
              className="h-[420px] w-full rounded-[24px] object-cover"
            />
            <div className="grid gap-3 sm:grid-cols-3">
              {mockCategories.map((category) => (
                <div key={category.slug} className="rounded-[var(--radius-sm)] bg-white/80 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">Category</p>
                  <p className="mt-2 font-semibold">{category.name}</p>
                  <p className="mt-1 text-sm text-[var(--deep-aqua)]">{category.productCount} products</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Featured Catalogue"
          title="Store-ready inventory cards with just enough detail to help buyers decide."
          description="Public pages stay discovery-friendly while the backend keeps internal rates, margins, and supplier data protected."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {mockProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ShortlistStrip />
      </section>
    </main>
  );
}

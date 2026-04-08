import { notFound } from 'next/navigation';
import { CheckCircle2, ListChecks } from 'lucide-react';

import { StoreHeader } from '@/components/customer/store-header';
import { Button } from '@/components/ui/button';
import { Pill } from '@/components/ui/pill';
import { mockProducts } from '@/lib/data/mock';
import { formatCurrency } from '@/lib/utils';

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = mockProducts.find((entry) => entry.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="pb-16">
      <StoreHeader />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <div className="space-y-6">
          <img
            src={product.gallery[0]?.imageUrl ?? product.primaryImageUrl ?? ''}
            alt={product.name}
            className="h-[560px] w-full rounded-[32px] object-cover shadow-glow"
          />
        </div>

        <div className="glass-card space-y-8 rounded-[32px] p-8">
          <Pill>{product.category?.name}</Pill>
          <div className="space-y-4">
            <h1 className="display-font text-5xl font-semibold">{product.name}</h1>
            <p className="text-sm uppercase tracking-[0.15em] text-[var(--text-muted)]">{product.publicCode}</p>
            <p className="text-base leading-7 text-[var(--text-muted)]">{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              ['Fabric', product.fabric],
              ['Colour', product.colour],
              ['Occasion', product.occasion],
              ['Pattern', product.pattern],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[var(--radius-sm)] bg-white p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">{label}</p>
                <p className="mt-2 font-semibold">{value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[var(--radius)] bg-[var(--peach-cream)] p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">Visible price</p>
            <p className="display-font mt-2 text-4xl font-semibold">{formatCurrency(product.visiblePrice)}</p>
            <p className="mt-2 text-sm text-[var(--text-muted)]">Internal rates and margins stay hidden from the public catalogue.</p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--deep-aqua)]">Public attributes</p>
            {product.attributes.map((attribute) => (
              <div key={attribute.name} className="flex items-center justify-between rounded-[var(--radius-sm)] bg-white px-4 py-3">
                <span className="text-sm text-[var(--text-muted)]">{attribute.name}</span>
                <span className="font-semibold">{attribute.value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/shortlist" className="gap-2">
              <ListChecks className="h-4 w-4" />
              Add to shortlist
            </Button>
            <Button href="/request/confirmation" variant="secondary" className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Simulate request
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

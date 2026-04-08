import { StoreHeader } from '@/components/customer/store-header';
import { Button } from '@/components/ui/button';
import { mockProducts } from '@/lib/data/mock';
import { formatCurrency } from '@/lib/utils';

const shortlist = mockProducts.slice(0, 2);

export default function ShortlistPage() {
  return (
    <main className="pb-16">
      <StoreHeader />
      <section className="mx-auto max-w-5xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.15em] text-[var(--deep-aqua)]">Session Shortlist</p>
          <h1 className="display-font text-5xl font-semibold">Items ready to be shown by staff</h1>
          <p className="max-w-2xl text-base leading-7 text-[var(--text-muted)]">
            Customers can build this list without creating a full account, then submit it as an assisted showroom request.
          </p>
        </div>

        <div className="space-y-4">
          {shortlist.map((product) => (
            <article key={product.slug} className="glass-card grid gap-5 rounded-[var(--radius)] p-5 sm:grid-cols-[180px_1fr_auto] sm:items-center">
              <img src={product.primaryImageUrl ?? ''} alt={product.name} className="h-40 w-full rounded-[24px] object-cover sm:h-32" />
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">{product.publicCode}</p>
                <h2 className="display-font text-3xl font-semibold">{product.name}</h2>
                <p className="text-sm leading-6 text-[var(--text-muted)]">{product.description}</p>
              </div>
              <div className="space-y-3 text-right">
                <p className="text-sm font-semibold text-[var(--deep-aqua)]">{formatCurrency(product.visiblePrice)}</p>
                <Button variant="secondary">Remove</Button>
              </div>
            </article>
          ))}
        </div>

        <div className="glass-card flex flex-col gap-4 rounded-[var(--radius)] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.14em] text-[var(--text-muted)]">Next step</p>
            <h2 className="display-font text-3xl font-semibold">Send shortlist to floor staff</h2>
          </div>
          <Button href="/request/confirmation">Submit showroom request</Button>
        </div>
      </section>
    </main>
  );
}

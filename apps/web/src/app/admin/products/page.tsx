import { mockProducts } from '@/lib/data/mock';
import { formatCurrency } from '@/lib/utils';

export default function AdminProductsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.14em] text-[var(--deep-aqua)]">Products</p>
        <h1 className="display-font text-5xl font-semibold">Catalogue control with public and internal fields</h1>
      </div>

      <div className="space-y-4">
        {mockProducts.map((product, index) => (
          <article key={product.slug} className="glass-card grid gap-5 rounded-[var(--radius)] p-5 lg:grid-cols-[120px_1fr_160px_160px] lg:items-center">
            <img src={product.primaryImageUrl ?? ''} alt={product.name} className="h-28 w-full rounded-[20px] object-cover" />
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">{product.publicCode}</p>
              <h2 className="display-font text-3xl font-semibold">{product.name}</h2>
              <p className="text-sm text-[var(--text-muted)]">{product.fabric} • {product.colour} • {product.category?.name}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">Visible price</p>
              <p className="mt-2 font-semibold">{formatCurrency(product.visiblePrice)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">Backend note</p>
              <p className="mt-2 font-semibold text-[var(--deep-aqua)]">Internal fields protected</p>
              <p className="text-sm text-[var(--text-muted)]">SKU-{index + 1} • hidden margin</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

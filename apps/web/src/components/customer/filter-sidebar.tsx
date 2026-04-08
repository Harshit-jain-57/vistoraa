import { mockCategories } from '@/lib/data/mock';

import { Pill } from '../ui/pill';

const swatches = ['Teal', 'Peach', 'Indigo', 'Gold'];

export function FilterSidebar() {
  return (
    <aside className="glass-card space-y-6 rounded-[var(--radius)] p-6">
      <div className="space-y-2">
        <Pill>Quick Filters</Pill>
        <p className="text-sm leading-6 text-[var(--text-muted)]">
          Designed for high-footfall stores where customers need fast discovery before staff starts picking pieces.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-[var(--deep-aqua)]">Categories</h3>
        <div className="space-y-3">
          {mockCategories.map((category) => (
            <div key={category.slug} className="flex items-center justify-between rounded-[var(--radius-sm)] bg-white px-4 py-3">
              <span className="text-sm font-semibold">{category.name}</span>
              <span className="text-xs text-[var(--text-muted)]">{category.productCount}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-[var(--deep-aqua)]">Popular Colours</h3>
        <div className="flex flex-wrap gap-2">
          {swatches.map((swatch) => (
            <span key={swatch} className="rounded-full bg-[var(--peach-cream)] px-3 py-2 text-xs font-semibold text-[var(--deep-aqua-dark)]">
              {swatch}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}

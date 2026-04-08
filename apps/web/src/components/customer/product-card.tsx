import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import type { PublicProductDetail } from '@vistora/shared';

import { formatCurrency } from '@/lib/utils';

import { Pill } from '../ui/pill';

export function ProductCard({ product }: { product: PublicProductDetail }) {
  return (
    <article className="glass-card group overflow-hidden rounded-[var(--radius)]">
      <div className="relative h-64 overflow-hidden">
        <img
          src={product.primaryImageUrl ?? product.gallery[0]?.imageUrl ?? ''}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4">
          <Pill className="bg-white/85">{product.category?.name ?? 'Catalogue'}</Pill>
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">{product.publicCode}</p>
          <h3 className="display-font text-3xl font-semibold">{product.name}</h3>
          <p className="line-clamp-2 text-sm leading-6 text-[var(--text-muted)]">{product.description}</p>
        </div>
        <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
          <span>{product.fabric}</span>
          <span>{formatCurrency(product.visiblePrice)}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {product.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded-full bg-[rgba(39,135,131,0.08)] px-3 py-1 text-xs font-medium text-[var(--deep-aqua)]">
                {tag}
              </span>
            ))}
          </div>
          <Link href={`/catalogue/${product.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--deep-aqua)]">
            View <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

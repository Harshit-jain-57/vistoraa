import { mockCategories } from '@/lib/data/mock';

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.14em] text-[var(--deep-aqua)]">Categories</p>
        <h1 className="display-font text-5xl font-semibold">Hierarchy and browse structure</h1>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {mockCategories.map((category) => (
          <article key={category.slug} className="glass-card rounded-[var(--radius)] p-6">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">Category slug</p>
            <h2 className="display-font mt-2 text-4xl font-semibold">{category.name}</h2>
            <p className="mt-3 text-sm text-[var(--text-muted)]">{category.slug}</p>
            <p className="mt-6 text-sm font-semibold text-[var(--deep-aqua)]">{category.productCount} mapped products</p>
          </article>
        ))}
      </div>
    </div>
  );
}

import { Heart, ListChecks } from 'lucide-react';

import { Button } from '../ui/button';

export function ShortlistStrip() {
  return (
    <section className="glass-card flex flex-col gap-4 rounded-[var(--radius)] p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--deep-aqua)]">
          <Heart className="h-4 w-4" /> Assisted Selling Flow
        </p>
        <h3 className="display-font text-3xl font-semibold">Shortlist quietly. Let staff show only what matters.</h3>
        <p className="max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
          This is where Vistora reduces floor chaos. Customers browse digitally, then request exactly what they want to see.
        </p>
      </div>
      <Button href="/shortlist" className="gap-2">
        <ListChecks className="h-4 w-4" />
        Open shortlist
      </Button>
    </section>
  );
}

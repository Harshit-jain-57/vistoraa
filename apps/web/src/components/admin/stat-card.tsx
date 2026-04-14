import type { ReactNode } from 'react';

export function StatCard({ label, value, icon }: { label: string; value: string | number; icon: ReactNode }) {
  return (
    <article className="glass-card rounded-[var(--radius)] p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.14em] text-[var(--text-muted)]">{label}</p>
          <p className="display-font text-4xl font-semibold text-[var(--text-dark)]">{value}</p>
        </div>
        <div className="rounded-full bg-[rgba(39,135,131,0.1)] p-3 text-[var(--deep-aqua)]">{icon}</div>
      </div>
    </article>
  );
}

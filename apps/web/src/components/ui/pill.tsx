import { cn } from '@/lib/utils';

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-[rgba(39,135,131,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--deep-aqua)]',
        className,
      )}
    >
      {children}
    </span>
  );
}

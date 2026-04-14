import type { ReactNode } from 'react';

import Link from 'next/link';

import { cn } from '@/lib/utils';

const buttonStyles = {
  primary:
    'bg-[var(--deep-aqua)] text-white shadow-soft hover:bg-[var(--deep-aqua-dark)]',
  secondary:
    'bg-white text-[var(--deep-aqua)] ring-1 ring-[rgba(39,135,131,0.18)] hover:bg-[var(--peach-cream)]',
  ghost: 'bg-transparent text-[var(--deep-aqua)] hover:bg-[rgba(39,135,131,0.08)]',
};

interface ButtonProps {
  href?: string;
  variant?: keyof typeof buttonStyles;
  className?: string;
  children: ReactNode;
}

export function Button({ href, variant = 'primary', className, children }: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center rounded-[var(--radius-sm)] px-5 py-3 text-sm font-semibold transition',
    buttonStyles[variant],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return <button className={classes}>{children}</button>;
}

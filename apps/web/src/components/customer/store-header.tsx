import Link from 'next/link';

import { storeBranding } from '@/lib/data/mock';

export function StoreHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[rgba(39,135,131,0.08)] bg-[rgba(255,253,250,0.82)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="space-y-1">
          <p className="display-font text-3xl font-semibold text-[var(--deep-aqua-dark)]">{storeBranding.name}</p>
          <p className="text-sm text-[var(--text-muted)]">{storeBranding.location}</p>
        </Link>
        <nav className="flex items-center gap-5 text-sm font-semibold text-[var(--text-muted)]">
          <Link href="/catalogue">Catalogue</Link>
          <Link href="/shortlist">Shortlist</Link>
          <Link href="/admin/login">Admin</Link>
        </nav>
      </div>
    </header>
  );
}

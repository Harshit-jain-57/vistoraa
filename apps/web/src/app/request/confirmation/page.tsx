import { CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function RequestConfirmationPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="glass-card max-w-2xl rounded-[32px] p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(39,135,131,0.12)] text-[var(--deep-aqua)]">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <p className="mt-6 text-sm uppercase tracking-[0.15em] text-[var(--deep-aqua)]">Request submitted</p>
        <h1 className="display-font mt-3 text-5xl font-semibold">Showroom request VR-MI5P6W-311 created</h1>
        <p className="mt-4 text-base leading-7 text-[var(--text-muted)]">
          Staff can now pick the shortlisted items from the dashboard. In a live setup, this page would receive a real request number from the backend.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/catalogue" variant="secondary">
            Back to catalogue
          </Button>
          <Button href="/admin/requests">Open staff queue</Button>
        </div>
      </div>
    </main>
  );
}

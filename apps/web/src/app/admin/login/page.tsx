import { Button } from '@/components/ui/button';

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="glass-card grid max-w-5xl overflow-hidden rounded-[32px] lg:grid-cols-[1fr_420px]">
        <div className="bg-[linear-gradient(160deg,rgba(39,135,131,0.96),rgba(29,107,104,0.98))] p-10 text-white">
          <p className="text-sm uppercase tracking-[0.15em] text-white/70">Vistora Admin</p>
          <h1 className="display-font mt-4 text-6xl font-semibold">Control what customers see.</h1>
          <p className="mt-6 max-w-md text-base leading-7 text-white/80">
            This dashboard is where owners protect pricing, manage the catalogue, route requests, and keep busy store floors organized.
          </p>
        </div>
        <div className="space-y-6 bg-white p-10">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.15em] text-[var(--deep-aqua)]">Secure access</p>
            <h2 className="display-font text-4xl font-semibold">Owner and staff login</h2>
          </div>
          <div className="space-y-4">
            <input className="w-full rounded-[var(--radius-sm)] border border-[rgba(39,135,131,0.18)] px-4 py-3 outline-none" placeholder="Email address" />
            <input className="w-full rounded-[var(--radius-sm)] border border-[rgba(39,135,131,0.18)] px-4 py-3 outline-none" type="password" placeholder="Password" />
          </div>
          <Button href="/admin" className="w-full justify-center">
            Enter dashboard
          </Button>
          <p className="text-sm text-[var(--text-muted)]">Demo credentials in seed data: `owner@vistora.demo / Admin@123`.</p>
        </div>
      </div>
    </main>
  );
}

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.14em] text-[var(--deep-aqua)]">Store settings</p>
        <h1 className="display-font text-5xl font-semibold">Brand, theme, and visibility controls</h1>
      </div>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="glass-card rounded-[var(--radius)] p-6">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">Branding</p>
          <h2 className="display-font mt-2 text-4xl font-semibold">Vistora Demo Textiles</h2>
          <p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">
            Theme tokens, logo, contact details, and showroom identity are stored at the store layer so the product can expand into multi-tenant SaaS later.
          </p>
        </article>

        <article className="glass-card rounded-[var(--radius)] p-6">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">Visibility rules</p>
          <h2 className="display-font mt-2 text-4xl font-semibold">Keep cost and margin private</h2>
          <div className="mt-5 space-y-3">
            {[
              'visiblePrice: public',
              'stockQty: staff and above',
              'internalCost: admin only',
              'margin: admin only',
              'supplierName: admin only',
            ].map((rule) => (
              <div key={rule} className="rounded-[var(--radius-sm)] bg-white px-4 py-3 text-sm font-semibold text-[var(--deep-aqua-dark)]">
                {rule}
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

import { mockRequests } from '@/lib/data/mock';

export default function AdminRequestsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.14em] text-[var(--deep-aqua)]">Requests</p>
        <h1 className="display-font text-5xl font-semibold">Staff queue for showroom picking</h1>
      </div>

      <section className="space-y-4">
        {mockRequests.map((request) => (
          <article key={request.requestNumber} className="glass-card rounded-[var(--radius)] p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">{request.requestNumber}</p>
                <h2 className="mt-2 text-2xl font-semibold">{request.customer}</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full bg-[rgba(39,135,131,0.08)] px-4 py-2 text-sm font-semibold text-[var(--deep-aqua)]">{request.status}</span>
                <span className="rounded-full bg-white px-4 py-2 text-sm text-[var(--text-muted)]">{request.itemCount} items</span>
                <span className="rounded-full bg-white px-4 py-2 text-sm text-[var(--text-muted)]">{request.updatedAt}</span>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

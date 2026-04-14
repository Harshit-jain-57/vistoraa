import { Activity, ClipboardList, Package, Users } from 'lucide-react';

import { StatCard } from '@/components/admin/stat-card';
import { mockDashboard, mockRequests } from '@/lib/data/mock';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.14em] text-[var(--deep-aqua)]">Dashboard</p>
        <h1 className="display-font text-5xl font-semibold">Operational visibility for assisted wholesale selling</h1>
        <p className="max-w-3xl text-base leading-7 text-[var(--text-muted)]">
          The frontend here stays intentionally calm while the backend handles the heavy lifting: RBAC, request state transitions, field visibility, and tenant-safe data access.
        </p>
      </div>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active products" value={mockDashboard.activeProducts} icon={<Package className="h-5 w-5" />} />
        <StatCard label="Pending requests" value={mockDashboard.pendingRequests} icon={<ClipboardList className="h-5 w-5" />} />
        <StatCard label="Staff online" value={mockDashboard.staffOnline} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Assist conversion" value={mockDashboard.conversionAssist} icon={<Activity className="h-5 w-5" />} />
      </section>

      <section className="glass-card rounded-[var(--radius)] p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.14em] text-[var(--text-muted)]">Live queue</p>
            <h2 className="display-font text-3xl font-semibold">Recent showroom requests</h2>
          </div>
        </div>
        <div className="space-y-4">
          {mockRequests.map((request) => (
            <div key={request.requestNumber} className="flex flex-col gap-3 rounded-[var(--radius-sm)] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">{request.requestNumber}</p>
                <p className="mt-1 text-lg font-semibold">{request.customer}</p>
              </div>
              <div className="text-sm text-[var(--text-muted)]">{request.itemCount} items</div>
              <div className="text-sm font-semibold text-[var(--deep-aqua)]">{request.status}</div>
              <div className="text-sm text-[var(--text-muted)]">{request.updatedAt}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const users = [
  { name: 'Riya Shah', role: 'OWNER', email: 'owner@vistora.demo' },
  { name: 'Arjun Mehta', role: 'STAFF', email: 'staff@vistora.demo' },
  { name: 'Priyal Doshi', role: 'ADMIN', email: 'admin@vistora.demo' },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.14em] text-[var(--deep-aqua)]">Users</p>
        <h1 className="display-font text-5xl font-semibold">Store roles and permissions</h1>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <article key={user.email} className="glass-card flex flex-col gap-3 rounded-[var(--radius)] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-sm text-[var(--text-muted)]">{user.email}</p>
            </div>
            <span className="rounded-full bg-[rgba(39,135,131,0.08)] px-4 py-2 text-sm font-semibold text-[var(--deep-aqua)]">{user.role}</span>
          </article>
        ))}
      </div>
    </div>
  );
}

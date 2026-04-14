import Link from 'next/link';
import { LayoutDashboard, Package, Shapes, ClipboardList, Users, Settings } from 'lucide-react';

const items = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Shapes },
  { href: '/admin/requests', label: 'Requests', icon: ClipboardList },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-white/10 bg-[var(--deep-aqua-dark)] px-6 py-8 text-white lg:block">
      <div className="space-y-1">
        <p className="display-font text-4xl font-semibold">Vistora</p>
        <p className="text-sm text-[var(--text-light)]">Owner and staff workspace</p>
      </div>

      <nav className="mt-10 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-[var(--radius-sm)] px-4 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-white"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

import { AdminSidebar } from '@/components/admin/sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[linear-gradient(135deg,rgba(29,107,104,0.06),transparent_45%),var(--off-white)]">
      <AdminSidebar />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 lg:px-10">{children}</main>
    </div>
  );
}

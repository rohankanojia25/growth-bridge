import { AdminSidebar } from '@/components/admin/admin-sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg flex text-text antialiased">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 p-6 sm:p-10">{children}</main>
      </div>
    </div>
  );
}

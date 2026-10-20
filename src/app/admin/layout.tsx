import { AdminSidebar } from '@/components/admin/admin-sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg flex flex-col lg:flex-row text-text antialiased">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 p-4 sm:p-6 lg:p-10 w-full min-w-0 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}

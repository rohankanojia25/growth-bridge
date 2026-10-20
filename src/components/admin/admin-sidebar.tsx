'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Package,
  FileText,
  MessageSquareQuote,
  BookOpen,
  Image as ImageIcon,
  Sliders,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';

const ADMIN_NAV = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Leads', href: '/admin/leads', icon: Users },
  { label: 'Bookings', href: '/admin/bookings', icon: Calendar },
  { label: 'Packages', href: '/admin/packages', icon: Package },
  { label: 'Case Studies', href: '/admin/case-studies', icon: FileText },
  { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
  { label: 'Blog Posts', href: '/admin/blog', icon: BookOpen },
  { label: 'Client Logos', href: '/admin/client-logos', icon: ImageIcon },
  { label: 'Site Assets', href: '/admin/assets', icon: Sliders },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const activeItem = ADMIN_NAV.find(
    (item) => pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))
  ) || ADMIN_NAV[0];

  return (
    <>
      {/* Mobile Top Bar (< 1024px) */}
      <div className="lg:hidden sticky top-0 z-40 bg-surface border-b border-border px-4 py-3 flex items-center justify-between no-print">
        <Link href="/admin/dashboard" className="flex items-center gap-2 min-h-[44px] py-1">
          <span className="font-display font-bold text-base text-text">Growth Bridge</span>
          <span className="font-mono text-[9px] text-green border border-green/30 bg-green/10 px-1.5 py-0.5 rounded uppercase">
            Admin
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-text-muted hidden sm:inline-block">
            {activeItem.label}
          </span>
          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-xl text-text hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
            aria-label={isMobileOpen ? 'Close admin menu' : 'Open admin menu'}
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Backdrop & Pane (< 1024px) */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 top-[57px] z-50 flex">
          <div
            className="fixed inset-0 bg-bg/80 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative w-72 max-w-[85vw] bg-surface border-r border-border h-[calc(100dvh-57px)] flex flex-col justify-between overflow-y-auto p-4 z-10 shadow-2xl">
            <nav className="space-y-1">
              <div className="text-eyebrow text-text-dim px-3 py-2">Management</div>
              {ADMIN_NAV.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 min-h-[44px] rounded-xl text-sm font-medium transition-colors',
                      active
                        ? 'bg-green/10 text-green font-semibold'
                        : 'text-text-muted hover:text-text hover:bg-white/[0.04]'
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-border space-y-2 mt-4">
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between px-3 min-h-[44px] rounded-xl text-xs text-text-dim hover:text-text hover:bg-white/[0.04] transition-colors"
              >
                <span>View Public Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 min-h-[44px] rounded-xl text-xs text-danger hover:bg-danger/10 transition-colors text-left"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop Sidebar (>= 1024px) */}
      <aside className="hidden lg:flex w-64 border-r border-border bg-surface flex-col justify-between shrink-0 min-h-screen">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-border">
            <Link href="/admin/dashboard" className="block">
              <span className="font-display font-bold text-lg text-text tracking-tight">
                Growth Bridge
              </span>
              <span className="block font-mono text-[10px] text-green tracking-widest uppercase mt-0.5">
                ADMIN CONTROL
              </span>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="p-3 space-y-1">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 min-h-[44px] rounded-xl text-sm font-medium transition-colors',
                    active
                      ? 'bg-green/10 text-green font-semibold'
                      : 'text-text-muted hover:text-text hover:bg-white/[0.04]'
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 min-h-[44px] rounded-xl text-xs text-text-dim hover:text-text hover:bg-white/[0.04] transition-colors"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 min-h-[44px] rounded-xl text-xs text-danger hover:bg-danger/10 transition-colors text-left"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

'use client';

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="w-64 border-r border-border bg-surface flex flex-col justify-between shrink-0 min-h-screen">
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
            const active = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
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
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-text-dim hover:text-text hover:bg-white/[0.04] transition-colors"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-danger hover:bg-danger/10 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

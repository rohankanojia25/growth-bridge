import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatDate, formatTime } from '@/lib/utils';
import { Users, Calendar, ArrowRight, TrendingUp, AlertCircle, Phone, Mail } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient();

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // 1. New leads count (7 days)
  const { count: newLeads7Days } = await supabase
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', sevenDaysAgo);

  // 2. Bookings this week
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);

  const { count: bookingsThisWeek } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .gte('slot_start', startOfWeek.toISOString())
    .neq('status', 'cancelled');

  // 3. Leads by status counts
  const { data: statusRows } = await supabase.from('leads').select('status');
  const statusCounts: Record<string, number> = {
    new: 0,
    contacted: 0,
    qualified: 0,
    proposal_sent: 0,
    won: 0,
    lost: 0,
  };
  ((statusRows || []) as Array<{ status: string | null }>).forEach((row) => {
    if (row.status && statusCounts[row.status] !== undefined) {
      statusCounts[row.status]++;
    }
  });

  // 4. 10 most recent leads
  const { data: rawRecentLeads } = await supabase
    .from('leads')
    .select('id, name, phone, email, service, status, source, created_at')
    .order('created_at', { ascending: false })
    .limit(10);
  const recentLeads = (rawRecentLeads || []) as Array<{
    id: string;
    name: string;
    phone: string;
    email: string | null;
    service: string;
    status: string;
    source: string;
    created_at: string;
  }>;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-h2 text-2xl sm:text-3xl text-text">Overview Dashboard</h1>
        <p className="text-body text-xs text-text-muted mt-1">
          Real-time inquiries and appointment pipeline.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl border-gradient bg-surface p-6 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-text-dim text-xs font-mono uppercase tracking-wider">
            <span>New Leads (7 Days)</span>
            <Users className="w-4 h-4 text-green" />
          </div>
          <div className="font-display font-bold text-3xl text-green">
            {newLeads7Days ?? 0}
          </div>
          <p className="text-[11px] text-text-muted">Inbound inquiries across all forms</p>
        </div>

        <div className="rounded-2xl glass border border-border p-6 space-y-2">
          <div className="flex items-center justify-between text-text-dim text-xs font-mono uppercase tracking-wider">
            <span>Bookings This Week</span>
            <Calendar className="w-4 h-4 text-cyan" />
          </div>
          <div className="font-display font-bold text-3xl text-text">
            {bookingsThisWeek ?? 0}
          </div>
          <p className="text-[11px] text-text-muted">Confirmed consultation slots</p>
        </div>

        <div className="rounded-2xl glass border border-border p-6 space-y-2">
          <div className="flex items-center justify-between text-text-dim text-xs font-mono uppercase tracking-wider">
            <span>Action Required</span>
            <AlertCircle className="w-4 h-4 text-danger" />
          </div>
          <div className="font-display font-bold text-3xl text-text">
            {statusCounts.new}
          </div>
          <p className="text-[11px] text-text-muted">Uncontacted new prospects</p>
        </div>

        <div className="rounded-2xl glass border border-border p-6 space-y-2">
          <div className="flex items-center justify-between text-text-dim text-xs font-mono uppercase tracking-wider">
            <span>Won Clients</span>
            <TrendingUp className="w-4 h-4 text-violet" />
          </div>
          <div className="font-display font-bold text-3xl text-violet">
            {statusCounts.won}
          </div>
          <p className="text-[11px] text-text-muted">Closed growth engagements</p>
        </div>
      </div>

      {/* Leads by Status Distribution */}
      <div className="rounded-2xl glass border border-border p-6 space-y-4">
        <h2 className="text-h3 text-base text-text">Pipeline Status Breakdown</h2>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="p-3.5 rounded-xl bg-bg border border-border text-center">
              <div className="text-[10px] font-mono uppercase tracking-wider text-text-dim">
                {status.replace('_', ' ')}
              </div>
              <div className="font-display font-bold text-xl text-text mt-1">
                {count}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 10 Most Recent Leads Table */}
      <div className="rounded-2xl glass border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-h3 text-base text-text">Recent Inquiries</h2>
          <Link
            href="/admin/leads"
            className="text-xs text-green hover:underline flex items-center gap-1 font-mono"
          >
            <span>View All Leads</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border text-text-dim uppercase font-mono tracking-wider">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Received</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(!recentLeads || recentLeads.length === 0) ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-text-dim">
                    No leads recorded yet.
                  </td>
                </tr>
              ) : (
                recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-medium text-text">
                      {lead.name}
                    </td>
                    <td className="py-3 px-4 space-y-0.5 text-text-muted">
                      <div>+91 {lead.phone}</div>
                      {lead.email && <div className="text-text-dim">{lead.email}</div>}
                    </td>
                    <td className="py-3 px-4 capitalize text-text">
                      {lead.service}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-surface-hover border border-border text-green">
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-text-dim">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/leads?lead=${lead.id}`}
                        className="text-xs text-green hover:underline font-medium"
                      >
                        Manage →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn, formatDate, formatTime } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Search,
  Filter,
  Download,
  Phone,
  MessageCircle,
  Mail,
  Calendar,
  X,
  ExternalLink,
  Clock,
  Send,
  Sparkles,
} from 'lucide-react';

interface LeadRecord {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  business_name: string | null;
  service: string;
  budget_range: string | null;
  message: string | null;
  package_id: string | null;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'won' | 'lost';
  notes: Array<{ text: string; created_at: string; author?: string }>;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  referrer: string | null;
  landing_path: string | null;
  created_at: string;
  updated_at: string;
}

interface LeadsManagerProps {
  initialLeads: LeadRecord[];
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal_sent', label: 'Proposal Sent' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
] as const;

const SERVICE_FILTER_OPTIONS = [
  { value: 'all', label: 'All Services' },
  { value: 'consulting', label: 'Business Consulting' },
  { value: 'website', label: 'Website Generation' },
  { value: 'crm', label: 'CRM for Businesses' },
  { value: 'marketing', label: 'Full-Stack Marketing' },
  { value: 'unsure', label: 'Not Sure Yet' },
] as const;

export function LeadsManager({ initialLeads }: LeadsManagerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [leads, setLeads] = useState<LeadRecord[]>(initialLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  // Drawer state from URL
  const selectedLeadId = searchParams.get('lead');
  const selectedLead = useMemo(() => {
    return leads.find((l) => l.id === selectedLeadId) || null;
  }, [leads, selectedLeadId]);

  // Note form state
  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        searchTerm === '' ||
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (lead.business_name && lead.business_name.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesService = serviceFilter === 'all' || lead.service === serviceFilter;
      const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesService && matchesSource;
    });
  }, [leads, searchTerm, statusFilter, serviceFilter, sourceFilter]);

  // Update lead status
  const updateStatus = async (leadId: string, nextStatus: LeadRecord['status']) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: nextStatus })
        .eq('id', leadId);

      if (error) throw error;

      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: nextStatus } : l))
      );
    } catch (err) {
      console.error('Failed to update lead status:', err);
    }
  };

  // Add internal note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedLead) return;

    setSavingNote(true);
    try {
      const existingNotes = Array.isArray(selectedLead.notes) ? selectedLead.notes : [];
      const updatedNotes = [
        ...existingNotes,
        {
          text: newNote.trim(),
          created_at: new Date().toISOString(),
          author: 'Admin',
        },
      ];

      const { error } = await supabase
        .from('leads')
        .update({ notes: updatedNotes })
        .eq('id', selectedLead.id);

      if (error) throw error;

      setLeads((prev) =>
        prev.map((l) => (l.id === selectedLead.id ? { ...l, notes: updatedNotes } : l))
      );
      setNewNote('');
    } catch (err) {
      console.error('Failed to save note:', err);
    } finally {
      setSavingNote(false);
    }
  };

  // Export CSV per Section 9.5
  const exportCSV = () => {
    const headers = [
      'ID',
      'Name',
      'Phone',
      'Email',
      'Business Name',
      'Service',
      'Budget Range',
      'Status',
      'Source',
      'Created At',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'Referrer',
      'Landing Path',
      'Message',
    ];

    const rows = filteredLeads.map((l) => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email || ''}"`,
      `"${(l.business_name || '').replace(/"/g, '""')}"`,
      l.service,
      l.budget_range || '',
      l.status,
      l.source,
      l.created_at,
      l.utm_source || '',
      l.utm_medium || '',
      l.utm_campaign || '',
      `"${(l.referrer || '').replace(/"/g, '""')}"`,
      `"${l.landing_path || ''}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `growth-bridge-leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-display text-2xl sm:text-3xl font-bold">Leads & Inquiries</h1>
          <p className="text-body text-xs text-text-dim mt-1">
            Total {leads.length} leads received · Showing {filteredLeads.length} filtered
          </p>
        </div>

        <Button onClick={exportCSV} variant="secondary" size="sm" className="gap-2 self-start sm:self-auto min-h-[44px]">
          <Download className="w-4 h-4 text-green" />
          <span>Export Filtered CSV</span>
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-text-dim absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, phone, email..."
            className="w-full bg-surface border border-border rounded-xl pl-9 pr-4 py-2.5 text-xs text-text placeholder:text-text-dim focus:outline-none focus:border-green min-h-[44px]"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-surface border border-border rounded-xl px-3 py-2.5 text-xs text-text focus:outline-none focus:border-green min-h-[44px]"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Service Filter */}
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="bg-surface border border-border rounded-xl px-3 py-2.5 text-xs text-text focus:outline-none focus:border-green min-h-[44px]"
        >
          {SERVICE_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Source Filter */}
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="bg-surface border border-border rounded-xl px-3 py-2.5 text-xs text-text focus:outline-none focus:border-green min-h-[44px]"
        >
          <option value="all">All Sources</option>
          <option value="contact_form">Contact Form</option>
          <option value="consultation_booking">Consultation Booking</option>
          <option value="home_quick_form">Home Quick Form</option>
        </select>
      </div>

      {/* Leads Table & Mobile Stacked Cards */}
      <div className="rounded-2xl glass border border-border overflow-hidden">
        {/* Mobile Stacked Cards (< 768px) */}
        <div className="md:hidden divide-y divide-border">
          {filteredLeads.length === 0 ? (
            <div className="py-12 text-center text-text-dim text-xs">
              No leads match the selected filters.
            </div>
          ) : (
            filteredLeads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => router.push(`/admin/leads?lead=${lead.id}`)}
                className="p-4 space-y-3 hover:bg-white/[0.03] transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-text text-sm">{lead.name}</div>
                    {lead.business_name && (
                      <div className="text-xs text-text-dim mt-0.5">{lead.business_name}</div>
                    )}
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-surface border border-border text-green shrink-0">
                    {lead.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span className="font-mono">+91 {lead.phone}</span>
                  <span className="capitalize">{lead.service}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-text-dim pt-1 border-t border-border/50">
                  <span className="font-mono">{formatDate(lead.created_at)}</span>
                  <span className="text-green font-medium flex items-center gap-1">
                    View Details →
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table (>= 768px) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border text-text-dim uppercase font-mono tracking-wider bg-surface/50">
              <tr>
                <th className="py-3 px-4">Name & Business</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-text-dim">
                    No leads match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => router.push(`/admin/leads?lead=${lead.id}`)}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-text">{lead.name}</div>
                      {lead.business_name && (
                        <div className="text-[11px] text-text-dim">{lead.business_name}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-text">
                      +91 {lead.phone}
                    </td>
                    <td className="py-3 px-4 capitalize text-text">
                      {lead.service}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-surface border border-border text-green">
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text-dim font-mono text-[11px]">
                      {lead.source.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4 font-mono text-text-dim">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-xs text-green font-medium">Drawer →</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-bg/80 backdrop-blur-sm transition-opacity"
            onClick={() => router.push('/admin/leads')}
            aria-hidden="true"
          />

          <aside className="relative w-full max-w-lg bg-surface border-l border-border h-full flex flex-col justify-between overflow-y-auto z-10 shadow-2xl p-6">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-start justify-between border-b border-border pb-4">
                <div>
                  <div className="text-eyebrow text-green">Lead Details</div>
                  <h2 className="text-h3 text-xl text-text font-bold mt-1">
                    {selectedLead.name}
                  </h2>
                  {selectedLead.business_name && (
                    <p className="text-xs text-text-dim mt-0.5">
                      {selectedLead.business_name}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => router.push('/admin/leads')}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-text-dim hover:text-text hover:bg-white/[0.04]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-text-dim">Update Pipeline Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selectedLead.id, s)}
                      className={cn(
                        'px-2 py-1.5 rounded-lg text-xs font-mono uppercase transition-colors',
                        selectedLead.status === s
                          ? 'bg-green text-[#04110A] font-semibold'
                          : 'bg-bg border border-border text-text-dim hover:text-text'
                      )}
                    >
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Communication Quick Actions */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-text-dim">Direct Contact</label>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:+91${selectedLead.phone}`}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-bg border border-border text-text hover:text-green text-xs font-semibold"
                  >
                    <Phone className="w-3.5 h-3.5 text-green" />
                    <span>Call Client</span>
                  </a>
                  <a
                    href={`https://wa.me/91${selectedLead.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-green/10 border border-green/30 text-green hover:bg-green/20 text-xs font-semibold"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
                {selectedLead.email && (
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-bg border border-border text-text hover:text-green text-xs font-medium"
                  >
                    <Mail className="w-3.5 h-3.5 text-green" />
                    <span>{selectedLead.email}</span>
                  </a>
                )}
              </div>

              {/* Metadata Fields */}
              <div className="space-y-3 border-t border-border pt-4 text-xs">
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-text-dim">Selected Service:</span>
                  <span className="text-text font-medium capitalize">{selectedLead.service}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-text-dim">Budget Range:</span>
                  <span className="text-text font-medium">{selectedLead.budget_range || 'Not specified'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-text-dim">Lead Source:</span>
                  <span className="font-mono text-text-dim">{selectedLead.source}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-text-dim">Received On:</span>
                  <span className="font-mono text-text-dim">{formatDate(selectedLead.created_at)} {formatTime(selectedLead.created_at)}</span>
                </div>
              </div>

              {/* Message */}
              {selectedLead.message && (
                <div className="space-y-1.5 border-t border-border pt-4">
                  <label className="text-xs font-mono uppercase text-text-dim">Client Inquiry Message</label>
                  <div className="p-3.5 rounded-xl bg-bg border border-border text-xs text-text-muted leading-relaxed">
                    {selectedLead.message}
                  </div>
                </div>
              )}

              {/* UTM & Attribution */}
              {(selectedLead.utm_source || selectedLead.referrer || selectedLead.landing_path) && (
                <div className="space-y-2 border-t border-border pt-4">
                  <label className="text-xs font-mono uppercase text-text-dim">Acquisition Attribution</label>
                  <div className="p-3 rounded-xl bg-bg border border-border space-y-1 font-mono text-[11px] text-text-dim">
                    {selectedLead.utm_source && <div>utm_source: <span className="text-green">{selectedLead.utm_source}</span></div>}
                    {selectedLead.utm_medium && <div>utm_medium: <span className="text-text">{selectedLead.utm_medium}</span></div>}
                    {selectedLead.utm_campaign && <div>utm_campaign: <span className="text-text">{selectedLead.utm_campaign}</span></div>}
                    {selectedLead.landing_path && <div>landing_path: <span className="text-text">{selectedLead.landing_path}</span></div>}
                    {selectedLead.referrer && <div className="truncate">referrer: <span className="text-text">{selectedLead.referrer}</span></div>}
                  </div>
                </div>
              )}

              {/* Internal Notes */}
              <div className="space-y-3 border-t border-border pt-4">
                <label className="text-xs font-mono uppercase text-text-dim">Internal Team Notes</label>
                
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {(!selectedLead.notes || selectedLead.notes.length === 0) ? (
                    <p className="text-xs text-text-dim italic">No internal notes yet.</p>
                  ) : (
                    selectedLead.notes.map((note, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-bg border border-border text-xs space-y-1">
                        <div className="flex justify-between text-[10px] text-text-dim font-mono">
                          <span>{note.author || 'Staff'}</span>
                          <span>{formatDate(note.created_at)}</span>
                        </div>
                        <p className="text-text-muted">{note.text}</p>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleAddNote} className="space-y-2">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add an internal note about client conversation..."
                    className="w-full bg-bg border border-border rounded-xl p-3 text-xs text-text placeholder:text-text-dim focus:outline-none focus:border-green resize-none h-20"
                  />
                  <Button type="submit" size="sm" loading={savingNote} className="w-full text-xs">
                    Save Note
                  </Button>
                </form>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

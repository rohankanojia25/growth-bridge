'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { formatDate, formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Search,
  Download,
  Phone,
  MessageCircle,
  X,
  Plus,
  Clock,
  Filter,
  ShieldCheck,
  Lightbulb,
  Briefcase,
  ExternalLink,
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
  source: string;
  status: string;
  notes: Array<{ at: string; text: string }>;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  referrer: string | null;
  landing_path: string | null;
  created_at: string;
  // v3 columns
  lead_type?: 'idea' | 'business' | string | null;
  idea_summary?: string | null;
  idea_stage?: string | null;
  starting_budget?: string | null;
  wants_nda?: boolean | null;
  challenge?: string | null;
  city?: string | null;
  link_url?: string | null;
}

export function LeadsManager({ initialLeads }: { initialLeads: LeadRecord[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [leads, setLeads] = useState<LeadRecord[]>(initialLeads);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [leadTypeFilter, setLeadTypeFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  // Detail Drawer state
  const selectedLeadId = searchParams.get('lead');
  const selectedLead = leads.find((l) => l.id === selectedLeadId) || null;

  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const matchesSearch =
        search === '' ||
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.phone.includes(search) ||
        (l.email && l.email.toLowerCase().includes(search.toLowerCase())) ||
        (l.business_name && l.business_name.toLowerCase().includes(search.toLowerCase())) ||
        (l.idea_summary && l.idea_summary.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
      const matchesType = leadTypeFilter === 'all' || l.lead_type === leadTypeFilter;
      const matchesSource = sourceFilter === 'all' || l.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesType && matchesSource;
    });
  }, [leads, search, statusFilter, leadTypeFilter, sourceFilter]);

  // Update Status
  const handleStatusChange = async (newStatus: string) => {
    if (!selectedLead) return;
    setUpdatingStatus(true);

    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', selectedLead.id);

      if (!error) {
        setLeads((prev) =>
          prev.map((l) => (l.id === selectedLead.id ? { ...l, status: newStatus } : l))
        );
      }
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Add Append-Only Timestamped Note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNote.trim()) return;
    setSavingNote(true);

    const noteObj = {
      at: new Date().toISOString(),
      text: newNote.trim(),
    };

    const currentNotes = Array.isArray(selectedLead.notes) ? selectedLead.notes : [];
    const updatedNotes = [...currentNotes, noteObj];

    try {
      const { error } = await supabase
        .from('leads')
        .update({ notes: updatedNotes })
        .eq('id', selectedLead.id);

      if (!error) {
        setLeads((prev) =>
          prev.map((l) => (l.id === selectedLead.id ? { ...l, notes: updatedNotes } : l))
        );
        setNewNote('');
      }
    } finally {
      setSavingNote(false);
    }
  };

  // Export CSV of filtered list with v3 columns
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Lead Type',
      'Name',
      'Phone',
      'Email',
      'Business Name',
      'City',
      'Idea Summary',
      'Idea Stage',
      'Starting Budget',
      'Wants NDA',
      'What They Sell / Message',
      'Challenge',
      'Link URL',
      'Budget Range',
      'Status',
      'Source',
      'Created At',
      'UTM Source',
      'UTM Medium',
      'Landing Path',
    ];

    const rows = filteredLeads.map((l) => [
      l.id,
      l.lead_type || 'idea',
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email || ''}"`,
      `"${(l.business_name || '').replace(/"/g, '""')}"`,
      `"${(l.city || '').replace(/"/g, '""')}"`,
      `"${(l.idea_summary || '').replace(/"/g, '""')}"`,
      `"${l.idea_stage || ''}"`,
      `"${l.starting_budget || ''}"`,
      l.wants_nda ? 'YES' : 'NO',
      `"${(l.message || '').replace(/"/g, '""')}"`,
      `"${(l.challenge || '').replace(/"/g, '""')}"`,
      `"${l.link_url || ''}"`,
      l.budget_range || '',
      l.status,
      l.source,
      l.created_at,
      l.utm_source || '',
      l.utm_medium || '',
      l.landing_path || '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `gba_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const closeDrawer = () => {
    router.push('/admin/leads');
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Title & CSV Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h2 text-2xl text-text">Leads & Inquiries</h1>
          <p className="text-xs text-text-muted mt-1">
            Showing {filteredLeads.length} of {leads.length} recorded leads.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-border text-xs font-mono text-text hover:text-green hover:border-green/40 transition-colors"
        >
          <Download className="w-4 h-4 text-green" />
          <span>Export Filtered CSV</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="rounded-2xl glass border border-border p-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-text-dim absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, phone, email, idea..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full pl-9 pr-4 rounded-xl bg-bg border border-border text-xs text-text placeholder:text-text-dim focus:outline-none focus:border-green"
          />
        </div>

        {/* Lead Type Filter */}
        <select
          value={leadTypeFilter}
          onChange={(e) => setLeadTypeFilter(e.target.value)}
          className="h-10 px-3 rounded-xl bg-bg border border-border text-xs text-text focus:outline-none focus:border-green"
        >
          <option value="all">All Paths (Idea & Business)</option>
          <option value="idea">Path: I have an idea</option>
          <option value="business">Path: I have a business</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-xl bg-bg border border-border text-xs text-text focus:outline-none focus:border-green"
        >
          <option value="all">All Pipeline Statuses</option>
          <option value="new">New (Uncontacted)</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="proposal_sent">Proposal Sent</option>
          <option value="won">Won (Active Client)</option>
          <option value="lost">Lost</option>
        </select>

        {/* Source Filter */}
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="h-10 px-3 rounded-xl bg-bg border border-border text-xs text-text focus:outline-none focus:border-green"
        >
          <option value="all">All Sources</option>
          <option value="get_started">Get Started Page</option>
          <option value="contact_form">Contact Form</option>
        </select>
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl glass border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border text-text-dim uppercase font-mono tracking-wider bg-surface/50">
              <tr>
                <th className="py-3 px-4">Path / Type</th>
                <th className="py-3 px-4">Name & Business</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Summary / Offer</th>
                <th className="py-3 px-4">Status</th>
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
                filteredLeads.map((lead) => {
                  const isIdea = lead.lead_type === 'idea';
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => router.push(`/admin/leads?lead=${lead.id}`)}
                      className="hover:bg-white/[0.03] transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider ${
                            isIdea
                              ? 'bg-green/10 text-green border border-green/30'
                              : 'bg-cyan/10 text-cyan border border-cyan/30'
                          }`}
                        >
                          {isIdea ? <Lightbulb className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                          <span>{isIdea ? 'Idea' : 'Business'}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-text">{lead.name}</div>
                        {lead.business_name && (
                          <div className="text-[11px] text-text-dim">{lead.business_name}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-text">
                        +91 {lead.phone}
                      </td>
                      <td className="py-3 px-4 text-text-muted max-w-xs truncate">
                        {isIdea ? (lead.idea_summary || 'No summary') : (lead.message || 'No description')}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-surface border border-border text-green">
                          {lead.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-text-dim">
                        {formatDate(lead.created_at)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-xs text-green font-medium">Drawer →</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-bg/75 backdrop-blur-sm"
            onClick={closeDrawer}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-lg bg-surface border-l border-border h-full overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-border pb-4">
                <div>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider mb-2 font-semibold ${
                      selectedLead.lead_type === 'idea'
                        ? 'bg-green/10 text-green border border-green/30'
                        : 'bg-cyan/10 text-cyan border border-cyan/30'
                    }`}
                  >
                    {selectedLead.lead_type === 'idea' ? 'Path: I Have An Idea' : 'Path: I Have A Business'}
                  </span>
                  <h2 className="text-h3 text-xl text-text">{selectedLead.name}</h2>
                  {selectedLead.business_name && (
                    <p className="text-xs text-text-dim">{selectedLead.business_name} ({selectedLead.city || 'Delhi'})</p>
                  )}
                </div>

                <button
                  onClick={closeDrawer}
                  className="p-2 rounded-xl text-text-dim hover:text-text hover:bg-white/[0.04]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Instant Call / WhatsApp Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:+91${selectedLead.phone}`}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-green text-[#04110A] text-xs font-semibold hover:shadow-[0_0_20px_rgba(25,242,140,0.35)] transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call +91 {selectedLead.phone}</span>
                </a>

                <a
                  href={`https://wa.me/91${selectedLead.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl glass border border-border text-xs font-semibold text-green hover:bg-green/10 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>

              {/* Status Pipeline Updater */}
              <div className="p-4 rounded-2xl bg-bg border border-border space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-text-dim block">
                  Update Lead Pipeline Status
                </label>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={updatingStatus}
                  className="h-10 w-full px-3 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none focus:border-green"
                >
                  <option value="new">New (Uncontacted)</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="proposal_sent">Proposal Sent</option>
                  <option value="won">Won (Active Client)</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              {/* PATH SPECIFIC FIELDS */}
              {selectedLead.lead_type === 'idea' ? (
                <div className="p-4 rounded-2xl bg-bg border border-border space-y-3 text-xs">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-green">
                    Idea Blueprint Details
                  </div>
                  {selectedLead.idea_summary && (
                    <div>
                      <span className="text-text-dim block mb-1">Idea Description:</span>
                      <p className="text-text leading-relaxed p-3 rounded-xl bg-surface border border-border">
                        {selectedLead.idea_summary}
                      </p>
                    </div>
                  )}
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <span className="text-text-dim">Current Stage:</span>
                    <span className="text-text font-medium">{selectedLead.idea_stage || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <span className="text-text-dim">Starting Budget:</span>
                    <span className="text-text font-medium">{selectedLead.starting_budget || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <span className="text-text-dim">Requested NDA:</span>
                    <span className={`font-medium flex items-center gap-1 ${selectedLead.wants_nda ? 'text-green' : 'text-text-muted'}`}>
                      {selectedLead.wants_nda ? <ShieldCheck className="w-3.5 h-3.5 text-green" /> : null}
                      {selectedLead.wants_nda ? 'YES — Needs NDA' : 'No'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-bg border border-border space-y-3 text-xs">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-cyan">
                    Business Profile Details
                  </div>
                  {selectedLead.message && (
                    <div>
                      <span className="text-text-dim block mb-1">What They Sell:</span>
                      <p className="text-text leading-relaxed p-3 rounded-xl bg-surface border border-border">
                        {selectedLead.message}
                      </p>
                    </div>
                  )}
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <span className="text-text-dim">City:</span>
                    <span className="text-text font-medium">{selectedLead.city || 'Delhi'}</span>
                  </div>
                  {selectedLead.link_url && (
                    <div className="flex justify-between py-1.5 border-b border-border">
                      <span className="text-text-dim">Website / Social:</span>
                      <a
                        href={selectedLead.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green hover:underline flex items-center gap-1"
                      >
                        <span className="truncate max-w-[200px]">{selectedLead.link_url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  )}
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <span className="text-text-dim">Biggest Challenge:</span>
                    <span className="text-text font-medium">{selectedLead.challenge || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <span className="text-text-dim">Monthly Marketing Budget:</span>
                    <span className="text-text font-medium">{selectedLead.budget_range || 'Not specified'}</span>
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-border">
                  <span className="text-text-dim">Email:</span>
                  <span className="text-text font-medium">{selectedLead.email || 'None'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border">
                  <span className="text-text-dim">Form Source:</span>
                  <span className="text-text font-mono">{selectedLead.source}</span>
                </div>
              </div>

              {/* Attribution */}
              <div className="p-3.5 rounded-xl bg-bg border border-border text-xs space-y-1 text-text-dim">
                <div className="text-[10px] font-mono uppercase text-green">Attribution</div>
                <div>Source: <span className="text-text">{selectedLead.utm_source || 'direct'}</span> · Medium: <span className="text-text">{selectedLead.utm_medium || 'none'}</span></div>
                <div>Landing: <span className="text-text font-mono text-[11px]">{selectedLead.landing_path || '/'}</span></div>
              </div>

              {/* Notes */}
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-text flex items-center justify-between">
                  <span>Timestamped Notes</span>
                  <span className="text-text-dim">{selectedLead.notes?.length || 0} notes</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {(!selectedLead.notes || selectedLead.notes.length === 0) ? (
                    <div className="text-xs text-text-dim italic">No internal notes added yet.</div>
                  ) : (
                    selectedLead.notes.map((note, i) => (
                      <div key={i} className="p-3 rounded-xl bg-bg border border-border text-xs space-y-1">
                        <div className="text-[10px] font-mono text-green flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(note.at)} at {formatTime(note.at)}</span>
                        </div>
                        <div className="text-text leading-relaxed">{note.text}</div>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleAddNote} className="space-y-2 pt-2">
                  <textarea
                    rows={2}
                    placeholder="Add an internal note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="w-full p-3 rounded-xl bg-bg border border-border text-xs text-text placeholder:text-text-dim focus:outline-none focus:border-green"
                  />
                  <Button type="submit" size="sm" loading={savingNote} className="text-xs h-8">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Append Note</span>
                  </Button>
                </form>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <Button variant="secondary" onClick={closeDrawer} className="w-full text-xs">
                Close Drawer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

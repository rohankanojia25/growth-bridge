'use client';

import { useState } from 'react';
import { cn, formatDate, formatTime } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Check, X, Phone, MessageCircle, ExternalLink, Calendar, Clock, Video } from 'lucide-react';

interface BookingRecord {
  id: string;
  lead_id: string;
  slot_start: string;
  slot_end: string;
  meeting_mode: 'phone' | 'google_meet' | 'office_visit';
  meet_link: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
  public_token: string;
  created_at: string;
  leads?: {
    name: string;
    phone: string;
    email: string | null;
    service: string;
  } | {
    name: string;
    phone: string;
    email: string | null;
    service: string;
  }[];
}

interface BookingsManagerProps {
  initialBookings: BookingRecord[];
}

export function BookingsManager({ initialBookings }: BookingsManagerProps) {
  const [bookings, setBookings] = useState<BookingRecord[]>(initialBookings);
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [linkInput, setLinkInput] = useState('');
  const supabase = createClient();

  const handleUpdateStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
    } catch (err) {
      console.error('Failed to update booking status:', err);
    }
  };

  const handleSaveMeetLink = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ meet_link: linkInput.trim() })
        .eq('id', id);

      if (error) throw error;

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, meet_link: linkInput.trim() } : b))
      );
      setEditingLink(null);
      setLinkInput('');
    } catch (err) {
      console.error('Failed to save meet link:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h2 text-2xl text-text">Consultation Bookings</h1>
        <p className="text-xs text-text-muted mt-1">
          Review, confirm slots, and assign Google Meet links to prospective clients.
        </p>
      </div>

      <div className="rounded-2xl glass border border-border overflow-hidden">
        {/* Mobile Stacked Cards (< 768px) */}
        <div className="md:hidden divide-y divide-border">
          {bookings.length === 0 ? (
            <div className="py-12 text-center text-text-dim text-xs">
              No consultation bookings recorded yet.
            </div>
          ) : (
            bookings.map((booking) => {
              const lead = Array.isArray(booking.leads)
                ? booking.leads[0]
                : booking.leads;

              return (
                <div key={booking.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-text text-sm">{lead?.name || 'Unknown'}</div>
                      <div className="text-xs text-text-dim font-mono mt-0.5">
                        +91 {lead?.phone} {lead?.email ? `· ${lead.email}` : ''}
                      </div>
                    </div>
                    <span
                      className={cn(
                        'inline-block px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider shrink-0',
                        booking.status === 'confirmed' && 'bg-green/10 text-green border border-green/20',
                        booking.status === 'pending' && 'bg-amber-400/10 text-amber-400 border border-amber-400/20',
                        booking.status === 'cancelled' && 'bg-danger/10 text-danger border border-danger/20'
                      )}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-text-muted bg-surface/40 p-2.5 rounded-xl border border-border">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-green" />
                      <span>{formatDate(booking.slot_start)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-green" />
                      <span>{formatTime(booking.slot_start)} IST</span>
                    </div>
                    <span className="capitalize text-text">{booking.meeting_mode.replace('_', ' ')}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                          className="flex-1 min-h-[44px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-green/10 text-green border border-green/30 text-xs font-semibold"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Confirm</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                          className="min-h-[44px] flex items-center justify-center px-3 py-2 rounded-xl bg-danger/10 text-danger border border-danger/30 text-xs"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                    {lead?.phone && (
                      <a
                        href={`https://wa.me/91${lead.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[44px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-surface border border-border text-text hover:text-green text-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-green" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop Table (>= 768px) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border text-text-dim uppercase font-mono tracking-wider bg-surface/50">
              <tr>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Meet Link</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-text-dim">
                    No consultation bookings recorded yet.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => {
                  const lead = Array.isArray(booking.leads)
                    ? booking.leads[0]
                    : booking.leads;

                  return (
                    <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-text">{lead?.name || 'Unknown'}</div>
                        <div className="text-[11px] text-text-dim font-mono">
                          +91 {lead?.phone} · {lead?.email}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <div className="text-text">{formatDate(booking.slot_start)}</div>
                        <div className="text-text-dim text-[11px]">
                          {formatTime(booking.slot_start)} IST
                        </div>
                      </td>
                      <td className="py-3 px-4 capitalize text-text">
                        {booking.meeting_mode.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={cn(
                            'inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider',
                            booking.status === 'confirmed' && 'bg-green/10 text-green border border-green/20',
                            booking.status === 'pending' && 'bg-amber-400/10 text-amber-400 border border-amber-400/20',
                            booking.status === 'cancelled' && 'bg-danger/10 text-danger border border-danger/20'
                          )}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {editingLink === booking.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="url"
                              value={linkInput}
                              onChange={(e) => setLinkInput(e.target.value)}
                              placeholder="https://meet.google.com/..."
                              className="bg-bg border border-border rounded-lg px-2 py-1 text-xs text-text w-48 focus:outline-none focus:border-green"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveMeetLink(booking.id)}
                              className="text-green hover:underline text-xs"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingLink(null)}
                              className="text-text-dim hover:text-text text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : booking.meet_link ? (
                          <div className="flex items-center gap-2 font-mono">
                            <a
                              href={booking.meet_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green hover:underline truncate max-w-[140px] inline-block"
                            >
                              {booking.meet_link}
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingLink(booking.id);
                                setLinkInput(booking.meet_link || '');
                              }}
                              className="text-text-dim hover:text-text text-[10px]"
                            >
                              Edit
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingLink(booking.id);
                              setLinkInput('');
                            }}
                            className="text-text-dim hover:text-green text-xs"
                          >
                            + Add link
                          </button>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                              className="px-2.5 py-1 rounded-lg bg-green/10 text-green hover:bg-green/20 text-xs font-medium"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                              className="px-2.5 py-1 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 text-xs"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                            className="text-text-dim hover:text-danger text-xs"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatDate, formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar, Video, Check, X, Clock, ExternalLink } from 'lucide-react';

interface BookingWithLead {
  id: string;
  slot_start: string;
  slot_end: string;
  meeting_mode: string;
  meet_link: string | null;
  status: string;
  public_token: string;
  created_at: string;
  leads: {
    name: string;
    phone: string;
    email: string | null;
    service: string;
    business_name: string | null;
  } | null;
}

export function BookingsManager({ initialBookings }: { initialBookings: BookingWithLead[] }) {
  const supabase = createClient();
  const [bookings, setBookings] = useState<BookingWithLead[]>(initialBookings);
  const [meetLinkInput, setMeetLinkInput] = useState<Record<string, string>>({});
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleStatusChange = async (bookingId: string, status: 'confirmed' | 'cancelled') => {
    setLoadingAction(bookingId);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (!error) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
        );
      }
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSaveMeetLink = async (bookingId: string) => {
    const link = meetLinkInput[bookingId]?.trim();
    if (!link) return;
    setLoadingAction(bookingId);

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ meet_link: link, status: 'confirmed' })
        .eq('id', bookingId);

      if (!error) {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId ? { ...b, meet_link: link, status: 'confirmed' } : b
          )
        );
        // Dispatch optional notification email to client
        const booking = bookings.find((b) => b.id === bookingId);
        if (booking?.leads?.email) {
          fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'meet_link_update',
              bookingId,
              meetLink: link,
            }),
          }).catch(() => {});
        }
      }
    } finally {
      setLoadingAction(null);
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
        <div className="overflow-x-auto">
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
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider ${
                            booking.status === 'confirmed'
                              ? 'bg-green/10 text-green border border-green/30'
                              : booking.status === 'cancelled'
                              ? 'bg-danger/10 text-danger border border-danger/30'
                              : 'bg-surface text-text-dim border border-border'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {booking.meet_link ? (
                          <a
                            href={booking.meet_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-green hover:underline font-mono text-[11px]"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Open Meet</span>
                          </a>
                        ) : (
                          <div className="flex items-center gap-1.5 max-w-[200px]">
                            <input
                              type="url"
                              placeholder="https://meet.google.com/..."
                              value={meetLinkInput[booking.id] ?? ''}
                              onChange={(e) =>
                                setMeetLinkInput({ ...meetLinkInput, [booking.id]: e.target.value })
                              }
                              className="h-7 px-2 w-full rounded bg-bg border border-border text-[11px] text-text"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveMeetLink(booking.id)}
                              className="px-2 py-1 rounded bg-green text-[#04110A] text-[10px] font-semibold"
                            >
                              Save
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {booking.status !== 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(booking.id, 'confirmed')}
                            className="text-xs text-green hover:underline font-medium"
                          >
                            Confirm
                          </button>
                        )}
                        {booking.status !== 'cancelled' && (
                          <button
                            onClick={() => handleStatusChange(booking.id, 'cancelled')}
                            className="text-xs text-danger hover:underline font-medium"
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

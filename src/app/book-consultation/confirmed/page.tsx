import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatDate, formatTime, BUSINESS_INFO } from '@/lib/utils';
import { CheckCircle2, Calendar, Clock, MapPin, Video, Phone, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Consultation Confirmed | Growth Bridge Accelerator',
  robots: {
    index: false,
    follow: false,
  },
};

interface ConfirmedPageProps {
  searchParams: Promise<{ t?: string }>;
}

export default async function BookingConfirmedPage({ searchParams }: ConfirmedPageProps) {
  const { t: token } = await searchParams;

  if (!token || token.length !== 24) {
    notFound();
  }

  const supabase = await createServerSupabaseClient();

  // Load booking server-side by public_token (never by primary key)
  const { data: booking, error } = await supabase
    .from('bookings')
    .select(`
      id,
      slot_start,
      slot_end,
      meeting_mode,
      meet_link,
      status,
      public_token,
      leads:lead_id (
        name,
        phone,
        email,
        business_name,
        service
      )
    `)
    .eq('public_token', token)
    .single();

  if (error || !booking) {
    notFound();
  }

  const lead = Array.isArray(booking.leads) ? booking.leads[0] : booking.leads;
  const slotDate = formatDate(booking.slot_start);
  const slotTime = formatTime(booking.slot_start);

  // Generate Add to Google Calendar URL
  const gCalStart = new Date(booking.slot_start)
    .toISOString()
    .replace(/-|:|\.\d\d\d/g, '');
  const gCalEnd = new Date(booking.slot_end)
    .toISOString()
    .replace(/-|:|\.\d\d\d/g, '');

  const gCalTitle = encodeURIComponent('Growth Diagnostic — Growth Bridge Accelerator');
  const gCalDetails = encodeURIComponent(
    `Free business growth consultation with Growth Bridge Accelerator.\nMode: ${booking.meeting_mode}\nPhone / WhatsApp: +91 88838 38363`
  );
  const gCalLocation = encodeURIComponent(
    booking.meeting_mode === 'office_visit'
      ? BUSINESS_INFO.address.full
      : booking.meeting_mode === 'google_meet'
      ? booking.meet_link || 'Google Meet link will be emailed'
      : '+91 88838 38363'
  );

  const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${gCalTitle}&dates=${gCalStart}/${gCalEnd}&details=${gCalDetails}&location=${gCalLocation}`;

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center py-16 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
      <div
        className="orb orb-green top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] pointer-events-none opacity-20"
        aria-hidden="true"
      />

      <Container className="relative z-10 max-w-xl">
        <div className="rounded-3xl border-gradient bg-surface p-8 sm:p-12 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-green/10 border border-green/30 flex items-center justify-center text-green mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-eyebrow text-green">Appointment Confirmed</span>
            <h1 className="text-h2 text-2xl sm:text-3xl text-text">
              We look forward to meeting you!
            </h1>
            <p className="text-body text-xs text-text-muted">
              A confirmation has been dispatched to {lead?.email || 'your email'}.
            </p>
          </div>

          {/* Details Card */}
          <div className="rounded-2xl bg-bg border border-border p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-mono text-text-dim uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-green" />
                Date
              </span>
              <span className="text-sm font-semibold text-text">{slotDate}</span>
            </div>

            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-mono text-text-dim uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-green" />
                Time
              </span>
              <span className="text-sm font-semibold text-text">{slotTime} IST</span>
            </div>

            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-mono text-text-dim uppercase tracking-wider flex items-center gap-2">
                {booking.meeting_mode === 'google_meet' ? (
                  <Video className="w-3.5 h-3.5 text-green" />
                ) : booking.meeting_mode === 'office_visit' ? (
                  <MapPin className="w-3.5 h-3.5 text-green" />
                ) : (
                  <Phone className="w-3.5 h-3.5 text-green" />
                )}
                Meeting Mode
              </span>
              <span className="text-sm font-medium text-text capitalize">
                {booking.meeting_mode.replace('_', ' ')}
              </span>
            </div>

            {lead?.name && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-text-dim uppercase tracking-wider">
                  Reserved For
                </span>
                <span className="text-sm text-text">{lead.name}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <a
              href={googleCalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-green text-[#04110A] font-semibold text-sm hover:shadow-[0_0_32px_rgba(25,242,140,0.35)] transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Add to Google Calendar</span>
            </a>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button href="/services" variant="secondary" className="flex-1 text-xs">
                Explore Services
              </Button>
              <Button href="/" variant="secondary" className="flex-1 text-xs">
                Back to Home
              </Button>
            </div>
          </div>

          <div className="text-center pt-2 border-t border-border">
            <p className="text-[11px] text-text-dim">
              Need to reschedule? Call or WhatsApp us at{' '}
              <a href="tel:+918883838363" className="text-green hover:underline">
                +91 88838 38363
              </a>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

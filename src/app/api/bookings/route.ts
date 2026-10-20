import { NextRequest, NextResponse } from 'next/server';
import { bookingSchema } from '@/lib/schemas';
import { checkRateLimit } from '@/lib/rate-limit';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { generateToken, formatDate, formatTime } from '@/lib/utils';
import { sendEmail, ADMIN_NOTIFICATION_EMAIL } from '@/lib/email/send';
import {
  bookingConfirmationAdmin,
  bookingConfirmationClient,
} from '@/lib/email/templates';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = (forwardedFor ? forwardedFor.split(',')[0].trim() : realIp) || '127.0.0.1';

    const isAllowed = await checkRateLimit(ip, 'bookings');
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Too many booking attempts. Please contact us on WhatsApp directly.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = bookingSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues?.[0]?.message || 'Invalid booking details';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { date, slot_start, slot_end, meeting_mode, lead } = result.data;

    if (lead.website && lead.website.length > 0) {
      return NextResponse.json({ success: true, public_token: generateToken(24) });
    }

    const supabase = createServiceRoleClient();

    // Check slot collision
    const { data: existingBooking } = await supabase
      .from('bookings')
      .select('id')
      .eq('slot_start', slot_start)
      .neq('status', 'cancelled')
      .maybeSingle();

    if (existingBooking) {
      return NextResponse.json(
        { error: 'That slot was just taken. Please choose another.' },
        { status: 409 }
      );
    }

    // Insert lead first
    const { data: leadRow, error: leadError } = await supabase
      .from('leads')
      .insert({
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        business_name: lead.business_name || null,
        service: lead.service,
        budget_range: lead.budget_range || null,
        message: lead.message || null,
        package_id: lead.package_id || null,
        source: 'consultation_booking',
        status: 'new',
        notes: [],
        utm_source: lead.utm_source || null,
        utm_medium: lead.utm_medium || null,
        utm_campaign: lead.utm_campaign || null,
        utm_term: lead.utm_term || null,
        utm_content: lead.utm_content || null,
        referrer: lead.referrer || null,
        landing_path: lead.landing_path || null,
      })
      .select('id')
      .single();

    if (leadError || !leadRow) {
      console.error('Lead error in booking flow:', leadError);
      return NextResponse.json({ error: 'Could not create booking lead.' }, { status: 500 });
    }

    // Generate random 24-character public_token
    const publicToken = generateToken(24);

    // Insert booking
    const { data: bookingRow, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        lead_id: leadRow.id,
        slot_start,
        slot_end,
        meeting_mode,
        status: 'pending',
        public_token: publicToken,
      })
      .select('id')
      .single();

    if (bookingError || !bookingRow) {
      console.error('Booking insertion error:', bookingError);
      // Rollback lead record if possible
      await supabase.from('leads').delete().eq('id', leadRow.id);
      return NextResponse.json(
        { error: 'That slot was just taken. Please choose another.' },
        { status: 409 }
      );
    }

    // Format IST date and time for emails
    const formattedDate = formatDate(slot_start);
    const formattedTime = formatTime(slot_start);

    // Send emails
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://growthbridgeaccelerator.com';
    const confirmUrl = `${siteUrl}/book-consultation/confirmed?t=${publicToken}`;

    // Admin confirmation email
    try {
      const adminMail = bookingConfirmationAdmin({
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        date: formattedDate,
        time: formattedTime,
        mode: meeting_mode,
        service: lead.service,
      });

      await sendEmail({
        to: ADMIN_NOTIFICATION_EMAIL,
        subject: adminMail.subject,
        html: adminMail.html,
      });
    } catch (e) {
      console.error('Admin booking mail failed:', e);
    }

    // Client confirmation email
    try {
      const clientMail = bookingConfirmationClient({
        name: lead.name,
        date: formattedDate,
        time: formattedTime,
        mode: meeting_mode,
        confirmUrl,
      });

      await sendEmail({
        to: lead.email,
        subject: clientMail.subject,
        html: clientMail.html,
      });
    } catch (e) {
      console.error('Client booking mail failed:', e);
    }

    return NextResponse.json({
      success: true,
      public_token: publicToken,
    });
  } catch (err) {
    console.error('Booking error:', err);
    return NextResponse.json({ error: 'Server error processing booking.' }, { status: 500 });
  }
}

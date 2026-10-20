import { NextRequest, NextResponse } from 'next/server';
import { leadSchema } from '@/lib/schemas';
import { checkRateLimit } from '@/lib/rate-limit';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { sendEmail, ADMIN_NOTIFICATION_EMAIL } from '@/lib/email/send';
import { adminLeadNotification, leadAutoReply } from '@/lib/email/templates';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // 1. IP extraction & rate limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = (forwardedFor ? forwardedFor.split(',')[0].trim() : realIp) || '127.0.0.1';

    const isAllowed = await checkRateLimit(ip, 'leads');
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait an hour or contact us on WhatsApp directly.' },
        { status: 429 }
      );
    }

    // 2. Parse & Validate Payload
    const body = await request.json();
    const result = leadSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues?.[0]?.message || 'Invalid form data';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const data = result.data;

    // 3. Honeypot check
    if (data.website && data.website.length > 0) {
      // Silently discard spam bot submissions
      return NextResponse.json({ success: true, id: 'discarded' });
    }

    // 4. Insert lead via Supabase service role
    const supabase = createServiceRoleClient();

    const insertPayload = {
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      business_name: data.business_name || null,
      service: data.service,
      budget_range: data.budget_range || null,
      message: data.message || null,
      package_id: data.package_id || null,
      source: data.source,
      status: 'new',
      notes: [],
      utm_source: data.utm_source || null,
      utm_medium: data.utm_medium || null,
      utm_campaign: data.utm_campaign || null,
      utm_term: data.utm_term || null,
      utm_content: data.utm_content || null,
      referrer: data.referrer || null,
      landing_path: data.landing_path || null,
    };

    const { data: lead, error: insertError } = await supabase
      .from('leads')
      .insert(insertPayload)
      .select('id')
      .single();

    if (insertError) {
      console.error('Lead insertion error:', insertError);
      return NextResponse.json(
        { error: 'Failed to record your enquiry. Please contact us via phone or WhatsApp.' },
        { status: 500 }
      );
    }

    // 5. Send Admin Notification Email
    try {
      const adminMail = adminLeadNotification({
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        business_name: data.business_name || undefined,
        service: data.service,
        budget_range: data.budget_range || undefined,
        message: data.message || undefined,
        source: data.source,
      });

      await sendEmail({
        to: ADMIN_NOTIFICATION_EMAIL,
        subject: adminMail.subject,
        html: adminMail.html,
      });
    } catch (e) {
      console.error('Admin email failed:', e);
    }

    // 6. Send Auto-Reply to Lead if email was provided
    if (data.email) {
      try {
        const autoReply = leadAutoReply(data.name);
        await sendEmail({
          to: data.email,
          subject: autoReply.subject,
          html: autoReply.html,
        });
      } catch (e) {
        console.error('Auto reply email failed:', e);
      }
    }

    // 7. Optional Webhook dispatch (5 second timeout, logged & non-blocking)
    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event: 'lead.created', lead }),
          signal: controller.signal,
        })
          .then(() => clearTimeout(timeoutId))
          .catch((err) => console.warn('Lead webhook failed:', err));
      } catch (e) {
        console.warn('Webhook trigger error:', e);
      }
    }

    // 8. Construct response and set post-submit cookie
    // Cookie: gba_submitted=lead, httpOnly, SameSite=Lax, maxAge: 600 seconds (10 mins)
    const response = NextResponse.json({ success: true, id: lead.id });
    response.cookies.set('gba_submitted', 'lead', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 600,
    });

    return response;
  } catch (err) {
    console.error('Lead route error:', err);
    return NextResponse.json({ error: 'Server error processing enquiry.' }, { status: 500 });
  }
}

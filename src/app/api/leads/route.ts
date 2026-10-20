import { NextRequest, NextResponse } from 'next/server';
import { leadSchema, getStartedSchema } from '@/lib/schemas';
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
        { error: 'Too many requests. Please wait a little or message us on WhatsApp directly.' },
        { status: 429 }
      );
    }

    // 2. Parse & Validate Payload
    const body = await request.json();

    // Check if get_started or standard lead
    const isGetStarted = body.source === 'get_started' || body.lead_type !== undefined;
    let validData: any;

    if (isGetStarted) {
      const result = getStartedSchema.safeParse(body);
      if (!result.success) {
        const firstError = result.error.issues?.[0]?.message || 'Invalid form data';
        return NextResponse.json({ error: firstError }, { status: 400 });
      }
      validData = result.data;
    } else {
      const result = leadSchema.safeParse(body);
      if (!result.success) {
        const firstError = result.error.issues?.[0]?.message || 'Invalid form data';
        return NextResponse.json({ error: firstError }, { status: 400 });
      }
      validData = result.data;
    }

    // 3. Honeypot check
    if (validData.website && validData.website.length > 0) {
      return NextResponse.json({ success: true, id: 'discarded' });
    }

    // 4. Insert lead via Supabase service role
    const supabase = createServiceRoleClient();

    const insertPayload = {
      name: validData.name,
      phone: validData.phone,
      email: validData.email || null,
      business_name: validData.business_name || null,
      service: validData.service || 'unsure',
      budget_range: validData.budget_range || null,
      message: validData.message || null,
      package_id: validData.package_id || null,
      source: validData.source || 'get_started',
      status: 'new',
      notes: [],
      utm_source: validData.utm_source || null,
      utm_medium: validData.utm_medium || null,
      utm_campaign: validData.utm_campaign || null,
      utm_term: validData.utm_term || null,
      utm_content: validData.utm_content || null,
      referrer: validData.referrer || null,
      landing_path: validData.landing_path || null,
      // Revision v3 fields
      lead_type: validData.lead_type || 'idea',
      idea_summary: validData.idea_summary || null,
      idea_stage: validData.idea_stage || null,
      starting_budget: validData.starting_budget || null,
      wants_nda: Boolean(validData.wants_nda),
      challenge: validData.challenge || null,
      city: validData.city || 'Delhi',
      link_url: validData.link_url || null,
    };

    const { data: lead, error: insertError } = await supabase
      .from('leads')
      .insert(insertPayload)
      .select('id')
      .maybeSingle();

    if (insertError) {
      console.error('Lead insertion error:', insertError);
    }

    // 5. Send Admin Notification Email
    try {
      const adminMail = adminLeadNotification({
        name: validData.name,
        phone: validData.phone,
        email: validData.email || undefined,
        business_name: validData.business_name || undefined,
        service: validData.service,
        budget_range: validData.budget_range || undefined,
        message: validData.message || undefined,
        source: validData.source || 'get_started',
        lead_type: validData.lead_type,
        idea_summary: validData.idea_summary,
        idea_stage: validData.idea_stage,
        starting_budget: validData.starting_budget,
        wants_nda: validData.wants_nda,
        challenge: validData.challenge,
        city: validData.city,
        link_url: validData.link_url,
      });

      await sendEmail({
        to: ADMIN_NOTIFICATION_EMAIL,
        subject: adminMail.subject,
        html: adminMail.html,
      });
    } catch (mailErr) {
      console.error('Admin email notification failed:', mailErr);
    }

    // 6. Send Client Auto-Reply Email (only if valid email provided)
    if (validData.email && validData.email.trim().length > 0) {
      try {
        const autoReply = leadAutoReply(validData.name);
        await sendEmail({
          to: validData.email,
          subject: autoReply.subject,
          html: autoReply.html,
        });
      } catch (replyErr) {
        console.error('Auto-reply email failed:', replyErr);
      }
    }

    // 7. Optional Lead Webhook dispatch
    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'lead.created',
            lead: {
              id: lead?.id || 'pending',
              ...insertPayload,
              created_at: new Date().toISOString(),
            },
          }),
          signal: AbortSignal.timeout(3000),
        });
      } catch (webhookErr) {
        console.error('Lead webhook dispatch failed:', webhookErr);
      }
    }

    const response = NextResponse.json({
      success: true,
      id: lead?.id || 'recorded',
    });

    // Set cookie indicating submission
    response.cookies.set('gba_lead_submitted', 'true', {
      path: '/',
      maxAge: 86400,
      sameSite: 'lax',
    });

    return response;
  } catch (err: unknown) {
    console.error('Unhandled lead POST error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please call or WhatsApp us directly.' },
      { status: 500 }
    );
  }
}

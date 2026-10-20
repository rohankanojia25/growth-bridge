import { BUSINESS_INFO } from '@/lib/utils';

const brandStyles = {
  bg: '#05060A',
  surface: '#10131C',
  green: '#19F28C',
  text: '#F5F7FA',
  textMuted: '#A3A9B8',
  border: 'rgba(255,255,255,0.08)',
};

function emailLayout(title: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:${brandStyles.bg};font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${brandStyles.bg};">
<tr><td align="center" style="padding:40px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:${brandStyles.surface};border:1px solid ${brandStyles.border};border-radius:12px;">
<!-- Header -->
<tr><td style="padding:32px 32px 24px;border-bottom:1px solid ${brandStyles.border};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td>
<span style="font-size:20px;font-weight:700;color:${brandStyles.text};">Growth Bridge</span>
<span style="display:block;font-size:9px;letter-spacing:0.3em;text-transform:uppercase;color:${brandStyles.green};margin-top:2px;">ACCELERATOR</span>
</td></tr>
</table>
</td></tr>
<!-- Content -->
<tr><td style="padding:32px;">
${content}
</td></tr>
<!-- Footer -->
<tr><td style="padding:24px 32px;border-top:1px solid ${brandStyles.border};">
<p style="margin:0;font-size:12px;color:${brandStyles.textMuted};line-height:1.6;">
${BUSINESS_INFO.name}<br>
${BUSINESS_INFO.address.full}<br>
Phone: ${BUSINESS_INFO.phoneFormatted}<br>
</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

export function adminLeadNotification(lead: {
  name: string;
  phone: string;
  email?: string;
  business_name?: string;
  service: string;
  budget_range?: string;
  message?: string;
  source: string;
}): { subject: string; html: string } {
  const serviceLabels: Record<string, string> = {
    consulting: 'Business Consulting',
    website: 'Website Generation',
    crm: 'CRM for Businesses',
    marketing: 'Full-Stack Marketing',
    unsure: 'Not sure yet',
  };

  const budgetLabels: Record<string, string> = {
    below_10k: 'Below ₹10,000',
    '10k_50k': '₹10,000 to ₹50,000',
    '50k_2l': '₹50,000 to ₹2,00,000',
    above_2l: 'Above ₹2,00,000',
    not_decided: 'Not decided',
  };

  const sourceLabels: Record<string, string> = {
    contact_form: 'Contact Form',
    consultation_booking: 'Consultation Booking',
    home_quick_form: 'Home Quick Form',
  };

  const content = `
<h1 style="margin:0 0 24px;font-size:24px;font-weight:600;color:${brandStyles.text};">New Lead Received</h1>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
<tr><td style="padding:12px 0;border-bottom:1px solid ${brandStyles.border};">
  <span style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:${brandStyles.green};">Name</span><br>
  <span style="font-size:16px;color:${brandStyles.text};">${lead.name}</span>
</td></tr>
<tr><td style="padding:12px 0;border-bottom:1px solid ${brandStyles.border};">
  <span style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:${brandStyles.green};">Phone</span><br>
  <span style="font-size:16px;color:${brandStyles.text};"><a href="tel:+91${lead.phone}" style="color:${brandStyles.text};text-decoration:none;">+91 ${lead.phone}</a></span>
</td></tr>
${lead.email ? `<tr><td style="padding:12px 0;border-bottom:1px solid ${brandStyles.border};">
  <span style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:${brandStyles.green};">Email</span><br>
  <span style="font-size:16px;color:${brandStyles.text};"><a href="mailto:${lead.email}" style="color:${brandStyles.text};text-decoration:none;">${lead.email}</a></span>
</td></tr>` : ''}
${lead.business_name ? `<tr><td style="padding:12px 0;border-bottom:1px solid ${brandStyles.border};">
  <span style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:${brandStyles.green};">Business</span><br>
  <span style="font-size:16px;color:${brandStyles.text};">${lead.business_name}</span>
</td></tr>` : ''}
<tr><td style="padding:12px 0;border-bottom:1px solid ${brandStyles.border};">
  <span style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:${brandStyles.green};">Service</span><br>
  <span style="font-size:16px;color:${brandStyles.text};">${serviceLabels[lead.service] || lead.service}</span>
</td></tr>
${lead.budget_range ? `<tr><td style="padding:12px 0;border-bottom:1px solid ${brandStyles.border};">
  <span style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:${brandStyles.green};">Budget</span><br>
  <span style="font-size:16px;color:${brandStyles.text};">${budgetLabels[lead.budget_range] || lead.budget_range}</span>
</td></tr>` : ''}
<tr><td style="padding:12px 0;border-bottom:1px solid ${brandStyles.border};">
  <span style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:${brandStyles.green};">Source</span><br>
  <span style="font-size:16px;color:${brandStyles.text};">${sourceLabels[lead.source] || lead.source}</span>
</td></tr>
${lead.message ? `<tr><td style="padding:12px 0;">
  <span style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:${brandStyles.green};">Message</span><br>
  <span style="font-size:14px;color:${brandStyles.textMuted};line-height:1.6;">${lead.message}</span>
</td></tr>` : ''}
</table>
<table role="presentation" cellpadding="0" cellspacing="0">
<tr>
<td style="padding-right:12px;"><a href="tel:+91${lead.phone}" style="display:inline-block;padding:12px 24px;background-color:${brandStyles.green};color:#04110A;font-weight:600;font-size:14px;text-decoration:none;border-radius:999px;">Call Now</a></td>
<td><a href="https://wa.me/91${lead.phone}" style="display:inline-block;padding:12px 24px;background-color:transparent;color:${brandStyles.text};font-weight:600;font-size:14px;text-decoration:none;border-radius:999px;border:1px solid ${brandStyles.border};">WhatsApp</a></td>
</tr>
</table>`;

  return {
    subject: `New lead: ${lead.name} — ${serviceLabels[lead.service] || lead.service}`,
    html: emailLayout('New Lead', content),
  };
}

export function leadAutoReply(name: string): { subject: string; html: string } {
  const content = `
<h1 style="margin:0 0 16px;font-size:24px;font-weight:600;color:${brandStyles.text};">Thank you, ${name}!</h1>
<p style="margin:0 0 16px;font-size:16px;color:${brandStyles.textMuted};line-height:1.65;">
We have received your enquiry and a member of our team will get back to you within one business day.
</p>
<p style="margin:0 0 24px;font-size:16px;color:${brandStyles.textMuted};line-height:1.65;">
If you need immediate assistance, feel free to call or WhatsApp us at <a href="tel:+918883838363" style="color:${brandStyles.green};text-decoration:none;">${BUSINESS_INFO.phoneFormatted}</a>.
</p>
<table role="presentation" cellpadding="0" cellspacing="0">
<tr>
<td style="padding-right:12px;"><a href="https://wa.me/918883838363" style="display:inline-block;padding:12px 24px;background-color:${brandStyles.green};color:#04110A;font-weight:600;font-size:14px;text-decoration:none;border-radius:999px;">WhatsApp Us</a></td>
</tr>
</table>`;

  return {
    subject: `We received your enquiry — Growth Bridge Accelerator`,
    html: emailLayout('Thank You', content),
  };
}

export function bookingConfirmationAdmin(booking: {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  mode: string;
  service: string;
}): { subject: string; html: string } {
  const modeLabels: Record<string, string> = {
    phone: 'Phone Call',
    google_meet: 'Google Meet',
    office_visit: 'Office Visit',
  };

  const content = `
<h1 style="margin:0 0 24px;font-size:24px;font-weight:600;color:${brandStyles.text};">New Consultation Booked</h1>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
<tr><td style="padding:12px 0;border-bottom:1px solid ${brandStyles.border};">
  <span style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:${brandStyles.green};">Client</span><br>
  <span style="font-size:16px;color:${brandStyles.text};">${booking.name}</span>
</td></tr>
<tr><td style="padding:12px 0;border-bottom:1px solid ${brandStyles.border};">
  <span style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:${brandStyles.green};">Date & Time</span><br>
  <span style="font-size:16px;color:${brandStyles.text};">${booking.date} at ${booking.time} IST</span>
</td></tr>
<tr><td style="padding:12px 0;border-bottom:1px solid ${brandStyles.border};">
  <span style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:${brandStyles.green};">Mode</span><br>
  <span style="font-size:16px;color:${brandStyles.text};">${modeLabels[booking.mode] || booking.mode}</span>
</td></tr>
<tr><td style="padding:12px 0;border-bottom:1px solid ${brandStyles.border};">
  <span style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:${brandStyles.green};">Phone</span><br>
  <span style="font-size:16px;color:${brandStyles.text};"><a href="tel:+91${booking.phone}" style="color:${brandStyles.text};text-decoration:none;">+91 ${booking.phone}</a></span>
</td></tr>
<tr><td style="padding:12px 0;">
  <span style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:${brandStyles.green};">Email</span><br>
  <span style="font-size:16px;color:${brandStyles.text};"><a href="mailto:${booking.email}" style="color:${brandStyles.text};text-decoration:none;">${booking.email}</a></span>
</td></tr>
</table>
<table role="presentation" cellpadding="0" cellspacing="0">
<tr>
<td style="padding-right:12px;"><a href="tel:+91${booking.phone}" style="display:inline-block;padding:12px 24px;background-color:${brandStyles.green};color:#04110A;font-weight:600;font-size:14px;text-decoration:none;border-radius:999px;">Call</a></td>
<td><a href="https://wa.me/91${booking.phone}" style="display:inline-block;padding:12px 24px;background-color:transparent;color:${brandStyles.text};font-weight:600;font-size:14px;text-decoration:none;border-radius:999px;border:1px solid ${brandStyles.border};">WhatsApp</a></td>
</tr>
</table>`;

  return {
    subject: `Consultation booked: ${booking.name} — ${booking.date} at ${booking.time}`,
    html: emailLayout('Consultation Booked', content),
  };
}

export function bookingConfirmationClient(booking: {
  name: string;
  date: string;
  time: string;
  mode: string;
  confirmUrl: string;
}): { subject: string; html: string } {
  const modeLabels: Record<string, string> = {
    phone: 'Phone Call',
    google_meet: 'Google Meet',
    office_visit: 'Office Visit',
  };

  const content = `
<h1 style="margin:0 0 16px;font-size:24px;font-weight:600;color:${brandStyles.text};">Your consultation is booked!</h1>
<p style="margin:0 0 24px;font-size:16px;color:${brandStyles.textMuted};line-height:1.65;">
Hi ${booking.name}, your free consultation with Growth Bridge Accelerator has been confirmed.
</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;background-color:${brandStyles.bg};border-radius:8px;padding:4px;">
<tr><td style="padding:20px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tr><td style="padding-bottom:12px;">
    <span style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:${brandStyles.green};">Date</span><br>
    <span style="font-size:18px;font-weight:600;color:${brandStyles.text};">${booking.date}</span>
  </td></tr>
  <tr><td style="padding-bottom:12px;">
    <span style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:${brandStyles.green};">Time</span><br>
    <span style="font-size:18px;font-weight:600;color:${brandStyles.text};">${booking.time} IST</span>
  </td></tr>
  <tr><td>
    <span style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:${brandStyles.green};">Mode</span><br>
    <span style="font-size:18px;font-weight:600;color:${brandStyles.text};">${modeLabels[booking.mode] || booking.mode}</span>
  </td></tr>
  </table>
</td></tr>
</table>
<p style="margin:0 0 24px;font-size:14px;color:${brandStyles.textMuted};line-height:1.65;">
If you need to reschedule, call or WhatsApp us at <a href="tel:+918883838363" style="color:${brandStyles.green};text-decoration:none;">${BUSINESS_INFO.phoneFormatted}</a>.
</p>
<table role="presentation" cellpadding="0" cellspacing="0">
<tr>
<td><a href="${booking.confirmUrl}" style="display:inline-block;padding:12px 24px;background-color:${brandStyles.green};color:#04110A;font-weight:600;font-size:14px;text-decoration:none;border-radius:999px;">View Confirmation</a></td>
</tr>
</table>`;

  return {
    subject: `Your consultation is confirmed — ${booking.date} at ${booking.time}`,
    html: emailLayout('Consultation Confirmed', content),
  };
}

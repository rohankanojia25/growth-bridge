import { BUSINESS_INFO } from '@/lib/utils';
import { FIRST_REPLY_TIME } from '@/lib/config';

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
  service?: string;
  budget_range?: string;
  message?: string;
  source: string;
  lead_type?: 'idea' | 'business';
  idea_summary?: string;
  idea_stage?: string;
  starting_budget?: string;
  wants_nda?: boolean;
  challenge?: string;
  city?: string;
  link_url?: string;
}): { subject: string; html: string } {
  const isIdea = lead.lead_type === 'idea';
  const tag = isIdea ? 'IDEA' : 'BUSINESS';
  const identifier = isIdea ? lead.name : (lead.business_name || lead.name);

  const content = `
<h1 style="margin:0 0 24px;font-size:22px;font-weight:600;color:${brandStyles.text};">New [${tag}] Inquiry Received</h1>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
<tr><td style="padding:10px 0;border-bottom:1px solid ${brandStyles.border};">
  <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${brandStyles.green};">Path / Type</span><br>
  <span style="font-size:15px;color:${brandStyles.text};font-weight:600;">${isIdea ? 'I have an idea' : 'I have a business'}</span>
</td></tr>
<tr><td style="padding:10px 0;border-bottom:1px solid ${brandStyles.border};">
  <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${brandStyles.green};">Contact Name</span><br>
  <span style="font-size:15px;color:${brandStyles.text};">${lead.name}</span>
</td></tr>
<tr><td style="padding:10px 0;border-bottom:1px solid ${brandStyles.border};">
  <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${brandStyles.green};">Phone</span><br>
  <span style="font-size:15px;color:${brandStyles.text};"><a href="tel:+91${lead.phone}" style="color:${brandStyles.text};text-decoration:none;">+91 ${lead.phone}</a></span>
</td></tr>
${lead.email ? `<tr><td style="padding:10px 0;border-bottom:1px solid ${brandStyles.border};">
  <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${brandStyles.green};">Email</span><br>
  <span style="font-size:15px;color:${brandStyles.text};"><a href="mailto:${lead.email}" style="color:${brandStyles.text};text-decoration:none;">${lead.email}</a></span>
</td></tr>` : ''}

${isIdea ? `
<tr><td style="padding:10px 0;border-bottom:1px solid ${brandStyles.border};">
  <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${brandStyles.green};">Idea Summary</span><br>
  <span style="font-size:14px;color:${brandStyles.textMuted};line-height:1.6;">${lead.idea_summary || 'N/A'}</span>
</td></tr>
<tr><td style="padding:10px 0;border-bottom:1px solid ${brandStyles.border};">
  <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${brandStyles.green};">Stage</span><br>
  <span style="font-size:14px;color:${brandStyles.text};">${lead.idea_stage || 'N/A'}</span>
</td></tr>
<tr><td style="padding:10px 0;border-bottom:1px solid ${brandStyles.border};">
  <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${brandStyles.green};">Starting Budget</span><br>
  <span style="font-size:14px;color:${brandStyles.text};">${lead.starting_budget || 'N/A'}</span>
</td></tr>
<tr><td style="padding:10px 0;border-bottom:1px solid ${brandStyles.border};">
  <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${brandStyles.green};">Requested NDA</span><br>
  <span style="font-size:14px;color:${lead.wants_nda ? brandStyles.green : brandStyles.textMuted};font-weight:600;">${lead.wants_nda ? 'YES — Requested NDA' : 'No'}</span>
</td></tr>
` : `
<tr><td style="padding:10px 0;border-bottom:1px solid ${brandStyles.border};">
  <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${brandStyles.green};">Business Name</span><br>
  <span style="font-size:15px;color:${brandStyles.text};">${lead.business_name || 'N/A'} (${lead.city || 'Delhi'})</span>
</td></tr>
<tr><td style="padding:10px 0;border-bottom:1px solid ${brandStyles.border};">
  <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${brandStyles.green};">What They Sell</span><br>
  <span style="font-size:14px;color:${brandStyles.textMuted};line-height:1.6;">${lead.message || 'N/A'}</span>
</td></tr>
${lead.link_url ? `<tr><td style="padding:10px 0;border-bottom:1px solid ${brandStyles.border};">
  <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${brandStyles.green};">Website / Social Link</span><br>
  <span style="font-size:14px;color:${brandStyles.text};"><a href="${lead.link_url}" target="_blank" style="color:${brandStyles.green};text-decoration:underline;">${lead.link_url}</a></span>
</td></tr>` : ''}
<tr><td style="padding:10px 0;border-bottom:1px solid ${brandStyles.border};">
  <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${brandStyles.green};">Growth Challenge</span><br>
  <span style="font-size:14px;color:${brandStyles.text};">${lead.challenge || 'N/A'}</span>
</td></tr>
<tr><td style="padding:10px 0;border-bottom:1px solid ${brandStyles.border};">
  <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${brandStyles.green};">Monthly Marketing Budget</span><br>
  <span style="font-size:14px;color:${brandStyles.text};">${lead.budget_range || 'N/A'}</span>
</td></tr>
`}
</table>
<table role="presentation" cellpadding="0" cellspacing="0">
<tr>
<td style="padding-right:12px;"><a href="tel:+91${lead.phone}" style="display:inline-block;padding:12px 24px;background-color:${brandStyles.green};color:#04110A;font-weight:600;font-size:14px;text-decoration:none;border-radius:999px;">Call Lead</a></td>
<td><a href="https://wa.me/91${lead.phone}" style="display:inline-block;padding:12px 24px;background-color:transparent;color:${brandStyles.text};font-weight:600;font-size:14px;text-decoration:none;border-radius:999px;border:1px solid ${brandStyles.border};">WhatsApp</a></td>
</tr>
</table>`;

  return {
    subject: `New inquiry [${tag}]: ${identifier} — Growth Bridge Accelerator`,
    html: emailLayout(`New ${tag} Inquiry`, content),
  };
}

export function leadAutoReply(name: string): { subject: string; html: string } {
  const content = `
<h1 style="margin:0 0 16px;font-size:22px;font-weight:600;color:${brandStyles.text};">Thank you, ${name}!</h1>
<p style="margin:0 0 16px;font-size:15px;color:${brandStyles.textMuted};line-height:1.65;">
We received your inquiry. A member of our team will review your details and reach out within ${FIRST_REPLY_TIME}.
</p>
<p style="margin:0 0 24px;font-size:14px;color:${brandStyles.textMuted};line-height:1.65;">
If you would like to discuss right away, feel free to WhatsApp us directly at <a href="tel:+918883838363" style="color:${brandStyles.green};text-decoration:none;">${BUSINESS_INFO.phoneFormatted}</a>.
</p>
<table role="presentation" cellpadding="0" cellspacing="0">
<tr>
<td style="padding-right:12px;"><a href="https://wa.me/918883838363" style="display:inline-block;padding:12px 24px;background-color:${brandStyles.green};color:#04110A;font-weight:600;font-size:14px;text-decoration:none;border-radius:999px;">Message on WhatsApp</a></td>
</tr>
</table>`;

  return {
    subject: `We received your inquiry — Growth Bridge Accelerator`,
    html: emailLayout('Inquiry Received', content),
  };
}

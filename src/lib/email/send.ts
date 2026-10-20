import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const EMAIL_FROM = process.env.EMAIL_FROM || 'Growth Bridge Accelerator <hello@growthbridgeaccelerator.com>';
const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'hello@growthbridgeaccelerator.com';

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}): Promise<boolean> {
  if (!resend) {
    console.warn('[Email] RESEND_API_KEY not configured. Email skipped:', { subject, to });
    return true; // Soft fail for preview/demo environments
  }

  try {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('[Email Error]', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[Email Exception]', err);
    return false;
  }
}

export { ADMIN_NOTIFICATION_EMAIL, EMAIL_FROM };

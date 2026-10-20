import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { BUSINESS_INFO } from '@/lib/utils';
import { CheckCircle2, MessageCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Thank You | Growth Bridge Accelerator',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ThankYouPage() {
  const cookieStore = await cookies();
  const submittedCookie = cookieStore.get('gba_submitted');

  // Direct access prevention per Section 7.4
  if (!submittedCookie || submittedCookie.value !== 'lead') {
    redirect('/');
  }

  return (
    <div className="relative min-h-[75vh] flex items-center justify-center py-20 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
      <div
        className="orb orb-green top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] pointer-events-none opacity-20"
        aria-hidden="true"
      />

      <Container className="relative z-10 max-w-lg text-center">
        <div className="rounded-3xl border-gradient bg-surface p-8 sm:p-12 shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-green/10 border border-green/30 flex items-center justify-center text-green mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-eyebrow text-green">Inquiry Received</span>
            <h1 className="text-h2 text-2xl sm:text-3xl text-text">
              Thank you for reaching out!
            </h1>
            <p className="text-body text-sm text-text-muted leading-relaxed">
              We have received your enquiry. A senior partner will review your business details and contact you within one business day.
            </p>
          </div>

          {/* Immediate WhatsApp Option */}
          <div className="p-4 rounded-2xl glass border border-border text-left flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-text">Need an instant response?</div>
              <div className="text-[11px] text-text-dim">Our Delhi team is active on WhatsApp.</div>
            </div>
            <a
              href={BUSINESS_INFO.whatsappUrl}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-green text-[#04110A] text-xs font-semibold hover:shadow-[0_0_20px_rgba(25,242,140,0.35)] shrink-0 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button href="/services" variant="secondary" className="flex-1 text-xs">
              Explore All Services
            </Button>
            <Button href="/blog" variant="secondary" className="flex-1 text-xs">
              Read Growth Articles
            </Button>
          </div>

          <div className="pt-2 border-t border-border">
            <Link href="/" className="text-xs text-text-dim hover:text-text">
              ← Return to Homepage
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

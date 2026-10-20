import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { FIRST_REPLY_TIME } from '@/lib/config';
import { BUSINESS_INFO } from '@/lib/utils';
import { CheckCircle2, MessageCircle, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Thank You | Growth Bridge Accelerator',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
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

          <div className="space-y-3">
            <h1 className="text-h2 text-2xl sm:text-3xl text-text">
              Thanks. We will get back to you within {FIRST_REPLY_TIME}.
            </h1>
            <p className="text-body text-sm text-text-muted leading-relaxed">
              Want to talk sooner? Message us on WhatsApp.
            </p>
          </div>

          {/* WhatsApp Button */}
          <div className="pt-2">
            <a
              href="/whatsapp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full h-12 rounded-full bg-green text-[#04110A] font-semibold text-sm hover:shadow-[0_0_32px_rgba(25,242,140,0.4)] transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message on WhatsApp</span>
            </a>
          </div>

          <div className="pt-2 border-t border-border">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-text-dim hover:text-green transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to home</span>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

'use client';

import { BUSINESS_INFO } from '@/lib/utils';
import { Phone, MessageCircle } from 'lucide-react';

export function MobileBar() {
  return (
    <>
      {/* Mobile Sticky Bar (< 768px) */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-border no-print"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 8px)' }}
      >
        <div className="grid grid-cols-2 divide-x divide-border">
          <a
            href={`tel:${BUSINESS_INFO.phone}`}
            className="flex items-center justify-center gap-2 py-3.5 px-4 text-sm font-semibold text-text active:bg-white/[0.08] transition-colors"
            aria-label="Call Growth Bridge Accelerator"
          >
            <Phone className="h-4 w-4 text-green" aria-hidden="true" />
            <span>Call Now</span>
          </a>

          <a
            href={BUSINESS_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3.5 px-4 text-sm font-semibold text-green active:bg-white/[0.08] transition-colors"
            aria-label="Chat with Growth Bridge Accelerator on WhatsApp"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Desktop Floating WhatsApp Button (>= 768px) */}
      <a
        href={BUSINESS_INFO.whatsappUrl}
        className="hidden md:flex fixed bottom-8 right-8 z-40 items-center justify-center w-14 h-14 rounded-full bg-green text-[#04110A] shadow-[0_0_32px_rgba(25,242,140,0.35)] hover:shadow-[0_0_48px_rgba(25,242,140,0.55)] hover:scale-105 active:scale-95 transition-all duration-200 no-print group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6 transition-transform group-hover:rotate-6" aria-hidden="true" />
        <span className="sr-only">Chat on WhatsApp</span>
      </a>
    </>
  );
}

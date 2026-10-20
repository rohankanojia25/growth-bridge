'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { Toast } from '@/components/ui/toast';
import { BUSINESS_INFO, SERVICES } from '@/lib/utils';
import { Phone, MessageCircle, MapPin, Clock, Copy, Mail } from 'lucide-react';

const COMPANY_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
  { label: 'Book Consultation', href: '/book-consultation' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
];

export function Footer() {
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToastMessage(`${label} copied to clipboard`);
      setShowToast(true);
    } catch {
      // Fallback
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-bg-raised border-t border-border overflow-hidden no-print">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-14 sm:py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Brand & Positioning */}
          <div className="space-y-4">
            <Logo variant="full" height={30} />
            <p className="text-sm text-text-muted leading-relaxed">
              One partner for strategy, website, CRM, and marketing. Bridging your business to growth.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-text-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-green" />
                Delhi NCR & Across India
              </span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <div className="text-eyebrow mb-4">Services</div>
            <ul className="space-y-1">
              {SERVICES.map((s) => (
                <li key={s.key}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="flex items-center min-h-[44px] text-sm text-text-muted hover:text-text transition-colors"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <div className="text-eyebrow mb-4">Company</div>
            <ul className="space-y-1">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center min-h-[44px] text-sm text-text-muted hover:text-text transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Operations */}
          <div>
            <div className="text-eyebrow mb-4">Contact & Visit</div>
            <ul className="space-y-2">
              <li className="flex items-start gap-2.5 py-1">
                <MapPin className="h-4 w-4 text-text-dim mt-0.5 shrink-0" aria-hidden="true" />
                <span className="text-xs text-text-muted leading-relaxed">
                  {BUSINESS_INFO.address.full}
                </span>
              </li>
              <li>
                <div className="flex items-center justify-between text-xs text-text-muted hover:text-text transition-colors group min-h-[44px]">
                  <a
                    href={`tel:${BUSINESS_INFO.phone}`}
                    className="flex items-center gap-2.5 min-h-[44px] flex-1 hover:underline hover:text-green"
                  >
                    <Phone className="h-4 w-4 text-text-dim shrink-0 group-hover:text-green" aria-hidden="true" />
                    <span>{BUSINESS_INFO.phoneFormatted}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(BUSINESS_INFO.phoneFormatted, 'Phone number')}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-text-dim hover:text-green transition-colors"
                    title="Click to copy phone number"
                    aria-label="Copy phone number"
                  >
                    <Copy className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                  </button>
                </div>
              </li>
              <li>
                <div className="flex items-center justify-between text-xs text-text-muted hover:text-text transition-colors group min-h-[44px]">
                  <a
                    href={`mailto:${BUSINESS_INFO.email}`}
                    className="flex items-center gap-2.5 min-h-[44px] flex-1 hover:underline hover:text-green"
                  >
                    <Mail className="h-4 w-4 text-text-dim shrink-0 group-hover:text-green" aria-hidden="true" />
                    <span className="truncate">{BUSINESS_INFO.email}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(BUSINESS_INFO.email, 'Email address')}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-text-dim hover:text-green transition-colors"
                    title="Click to copy email address"
                    aria-label="Copy email address"
                  >
                    <Copy className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                  </button>
                </div>
              </li>
              <li>
                <a
                  href={BUSINESS_INFO.whatsappUrl}
                  className="flex items-center gap-2.5 text-xs text-text-muted hover:text-green transition-colors min-h-[44px]"
                >
                  <MessageCircle className="h-4 w-4 text-text-dim shrink-0" aria-hidden="true" />
                  <span>Chat on WhatsApp</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5 py-1">
                <Clock className="h-4 w-4 text-text-dim mt-0.5 shrink-0" aria-hidden="true" />
                <span className="text-xs text-text-muted leading-relaxed">
                  {BUSINESS_INFO.hours}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Copyright Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-text-dim hover:text-text transition-colors min-h-[44px] flex items-center"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-xs text-text-dim text-center sm:text-right">
            © {currentYear} Growth Bridge Accelerator. All rights reserved.
          </p>
        </div>
      </div>

      {/* Ghost Wordmark (clipped by page bottom, hidden below 768px) */}
      <div
        className="hidden md:block select-none pointer-events-none overflow-hidden h-[90px] w-full text-center"
        aria-hidden="true"
      >
        <span
          className="font-display font-extrabold text-[120px] lg:text-[150px] leading-none tracking-tighter whitespace-nowrap inline-block -translate-y-6"
          style={{
            WebkitTextStroke: '1px rgba(255,255,255,0.06)',
            WebkitTextFillColor: 'transparent',
          }}
        >
          GROWTH BRIDGE
        </span>
      </div>

      <Toast
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </footer>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { Toast } from '@/components/ui/toast';
import { BUSINESS_INFO } from '@/lib/utils';
import { Phone, MessageCircle, MapPin, Clock, Copy, Mail } from 'lucide-react';

interface FooterProps {
  hasCaseStudies?: boolean;
  hasPricing?: boolean;
}

const SERVICE_LINKS = [
  { label: '01. Plan: Business Strategy', href: '/services#plan' },
  { label: '02. Build: Website & Brand', href: '/services#build' },
  { label: '03. Market: Lead Generation', href: '/services#market' },
  { label: '04. Retain: Growth & CRM', href: '/services#grow' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
];

export function Footer({ hasCaseStudies = false, hasPricing = false }: FooterProps) {
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

  const companyLinks = [
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Get Started', href: '/get-started' },
    ...(hasPricing ? [{ label: 'Pricing', href: '/pricing' }] : []),
    ...(hasCaseStudies ? [{ label: 'Case Studies', href: '/case-studies' }] : []),
  ];

  return (
    <footer className="relative bg-bg-raised border-t border-border overflow-hidden no-print">
      <div className="mx-auto max-w-[1200px] px-6 max-[640px]:px-4 py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Brand & Positioning */}
          <div className="space-y-4">
            <Logo variant="full" height={30} />
            <p className="text-sm text-text-muted leading-relaxed">
              A business consultancy and marketing team in Delhi that helps ideas become businesses and businesses grow.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-text-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-green" />
                Delhi NCR & Across India
              </span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <div className="text-eyebrow mb-4">Our Services</div>
            <ul className="space-y-2.5">
              {SERVICE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted hover:text-green transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <div className="text-eyebrow mb-4">Company</div>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted hover:text-green transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Office */}
          <div className="space-y-3">
            <div className="text-eyebrow mb-4">Delhi Office</div>
            <div className="space-y-2 text-sm text-text-muted">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-green shrink-0 mt-1" />
                <span className="text-xs leading-relaxed">{BUSINESS_INFO.address.full}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-green shrink-0" />
                <span className="text-xs">{BUSINESS_INFO.hours}</span>
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <Phone className="h-4 w-4 text-green shrink-0" />
                <a
                  href={`tel:${BUSINESS_INFO.phone}`}
                  className="text-xs hover:text-green transition-colors"
                >
                  {BUSINESS_INFO.phoneFormatted}
                </a>
                <button
                  type="button"
                  onClick={() => copyToClipboard(BUSINESS_INFO.phone, 'Phone number')}
                  className="text-text-dim hover:text-text transition-colors p-1"
                  aria-label="Copy phone number"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                <MessageCircle className="h-4 w-4 text-green shrink-0" />
                <a
                  href="/whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-green hover:underline"
                >
                  WhatsApp Us
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-green shrink-0" />
                <a
                  href={`mailto:${BUSINESS_INFO.email}`}
                  className="text-xs hover:text-green transition-colors"
                >
                  {BUSINESS_INFO.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-dim">
          <p>© {currentYear} {BUSINESS_INFO.name}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-text transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Toast
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </footer>
  );
}

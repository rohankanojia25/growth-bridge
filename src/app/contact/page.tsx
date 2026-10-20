import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Eyebrow } from '@/components/ui/eyebrow';
import { LeadForm } from '@/components/forms/lead-form';
import { SiteImage } from '@/components/ui/site-image';
import { BUSINESS_INFO } from '@/lib/utils';
import { Phone, MessageCircle, MapPin, Clock, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | Growth Bridge Accelerator Delhi',
  description:
    'Get in touch with Growth Bridge Accelerator in Gandhi Nagar, Delhi. Call or WhatsApp +91 88838 38363 or send an inquiry to discuss your business growth plan.',
  alternates: {
    canonical: '/contact',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://growthbridgeaccelerator.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Contact',
      item: 'https://growthbridgeaccelerator.com/contact',
    },
  ],
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Section className="pt-12 pb-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Form (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <Eyebrow pill>Get In Touch</Eyebrow>
                <h1 className="text-display text-3xl sm:text-4xl lg:text-5xl">
                  Let us discuss your <span className="gradient-text">growth bridge.</span>
                </h1>
                <p className="text-body text-text-muted leading-relaxed">
                  Send us a quick note about your business in Delhi NCR or across India. We review every enquiry personally and respond within one business day.
                </p>
              </div>

              <div className="rounded-3xl glass border border-border p-6 sm:p-10 shadow-2xl">
                <Suspense fallback={<div className="text-sm text-text-muted">Loading form...</div>}>
                  <LeadForm />
                </Suspense>
              </div>
            </div>

            {/* Right Column: Info Card (5 cols on lg, below form on mobile/tablet) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Direct Channels Card */}
              <div className="rounded-3xl glass border border-border p-7 space-y-6">
                <div>
                  <span className="text-eyebrow text-green">Direct Reach</span>
                  <h3 className="text-h3 text-xl text-text mt-1">Delhi Headquarters</h3>
                </div>

                <div className="divide-y divide-border/40 text-sm text-text-muted">
                  <div className="flex items-start gap-3.5 py-3 first:pt-0">
                    <MapPin className="w-5 h-5 text-green mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-text text-sm">Office Address</div>
                      <div className="text-xs leading-relaxed mt-0.5">
                        {BUSINESS_INFO.address.full}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 py-3">
                    <Phone className="w-5 h-5 text-green mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-text text-sm">Direct Phone</div>
                      <a
                        href={`tel:${BUSINESS_INFO.phone}`}
                        className="text-xs text-text hover:text-green mt-0.5 inline-flex items-center min-h-[44px]"
                      >
                        {BUSINESS_INFO.phoneFormatted}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 py-3">
                    <MessageCircle className="w-5 h-5 text-green mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-text text-sm">WhatsApp Inquiries</div>
                      <a
                        href={BUSINESS_INFO.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-green hover:underline mt-0.5 inline-flex items-center min-h-[44px]"
                      >
                        Start WhatsApp Chat (+91 88838 38363)
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 py-3 last:pb-0">
                    <Clock className="w-5 h-5 text-green mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-text text-sm">Working Hours</div>
                      <div className="text-xs text-text-muted mt-0.5">
                        {BUSINESS_INFO.hours}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy Guarantee Card */}
              <div className="rounded-2xl bg-surface/50 border border-border p-5 flex items-center gap-3.5">
                <ShieldCheck className="w-6 h-6 text-green shrink-0" />
                <p className="text-xs text-text-muted leading-relaxed">
                  Your business data and contact details are strictly confidential and will never be shared with outside vendors.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

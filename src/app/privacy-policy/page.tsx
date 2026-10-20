import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Eyebrow } from '@/components/ui/eyebrow';
import { BUSINESS_INFO } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Privacy Policy | Growth Bridge Accelerator',
  description:
    'Privacy Policy for Growth Bridge Accelerator. Learn how we collect, handle, and protect your business data under Indian privacy standards.',
  alternates: {
    canonical: '/privacy-policy',
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
      name: 'Privacy Policy',
      item: 'https://growthbridgeaccelerator.com/privacy-policy',
    },
  ],
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Section className="pt-12 pb-24">
        <Container>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-3">
              <Eyebrow pill>Legal Information</Eyebrow>
              <h1 className="text-display text-3xl sm:text-4xl lg:text-5xl">
                Privacy Policy
              </h1>
              <p className="text-xs font-mono text-text-dim">
                Effective Date: 20 October 2026 · Growth Bridge Accelerator, Delhi
              </p>
            </div>

            <div className="prose prose-invert max-w-none text-text-muted space-y-6 text-sm leading-relaxed">
              <section className="space-y-3">
                <h2 className="text-h3 text-xl text-text">1. Overview</h2>
                <p>
                  Growth Bridge Accelerator ("we," "our," or "us"), located at {BUSINESS_INFO.address.full}, operates this website to provide business consulting, website generation, CRM implementation, and full-stack marketing services to Indian small and mid-sized enterprises.
                </p>
                <p>
                  This Privacy Policy describes how we collect, process, and safeguard information submitted through our contact forms, consultation booking calendar, and digital interactions.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-h3 text-xl text-text">2. Information We Collect</h2>
                <p>
                  We only collect personal and commercial details that you voluntarily supply to us, including:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Contact Details:</strong> Full name, mobile number, and email address.</li>
                  <li><strong>Business Details:</strong> Business name, operating sector, monthly marketing budget range, and business growth challenges.</li>
                  <li><strong>Consultation Preferences:</strong> Preferred appointment date, slot time, and meeting format (Phone Call, Google Meet, or Delhi Office Visit).</li>
                  <li><strong>Technical Analytics:</strong> Device type, approximate city locality, referring URL, and UTM marketing parameters gathered via Google Analytics 4 (GA4).</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-h3 text-xl text-text">3. Cookies & Analytics</h2>
                <p>
                  We deploy privacy-conscious cookies to evaluate site usage. GA4 is initialized solely following your explicit consent via our cookie banner. If you choose "Decline," tracking scripts remain inactive. You can clear your cookie consent status at any time via your browser settings.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-h3 text-xl text-text">4. How We Use Your Data</h2>
                <p>
                  The data you provide is used strictly to:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Schedule, confirm, and conduct your requested 30-minute growth diagnostic session.</li>
                  <li>Transmit consultation calendar invites and meeting links to your email and WhatsApp.</li>
                  <li>Prepare customized strategic proposals and audit reports tailored to your company.</li>
                  <li>Comply with applicable Indian commercial laws and taxation regulations.</li>
                </ul>
                <p>
                  We do not sell, rent, or trade your contact or business information to third-party data brokers or external marketing vendors.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-h3 text-xl text-text">5. Data Retention & Deletion Rights</h2>
                <p>
                  We retain inquiry records for operational continuity and auditing purposes. You hold the unconditional right to request the complete deletion or correction of your personal data.
                </p>
                <p>
                  To request data removal, contact our data administrator directly:
                </p>
                <div className="p-4 rounded-xl bg-surface border border-border text-xs space-y-1">
                  <div><strong>Email:</strong> {BUSINESS_INFO.email}</div>
                  <div><strong>Phone:</strong> {BUSINESS_INFO.phoneFormatted}</div>
                  <div><strong>Physical Address:</strong> {BUSINESS_INFO.address.full}</div>
                </div>
              </section>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

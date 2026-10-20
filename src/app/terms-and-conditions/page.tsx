import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Eyebrow } from '@/components/ui/eyebrow';
import { BUSINESS_INFO } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Growth Bridge Accelerator',
  description:
    'Terms and conditions of engagement for advisory, website generation, CRM implementation, and marketing services by Growth Bridge Accelerator, Delhi.',
  alternates: {
    canonical: '/terms-and-conditions',
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
      name: 'Terms & Conditions',
      item: 'https://growthbridgeaccelerator.com/terms-and-conditions',
    },
  ],
};

export default function TermsAndConditionsPage() {
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
                Terms & Conditions
              </h1>
              <p className="text-xs font-mono text-text-dim">
                Effective Date: 20 October 2026 · Growth Bridge Accelerator, Delhi
              </p>
            </div>

            <div className="prose prose-invert max-w-none text-text-muted space-y-6 text-sm leading-relaxed">
              <section className="space-y-3">
                <h2 className="text-h3 text-xl text-text">1. Acceptance of Terms</h2>
                <p>
                  By accessing the website of Growth Bridge Accelerator, scheduling a consultation, or retaining our services, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree with any provision, please refrain from using our platforms.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-h3 text-xl text-text">2. Nature of Services</h2>
                <p>
                  Growth Bridge Accelerator provides professional business growth advisory, custom website engineering, customer relationship management (CRM) architecture, and full-stack marketing services.
                </p>
                <p>
                  Our initial 30-minute discovery consultation is provided completely free of charge. Retained engagements, implementation projects, and monthly marketing retainers are governed by formal statements of work (SOW) executed separately between both parties.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-h3 text-xl text-text">3. Intellectual Property & Ownership</h2>
                <p>
                  Upon full settlement of agreed implementation fees, clients receive full ownership of bespoke website code, custom database schemas, and creative marketing collateral generated specifically for their business.
                </p>
                <p>
                  Growth Bridge Accelerator retains ownership of proprietary internal frameworks, diagnostic templates, and reusable software libraries developed independently of client-specific contracts.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-h3 text-xl text-text">4. Client Responsibilities</h2>
                <p>
                  To achieve optimal project velocity, clients must provide timely access to necessary business materials, domain DNS controls, branding assets, and feedback on deliverables within agreed sprint timelines.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-h3 text-xl text-text">5. Governing Law & Dispute Resolution</h2>
                <p>
                  These Terms are governed by and construed in accordance with the laws of the Republic of India. Any legal dispute, controversy, or claim arising out of our services shall be subject exclusively to the jurisdiction of the competent courts of Delhi, India.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-h3 text-xl text-text">6. Contact Information</h2>
                <p>
                  For inquiries regarding service agreements or terms of use:
                </p>
                <div className="p-4 rounded-xl bg-surface border border-border text-xs space-y-1">
                  <div><strong>Legal Entity:</strong> Growth Bridge Accelerator</div>
                  <div><strong>Address:</strong> {BUSINESS_INFO.address.full}</div>
                  <div><strong>Phone:</strong> {BUSINESS_INFO.phoneFormatted}</div>
                  <div><strong>Email:</strong> {BUSINESS_INFO.email}</div>
                </div>
              </section>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

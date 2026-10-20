import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Eyebrow } from '@/components/ui/eyebrow';
import { TwoPathButtons } from '@/components/ui/two-path-buttons';
import { PricingView, type PackageRecord } from '@/components/pricing/pricing-view';
import { createPublicSupabaseClient } from '@/lib/supabase/server';

export const revalidate = 600; // ISR 600s

export const metadata: Metadata = {
  title: 'Pricing & Investment | Growth Bridge Accelerator',
  description:
    'Clear, transparent pricing for consulting, website development, marketing campaigns, and CRM setup. Share your idea or bring your business.',
  alternates: {
    canonical: '/pricing',
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
      name: 'Pricing',
      item: 'https://growthbridgeaccelerator.com/pricing',
    },
  ],
};

export default async function PricingPage() {
  let publishedPackages: PackageRecord[] = [];

  try {
    const supabase = createPublicSupabaseClient();
    const { data } = await supabase
      .from('packages')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (data && data.length > 0) {
      publishedPackages = data;
    }
  } catch {
    // Database empty or offline — shows production empty state
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Section className="pt-12 pb-24">
        <Container>
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
            <Eyebrow pill>Clear & Transparent</Eyebrow>
            <h1 className="text-display text-3xl sm:text-4xl lg:text-5xl">
              Investment plans built for <span className="gradient-text">growth.</span>
            </h1>
            <p className="text-body text-text-muted max-w-xl mx-auto leading-relaxed">
              No hidden costs or unexpected invoices. Every project has agreed deliverables and clear terms before we start.
            </p>
          </div>

          <PricingView packages={publishedPackages} />

          {/* Ending Two Path Buttons */}
          <div className="mt-20 pt-12 border-t border-border text-center max-w-xl mx-auto space-y-4">
            <h3 className="font-display font-semibold text-lg text-text">
              Looking for a custom plan?
            </h3>
            <p className="text-body text-xs text-text-muted">
              Plans are built around your goals. Share your idea or your business and get a clear quote in writing.
            </p>
            <div className="flex justify-center">
              <TwoPathButtons size="default" location="pricing_bottom" />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

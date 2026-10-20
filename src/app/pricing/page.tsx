import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createPublicSupabaseClient } from '@/lib/supabase/server';
import { formatINR, BUSINESS_INFO } from '@/lib/utils';
import { Check, MessageCircle, ArrowRight } from 'lucide-react';

export const revalidate = 600; // ISR 600s per Section 6

export const metadata: Metadata = {
  title: 'Pricing & Investment | Growth Bridge Accelerator',
  description:
    'Transparent growth plans tailored for Indian businesses. Choose from strategic advisory, website generation, CRM automation, or full-stack marketing retainers.',
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

interface PackageRecord {
  id: string;
  name: string;
  slug: string;
  category: string;
  short_description: string | null;
  price_inr: number | null;
  price_label: string | null;
  billing_period: string;
  features: string[];
  is_highlighted: boolean;
  sort_order: number;
}

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

  const hasPackages = publishedPackages.length > 0;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Section className="pt-12 pb-24">
        <Container>
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <Eyebrow pill>Transparent Investment</Eyebrow>
            <h1 className="text-display text-3xl sm:text-4xl lg:text-5xl">
              Growth plans built for <span className="gradient-text">predictable ROI.</span>
            </h1>
            <p className="text-body text-text-muted max-w-xl mx-auto leading-relaxed">
              No hidden fees, no opaque markup. We operate on structured flat deliverables and transparent monthly retainers.
            </p>
          </div>

          {/* Section 9.8: Empty State (Default production behavior while no package is published) */}
          {!hasPackages ? (
            <div className="max-w-xl mx-auto">
              <div className="rounded-3xl border-gradient bg-surface p-8 sm:p-12 text-center space-y-6 shadow-2xl">
                <span className="text-eyebrow text-green">Tailored Engagements</span>
                <h2 className="text-h2 text-2xl sm:text-3xl text-text">
                  Custom plans for your business
                </h2>
                <p className="text-body text-text-muted leading-relaxed">
                  Every business is different. Tell us your goals and we will recommend the right plan within one business day.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button href="/book-consultation" showArrow>
                    Book Free Consultation
                  </Button>
                  <a
                    href={BUSINESS_INFO.whatsappUrl}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-text hover:text-green hover:border-green/40 transition-colors text-sm font-semibold"
                  >
                    <MessageCircle className="w-4 h-4 text-green" />
                    <span>WhatsApp Us</span>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            /* Render Published Packages */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {publishedPackages.map((pkg) => {
                const formattedPrice = pkg.price_inr
                  ? formatINR(pkg.price_inr)
                  : pkg.price_label || 'Custom Quote';

                const billingText =
                  pkg.billing_period === 'monthly'
                    ? '/ month'
                    : pkg.billing_period === 'yearly'
                    ? '/ year'
                    : pkg.billing_period === 'quarterly'
                    ? '/ quarter'
                    : 'one-time';

                return (
                  <div
                    key={pkg.id}
                    className={`rounded-3xl flex flex-col justify-between p-8 transition-all ${
                      pkg.is_highlighted
                        ? 'border-gradient bg-surface shadow-[0_0_48px_rgba(25,242,140,0.15)] relative scale-[1.02]'
                        : 'glass border border-border bg-surface/60'
                    }`}
                  >
                    <div>
                      {pkg.is_highlighted && (
                        <div className="inline-block px-3 py-1 rounded-full bg-green text-[#04110A] text-[10px] font-mono font-bold uppercase tracking-wider mb-4">
                          Most Chosen
                        </div>
                      )}

                      <div className="text-eyebrow text-green uppercase text-xs mb-1">
                        {pkg.category}
                      </div>

                      <h3 className="text-h3 text-2xl text-text mb-2">{pkg.name}</h3>

                      {pkg.short_description && (
                        <p className="text-body text-xs text-text-muted mb-6">
                          {pkg.short_description}
                        </p>
                      )}

                      <div className="mb-6 pt-4 border-t border-border">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-display font-bold text-3xl sm:text-4xl text-text">
                            {formattedPrice}
                          </span>
                          {pkg.price_inr && (
                            <span className="text-xs text-text-dim font-mono">{billingText}</span>
                          )}
                        </div>
                      </div>

                      {/* Features List */}
                      {Array.isArray(pkg.features) && pkg.features.length > 0 && (
                        <ul className="space-y-3 mb-8 text-xs text-text-muted">
                          {pkg.features.map((feat, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <Check className="w-4 h-4 text-green shrink-0 mt-0.5" />
                              <span className="text-text">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <Button
                      href={`/book-consultation?package=${pkg.slug}`}
                      variant={pkg.is_highlighted ? 'primary' : 'secondary'}
                      className="w-full"
                      showArrow
                    >
                      Get This Package
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}

import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createPublicSupabaseClient } from '@/lib/supabase/server';
import { formatINR, BUSINESS_INFO, cn } from '@/lib/utils';
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
    const query = supabase
      .from('packages')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
    const result: any = await Promise.race([query, timeout]);

    if (result && result.data && result.data.length > 0) {
      publishedPackages = result.data;
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

          {/* Section 9.8: Empty State */}
          {!hasPackages ? (
            <div className="max-w-xl mx-auto">
              <div className="rounded-3xl border-gradient bg-surface p-6 sm:p-10 lg:p-12 text-center space-y-6 shadow-2xl">
                <span className="text-eyebrow text-green">Tailored Engagements</span>
                <h2 className="text-h2 text-2xl sm:text-3xl text-text">
                  Custom plans for your business
                </h2>
                <p className="text-body text-text-muted leading-relaxed">
                  Every business is different. Tell us your goals and we will recommend the right plan within one business day.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 [&>*]:w-full sm:[&>*]:w-auto">
                  <Button href="/book-consultation" showArrow>
                    Book Free Consultation
                  </Button>
                  <a
                    href={BUSINESS_INFO.whatsappUrl}
                    className="inline-flex items-center justify-center gap-2 px-6 min-h-[44px] rounded-full border border-border text-text hover:text-green hover:border-green/40 transition-colors text-sm font-semibold"
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

                const periodLabel =
                  pkg.billing_period === 'monthly'
                    ? '/ month'
                    : pkg.billing_period === 'yearly'
                    ? '/ year'
                    : ' flat';

                return (
                  <Card
                    key={pkg.id}
                    spotlight
                    gradient={pkg.is_highlighted}
                    className={cn(
                      'flex flex-col justify-between p-6 sm:p-8',
                      pkg.is_highlighted && 'border-green/40 ring-1 ring-green/20'
                    )}
                  >
                    <div className="space-y-6">
                      {pkg.is_highlighted && (
                        <span className="inline-block px-3 py-1 rounded-full bg-green/10 border border-green/30 text-green font-mono text-xs uppercase tracking-wider">
                          Most Popular
                        </span>
                      )}

                      <div>
                        <h2 className="text-h3 text-2xl text-text">{pkg.name}</h2>
                        {pkg.short_description && (
                          <p className="text-body text-xs text-text-muted mt-2 leading-relaxed">
                            {pkg.short_description}
                          </p>
                        )}
                      </div>

                      <div className="pt-4 border-t border-border">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-display font-bold text-3xl sm:text-4xl text-text">
                            {formattedPrice}
                          </span>
                          {pkg.price_inr && (
                            <span className="text-xs font-mono text-text-dim">
                              {periodLabel}
                            </span>
                          )}
                        </div>
                      </div>

                      {Array.isArray(pkg.features) && pkg.features.length > 0 && (
                        <div className="space-y-3 pt-4 border-t border-border">
                          <div className="text-xs font-mono uppercase tracking-wider text-text-dim">
                            Included in this plan:
                          </div>
                          <ul className="space-y-2.5">
                            {pkg.features.map((feat, i) => (
                              <li key={i} className="flex items-start gap-2.5 text-xs text-text">
                                <Check className="w-4 h-4 text-green shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="pt-8">
                      <Button
                        href={`/book-consultation?package=${pkg.slug}`}
                        variant={pkg.is_highlighted ? 'primary' : 'secondary'}
                        className="w-full"
                        showArrow
                      >
                        Choose {pkg.name}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}

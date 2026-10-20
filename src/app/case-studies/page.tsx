import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Card } from '@/components/ui/card';
import { TwoPathButtons } from '@/components/ui/two-path-buttons';
import { createPublicSupabaseClient } from '@/lib/supabase/server';
import { ArrowRight, TrendingUp } from 'lucide-react';

export const revalidate = 600; // ISR 600s

export const metadata: Metadata = {
  title: 'Case Studies | Growth Bridge Accelerator',
  description:
    'Client outcomes and case studies from Growth Bridge Accelerator across strategy, web presence, customer acquisition, and retention.',
  alternates: {
    canonical: '/case-studies',
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
      name: 'Case Studies',
      item: 'https://growthbridgeaccelerator.com/case-studies',
    },
  ],
};

interface CaseStudyRecord {
  id: string;
  title: string;
  slug: string;
  client_name: string;
  industry: string | null;
  summary: string | null;
  cover_image_url: string | null;
  results: Array<{ label: string; value: string }> | null;
}

export default async function CaseStudiesPage() {
  let caseStudies: CaseStudyRecord[] = [];

  try {
    const supabase = createPublicSupabaseClient();
    const { data } = await supabase
      .from('case_studies')
      .select('id, title, slug, client_name, industry, summary, cover_image_url, results')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      caseStudies = data;
    }
  } catch {
    // Database empty or offline — shows production empty state
  }

  const hasStudies = caseStudies.length > 0;

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
            <Eyebrow pill>Client Outcomes</Eyebrow>
            <h1 className="text-display text-3xl sm:text-4xl lg:text-5xl">
              Case studies & <span className="gradient-text">results.</span>
            </h1>
            <p className="text-body text-text-muted max-w-xl mx-auto leading-relaxed">
              Explore how our connected growth system helps businesses solve bottlenecks and reach sustainable revenue.
            </p>
          </div>

          {!hasStudies ? (
            /* v3 Exact empty state */
            <div className="max-w-md mx-auto text-center">
              <div className="rounded-3xl border-gradient bg-surface p-8 sm:p-12 space-y-4 shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-green/10 border border-green/20 flex items-center justify-center text-green mx-auto">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h2 className="text-h3 text-xl text-text">Case Studies</h2>
                <p className="text-body text-sm text-text-muted leading-relaxed">
                  Case studies are being added. Tell us about your idea or business and see what we can do.
                </p>
                <div className="pt-3 flex justify-center">
                  <TwoPathButtons size="default" location="case_studies_empty_state" />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {caseStudies.map((study) => (
                <Card key={study.id} spotlight className="flex flex-col justify-between p-7">
                  <div>
                    {study.industry && (
                      <span className="text-eyebrow text-green uppercase text-xs mb-2 block">
                        {study.industry}
                      </span>
                    )}

                    <h2 className="text-h3 text-xl text-text mb-2">{study.title}</h2>

                    <div className="text-xs text-text-dim mb-4">
                      Client: <span className="text-text font-medium">{study.client_name}</span>
                    </div>

                    {study.summary && (
                      <p className="text-body text-xs text-text-muted line-clamp-3 mb-6">
                        {study.summary}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Link
                      href={`/case-studies/${study.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-green hover:underline group"
                    >
                      <span>Read Full Study</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Page ending two path buttons */}
          <div className="mt-20 pt-12 border-t border-border text-center max-w-xl mx-auto space-y-4">
            <h3 className="font-display font-semibold text-lg text-text">
              Have an idea or a business to grow?
            </h3>
            <div className="flex justify-center">
              <TwoPathButtons size="default" location="case_studies_bottom" />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

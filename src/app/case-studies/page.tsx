import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createPublicSupabaseClient } from '@/lib/supabase/server';
import { ArrowRight, TrendingUp } from 'lucide-react';

export const revalidate = 600; // ISR 600s per Section 6

export const metadata: Metadata = {
  title: 'Case Studies & Results | Growth Bridge Accelerator',
  description:
    'Discover how Growth Bridge Accelerator helps small and mid-sized businesses build high-converting websites, automated CRMs, and targeted marketing campaigns.',
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
  results: Array<{ label: string; value: string }>;
}

export default async function CaseStudiesPage() {
  let caseStudies: CaseStudyRecord[] = [];

  try {
    const supabase = createPublicSupabaseClient();
    const { data } = await supabase
      .from('case_studies')
      .select('id, title, slug, client_name, industry, summary, cover_image_url, results')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

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
            <Eyebrow pill>Real Business Impact</Eyebrow>
            <h1 className="text-display text-3xl sm:text-4xl lg:text-5xl">
              Case studies & <span className="gradient-text">client outcomes.</span>
            </h1>
            <p className="text-body text-text-muted max-w-xl mx-auto leading-relaxed">
              We focus on revenue outcomes rather than vanity metrics. Explore how our connected growth system transformed Indian businesses.
            </p>
          </div>

          {!hasStudies ? (
            /* Section 14.7: Empty state behavior when no case study is published */
            <div className="max-w-md mx-auto text-center">
              <div className="rounded-3xl border-gradient bg-surface p-8 sm:p-12 space-y-4 shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-green/10 border border-green/20 flex items-center justify-center text-green mx-auto">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h2 className="text-h3 text-xl text-text">Case Studies In Progress</h2>
                <p className="text-body text-xs text-text-muted leading-relaxed">
                  We are documenting recent client transformations across Delhi NCR. Schedule a private consultation to review our live portfolio and work samples directly.
                </p>
                <div className="pt-2">
                  <Button href="/book-consultation" showArrow>
                    Book Private Portfolio Review
                  </Button>
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

                    {Array.isArray(study.results) && study.results.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-bg border border-border mb-6">
                        {study.results.slice(0, 2).map((res, i) => (
                          <div key={i}>
                            <div className="font-mono font-bold text-base text-green">
                              {res.value}
                            </div>
                            <div className="text-[10px] text-text-dim uppercase tracking-wider">
                              {res.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/case-studies/${study.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-green hover:underline pt-4 border-t border-border group"
                  >
                    <span>Read Full Transformation</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}

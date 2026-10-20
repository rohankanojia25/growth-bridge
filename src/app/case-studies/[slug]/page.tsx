import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Button } from '@/components/ui/button';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 600;

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: study } = await supabase
    .from('case_studies')
    .select('title, summary, seo_title, seo_description')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (!study) {
    return { title: 'Case Study Not Found' };
  }

  return {
    title: study.seo_title || `${study.title} | Growth Bridge Accelerator`,
    description: study.seo_description || study.summary || '',
  };
}

export default async function CaseStudyDetailPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  // 1. Fetch published case study
  const { data: study } = await supabase
    .from('case_studies')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  // 2. Check slug history per Section 7.6
  if (!study) {
    const { data: history } = await supabase
      .from('slug_history')
      .select('new_slug')
      .eq('content_type', 'case_study')
      .eq('old_slug', slug)
      .maybeSingle();

    if (history?.new_slug) {
      permanentRedirect(`/case-studies/${history.new_slug}`);
    }

    notFound();
  }

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
      {
        '@type': 'ListItem',
        position: 3,
        name: study.title,
        item: `https://growthbridgeaccelerator.com/case-studies/${study.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Section className="pt-12 pb-24">
        <Container>
          <div className="max-w-3xl mx-auto space-y-10">
            {/* Back link */}
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-xs font-mono text-text-dim hover:text-green transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all case studies</span>
            </Link>

            {/* Header */}
            <div className="space-y-4">
              {study.industry && (
                <Eyebrow pill>{study.industry}</Eyebrow>
              )}
              <h1 className="text-display text-3xl sm:text-4xl lg:text-5xl">
                {study.title}
              </h1>
              <div className="text-sm text-text-dim">
                Client: <strong className="text-text font-semibold">{study.client_name}</strong>
              </div>
            </div>

            {/* Results Grid */}
            {Array.isArray(study.results) && study.results.length > 0 && (
              <div className="rounded-3xl border-gradient bg-surface p-6 sm:p-8 shadow-xl">
                <div className="text-xs font-mono uppercase tracking-wider text-green mb-4">
                  Measured Outcomes:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {study.results.map((res: { label: string; value: string }, i: number) => (
                    <div key={i}>
                      <div className="font-display font-bold text-2xl sm:text-3xl text-green">
                        {res.value}
                      </div>
                      <div className="text-xs text-text-dim uppercase tracking-wider mt-1">
                        {res.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Story Details */}
            <div className="space-y-8">
              {study.challenge && (
                <div className="rounded-2xl glass border border-border p-6 sm:p-8 space-y-3">
                  <h2 className="text-h3 text-xl text-text">The Business Challenge</h2>
                  <p className="text-body text-sm text-text-muted leading-relaxed whitespace-pre-line">
                    {study.challenge}
                  </p>
                </div>
              )}

              {study.solution && (
                <div className="rounded-2xl glass border border-border p-6 sm:p-8 space-y-3">
                  <h2 className="text-h3 text-xl text-text">The Connected Solution</h2>
                  <p className="text-body text-sm text-text-muted leading-relaxed whitespace-pre-line">
                    {study.solution}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom CTA */}
            <div className="rounded-3xl border-gradient bg-surface p-8 text-center space-y-4">
              <h3 className="text-h3 text-2xl text-text">
                Ready for similar business results?
              </h3>
              <p className="text-body text-xs text-text-muted max-w-md mx-auto">
                Schedule a free 30-minute discovery call to discuss how our connected system can scale your revenue.
              </p>
              <div className="pt-2">
                <Button href="/book-consultation" showArrow>
                  Book Free Consultation
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

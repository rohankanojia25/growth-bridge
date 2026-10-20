import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Button } from '@/components/ui/button';
import { createPublicSupabaseClient } from '@/lib/supabase/server';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 600;

export async function generateStaticParams() {
  try {
    const supabase = createPublicSupabaseClient();
    const query = supabase
      .from('case_studies')
      .select('slug')
      .eq('is_published', true);

    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
    const result: any = await Promise.race([query, timeout]);

    if (result && result.data) {
      return result.data.map((s: { slug: string }) => ({ slug: s.slug }));
    }
    return [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const supabase = createPublicSupabaseClient();
    const query = supabase
      .from('case_studies')
      .select('title, summary, seo_title, seo_description')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
    const result: any = await Promise.race([query, timeout]);
    const study = result?.data;

    if (!study) {
      return { title: 'Case Study Not Found' };
    }

    return {
      title: study.seo_title || `${study.title} | Growth Bridge Accelerator`,
      description: study.seo_description || study.summary || '',
    };
  } catch {
    return { title: 'Case Study Not Found' };
  }
}

export default async function CaseStudyDetailPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  let study: any = null;

  try {
    const supabase = createPublicSupabaseClient();
    const query = supabase
      .from('case_studies')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
    const result: any = await Promise.race([query, timeout]);
    study = result?.data;

    // Check slug history if not found
    if (!study) {
      const historyQuery = supabase
        .from('slug_history')
        .select('new_slug')
        .eq('content_type', 'case_study')
        .eq('old_slug', slug)
        .maybeSingle();

      const historyResult: any = await Promise.race([historyQuery, timeout]);
      const history = historyResult?.data;

      if (history?.new_slug) {
        permanentRedirect(`/case-studies/${history.new_slug}`);
      }

      notFound();
    }
  } catch {
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
            {/* Back Link */}
            <div>
              <Link
                href="/case-studies"
                className="inline-flex items-center gap-2 text-xs font-mono text-text-muted hover:text-green transition-colors min-h-[44px]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to All Case Studies</span>
              </Link>
            </div>

            {/* Header */}
            <div className="space-y-4">
              {study.industry && (
                <Eyebrow pill>{study.industry}</Eyebrow>
              )}
              <h1 className="text-display text-3xl sm:text-4xl lg:text-5xl">
                {study.title}
              </h1>
              <div className="text-xs font-mono text-text-dim">
                Client: <span className="text-text font-medium">{study.client_name}</span>
              </div>
              {study.summary && (
                <p className="text-body text-base sm:text-lg text-text-muted leading-relaxed pt-2">
                  {study.summary}
                </p>
              )}
            </div>

            {/* Key Results Grid */}
            {Array.isArray(study.results) && study.results.length > 0 && (
              <div className="rounded-3xl border-gradient bg-surface p-6 sm:p-8">
                <div className="text-eyebrow text-green mb-4">Measured Impact</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {study.results.map((res: { label: string; value: string }, i: number) => (
                    <div key={i} className="space-y-1">
                      <div className="font-display font-bold text-3xl text-green">
                        {res.value}
                      </div>
                      <div className="text-xs text-text-muted uppercase font-mono tracking-wider">
                        {res.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Challenge & Solution */}
            <div className="space-y-8 pt-4">
              {study.challenge && (
                <div className="space-y-3">
                  <h2 className="text-h3 text-xl text-text">The Challenge</h2>
                  <p className="text-body text-text-muted leading-relaxed whitespace-pre-line">
                    {study.challenge}
                  </p>
                </div>
              )}

              {study.solution && (
                <div className="space-y-3">
                  <h2 className="text-h3 text-xl text-text">The Growth Bridge Solution</h2>
                  <p className="text-body text-text-muted leading-relaxed whitespace-pre-line">
                    {study.solution}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom CTA */}
            <div className="rounded-2xl glass border border-border p-8 text-center space-y-4 mt-12">
              <h2 className="text-h3 text-xl text-text">
                Ready to replicate these outcomes for your business?
              </h2>
              <p className="text-body text-xs text-text-muted max-w-md mx-auto">
                Schedule a 30-minute consultation with our senior strategy team in Delhi.
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

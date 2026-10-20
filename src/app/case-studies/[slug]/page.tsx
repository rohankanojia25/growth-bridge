import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Eyebrow } from '@/components/ui/eyebrow';
import { TwoPathButtons } from '@/components/ui/two-path-buttons';
import { createPublicSupabaseClient } from '@/lib/supabase/server';
import { ArrowLeft, ExternalLink } from 'lucide-react';

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 600;

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createPublicSupabaseClient();

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
  const supabase = createPublicSupabaseClient();

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

            {/* Header: Client & Industry */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {study.industry && <Eyebrow pill>{study.industry}</Eyebrow>}
                <span className="text-xs font-mono text-text-dim">
                  Client: <strong className="text-text font-semibold">{study.client_name}</strong>
                </span>
              </div>
              <h1 className="text-display text-3xl sm:text-4xl lg:text-5xl">
                {study.title}
              </h1>
              {study.live_url && (
                <div className="pt-1">
                  <a
                    href={study.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-border text-xs font-semibold text-green hover:border-green/40 transition-colors"
                  >
                    <span>Visit live site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* The Problem */}
            {study.challenge && (
              <div className="rounded-2xl glass border border-border p-6 sm:p-8 space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-green block">
                  The Problem
                </span>
                <p className="text-body text-sm sm:text-base text-text-muted leading-relaxed whitespace-pre-line">
                  {study.challenge}
                </p>
              </div>
            )}

            {/* What We Did */}
            {study.solution && (
              <div className="rounded-2xl glass border border-border p-6 sm:p-8 space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan block">
                  What We Did
                </span>
                <p className="text-body text-sm sm:text-base text-text-muted leading-relaxed whitespace-pre-line">
                  {study.solution}
                </p>
              </div>
            )}

            {/* Result as plain text */}
            {study.summary && (
              <div className="rounded-2xl border-gradient bg-surface p-6 sm:p-8 space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-green block">
                  The Result
                </span>
                <p className="text-body text-sm sm:text-base text-text leading-relaxed whitespace-pre-line">
                  {study.summary}
                </p>
              </div>
            )}

            {/* Gallery Images (if any) */}
            {Array.isArray(study.gallery) && study.gallery.length > 0 && (
              <div className="space-y-4 pt-4">
                <span className="text-xs font-mono uppercase tracking-wider text-text-dim block">
                  Project Gallery
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {study.gallery.map((img: { url: string; alt?: string }, index: number) => (
                    <div key={index} className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-surface border border-border">
                      <Image
                        src={img.url}
                        alt={img.alt || `${study.title} preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom CTA with Two Path Buttons */}
            <div className="rounded-3xl border-gradient bg-surface p-8 text-center space-y-5">
              <h3 className="text-h3 text-xl sm:text-2xl text-text">
                Want to see what we can do for you?
              </h3>
              <p className="text-body text-xs text-text-muted max-w-md mx-auto">
                Share your idea or bring your business. We reply within 1 business day.
              </p>
              <div className="pt-2 flex justify-center">
                <TwoPathButtons size="default" location="case_study_detail_bottom" />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

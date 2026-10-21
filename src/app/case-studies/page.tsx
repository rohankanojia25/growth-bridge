import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createPublicSupabaseClient } from '@/lib/supabase/server';
import {
  FALLBACK_CASE_STUDIES,
  imageFileExists,
  type CaseStudy,
} from '@/lib/case-studies-data';
import { ArrowRight, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

export default async function CaseStudiesPage() {
  let caseStudies: CaseStudy[] = [];

  try {
    const supabase = createPublicSupabaseClient();
    const query = supabase
      .from('case_studies')
      .select('id, title, slug, client_name, industry, summary, cover_image_url, results, services_used, live_url, is_published')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
    const result: any = await Promise.race([query, timeout]);

    if (result && result.data && result.data.length > 0) {
      caseStudies = result.data;
    }
  } catch {
    // Database empty or offline
  }

  // Ensure fallback case studies (like nukkad-dahibhalla) are included if not yet in Supabase
  if (caseStudies.length === 0) {
    caseStudies = FALLBACK_CASE_STUDIES;
  } else {
    FALLBACK_CASE_STUDIES.forEach((fb) => {
      if (!caseStudies.some((c) => c.slug === fb.slug)) {
        caseStudies.unshift(fb);
      }
    });
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
            /* Empty state behavior when no case study is published */
            <div className="max-w-md mx-auto text-center">
              <div className="rounded-3xl border-gradient bg-surface p-6 sm:p-10 space-y-4 shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-green/10 border border-green/20 flex items-center justify-center text-green mx-auto">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h2 className="text-h3 text-xl text-text">Case Studies In Progress</h2>
                <p className="text-body text-xs text-text-muted leading-relaxed">
                  We are documenting recent client transformations across Delhi NCR. Schedule a private consultation to review our live portfolio and work samples directly.
                </p>
                <div className="pt-2">
                  <Button href="/book-consultation" showArrow className="w-full sm:w-auto">
                    Book Private Portfolio Review
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {caseStudies.map((study) => {
                const hasCover = imageFileExists(study.cover_image_url);

                return (
                  <Card key={study.id} spotlight className="flex flex-col justify-between p-6 sm:p-7 min-w-0">
                    <div>
                      {/* Cover image (only rendered if file exists) */}
                      {hasCover && study.cover_image_url && (
                        <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-5 border border-border bg-surface-hover">
                          <Image
                            src={study.cover_image_url}
                            alt={study.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover"
                          />
                        </div>
                      )}

                      {study.industry && (
                        <span className="text-eyebrow text-green uppercase text-xs mb-2 block">
                          {study.industry}
                        </span>
                      )}

                      <h2 className="text-h3 text-xl text-text mb-2 break-words">{study.title}</h2>

                      <div className="text-xs text-text-dim mb-4 font-mono">
                        Client: <span className="text-text font-medium">{study.client_name}</span>
                      </div>

                      {study.summary && (
                        <p className="text-body text-xs text-text-muted line-clamp-3 mb-6">
                          {study.summary}
                        </p>
                      )}
                    </div>

                    <Link
                      href={`/case-studies/${study.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-green hover:underline pt-4 border-t border-border group min-h-[44px]"
                    >
                      <span>Read the story</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
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

import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createPublicSupabaseClient } from '@/lib/supabase/server';
import { BUSINESS_INFO, SERVICES } from '@/lib/utils';
import {
  FALLBACK_CASE_STUDIES,
  imageFileExists,
  type CaseStudy,
} from '@/lib/case-studies-data';
import { ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react';

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateStaticParams() {
  const slugs = new Set<string>(FALLBACK_CASE_STUDIES.map((c) => c.slug));
  try {
    const supabase = createPublicSupabaseClient();
    const query = supabase
      .from('case_studies')
      .select('slug')
      .eq('is_published', true);

    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
    const result: any = await Promise.race([query, timeout]);

    if (result && result.data) {
      result.data.forEach((s: { slug: string }) => slugs.add(s.slug));
    }
  } catch {
    // Ignore error
  }
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  let study: Partial<CaseStudy> | undefined = FALLBACK_CASE_STUDIES.find((c) => c.slug === slug);

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
    if (result?.data) {
      study = result.data;
    }
  } catch {
    // Fall back to local
  }

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
  let study: CaseStudy | null = null;

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
    if (result?.data) {
      study = result.data;
    }
  } catch {
    // Supabase query failed
  }

  if (!study) {
    const fallback = FALLBACK_CASE_STUDIES.find((c) => c.slug === slug);
    if (fallback) {
      study = fallback;
    }
  }

  // Check slug history if not found
  if (!study) {
    try {
      const supabase = createPublicSupabaseClient();
      const historyQuery = supabase
        .from('slug_history')
        .select('new_slug')
        .eq('content_type', 'case_study')
        .eq('old_slug', slug)
        .maybeSingle();

      const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
      const historyResult: any = await Promise.race([historyQuery, timeout]);
      const history = historyResult?.data;

      if (history?.new_slug) {
        permanentRedirect(`/case-studies/${history.new_slug}`);
      }
    } catch {
      // Ignore
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

  // Parse services used as tags
  const servicesList: string[] = study.services_used
    ? study.services_used
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  // Match related service pages based on services_used text
  const servicesText = (study.services_used || '').toLowerCase();
  const matchedServices = SERVICES.filter((s) => {
    if (s.key === 'website' && (servicesText.includes('web') || servicesText.includes('site'))) return true;
    if (
      s.key === 'marketing' &&
      (servicesText.includes('seo') ||
        servicesText.includes('instagram') ||
        servicesText.includes('google') ||
        servicesText.includes('search') ||
        servicesText.includes('ai') ||
        servicesText.includes('market'))
    )
      return true;
    if (
      s.key === 'consulting' &&
      (servicesText.includes('consult') ||
        servicesText.includes('strategy') ||
        servicesText.includes('research') ||
        servicesText.includes('plan'))
    )
      return true;
    if (s.key === 'crm' && servicesText.includes('crm')) return true;
    return false;
  });

  const relatedServicesToShow = matchedServices.length > 0 ? matchedServices : SERVICES.slice(0, 2);

  // Check if cover image exists
  const coverUrl = study.cover_image_url;
  const hasCoverImage = imageFileExists(coverUrl);

  // Check gallery images (skip cover and missing files)
  const galleryItems = (study.gallery || []).filter(
    (item) => item.url !== coverUrl && imageFileExists(item.url)
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Section className="pt-10 pb-24">
        <Container>
          {/* Back Link */}
          <div className="mb-8">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-xs font-mono text-text-muted hover:text-green transition-colors min-h-[44px]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Case Studies</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Sidebar / At a Glance Card
                On mobile: appears above story (order-1)
                On desktop: right sidebar (order-2, col-span-4, sticky) */}
            <aside className="order-1 lg:order-2 lg:col-span-4 lg:sticky lg:top-28 w-full">
              <Card spotlight={false} className="p-6 rounded-2xl bg-surface border border-border space-y-5">
                <div className="text-eyebrow text-green uppercase tracking-wider font-mono text-xs">
                  At a glance
                </div>

                <div className="space-y-4 text-xs font-body divide-y divide-border/60">
                  <div className="pt-1">
                    <span className="block font-mono text-text-dim uppercase text-[11px] mb-1">Client</span>
                    <span className="font-semibold text-text text-sm">{study.client_name}</span>
                  </div>

                  {study.industry && (
                    <div className="pt-3">
                      <span className="block font-mono text-text-dim uppercase text-[11px] mb-1">Industry</span>
                      <span className="text-text-muted text-sm">{study.industry}</span>
                    </div>
                  )}

                  {servicesList.length > 0 && (
                    <div className="pt-3">
                      <span className="block font-mono text-text-dim uppercase text-[11px] mb-2">Services</span>
                      <div className="flex flex-wrap gap-1.5">
                        {servicesList.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/[0.04] border border-border text-text-muted leading-tight"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {study.live_url && (
                    <div className="pt-4">
                      <Button
                        href={study.live_url}
                        external
                        variant="secondary"
                        size="sm"
                        className="w-full text-xs font-semibold justify-center h-10"
                        showArrow
                      >
                        Visit the live site
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </aside>

            {/* Main Column: Story Content (order-2 on mobile, order-1 on desktop) */}
            <article className="order-2 lg:order-1 lg:col-span-8 space-y-10 min-w-0">
              {/* Header */}
              <div className="space-y-4">
                {study.industry && <Eyebrow pill>{study.industry}</Eyebrow>}
                <h1 className="text-display text-3xl sm:text-4xl lg:text-5xl leading-tight">
                  {study.title}
                </h1>
                {study.summary && (
                  <p className="text-body text-base sm:text-lg text-text-muted leading-relaxed pt-1 max-w-[68ch]">
                    {study.summary}
                  </p>
                )}
              </div>

              {/* Cover Image (Only rendered if the file exists on disk) */}
              {hasCoverImage && coverUrl && (
                <div className="relative aspect-[16/10] w-full rounded-2xl sm:rounded-3xl border border-border overflow-hidden bg-surface-hover">
                  <Image
                    src={coverUrl}
                    alt={study.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 800px"
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* Story Section 1: Where they started (Challenge) */}
              {study.challenge && (
                <div className="space-y-4 pt-2">
                  <div className="text-eyebrow text-green uppercase tracking-wider font-mono text-xs">
                    Where they started
                  </div>
                  <div className="prose-content">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h3: ({ children }) => (
                          <h3 className="text-h3 font-display font-medium text-xl sm:text-2xl text-text mt-8 mb-3 first:mt-0 tracking-tight">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="text-body text-text-muted leading-[1.7] max-w-[68ch] mb-4 text-[15px] sm:text-base">
                            {children}
                          </p>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-text">{children}</strong>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside space-y-2 mb-4 text-text-muted max-w-[68ch] text-[15px] sm:text-base leading-[1.7]">
                            {children}
                          </ul>
                        ),
                        li: ({ children }) => <li className="leading-[1.7]">{children}</li>,
                      }}
                    >
                      {study.challenge}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Story Section 2: How we built it (Solution) */}
              {study.solution && (
                <div className="space-y-4 pt-4">
                  <div className="text-eyebrow text-green uppercase tracking-wider font-mono text-xs">
                    How we built it
                  </div>
                  <div className="prose-content">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h3: ({ children }) => (
                          <h3 className="text-h3 font-display font-medium text-xl sm:text-2xl text-text mt-8 mb-3 first:mt-0 tracking-tight">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="text-body text-text-muted leading-[1.7] max-w-[68ch] mb-4 text-[15px] sm:text-base">
                            {children}
                          </p>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-text">{children}</strong>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside space-y-2 mb-4 text-text-muted max-w-[68ch] text-[15px] sm:text-base leading-[1.7]">
                            {children}
                          </ul>
                        ),
                        li: ({ children }) => <li className="leading-[1.7]">{children}</li>,
                      }}
                    >
                      {study.solution}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Gallery Images (Only rendered if image files exist on disk) */}
              {galleryItems.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {galleryItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-border overflow-hidden bg-surface flex flex-col"
                    >
                      <div className="relative aspect-[16/10] w-full bg-surface-hover">
                        <Image
                          src={item.url}
                          alt={item.alt}
                          fill
                          sizes="(max-width: 640px) 100vw, 400px"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3 text-[11px] font-mono text-text-dim bg-surface/80 border-t border-border/60">
                        {item.alt}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Mid-story Call to Action */}
              <div className="my-8 p-6 sm:p-7 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-base sm:text-lg font-medium text-text">
                  Want a plan like this for your business?
                </p>
                <Button href="/book-consultation" size="sm" showArrow className="shrink-0 w-full sm:w-auto">
                  Book a free consultation
                </Button>
              </div>

              {/* Story Section 3: Where they are today (Results) */}
              {Array.isArray(study.results) && study.results.length > 0 && (
                <div className="space-y-4 pt-2">
                  <div className="text-eyebrow text-green uppercase tracking-wider font-mono text-xs">
                    Where they are today
                  </div>

                  {/* One card per result: label in small mono text, value in larger text */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {study.results.map((res: { label: string; value: string }, i: number) => (
                      <Card
                        key={i}
                        spotlight={false}
                        className="p-5 sm:p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between"
                      >
                        <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-2">
                          {res.label}
                        </div>
                        <div className="font-display font-semibold text-base sm:text-lg text-text leading-snug">
                          {res.value}
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Muted verification date note */}
                  <p className="text-xs text-text-dim pt-1 font-body">
                    Results checked on 21 Oct 2026. Search results change over time.
                  </p>
                </div>
              )}

              {/* Ending Call to Action */}
              <div className="rounded-3xl border-gradient bg-surface p-6 sm:p-10 text-center space-y-4 my-12 shadow-xl">
                <h2 className="text-h2 text-2xl sm:text-3xl text-text">
                  Have an idea? Or a business that deserves to be found?
                </h2>
                <p className="text-body text-sm sm:text-base text-text-muted max-w-xl mx-auto leading-relaxed">
                  Every story like this started with a conversation. Tell us where you are today, and we will show you where you could be: the research, the plan and the build, step by step.
                </p>
                <div className="pt-2 flex flex-col min-[480px]:flex-row items-center justify-center gap-3">
                  <Button href="/book-consultation" showArrow className="w-full min-[480px]:w-auto">
                    Book a free consultation
                  </Button>
                  <a
                    href={BUSINESS_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 min-h-[48px] h-12 w-full min-[480px]:w-auto px-6 rounded-full border border-green/40 bg-green/10 text-green hover:bg-green/20 font-semibold text-sm sm:text-base font-body active:scale-[0.98] transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-green shrink-0" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Related Services */}
              <div className="pt-4 space-y-4 border-t border-border">
                <div className="text-eyebrow text-green uppercase tracking-wider font-mono text-xs">
                  Related Services
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedServicesToShow.map((service) => (
                    <Link
                      key={service.slug}
                      href={`/services/${service.slug}`}
                      className="group p-5 rounded-2xl bg-surface border border-border hover:border-border-strong hover:-translate-y-0.5 transition-all flex items-center justify-between min-h-[44px]"
                    >
                      <div>
                        <div className="text-sm font-semibold text-text group-hover:text-green transition-colors">
                          {service.title}
                        </div>
                        <div className="text-xs text-text-muted mt-1 line-clamp-1">
                          {service.shortDescription}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-text-dim group-hover:text-green group-hover:translate-x-1 transition-all shrink-0 ml-3" />
                    </Link>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </Container>
      </Section>
    </>
  );
}

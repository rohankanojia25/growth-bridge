import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createPublicSupabaseClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import { BookOpen, ArrowRight, Calendar } from 'lucide-react';

export const revalidate = 600; // ISR 600s per Section 6

export const metadata: Metadata = {
  title: 'Blog & Business Insights | Growth Bridge Accelerator',
  description:
    'Actionable growth strategies, local SEO guides, CRM playbooks, and website conversion tactics for Indian small and mid-sized businesses.',
  alternates: {
    canonical: '/blog',
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
      name: 'Blog',
      item: 'https://growthbridgeaccelerator.com/blog',
    },
  ],
};

interface BlogPostRecord {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  tags: string[];
  published_at: string | null;
}

export default async function BlogIndexPage() {
  let posts: BlogPostRecord[] = [];

  try {
    const supabase = createPublicSupabaseClient();
    const query = supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, cover_image_url, tags, published_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(24);

    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
    const result: any = await Promise.race([query, timeout]);

    if (result && result.data) {
      posts = result.data;
    }
  } catch {
    // Database empty or offline — shows empty state
  }

  const hasPosts = posts.length > 0;

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
            <Eyebrow pill>Practical Business Strategy</Eyebrow>
            <h1 className="text-display text-3xl sm:text-4xl lg:text-5xl">
              Insights for Indian <span className="gradient-text">entrepreneurs.</span>
            </h1>
            <p className="text-body text-text-muted max-w-xl mx-auto leading-relaxed">
              No theoretical buzzwords. Pragmatic guides on positioning, local customer acquisition, and CRM automation designed for Indian business owners.
            </p>
          </div>

          {!hasPosts ? (
            /* Empty state */
            <div className="max-w-md mx-auto text-center">
              <div className="rounded-3xl border-gradient bg-surface p-8 sm:p-12 space-y-4 shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-green/10 border border-green/20 flex items-center justify-center text-green mx-auto">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h2 className="text-h3 text-xl text-text">Articles Coming Soon</h2>
                <p className="text-body text-xs text-text-muted leading-relaxed">
                  Our team is curating in-depth growth breakdowns for retail, clinics, restaurants, and manufacturing firms across Delhi NCR.
                </p>
                <div className="pt-2">
                  <Button href="/book-consultation" showArrow>
                    Book A Free Strategy Call
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <Card key={post.id} spotlight className="flex flex-col justify-between p-7">
                    <div>
                      {Array.isArray(post.tags) && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {post.tags.slice(0, 2).map((tag, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-mono uppercase tracking-wider text-green px-2 py-0.5 rounded-full glass border border-green/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <h2 className="text-h3 text-xl text-text mb-3 leading-snug">
                        {post.title}
                      </h2>

                      {post.excerpt && (
                        <p className="text-body text-xs text-text-muted line-clamp-3 mb-6">
                          {post.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
                      {post.published_at && (
                        <span className="text-text-dim flex items-center gap-1 font-mono text-[11px]">
                          <Calendar className="w-3 h-3 text-green" />
                          {formatDate(post.published_at)}
                        </span>
                      )}

                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 text-green font-semibold hover:underline"
                      >
                        <span>Read</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>

              {/* End of posts */}
            </>
          )}
        </Container>
      </Section>
    </>
  );
}

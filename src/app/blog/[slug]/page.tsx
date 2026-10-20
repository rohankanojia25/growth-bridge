import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Button } from '@/components/ui/button';
import { createPublicSupabaseClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 600;

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createPublicSupabaseClient();

  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt, seo_title, seo_description')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (!post) {
    return { title: 'Article Not Found' };
  }

  return {
    title: post.seo_title || `${post.title} | Growth Bridge Accelerator`,
    description: post.seo_description || post.excerpt || '',
  };
}

export default async function BlogPostDetailPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const supabase = createPublicSupabaseClient();

  // 1. Fetch published post
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  // 2. Check slug history per Section 7.6
  if (!post) {
    const { data: history } = await supabase
      .from('slug_history')
      .select('new_slug')
      .eq('content_type', 'blog')
      .eq('old_slug', slug)
      .maybeSingle();

    if (history?.new_slug) {
      permanentRedirect(`/blog/${history.new_slug}`);
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
        name: 'Blog',
        item: 'https://growthbridgeaccelerator.com/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://growthbridgeaccelerator.com/blog/${post.slug}`,
      },
    ],
  };

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Organization',
      name: 'Growth Bridge Accelerator',
      url: 'https://growthbridgeaccelerator.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Growth Bridge Accelerator',
      logo: {
        '@type': 'ImageObject',
        url: 'https://growthbridgeaccelerator.com/og.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://growthbridgeaccelerator.com/blog/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <Section className="pt-12 pb-24">
        <Container>
          <article className="max-w-3xl mx-auto space-y-10">
            {/* Back link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-mono text-text-dim hover:text-green transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all articles</span>
            </Link>

            {/* Header */}
            <div className="space-y-4">
              {Array.isArray(post.tags) && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string, i: number) => (
                    <span
                      key={i}
                      className="text-xs font-mono uppercase tracking-wider text-green px-3 py-1 rounded-full glass border border-green/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="text-display text-3xl sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>

              {post.published_at && (
                <div className="flex items-center gap-2 text-xs font-mono text-text-dim pt-1">
                  <Calendar className="w-3.5 h-3.5 text-green" />
                  <span>Published {formatDate(post.published_at)}</span>
                  <span>·</span>
                  <span>Growth Bridge Insights</span>
                </div>
              )}
            </div>

            {/* Article Markdown Body */}
            <div className="prose prose-invert max-w-none text-text-muted leading-relaxed space-y-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content_md || post.excerpt || ''}
              </ReactMarkdown>
            </div>

            {/* Bottom Call to Action */}
            <div className="rounded-3xl border-gradient bg-surface p-8 text-center space-y-4 pt-10">
              <h3 className="text-h3 text-2xl text-text">
                Apply these insights to your business.
              </h3>
              <p className="text-body text-xs text-text-muted max-w-md mx-auto">
                Schedule a free 30-minute discovery call with our partners in Delhi to discuss your business growth plan.
              </p>
              <div className="pt-2">
                <Button href="/book-consultation" showArrow>
                  Book Free Consultation
                </Button>
              </div>
            </div>
          </article>
        </Container>
      </Section>
    </>
  );
}

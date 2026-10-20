import { MetadataRoute } from 'next';
import { SERVICES } from '@/lib/utils';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://growthbridgeaccelerator.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/book-consultation`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Service routes
  const serviceRoutes: MetadataRoute.Sitemap = SERVICES.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Query published blog posts and case studies from Supabase
  let blogRoutes: MetadataRoute.Sitemap = [];
  let caseStudyRoutes: MetadataRoute.Sitemap = [];

  try {
    const supabase = await createServerSupabaseClient();

    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('is_published', true);

    if (posts) {
      blogRoutes = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: 'monthly',
        priority: 0.7,
      }));
    }

    const { data: cases } = await supabase
      .from('case_studies')
      .select('slug, updated_at')
      .eq('is_published', true);

    if (cases) {
      caseStudyRoutes = cases.map((cs) => ({
        url: `${baseUrl}/case-studies/${cs.slug}`,
        lastModified: new Date(cs.updated_at),
        changeFrequency: 'monthly',
        priority: 0.7,
      }));
    }
  } catch {
    // Database query failed during static export or build
  }

  return [...staticRoutes, ...serviceRoutes, ...blogRoutes, ...caseStudyRoutes];
}

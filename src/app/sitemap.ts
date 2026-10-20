import { MetadataRoute } from 'next';
import { createPublicSupabaseClient } from '@/lib/supabase/server';

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
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/get-started`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
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

  // Query published case studies from Supabase
  let caseStudyRoutes: MetadataRoute.Sitemap = [];

  try {
    const supabase = createPublicSupabaseClient();
    const { data: cases } = await supabase
      .from('case_studies')
      .select('slug, updated_at')
      .eq('is_published', true);

    if (cases) {
      caseStudyRoutes = (cases as Array<{ slug: string; updated_at: string }>).map((cs) => ({
        url: `${baseUrl}/case-studies/${cs.slug}`,
        lastModified: new Date(cs.updated_at),
        changeFrequency: 'monthly',
        priority: 0.7,
      }));
    }
  } catch {
    // Database query failed during static export or build
  }

  return [...staticRoutes, ...caseStudyRoutes];
}

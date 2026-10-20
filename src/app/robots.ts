import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://growthbridgeaccelerator.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/api',
          '/api/',
          '/thank-you',
          '/book-consultation/confirmed',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'growthbridgeaccelerator.com',
      },
    ],
  },
  async redirects() {
    return [
      // Core alias redirects
      { source: '/home', destination: '/', permanent: true },
      { source: '/index', destination: '/', permanent: true },
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/service', destination: '/services', permanent: true },

      // v3 Service detail to single-page section anchor redirects
      { source: '/services/business-consulting', destination: '/services#plan', permanent: true },
      { source: '/services/consulting', destination: '/services#plan', permanent: true },
      { source: '/services/business-consultant', destination: '/services#plan', permanent: true },
      { source: '/services/consultant', destination: '/services#plan', permanent: true },

      { source: '/services/website-generation', destination: '/services#build', permanent: true },
      { source: '/services/website', destination: '/services#build', permanent: true },
      { source: '/services/web', destination: '/services#build', permanent: true },
      { source: '/services/website-development', destination: '/services#build', permanent: true },
      { source: '/services/web-development', destination: '/services#build', permanent: true },

      { source: '/services/full-stack-marketing', destination: '/services#market', permanent: true },
      { source: '/services/marketing', destination: '/services#market', permanent: true },
      { source: '/services/digital-marketing', destination: '/services#market', permanent: true },

      { source: '/services/crm-for-businesses', destination: '/services#grow', permanent: true },
      { source: '/services/crm', destination: '/services#grow', permanent: true },

      // v3 Restaurant & Industry redirects
      { source: '/industries/restaurants', destination: '/#who-we-work-with', permanent: true },
      { source: '/restaurants', destination: '/#who-we-work-with', permanent: true },

      // v3 Conversion page redirects -> /get-started
      { source: '/free-audit', destination: '/get-started', permanent: true },
      { source: '/book-consultation', destination: '/get-started', permanent: true },
      { source: '/book', destination: '/get-started', permanent: true },
      { source: '/consultation', destination: '/get-started', permanent: true },
      { source: '/free-consultation', destination: '/get-started', permanent: true },
      { source: '/appointment', destination: '/get-started', permanent: true },
      { source: '/start', destination: '/get-started', permanent: true },
      { source: '/contact-us-now', destination: '/get-started', permanent: true },

      // Marketing & content aliases
      { source: '/packages', destination: '/pricing', permanent: true },
      { source: '/plans', destination: '/pricing', permanent: true },
      { source: '/price', destination: '/pricing', permanent: true },
      { source: '/prices', destination: '/pricing', permanent: true },
      { source: '/portfolio', destination: '/case-studies', permanent: true },
      { source: '/work', destination: '/case-studies', permanent: true },
      { source: '/projects', destination: '/case-studies', permanent: true },
      { source: '/articles', destination: '/blog', permanent: true },
      { source: '/insights', destination: '/blog', permanent: true },
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/enquiry', destination: '/contact', permanent: true },
      { source: '/privacy', destination: '/privacy-policy', permanent: true },
      { source: '/terms', destination: '/terms-and-conditions', permanent: true },
      { source: '/tos', destination: '/terms-and-conditions', permanent: true },
      { source: '/login', destination: '/admin/login', permanent: true },
      { source: '/signin', destination: '/admin/login', permanent: true },
      { source: '/admin', destination: '/admin/dashboard', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

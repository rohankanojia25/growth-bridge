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
      { source: '/home', destination: '/', permanent: true },
      { source: '/index', destination: '/', permanent: true },
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/service', destination: '/services', permanent: true },
      { source: '/services/consulting', destination: '/services/business-consulting', permanent: true },
      { source: '/services/business-consultant', destination: '/services/business-consulting', permanent: true },
      { source: '/services/consultant', destination: '/services/business-consulting', permanent: true },
      { source: '/services/website', destination: '/services/website-generation', permanent: true },
      { source: '/services/web', destination: '/services/website-generation', permanent: true },
      { source: '/services/website-development', destination: '/services/website-generation', permanent: true },
      { source: '/services/web-development', destination: '/services/website-generation', permanent: true },
      { source: '/services/crm', destination: '/services/crm-for-businesses', permanent: true },
      { source: '/services/marketing', destination: '/services/full-stack-marketing', permanent: true },
      { source: '/services/digital-marketing', destination: '/services/full-stack-marketing', permanent: true },
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
      { source: '/enquiry', destination: '/book-consultation', permanent: true },
      { source: '/book', destination: '/book-consultation', permanent: true },
      { source: '/consultation', destination: '/book-consultation', permanent: true },
      { source: '/free-consultation', destination: '/book-consultation', permanent: true },
      { source: '/appointment', destination: '/book-consultation', permanent: true },
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

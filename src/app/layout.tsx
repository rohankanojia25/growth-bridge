import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileBar } from '@/components/layout/mobile-bar';
import { CookieConsent } from '@/components/layout/cookie-consent';
import { Analytics } from '@/components/layout/analytics';
import { SmoothScroll } from '@/components/layout/smooth-scroll';
import { UTMTracker } from '@/components/layout/utm-tracker';
import { BUSINESS_INFO } from '@/lib/utils';
import { createPublicSupabaseClient } from '@/lib/supabase/server';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '600', '700'],
  variable: '--font-space-grotesk',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['500'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'Growth Bridge Accelerator | Business Consulting & Marketing, Delhi',
    template: '%s | Growth Bridge Accelerator',
  },
  description:
    'Growth Bridge Accelerator helps Indian businesses plan smarter, get online, manage every customer, and grow faster. One partner for strategy, website, CRM, and marketing.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://growthbridgeaccelerator.com'
  ),
  openGraph: {
    siteName: 'Growth Bridge Accelerator',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon-16x16.png',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: BUSINESS_INFO.name,
  image: 'https://growthbridgeaccelerator.com/og.png',
  '@id': 'https://growthbridgeaccelerator.com/#organization',
  url: 'https://growthbridgeaccelerator.com',
  telephone: '+91-8883838363',
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: BUSINESS_INFO.address.street,
    addressLocality: BUSINESS_INFO.address.area,
    addressRegion: BUSINESS_INFO.address.city,
    postalCode: BUSINESS_INFO.address.pincode,
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 28.6653,
    longitude: 77.2736,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '10:00',
      closes: '19:00',
    },
  ],
  sameAs: ['https://wa.me/918883838363'],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let hasCaseStudies = false;
  let hasPricing = false;

  try {
    const supabase = createPublicSupabaseClient();
    const [csRes, pkgRes] = await Promise.all([
      supabase.from('case_studies').select('id', { count: 'exact', head: true }).eq('is_published', true),
      supabase.from('packages').select('id', { count: 'exact', head: true }).eq('is_published', true),
    ]);
    hasCaseStudies = Boolean(csRes.count && csRes.count > 0);
    hasPricing = Boolean(pkgRes.count && pkgRes.count > 0);
  } catch {
    // Unconfigured or offline fallback
  }

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-text-muted font-body pb-16 md:pb-0">
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <Header hasCaseStudies={hasCaseStudies} hasPricing={hasPricing} />
        <main id="main-content" className="flex-1 pt-[72px]">
          {children}
        </main>
        <Footer hasCaseStudies={hasCaseStudies} hasPricing={hasPricing} />
        <MobileBar />
        <CookieConsent />
        <Analytics />
        <SmoothScroll />
        <UTMTracker />
      </body>
    </html>
  );
}

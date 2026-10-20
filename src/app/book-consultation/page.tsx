import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Eyebrow } from '@/components/ui/eyebrow';
import { BookingFlow } from '@/components/forms/booking-flow';
import { Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Book Free Consultation | Growth Bridge Accelerator',
  description:
    'Schedule a free 30-minute growth diagnostic session with Growth Bridge Accelerator. We analyze your marketing, website, and customer pipeline.',
  alternates: {
    canonical: '/book-consultation',
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
      name: 'Book Consultation',
      item: 'https://growthbridgeaccelerator.com/book-consultation',
    },
  ],
};

export default function BookConsultationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Section className="pt-12 pb-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
            <Eyebrow pill>Discovery Call</Eyebrow>
            <h1 className="text-display text-3xl sm:text-4xl lg:text-5xl">
              Book your free <span className="gradient-text">growth diagnostic.</span>
            </h1>
            <p className="text-body text-text-muted max-w-xl mx-auto leading-relaxed">
              Pick a 30-minute slot that fits your schedule. We review your current operations, vendor overlap, and customer conversion pipeline with zero sales pressure.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-mono text-text">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-green" />
                <span>30 Minutes Focused Review</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-green" />
                <span>Phone, Google Meet or Delhi Office</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-green" />
                <span>Zero Obligation</span>
              </span>
            </div>
          </div>

          <Suspense
            fallback={
              <div className="w-full max-w-2xl mx-auto glass rounded-3xl p-12 text-center">
                <div className="inline-block w-8 h-8 border-2 border-green border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm text-text-muted">Loading calendar availability...</p>
              </div>
            }
          >
            <BookingFlow />
          </Suspense>
        </Container>
      </Section>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { SectionHeader } from '@/components/ui/section-header';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SiteImage } from '@/components/ui/site-image';
import { BUSINESS_INFO } from '@/lib/utils';
import { MapPin, Target, Shield, Zap, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Growth Bridge Accelerator Delhi',
  description:
    'Learn about Growth Bridge Accelerator, our mission, and our connected approach to business consulting, web engineering, and marketing for Indian businesses.',
  alternates: {
    canonical: '/about',
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
      name: 'About',
      item: 'https://growthbridgeaccelerator.com/about',
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-bg">
        <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />
        <div
          className="orb orb-green top-10 right-1/4 w-[450px] h-[450px] pointer-events-none opacity-25"
          aria-hidden="true"
        />

        <Container className="relative z-10">
          <div className="max-w-3xl space-y-5">
            <Eyebrow pill>Our Story & Mission</Eyebrow>
            <h1 className="text-display">
              Bridging Indian business owners to <span className="gradient-text">predictable growth.</span>
            </h1>
            <p className="text-body text-lg text-text-muted leading-relaxed">
              Based in Gandhi Nagar, Delhi, Growth Bridge Accelerator was founded to fix a fundamental flaw in the Indian agency model: disconnected vendors who deliver isolated pieces with zero shared accountability.
            </p>
          </div>
        </Container>
      </section>

      {/* Optional About Hero Image Slot */}
      <div className="max-w-[1200px] mx-auto px-6 max-[640px]:px-4">
        <div className="rounded-3xl overflow-hidden border border-border bg-surface">
          <SiteImage slot="about-hero" className="w-full aspect-[21/9]" rounded />
        </div>
      </div>

      {/* Philosophy Section */}
      <Section raised>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <Eyebrow pill>The Core Problem</Eyebrow>
              <h2 className="text-h2">
                Why small and mid-sized businesses struggle online.
              </h2>
              <p className="text-body text-text-muted leading-relaxed">
                Most Indian entrepreneurs hire one freelancer to build a website, a separate person for SEO, another for Meta ads, and try to manage customer leads on personal WhatsApp chats. When inquiries fail to convert into paying clients, everyone blames someone else.
              </p>
              <p className="text-body text-text-muted leading-relaxed">
                We believe business growth requires a synchronized system: a sharp positioning strategy, an ultra-fast conversion website, a customer relationship pipeline that leaves no lead behind, and laser-targeted marketing that feeds the funnel continuously.
              </p>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <Card spotlight className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green/10 border border-green/20 flex items-center justify-center text-green shrink-0">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-text text-base">One Unified Roadmap</h3>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">
                      Every deliverable—from the website layout to WhatsApp message templates—is driven by the same growth objective.
                    </p>
                  </div>
                </div>
              </Card>

              <Card spotlight className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-text text-base">Complete Accountability</h3>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">
                      You speak with one senior partner who takes ownership of your inquiries, customer pipeline, and return on marketing spend.
                    </p>
                  </div>
                </div>
              </Card>

              <Card spotlight className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-violet/10 border border-violet/20 flex items-center justify-center text-violet shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-text text-base">Rooted in Delhi, Serving India</h3>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">
                      We understand the nuances of local consumer buying behavior, regional search intent, and the decisive power of WhatsApp.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* Office & Location Detail */}
      <Section>
        <Container>
          <div className="rounded-3xl glass border border-border p-8 sm:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-eyebrow text-green">Delhi Presence</span>
                <h2 className="text-h2 text-2xl sm:text-3xl text-text">
                  Visit our office in Gandhi Nagar, Delhi.
                </h2>
                <p className="text-body text-sm text-text-muted leading-relaxed">
                  We welcome business owners for in-person strategy reviews. Whether you run a retail establishment in Chandni Chowk, a clinic in South Delhi, a coaching institute in Mukherjee Nagar, or a manufacturing setup in Noida, our doors are open.
                </p>
                <div className="pt-2 text-xs text-text flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-green shrink-0 mt-0.5" />
                  <span>{BUSINESS_INFO.address.full}</span>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col sm:flex-row gap-4 lg:justify-end">
                <Button href="/book-consultation" showArrow>
                  Book Discovery Meeting
                </Button>
                <Button href="/contact" variant="secondary">
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

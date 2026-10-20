import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { SectionHeader } from '@/components/ui/section-header';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SERVICES_DATA } from '@/lib/services-data';
import { SiteImage } from '@/components/ui/site-image';
import { ArrowRight, Check, Compass, Globe, Users, Megaphone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Services | Growth Bridge Accelerator',
  description:
    'One connected growth system for Indian businesses. We provide Business Consulting, Website Generation, CRM Systems, and Full-Stack Marketing under one roof.',
  alternates: {
    canonical: '/services',
  },
};

const iconMap = {
  consulting: Compass,
  website: Globe,
  crm: Users,
  marketing: Megaphone,
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
      name: 'Services',
      item: 'https://growthbridgeaccelerator.com/services',
    },
  ],
};

export default function ServicesHubPage() {
  const servicesList = Object.values(SERVICES_DATA);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative py-14 sm:py-20 overflow-hidden bg-bg">
        <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />
        <div
          className="orb orb-green top-0 right-1/4 w-[320px] sm:w-[450px] h-[320px] sm:h-[450px] pointer-events-none opacity-25"
          aria-hidden="true"
        />

        <Container className="relative z-10">
          <div className="max-w-3xl space-y-4">
            <Eyebrow pill>Our Capabilities</Eyebrow>
            <h1 className="text-display">
              Four disciplines. <span className="gradient-text">One growth engine.</span>
            </h1>
            <p className="text-body text-base sm:text-lg text-text-muted leading-relaxed">
              We eliminated the chaos of hiring separate consultants, web agencies, and marketers. Every service we deliver is designed to plug into the next.
            </p>
          </div>
        </Container>
      </section>

      {/* Services Grid */}
      <Section raised>
        <Container>
          <div className="space-y-12 sm:space-y-16">
            {servicesList.map((service, index) => {
              const Icon = iconMap[service.key];
              const isEven = index % 2 === 1;

              return (
                <div
                  key={service.slug}
                  id={service.slug}
                  className="rounded-3xl glass border border-border p-6 sm:p-10 lg:p-12 transition-all hover:border-border-strong scroll-mt-28"
                >
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                      isEven ? 'lg:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Left/Content Column */}
                    <div className={`lg:col-span-7 space-y-6 ${isEven ? 'lg:order-2' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-green/10 border border-green/20 flex items-center justify-center text-green shrink-0">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-eyebrow text-green">{service.eyebrow}</span>
                      </div>

                      <h2 className="text-h2 text-2xl sm:text-3xl text-text">
                        {service.title}
                      </h2>

                      <p className="text-body text-text-muted leading-relaxed">
                        {service.headline} {service.summary}
                      </p>

                      <div className="space-y-2.5 pt-2">
                        <div className="text-xs font-mono uppercase tracking-wider text-text-dim">
                          Core Deliverables:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {service.deliverablesSummary.map((deliv, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-text min-w-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-green shrink-0" />
                              <span className="truncate sm:whitespace-normal">{deliv}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 [&>*]:w-full sm:[&>*]:w-auto">
                        <Button href={`/services/${service.slug}`} showArrow>
                          Explore {service.title}
                        </Button>
                        <Button
                          href={`/book-consultation?service=${service.key}`}
                          variant="secondary"
                        >
                          Book For This Service
                        </Button>
                      </div>
                    </div>

                    {/* Right/Slot Visual Column */}
                    <div className={`lg:col-span-5 ${isEven ? 'lg:order-1' : ''}`}>
                      <div className="relative rounded-2xl overflow-hidden border border-border bg-surface">
                        <SiteImage
                          slot={service.slotKey}
                          className="w-full aspect-[4/3]"
                          rounded
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Unified Architecture CTA Section */}
      <Section>
        <Container>
          <div className="rounded-3xl border-gradient bg-surface p-8 sm:p-14 text-center space-y-6 shadow-2xl">
            <span className="text-eyebrow text-green">Connected Acceleration</span>
            <h2 className="text-h2 text-2xl sm:text-4xl text-text">
              Not sure which service to begin with?
            </h2>
            <p className="text-body text-text-muted max-w-xl mx-auto leading-relaxed">
              Book a 30-minute diagnosis call with our Delhi team. We will audit your current setup and recommend the single highest-impact initiative for your business.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="/book-consultation" showArrow>
                Book Free Growth Consultation
              </Button>
              <Button href="/pricing" variant="secondary">
                View Pricing & Retainers
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

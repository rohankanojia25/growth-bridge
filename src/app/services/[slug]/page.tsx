import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SERVICES_DATA, type ServiceDetail } from '@/lib/services-data';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { SectionHeader } from '@/components/ui/section-header';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FAQAccordion } from '@/components/ui/faq-accordion';
import { SiteImage } from '@/components/ui/site-image';
import { ArrowRight, Check, CheckCircle2 } from 'lucide-react';

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(SERVICES_DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES_DATA[slug];

  if (!service) {
    return { title: 'Service Not Found' };
  }

  return {
    title: `${service.title} | Growth Bridge Accelerator`,
    description: service.summary,
    alternates: {
      canonical: `/services/${service.slug}`,
    },
    openGraph: {
      title: `${service.title} — Growth Bridge Accelerator Delhi`,
      description: service.summary,
    },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = SERVICES_DATA[slug];

  if (!service) {
    notFound();
  }

  // Related other 3 services
  const relatedServices = Object.values(SERVICES_DATA).filter((s) => s.slug !== service.slug);

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
      {
        '@type': 'ListItem',
        position: 3,
        name: service.title,
        item: `https://growthbridgeaccelerator.com/services/${service.slug}`,
      },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Sticky Sub-Navigation (Section 13) */}
      <div className="hidden lg:block sticky top-[72px] z-30 glass border-b border-border py-2.5">
        <Container>
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono font-medium text-text flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green" />
              <span>{service.title}</span>
            </div>
            <nav className="flex items-center gap-4 text-xs text-text-muted font-body">
              <a href="#what-you-get" className="hover:text-text transition-colors min-h-[44px] px-2 flex items-center">
                What You Get
              </a>
              <a href="#who-it-is-for" className="hover:text-text transition-colors min-h-[44px] px-2 flex items-center">
                Who It Is For
              </a>
              <a href="#process" className="hover:text-text transition-colors min-h-[44px] px-2 flex items-center">
                Process
              </a>
              <a href="#faq" className="hover:text-text transition-colors min-h-[44px] min-w-[44px] justify-center flex items-center">
                FAQ
              </a>
              <Button href={`/book-consultation?service=${service.key}`} size="sm">
                Book Consultation
              </Button>
            </nav>
          </div>
        </Container>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden bg-bg">
        <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
        <div
          className="orb orb-green top-10 right-10 w-[400px] h-[400px] pointer-events-none opacity-25"
          aria-hidden="true"
        />

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Breadcrumb text */}
              <nav aria-label="Breadcrumb" className="text-xs text-text-dim flex items-center gap-1 font-mono">
                <Link href="/" className="hover:text-text min-h-[44px] min-w-[44px] justify-center flex items-center">Home</Link>
                <span>/</span>
                <Link href="/services" className="hover:text-text min-h-[44px] px-2 flex items-center">Services</Link>
                <span>/</span>
                <span className="text-green min-h-[44px] px-2 flex items-center">{service.title}</span>
              </nav>

              <Eyebrow pill>{service.eyebrow}</Eyebrow>

              <h1 className="text-display">
                {service.title}
              </h1>

              <p className="text-body text-lg text-text-muted leading-relaxed">
                {service.headline}
              </p>

              <p className="text-body text-text-muted leading-relaxed">
                {service.summary}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Button href={`/book-consultation?service=${service.key}`} showArrow>
                  Book Free Consultation
                </Button>
                <Button href="/contact" variant="secondary">
                  Send an Enquiry
                </Button>
              </div>
            </div>

            {/* Right Slot Image Visual */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl glass border border-border p-3 overflow-hidden shadow-2xl">
                <SiteImage
                  slot={service.slotKey}
                  className="w-full aspect-[4/3]"
                  rounded
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content Layout with Sticky Right Summary Card */}
      <div className="relative">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start py-12">
            {/* Main Content Left (8 cols) */}
            <div className="lg:col-span-8 space-y-20">
              {/* What You Get Bento (6 deliverables) */}
              <section id="what-you-get" className="scroll-mt-32">
                <SectionHeader
                  eyebrow="Deliverables"
                  title="What you get."
                  description="Concrete deliverables implemented directly into your business."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {service.whatYouGet.map((item, idx) => (
                    <Card key={idx} spotlight className="p-6 flex flex-col justify-between">
                      <div>
                        <div className="w-8 h-8 rounded-lg bg-green/10 border border-green/20 flex items-center justify-center text-green text-xs font-mono font-bold mb-4">
                          0{idx + 1}
                        </div>
                        <h3 className="text-h3 text-base text-text mb-2">{item.title}</h3>
                        <p className="text-body text-xs text-text-muted leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Who It Is For */}
              <section id="who-it-is-for" className="scroll-mt-32">
                <SectionHeader
                  eyebrow="Ideal Fit"
                  title="Who this is for."
                  description="We partner with businesses where our systems yield the highest return."
                />

                <div className="space-y-3.5">
                  {service.whoItIsFor.map((point, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl glass border border-border p-5 flex items-start gap-4 transition-colors hover:border-border-strong"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green shrink-0 mt-0.5" />
                      <p className="text-body text-sm text-text leading-relaxed">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Process (4 steps) */}
              <section id="process" className="scroll-mt-32">
                <SectionHeader
                  eyebrow="Implementation"
                  title="Our 4-step process."
                  description="A battle-tested deployment sequence built for minimal disruption."
                />

                <div className="space-y-4">
                  {service.process.map((step) => (
                    <div
                      key={step.step}
                      className="rounded-2xl bg-surface border border-border p-6 flex items-start gap-5"
                    >
                      <div className="w-10 h-10 rounded-xl bg-surface-hover border border-border flex items-center justify-center font-mono font-bold text-sm text-green shrink-0">
                        {step.step}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-display font-semibold text-text text-base">
                          {step.title}
                        </h4>
                        <p className="text-body text-xs text-text-muted leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQ (4 questions) */}
              <section id="faq" className="scroll-mt-32">
                <SectionHeader
                  eyebrow="Questions & Answers"
                  title="Frequently Asked Questions"
                  description="Clear information on timeline, scope, and expectations."
                />

                <FAQAccordion items={service.faqs} />
              </section>
            </div>

            {/* Sticky Right Summary Card (4 cols) */}
            <div className="lg:col-span-4 lg:sticky lg:top-36 space-y-6">
              <div className="rounded-3xl border-gradient bg-surface p-7 space-y-6 shadow-2xl">
                <div>
                  <span className="text-eyebrow text-green">Service Overview</span>
                  <h3 className="text-h3 text-xl text-text mt-1">{service.title}</h3>
                  <p className="text-body text-xs text-text-muted mt-2 leading-relaxed">
                    Custom built and executed for your company by one dedicated team.
                  </p>
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="text-xs font-mono uppercase tracking-wider text-text-dim">
                    Included Highlights:
                  </div>
                  {service.deliverablesSummary.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-text">
                      <Check className="w-4 h-4 text-green shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4">
                  <Button
                    href={`/book-consultation?service=${service.key}`}
                    className="w-full"
                    showArrow
                  >
                    Book Free Consultation
                  </Button>
                  <p className="text-center text-[11px] text-text-dim mt-2.5">
                    30-min strategy review · No obligation
                  </p>
                </div>
              </div>

              {/* Direct Help Card */}
              <div className="rounded-2xl glass border border-border p-5 text-center space-y-2">
                <p className="text-xs text-text-muted">Need a fast answer or custom scope?</p>
                <a
                  href="/whatsapp"
                  className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-green hover:underline min-h-[44px] w-full"
                >
                  <span>Chat directly on WhatsApp →</span>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Related Services (The other 3) */}
      <Section raised>
        <Container>
          <SectionHeader
            eyebrow="Connected Disciplines"
            title="Explore other growth services."
            description="Our services compound when deployed together under one roadmap."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedServices.map((rel) => (
              <Card key={rel.slug} spotlight className="flex flex-col justify-between p-6">
                <div>
                  <span className="text-eyebrow text-green mb-2 block">{rel.eyebrow}</span>
                  <h3 className="text-h3 text-lg text-text mb-2">{rel.title}</h3>
                  <p className="text-body text-xs text-text-muted mb-4 line-clamp-2">
                    {rel.summary}
                  </p>
                </div>
                <Link
                  href={`/services/${rel.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-green hover:underline min-h-[44px]"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { SectionHeader } from '@/components/ui/section-header';
import { Eyebrow } from '@/components/ui/eyebrow';
import { TwoPathButtons } from '@/components/ui/two-path-buttons';
import { BUSINESS_INFO } from '@/lib/utils';
import { MapPin, Clock, Phone, MessageCircle, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Growth Bridge Accelerator',
  description:
    'A business consultancy and marketing team in Delhi that helps ideas become businesses and businesses grow. Learn how we work and what we believe.',
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
      <section className="relative pt-16 pb-20 overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
        <Container className="relative z-10 text-center max-w-3xl mx-auto space-y-6">
          <Eyebrow pill>About Growth Bridge</Eyebrow>
          <h1 className="text-display text-3xl sm:text-4xl lg:text-5xl">
            Helping ideas become businesses, and{' '}
            <span className="gradient-text">businesses grow</span>.
          </h1>
          <p className="text-body text-text-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            We are a business consultancy and marketing team based in Delhi. We serve both people with a new idea and owners of existing businesses looking to scale.
          </p>
          <div className="pt-2 flex justify-center">
            <TwoPathButtons size="lg" location="about_hero" />
          </div>
        </Container>
      </section>

      {/* 1. The Story of the Name (Bridge and Accelerator) */}
      <Section id="story">
        <Container>
          <div className="max-w-3xl mx-auto rounded-[24px] bg-surface border border-border p-8 sm:p-12 space-y-6">
            <span className="text-eyebrow text-green">The Meaning Behind Our Name</span>
            <h2 className="text-h2 text-2xl sm:text-3xl text-text">
              The Bridge and The Accelerator.
            </h2>
            <div className="space-y-4 text-text-muted text-sm sm:text-base leading-relaxed">
              <p>
                The <strong className="text-text">&ldquo;bridge&rdquo;</strong> is the gap between where your business is today and where you want it to be. For someone with an idea, it is the gap between a concept and a paying customer. For an existing business, it is the gap between stalled inquiries and steady, predictable revenue.
              </p>
              <p>
                The <strong className="text-text">&ldquo;accelerator&rdquo;</strong> is how fast we help you cross it. Instead of hiring four separate vendors who blame each other, one focused team coordinates your strategy, builds your online presence, drives your marketing, and retains your customers.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. What We Believe (3 Short Principles in Plain Language) */}
      <Section id="principles" raised>
        <Container>
          <SectionHeader
            eyebrow="Our Principles"
            title="What we believe."
            description="Clear principles guide every recommendation and campaign we create."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-surface border border-border p-7 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-green/10 flex items-center justify-center text-green mb-2">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold text-base text-text">
                Clarity beats complexity
              </h3>
              <p className="text-body text-xs leading-relaxed text-text-muted">
                If an idea cannot be explained in plain language, customers will not buy it. We write plans and reports with zero buzzwords.
              </p>
            </div>

            <div className="rounded-2xl bg-surface border border-border p-7 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan mb-2">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold text-base text-text">
                One connected system
              </h3>
              <p className="text-body text-xs leading-relaxed text-text-muted">
                A website without marketing gets no visitors. Marketing without follow-up wastes ad spend. Every stage must feed the next.
              </p>
            </div>

            <div className="rounded-2xl bg-surface border border-border p-7 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet/10 flex items-center justify-center text-violet mb-2">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold text-base text-text">
                Real accountability
              </h3>
              <p className="text-body text-xs leading-relaxed text-text-muted">
                We measure our work by actual inquiries, customer responses, and cash flow—not vanity impressions or confusing jargon.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. How We Work */}
      <Section id="how-we-work">
        <Container>
          <div className="max-w-3xl mx-auto space-y-8">
            <SectionHeader
              eyebrow="Execution"
              title="How we work with you."
              description="Direct, transparent collaboration from first conversation to weekly updates."
            />

            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-surface border border-border flex items-start gap-4">
                <span className="font-mono text-green font-bold text-sm shrink-0 mt-0.5">01</span>
                <div>
                  <h3 className="font-display font-semibold text-base text-text mb-1">
                    Free diagnostic first conversation
                  </h3>
                  <p className="text-body text-xs text-text-muted leading-relaxed">
                    We listen to your idea or business challenges, identify the immediate growth bottleneck, and suggest what to do first. No obligation.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-surface border border-border flex items-start gap-4">
                <span className="font-mono text-cyan font-bold text-sm shrink-0 mt-0.5">02</span>
                <div>
                  <h3 className="font-display font-semibold text-base text-text mb-1">
                    Clear written scope and fees
                  </h3>
                  <p className="text-body text-xs text-text-muted leading-relaxed">
                    You receive an exact written quote before work starts. We work on pre-agreed service fees with no hidden costs or surprise bills.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-surface border border-border flex items-start gap-4">
                <span className="font-mono text-violet font-bold text-sm shrink-0 mt-0.5">03</span>
                <div>
                  <h3 className="font-display font-semibold text-base text-text mb-1">
                    Weekly progress & monthly reports
                  </h3>
                  <p className="text-body text-xs text-text-muted leading-relaxed">
                    You have direct phone and WhatsApp contact with our team, and receive a monthly summary tracking lead volume and actionable next steps.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. Delhi Address & Map Embed */}
      <Section id="location" raised>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-6">
              <Eyebrow>Physical Presence</Eyebrow>
              <h2 className="text-h2 text-2xl sm:text-3xl text-text">
                Our Delhi office.
              </h2>
              <p className="text-body text-sm text-text-muted leading-relaxed">
                You can reach us by phone, chat on WhatsApp, or visit us in person. We are available Monday to Saturday.
              </p>

              <div className="space-y-4 text-sm text-text-muted">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-green shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-text">{BUSINESS_INFO.name}</div>
                    <div className="text-xs text-text-muted mt-0.5">{BUSINESS_INFO.address.full}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-green shrink-0" />
                  <span>{BUSINESS_INFO.hours}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green shrink-0" />
                  <a href={`tel:${BUSINESS_INFO.phone}`} className="text-text hover:text-green">
                    {BUSINESS_INFO.phoneFormatted}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-green shrink-0" />
                  <a href="/whatsapp" target="_blank" rel="noopener noreferrer" className="text-green hover:underline">
                    WhatsApp Chat (+91 88838 38363)
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-[20px] overflow-hidden border border-border glass p-2 shadow-2xl h-[340px] sm:h-[400px]">
                <iframe
                  title="Growth Bridge Accelerator Office Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.0744655389656!2d77.2713!3d28.6653!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfcf2623d58ef%3A0xc39525bfdc4b9b7e!2sShanti%20Mohalla%2C%20Gandhi%20Nagar%2C%20Delhi%2C%20110031!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-[16px] w-full h-full grayscale-[50%] contrast-[1.1]"
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Ending Section with the Two Path Buttons */}
      <section className="py-20 border-t border-border text-center">
        <Container className="max-w-2xl mx-auto space-y-5">
          <Eyebrow pill>Get Started</Eyebrow>
          <h2 className="text-h2 text-2xl sm:text-3xl text-text">
            Start with a free first conversation.
          </h2>
          <p className="text-body text-sm text-text-muted">
            Share your idea or bring your business. We reply within 1 business day.
          </p>
          <div className="pt-2 flex justify-center">
            <TwoPathButtons size="lg" location="about_page_bottom" />
          </div>
        </Container>
      </section>
    </>
  );
}

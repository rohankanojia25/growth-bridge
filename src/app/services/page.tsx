import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { SectionHeader } from '@/components/ui/section-header';
import { Eyebrow } from '@/components/ui/eyebrow';
import { TwoPathButtons } from '@/components/ui/two-path-buttons';
import { Compass, Globe, Megaphone, Users, Check, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Services | Growth Bridge Accelerator',
  description:
    'Four connected growth stages: Plan, Build, Market, and Grow. Business strategy, high-converting websites, marketing campaigns, and CRM systems.',
  alternates: {
    canonical: '/services',
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
      name: 'Services',
      item: 'https://growthbridgeaccelerator.com/services',
    },
  ],
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Services Overview Hero */}
      <section className="relative pt-16 pb-20 overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
        <Container className="relative z-10 text-center max-w-3xl mx-auto space-y-6">
          <Eyebrow pill>Our Services</Eyebrow>
          <h1 className="text-display text-3xl sm:text-4xl lg:text-5xl">
            Everything your business needs to <span className="gradient-text">scale</span>.
          </h1>
          <p className="text-body text-text-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            One connected growth team. We plan your strategy, build your digital presence, run your marketing, and set up the systems that keep customers returning.
          </p>
          <div className="pt-2 flex justify-center">
            <TwoPathButtons size="lg" location="services_hero" />
          </div>
        </Container>
      </section>

      {/* =========================================================================
          SECTION 1: PLAN (id="plan")
          ========================================================================= */}
      <Section id="plan" className="scroll-mt-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-green/10 border border-green/20 flex items-center justify-center text-green">
                <Compass className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-green uppercase tracking-wider">
                Stage 01
              </div>
              <h2 className="text-h2 text-3xl sm:text-4xl text-text">
                Plan: Business Strategy & Validation
              </h2>
              <div className="p-4 rounded-xl bg-surface border border-border">
                <span className="text-xs font-mono text-green uppercase tracking-wider block mb-1">
                  Who it is for
                </span>
                <p className="text-xs text-text-muted leading-relaxed">
                  Entrepreneurs testing a new concept or established business owners looking to unlock stalled revenue with a clear commercial roadmap.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 rounded-[24px] bg-surface border border-border p-8 sm:p-10 space-y-8">
              <div>
                <h3 className="text-h3 text-xl text-text mb-4">What you get:</h3>
                <ul className="space-y-3.5">
                  <li className="flex items-start gap-3 text-sm text-text-muted">
                    <Check className="w-5 h-5 text-green shrink-0 mt-0.5" />
                    <span><strong className="text-text">Idea validation:</strong> Rigorous stress-testing of market demand, customer pain points, and willingness to pay.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-text-muted">
                    <Check className="w-5 h-5 text-green shrink-0 mt-0.5" />
                    <span><strong className="text-text">Business plan and offer design:</strong> Clear unit economics, competitive positioning, and high-margin pricing.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-text-muted">
                    <Check className="w-5 h-5 text-green shrink-0 mt-0.5" />
                    <span><strong className="text-text">Go-to-market plan:</strong> Step-by-step rollout plan with channel budgets, launch dates, and acquisition targets.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-text-muted">
                    <Check className="w-5 h-5 text-green shrink-0 mt-0.5" />
                    <span><strong className="text-text">Growth strategy for existing businesses:</strong> Identifying margin leaks, unclosed inquiries, and expansion opportunities.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-text-muted">
                    <Check className="w-5 h-5 text-green shrink-0 mt-0.5" />
                    <span><strong className="text-text">Monthly growth review:</strong> Structured monthly alignment with actionable priorities for the following 30 days.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-text-dim">Ready to plan your roadmap?</span>
                <TwoPathButtons size="sm" location="services_plan" />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* =========================================================================
          SECTION 2: BUILD (id="build")
          ========================================================================= */}
      <Section id="build" raised className="scroll-mt-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan">
                <Globe className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-cyan uppercase tracking-wider">
                Stage 02
              </div>
              <h2 className="text-h2 text-3xl sm:text-4xl text-text">
                Build: Website & Digital Presence
              </h2>
              <div className="p-4 rounded-xl bg-surface border border-border">
                <span className="text-xs font-mono text-cyan uppercase tracking-wider block mb-1">
                  Who it is for
                </span>
                <p className="text-xs text-text-muted leading-relaxed">
                  Businesses needing a credible, modern online presence that loads in milliseconds and converts traffic into direct phone and WhatsApp inquiries.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 rounded-[24px] bg-surface border border-border p-8 sm:p-10 space-y-8">
              <div>
                <h3 className="text-h3 text-xl text-text mb-4">What you get:</h3>
                <ul className="space-y-3.5">
                  <li className="flex items-start gap-3 text-sm text-text-muted">
                    <Check className="w-5 h-5 text-cyan shrink-0 mt-0.5" />
                    <span><strong className="text-text">Business website:</strong> Fast, mobile-first, professional website designed for Indian buyers and high trust.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-text-muted">
                    <Check className="w-5 h-5 text-cyan shrink-0 mt-0.5" />
                    <span><strong className="text-text">Landing pages:</strong> High-intent conversion pages built specifically for targeted Google and social ad campaigns.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-text-muted">
                    <Check className="w-5 h-5 text-cyan shrink-0 mt-0.5" />
                    <span><strong className="text-text">Branding basics:</strong> Visual identity guidelines, color palettes, typography, and clear brand assets.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-text-muted">
                    <Check className="w-5 h-5 text-cyan shrink-0 mt-0.5" />
                    <span><strong className="text-text">Google Business Profile:</strong> Complete setup and verification to rank in Google Maps local pack results.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-text-muted">
                    <Check className="w-5 h-5 text-cyan shrink-0 mt-0.5" />
                    <span><strong className="text-text">WhatsApp click-to-chat:</strong> Instant 1-tap WhatsApp chat buttons integrated with prefilled inquiry messages.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-text-dim">Ready to build your digital presence?</span>
                <TwoPathButtons size="sm" location="services_build" />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* =========================================================================
          SECTION 3: MARKET (id="market")
          ========================================================================= */}
      <Section id="market" className="scroll-mt-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-violet/10 border border-violet/20 flex items-center justify-center text-violet">
                <Megaphone className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-violet uppercase tracking-wider">
                Stage 03
              </div>
              <h2 className="text-h2 text-3xl sm:text-4xl text-text">
                Market: Lead Generation & SEO
              </h2>
              <div className="p-4 rounded-xl bg-surface border border-border">
                <span className="text-xs font-mono text-violet uppercase tracking-wider block mb-1">
                  Who it is for
                </span>
                <p className="text-xs text-text-muted leading-relaxed">
                  Companies tired of wasting money on ineffective ads that bring vanity clicks rather than qualified phone and WhatsApp inquiries.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 rounded-[24px] bg-surface border border-border p-8 sm:p-10 space-y-8">
              <div>
                <h3 className="text-h3 text-xl text-text mb-4">What you get:</h3>
                <ul className="space-y-3.5">
                  <li className="flex items-start gap-3 text-sm text-text-muted">
                    <Check className="w-5 h-5 text-violet shrink-0 mt-0.5" />
                    <span><strong className="text-text">Local and national SEO:</strong> Organic search optimization targeting buyer intent across Delhi NCR and India.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-text-muted">
                    <Check className="w-5 h-5 text-violet shrink-0 mt-0.5" />
                    <span><strong className="text-text">Social media marketing:</strong> Consistent authority building and content on Instagram, LinkedIn, and YouTube.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-text-muted">
                    <Check className="w-5 h-5 text-violet shrink-0 mt-0.5" />
                    <span><strong className="text-text">Paid ads management:</strong> High-intent Google Search and Meta ads configured to minimize cost per lead.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-text-muted">
                    <Check className="w-5 h-5 text-violet shrink-0 mt-0.5" />
                    <span><strong className="text-text">Content production:</strong> Direct-response copywriting, case studies, and customer-focused articles.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-text-muted">
                    <Check className="w-5 h-5 text-violet shrink-0 mt-0.5" />
                    <span><strong className="text-text">Lead generation campaigns:</strong> End-to-end inbound funnels tracked directly from ad click to verified inquiry.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-text-dim">Ready to generate customer inquiries?</span>
                <TwoPathButtons size="sm" location="services_market" />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* =========================================================================
          SECTION 4: GROW (id="grow")
          ========================================================================= */}
      <Section id="grow" raised className="scroll-mt-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-green/10 border border-green/20 flex items-center justify-center text-green">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-green uppercase tracking-wider">
                Stage 04
              </div>
              <h2 className="text-h2 text-3xl sm:text-4xl text-text">
                Grow: CRM & Retention Systems
              </h2>
              <div className="p-4 rounded-xl bg-surface border border-border">
                <span className="text-xs font-mono text-green uppercase tracking-wider block mb-1">
                  Who it is for
                </span>
                <p className="text-xs text-text-muted leading-relaxed">
                  Teams losing sales because inquiries slip through chats or follow-ups happen too late. A growth tool configured for your business, not complex software to struggle with.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 rounded-[24px] bg-surface border border-border p-8 sm:p-10 space-y-8">
              <div>
                <h3 className="text-h3 text-xl text-text mb-4">What you get:</h3>
                <ul className="space-y-3.5">
                  <li className="flex items-start gap-3 text-sm text-text-muted">
                    <Check className="w-5 h-5 text-green shrink-0 mt-0.5" />
                    <span><strong className="text-text">CRM setup for your business:</strong> Custom configuration tailored to your sales process and team workflow.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-text-muted">
                    <Check className="w-5 h-5 text-green shrink-0 mt-0.5" />
                    <span><strong className="text-text">Enquiry and customer tracking:</strong> Centralized dashboard logging every lead from website, calls, and WhatsApp.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-text-muted">
                    <Check className="w-5 h-5 text-green shrink-0 mt-0.5" />
                    <span><strong className="text-text">Follow-up reminders:</strong> Automated alerts so your sales staff never leaves an interested prospect waiting.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-text-muted">
                    <Check className="w-5 h-5 text-green shrink-0 mt-0.5" />
                    <span><strong className="text-text">Repeat-customer campaigns:</strong> Retention sequences to re-engage past buyers and increase lifetime value.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-text-muted">
                    <Check className="w-5 h-5 text-green shrink-0 mt-0.5" />
                    <span><strong className="text-text">Plain-language reports:</strong> Clear monthly performance reviews tracking actual sales conversions, not confusing jargon.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-text-dim">Ready to retain more customers?</span>
                <TwoPathButtons size="sm" location="services_grow" />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Page Ending CTA with the two path buttons */}
      <section className="py-20 border-t border-border text-center">
        <Container className="max-w-2xl mx-auto space-y-5">
          <Eyebrow pill>Get Started</Eyebrow>
          <h2 className="text-h2 text-2xl sm:text-3xl text-text">
            Ready to put this growth system to work?
          </h2>
          <p className="text-body text-sm text-text-muted">
            Share your idea or bring your business. We reply within 1 business day.
          </p>
          <div className="pt-2 flex justify-center">
            <TwoPathButtons size="lg" location="services_page_bottom" />
          </div>
        </Container>
      </section>
    </>
  );
}

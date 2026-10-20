import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { SectionHeader } from '@/components/ui/section-header';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Marquee } from '@/components/ui/marquee';
import { FAQAccordion } from '@/components/ui/faq-accordion';
import { SiteImage } from '@/components/ui/site-image';
import { HeroDashboardPreview } from '@/components/hero/hero-dashboard-preview';

import { GrowthSystemDiagram } from '@/components/sections/growth-system-diagram';
import { ProcessTimeline } from '@/components/sections/process-timeline';
import { HomeQuickForm } from '@/components/forms/home-quick-form';
import { createPublicSupabaseClient } from '@/lib/supabase/server';
import { BUSINESS_INFO, SERVICES } from '@/lib/utils';
import {
  Compass,
  Globe,
  Users,
  Megaphone,
  ArrowRight,
  ArrowUpRight,
  UtensilsCrossed,
  ShoppingBag,
  Stethoscope,
  GraduationCap,
  Factory,
  Wrench,
  Check,
  X,
  Phone,
  MessageCircle,
} from 'lucide-react';

export const revalidate = 3600; // Static ISR 3600s as required by Section 6

const CAPABILITIES = [
  'Business Strategy',
  'Websites',
  'CRM Setup',
  'SEO',
  'Local SEO',
  'Social Media',
  'Paid Ads',
  'Branding',
  'Lead Generation',
  'Automation',
];

const INDUSTRIES = [
  { name: 'Restaurants & Cafes', icon: UtensilsCrossed },
  { name: 'Retail & Showrooms', icon: ShoppingBag },
  { name: 'Clinics & Healthcare', icon: Stethoscope },
  { name: 'Education & Coaching', icon: GraduationCap },
  { name: 'Manufacturing & B2B', icon: Factory },
  { name: 'Local Services', icon: Wrench },
];

const FAQS = [
  {
    question: 'What does Growth Bridge Accelerator do?',
    answer:
      'We act as your complete growth department. Instead of hiring separate vendors who do not communicate, we handle business growth strategy, high-speed website development, CRM pipeline setup, and full-stack marketing under one unified roadmap.',
  },
  {
    question: 'Do you work with small businesses?',
    answer:
      'Yes. Our core focus is small and mid-sized businesses across Delhi NCR and India. We structure our engagements to solve immediate growth bottlenecks—getting more qualified inquiries and automating customer follow-ups—without enterprise overhead.',
  },
  {
    question: 'Can you handle website, CRM and marketing together?',
    answer:
      'Connecting these three is exactly why we exist. A website without a CRM loses leads; marketing without a high-converting website wastes budget. By orchestrating strategy, web, CRM, and marketing together, every rupee you invest compounds.',
  },
  {
    question: 'How does the free consultation work?',
    answer:
      'During the 30-minute discovery call, we examine your current customer acquisition channels, lead leaks, and operational bottlenecks. We provide an honest assessment of what to fix first. There is zero pressure and no obligation.',
  },
  {
    question: 'Do you serve businesses outside Delhi?',
    answer:
      'Yes. While our headquarters are in Gandhi Nagar, Delhi, we consult and run digital growth systems for business owners across India via Google Meet and structured weekly sprints.',
  },
  {
    question: 'How do I get started?',
    answer:
      'Book a free consultation directly through our calendar or reach out on WhatsApp at +91 88838 38363. We will review your goals and suggest the fastest path forward.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export default async function HomePage() {
  // Query optional dynamic sections according to Section 4 rules:
  // Client logos: renders ONLY if client_logos table has >= 4 published rows
  // Testimonials: renders ONLY if published rows exist
  // Case studies preview (3 latest): renders ONLY if published rows exist
  // Latest articles (3 latest): renders ONLY if published rows exist
  let clientLogos: Array<{ id: string; name: string; logo_url: string; website_url?: string }> = [];
  let testimonials: Array<{ id: string; author_name: string; author_role?: string; business_name?: string; quote: string }> = [];
  let caseStudies: Array<{ id: string; title: string; slug: string; client_name: string; industry?: string; summary?: string }> = [];
  let blogPosts: Array<{ id: string; title: string; slug: string; excerpt?: string; published_at?: string }> = [];

  try {
    const supabase = createPublicSupabaseClient();

    const [logosRes, testRes, casesRes, blogsRes] = await Promise.all([
      supabase.from('client_logos').select('id, name, logo_url, website_url').eq('is_published', true).order('sort_order'),
      supabase.from('testimonials').select('id, author_name, author_role, business_name, quote').eq('is_published', true).order('sort_order').limit(6),
      supabase.from('case_studies').select('id, title, slug, client_name, industry, summary').eq('is_published', true).order('created_at', { ascending: false }).limit(3),
      supabase.from('blog_posts').select('id, title, slug, excerpt, published_at').eq('is_published', true).order('published_at', { ascending: false }).limit(3),
    ]);

    if (logosRes.data && logosRes.data.length >= 4) clientLogos = logosRes.data;
    if (testRes.data && testRes.data.length > 0) testimonials = testRes.data;
    if (casesRes.data && casesRes.data.length > 0) caseStudies = casesRes.data;
    if (blogsRes.data && blogsRes.data.length > 0) blogPosts = blogsRes.data;
  } catch {
    // Database empty or offline — graceful fallback
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* =========================================================================
          SECTION 2: HERO
          ========================================================================= */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-20 overflow-hidden">
        {/* Background Grid & Noise */}
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        <div className="absolute inset-0 bg-noise pointer-events-none" />

        {/* Floating Orbs */}
        <div
          className="orb orb-green top-10 left-10 w-[450px] h-[450px] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="orb orb-violet bottom-10 right-10 w-[450px] h-[450px] pointer-events-none"
          aria-hidden="true"
        />

        <Container className="relative z-10 max-w-[1380px]">
          <div className="grid grid-cols-1 lg:grid-cols-[48%_52%] gap-10 lg:gap-8 xl:gap-12 items-center">
            {/* Left Column: Copy & Actions */}
            <div className="w-full max-w-[620px] space-y-6">
              <Eyebrow pill>Strategy · Websites · CRM · Marketing</Eyebrow>

              <h1 className="font-display font-semibold text-[clamp(2.35rem,1.5rem+2.2vw,3.75rem)] leading-[1.08] tracking-[-0.035em] text-text max-w-[560px]">
                Have an idea or a business?{' '}
                We help it <span className="font-serif italic font-normal gradient-text">grow.</span>
              </h1>

              <p className="text-body text-text-muted text-base sm:text-lg max-w-[530px] leading-relaxed">
                Growth Bridge Accelerator helps Indian businesses plan smarter, get online, manage every customer, and grow faster.
              </p>

              <div className="pt-2 flex flex-col min-[480px]:flex-row items-stretch min-[480px]:items-center gap-3 min-[480px]:gap-4 w-full min-[480px]:w-auto [&>*]:w-full min-[480px]:[&>*]:w-auto">
                <Button href="/book-consultation" size="lg" showArrow>
                  Book Free Consultation
                </Button>
                <Button href="/services" variant="secondary" size="lg">
                  Explore Services
                </Button>
              </div>

              {/* Bottom Feature Micro-Cards from the graphic */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="flex items-start gap-2.5">
                  <Globe className="w-4 h-4 text-cyan mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-text">Modern Websites</div>
                    <div className="text-text-dim text-[11px]">Fast. Mobile. SEO Ready.</div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Users className="w-4 h-4 text-green mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-text">CRM Systems</div>
                    <div className="text-text-dim text-[11px]">Keep Your Customers.</div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Megaphone className="w-4 h-4 text-green mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-text">Full Stack Marketing</div>
                    <div className="text-text-dim text-[11px]">Strategy to Sales.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Monevi-Style Interactive Glass Dashboard */}
            <div className="relative w-full flex items-center justify-center lg:justify-end">
              <HeroDashboardPreview />
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          SECTION 3: CAPABILITY RIBBON (Infinite marquee of services)
          ========================================================================= */}
      <section className="bg-bg-raised/60">
        <Marquee items={CAPABILITIES} />
      </section>

      {/* =========================================================================
          SECTION 4: PROBLEM AND SYSTEM
          ========================================================================= */}
      <Section id="problem-system">
        <Container>
          <SectionHeader
            eyebrow="The Traditional Problem"
            title="Why most business growth stalls."
            description="When you divide growth across different agencies and freelancers, nobody owns the end outcome."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
            {/* Before Card */}
            <div className="rounded-[20px] bg-surface/40 border border-dashed border-white/15 p-8 relative">
              <div className="flex items-center gap-2 text-danger font-mono text-xs uppercase tracking-wider mb-4">
                <X className="w-4 h-4" />
                <span>The Fragmented Trap</span>
              </div>
              <h3 className="text-h3 text-xl mb-4 text-text">
                Before: four vendors, four invoices, no shared plan.
              </h3>
              <p className="text-body text-sm leading-relaxed mb-6">
                The web designer blames the SEO agency. The marketing consultant blames your sales team. Inquiries slip through spreadsheets, ad budget gets wasted, and leadership has zero visibility into actual revenue return.
              </p>
              <ul className="space-y-2.5 text-xs text-text-muted">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-danger/80" />
                  <span>Unconnected web pages with no lead capture pipeline</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-danger/80" />
                  <span>Slow WhatsApp follow-ups losing 40%+ of warm prospects</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-danger/80" />
                  <span>Marketing reports showing impressions instead of real sales</span>
                </li>
              </ul>
            </div>

            {/* After Card */}
            <Card gradient spotlight className="p-8">
              <div className="flex items-center gap-2 text-green font-mono text-xs uppercase tracking-wider mb-4">
                <Check className="w-4 h-4" />
                <span>The Connected System</span>
              </div>
              <h3 className="text-h3 text-xl mb-4 text-text">
                After: one team, one roadmap, one place to see results.
              </h3>
              <p className="text-body text-sm leading-relaxed mb-6">
                Growth Bridge Accelerator aligns your business strategy, website, customer database, and acquisition campaigns into a single synchronized machine. One weekly review, one accountable partner.
              </p>
              <ul className="space-y-2.5 text-xs text-text">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green" />
                  <span>Unified growth strategy that defines exact customer targets</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green" />
                  <span>Custom CRM syncing every WhatsApp and web inquiry in real time</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green" />
                  <span>High-intent ad spend routed only to proven conversion pages</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* 3-item Row of Qualitative Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-border">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl glass border border-green/30 flex items-center justify-center text-green font-mono text-sm shrink-0">
                01
              </div>
              <div>
                <h4 className="font-display font-semibold text-text text-base">Faster decisions</h4>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  No cross-vendor email chains or conflicting recommendations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl glass border border-green/30 flex items-center justify-center text-green font-mono text-sm shrink-0">
                02
              </div>
              <div>
                <h4 className="font-display font-semibold text-text text-base">Fewer handoffs</h4>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  Your strategy flows directly into design, CRM pipelines, and campaigns.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl glass border border-green/30 flex items-center justify-center text-green font-mono text-sm shrink-0">
                03
              </div>
              <div>
                <h4 className="font-display font-semibold text-text text-base">One accountable partner</h4>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  We take complete responsibility for your business growth trajectory.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* =========================================================================
          SECTION 5: SERVICES BENTO (4 cards, first spans 2 cols on desktop)
          ========================================================================= */}
      <Section id="services" raised>
        <Container>
          <SectionHeader
            eyebrow="Core Services"
            title="Four core disciplines. One unified execution."
            description="Explore our specialized services built specifically for owner-operated Indian businesses."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Consulting (Spans 2 columns on desktop) */}
            <Card className="lg:col-span-2 flex flex-col justify-between" spotlight>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green/10 border border-green/20 flex items-center justify-center text-green">
                    <Compass className="w-6 h-6" />
                  </div>
                  <span className="text-eyebrow text-green">Strategy Core</span>
                </div>

                <h3 className="text-h3 text-2xl text-text mb-2">
                  Business Consulting
                </h3>
                <p className="text-body text-sm mb-6 max-w-xl">
                  Growth strategy, operations review, and go-to-market planning designed to eliminate bottlenecks and expand margins.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-bg border border-border">
                    <div className="text-xs font-mono text-green mb-1">01. Audit</div>
                    <div className="text-xs font-medium text-text">Unit economics & margin review</div>
                  </div>
                  <div className="p-3 rounded-xl bg-bg border border-border">
                    <div className="text-xs font-mono text-green mb-1">02. Roadmap</div>
                    <div className="text-xs font-medium text-text">90-day prioritized execution plan</div>
                  </div>
                  <div className="p-3 rounded-xl bg-bg border border-border">
                    <div className="text-xs font-mono text-green mb-1">03. Alignment</div>
                    <div className="text-xs font-medium text-text">Sales & operational workflow design</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs text-text-dim font-mono">Deliverables · Review · Scaling</span>
                <Link
                  href="/services/business-consulting"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-green hover:underline group min-h-[44px] py-2"
                >
                  <span>Explore Consulting</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Card>

            {/* Card 2: Website Generation */}
            <Card className="flex flex-col justify-between" spotlight>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan">
                    <Globe className="w-6 h-6" />
                  </div>
                  <span className="text-eyebrow text-cyan">Online Presence</span>
                </div>

                <h3 className="text-h3 text-xl text-text mb-2">
                  Website Generation
                </h3>
                <p className="text-body text-xs mb-6">
                  Business websites, landing pages, and WhatsApp-first sites built for lightning speed and conversion.
                </p>

                <ul className="space-y-2 text-xs text-text-muted mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-green shrink-0" />
                    <span>Sub-2 second load time on Indian 4G/5G</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-green shrink-0" />
                    <span>WhatsApp floating CTA & instant routing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-green shrink-0" />
                    <span>Technical SEO & schema markup included</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-border">
                <Link
                  href="/services/website-generation"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-text hover:text-green group min-h-[44px] py-2"
                >
                  <span>View Website Details</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Card>

            {/* Card 3: CRM for Businesses */}
            <Card className="flex flex-col justify-between" spotlight>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-violet/10 border border-violet/20 flex items-center justify-center text-violet">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-eyebrow text-violet">Operations</span>
                </div>

                <h3 className="text-h3 text-xl text-text mb-2">
                  CRM for Businesses
                </h3>
                <p className="text-body text-xs mb-6">
                  Setup, customization, automation, and team training so no customer lead ever falls through the cracks.
                </p>

                <ul className="space-y-2 text-xs text-text-muted mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-green shrink-0" />
                    <span>Lead stage tracking from inquiry to closed deal</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-green shrink-0" />
                    <span>Automated follow-up reminders via WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-green shrink-0" />
                    <span>Hands-on training for your internal sales staff</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-border">
                <Link
                  href="/services/crm-for-businesses"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-text hover:text-green group min-h-[44px] py-2"
                >
                  <span>View CRM Details</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Card>

            {/* Card 4: Full-Stack Marketing (Spans 2 columns on desktop) */}
            <Card className="lg:col-span-2 flex flex-col justify-between" spotlight>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green/10 border border-green/20 flex items-center justify-center text-green">
                    <Megaphone className="w-6 h-6" />
                  </div>
                  <span className="text-eyebrow text-green">Acquisition</span>
                </div>

                <h3 className="text-h3 text-2xl text-text mb-2">
                  Full-Stack Business Marketing
                </h3>
                <p className="text-body text-sm mb-6 max-w-xl">
                  Local SEO, Google Search ads, social media, content, branding, and high-intent lead generation measured in revenue.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-bg border border-border">
                    <div className="text-xs font-mono text-green mb-1">Local Dominance</div>
                    <div className="text-xs font-medium text-text">Google Maps & Delhi NCR local pack ranking</div>
                  </div>
                  <div className="p-3 rounded-xl bg-bg border border-border">
                    <div className="text-xs font-mono text-green mb-1">Paid Search Ads</div>
                    <div className="text-xs font-medium text-text">High-intent Google Ads without budget waste</div>
                  </div>
                  <div className="p-3 rounded-xl bg-bg border border-border">
                    <div className="text-xs font-mono text-green mb-1">Social & Content</div>
                    <div className="text-xs font-medium text-text">Consistent authority building & lead capture</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs text-text-dim font-mono">Acquisition · Local SEO · Paid Performance</span>
                <Link
                  href="/services/full-stack-marketing"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-green hover:underline group min-h-[44px] py-2"
                >
                  <span>Explore Marketing</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      {/* =========================================================================
          SECTION 6: GROWTH SYSTEM DIAGRAM (Inline SVG Loop)
          ========================================================================= */}
      <Section id="system">
        <Container>
          <SectionHeader
            centered
            eyebrow="The Growth Engine"
            title="Every service feeds the next."
            description="Strategy defines the message. The website converts visitors. The CRM captures and nurtures them. Marketing feeds continuous demand."
          />
          <GrowthSystemDiagram />
        </Container>
      </Section>

      {/* =========================================================================
          SECTION 7: PROCESS (Sticky left title + timeline)
          ========================================================================= */}
      <Section id="process" raised>
        <Container>
          <ProcessTimeline />
        </Container>
      </Section>

      {/* =========================================================================
          SECTION 8: INDUSTRIES (Chips in wrapping row)
          ========================================================================= */}
      <Section id="industries">
        <Container>
          <SectionHeader
            eyebrow="Who We Serve"
            title="Engineered for high-intent Indian business sectors."
            description="Our frameworks are optimized for local service providers, retail showrooms, clinics, and manufacturing firms."
          />

          <div className="flex flex-wrap gap-3.5">
            {INDUSTRIES.map((ind) => {
              const Icon = ind.icon;
              return (
                <div
                  key={ind.name}
                  className="glass rounded-full px-5 py-3 border border-border hover:border-green/50 transition-colors flex items-center gap-3 group"
                >
                  <Icon className="w-4 h-4 text-green transition-transform group-hover:scale-110" />
                  <span className="font-display font-medium text-sm text-text">
                    {ind.name}
                  </span>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* =========================================================================
          SECTION 9: CLIENT LOGOS STRIP (Renders ONLY if >= 4 published rows exist)
          ========================================================================= */}
      {clientLogos.length >= 4 && (
        <Section id="clients" raised className="py-12">
          <Container>
            <div className="text-center text-xs font-mono uppercase tracking-widest text-text-dim mb-8">
              Trusted By Growing Businesses Across Delhi NCR
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 items-center">
              {clientLogos.map((client) => (
                <div
                  key={client.id}
                  className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100"
                >
                  <img
                    src={client.logo_url}
                    alt={client.name}
                    className="max-h-8 object-contain"
                  />
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* =========================================================================
          SECTION 10: TESTIMONIALS (Renders ONLY if published rows exist)
          ========================================================================= */}
      {testimonials.length > 0 && (
        <Section id="testimonials">
          <Container>
            <SectionHeader
              eyebrow="Client Stories"
              title="What business owners say."
              description="Direct feedback from owners who switched from multiple disconnected vendors to Growth Bridge Accelerator."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((test) => (
                <Card key={test.id} className="flex flex-col justify-between" spotlight>
                  <p className="text-sm text-text-muted leading-relaxed mb-6 italic">
                    "{test.quote}"
                  </p>
                  <div className="border-t border-border pt-4">
                    <div className="font-display font-semibold text-text text-sm">
                      {test.author_name}
                    </div>
                    <div className="text-xs text-text-dim mt-0.5">
                      {test.author_role} {test.business_name && `· ${test.business_name}`}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* =========================================================================
          SECTION 11: CASE STUDIES PREVIEW (Renders ONLY if published rows exist)
          ========================================================================= */}
      {caseStudies.length > 0 && (
        <Section id="case-studies" raised>
          <Container>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <SectionHeader
                eyebrow="Proven Impact"
                title="Recent client transformations."
                description="Real breakdowns of how our connected system grew inquiries and revenue."
                className="mb-0"
              />
              <Button href="/case-studies" variant="secondary" size="sm">
                View All Case Studies
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {caseStudies.map((cs) => (
                <Card key={cs.id} className="flex flex-col justify-between" spotlight>
                  <div>
                    {cs.industry && (
                      <span className="text-eyebrow text-green mb-2 block">{cs.industry}</span>
                    )}
                    <h3 className="text-h3 text-xl text-text mb-3">{cs.title}</h3>
                    {cs.summary && (
                      <p className="text-body text-xs text-text-muted mb-4 line-clamp-3">{cs.summary}</p>
                    )}
                  </div>
                  <Link
                    href={`/case-studies/${cs.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-green hover:underline mt-4"
                  >
                    <span>Read Full Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* =========================================================================
          SECTION 12: FAQ (6 questions in accessible accordion)
          ========================================================================= */}
      <Section id="faq">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-4">
              <Eyebrow pill>Got Questions?</Eyebrow>
              <h2 className="text-h2">Frequently Asked Questions</h2>
              <p className="text-body text-text-muted">
                Clear answers regarding our services, working model, and how we accelerate Indian businesses.
              </p>
              <div className="pt-4">
                <Button href="/contact" variant="secondary" size="sm">
                  Still Have Questions? Contact Us
                </Button>
              </div>
            </div>

            <div className="lg:col-span-7">
              <FAQAccordion items={FAQS} />
            </div>
          </div>
        </Container>
      </Section>

      {/* =========================================================================
          SECTION 13: FINAL CTA (Border-gradient panel over noise + inline lead form)
          ========================================================================= */}
      <Section id="final-cta" className="pb-28">
        <Container>
          <div className="relative rounded-[28px] border-gradient bg-surface p-8 sm:p-14 overflow-hidden shadow-2xl">
            {/* Background noise and glow */}
            <div className="absolute inset-0 bg-noise opacity-50 pointer-events-none" />
            <div
              className="orb orb-green top-0 right-0 w-[400px] h-[400px] pointer-events-none opacity-30"
              aria-hidden="true"
            />

            <div className="relative z-10 max-w-2xl space-y-6">
              <Eyebrow pill>Start Growing Today</Eyebrow>

              <h2 className="text-h2">
                Ready to build your <span className="gradient-text">growth bridge?</span>
              </h2>

              <p className="text-body text-text-muted text-base sm:text-lg leading-relaxed">
                Stop juggling multiple disconnected vendors. Tell us your goals and we will prepare a clear, connected growth blueprint for your business.
              </p>

              {/* Inline Quick Form */}
              <div className="pt-2">
                <HomeQuickForm />
              </div>

              {/* Direct Phone & WhatsApp buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-mono">
                <a
                  href={`tel:${BUSINESS_INFO.phone}`}
                  className="inline-flex items-center gap-2 px-4 min-h-[44px] rounded-full glass border border-white/10 text-text hover:text-green transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-green" />
                  <span>Call {BUSINESS_INFO.phoneFormatted}</span>
                </a>

                <a
                  href={BUSINESS_INFO.whatsappUrl}
                  className="inline-flex items-center gap-2 px-4 min-h-[44px] rounded-full glass border border-green/30 text-green hover:bg-green/10 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Direct WhatsApp Chat</span>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

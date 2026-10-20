import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { SectionHeader } from '@/components/ui/section-header';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Card } from '@/components/ui/card';
import { FAQAccordion } from '@/components/ui/faq-accordion';
import { HeroAbstractCard } from '@/components/sections/hero-abstract-card';
import { GrowthSystemDiagram } from '@/components/sections/growth-system-diagram';
import { TwoPathButtons } from '@/components/ui/two-path-buttons';
import { createPublicSupabaseClient } from '@/lib/supabase/server';
import { BUSINESS_INFO } from '@/lib/utils';
import { FIRST_REPLY_TIME, CONFIDENTIALITY_NOTE } from '@/lib/config';
import {
  Lightbulb,
  Briefcase,
  Compass,
  Globe,
  Megaphone,
  Users,
  ArrowRight,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export const revalidate = 3600; // Static ISR

const TARGET_CHIPS = [
  'New ideas and startups',
  'Restaurants and cafes',
  'Retail and wholesale',
  'Clinics and healthcare',
  'Coaching and education',
  'Manufacturers',
  'Local service providers',
];

const FAQS = [
  {
    question: 'Do you only work with existing businesses?',
    answer:
      'No. We work with both new ideas and established businesses. If you have an idea, we help you test it, plan it and launch it. If you have an existing business, we help you scale your revenue.',
  },
  {
    question: 'Can I share an idea even if I have no budget yet?',
    answer:
      'Yes. The first conversation is completely free. We help you figure out what to build first and what it will cost before you spend anything.',
  },
  {
    question: 'Is my idea kept confidential?',
    answer: CONFIDENTIALITY_NOTE,
  },
  {
    question: 'What does it cost?',
    answer:
      'Every business is different. After the first conversation you get a clear quote in writing. There are no hidden fees or surprise invoices.',
  },
  {
    question: 'Do you invest in ideas?',
    answer:
      'We are a consultancy and marketing team, not an investor. We work on fees that are agreed in writing before we start.',
  },
  {
    question: 'How soon will I hear back?',
    answer: `We reply to every enquiry within ${FIRST_REPLY_TIME}. If you message us on WhatsApp during working hours, we usually reply within an hour.`,
  },
];

export default async function HomePage() {
  // Query published case studies (conditional render per v3 spec)
  let caseStudies: Array<{
    id: string;
    title: string;
    slug: string;
    client_name: string;
    industry?: string;
    summary?: string;
  }> = [];

  try {
    const supabase = createPublicSupabaseClient();
    const { data } = await supabase
      .from('case_studies')
      .select('id, title, slug, client_name, industry, summary')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(3);

    if (data && data.length > 0) {
      caseStudies = data;
    }
  } catch {
    // Graceful fallback if database empty
  }

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* =========================================================================
          a) HERO SECTION
          ========================================================================= */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-8 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        <div className="absolute inset-0 bg-noise pointer-events-none" />
        <div
          className="orb orb-green top-10 left-10 w-[450px] h-[450px] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="orb orb-violet bottom-10 right-10 w-[450px] h-[450px] pointer-events-none"
          aria-hidden="true"
        />

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left: Copy & Actions */}
            <div className="lg:col-span-7 space-y-6">
              <Eyebrow pill>Business consultancy and marketing, Delhi</Eyebrow>

              <h1 className="text-display">
                Have an idea or a business?{' '}
                <span className="gradient-text">We help it grow.</span>
              </h1>

              <p className="text-body text-text-muted text-lg sm:text-xl max-w-2xl leading-relaxed">
                Growth Bridge Accelerator plans your strategy, builds your online presence, runs your marketing and sets up the systems that keep customers coming back.
              </p>

              <div className="pt-2">
                <TwoPathButtons size="lg" location="hero" showIcons />
              </div>

              <p className="text-xs font-mono text-text-dim flex items-center gap-2 pt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green" />
                <span>Free first conversation. We reply within {FIRST_REPLY_TIME}.</span>
              </p>
            </div>

            {/* Right: Visual Art Slot */}
            <div className="lg:col-span-5">
              <div className="relative">
                <div
                  className="absolute -inset-1 rounded-[24px] bg-green/20 opacity-40 blur-xl pointer-events-none"
                  aria-hidden="true"
                />
                <div className="relative glass border-gradient rounded-[24px] p-2 sm:p-3 overflow-hidden shadow-2xl">
                  <div className="relative rounded-[18px] overflow-hidden bg-bg">
                    <HeroAbstractCard />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          b) CHOOSE YOUR STARTING POINT (Two Large Cards)
          ========================================================================= */}
      <Section id="choose-path" raised>
        <Container>
          <SectionHeader
            eyebrow="Two Clear Paths"
            title="Choose your starting point."
            description="Whether starting from scratch or scaling an existing operation, we tailor our support to where you are."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Card 1: Idea */}
            <div className="rounded-[24px] bg-surface border border-border p-8 sm:p-10 flex flex-col justify-between transition-all duration-200 hover:border-green/40 hover:-translate-y-1">
              <div>
                <div className="w-12 h-12 rounded-xl bg-green/10 border border-green/20 flex items-center justify-center text-green mb-6">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <h3 className="text-h3 text-2xl text-text mb-3">
                  I have an idea
                </h3>
                <p className="text-body text-base text-text-muted leading-relaxed mb-6">
                  Not sure it will work? Not sure where to start? We help you test it, plan it and launch it.
                </p>
              </div>
              <div className="pt-4 border-t border-border">
                <Link
                  href="/get-started?path=idea"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-green text-[#04110A] font-semibold text-sm hover:shadow-[0_0_24px_rgba(25,242,140,0.35)] transition-all"
                >
                  <span>Share your idea</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Card 2: Business */}
            <div className="rounded-[24px] bg-surface border border-border p-8 sm:p-10 flex flex-col justify-between transition-all duration-200 hover:border-cyan/40 hover:-translate-y-1">
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan mb-6">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-h3 text-2xl text-text mb-3">
                  I have a business
                </h3>
                <p className="text-body text-base text-text-muted leading-relaxed mb-6">
                  Want more customers, better marketing and clear numbers? We help you grow it.
                </p>
              </div>
              <div className="pt-4 border-t border-border">
                <Link
                  href="/get-started?path=business"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-transparent border border-border-strong text-text font-semibold text-sm hover:bg-white/[0.06] hover:border-white/30 transition-all"
                >
                  <span>Bring your business</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* =========================================================================
          c) WHERE PEOPLE GET STUCK (Two Columns)
          ========================================================================= */}
      <Section id="where-people-get-stuck">
        <Container>
          <SectionHeader
            eyebrow="The Bottlenecks"
            title="Where growth usually stalls."
            description="Most entrepreneurs face the same roadblocks when turning an idea into revenue."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Column 1: Idea */}
            <div className="rounded-[20px] bg-surface/60 border border-border p-8 space-y-6">
              <div className="flex items-center gap-2 text-green font-mono text-xs uppercase tracking-wider">
                <Lightbulb className="w-4 h-4" />
                <span>If you have an idea</span>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                  <span className="text-text text-sm sm:text-base leading-relaxed">
                    You do not know if people will pay for it.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                  <span className="text-text text-sm sm:text-base leading-relaxed">
                    You have no plan, budget or timeline.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                  <span className="text-text text-sm sm:text-base leading-relaxed">
                    You do not know what to build first.
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 2: Business */}
            <div className="rounded-[20px] bg-surface/60 border border-border p-8 space-y-6">
              <div className="flex items-center gap-2 text-cyan font-mono text-xs uppercase tracking-wider">
                <Briefcase className="w-4 h-4" />
                <span>If you have a business</span>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                  <span className="text-text text-sm sm:text-base leading-relaxed">
                    Growth has slowed down.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                  <span className="text-text text-sm sm:text-base leading-relaxed">
                    Enquiries come in but too few turn into sales.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                  <span className="text-text text-sm sm:text-base leading-relaxed">
                    You spend on marketing and cannot tell what works.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* =========================================================================
          d) THE GROWTH BRIDGE JOURNEY (Diagram with 4 Connected Stages)
          ========================================================================= */}
      <Section id="journey" raised>
        <Container>
          <SectionHeader
            eyebrow="The Growth Bridge Journey"
            title="Four connected stages from start to scale."
            description="Instead of disconnected vendors, one system guides your path to consistent customers."
            centered
          />
          <GrowthSystemDiagram />
        </Container>
      </Section>

      {/* =========================================================================
          e) WHAT WE DO (4 Service Cards Linking to /services Anchors)
          ========================================================================= */}
      <Section id="what-we-do">
        <Container>
          <SectionHeader
            eyebrow="What We Do"
            title="Everything your business needs to grow."
            description="Outcome-led execution across strategy, web presence, customer acquisition, and retention."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Card 1: Plan */}
            <div className="rounded-[20px] bg-surface border border-border p-8 flex flex-col justify-between hover:border-green/40 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-green/10 border border-green/20 flex items-center justify-center text-green mb-5">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono text-green uppercase tracking-wider mb-1">
                  Stage 01
                </div>
                <h3 className="text-h3 text-2xl text-text mb-3">Plan</h3>
                <p className="text-body text-sm leading-relaxed mb-6">
                  Business consulting and strategy. Validate the idea, shape the offer, and get a clear plan.
                </p>
              </div>
              <div className="pt-4 border-t border-border">
                <Link
                  href="/services#plan"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-green hover:underline group"
                >
                  <span>Explore Plan Details</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Card 2: Build */}
            <div className="rounded-[20px] bg-surface border border-border p-8 flex flex-col justify-between hover:border-cyan/40 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan mb-5">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono text-cyan uppercase tracking-wider mb-1">
                  Stage 02
                </div>
                <h3 className="text-h3 text-2xl text-text mb-3">Build</h3>
                <p className="text-body text-sm leading-relaxed mb-6">
                  Website and brand presence. Look credible and be easy to contact, on every phone.
                </p>
              </div>
              <div className="pt-4 border-t border-border">
                <Link
                  href="/services#build"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan hover:underline group"
                >
                  <span>Explore Build Details</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Card 3: Market */}
            <div className="rounded-[20px] bg-surface border border-border p-8 flex flex-col justify-between hover:border-violet/40 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-violet/10 border border-violet/20 flex items-center justify-center text-violet mb-5">
                  <Megaphone className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono text-violet uppercase tracking-wider mb-1">
                  Stage 03
                </div>
                <h3 className="text-h3 text-2xl text-text mb-3">Market</h3>
                <p className="text-body text-sm leading-relaxed mb-6">
                  Marketing and lead generation. SEO, social media, ads and content that bring in enquiries.
                </p>
              </div>
              <div className="pt-4 border-t border-border">
                <Link
                  href="/services#market"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet hover:underline group"
                >
                  <span>Explore Market Details</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Card 4: Retain (grow) */}
            <div className="rounded-[20px] bg-surface border border-border p-8 flex flex-col justify-between hover:border-green/40 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-green/10 border border-green/20 flex items-center justify-center text-green mb-5">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono text-green uppercase tracking-wider mb-1">
                  Stage 04
                </div>
                <h3 className="text-h3 text-2xl text-text mb-3">Retain (Grow)</h3>
                <p className="text-body text-sm leading-relaxed mb-6">
                  CRM and growth systems. Track every enquiry and customer, follow up on time, and see what works.
                </p>
              </div>
              <div className="pt-4 border-t border-border">
                <Link
                  href="/services#grow"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-green hover:underline group"
                >
                  <span>Explore Retain Details</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* =========================================================================
          f) YOUR FREE FIRST CONVERSATION
          ========================================================================= */}
      <Section id="free-conversation" raised>
        <Container>
          <div className="max-w-3xl mx-auto rounded-[24px] border-gradient bg-surface p-8 sm:p-12 text-center space-y-6 shadow-2xl">
            <span className="text-eyebrow text-green">No Obligation</span>
            <h2 className="text-h2 text-2xl sm:text-3xl text-text">
              Your free first conversation.
            </h2>
            <p className="text-body text-text-muted text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Tell us about your idea or your business. In one short conversation we find your biggest growth gap and tell you what to do first. Free, and with no obligation.
            </p>

            <div className="pt-2 flex justify-center">
              <TwoPathButtons size="lg" location="free_conversation_section" />
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-text-dim flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green" />
                <span>{CONFIDENTIALITY_NOTE}</span>
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* =========================================================================
          g) HOW IT WORKS (4 Steps: Talk, Plan, Build, Grow)
          ========================================================================= */}
      <Section id="how-it-works">
        <Container>
          <SectionHeader
            eyebrow="How It Works"
            title="A clear path with no surprises."
            description="We keep our process simple, direct, and measured in plain language."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl bg-surface border border-border p-6 space-y-3">
              <span className="font-mono text-green text-sm font-bold">Step 01</span>
              <h3 className="font-display font-semibold text-lg text-text">Talk</h3>
              <p className="text-body text-xs leading-relaxed text-text-muted">
                A free 30-minute diagnostic conversation. We review your goals and pinpoint the primary roadblock.
              </p>
            </div>

            <div className="rounded-2xl bg-surface border border-border p-6 space-y-3">
              <span className="font-mono text-cyan text-sm font-bold">Step 02</span>
              <h3 className="font-display font-semibold text-lg text-text">Plan</h3>
              <p className="text-body text-xs leading-relaxed text-text-muted">
                You receive a written action plan with timelines, costs, and measurable outcomes before spending anything.
              </p>
            </div>

            <div className="rounded-2xl bg-surface border border-border p-6 space-y-3">
              <span className="font-mono text-violet text-sm font-bold">Step 03</span>
              <h3 className="font-display font-semibold text-lg text-text">Build</h3>
              <p className="text-body text-xs leading-relaxed text-text-muted">
                We design your online presence, set up your CRM pipeline, and craft your brand messaging.
              </p>
            </div>

            <div className="rounded-2xl bg-surface border border-border p-6 space-y-3">
              <span className="font-mono text-green text-sm font-bold">Step 04</span>
              <h3 className="font-display font-semibold text-lg text-text">Grow</h3>
              <p className="text-body text-xs leading-relaxed text-text-muted">
                We launch campaigns, review lead flow, and provide a monthly report in plain language.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* =========================================================================
          h) WHO WE WORK WITH (id who-we-work-with)
          ========================================================================= */}
      <Section id="who-we-work-with" raised>
        <Container>
          <SectionHeader
            eyebrow="Who We Work With"
            title="Built for businesses across sectors."
            description="Whether starting out or running a multi-location enterprise, our frameworks adapt to your industry."
            centered
          />

          <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto">
            {TARGET_CHIPS.map((chip) => (
              <div
                key={chip}
                className="px-5 py-3 rounded-full glass border border-border text-sm font-medium text-text hover:border-green/50 transition-colors"
              >
                {chip}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* =========================================================================
          i) WHY GROWTH BRIDGE (3 Points + Name Explanation)
          ========================================================================= */}
      <Section id="why-us">
        <Container>
          <SectionHeader
            eyebrow="Why Choose Us"
            title="Bridging your business to growth."
            description="The bridge is the gap between where you are and where you want to be; the accelerator is how fast we help you cross it."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-surface border border-border p-7 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-green/10 flex items-center justify-center text-green mb-2">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold text-base text-text">
                One team from idea to growth
              </h3>
              <p className="text-body text-xs leading-relaxed text-text-muted">
                Not four separate vendors. Strategy, website, CRM and marketing work in sync under one shared roadmap.
              </p>
            </div>

            <div className="rounded-2xl bg-surface border border-border p-7 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan mb-2">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold text-base text-text">
                Plain-language plans and reports
              </h3>
              <p className="text-body text-xs leading-relaxed text-text-muted">
                No buzzwords or vanity metrics. Every plan ends with clear actions you can start this week.
              </p>
            </div>

            <div className="rounded-2xl bg-surface border border-border p-7 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet/10 flex items-center justify-center text-violet mb-2">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold text-base text-text">
                A real Delhi team you can meet
              </h3>
              <p className="text-body text-xs leading-relaxed text-text-muted">
                A real Delhi address you can visit, and a responsive team you can call or WhatsApp anytime.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* =========================================================================
          j) CASE STUDIES PREVIEW (3 Latest - Renders ONLY if >= 1 row exists)
          ========================================================================= */}
      {caseStudies.length > 0 && (
        <Section id="case-studies" raised>
          <Container>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <SectionHeader
                eyebrow="Real Results"
                title="Recent case studies."
                description="See how our system accelerated revenue for businesses."
                className="mb-0"
              />
              <Link
                href="/case-studies"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-green hover:underline shrink-0"
              >
                <span>View all case studies</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {caseStudies.map((cs) => (
                <Link
                  key={cs.id}
                  href={`/case-studies/${cs.slug}`}
                  className="rounded-2xl bg-surface border border-border p-6 flex flex-col justify-between hover:border-green/40 transition-all"
                >
                  <div>
                    <span className="text-[10px] font-mono uppercase text-green">
                      {cs.industry || 'Case Study'}
                    </span>
                    <h3 className="font-display font-semibold text-lg text-text mt-1 mb-2">
                      {cs.title}
                    </h3>
                    {cs.summary && (
                      <p className="text-body text-xs text-text-muted line-clamp-3">
                        {cs.summary}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-text-dim">
                    <span>{cs.client_name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-green" />
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* =========================================================================
          k) FAQ (6, each 2 to 3 plain sentences)
          ========================================================================= */}
      <Section id="faq">
        <Container>
          <SectionHeader
            eyebrow="Frequently Asked Questions"
            title="Clear answers before you reach out."
            description="Everything you need to know about working with Growth Bridge Accelerator."
          />
          <div className="max-w-3xl">
            <FAQAccordion items={FAQS} />
          </div>
        </Container>
      </Section>

      {/* =========================================================================
          l) VISIT US (Address, Map Embed, Hours, Phone, WhatsApp)
          ========================================================================= */}
      <Section id="visit-us" raised>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-6">
              <Eyebrow>Our Office</Eyebrow>
              <h2 className="text-h2 text-2xl sm:text-3xl text-text">
                Visit us in Delhi.
              </h2>
              <p className="text-body text-sm text-text-muted leading-relaxed">
                We are a real team with a physical office in East Delhi. You are always welcome to stop by, review your numbers, and discuss your growth strategy in person.
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

            {/* Google Maps Embed Frame */}
            <div className="lg:col-span-7">
              <div className="rounded-[20px] overflow-hidden border border-border glass p-2 shadow-2xl h-[340px] sm:h-[400px]">
                <iframe
                  title="Growth Bridge Accelerator Office Location"
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

      {/* =========================================================================
          m) FINAL CTA ("Ready to grow? Let's talk.")
          ========================================================================= */}
      <section className="relative py-24 sm:py-32 overflow-hidden border-t border-border">
        <div className="absolute inset-0 bg-noise pointer-events-none" />
        <Container className="relative z-10 text-center max-w-3xl mx-auto space-y-6">
          <Eyebrow pill>Get Started Today</Eyebrow>
          <h2 className="text-display text-3xl sm:text-4xl lg:text-5xl text-text">
            Ready to grow? <span className="gradient-text">Let&apos;s talk.</span>
          </h2>
          <p className="text-body text-text-muted text-base sm:text-lg max-w-xl mx-auto">
            Choose your starting point or message us directly on WhatsApp. We reply within {FIRST_REPLY_TIME}.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <TwoPathButtons size="lg" location="final_cta" />
            <a
              href="/whatsapp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-14 px-7 rounded-full glass border border-border-strong text-text hover:text-green hover:border-green/40 font-semibold text-sm transition-all"
            >
              <MessageCircle className="w-4 h-4 text-green" />
              <span>Message on WhatsApp</span>
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}

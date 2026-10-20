'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Button } from '@/components/ui/button';

interface Step {
  num: string;
  title: string;
  headline: string;
  desc: string;
  deliverables: string[];
}

const STEPS: Step[] = [
  {
    num: '01',
    title: 'Diagnose',
    headline: 'Audit operations, identify leaks, and set a single roadmap.',
    desc: 'We examine your customer acquisition, sales follow-ups, and vendor fragmentation. You receive an honest diagnostic showing where inquiries drop and which channel will generate the fastest return.',
    deliverables: ['Revenue leakage audit', 'Unit economics & margin review', 'Connected 90-day growth plan'],
  },
  {
    num: '02',
    title: 'Build',
    headline: 'High-conversion website and WhatsApp-first infrastructure.',
    desc: 'We engineer a lightning-fast, mobile-optimized business website designed specifically to capture high-intent Indian buyers. Every form connects directly to WhatsApp and automated email capture.',
    deliverables: ['Custom high-speed website', 'Mobile-first conversion layout', 'Direct WhatsApp integration'],
  },
  {
    num: '03',
    title: 'Connect',
    headline: 'Custom CRM setup and automated lead pipeline management.',
    desc: 'We deploy a business CRM tailored to your team so no inquiry is ever forgotten. From lead capture to quote generation and follow-up reminders, your sales workflow runs on autopilot.',
    deliverables: ['Lead pipeline setup', 'Instant WhatsApp auto-replies', 'Sales team hands-on training'],
  },
  {
    num: '04',
    title: 'Grow',
    headline: 'Full-stack targeted marketing and continuous iteration.',
    desc: 'With your conversion foundation and CRM live, we turn on high-intent local SEO, Google Search ads, and social media campaigns. You review real sales metrics each month, not vanity impressions.',
    deliverables: ['Local SEO & Google Business optimization', 'High-intent search & social campaigns', 'Transparent monthly ROI reporting'],
  },
];

export function ProcessTimeline() {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const viewportCenter = window.innerHeight / 2;

      stepRefs.current.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
          setActiveStep(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
      {/* Sticky Left Column */}
      <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-6">
        <Eyebrow pill>How We Work</Eyebrow>
        <h2 className="text-h2">
          From fragmented vendors to <span className="gradient-text">one connected system.</span>
        </h2>
        <p className="text-body text-text-muted">
          We do not deliver disconnected tasks. We execute a disciplined 4-stage process where each milestone reinforces the next.
        </p>

        <div className="pt-4 hidden sm:block">
          <Button href="/book-consultation" showArrow>
            Schedule Discovery Call
          </Button>
        </div>
      </div>

      {/* Right Column: Steps Timeline */}
      <div className="lg:col-span-7 space-y-8 relative">
        {/* Subtle vertical indicator bar */}
        <div className="absolute left-6 top-8 bottom-8 w-px bg-border hidden sm:block" />

        {STEPS.map((step, idx) => {
          const isActive = activeStep === idx;

          return (
            <div
              key={step.num}
              ref={(el) => {
                stepRefs.current[idx] = el;
              }}
              className={cn(
                'relative rounded-2xl p-6 sm:p-8 transition-all duration-300 border',
                isActive
                  ? 'bg-surface border-green/40 shadow-[0_0_32px_rgba(25,242,140,0.12)] -translate-y-1'
                  : 'bg-surface/50 border-border opacity-70 hover:opacity-100 hover:border-border-strong'
              )}
            >
              <div className="flex items-start gap-4 sm:gap-6">
                {/* Step Number Circle */}
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-base shrink-0 transition-colors',
                    isActive
                      ? 'bg-green text-[#04110A] shadow-[0_0_20px_rgba(25,242,140,0.35)]'
                      : 'bg-surface-hover text-text-dim border border-border'
                  )}
                >
                  {step.num}
                </div>

                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-eyebrow text-green">{step.title}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-green animate-ping" />
                    )}
                  </div>
                  <h3 className="text-h3 text-xl text-text font-semibold">
                    {step.headline}
                  </h3>
                  <p className="text-body text-sm text-text-muted leading-relaxed">
                    {step.desc}
                  </p>

                  <div className="pt-2">
                    <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-2">
                      Key Deliverables:
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-text">
                      {step.deliverables.map((deliv, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-green shrink-0" />
                          <span>{deliv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

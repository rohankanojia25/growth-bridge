import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Eyebrow } from '@/components/ui/eyebrow';
import { GetStartedForm } from '@/components/forms/get-started-form';
import { FIRST_REPLY_TIME } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Get Started | Share Your Idea or Bring Your Business',
  description:
    'Start with a free first conversation. Whether you have an idea to launch or a business to grow, tell us your goals and we will tell you what to do first.',
  openGraph: {
    title: 'Get Started with Growth Bridge Accelerator',
    description:
      'Start with a free first conversation. We plan it, build it, market it, and set up the systems that keep customers coming back.',
  },
};

export default function GetStartedPage() {
  return (
    <Section className="pt-12 pb-24">
      <Container>
        <div className="max-w-2xl mx-auto text-center mb-10">
          <Eyebrow pill className="mb-4">
            Free First Conversation · Reply in {FIRST_REPLY_TIME}
          </Eyebrow>
          <h1 className="text-display text-3xl sm:text-4xl lg:text-5xl mb-4">
            Let&apos;s start with a conversation.
          </h1>
          <p className="text-body text-text-muted text-base sm:text-lg">
            Tell us about your idea or your business. In one short conversation we find your biggest growth gap and tell you what to do first. Free, and with no obligation.
          </p>
        </div>

        <div className="rounded-[24px] bg-surface/80 border border-border p-6 sm:p-10 shadow-2xl backdrop-blur-xl max-w-3xl mx-auto">
          <Suspense fallback={<div className="py-12 text-center text-text-dim">Loading form...</div>}>
            <GetStartedForm />
          </Suspense>
        </div>
      </Container>
    </Section>
  );
}

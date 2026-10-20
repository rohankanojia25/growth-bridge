'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  getStartedSchema,
  type GetStartedInput,
  IDEA_STAGE_OPTIONS,
  STARTING_BUDGET_OPTIONS,
  BUSINESS_CHALLENGE_OPTIONS,
  MONTHLY_BUDGET_OPTIONS,
  cleanPhone,
} from '@/lib/schemas';
import { CONFIDENTIALITY_NOTE } from '@/lib/config';
import { BUSINESS_INFO } from '@/lib/utils';
import { getStoredUTM } from '@/components/layout/utm-tracker';
import { trackAnalyticsEvent } from '@/components/layout/analytics';
import {
  Lightbulb,
  Briefcase,
  Phone,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export function GetStartedForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial path from query param (defaults to 'idea' if not 'business')
  const paramPath = searchParams.get('path');
  const initialPath = paramPath === 'business' ? 'business' : 'idea';
  const initialPackage = searchParams.get('package') || '';

  const [activePath, setActivePath] = useState<'idea' | 'business'>(initialPath);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<GetStartedInput>({
    resolver: zodResolver(getStartedSchema),
    defaultValues: {
      lead_type: initialPath,
      name: '',
      phone: '',
      email: '',
      idea_summary: '',
      idea_stage: 'just_idea',
      starting_budget: 'not_decided',
      wants_nda: false,
      business_name: '',
      message: '',
      city: 'Delhi',
      link_url: '',
      challenge: 'not_enough_customers',
      budget_range: 'not_decided',
      website: '',
      source: 'get_started',
      package_id: initialPackage,
    },
  });

  // Keep activePath synced with form value
  const handleSelectPath = (path: 'idea' | 'business') => {
    setActivePath(path);
    setValue('lead_type', path);
    trackAnalyticsEvent('path_click', { path, location: 'get_started_selector' });
  };

  useEffect(() => {
    if (paramPath === 'business' || paramPath === 'idea') {
      setActivePath(paramPath);
      setValue('lead_type', paramPath);
    }
  }, [paramPath, setValue]);

  const onSubmit = async (data: GetStartedInput) => {
    setServerError(null);

    try {
      const utm = getStoredUTM();
      const payload = {
        ...data,
        phone: cleanPhone(data.phone),
        ...utm,
        source: 'get_started',
      };

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to submit enquiry. Please try again or WhatsApp us.');
      }

      // Track conversion
      trackAnalyticsEvent('get_started_submit', { lead_type: data.lead_type });

      // Set cookie for submission state and redirect to thank-you
      document.cookie = 'gba_lead_submitted=true; path=/; max-age=86400; SameSite=Lax';
      router.push('/thank-you');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred';
      setServerError(msg);
    }
  };

  const whatsappTopic = activePath === 'idea' ? 'idea' : 'business';
  const whatsappUrl = `/whatsapp?topic=${whatsappTopic}`;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* 1. Path Selector Cards */}
      <div className="space-y-3">
        <label className="block text-xs font-mono uppercase tracking-wider text-green">
          Step 1: Choose your starting point
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Idea */}
          <button
            type="button"
            onClick={() => handleSelectPath('idea')}
            className={`relative p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
              activePath === 'idea'
                ? 'bg-surface border-green ring-2 ring-green/20 shadow-lg shadow-green/5'
                : 'bg-surface/50 border-border hover:border-border-strong hover:bg-surface'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  activePath === 'idea' ? 'bg-green text-[#04110A]' : 'bg-surface-hover text-text-muted'
                }`}
              >
                <Lightbulb className="w-5 h-5" />
              </div>
              {activePath === 'idea' && (
                <CheckCircle2 className="w-5 h-5 text-green" />
              )}
            </div>
            <div className="font-display font-semibold text-base text-text">
              I have an idea
            </div>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              Test it, shape the plan, and launch with a clear budget.
            </p>
          </button>

          {/* Card 2: Business */}
          <button
            type="button"
            onClick={() => handleSelectPath('business')}
            className={`relative p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
              activePath === 'business'
                ? 'bg-surface border-green ring-2 ring-green/20 shadow-lg shadow-green/5'
                : 'bg-surface/50 border-border hover:border-border-strong hover:bg-surface'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  activePath === 'business' ? 'bg-green text-[#04110A]' : 'bg-surface-hover text-text-muted'
                }`}
              >
                <Briefcase className="w-5 h-5" />
              </div>
              {activePath === 'business' && (
                <CheckCircle2 className="w-5 h-5 text-green" />
              )}
            </div>
            <div className="font-display font-semibold text-base text-text">
              I have a business
            </div>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              Fix stalled growth, get more customers, and track sales clearly.
            </p>
          </button>
        </div>

        {/* Quick alternative channels under the cards */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-text-dim">
          <span>Prefer to talk directly right now?</span>
          <div className="flex items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackAnalyticsEvent('whatsapp_click', { topic: whatsappTopic })}
              className="inline-flex items-center gap-1.5 text-green hover:underline font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp message</span>
            </a>
            <span>·</span>
            <a
              href={`tel:${BUSINESS_INFO.phone}`}
              onClick={() => trackAnalyticsEvent('call_click', { location: 'get_started_top' })}
              className="inline-flex items-center gap-1.5 text-text hover:text-green font-medium"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{BUSINESS_INFO.phoneFormatted}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <input type="hidden" {...register('lead_type')} value={activePath} />
        {/* Honeypot */}
        <input
          type="text"
          {...register('website')}
          tabIndex={-1}
          autoComplete="off"
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0, width: 0 }}
        />

        {serverError && (
          <div className="p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* SHARED FIELDS */}
        <div className="space-y-4 pt-2 border-t border-border">
          <label className="block text-xs font-mono uppercase tracking-wider text-green">
            Step 2: Your contact details
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text mb-1.5">
                Full Name <span className="text-green">*</span>
              </label>
              <input
                type="text"
                placeholder="Rohan Sharma"
                {...register('name')}
                className="w-full h-12 rounded-xl bg-bg border border-border px-4 text-text text-sm focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
              />
              {errors.name && (
                <p className="text-xs text-danger mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-text mb-1.5">
                Phone Number <span className="text-green">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim text-sm font-mono">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="98100 12345"
                  {...register('phone')}
                  className="w-full h-12 rounded-xl bg-bg border border-border pl-12 pr-4 text-text text-sm font-mono focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-danger mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text mb-1.5">
              Email Address <span className="text-text-dim">(Optional, for written proposal)</span>
            </label>
            <input
              type="email"
              placeholder="rohan@example.com"
              {...register('email')}
              className="w-full h-12 rounded-xl bg-bg border border-border px-4 text-text text-sm focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
            />
            {errors.email && (
              <p className="text-xs text-danger mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* PATH: IDEA FIELDS */}
        {activePath === 'idea' && (
          <div className="space-y-4 pt-4 border-t border-border animate-in fade-in duration-200">
            <label className="block text-xs font-mono uppercase tracking-wider text-green">
              Step 3: Tell us about your idea
            </label>

            <div>
              <label className="block text-xs font-medium text-text mb-1.5">
                Describe your idea in 2 or 3 lines <span className="text-green">*</span>
              </label>
              <textarea
                rows={3}
                maxLength={600}
                placeholder="What product or service are you planning? Who is it for?"
                {...register('idea_summary')}
                className="w-full rounded-xl bg-bg border border-border p-3.5 text-text text-sm focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors resize-none"
              />
              {errors.idea_summary && (
                <p className="text-xs text-danger mt-1">{errors.idea_summary.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text mb-1.5">
                  Current Stage
                </label>
                <select
                  {...register('idea_stage')}
                  className="w-full h-12 rounded-xl bg-bg border border-border px-3.5 text-text text-sm focus:outline-none focus:border-green transition-colors"
                >
                  {IDEA_STAGE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-text mb-1.5">
                  Starting Budget
                </label>
                <select
                  {...register('starting_budget')}
                  className="w-full h-12 rounded-xl bg-bg border border-border px-3.5 text-text text-sm focus:outline-none focus:border-green transition-colors"
                >
                  {STARTING_BUDGET_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-hover/50 border border-border cursor-pointer select-none">
              <input
                type="checkbox"
                {...register('wants_nda')}
                className="w-4 h-4 rounded text-green focus:ring-green bg-bg border-border"
              />
              <span className="text-xs text-text flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-green" />
                <span>I would like an NDA (Non-Disclosure Agreement) before sharing sensitive details.</span>
              </span>
            </label>
          </div>
        )}

        {/* PATH: BUSINESS FIELDS */}
        {activePath === 'business' && (
          <div className="space-y-4 pt-4 border-t border-border animate-in fade-in duration-200">
            <label className="block text-xs font-mono uppercase tracking-wider text-green">
              Step 3: Tell us about your business
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text mb-1.5">
                  Business Name <span className="text-green">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Metro Fabrics, Apex Clinic"
                  {...register('business_name')}
                  className="w-full h-12 rounded-xl bg-bg border border-border px-4 text-text text-sm focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
                />
                {errors.business_name && (
                  <p className="text-xs text-danger mt-1">{errors.business_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-text mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  placeholder="Delhi"
                  {...register('city')}
                  className="w-full h-12 rounded-xl bg-bg border border-border px-4 text-text text-sm focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text mb-1.5">
                What do you sell or offer? <span className="text-green">*</span>
              </label>
              <textarea
                rows={2}
                maxLength={600}
                placeholder="Products, services, or solutions you provide to customers"
                {...register('message')}
                className="w-full rounded-xl bg-bg border border-border p-3.5 text-text text-sm focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors resize-none"
              />
              {errors.message && (
                <p className="text-xs text-danger mt-1">{errors.message.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-text mb-1.5">
                Website, Instagram or Google Maps link <span className="text-text-dim">(Optional)</span>
              </label>
              <input
                type="url"
                placeholder="https://..."
                {...register('link_url')}
                className="w-full h-12 rounded-xl bg-bg border border-border px-4 text-text text-sm focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
              />
              {errors.link_url && (
                <p className="text-xs text-danger mt-1">{errors.link_url.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text mb-1.5">
                  Biggest Growth Challenge
                </label>
                <select
                  {...register('challenge')}
                  className="w-full h-12 rounded-xl bg-bg border border-border px-3.5 text-text text-sm focus:outline-none focus:border-green transition-colors"
                >
                  {BUSINESS_CHALLENGE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-text mb-1.5">
                  Monthly Marketing Budget
                </label>
                <select
                  {...register('budget_range')}
                  className="w-full h-12 rounded-xl bg-bg border border-border px-3.5 text-text text-sm focus:outline-none focus:border-green transition-colors"
                >
                  {MONTHLY_BUDGET_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 rounded-full bg-green text-[#04110A] font-semibold text-base flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-[0_0_32px_rgba(25,242,140,0.4)] disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Sending your details...</span>
            ) : (
              <>
                <span>
                  {activePath === 'idea' ? 'Submit and discuss my idea' : 'Submit and discuss my business'}
                </span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* CONFIDENTIALITY NOTE */}
        <div className="p-4 rounded-xl bg-surface/60 border border-border text-center">
          <p className="text-xs text-text-muted leading-relaxed">
            <span className="text-green font-medium">Confidentiality Guarantee:</span>{' '}
            {CONFIDENTIALITY_NOTE}
          </p>
        </div>
      </form>
    </div>
  );
}

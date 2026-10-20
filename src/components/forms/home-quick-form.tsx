'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quickLeadSchema, type QuickLeadInput, SERVICE_OPTIONS } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { getStoredUTM } from '@/components/layout/utm-tracker';
import { trackAnalyticsEvent } from '@/components/layout/analytics';

export function HomeQuickForm() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuickLeadInput>({
    resolver: zodResolver(quickLeadSchema),
    defaultValues: {
      name: '',
      phone: '',
      service: 'unsure',
      website: '',
      source: 'home_quick_form',
    },
  });

  const onSubmit = async (data: QuickLeadInput) => {
    setErrorMsg(null);

    try {
      const utm = getStoredUTM();
      const payload = {
        ...data,
        ...utm,
        source: 'home_quick_form',
      };

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to submit. Please call us directly.');
      }

      trackAnalyticsEvent('lead_submit', {
        service: data.service,
        source: 'home_quick_form',
      });

      router.push('/thank-you');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Error submitting form.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4" noValidate>
      {errorMsg && (
        <div className="rounded-xl border border-danger/40 bg-danger/10 p-3 text-xs text-danger" role="alert">
          {errorMsg}
        </div>
      )}

      {/* Honeypot */}
      <input type="text" className="sr-only" tabIndex={-1} aria-hidden="true" autoComplete="off" {...register('website')} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <input
            type="text"
            placeholder="Your Name *"
            className="h-12 w-full rounded-xl bg-bg border border-border px-4 text-text placeholder:text-text-dim text-base focus:border-green focus:outline-none focus:ring-[3px] focus:ring-green/25"
            {...register('name')}
          />
          {errors.name && (
            <span className="text-xs text-danger mt-1 block">{errors.name.message}</span>
          )}
        </div>

        <div>
          <input
            type="tel"
            placeholder="Phone Number *"
            className="h-12 w-full rounded-xl bg-bg border border-border px-4 text-text placeholder:text-text-dim text-base focus:border-green focus:outline-none focus:ring-[3px] focus:ring-green/25"
            {...register('phone')}
          />
          {errors.phone && (
            <span className="text-xs text-danger mt-1 block">{errors.phone.message}</span>
          )}
        </div>

        <div>
          <select
            className="h-12 w-full rounded-xl bg-bg border border-border px-3 text-text text-base focus:border-green focus:outline-none focus:ring-[3px] focus:ring-green/25"
            {...register('service')}
          >
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button type="submit" className="w-full sm:w-auto" loading={isSubmitting} showArrow>
        Request Free Growth Assessment
      </Button>
    </form>
  );
}

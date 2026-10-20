'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quickLeadSchema, type QuickLeadInput, SERVICE_OPTIONS } from '@/lib/schemas';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <Input
          id="home-quick-name"
          label="Full Name *"
          placeholder="e.g. Rajesh Kumar"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          id="home-quick-phone"
          type="tel"
          label="Mobile Number *"
          placeholder="10-digit number"
          error={errors.phone?.message}
          {...register('phone')}
        />

        <Select
          id="home-quick-service"
          label="Service Interested In *"
          options={SERVICE_OPTIONS}
          error={errors.service?.message}
          {...register('service')}
        />
      </div>

      <div className="pt-1">
        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto min-h-[52px] h-[52px] px-8 text-base font-semibold"
          loading={isSubmitting}
          showArrow
        >
          {isSubmitting ? 'Submitting...' : 'Request Free Growth Assessment'}
        </Button>
      </div>
    </form>
  );
}

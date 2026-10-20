'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactLeadSchema, type ContactLeadInput, SERVICE_OPTIONS, BUDGET_OPTIONS } from '@/lib/schemas';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { getStoredUTM } from '@/components/layout/utm-tracker';
import { trackAnalyticsEvent } from '@/components/layout/analytics';
import { Tag } from 'lucide-react';

interface LeadFormProps {
  defaultService?: string;
  className?: string;
}

export function LeadForm({ defaultService, className }: LeadFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const initialService = (searchParams.get('service') || defaultService || 'unsure') as
    | 'consulting'
    | 'website'
    | 'crm'
    | 'marketing'
    | 'unsure';

  const packageParam = searchParams.get('package');

  useEffect(() => {
    if (packageParam) {
      setSelectedPackage(packageParam);
    }
  }, [packageParam]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactLeadInput>({
    resolver: zodResolver(contactLeadSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      business_name: '',
      service: ['consulting', 'website', 'crm', 'marketing', 'unsure'].includes(initialService)
        ? initialService
        : 'unsure',
      budget_range: undefined,
      message: '',
      website: '', // honeypot
      source: 'contact_form',
    },
  });

  const onSubmit = async (data: ContactLeadInput) => {
    setServerError(null);

    try {
      const utm = getStoredUTM();
      const payload = {
        ...data,
        ...utm,
        package_id: selectedPackage || undefined,
        source: 'contact_form',
      };

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to submit enquiry. Please try again.');
      }

      trackAnalyticsEvent('lead_submit', {
        service: data.service,
        source: 'contact_form',
      });

      router.push('/thank-you');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please call us directly.';
      setServerError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className} noValidate>
      {selectedPackage && (
        <div className="mb-6 flex items-center gap-2 px-3.5 py-2 rounded-xl glass border border-green/30 bg-green/5 text-xs font-mono text-green">
          <Tag className="w-3.5 h-3.5" />
          <span>Selected Package: <strong className="uppercase">{selectedPackage}</strong></span>
        </div>
      )}

      {serverError && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-6 rounded-xl border border-danger/40 bg-danger/10 p-4 text-sm text-danger font-body"
        >
          {serverError}
        </div>
      )}

      {/* Honeypot field (hidden from real users) */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website-hp">Website</label>
        <input
          id="website-hp"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('website')}
        />
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            id="lead-name"
            label="Full Name *"
            placeholder="e.g. Rajesh Kumar"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            id="lead-phone"
            type="tel"
            label="Mobile Number *"
            placeholder="10-digit number (e.g. 9811000000)"
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            id="lead-email"
            type="email"
            label="Email Address *"
            placeholder="rajesh@yourbusiness.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            id="lead-business"
            label="Business Name"
            placeholder="e.g. Apex Health Clinic"
            error={errors.business_name?.message}
            {...register('business_name')}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Select
            id="lead-service"
            label="Service Interested In *"
            options={SERVICE_OPTIONS}
            error={errors.service?.message}
            {...register('service')}
          />

          <Select
            id="lead-budget"
            label="Monthly Marketing Budget"
            options={BUDGET_OPTIONS}
            placeholder="Select budget"
            error={errors.budget_range?.message}
            {...register('budget_range')}
          />
        </div>

        <Textarea
          id="lead-message"
          label="Tell us about your business goals or challenge"
          placeholder="Briefly describe what you want to achieve or where you are stuck..."
          error={errors.message?.message}
          {...register('message')}
        />

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full sm:w-auto min-w-[200px]"
            loading={isSubmitting}
            showArrow
          >
            {isSubmitting ? 'Submitting...' : 'Send Enquiry'}
          </Button>
          <p className="text-xs text-text-dim mt-3">
            We respond within 1 business day. Your information is kept completely confidential.
          </p>
        </div>
      </div>
    </form>
  );
}

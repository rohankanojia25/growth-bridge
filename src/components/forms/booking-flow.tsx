'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  SERVICE_OPTIONS,
  BUDGET_OPTIONS,
  MEETING_MODE_OPTIONS,
} from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getStoredUTM } from '@/components/layout/utm-tracker';
import { trackAnalyticsEvent } from '@/components/layout/analytics';
import { getLenis } from '@/components/layout/smooth-scroll';
import { cn, formatDate } from '@/lib/utils';
import { Calendar, Clock, User, CheckCircle2, ChevronLeft, Tag } from 'lucide-react';
import { z } from 'zod';

const bookingFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  phone: z.string().min(10, 'Enter a valid 10-digit mobile number'),
  email: z.string().email('Enter a valid email address'),
  business_name: z.string().optional().or(z.literal('')),
  service: z.enum(['consulting', 'website', 'crm', 'marketing', 'unsure']),
  budget_range: z
    .enum(['below_10k', '10k_50k', '50k_2l', 'above_2l', 'not_decided'])
    .optional(),
  meeting_mode: z.enum(['phone', 'google_meet', 'office_visit']),
  message: z.string().optional().or(z.literal('')),
  website: z.string().optional().or(z.literal('')),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

interface Slot {
  time: string;
  isoStart: string;
  isoEnd: string;
  available: boolean;
}

export function BookingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const prevStepRef = useRef(step);

  useEffect(() => {
    if (prevStepRef.current !== step) {
      prevStepRef.current = step;
      if (cardRef.current) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const rect = cardRef.current.getBoundingClientRect();
        const targetY = Math.max(0, rect.top + window.scrollY - 96);
        const lenis = getLenis();
        if (lenis && !prefersReducedMotion) {
          lenis.scrollTo(targetY, { duration: 0.6 });
        } else {
          window.scrollTo({
            top: targetY,
            behavior: prefersReducedMotion ? 'instant' : 'smooth',
          });
        }
      }
    }
  }, [step]);

  const initialService = (searchParams.get('service') || 'unsure') as
    | 'consulting'
    | 'website'
    | 'crm'
    | 'marketing'
    | 'unsure';

  const packageParam = searchParams.get('package');

  // Next 14 business days (Mon-Sat)
  const availableDates = useMemo(() => {
    const dates: { dateStr: string; display: string; dayName: string }[] = [];
    const today = new Date();
    let count = 0;
    let dayOffset = 1;

    while (count < 14) {
      const d = new Date(today);
      d.setDate(today.getDate() + dayOffset);
      const dayOfWeek = d.getDay();

      if (dayOfWeek !== 0) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`;

        const dayName = new Intl.DateTimeFormat('en-IN', { weekday: 'short' }).format(d);
        const display = new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric' }).format(d);

        dates.push({ dateStr, display, dayName });
        count++;
      }
      dayOffset++;
    }

    return dates;
  }, []);

  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0].dateStr);
    }
  }, [availableDates, selectedDate]);

  useEffect(() => {
    if (!selectedDate) return;

    let isMounted = true;
    async function fetchSlots() {
      setLoadingSlots(true);
      setSlotError(null);
      setSelectedSlot(null);

      try {
        const res = await fetch(`/api/availability?date=${selectedDate}`);
        if (!res.ok) throw new Error('Failed to load slots');
        const data = await res.json();
        if (isMounted) {
          setSlots(data.slots || []);
        }
      } catch {
        if (isMounted) {
          setSlotError('Could not load time slots.');
        }
      } finally {
        if (isMounted) setLoadingSlots(false);
      }
    }

    fetchSlots();
    return () => {
      isMounted = false;
    };
  }, [selectedDate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      business_name: '',
      service: ['consulting', 'website', 'crm', 'marketing', 'unsure'].includes(initialService)
        ? initialService
        : 'unsure',
      budget_range: undefined,
      meeting_mode: 'phone',
      message: '',
      website: '',
    },
  });

  const formValues = watch();

  const handleFinalSubmit = async (data: BookingFormData) => {
    if (!selectedSlot || !selectedDate) {
      setSlotError('Please select a valid date and time slot.');
      setStep(2);
      return;
    }

    setSlotError(null);

    try {
      const utm = getStoredUTM();
      const payload = {
        date: selectedDate,
        slot_start: selectedSlot.isoStart,
        slot_end: selectedSlot.isoEnd,
        meeting_mode: data.meeting_mode,
        lead: {
          name: data.name,
          phone: data.phone,
          email: data.email,
          business_name: data.business_name || '',
          service: data.service,
          budget_range: data.budget_range,
          message: data.message || '',
          website: data.website || '',
          source: 'consultation_booking',
          package_id: packageParam || undefined,
          ...utm,
        },
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (res.status === 409) {
        setSlotError('That slot was just taken. Please choose another.');
        setStep(2);
        const reload = await fetch(`/api/availability?date=${selectedDate}`);
        const fresh = await reload.json();
        setSlots(fresh.slots || []);
        return;
      }

      if (!res.ok) {
        throw new Error(json.error || 'Failed to complete booking.');
      }

      trackAnalyticsEvent('booking_submit', {
        date: selectedDate,
        service: data.service,
      });

      router.push(`/book-consultation/confirmed?t=${json.public_token}`);
    } catch (err: unknown) {
      setSlotError(err instanceof Error ? err.message : 'An error occurred during booking.');
    }
  };

  return (
    <div
      ref={cardRef}
      id="booking-card"
      className="w-full max-w-2xl mx-auto glass border border-border rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl scroll-mt-24"
    >
      {packageParam && (
        <div className="mb-6 flex items-center gap-2 px-3.5 py-2 rounded-xl glass border border-green/30 bg-green/5 text-xs font-mono text-green">
          <Tag className="w-3.5 h-3.5" />
          <span>Consultation for: <strong className="uppercase">{packageParam}</strong></span>
        </div>
      )}

      {/* Progress Steps Header */}
      <div className="mb-8" aria-label="Booking steps">
        {/* Full labels from 640px */}
        <div className="hidden sm:flex items-center justify-between text-xs font-mono mb-3">
          <span className={cn(step >= 1 ? 'text-green font-semibold' : 'text-text-dim')}>01. Date</span>
          <span className="h-px w-6 lg:w-8 bg-border" />
          <span className={cn(step >= 2 ? 'text-green font-semibold' : 'text-text-dim')}>02. Time</span>
          <span className="h-px w-6 lg:w-8 bg-border" />
          <span className={cn(step >= 3 ? 'text-green font-semibold' : 'text-text-dim')}>03. Details</span>
          <span className="h-px w-6 lg:w-8 bg-border" />
          <span className={cn(step >= 4 ? 'text-green font-semibold' : 'text-text-dim')}>04. Confirm</span>
        </div>

        {/* Step numbers and active step name below 640px */}
        <div className="sm:hidden flex items-center justify-between text-xs font-mono mb-3">
          <div className="flex items-center gap-1.5 text-text-dim">
            <span className={cn('px-2 py-0.5 rounded-full text-[11px]', step === 1 ? 'bg-green/15 text-green font-bold border border-green/30' : step > 1 ? 'text-green' : '')}>01</span>
            <span>·</span>
            <span className={cn('px-2 py-0.5 rounded-full text-[11px]', step === 2 ? 'bg-green/15 text-green font-bold border border-green/30' : step > 2 ? 'text-green' : '')}>02</span>
            <span>·</span>
            <span className={cn('px-2 py-0.5 rounded-full text-[11px]', step === 3 ? 'bg-green/15 text-green font-bold border border-green/30' : step > 3 ? 'text-green' : '')}>03</span>
            <span>·</span>
            <span className={cn('px-2 py-0.5 rounded-full text-[11px]', step === 4 ? 'bg-green/15 text-green font-bold border border-green/30' : '')}>04</span>
          </div>
          <span className="text-green font-semibold text-[11px]">
            {step === 1 && 'Date'}
            {step === 2 && 'Time Slot'}
            {step === 3 && 'Details'}
            {step === 4 && 'Confirm'}
          </span>
        </div>

        <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-green transition-all duration-300 rounded-full"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {slotError && (
        <div className="mb-6 rounded-xl border border-danger/40 bg-danger/10 p-4 text-sm text-danger" role="alert">
          {slotError}
        </div>
      )}

      {/* Step 1: Pick Date */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-h3 text-xl mb-1 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green" />
              <span>Select a Consultation Date</span>
            </h3>
            <p className="text-sm text-text-muted">
              Choose from available business days over the next 2 weeks (Mon – Sat, 10:00 to 19:00 IST).
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {availableDates.map((item) => {
              const isSelected = selectedDate === item.dateStr;
              return (
                <button
                  key={item.dateStr}
                  type="button"
                  onClick={() => setSelectedDate(item.dateStr)}
                  className={cn(
                    'p-4 rounded-2xl border text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green',
                    isSelected
                      ? 'border-green bg-green/10 text-text shadow-[0_0_20px_rgba(25,242,140,0.15)]'
                      : 'border-border bg-surface hover:border-border-strong text-text-muted hover:text-text'
                  )}
                >
                  <div className="text-xs font-mono uppercase tracking-wider text-text-dim">
                    {item.dayName}
                  </div>
                  <div className="text-base font-display font-semibold mt-1 text-text">
                    {item.display}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <Button
              type="button"
              onClick={() => setStep(2)}
              disabled={!selectedDate}
              showArrow
            >
              Continue to Time Slots
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Pick Time Slot */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-h3 text-xl mb-1 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green" />
                <span>Select a 30-Minute Slot</span>
              </h3>
              <p className="text-sm text-text-muted">
                Available slots for {formatDate(selectedDate)} (Indian Standard Time).
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-text-muted hover:text-text flex items-center gap-1 font-mono"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Change Date
            </button>
          </div>

          {loadingSlots ? (
            <div className="py-12 text-center">
              <div className="inline-block w-8 h-8 border-2 border-green border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm text-text-muted">Checking real-time calendar availability...</p>
            </div>
          ) : slots.length === 0 ? (
            <div className="py-8 text-center text-text-muted">
              No available slots for this date. Please pick a different date.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[360px] overflow-y-auto pr-1">
              {slots.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={!s.available}
                  onClick={() => setSelectedSlot(s)}
                  className={cn(
                    'py-3.5 px-4 rounded-xl border text-sm font-mono font-medium transition-all text-center',
                    !s.available && 'opacity-35 line-through cursor-not-allowed border-border/50 bg-bg',
                    s.available && selectedSlot?.isoStart === s.isoStart &&
                      'border-green bg-green/10 text-green shadow-[0_0_16px_rgba(25,242,140,0.2)]',
                    s.available && selectedSlot?.isoStart !== s.isoStart &&
                      'border-border bg-surface hover:border-border-strong text-text'
                  )}
                >
                  {s.time}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setStep(1)}
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={() => setStep(3)}
              disabled={!selectedSlot}
              showArrow
            >
              Enter Your Details
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Enter Details */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-h3 text-xl mb-1 flex items-center gap-2">
                <User className="w-5 h-5 text-green" />
                <span>Your Contact & Business Details</span>
              </h3>
              <p className="text-sm text-text-muted">
                Meeting on {formatDate(selectedDate)} at {selectedSlot?.time} IST.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-xs text-text-muted hover:text-text flex items-center gap-1 font-mono"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Change Slot
            </button>
          </div>

          <div className="space-y-4">
            <input type="text" className="sr-only" tabIndex={-1} autoComplete="off" {...register('website')} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="booking-name"
                label="Full Name *"
                placeholder="Rajesh Kumar"
                error={errors.name?.message}
                {...register('name')}
              />

              <Input
                id="booking-phone"
                type="tel"
                label="Mobile Number *"
                placeholder="10-digit number"
                error={errors.phone?.message}
                {...register('phone')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="booking-email"
                type="email"
                label="Email Address *"
                placeholder="rajesh@business.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                id="booking-business"
                label="Business Name"
                placeholder="Apex Health Clinic"
                error={errors.business_name?.message}
                {...register('business_name')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                id="booking-service"
                label="Service of Interest *"
                options={SERVICE_OPTIONS}
                error={errors.service?.message}
                {...register('service')}
              />

              <Select
                id="booking-mode"
                label="Preferred Meeting Mode *"
                options={MEETING_MODE_OPTIONS}
                error={errors.meeting_mode?.message}
                {...register('meeting_mode')}
              />
            </div>

            <Select
              id="booking-budget"
              label="Estimated Monthly Marketing Budget"
              options={BUDGET_OPTIONS}
              placeholder="Select budget"
              error={errors.budget_range?.message}
              {...register('budget_range')}
            />

            <Textarea
              id="booking-message"
              label="Brief Business Context (Optional)"
              placeholder="Tell us what you want to achieve or any specific questions..."
              error={errors.message?.message}
              {...register('message')}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setStep(2)}
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (formValues.name && formValues.phone && formValues.email) {
                  setStep(4);
                } else {
                  handleSubmit(() => setStep(4))();
                }
              }}
              showArrow
            >
              Review & Confirm
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Final Confirmation */}
      {step === 4 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-h3 text-xl mb-1 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green" />
              <span>Review Consultation Summary</span>
            </h3>
            <p className="text-sm text-text-muted">
              Confirm your details before scheduling. An invitation will be sent to both email and WhatsApp.
            </p>
          </div>

          <div className="rounded-2xl bg-surface border border-border p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-text-dim">Date & Time</span>
              <span className="text-sm font-semibold text-text">
                {formatDate(selectedDate)} at {selectedSlot?.time} IST
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-text-dim">Meeting Mode</span>
              <span className="text-sm font-medium text-text capitalize">
                {formValues.meeting_mode?.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-text-dim">Name</span>
              <span className="text-sm text-text">{formValues.name}</span>
            </div>

            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-text-dim">Contact</span>
              <span className="text-sm text-text">
                +91 {formValues.phone} · {formValues.email}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-text-dim">Service</span>
              <span className="text-sm text-text capitalize">
                {formValues.service}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setStep(3)}
              disabled={isSubmitting}
            >
              Edit Details
            </Button>
            <Button
              type="button"
              onClick={handleSubmit(handleFinalSubmit)}
              loading={isSubmitting}
              showArrow
            >
              {isSubmitting ? 'Securing Slot...' : 'Confirm Free Booking'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

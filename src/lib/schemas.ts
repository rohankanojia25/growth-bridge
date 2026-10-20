import { z } from 'zod';

// Allows 10-digit Indian mobile numbers (starts with 6-9)
const phoneRegex = /^(?:\+91|91)?\s?[6-9]\d{9}$/;

export const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80, 'Name must be under 80 characters'),
  phone: z.string().regex(phoneRegex, 'Enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Enter a valid email address').optional().or(z.literal('')),
  business_name: z.string().max(100).optional().or(z.literal('')),
  service: z.enum(['consulting', 'website', 'crm', 'marketing', 'unsure']),
  budget_range: z
    .enum([
      'below_10k',
      '10k_50k',
      '50k_2l',
      'above_2l',
      'not_decided',
    ])
    .optional(),
  message: z.string().max(1000, 'Message must be under 1000 characters').optional().or(z.literal('')),
  // Honeypot field
  website: z.string().max(0, 'Bot detected').optional().or(z.literal('')),
  // Hidden UTM fields
  utm_source: z.string().optional().or(z.literal('')),
  utm_medium: z.string().optional().or(z.literal('')),
  utm_campaign: z.string().optional().or(z.literal('')),
  utm_term: z.string().optional().or(z.literal('')),
  utm_content: z.string().optional().or(z.literal('')),
  referrer: z.string().optional().or(z.literal('')),
  landing_path: z.string().optional().or(z.literal('')),
  source: z.enum(['contact_form', 'consultation_booking', 'home_quick_form']),
  package_id: z.string().optional().or(z.literal('')),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const contactLeadSchema = leadSchema.extend({
  email: z.string().email('Enter a valid email address'),
});

export type ContactLeadInput = z.infer<typeof contactLeadSchema>;

export const quickLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(phoneRegex, 'Enter a valid 10-digit mobile number'),
  service: z.enum(['consulting', 'website', 'crm', 'marketing', 'unsure']),
  website: z.string().optional().or(z.literal('')),
  utm_source: z.string().optional().or(z.literal('')),
  utm_medium: z.string().optional().or(z.literal('')),
  utm_campaign: z.string().optional().or(z.literal('')),
  utm_term: z.string().optional().or(z.literal('')),
  utm_content: z.string().optional().or(z.literal('')),
  referrer: z.string().optional().or(z.literal('')),
  landing_path: z.string().optional().or(z.literal('')),
  source: z.enum(['contact_form', 'consultation_booking', 'home_quick_form']),
});

export type QuickLeadInput = z.infer<typeof quickLeadSchema>;

export const bookingSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  slot_start: z.string().datetime(),
  slot_end: z.string().datetime(),
  meeting_mode: z.enum(['phone', 'google_meet', 'office_visit']),
  lead: leadSchema.extend({
    email: z.string().email('Enter a valid email address'),
    source: z.literal('consultation_booking'),
  }),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const BUDGET_OPTIONS = [
  { value: 'below_10k', label: 'Below ₹10,00,000' },
  { value: '10k_50k', label: '₹10,000 to ₹50,000' },
  { value: '50k_2l', label: '₹50,000 to ₹2,00,000' },
  { value: 'above_2l', label: 'Above ₹2,00,000' },
  { value: 'not_decided', label: 'Not decided' },
] as const;

export const SERVICE_OPTIONS = [
  { value: 'consulting', label: 'Business Consulting' },
  { value: 'website', label: 'Website Generation' },
  { value: 'crm', label: 'CRM for Businesses' },
  { value: 'marketing', label: 'Full-Stack Marketing' },
  { value: 'unsure', label: 'Not sure yet' },
] as const;

export const MEETING_MODE_OPTIONS = [
  { value: 'phone', label: 'Phone Call' },
  { value: 'google_meet', label: 'Google Meet' },
  { value: 'office_visit', label: 'Office Visit (Delhi)' },
] as const;

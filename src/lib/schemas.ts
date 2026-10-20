import { z } from 'zod';

// Allows 10-digit Indian mobile numbers (starts with 6-9)
export const phoneRegex = /^(?:\+91|91)?\s?[6-9]\d{9}$/;

export const cleanPhone = (phone: string): string => {
  return phone.replace(/[^\d]/g, '').replace(/^91/, '').slice(-10);
};

export const IDEA_STAGE_OPTIONS = [
  { value: 'just_idea', label: 'Just an idea' },
  { value: 'researched', label: 'Researched it a little' },
  { value: 'ready_to_launch', label: 'Ready to launch' },
] as const;

export const STARTING_BUDGET_OPTIONS = [
  { value: 'not_decided', label: 'Not decided' },
  { value: 'below_1l', label: 'Below ₹1,00,000' },
  { value: '1l_5l', label: '₹1,00,000 to ₹5,00,000' },
  { value: 'above_5l', label: 'Above ₹5,00,000' },
] as const;

export const BUSINESS_CHALLENGE_OPTIONS = [
  { value: 'not_enough_customers', label: 'Not enough customers' },
  { value: 'enquiries_not_closing', label: 'Enquiries not turning into sales' },
  { value: 'no_online_presence', label: 'No online presence' },
  { value: 'cannot_track_customers', label: 'Cannot track customers' },
  { value: 'not_sure', label: 'Not sure' },
] as const;

export const MONTHLY_BUDGET_OPTIONS = [
  { value: 'not_decided', label: 'Not decided' },
  { value: 'below_10k', label: 'Below ₹10,000' },
  { value: '10k_50k', label: '₹10,000 to ₹50,000' },
  { value: '50k_2l', label: '₹50,000 to ₹2,00,000' },
  { value: 'above_2l', label: 'Above ₹2,00,000' },
] as const;

export const getStartedSchema = z.object({
  lead_type: z.enum(['idea', 'business']),
  name: z.string().min(2, 'Name must be at least 2 characters').max(80, 'Name must be under 80 characters'),
  phone: z.string().regex(phoneRegex, 'Enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Enter a valid email address').optional().or(z.literal('')),

  // Path: Idea
  idea_summary: z.string().max(600, 'Must be under 600 characters').optional().or(z.literal('')),
  idea_stage: z.string().optional().or(z.literal('')),
  starting_budget: z.string().optional().or(z.literal('')),
  wants_nda: z.boolean().optional(),

  // Path: Business
  business_name: z.string().max(100).optional().or(z.literal('')),
  message: z.string().max(1000).optional().or(z.literal('')), // Used as "What do you sell?"
  city: z.string().max(100).optional().or(z.literal('')),
  link_url: z.string().url('Enter a valid link (https://...)').optional().or(z.literal('')),
  challenge: z.string().optional().or(z.literal('')),
  budget_range: z.string().optional().or(z.literal('')), // Monthly budget

  // Honeypot
  website: z.string().max(0, 'Bot detected').optional().or(z.literal('')),

  // UTM tracking
  utm_source: z.string().optional().or(z.literal('')),
  utm_medium: z.string().optional().or(z.literal('')),
  utm_campaign: z.string().optional().or(z.literal('')),
  utm_term: z.string().optional().or(z.literal('')),
  utm_content: z.string().optional().or(z.literal('')),
  referrer: z.string().optional().or(z.literal('')),
  landing_path: z.string().optional().or(z.literal('')),
  source: z.string().optional().or(z.literal('')),
  package_id: z.string().optional().or(z.literal('')),
}).superRefine((data, ctx) => {
  if (data.lead_type === 'idea') {
    if (!data.idea_summary || data.idea_summary.trim().length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['idea_summary'],
        message: 'Please describe your idea in 2 or 3 lines.',
      });
    }
  } else if (data.lead_type === 'business') {
    if (!data.business_name || data.business_name.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['business_name'],
        message: 'Please enter your business name.',
      });
    }
    if (!data.message || data.message.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['message'],
        message: 'Please tell us what you sell or offer.',
      });
    }
  }
});

export type GetStartedInput = z.infer<typeof getStartedSchema>;

// Contact form schema
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  phone: z.string().regex(phoneRegex, 'Enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Enter a valid email address').optional().or(z.literal('')),
  business_name: z.string().optional().or(z.literal('')),
  message: z.string().min(5, 'Message must be at least 5 characters').max(1000),
  website: z.string().max(0, 'Bot detected').optional().or(z.literal('')),
  utm_source: z.string().optional().or(z.literal('')),
  utm_medium: z.string().optional().or(z.literal('')),
  utm_campaign: z.string().optional().or(z.literal('')),
  utm_term: z.string().optional().or(z.literal('')),
  utm_content: z.string().optional().or(z.literal('')),
  referrer: z.string().optional().or(z.literal('')),
  landing_path: z.string().optional().or(z.literal('')),
  source: z.literal('contact_form').default('contact_form'),
});

export type ContactInput = z.infer<typeof contactSchema>;

// Legacy schema compatibility
export const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  phone: z.string().regex(phoneRegex, 'Enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Enter a valid email address').optional().or(z.literal('')),
  business_name: z.string().max(100).optional().or(z.literal('')),
  service: z.string().optional().or(z.literal('')),
  budget_range: z.string().optional().or(z.literal('')),
  message: z.string().max(1000).optional().or(z.literal('')),
  website: z.string().max(0, 'Bot detected').optional().or(z.literal('')),
  utm_source: z.string().optional().or(z.literal('')),
  utm_medium: z.string().optional().or(z.literal('')),
  utm_campaign: z.string().optional().or(z.literal('')),
  utm_term: z.string().optional().or(z.literal('')),
  utm_content: z.string().optional().or(z.literal('')),
  referrer: z.string().optional().or(z.literal('')),
  landing_path: z.string().optional().or(z.literal('')),
  source: z.string().optional().or(z.literal('')),
  package_id: z.string().optional().or(z.literal('')),
  lead_type: z.enum(['idea', 'business']).optional(),
  idea_summary: z.string().optional(),
  idea_stage: z.string().optional(),
  starting_budget: z.string().optional(),
  wants_nda: z.boolean().optional(),
  challenge: z.string().optional(),
  city: z.string().optional(),
  link_url: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const contactLeadSchema = leadSchema;
export type ContactLeadInput = z.infer<typeof contactLeadSchema>;

export const quickLeadSchema = leadSchema.pick({
  name: true,
  phone: true,
  service: true,
  website: true,
  utm_source: true,
  utm_medium: true,
  utm_campaign: true,
  utm_term: true,
  utm_content: true,
  referrer: true,
  landing_path: true,
  source: true,
});
export type QuickLeadInput = z.infer<typeof quickLeadSchema>;

export const BUDGET_OPTIONS = [
  { value: 'below_10k', label: 'Below ₹10,000' },
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

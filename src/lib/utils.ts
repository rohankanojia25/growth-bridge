import { type ClassValue, clsx } from 'clsx';

/** Merge class names. Tailwind v4 doesn't need tailwind-merge. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/** Format a 10-digit Indian phone number with country code and spacing. */
export function formatPhone(phone: string): string {
  return phone.replace(/(\d{5})(\d{5})/, '+91 $1 $2');
}

/** Format a number as Indian Rupees (₹) with no decimal places. */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format a date in Indian locale: "20 Oct 2026". */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(date));
}

/** Format a time in Indian locale: "06:37 pm". */
export function formatTime(date: Date | string): string {
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  }).format(new Date(date));
}

/** Convert text to a URL-safe slug. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Generate a cryptographically random alphanumeric token. */
export function generateToken(length: number = 24): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => chars[byte % chars.length]).join('');
}

/** Create a non-reversible hash of an IP address using a salt. */
export function hashIP(ip: string, salt: string): string {
  // Simple synchronous hash for rate-limiting / analytics fingerprints.
  // NOT cryptographic — use Web Crypto API for secure hashing.
  let hash = 0;
  const str = salt + ip;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

/** Core business information used across the site. */
export const BUSINESS_INFO = {
  name: 'Growth Bridge Accelerator',
  phone: '+918883838363',
  phoneFormatted: '+91 88838 38363',
  whatsappUrl: '/whatsapp',
  email: 'hello@growthbridgeaccelerator.com',
  address: {
    street: 'X/3938 D2, Street No. 14, Shanti Mohalla',
    area: 'Gandhi Nagar',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110031',
    country: 'India',
    full: 'X/3938 D2, Street No. 14, Shanti Mohalla, Gandhi Nagar, Delhi, 110031, India',
  },
  hours: 'Monday to Saturday, 10:00 AM to 7:00 PM IST',
  hoursStructured: 'Mo-Sa 10:00-19:00',
} as const;

/** Service definitions for navigation, cards, and routing. */
export const SERVICES = [
  {
    key: 'consulting' as const,
    title: 'Business Consulting',
    slug: 'business-consulting',
    shortDescription: 'Growth strategy, operations review, and go-to-market planning.',
    icon: 'Compass',
  },
  {
    key: 'website' as const,
    title: 'Website Generation',
    slug: 'website-generation',
    shortDescription: 'Business websites, landing pages, and WhatsApp-first sites.',
    icon: 'Globe',
  },
  {
    key: 'crm' as const,
    title: 'CRM for Businesses',
    slug: 'crm-for-businesses',
    shortDescription: 'Setup, customization, automation, and team training.',
    icon: 'Users',
  },
  {
    key: 'marketing' as const,
    title: 'Full-Stack Business Marketing',
    slug: 'full-stack-marketing',
    shortDescription: 'SEO, local SEO, social media, paid ads, content, branding, and lead generation.',
    icon: 'Megaphone',
  },
] as const;

export type ServiceKey = typeof SERVICES[number]['key'];

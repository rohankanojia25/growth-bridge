import fs from 'fs';
import path from 'path';

export interface GalleryItem {
  url: string;
  alt: string;
}

export interface CaseStudyResult {
  label: string;
  value: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  client_name: string;
  industry: string;
  live_url?: string | null;
  services_used?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  summary: string;
  challenge: string;
  solution: string;
  results: CaseStudyResult[];
  cover_image_url?: string | null;
  gallery?: GalleryItem[];
  is_published: boolean;
  published_at?: string | null;
}

export function imageFileExists(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    if (url.startsWith('/')) {
      const publicPath = path.join(process.cwd(), 'public', url.replace(/^\//, ''));
      return fs.existsSync(publicPath);
    }
    return false;
  } catch {
    return false;
  }
}

export const FALLBACK_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'nukkad-dahibhalla-id',
    title: "Nukkad DahiBhalla: From a Food Idea to Google's AI Recommendation",
    slug: 'nukkad-dahibhalla',
    client_name: 'Nukkad DahiBhalla',
    industry: 'Food and street food, Gurugram',
    live_url: 'https://nukkaddahibhalla.com',
    services_used:
      'Website, Google Business Profile, Local SEO and keywords, AI search visibility, Instagram setup, Instagram posts and videos',
    seo_title: 'Nukkad DahiBhalla Case Study | Growth Bridge Accelerator',
    seo_description:
      "How Growth Bridge Accelerator took Nukkad DahiBhalla from an idea to Google's AI recommendation with a website, Google profile, SEO and Instagram.",
    summary:
      "Nukkad DahiBhalla began as an idea. Today, when someone in Gurugram asks Google for the best dahi bhalla, Google's AI Overview lists them first. This is how we got there together.",
    challenge: `### The idea

Every good business starts with someone who believes in what they make. Nukkad DahiBhalla came to us with exactly that: a product people love, dahi bhalla and street-food favourites from Sector 56, Gurugram, and a clear idea of what the brand could become.

What they didn't have yet was a plan to be found. Delivery apps could list them, but when someone searches on Google, asks an AI, or scrolls Instagram, they needed a place that was truly theirs.

### What we found first

We don't start by building. We started by studying the competition: who already showed up for dahi bhalla and chaat searches in Gurugram, how their websites and Google profiles looked, which words customers actually typed, and where the gaps were.

That research shaped everything that followed. It told us what to build, what to skip, and where a new brand could win.`,
    solution: `### The plan

We turned the research into a simple order of work: get found on Google first, make the brand easy to trust and order from, then keep it visible where people scroll.

### What we built

**A website that works for them.** Fast, mobile-first, and built around what customers actually want: food ordering, kitty party catering, bulk orders and events, with an easy way to get in touch.

**A Google Business Profile that earns trust.** Photos, address, hours, phone number, website link and an Order online button, so people can go from search to order in a tap.

**The words customers really use.** We researched local searches and wove those phrases into the website and the profile, so Google understands what the business offers and where.

**A brand AI can recommend.** We structured the website and profile so Google's AI Overview can read, understand and recommend the business.

**An Instagram presence.** The profile set up properly, plus posts and short videos so the food gets seen where people scroll. How much content depends on the package.`,
    results: [
      { label: 'Google AI Overview', value: 'Listed first for "best dahi bhalla in Gurgaon"' },
      { label: 'Google Maps', value: 'Shown in the map results for the same search' },
      { label: 'Google Business Profile', value: '5.0 stars from 48 reviews' },
      {
        label: 'Brand search',
        value: 'Their own website comes first, with an Order online button on the listing',
      },
      { label: 'Instagram', value: 'Live with regular posts and videos' },
    ],
    cover_image_url: '/case-studies/nukkad-dahibhalla/cover.webp',
    gallery: [
      {
        url: '/case-studies/nukkad-dahibhalla/cover.webp',
        alt: 'Nukkad DahiBhalla website shown on a laptop and a phone',
      },
      {
        url: '/case-studies/nukkad-dahibhalla/ai-overview.webp',
        alt: 'Google AI Overview listing Nukkad DahiBhalla first for best dahi bhalla in Gurgaon',
      },
      {
        url: '/case-studies/nukkad-dahibhalla/google-profile.webp',
        alt: 'Nukkad DahiBhalla Google Business Profile with 5.0 stars and an Order online button',
      },
      {
        url: '/case-studies/nukkad-dahibhalla/instagram.webp',
        alt: 'Nukkad DahiBhalla Instagram profile with posts and videos',
      },
    ],
    is_published: true,
    published_at: new Date().toISOString(),
  },
];

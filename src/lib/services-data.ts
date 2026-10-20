export interface ServiceDeliverable {
  title: string;
  description: string;
}

export interface ServiceProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceDetail {
  key: 'consulting' | 'website' | 'crm' | 'marketing';
  slug: string;
  slotKey: string;
  title: string;
  eyebrow: string;
  headline: string;
  summary: string;
  deliverablesSummary: [string, string, string];
  whatYouGet: ServiceDeliverable[];
  whoItIsFor: string[];
  process: ServiceProcessStep[];
  faqs: ServiceFAQ[];
}

export const SERVICES_DATA: Record<string, ServiceDetail> = {
  'business-consulting': {
    key: 'consulting',
    slug: 'business-consulting',
    slotKey: 'service-consulting',
    title: 'Business Consulting',
    eyebrow: 'Strategy & Diagnostics',
    headline: 'Pragmatic growth strategy for owner-led Indian businesses.',
    summary:
      'We audit your revenue pipeline, eliminate operational friction, and build an actionable 90-day roadmap that aligns sales, marketing, and delivery.',
    deliverablesSummary: [
      'Comprehensive revenue leakage audit',
      'Unit economics & pricing review',
      'Prioritized 90-day growth roadmap',
    ],
    whatYouGet: [
      {
        title: 'Revenue Leakage Audit',
        description:
          'Deep forensic review of where prospects drop off between first contact and final invoice payment.',
      },
      {
        title: 'Unit Economics & Margin Analysis',
        description:
          'Clear calculation of customer acquisition cost, gross margins, and profitability by service line.',
      },
      {
        title: 'Customer Journey Mapping',
        description:
          'Step-by-step blueprint tracking every touchpoint from discovery to customer retention.',
      },
      {
        title: 'Competitive Positioning Strategy',
        description:
          'Differentiation messaging that allows you to win high-value accounts without racing to the bottom on price.',
      },
      {
        title: 'Sales Process & Scripting',
        description:
          'Standard operating procedures, qualification questions, and objection handling for your front-line team.',
      },
      {
        title: 'Weekly Leadership Cadence',
        description:
          'Structured weekly review sprints tracking lead velocity, pipeline volume, and milestone completion.',
      },
    ],
    whoItIsFor: [
      'Business owners feeling stuck at a revenue plateau despite working 60+ hours a week.',
      'Companies spending on ads or sales staff without seeing predictable cash flow increases.',
      'Founders preparing to expand to new branch locations across Delhi NCR or North India.',
      'Businesses frustrated with disconnected vendors giving contradictory advice.',
    ],
    process: [
      {
        step: '01',
        title: 'Financial & Pipeline Audit',
        description:
          'We evaluate your historical sales records, customer churn, and marketing spend over the past 12 months.',
      },
      {
        step: '02',
        title: 'Bottleneck Identification',
        description:
          'We pinpoint the exact constraint holding back revenue—whether positioning, closing rate, or repeat business.',
      },
      {
        step: '03',
        title: 'The 90-Day Roadmap',
        description:
          'We deliver a concrete sequence of high-impact changes with designated owners and measurable weekly KPIs.',
      },
      {
        step: '04',
        title: 'Implementation & Review',
        description:
          'We sit with your leadership team every week to hold execution accountable and adjust to market feedback.',
      },
    ],
    faqs: [
      {
        question: 'How is this different from generic business coaching?',
        answer:
          'We do not deliver motivational talks or vague frameworks. We analyze your actual balance sheet, sales pipeline, and customer acquisition channels to fix operational leaks directly.',
      },
      {
        question: 'Do you work on-site in Delhi NCR?',
        answer:
          'Yes. We conduct in-person discovery sessions at our Gandhi Nagar office or your business premises across Delhi NCR, complemented by weekly virtual review sprints.',
      },
      {
        question: 'How quickly can we expect to see tangible results?',
        answer:
          'Most clients uncover immediate revenue leaks within the first 14 days of our diagnostic audit and begin executing high-margin optimizations by week three.',
      },
      {
        question: 'Will you help our team execute the strategy?',
        answer:
          'Yes. Unlike traditional advisory firms that leave behind slide decks, our connected model means our team builds the website, configures the CRM, and manages the marketing campaigns required by the strategy.',
      },
    ],
  },

  'website-generation': {
    key: 'website',
    slug: 'website-generation',
    slotKey: 'service-website',
    title: 'Website Generation',
    eyebrow: 'Conversion Infrastructure',
    headline: 'High-speed business websites engineered for Indian customers.',
    summary:
      'We design and deploy blazing-fast websites with sub-2 second load speeds, direct WhatsApp routing, and rock-solid search engine structure.',
    deliverablesSummary: [
      'Sub-2 second mobile page speed',
      'Direct WhatsApp conversion routing',
      'Local schema & Technical SEO foundation',
    ],
    whatYouGet: [
      {
        title: 'Mobile-First Speed Architecture',
        description:
          'Custom built on modern edge infrastructure ensuring instant loads on 4G and 5G mobile connections across India.',
      },
      {
        title: 'WhatsApp Direct Capture',
        description:
          'Pre-filled, frictionless WhatsApp inquiry triggers that turn casual browsers into warm chats in one tap.',
      },
      {
        title: 'Local SEO & Schema Markup',
        description:
          'Full technical SEO implementation with LocalBusiness, FAQ, and Breadcrumb JSON-LD for top Google Maps placement.',
      },
      {
        title: 'Clear Value Messaging',
        description:
          'Concise, benefit-led headline copywriting that immediately answers what you do, who you serve, and why trust you.',
      },
      {
        title: 'Automated Lead Forms',
        description:
          'Double-opt-in inquiry forms with instant email notifications and automatic CRM webhook syncing.',
      },
      {
        title: 'Zero Plugin Vulnerabilities',
        description:
          'No bloated themes or fragile WordPress plugins. Clean, secure code that never breaks on browser updates.',
      },
    ],
    whoItIsFor: [
      'Businesses embarrassed by an outdated, slow website that does not reflect their real stature.',
      'Owners spending on Google or Meta ads but seeing high bounce rates and zero incoming inquiries.',
      'Local clinics, showrooms, and service firms needing instant WhatsApp-driven conversions.',
      'Companies tired of freelance web developers who disappear after sending a broken site.',
    ],
    process: [
      {
        step: '01',
        title: 'Wireframe & Content Architecture',
        description:
          'We plan page hierarchy and conversion pathways based on how your target Indian customers search and decide.',
      },
      {
        step: '02',
        title: 'Art-Directed UI Design',
        description:
          'We build a clean, dark or light aesthetic customized with your brand tokens, typography, and clear calls to action.',
      },
      {
        step: '03',
        title: 'Modern Code & Edge Deployment',
        description:
          'We code your site for maximum Lighthouse performance (90+ mobile score) and connect forms to your CRM.',
      },
      {
        step: '04',
        title: 'SEO Audit & Handover',
        description:
          'We index your sitemap in Google Search Console, test all WhatsApp integrations, and launch with zero downtime.',
      },
    ],
    faqs: [
      {
        question: 'Why do you prioritize WhatsApp integration?',
        answer:
          'Over 85% of Indian consumer and B2B inquiries happen on WhatsApp. By providing pre-filled, one-click WhatsApp routing, conversion rates typically double compared to traditional email-only forms.',
      },
      {
        question: 'Do I own the code and domain?',
        answer:
          'Completely. You retain 100% ownership of your domain, codebase, media assets, and analytics. We provide full deployment access.',
      },
      {
        question: 'How fast will the website load?',
        answer:
          'We target sub-2 second Largest Contentful Paint (LCP) on Indian mobile networks, ensuring near-zero bounce rates from ad clicks.',
      },
      {
        question: 'Can you write the copy for our business?',
        answer:
          'Yes. We write all headlines, service descriptions, and value propositions in crisp, plain English tailored to your buyers.',
      },
    ],
  },

  'crm-for-businesses': {
    key: 'crm',
    slug: 'crm-for-businesses',
    slotKey: 'service-crm',
    title: 'CRM for Businesses',
    eyebrow: 'Customer Pipeline & Automation',
    headline: 'Never lose a lead again with custom CRM automation.',
    summary:
      'We configure, automate, and train your team on a streamlined CRM that captures every phone call, WhatsApp, and website inquiry into one organized pipeline.',
    deliverablesSummary: [
      'Centralized multi-channel lead capture',
      'Automated WhatsApp follow-up reminders',
      'Staff onboarding and workflow training',
    ],
    whatYouGet: [
      {
        title: 'Unified Multi-Channel Inbox',
        description:
          'Consolidate inquiries from your website, Google Business profile, WhatsApp, and phone calls into a single dashboard.',
      },
      {
        title: 'Automated Follow-Up Workflows',
        description:
          'Instant auto-replies and automated reminders so prospects receive rapid attention even outside office hours.',
      },
      {
        title: 'Pipeline Deal Stages',
        description:
          'Visual Kanban board tracking every prospect from New Lead to Qualified, Proposal Sent, and Won.',
      },
      {
        title: 'Team Accountability & Logs',
        description:
          'Timestamped activity notes, call logs, and deal ownership ensuring your sales reps follow up on schedule.',
      },
      {
        title: 'Customer Re-Engagement Triggers',
        description:
          'Automated broadcast sequences to re-activate past clients with seasonal offers and check-in messages.',
      },
      {
        title: 'Executive Revenue Reporting',
        description:
          'Real-time metrics showing total pipeline value, conversion velocity, and individual rep performance.',
      },
    ],
    whoItIsFor: [
      'Businesses currently managing high-value inquiries across unorganized WhatsApp chats and paper notebooks.',
      'Founders who suspect their sales staff are failing to follow up with qualified leads on time.',
      'Companies generating 50+ inquiries a month with no centralized record of customer history.',
      'Service firms wanting to automate appointment confirmations and post-visit review requests.',
    ],
    process: [
      {
        step: '01',
        title: 'Sales Workflow Mapping',
        description:
          'We document how inquiries currently arrive, who touches them, and where prospects get neglected.',
      },
      {
        step: '02',
        title: 'CRM Setup & Custom Fields',
        description:
          'We configure custom fields, deal stages, and notification alerts tailored to your exact business terminology.',
      },
      {
        step: '03',
        title: 'Channel Integration',
        description:
          'We connect your website forms, WhatsApp API, and lead gen campaigns directly to the pipeline.',
      },
      {
        step: '04',
        title: 'Staff Training & Live Launch',
        description:
          'We train your staff in hands-on practical sessions and monitor the first two weeks of live lead flow.',
      },
    ],
    faqs: [
      {
        question: 'Will our team find it difficult to use?',
        answer:
          'No. We deliberately avoid complex enterprise software. We configure clean, intuitive CRM interfaces and train your team directly so they are proficient on day one.',
      },
      {
        question: 'Can it connect with WhatsApp?',
        answer:
          'Yes. Incoming WhatsApp inquiries create automatic lead cards, and follow-up reminders notify reps directly.',
      },
      {
        question: 'What happens to our existing customer list?',
        answer:
          'We clean, format, and import your existing customer spreadsheets or contacts directly into the new CRM.',
      },
      {
        question: 'Can the business owner check performance on mobile?',
        answer:
          'Yes. You get full mobile app access to monitor new leads, rep response times, and closed sales from anywhere.',
      },
    ],
  },

  'full-stack-marketing': {
    key: 'marketing',
    slug: 'full-stack-marketing',
    slotKey: 'service-marketing',
    title: 'Full-Stack Business Marketing',
    eyebrow: 'Demand Generation & Authority',
    headline: 'High-intent marketing that fills your pipeline with real buyers.',
    summary:
      'From dominating Google Maps in Delhi NCR to laser-targeted search ads and social authority, we drive high-margin inquiries that turn into paying clients.',
    deliverablesSummary: [
      'Delhi NCR & Google Maps Local SEO dominance',
      'High-intent Google Search advertising',
      'Authoritative content & social media management',
    ],
    whatYouGet: [
      {
        title: 'Google Maps & Local SEO Dominance',
        description:
          'Optimization of your Google Business Profile, local citations, and review velocity to capture nearby buyers.',
      },
      {
        title: 'High-Intent Google Ads',
        description:
          'Targeted search campaigns capturing prospects actively searching for your service with ready-to-buy intent.',
      },
      {
        title: 'Social Proof & Meta Ads',
        description:
          'Retargeting campaigns on Instagram and Facebook that re-engage previous site visitors and build local authority.',
      },
      {
        title: 'Content & Authority Building',
        description:
          'Strategic articles, case stories, and video scripts demonstrating your business expertise in plain English.',
      },
      {
        title: 'Conversion Rate Optimization',
        description:
          'Continuous A/B testing of headlines, form lengths, and CTAs to lower your cost per qualified lead.',
      },
      {
        title: 'Zero Vanity Metrics Reporting',
        description:
          'Monthly revenue reports focused on Cost Per Qualified Lead (CPQL) and Customer Acquisition Cost (CAC).',
      },
    ],
    whoItIsFor: [
      'Businesses currently ranking below competitors on Google Maps in their Delhi NCR locality.',
      'Companies tired of agencies reporting millions of impressions with zero actual sales calls.',
      'Owners wanting predictable lead generation that does not rely solely on personal word-of-mouth.',
      'Growing brands ready to dominate their category across Delhi and North India.',
    ],
    process: [
      {
        step: '01',
        title: 'Audience & Search Intent Audit',
        description:
          'We identify the exact search queries, geographic clusters, and pain points of your highest-value customers.',
      },
      {
        step: '02',
        title: 'Local SEO & Campaign Build',
        description:
          'We optimize your Google Business profile, build landing pages, and launch tightly targeted search campaigns.',
      },
      {
        step: '03',
        title: 'Lead Routing & CRM Sync',
        description:
          'Every ad click and organic inquiry flows directly into your CRM with source tracking (UTMs) attached.',
      },
      {
        step: '04',
        title: 'Weekly Optimization & Scaling',
        description:
          'We cut wasted keywords, double down on profitable ad sets, and expand into high-performing target localities.',
      },
    ],
    faqs: [
      {
        question: 'Do you charge a percentage of ad spend or a flat fee?',
        answer:
          'We operate on transparent flat monthly management retainers. We have zero incentive to artificially inflate your ad spend.',
      },
      {
        question: 'How do you prevent ad budget waste?',
        answer:
          'We implement exhaustive negative keyword lists, hyper-local radius targeting in Delhi NCR, and route clicks only to high-speed conversion landing pages.',
      },
      {
        question: 'How do you measure marketing success?',
        answer:
          'We measure real business outcomes: qualified inquiries, booked consultations, and customer acquisition cost—never vanity likes or impressions.',
      },
      {
        question: 'Can you optimize our existing Google Business profile?',
        answer:
          'Yes. We audit your categories, geo-tagged photos, service menus, review responses, and local citation consistency.',
      },
    ],
  },
};

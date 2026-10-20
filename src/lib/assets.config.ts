export interface AssetSlot {
  key: string;
  label: string;
  required: boolean;
  aspect: string;
  recommendedSize: string;
  defaultAlt: string;
  fallbackVariant: 'mesh' | 'grid' | 'orbit' | 'arch';
}

export const ASSET_SLOTS: AssetSlot[] = [
  {
    key: 'logo-full',
    label: 'Full Logo',
    required: true,
    aspect: 'auto',
    recommendedSize: '200x40 SVG',
    defaultAlt: 'Growth Bridge Accelerator',
    fallbackVariant: 'arch',
  },
  {
    key: 'logo-mark',
    label: 'Logo Mark',
    required: true,
    aspect: '1:1',
    recommendedSize: '512x512',
    defaultAlt: 'Growth Bridge Accelerator',
    fallbackVariant: 'arch',
  },
  {
    key: 'favicon',
    label: 'Favicon',
    required: true,
    aspect: '1:1',
    recommendedSize: '512x512',
    defaultAlt: 'Growth Bridge Accelerator favicon',
    fallbackVariant: 'arch',
  },
  {
    key: 'og-default',
    label: 'Default Social Share Image',
    required: true,
    aspect: '1200:630',
    recommendedSize: '1200x630',
    defaultAlt: 'Growth Bridge Accelerator - Business Consulting & Marketing',
    fallbackVariant: 'mesh',
  },
  {
    key: 'hero-visual',
    label: 'Home Hero Visual',
    required: true,
    aspect: '16:10',
    recommendedSize: '1600x1000',
    defaultAlt: 'Growth Bridge Accelerator - Bridging your business to growth',
    fallbackVariant: 'mesh',
  },
  {
    key: 'service-consulting',
    label: 'Business Consulting Image',
    required: true,
    aspect: '4:3',
    recommendedSize: '1200x900',
    defaultAlt: 'Business Consulting services',
    fallbackVariant: 'grid',
  },
  {
    key: 'service-website',
    label: 'Website Generation Image',
    required: true,
    aspect: '4:3',
    recommendedSize: '1200x900',
    defaultAlt: 'Website Generation services',
    fallbackVariant: 'orbit',
  },
  {
    key: 'service-crm',
    label: 'CRM for Businesses Image',
    required: true,
    aspect: '4:3',
    recommendedSize: '1200x900',
    defaultAlt: 'CRM for Businesses services',
    fallbackVariant: 'mesh',
  },
  {
    key: 'service-marketing',
    label: 'Full-Stack Marketing Image',
    required: true,
    aspect: '4:3',
    recommendedSize: '1200x900',
    defaultAlt: 'Full-Stack Business Marketing services',
    fallbackVariant: 'grid',
  },
  {
    key: 'about-hero',
    label: 'About Page Hero',
    required: false,
    aspect: '21:9',
    recommendedSize: '2000x860',
    defaultAlt: 'About Growth Bridge Accelerator',
    fallbackVariant: 'mesh',
  },
  {
    key: 'about-office',
    label: 'Office Photo',
    required: false,
    aspect: '4:3',
    recommendedSize: '1200x900',
    defaultAlt: 'Growth Bridge Accelerator office',
    fallbackVariant: 'grid',
  },
  {
    key: 'about-team',
    label: 'Team Photo',
    required: false,
    aspect: '3:2',
    recommendedSize: '1500x1000',
    defaultAlt: 'Growth Bridge Accelerator team',
    fallbackVariant: 'orbit',
  },
  {
    key: 'contact-visual',
    label: 'Contact Page Visual',
    required: false,
    aspect: '4:5',
    recommendedSize: '960x1200',
    defaultAlt: 'Contact Growth Bridge Accelerator',
    fallbackVariant: 'mesh',
  },
  {
    key: 'cta-background',
    label: 'CTA Background',
    required: false,
    aspect: '21:9',
    recommendedSize: '2000x860',
    defaultAlt: '',
    fallbackVariant: 'mesh',
  },
];

export function getSlot(key: string): AssetSlot | undefined {
  return ASSET_SLOTS.find((s) => s.key === key);
}

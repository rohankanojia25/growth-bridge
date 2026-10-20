import Image from 'next/image';
import { unstable_cache } from 'next/cache';
import { cn } from '@/lib/utils';
import { getSlot } from '@/lib/assets.config';
import { AssetFallback } from './asset-fallback';

interface AssetRecord {
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  focal_x: number | null;
  focal_y: number | null;
}

const getCachedAsset = unstable_cache(
  async (slotKey: string): Promise<AssetRecord | null> => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseKey) return null;

      const res = await fetch(
        `${supabaseUrl}/rest/v1/site_assets?slot_key=eq.${encodeURIComponent(
          slotKey
        )}&select=url,alt,width,height,focal_x,focal_y&limit=1`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        }
      );

      if (!res.ok) return null;
      const data = await res.json();
      if (!data || data.length === 0) return null;
      return data[0];
    } catch {
      return null;
    }
  },
  ['site_assets_by_slot'],
  { tags: ['assets'], revalidate: 3600 }
);

export interface SiteImageProps {
  slot: string;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  sizes?: string;
  rounded?: boolean;
  fill?: boolean;
}

export async function SiteImage({
  slot,
  className,
  style,
  priority = false,
  sizes = '(max-width: 768px) 100vw, 50vw',
  rounded = false,
}: SiteImageProps) {
  const slotConfig = getSlot(slot);
  const asset = await getCachedAsset(slot);

  const isHero = slot === 'hero-visual';
  const shouldPrioritize = priority || isHero;

  const aspectParts = slotConfig?.aspect?.split(':').map(Number);
  const aspectRatio =
    aspectParts && aspectParts.length === 2
      ? `${aspectParts[0]}/${aspectParts[1]}`
      : slotConfig?.aspect === 'auto'
      ? 'auto'
      : undefined;

  if (!asset || !asset.url) {
    if (!slotConfig || !slotConfig.required) {
      return null;
    }

    return (
      <AssetFallback
        variant={slotConfig.fallbackVariant}
        aspect={slotConfig.aspect}
        className={cn(rounded && 'rounded-[20px]', className)}
        style={style}
      />
    );
  }

  const alt = asset.alt || slotConfig?.defaultAlt || '';
  const focalX = asset.focal_x ?? 50;
  const focalY = asset.focal_y ?? 50;

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        rounded && 'rounded-[20px]',
        className
      )}
      style={{
        aspectRatio: aspectRatio || 'auto',
        ...style,
      }}
    >
      <Image
        src={asset.url}
        alt={alt}
        fill
        priority={shouldPrioritize}
        sizes={sizes}
        className="object-cover"
        style={{
          objectPosition: `${focalX}% ${focalY}%`,
        }}
      />
    </div>
  );
}

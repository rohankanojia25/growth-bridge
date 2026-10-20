import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface LogoProps {
  variant?: 'full' | 'mark';
  className?: string;
  height?: number;
}

export function LogoFallbackMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="logo-growth-grad" x1="0%" y1="0%" x2="20%" y2="100%">
          <stop offset="0%" stopColor="#19F28C" />
          <stop offset="48%" stopColor="#3DD6F5" />
          <stop offset="100%" stopColor="#7B61FF" />
        </linearGradient>
      </defs>
      {/* 3 Rising Growth Bars */}
      <rect x="3.75" y="23" width="7.5" height="12.5" rx="3.75" fill="url(#logo-growth-grad)" />
      <rect x="16.25" y="14.5" width="7.5" height="21" rx="3.75" fill="url(#logo-growth-grad)" />
      <rect x="28.75" y="4.5" width="7.5" height="31" rx="3.75" fill="url(#logo-growth-grad)" />
    </svg>
  );
}

export function LogoFallback({ variant = 'full', height = 32 }: { variant?: 'full' | 'mark'; height?: number }) {
  if (variant === 'mark') {
    return <LogoFallbackMark size={height} />;
  }

  return (
    <div className="inline-flex items-center gap-3 select-none" style={{ height: `${height}px` }}>
      <LogoFallbackMark size={height} />
      <div className="flex flex-col justify-center leading-none">
        <span className="font-display font-bold text-text text-[17px] tracking-tight whitespace-nowrap">
          Growth Bridge
        </span>
        <span className="font-mono text-green text-[9px] tracking-[0.3em] uppercase mt-1">
          ACCELERATOR
        </span>
      </div>
    </div>
  );
}

export function Logo({ variant = 'full', className, height }: LogoProps) {
  const h = height || (variant === 'full' ? 32 : 32);

  return (
    <Link
      href="/"
      className={cn(
        'inline-flex items-center shrink-0 min-h-[44px] py-1.5 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-green/25 rounded-lg transition-opacity hover:opacity-95',
        className
      )}
      aria-label="Growth Bridge Accelerator, home"
    >
      <LogoFallback variant={variant} height={h} />
    </Link>
  );
}

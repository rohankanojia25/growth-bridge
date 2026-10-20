import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SiteImage } from './site-image';

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
        <linearGradient id="logo-arch-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#19F28C" />
          <stop offset="50%" stopColor="#3DD6F5" />
          <stop offset="100%" stopColor="#7B61FF" />
        </linearGradient>
      </defs>
      {/* Bridge Arch with Top Convergence */}
      <path
        d="M6 34 C6 34 10 10 20 10 C30 10 34 34 34 34"
        stroke="url(#logo-arch-grad)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M12 34 C12 34 15 18 20 18 C25 18 28 34 28 34"
        stroke="url(#logo-arch-grad)"
        strokeWidth="1.75"
        strokeLinecap="round"
        fill="none"
        opacity="0.65"
      />
      <circle cx="20" cy="10" r="3.25" fill="#19F28C" />
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
        'inline-flex items-center shrink-0 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-green/25 rounded-lg transition-opacity hover:opacity-95',
        className
      )}
      aria-label="Growth Bridge Accelerator, home"
    >
      <LogoFallback variant={variant} height={h} />
    </Link>
  );
}

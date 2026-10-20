'use client';

import Link from 'next/link';
import { ArrowRight, Lightbulb, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trackAnalyticsEvent } from '@/components/layout/analytics';

interface TwoPathButtonsProps {
  className?: string;
  size?: 'default' | 'sm' | 'lg';
  location?: string;
  showIcons?: boolean;
}

export function TwoPathButtons({
  className,
  size = 'default',
  location = 'page_cta',
  showIcons = false,
}: TwoPathButtonsProps) {
  const sizeClasses = {
    sm: 'h-10 px-5 text-xs',
    default: 'h-12 px-6 text-sm',
    lg: 'h-14 px-8 text-base',
  };

  const handleTrack = (path: 'idea' | 'business') => {
    trackAnalyticsEvent('path_click', {
      path,
      location,
    });
  };

  return (
    <div className={cn('flex flex-wrap items-center gap-3.5', className)}>
      <Link
        href="/get-started?path=idea"
        onClick={() => handleTrack('idea')}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-full font-semibold select-none transition-all duration-200',
          'bg-green text-[#04110A] hover:shadow-[0_0_32px_rgba(25,242,140,0.35)] active:scale-[0.98]',
          sizeClasses[size]
        )}
      >
        {showIcons && <Lightbulb className="w-4 h-4 text-[#04110A]" />}
        <span>Share your idea</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Link>

      <Link
        href="/get-started?path=business"
        onClick={() => handleTrack('business')}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-full font-semibold select-none transition-all duration-200',
          'bg-transparent border border-border-strong text-text hover:bg-white/[0.06] hover:border-white/30 active:scale-[0.98]',
          sizeClasses[size]
        )}
      >
        {showIcons && <Briefcase className="w-4 h-4 text-text-muted" />}
        <span>Bring your business</span>
      </Link>
    </div>
  );
}

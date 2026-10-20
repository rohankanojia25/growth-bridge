'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getLenis } from '@/components/layout/smooth-scroll';

export function BackToTop() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 600);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const focusHeader = useCallback(() => {
    const headerFocusable = document.querySelector<HTMLElement>(
      '.skip-to-content, header a[href="/"], header a, header button, #main-content'
    );
    if (headerFocusable) {
      headerFocusable.focus({ preventScroll: true });
    }
  }, []);

  const scrollToTop = useCallback(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenis = getLenis();

    if (prefersReducedMotion) {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true });
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      focusHeader();
    } else {
      if (lenis) {
        lenis.scrollTo(0, { duration: 0.5 });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
      setTimeout(focusHeader, 520);
    }
  }, [focusHeader]);

  // Do not show on /admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={cn(
        'fixed z-30 flex items-center justify-center w-12 h-12 rounded-full glass border border-border-strong group no-print',
        'transition-all duration-200 ease-out',
        'hover:border-green hover:shadow-[0_0_24px_rgba(25,242,140,0.35)] active:scale-95',
        'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-green/25 focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        'right-4 md:right-6',
        isVisible
          ? 'opacity-100 pointer-events-auto scale-100'
          : 'opacity-0 pointer-events-none scale-90'
      )}
      style={{
        bottom: 'var(--bottom-ui-offset, calc(56px + env(safe-area-inset-bottom, 0px) + 16px))',
      }}
    >
      <ArrowUp
        className="w-5 h-5 text-text transition-colors duration-200 group-hover:text-green"
        aria-hidden="true"
      />
    </button>
  );
}

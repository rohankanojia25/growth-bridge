'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export interface LenisInstance {
  scrollTo: (
    target: number | string | HTMLElement,
    options?: { immediate?: boolean; force?: boolean; duration?: number }
  ) => void;
}

export function getLenis(): LenisInstance | undefined {
  if (typeof window === 'undefined') return undefined;
  return (window as unknown as { __lenis?: LenisInstance }).__lenis;
}

export function SmoothScroll() {
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Check for touch device
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (prefersReducedMotion || isTouch) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    (window as unknown as { __lenis?: LenisInstance }).__lenis = lenis;

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      delete (window as unknown as { __lenis?: LenisInstance }).__lenis;
      lenis.destroy();
    };
  }, []);

  return null;
}

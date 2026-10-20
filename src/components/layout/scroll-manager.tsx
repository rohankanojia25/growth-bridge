'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { getLenis } from './smooth-scroll';

export function ScrollManager() {
  const pathname = usePathname();
  const lastPathnameRef = useRef(pathname);
  const isPopStateRef = useRef(false);

  // Track Back / Forward browser navigation
  useEffect(() => {
    const handlePopState = () => {
      isPopStateRef.current = true;
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle page changes
  useEffect(() => {
    // Only execute when pathname actually changes (ignore query-string-only changes)
    const pathnameChanged = lastPathnameRef.current !== pathname;
    lastPathnameRef.current = pathname;

    if (!pathnameChanged) {
      return;
    }

    // If user navigated using Back / Forward, let browser/Next.js restore position
    if (isPopStateRef.current) {
      isPopStateRef.current = false;
      return;
    }

    const hash = typeof window !== 'undefined' ? window.location.hash : '';

    if (hash) {
      let attempts = 0;
      const maxAttempts = 15;

      const scrollToTarget = () => {
        try {
          const id = decodeURIComponent(hash.slice(1));
          const el = document.getElementById(id) || document.querySelector(hash);
          if (el) {
            const rect = el.getBoundingClientRect();
            const targetY = Math.max(0, rect.top + window.scrollY - 96);
            const lenis = getLenis();
            if (lenis) {
              lenis.scrollTo(targetY, { immediate: true, force: true });
            }
            window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
            return true;
          }
        } catch {
          // Ignore invalid selector
        }
        return false;
      };

      // Try immediately
      if (!scrollToTarget()) {
        const timer = setInterval(() => {
          attempts++;
          if (scrollToTarget() || attempts >= maxAttempts) {
            clearInterval(timer);
          }
        }, 50);
      }
    } else {
      // Instant reset to top on page change
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true });
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [pathname]);

  // Handle in-page anchor links with smooth scroll and 96px offset
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      let hash = '';
      if (href.startsWith('#')) {
        hash = href;
      } else if (href.includes('#')) {
        const [path, h] = href.split('#');
        const currentPath = window.location.pathname;
        if (path === currentPath || (path === '' && currentPath === '/')) {
          hash = '#' + h;
        }
      }

      if (hash && hash.length > 1) {
        const id = decodeURIComponent(hash.slice(1));
        const el = document.getElementById(id);
        if (el) {
          e.preventDefault();
          history.pushState(null, '', hash);
          const rect = el.getBoundingClientRect();
          const targetY = Math.max(0, rect.top + window.scrollY - 96);
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          const lenis = getLenis();

          if (lenis && !prefersReducedMotion) {
            lenis.scrollTo(targetY, { duration: 0.8 });
          } else {
            window.scrollTo({
              top: targetY,
              left: 0,
              behavior: prefersReducedMotion ? 'instant' : 'smooth',
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  // Manage --bottom-ui-offset for mobile sticky bar and cookie consent banner
  useEffect(() => {
    const updateOffset = () => {
      if (window.innerWidth >= 768) {
        document.documentElement.style.setProperty('--bottom-ui-offset', '92px');
        return;
      }

      const mobileBar = document.getElementById('mobile-sticky-bar');
      const cookieBanner = document.getElementById('cookie-consent-banner');

      const barHeight = mobileBar && mobileBar.offsetHeight > 0 ? mobileBar.offsetHeight : 56;
      const cookieHeight =
        cookieBanner && cookieBanner.offsetHeight > 0 && cookieBanner.offsetParent !== null
          ? cookieBanner.offsetHeight
          : 0;

      const totalOffset = barHeight + cookieHeight + 16;
      document.documentElement.style.setProperty('--bottom-ui-offset', `${totalOffset}px`);
    };

    updateOffset();

    const ro = new ResizeObserver(updateOffset);
    const mobileBar = document.getElementById('mobile-sticky-bar');
    const cookieBanner = document.getElementById('cookie-consent-banner');
    if (mobileBar) ro.observe(mobileBar);
    if (cookieBanner) ro.observe(cookieBanner);

    const mo = new MutationObserver(() => {
      updateOffset();
      const newCookie = document.getElementById('cookie-consent-banner');
      if (newCookie) ro.observe(newCookie);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('resize', updateOffset, { passive: true });
    window.addEventListener('gba_consent_updated', updateOffset);

    return () => {
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener('resize', updateOffset);
      window.removeEventListener('gba_consent_updated', updateOffset);
    };
  }, []);

  return null;
}

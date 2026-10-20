'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only check after mount to avoid hydration mismatch
    const consent = localStorage.getItem('gba_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('gba_cookie_consent', 'accepted');
    setIsOpen(false);
    window.dispatchEvent(new Event('gba_consent_updated'));
  };

  const handleReject = () => {
    localStorage.setItem('gba_cookie_consent', 'rejected');
    setIsOpen(false);
    window.dispatchEvent(new Event('gba_consent_updated'));
  };

  if (!isOpen) return null;

  return (
    <aside
      role="region"
      aria-label="Cookie consent banner"
      className="fixed bottom-[calc(56px+env(safe-area-inset-bottom,0px))] left-0 right-0 max-w-none rounded-none rounded-t-2xl border-x-0 border-b-0 md:bottom-8 md:left-8 md:right-auto md:max-w-sm md:rounded-2xl md:border z-50 glass border-t border-border-strong p-4 sm:p-5 shadow-2xl backdrop-blur-2xl no-print animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-green" />
        <span className="text-eyebrow text-text">Privacy & Analytics</span>
      </div>
      <p className="text-xs text-text-muted leading-relaxed mb-4">
        We use privacy-friendly analytics (GA4) to understand site usage and improve our services. We do not sell your data.
      </p>
      <div className="flex items-center gap-3">
        <Button size="sm" onClick={handleAccept} className="text-xs min-h-[44px] h-11 px-5 flex-1 sm:flex-initial">
          Accept
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleReject}
          className="text-xs min-h-[44px] h-11 px-5 text-text-muted hover:text-text flex-1 sm:flex-initial"
        >
          Decline
        </Button>
      </div>
    </aside>
  );
}

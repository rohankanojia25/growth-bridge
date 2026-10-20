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
      className="fixed bottom-20 md:bottom-8 left-4 md:left-8 z-50 max-w-sm glass border border-border-strong rounded-2xl p-5 shadow-2xl backdrop-blur-2xl no-print animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-green" />
        <span className="text-eyebrow text-text">Privacy & Analytics</span>
      </div>
      <p className="text-xs text-text-muted leading-relaxed mb-4">
        We use privacy-friendly analytics (GA4) to understand site usage and improve our services. We do not sell your data.
      </p>
      <div className="flex items-center gap-2.5">
        <Button size="sm" onClick={handleAccept} className="text-xs h-9 px-4">
          Accept
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleReject}
          className="text-xs h-9 px-4 text-text-muted hover:text-text"
        >
          Decline
        </Button>
      </div>
    </aside>
  );
}

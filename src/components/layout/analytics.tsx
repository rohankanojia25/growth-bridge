'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function Analytics() {
  const [hasConsent, setHasConsent] = useState(false);
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    const updateConsent = () => {
      const consent = localStorage.getItem('gba_cookie_consent');
      setHasConsent(consent === 'accepted');
    };

    updateConsent();
    window.addEventListener('gba_consent_updated', updateConsent);
    return () => window.removeEventListener('gba_consent_updated', updateConsent);
  }, []);

  if (!gaId || !hasConsent) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
              anonymize_ip: true
            });
          `,
        }}
      />
    </>
  );
}

export function trackAnalyticsEvent(
  eventName:
    | 'cta_click'
    | 'whatsapp_click'
    | 'call_click'
    | 'lead_submit'
    | 'booking_submit'
    | 'package_select',
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === 'undefined') return;
  const consent = localStorage.getItem('gba_cookie_consent');
  if (consent !== 'accepted') return;

  if (window.gtag) {
    window.gtag('event', eventName, params);
  }
}

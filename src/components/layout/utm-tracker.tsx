'use client';

import { useEffect } from 'react';

const UTM_STORAGE_KEY = 'gba_utm_data';

export interface UTMData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;
  landing_path?: string;
}

export function UTMTracker() {
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;

      const existing = sessionStorage.getItem(UTM_STORAGE_KEY);
      if (existing) return; // Keep initial touch

      const params = new URLSearchParams(window.location.search);
      const data: UTMData = {
        utm_source: params.get('utm_source') || undefined,
        utm_medium: params.get('utm_medium') || undefined,
        utm_campaign: params.get('utm_campaign') || undefined,
        utm_term: params.get('utm_term') || undefined,
        utm_content: params.get('utm_content') || undefined,
        referrer: document.referrer || undefined,
        landing_path: window.location.pathname,
      };

      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Storage unavailable
    }
  }, []);

  return null;
}

export function getStoredUTM(): UTMData {
  try {
    if (typeof window === 'undefined') return {};
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

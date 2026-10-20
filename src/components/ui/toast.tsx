'use client';

import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { Check } from 'lucide-react';

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, show, onClose, duration = 2000 }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  return (
    <div
      className={cn(
        'fixed bottom-20 left-1/2 z-50 -translate-x-1/2 transition-all duration-300',
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      )}
      role="status"
      aria-live="polite"
    >
      <div className="glass rounded-full px-4 py-2 flex items-center gap-2 text-sm text-text">
        <Check className="h-4 w-4 text-green" aria-hidden="true" />
        {message}
      </div>
    </div>
  );
}

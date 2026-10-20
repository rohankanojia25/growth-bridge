'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App runtime error:', error);
  }, [error]);

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center py-20 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div
        className="orb orb-violet top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px]"
        aria-hidden="true"
      />

      <Container className="relative z-10 text-center max-w-lg">
        <div className="text-eyebrow text-danger mb-4">Something went wrong</div>
        <h1 className="text-h2 mb-4">Unexpected Application Error</h1>
        <p className="text-body text-text-muted mb-8 mx-auto">
          We encountered an issue while rendering this page. Our technical team has been notified.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button onClick={() => reset()}>
            Try Again
          </Button>
          <Button href="/" variant="secondary">
            Return to Home
          </Button>
        </div>
      </Container>
    </div>
  );
}

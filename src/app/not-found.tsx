import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

export default function NotFound() {
  return (
    <div className="relative min-h-[75vh] flex items-center justify-center py-20 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div
        className="orb orb-green top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]"
        aria-hidden="true"
      />

      <Container className="relative z-10 text-center max-w-xl">
        <div className="font-mono text-8xl sm:text-9xl font-bold text-green tracking-tighter mb-4 select-none opacity-80">
          404
        </div>
        <h1 className="text-h2 mb-4">Page Not Found</h1>
        <p className="text-body text-text-muted mb-8 mx-auto">
          The page you are looking for does not exist, has been relocated, or is no longer available.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button href="/" showArrow>
            Return Home
          </Button>
          <Button href="/services" variant="secondary">
            Explore Services
          </Button>
          <Button href="/book-consultation" variant="secondary">
            Book Consultation
          </Button>
        </div>
      </Container>
    </div>
  );
}

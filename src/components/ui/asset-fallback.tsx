import { cn } from '@/lib/utils';

interface AssetFallbackProps {
  variant: 'mesh' | 'grid' | 'orbit' | 'arch';
  aspect?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AssetFallback({ variant, aspect, className, style }: AssetFallbackProps) {
  const aspectParts = aspect?.split(':').map(Number);
  const aspectRatio =
    aspectParts && aspectParts.length === 2
      ? `${aspectParts[0]}/${aspectParts[1]}`
      : aspect === 'auto'
      ? 'auto'
      : '16/10';

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-surface rounded-[20px] select-none',
        className
      )}
      style={{ aspectRatio, ...style }}
      aria-hidden="true"
      role="presentation"
    >
      {variant === 'mesh' && <MeshFallback />}
      {variant === 'grid' && <GridFallback />}
      {variant === 'orbit' && <OrbitFallback />}
      {variant === 'arch' && <ArchFallback />}
    </div>
  );
}

function MeshFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-75" />
      <div
        className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: 'rgba(25, 242, 140, 0.25)', filter: 'blur(70px)' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: 'rgba(123, 97, 255, 0.3)', filter: 'blur(70px)' }}
      />
      <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 600 400" preserveAspectRatio="none">
        <defs>
          <linearGradient id="fb-mesh-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#19F28C" />
            <stop offset="50%" stopColor="#3DD6F5" />
            <stop offset="100%" stopColor="#7B61FF" />
          </linearGradient>
        </defs>
        <path d="M0,200 C150,80 300,320 450,180 T600,200" stroke="url(#fb-mesh-grad)" strokeWidth="1.5" fill="none" />
        <path d="M0,240 C180,140 320,340 480,220 T600,240" stroke="url(#fb-mesh-grad)" strokeWidth="1" fill="none" opacity="0.6" />
        <path d="M0,160 C120,40 280,280 420,120 T600,160" stroke="url(#fb-mesh-grad)" strokeWidth="1" fill="none" opacity="0.6" />
      </svg>
      <div className="relative z-10 glass px-5 py-3 rounded-xl border border-white/10 flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-full bg-green animate-pulse" />
        <span className="font-mono text-xs uppercase tracking-widest text-text">Growth Bridge System</span>
      </div>
    </div>
  );
}

function GridFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-90" />
      <div
        className="absolute top-1/3 left-1/3 w-40 h-40 rounded-full pointer-events-none"
        style={{ background: 'rgba(61, 214, 245, 0.25)', filter: 'blur(60px)' }}
      />
      <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 500 400">
        <defs>
          <linearGradient id="fb-grid-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#19F28C" />
            <stop offset="50%" stopColor="#3DD6F5" />
            <stop offset="100%" stopColor="#7B61FF" />
          </linearGradient>
        </defs>
        <rect x="80" y="60" width="160" height="110" rx="12" stroke="url(#fb-grid-grad)" strokeWidth="1.5" fill="none" />
        <rect x="260" y="90" width="160" height="130" rx="12" stroke="url(#fb-grid-grad)" strokeWidth="1.5" fill="none" />
        <rect x="140" y="190" width="220" height="130" rx="12" stroke="url(#fb-grid-grad)" strokeWidth="1.5" fill="none" />
        <line x1="80" y1="115" x2="240" y2="115" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1="140" y1="240" x2="360" y2="240" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      </svg>
    </div>
  );
}

function OrbitFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div
        className="absolute w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'rgba(25, 242, 140, 0.15)', filter: 'blur(70px)' }}
      />
      <svg className="w-full h-full max-h-[360px] opacity-40" viewBox="0 0 400 400">
        <defs>
          <linearGradient id="fb-orbit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#19F28C" />
            <stop offset="100%" stopColor="#7B61FF" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="200" r="120" stroke="url(#fb-orbit-grad)" strokeWidth="1" strokeDasharray="4 4" fill="none" />
        <circle cx="200" cy="200" r="75" stroke="url(#fb-orbit-grad)" strokeWidth="1" fill="none" />
        <circle cx="200" cy="200" r="30" stroke="url(#fb-orbit-grad)" strokeWidth="1.5" fill="none" />
        <circle cx="200" cy="80" r="6" fill="#19F28C" />
        <circle cx="310" cy="240" r="5" fill="#7B61FF" />
        <circle cx="130" cy="220" r="4" fill="#3DD6F5" />
      </svg>
    </div>
  );
}

function ArchFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div
        className="absolute top-1/4 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: 'rgba(25, 242, 140, 0.2)', filter: 'blur(70px)' }}
      />
      <svg className="w-full h-full max-h-[360px] opacity-45" viewBox="0 0 400 320">
        <defs>
          <linearGradient id="fb-arch-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#19F28C" />
            <stop offset="45%" stopColor="#3DD6F5" />
            <stop offset="100%" stopColor="#7B61FF" />
          </linearGradient>
        </defs>
        <path
          d="M60,280 C60,280 100,70 200,70 C300,70 340,280 340,280"
          stroke="url(#fb-arch-grad)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M100,280 C100,280 130,120 200,120 C270,120 300,280 300,280"
          stroke="url(#fb-arch-grad)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />
        <circle cx="200" cy="70" r="7" fill="#19F28C" />
      </svg>
    </div>
  );
}

export function HeroAbstractCard() {
  return (
    <div className="relative w-full aspect-[16/10] flex items-center justify-center p-6 select-none overflow-hidden">
      {/* Background radial glow */}
      <div
        className="absolute w-72 h-72 rounded-full pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(25, 242, 140, 0.4) 0%, rgba(123, 97, 255, 0.2) 60%, transparent 100%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Card 1: Top Right (Strategy & Blueprint) */}
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 w-48 sm:w-56 glass rounded-2xl p-4 border border-white/10 shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-green" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-green">
            01. Diagnose
          </span>
        </div>
        <div className="font-display font-semibold text-xs text-text">
          Unified Growth Blueprint
        </div>
        <div className="w-full bg-surface rounded-full h-1.5 mt-2.5 overflow-hidden">
          <div className="bg-green h-full w-4/5 rounded-full" />
        </div>
      </div>

      {/* Card 2: Center (Bridge Arch Outline & Engine) */}
      <div className="relative z-10 w-64 sm:w-80 glass rounded-3xl p-6 border border-border-strong shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
          <span className="font-mono text-xs text-text-muted">Connected System</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-green bg-green/10 border border-green/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
            Active
          </span>
        </div>

        {/* Bridge Arch SVG Graphic */}
        <div className="h-28 flex items-center justify-center relative">
          <svg className="w-full h-full" viewBox="0 0 240 100" fill="none">
            <defs>
              <linearGradient id="hero-card-arch-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#19F28C" />
                <stop offset="50%" stopColor="#3DD6F5" />
                <stop offset="100%" stopColor="#7B61FF" />
              </linearGradient>
            </defs>
            {/* Outer Arch */}
            <path
              d="M20 90 C20 90 60 15 120 15 C180 15 220 90 220 90"
              stroke="url(#hero-card-arch-grad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Inner Bridge Chord */}
            <path
              d="M50 90 C50 90 80 40 120 40 C160 40 190 90 190 90"
              stroke="url(#hero-card-arch-grad)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="3 3"
              opacity="0.7"
            />
            {/* Nodes */}
            <circle cx="20" cy="90" r="4" fill="#19F28C" />
            <circle cx="120" cy="15" r="5" fill="#3DD6F5" />
            <circle cx="220" cy="90" r="4" fill="#7B61FF" />
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-border text-center">
          <div>
            <div className="font-mono text-[10px] text-text-dim uppercase">Strategy</div>
            <div className="font-display text-xs font-semibold text-text mt-0.5">Aligned</div>
          </div>
          <div>
            <div className="font-mono text-[10px] text-text-dim uppercase">Website</div>
            <div className="font-display text-xs font-semibold text-text mt-0.5">Built</div>
          </div>
          <div>
            <div className="font-mono text-[10px] text-text-dim uppercase">CRM</div>
            <div className="font-display text-xs font-semibold text-text mt-0.5">Synced</div>
          </div>
        </div>
      </div>

      {/* Card 3: Bottom Left (Operations Sync) */}
      <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 w-48 sm:w-56 glass rounded-2xl p-4 border border-white/10 shadow-xl transform -rotate-2 hover:rotate-0 transition-transform duration-300">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-cyan" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-cyan">
            03. Connect
          </span>
        </div>
        <div className="font-display font-semibold text-xs text-text">
          Lead Flow Automation
        </div>
        <div className="w-full bg-surface rounded-full h-1.5 mt-2.5 overflow-hidden">
          <div className="bg-cyan h-full w-3/4 rounded-full" />
        </div>
      </div>
    </div>
  );
}

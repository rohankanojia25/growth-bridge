import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function GrowthSystemDiagram() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center select-none">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {/* Stage 1: Plan */}
        <Link
          href="/services#plan"
          className="group relative p-6 rounded-2xl bg-surface border border-border hover:border-green/40 transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs text-green font-semibold">01</span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-text-dim">
                Stage 1
              </span>
            </div>
            <h3 className="font-display font-semibold text-lg text-text group-hover:text-green transition-colors">
              Plan
            </h3>
            <p className="text-xs text-text-muted mt-2 leading-relaxed">
              Idea validation, offer design, and clear growth strategy.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs text-text-dim group-hover:text-green">
            <span>Explore Plan</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Stage 2: Build */}
        <Link
          href="/services#build"
          className="group relative p-6 rounded-2xl bg-surface border border-border hover:border-cyan/40 transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs text-cyan font-semibold">02</span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-text-dim">
                Stage 2
              </span>
            </div>
            <h3 className="font-display font-semibold text-lg text-text group-hover:text-cyan transition-colors">
              Build
            </h3>
            <p className="text-xs text-text-muted mt-2 leading-relaxed">
              Business websites, high-converting landing pages, and branding.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs text-text-dim group-hover:text-cyan">
            <span>Explore Build</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Stage 3: Market */}
        <Link
          href="/services#market"
          className="group relative p-6 rounded-2xl bg-surface border border-border hover:border-violet/40 transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs text-violet font-semibold">03</span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-text-dim">
                Stage 3
              </span>
            </div>
            <h3 className="font-display font-semibold text-lg text-text group-hover:text-violet transition-colors">
              Market
            </h3>
            <p className="text-xs text-text-muted mt-2 leading-relaxed">
              SEO, local pack rankings, social media, ads, and lead generation.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs text-text-dim group-hover:text-violet">
            <span>Explore Market</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Stage 4: Retain (Grow) */}
        <Link
          href="/services#grow"
          className="group relative p-6 rounded-2xl bg-surface border border-border hover:border-green/40 transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs text-green font-semibold">04</span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-text-dim">
                Stage 4
              </span>
            </div>
            <h3 className="font-display font-semibold text-lg text-text group-hover:text-green transition-colors">
              Retain
            </h3>
            <p className="text-xs text-text-muted mt-2 leading-relaxed">
              CRM setup, fast follow-ups, and repeat customer retention.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs text-text-dim group-hover:text-green">
            <span>Explore Retain</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </div>

      {/* Caption per spec */}
      <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-xs font-mono text-green">
        <span className="w-1.5 h-1.5 rounded-full bg-green" />
        <span>Every stage feeds the next.</span>
      </div>
    </div>
  );
}

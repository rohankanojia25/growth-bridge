'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { TwoPathButtons } from '@/components/ui/two-path-buttons';
import { formatINR } from '@/lib/utils';
import { Check, ArrowRight } from 'lucide-react';

export interface PackageRecord {
  id: string;
  name: string;
  slug: string;
  category: string;
  short_description: string | null;
  price_inr: number | null;
  price_label: string | null;
  billing_period: string;
  features: string[];
  is_highlighted: boolean;
  sort_order: number;
}

interface PricingViewProps {
  packages: PackageRecord[];
}

export function PricingView({ packages }: PricingViewProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'one_time' | 'monthly'>('all');

  const filtered = packages.filter((pkg) => {
    if (activeTab === 'all') return true;
    return pkg.billing_period === activeTab;
  });

  if (packages.length === 0) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="rounded-3xl border-gradient bg-surface p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <span className="text-eyebrow text-green">Tailored Engagements</span>
          <h2 className="text-h2 text-2xl sm:text-3xl text-text">
            Custom Pricing
          </h2>
          <p className="text-body text-base text-text-muted leading-relaxed">
            Plans are built around your goals. Share your idea or your business and get a clear quote in writing.
          </p>
          <div className="pt-2 flex justify-center">
            <TwoPathButtons size="lg" location="pricing_empty_state" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Period Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex items-center p-1.5 rounded-full bg-surface border border-border">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-green text-[#04110A] shadow-md'
                : 'text-text-muted hover:text-text'
            }`}
          >
            All Plans
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('one_time')}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'one_time'
                ? 'bg-green text-[#04110A] shadow-md'
                : 'text-text-muted hover:text-text'
            }`}
          >
            One-time
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('monthly')}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'monthly'
                ? 'bg-green text-[#04110A] shadow-md'
                : 'text-text-muted hover:text-text'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((pkg) => (
          <Card
            key={pkg.id}
            spotlight
            gradient={pkg.is_highlighted}
            className="flex flex-col justify-between p-8"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-eyebrow text-green uppercase text-xs">
                  {pkg.category}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-surface-hover border border-border text-text-dim">
                  {pkg.billing_period === 'monthly' ? 'Monthly' : 'One-time'}
                </span>
              </div>

              <div>
                <h3 className="text-h3 text-2xl text-text mb-2">{pkg.name}</h3>
                {pkg.short_description && (
                  <p className="text-body text-xs text-text-muted leading-relaxed">
                    {pkg.short_description}
                  </p>
                )}
              </div>

              {/* Price display */}
              <div className="pt-4 border-t border-border">
                <span className="text-xs text-text-dim block mb-1">Starting from</span>
                <div className="font-display font-bold text-3xl text-text">
                  {pkg.price_inr ? formatINR(pkg.price_inr) : (pkg.price_label || 'Custom')}
                  {pkg.billing_period === 'monthly' && (
                    <span className="text-sm font-normal text-text-dim"> /month</span>
                  )}
                </div>
              </div>

              {/* Feature list */}
              {Array.isArray(pkg.features) && pkg.features.length > 0 && (
                <ul className="space-y-2.5 text-xs text-text-muted">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-green shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="pt-6 border-t border-border mt-8">
              <Link
                href={`/get-started?package=${pkg.slug}`}
                className="inline-flex items-center justify-center gap-2 w-full h-12 rounded-full bg-green text-[#04110A] font-semibold text-xs hover:shadow-[0_0_24px_rgba(25,242,140,0.35)] transition-all"
              >
                <span>Get this package</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

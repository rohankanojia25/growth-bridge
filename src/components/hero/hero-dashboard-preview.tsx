'use client';

import { TrendingUp, ArrowUpRight, Globe, Users, Megaphone, Zap, ShieldCheck, Wifi, Battery } from 'lucide-react';

export function HeroDashboardPreview() {
  return (
    <div className="relative w-full max-w-[480px] sm:max-w-[540px] lg:max-w-[700px] xl:max-w-[760px] 2xl:max-w-[820px] mx-auto select-none pt-1 pb-2">
      {/* ─── Ambient Emerald / Cyan Glow (Monevi style) ─── */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(25,242,140,0.18)_0%,rgba(61,214,245,0.08)_42%,transparent_72%)] blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* ─── Floating Top Card: Welcome & Mobile App Overview ─── */}
      <div className="relative z-10 ml-auto w-[92%] sm:w-[86%] rounded-2xl bg-[#090F11]/90 backdrop-blur-2xl border border-white/[0.09] p-3.5 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-all duration-300 hover:border-white/20">
        {/* iOS-Style Status Bar Header */}
        <div className="flex items-center justify-between pb-2.5 text-[11px] text-white/50 border-b border-white/[0.06]">
          <span className="font-mono font-medium tracking-tight text-white/70">9:41</span>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-white/60" />
            <Battery className="w-4 h-4 text-white/70" />
          </div>
        </div>

        {/* Welcome & User Greeting */}
        <div className="pt-2.5 pb-2.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-green font-mono font-medium">Growth Bridge Platform</div>
            <h3 className="text-sm sm:text-lg font-semibold text-white tracking-tight">Welcome</h3>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-white/70 bg-white/[0.05] border border-white/10 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
            Live Sync
          </span>
        </div>

        {/* Two Mini Stat Tiles (Income & Inquiries) */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 pt-0.5">
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-2.5 sm:p-3 transition-colors hover:bg-white/[0.05]">
            <div className="text-[10px] sm:text-[11px] text-text-dim font-medium">Income / Pipeline</div>
            <div className="text-xs sm:text-base font-bold text-white tracking-tight mt-0.5">₹22,760.23</div>
            <div className="text-[9px] sm:text-[10px] text-green font-medium mt-1 flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> +18.4% MoM
            </div>
          </div>

          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-2.5 sm:p-3 transition-colors hover:bg-white/[0.05]">
            <div className="text-[10px] sm:text-[11px] text-text-dim font-medium">Expense / Ad Spend</div>
            <div className="text-xs sm:text-base font-bold text-white tracking-tight mt-0.5">₹12,760.23</div>
            <div className="text-[9px] sm:text-[10px] text-cyan font-medium mt-1 flex items-center gap-0.5">
              <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Optimized ROAS
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Front Card: Real-Time Growth Analytics & Vector Spline Chart ─── */}
      <div className="relative z-20 -mt-8 sm:-mt-12 mr-auto w-[98%] sm:w-[92%] rounded-2xl bg-[#070D0F]/95 backdrop-blur-2xl border border-white/[0.12] p-4 sm:p-6 shadow-[0_30px_70px_rgba(0,0,0,0.9)] transition-all duration-300 hover:border-green/30 overflow-hidden">
        {/* Card Header: Main KPI Balance & Action Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 sm:pb-4 border-b border-white/[0.06]">
          <div>
            <div className="text-[11px] sm:text-xs text-text-muted font-medium">Active Business Revenue</div>
            <div className="flex items-baseline gap-2 mt-0.5 sm:mt-1">
              <span className="text-xl sm:text-3xl font-display font-bold text-white tracking-tight">₹30,113.80</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-green/15 border border-green/30 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-green">
                <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> +2.76%
              </span>
            </div>
          </div>

          {/* Quick Filter Tabs (Monevi style) */}
          <div className="flex items-center gap-1 self-start sm:self-auto bg-white/[0.04] p-1 rounded-xl border border-white/[0.08] text-[11px] sm:text-xs">
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-green/20 text-green font-medium border border-green/30">All</span>
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-white/60 hover:text-white transition-colors">Web</span>
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-white/60 hover:text-white transition-colors">CRM</span>
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-white/60 hover:text-white transition-colors">Leads</span>
          </div>
        </div>

        {/* Vector Area Spline Chart with Glowing Emerald/Cyan Gradient */}
        <div className="relative pt-3 sm:pt-4 pb-1 sm:pb-2">
          <svg
            viewBox="0 0 460 140"
            className="w-full h-auto overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="monevi-area-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#19F28C" stopOpacity="0.32" />
                <stop offset="60%" stopColor="#3DD6F5" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#070D0F" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="monevi-line-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#19F28C" />
                <stop offset="50%" stopColor="#3DD6F5" />
                <stop offset="100%" stopColor="#19F28C" />
              </linearGradient>

              <filter id="glow-line" x="-10%" y="-20%" width="120%" height="150%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#19F28C" floodOpacity="0.45" />
              </filter>
            </defs>

            {/* Horizontal Grid Guidelines */}
            <line x1="0" y1="20" x2="460" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
            <line x1="0" y1="60" x2="460" y2="60" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
            <line x1="0" y1="100" x2="460" y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

            {/* Gradient Area Fill under Curve */}
            <path
              d="M0,85 C50,82 85,95 125,60 C165,25 210,90 260,70 C310,50 355,80 400,35 C430,6 445,45 460,50 L460,140 L0,140 Z"
              fill="url(#monevi-area-grad)"
            />

            {/* Glowing Spline Curve */}
            <path
              d="M0,85 C50,82 85,95 125,60 C165,25 210,90 260,70 C310,50 355,80 400,35 C430,6 445,45 460,50"
              stroke="url(#monevi-line-grad)"
              strokeWidth="2.75"
              strokeLinecap="round"
              filter="url(#glow-line)"
            />

            {/* Glowing Peak Data Points */}
            <circle cx="125" cy="60" r="4.5" fill="#19F28C" className="drop-shadow-[0_0_8px_#19F28C]" />
            <circle cx="260" cy="70" r="4.5" fill="#3DD6F5" className="drop-shadow-[0_0_8px_#3DD6F5]" />
            <circle cx="400" cy="35" r="5" fill="#19F28C" className="drop-shadow-[0_0_10px_#19F28C]" />
          </svg>

          {/* Time Marker Labels (Monevi style) */}
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-text-dim font-mono pt-1.5 sm:pt-2">
            <span>10:00</span>
            <span>12:00</span>
            <span>14:00</span>
            <span>16:00</span>
            <span>18:00</span>
          </div>
        </div>

        {/* ─── Desktop Asset / Channel Rows (Visible on lg+) ─── */}
        <div className="hidden lg:block pt-3 border-t border-white/[0.06] space-y-2">
          {/* Row 1: Website */}
          <div className="flex items-center justify-between py-1.5 px-2 rounded-xl hover:bg-white/[0.03] transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-cyan/15 border border-cyan/30 flex items-center justify-center text-cyan shrink-0">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Modern Website</div>
                <div className="text-[10px] text-text-dim">Fast · Mobile · SEO Ready</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono font-medium text-white">99.4%</div>
              <div className="text-[10px] text-green font-medium">+3.75% speed</div>
            </div>
          </div>

          {/* Row 2: CRM */}
          <div className="flex items-center justify-between py-1.5 px-2 rounded-xl hover:bg-white/[0.03] transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-green/15 border border-green/30 flex items-center justify-center text-green shrink-0">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">CRM Lead Pipeline</div>
                <div className="text-[10px] text-text-dim">Automated Follow-ups</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono font-medium text-white">48 Deals</div>
              <div className="text-[10px] text-green font-medium">+2.05% close</div>
            </div>
          </div>

          {/* Row 3: Marketing */}
          <div className="flex items-center justify-between py-1.5 px-2 rounded-xl hover:bg-white/[0.03] transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-violet/15 border border-violet/30 flex items-center justify-center text-violet shrink-0">
                <Megaphone className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Full Stack Marketing</div>
                <div className="text-[10px] text-text-dim">Targeted Delhi NCR Ads</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono font-medium text-white">₹1,270.10</div>
              <div className="text-[10px] text-green font-medium">4.8x ROAS</div>
            </div>
          </div>
        </div>

        {/* ─── Mobile Service Highlights Overlay: 3-column horizontal row directly overlaid on the lower graphic ─── */}
        <div className="lg:hidden relative mt-1 pt-3 pb-1 border-t border-white/[0.08] bg-gradient-to-t from-[#070D0F] via-[#070D0F]/90 to-transparent">
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 text-center">
            {/* Highlight 1 */}
            <div className="flex flex-col items-center px-1">
              <div className="w-6 h-6 rounded-lg bg-cyan/15 border border-cyan/30 flex items-center justify-center text-cyan mb-1 shrink-0">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <div className="font-semibold text-text text-[10.5px] sm:text-xs leading-tight">
                Modern Websites
              </div>
              <div className="text-text-dim text-[9px] sm:text-[10px] leading-tight mt-0.5">
                Fast. Mobile. SEO Ready.
              </div>
            </div>

            {/* Highlight 2 */}
            <div className="flex flex-col items-center px-1">
              <div className="w-6 h-6 rounded-lg bg-green/15 border border-green/30 flex items-center justify-center text-green mb-1 shrink-0">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div className="font-semibold text-text text-[10.5px] sm:text-xs leading-tight">
                CRM Systems
              </div>
              <div className="text-text-dim text-[9px] sm:text-[10px] leading-tight mt-0.5">
                Keep Your Customers.
              </div>
            </div>

            {/* Highlight 3 */}
            <div className="flex flex-col items-center px-1">
              <div className="w-6 h-6 rounded-lg bg-green/15 border border-green/30 flex items-center justify-center text-green mb-1 shrink-0">
                <Megaphone className="w-3.5 h-3.5" />
              </div>
              <div className="font-semibold text-text text-[10.5px] sm:text-xs leading-tight">
                Full Stack Marketing
              </div>
              <div className="text-text-dim text-[9px] sm:text-[10px] leading-tight mt-0.5">
                Strategy to Sales.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Floating Subtle Micro-Badges (Desktop only) ─── */}
      <div className="hidden lg:flex absolute -bottom-2 -left-2 z-30 items-center gap-2 rounded-full glass border border-white/10 px-3.5 py-1.5 text-xs text-white/90 shadow-xl">
        <Zap className="w-3.5 h-3.5 text-green" />
        <span className="font-medium">Business Growth +24%</span>
      </div>
    </div>
  );
}

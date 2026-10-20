'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown, Compass, Globe, Megaphone, Users } from 'lucide-react';

interface HeaderProps {
  hasCaseStudies?: boolean;
  hasPricing?: boolean;
}

const SERVICE_SECTIONS = [
  { label: '01. Plan', href: '/services#plan', desc: 'Strategy, idea validation, and business planning', icon: Compass },
  { label: '02. Build', href: '/services#build', desc: 'Websites, landing pages, and branding presence', icon: Globe },
  { label: '03. Market', href: '/services#market', desc: 'SEO, social media, paid ads, and lead generation', icon: Megaphone },
  { label: '04. Retain (Grow)', href: '/services#grow', desc: 'CRM setup, follow-ups, and repeat customer retention', icon: Users },
];

export function Header({ hasCaseStudies = false, hasPricing = false }: HeaderProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setIsDropdownOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const isActive = useCallback(
    (href: string) => {
      if (href === '/') return pathname === '/';
      return pathname.startsWith(href);
    },
    [pathname]
  );

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
  };

  // Build nav links based on published state
  const navItems = [
    { label: 'Services', href: '/services', hasDropdown: true },
    ...(hasPricing ? [{ label: 'Pricing', href: '/pricing', hasDropdown: false }] : []),
    ...(hasCaseStudies ? [{ label: 'Case Studies', href: '/case-studies', hasDropdown: false }] : []),
    { label: 'About', href: '/about', hasDropdown: false },
    { label: 'Contact', href: '/contact', hasDropdown: false },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-300',
        isScrolled
          ? 'glass border-b border-border shadow-lg shadow-black/20'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-6 max-[640px]:px-4">
        {/* Left: Logo */}
        <Logo variant="full" height={32} />

        {/* Center: Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {navItems.map((item) => {
            const active = isActive(item.href);

            if (item.hasDropdown) {
              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      className={cn(
                        'relative px-3.5 py-2 text-sm font-body font-medium transition-colors rounded-lg flex items-center gap-1.5',
                        active ? 'text-text' : 'text-text-muted hover:text-text'
                      )}
                      aria-expanded={isDropdownOpen}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={cn(
                          'h-3.5 w-3.5 transition-transform duration-200',
                          isDropdownOpen && 'rotate-180 text-green'
                        )}
                        aria-hidden="true"
                      />
                      {active && (
                        <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-green rounded-full" />
                      )}
                    </Link>
                  </div>

                  {/* Dropdown Menu */}
                  <div
                    className={cn(
                      'absolute top-full left-0 pt-2 transition-all duration-200 w-80',
                      isDropdownOpen
                        ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                        : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                    )}
                  >
                    <div className="rounded-2xl glass border border-border p-3 shadow-2xl space-y-1">
                      <div className="px-3 py-1.5 text-eyebrow text-text-dim">
                        Our 4 Growth Stages
                      </div>

                      {SERVICE_SECTIONS.map((stage) => {
                        const Icon = stage.icon;
                        return (
                          <Link
                            key={stage.href}
                            href={stage.href}
                            className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.04] text-text-muted hover:text-text group"
                          >
                            <div className="font-display font-medium text-sm text-text flex items-center gap-2 group-hover:text-green">
                              <Icon className="w-4 h-4 text-green" />
                              <span>{stage.label}</span>
                            </div>
                            <div className="text-xs text-text-dim mt-0.5 line-clamp-1">
                              {stage.desc}
                            </div>
                          </Link>
                        );
                      })}

                      <div className="pt-2 border-t border-border mt-2">
                        <Link
                          href="/services"
                          className="block text-center py-1 text-xs font-semibold text-green hover:underline"
                        >
                          View Full Services Page →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative px-3.5 py-2 text-sm font-body font-medium transition-colors rounded-lg',
                  active ? 'text-text' : 'text-text-muted hover:text-text'
                )}
              >
                <span>{item.label}</span>
                {active && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-green rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: CTA Button ("Get started") */}
        <div className="hidden lg:flex items-center">
          <Button href="/get-started" size="sm" showArrow>
            Get started
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="lg:hidden flex items-center justify-center w-11 h-11 rounded-xl text-text hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-green/25"
          aria-label={isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileOpen}
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer (Below 1024px) */}
      <div
        className={cn(
          'fixed inset-0 top-[72px] z-40 lg:hidden transition-all duration-300',
          isMobileOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            'absolute inset-0 bg-bg/80 backdrop-blur-md transition-opacity duration-300',
            isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          )}
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />

        {/* Content Pane */}
        <nav
          className={cn(
            'relative h-[calc(100vh-72px)] glass border-r border-border overflow-y-auto p-6 flex flex-col justify-between transition-transform duration-300 max-w-[340px] w-full',
            isMobileOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none'
          )}
          aria-label="Mobile navigation links"
        >
          <div className="space-y-4">
            <div className="text-eyebrow text-text-dim px-2">Navigation</div>
            <div className="space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center justify-between px-3 py-2.5 rounded-xl font-display text-lg font-medium transition-colors',
                      active ? 'text-green bg-green/10' : 'text-text hover:bg-white/[0.04]'
                    )}
                  >
                    <span>{item.label}</span>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-green" />}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <Button href="/get-started" className="w-full" showArrow>
              Get started
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}

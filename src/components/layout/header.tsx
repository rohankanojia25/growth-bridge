'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn, SERVICES } from '@/lib/utils';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Services', href: '/services', hasDropdown: true },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function Header() {
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
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);

            if (item.hasDropdown) {
              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'relative flex items-center gap-1.5 px-3.5 min-h-[44px] flex items-center text-sm font-body font-medium transition-colors rounded-lg group',
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

                  {/* Dropdown Menu */}
                  <div
                    className={cn(
                      'absolute top-full left-0 pt-2 transition-all duration-200',
                      isDropdownOpen
                        ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                        : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                    )}
                  >
                    <div className="w-[360px] rounded-2xl glass border border-border-strong p-3 shadow-2xl backdrop-blur-2xl">
                      <div className="px-3 py-2 border-b border-border mb-2">
                        <Link
                          href="/services"
                          className="text-xs font-mono uppercase tracking-wider text-green hover:underline flex items-center justify-between"
                        >
                          <span>Explore All 4 Services</span>
                          <span>→</span>
                        </Link>
                      </div>
                      <div className="space-y-1">
                        {SERVICES.map((service) => (
                          <Link
                            key={service.key}
                            href={`/services/${service.slug}`}
                            className={cn(
                              'block rounded-xl px-3 py-2.5 transition-colors',
                              pathname === `/services/${service.slug}`
                                ? 'bg-surface-hover text-text'
                                : 'hover:bg-white/[0.04] text-text-muted hover:text-text'
                            )}
                          >
                            <div className="font-display font-medium text-sm text-text">
                              {service.title}
                            </div>
                            <div className="text-xs text-text-dim mt-0.5 line-clamp-1">
                              {service.shortDescription}
                            </div>
                          </Link>
                        ))}
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
                  'relative px-3.5 min-h-[44px] flex items-center text-sm font-body font-medium transition-colors rounded-lg',
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

        {/* Right: CTA Button */}
        <div className="hidden lg:flex items-center">
          <Button href="/book-consultation" size="sm" showArrow>
            Book Free Consultation
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
            'relative h-[calc(100dvh-72px)] glass border-r border-border overflow-y-auto p-6 flex flex-col justify-between transition-transform duration-300 max-w-[340px] w-full',
            isMobileOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none'
          )}
          aria-label="Mobile navigation links"
        >
          <div className="space-y-4">
            <div className="text-eyebrow text-text-dim px-2">Navigation</div>
            <div className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <div key={item.href} className="space-y-1">
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center justify-between px-3 min-h-[44px] flex items-center justify-between rounded-xl font-display text-lg font-medium transition-colors',
                        active ? 'text-green bg-green/10' : 'text-text hover:bg-white/[0.04]'
                      )}
                    >
                      <span>{item.label}</span>
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-green" />}
                    </Link>

                    {item.hasDropdown && (
                      <div className="pl-4 space-y-1 border-l border-border ml-3 my-1">
                        {SERVICES.map((service) => (
                          <Link
                            key={service.key}
                            href={`/services/${service.slug}`}
                            className={cn(
                              'flex items-center px-3 min-h-[44px] text-sm transition-colors rounded-lg',
                              pathname === `/services/${service.slug}`
                                ? 'text-green font-medium'
                                : 'text-text-muted hover:text-text'
                            )}
                          >
                            {service.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-border mt-6">
            <Button href="/book-consultation" className="w-full" showArrow>
              Book Free Consultation
            </Button>
            <p className="text-center text-xs text-text-dim mt-3">
              Delhi NCR · Across India
            </p>
          </div>
        </nav>
      </div>
    </header>
  );
}

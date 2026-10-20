import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'default' | 'sm' | 'lg';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  showArrow?: boolean;
  loading?: boolean;
}

type ButtonAsButton = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: never;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    href: string;
    external?: boolean;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-green text-[#04110A] font-semibold hover:glow-green hover:shadow-[0_0_48px_rgba(25,242,140,0.28)] active:scale-[0.97]',
  secondary:
    'bg-transparent border border-border-strong text-text hover:bg-white/[0.06] active:scale-[0.97]',
  ghost:
    'bg-transparent text-text-muted hover:text-text hover:bg-white/[0.04]',
};

const sizes: Record<ButtonSize, string> = {
  default: 'h-12 px-6 text-[15px]',
  sm: 'h-9 px-4 text-sm',
  lg: 'h-14 px-8 text-base',
};

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(props, ref) {
    const {
      variant = 'primary',
      size = 'default',
      showArrow = false,
      loading = false,
      className,
      children,
      ...rest
    } = props;

    const baseClasses = cn(
      'inline-flex items-center justify-center gap-2 rounded-full font-body font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-green/25 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:pointer-events-none select-none whitespace-nowrap',
      variants[variant],
      sizes[size],
      className
    );

    const content = (
      <>
        {loading && (
          <svg
            className="animate-spin -ml-1 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
        {showArrow && (
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        )}
      </>
    );

    if ('href' in rest && rest.href) {
      const { href, external, ...linkRest } = rest as ButtonAsLink & { external?: boolean };
      if (external) {
        return (
          <a
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={href}
            className={cn(baseClasses, 'group')}
            target="_blank"
            rel="noopener noreferrer"
            {...linkRest}
          >
            {content}
          </a>
        );
      }
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={cn(baseClasses, 'group')}
          {...(linkRest as Omit<typeof linkRest, 'href'>)}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={cn(baseClasses, 'group')}
        disabled={loading || (rest as ButtonAsButton).disabled}
        {...(rest as ButtonAsButton)}
      >
        {content}
      </button>
    );
  }
);

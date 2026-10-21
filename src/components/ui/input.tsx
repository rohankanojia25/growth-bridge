import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  inputSize?: 'default' | 'compact';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, className, id, inputSize = 'default', ...props }, ref) {
    const isCompact = inputSize === 'compact';
    return (
      <div className={isCompact ? 'space-y-1' : 'space-y-1.5'}>
        {label && (
          <label
            htmlFor={id}
            className={cn('block font-medium font-body text-text', isCompact ? 'text-[13px]' : 'text-sm')}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            isCompact ? 'h-11 min-h-[44px]' : 'h-[52px]',
            'w-full rounded-xl bg-bg-raised border border-border px-3.5 text-text placeholder:text-text-dim font-body text-base transition-all duration-200',
            'focus:outline-none focus:border-green focus:ring-[3px] focus:ring-green/25',
            error && 'border-danger focus:border-danger focus:ring-danger/25',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${id}-error`} className="text-sm text-danger font-body" role="alert" aria-live="polite">
            {error}
          </p>
        )}
      </div>
    );
  }
);

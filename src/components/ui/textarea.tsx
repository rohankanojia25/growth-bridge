import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, className, id, ...props }, ref) {
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium font-body text-text"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            'min-h-[120px] w-full rounded-xl bg-bg-raised border border-border px-4 py-3 text-text placeholder:text-text-dim font-body text-[15px] transition-all duration-200 resize-y',
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

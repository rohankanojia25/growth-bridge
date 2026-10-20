import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  options: readonly SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ label, error, options, placeholder, className, id, ...props }, ref) {
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
        <select
          ref={ref}
          id={id}
          className={cn(
            'h-[52px] w-full rounded-xl bg-bg-raised border border-border px-4 text-text font-body text-[15px] transition-all duration-200 appearance-none',
            'focus:outline-none focus:border-green focus:ring-[3px] focus:ring-green/25',
            'bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7285%22%20stroke-width%3D%222%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E")] bg-[length:16px] bg-[right_16px_center] bg-no-repeat',
            error && 'border-danger focus:border-danger focus:ring-danger/25',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${id}-error`} className="text-sm text-danger font-body" role="alert" aria-live="polite">
            {error}
          </p>
        )}
      </div>
    );
  }
);

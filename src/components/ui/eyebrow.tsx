import { cn } from '@/lib/utils';

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
  pill?: boolean;
}

export function Eyebrow({ children, className, pill = false }: EyebrowProps) {
  if (pill) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-eyebrow',
          className
        )}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
        </span>
        {children}
      </span>
    );
  }

  return <span className={cn('text-eyebrow', className)}>{children}</span>;
}

import { cn } from '@/lib/utils';

interface MarqueeProps {
  items: string[];
  className?: string;
}

export function Marquee({ items, className }: MarqueeProps) {
  const duplicated = [...items, ...items];

  return (
    <div
      className={cn(
        'relative overflow-hidden py-6 border-y border-border group',
        className
      )}
      aria-hidden="true"
    >
      <div
        className="flex gap-8 whitespace-nowrap animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused]"
        style={{ width: 'max-content' }}
      >
        {duplicated.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-3 text-text-dim font-display text-lg font-medium"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-green/40" aria-hidden="true" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

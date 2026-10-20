'use client';

import { cn } from '@/lib/utils';
import { useRef, useCallback } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  spotlight?: boolean;
  gradient?: boolean;
  as?: React.ElementType;
  href?: string;
}

export function Card({
  children,
  className,
  spotlight = true,
  gradient = false,
  as: Component = 'div',
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!cardRef.current || window.matchMedia('(pointer: coarse)').matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--my', `${e.clientY - rect.top}px`);
  }, []);

  return (
    <Component
      ref={cardRef}
      onPointerMove={spotlight ? handlePointerMove : undefined}
      className={cn(
        'relative rounded-[20px] bg-surface border border-border p-7 transition-all duration-250',
        'hover:border-border-strong hover:-translate-y-0.5',
        spotlight && 'spotlight',
        gradient && 'border-gradient',
        className
      )}
    >
      {children}
    </Component>
  );
}

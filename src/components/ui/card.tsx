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
  const rafId = useRef<number | null>(null);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const { offsetX, offsetY } = e.nativeEvent;

    if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.setProperty('--mx', `${offsetX}px`);
        cardRef.current.style.setProperty('--my', `${offsetY}px`);
      }
    });
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

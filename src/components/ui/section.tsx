import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  raised?: boolean;
}

export function Section({ children, className, id, raised = false }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative py-14 sm:py-18 md:py-20 lg:py-28 overflow-clip',
        raised ? 'bg-bg-raised' : 'bg-bg',
        id && 'scroll-mt-24',
        className
      )}
    >
      {children}
    </section>
  );
}

import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function Container({ children, className, as: Component = 'div' }: ContainerProps) {
  return (
    <Component className={cn('mx-auto w-full max-w-[1200px] px-6 max-[640px]:px-4', className)}>
      {children}
    </Component>
  );
}

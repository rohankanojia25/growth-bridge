import { cn } from '@/lib/utils';
import { Eyebrow } from './eyebrow';
import { GradientText } from './gradient-text';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  gradientWord?: string;
  description?: string;
  className?: string;
  centered?: boolean;
}

export function SectionHeader({
  eyebrow,
  title,
  gradientWord,
  description,
  className,
  centered = false,
}: SectionHeaderProps) {
  const renderTitle = () => {
    if (!gradientWord) return title;
    const parts = title.split(gradientWord);
    return (
      <>
        {parts[0]}
        <GradientText>{gradientWord}</GradientText>
        {parts[1] || ''}
      </>
    );
  };

  return (
    <div className={cn('max-w-[720px] mb-12', centered && 'mx-auto text-center', className)}>
      {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
      <h2 className="text-h2 mb-4">{renderTitle()}</h2>
      {description && (
        <p className="text-body text-text-muted">{description}</p>
      )}
    </div>
  );
}

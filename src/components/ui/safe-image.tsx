'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  wrapperClassName?: string;
}

export function SafeImage({ wrapperClassName, alt, ...props }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return null;
  }

  return (
    <Image
      {...props}
      alt={alt}
      onError={() => setHasError(true)}
    />
  );
}

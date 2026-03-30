'use client';

import * as React from 'react';

import { StarsBackground } from '@/components/animate-ui/components/backgrounds/stars';
import { cn } from '@/lib/utils';

export const StarsBackgroundDemo = () => {
  // Prefer system color-scheme for star color (next-themes isn't installed here).
  const [isDark, setIsDark] = React.useState(true);

  React.useEffect(() => {
    const mql = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mql) return;

    const update = () => setIsDark(mql.matches);
    update();

    // Safari uses addListener/removeListener.
    if ('addEventListener' in mql) {
      mql.addEventListener('change', update);
      return () => mql.removeEventListener('change', update);
    }

    // @ts-expect-error - legacy API fallback for older browsers.
    mql.addListener(update);
    // @ts-expect-error - legacy API fallback for older browsers.
    return () => mql.removeListener(update);
  }, []);

  return (
    <StarsBackground
      starColor={isDark ? '#FFF' : '#000'}
      pointerEvents={false}
      className={cn('absolute inset-0 z-0 pointer-events-none')}
    />
  );
};


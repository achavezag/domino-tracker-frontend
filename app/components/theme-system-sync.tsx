'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/lib/store/theme-store';

export default function ThemeSystemSync() {
  const setSystemTheme = useThemeStore((s) => s.setSystemTheme);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, [setSystemTheme]);

  return null;
}

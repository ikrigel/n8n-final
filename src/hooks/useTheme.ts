'use client';

import { useConfig } from '@/contexts/ConfigContext';

/**
 * Hook to manage theme (light/dark/auto)
 * Provides theme state and setter function
 */
export function useTheme() {
  const { config, updateConfig } = useConfig();

  const setTheme = (theme: 'light' | 'dark' | 'auto') => {
    updateConfig({ theme });
  };

  const currentTheme = config.theme;

  return {
    theme: currentTheme,
    setTheme,
  };
}

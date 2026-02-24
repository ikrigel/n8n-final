'use client';

import React from 'react';
import { useTheme } from '@/hooks/useTheme';

/**
 * Theme toggle button with sun/moon/auto icons
 */
export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = ['light', 'dark', 'auto', 'time'] as const;

  const icons = {
    light: '☀️',
    dark: '🌙',
    auto: '🔄',
    time: '🌅',
  };

  const handleClick = () => {
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      title={`Theme: ${theme}`}
      aria-label={`Change theme (currently ${theme})`}
    >
      <span className="text-xl">{icons[theme]}</span>
    </button>
  );
}

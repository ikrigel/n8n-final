'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppConfig } from '@/types';
import { saveConfig, loadConfig } from '@/lib/localStorage';

interface ConfigContextType {
  config: AppConfig;
  updateConfig: (partial: Partial<AppConfig>) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  // Initialize with default, hydrate after mount to prevent SSR mismatch
  const [config, setConfig] = useState<AppConfig>(() => ({
    env: 'production',
    loggingEnabled: true,
    logLevel: 'info',
    sendLogsAsJson: false,
    theme: 'auto',
  }));
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    const loaded = loadConfig();
    setConfig(loaded);
    setMounted(true);
  }, []);

  // Update config and persist to localStorage
  const updateConfig = (partial: Partial<AppConfig>) => {
    setConfig((prev) => {
      const updated = { ...prev, ...partial };
      saveConfig(updated);
      return updated;
    });
  };

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;

    let effectiveTheme = config.theme;
    if (config.theme === 'auto') {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      effectiveTheme = prefersDark ? 'dark' : 'light';
    }

    // Apply to document root
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [config.theme, mounted]);

  if (!mounted) {
    // Return null or placeholder to avoid hydration mismatch
    return null;
  }

  return (
    <ConfigContext.Provider value={{ config, updateConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider');
  }
  return context;
}

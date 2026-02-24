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
    sidebarPosition: 'left',
    sidebarCollapsed: false,
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

  // Calculate time-based brightness (0.0 = midnight, 1.0 = noon, 0.0 = midnight)
  const getTimeBrightness = () => {
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const timeDecimal = hour + minutes / 60;
    return timeDecimal < 12 ? timeDecimal / 12 : (24 - timeDecimal) / 12;
  };

  // Apply time-based theme updates every 60 seconds
  useEffect(() => {
    if (!mounted || config.theme !== 'time') return;

    const updateTimeTheme = () => {
      const brightness = getTimeBrightness();
      document.documentElement.style.setProperty('--time-brightness', String(Math.max(0, Math.min(1, brightness))));

      // Toggle dark class based on brightness (dark when < 0.5)
      const isDarkTime = brightness < 0.5;
      if (isDarkTime) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    // Update immediately
    updateTimeTheme();

    // Update every 60 seconds
    const interval = setInterval(updateTimeTheme, 60000);
    return () => clearInterval(interval);
  }, [config.theme, mounted]);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;
    if (config.theme === 'time') return; // Time theme handled by separate effect

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

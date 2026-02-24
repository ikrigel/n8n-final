// Browser localStorage utilities for persisting app state
import { AppConfig, LogEntry, GalleryItem } from '@/types';

// Default configuration
const DEFAULT_CONFIG: AppConfig = {
  env: 'production',
  loggingEnabled: true,
  logLevel: 'info',
  sendLogsAsJson: false,
  theme: 'auto',
  sidebarPosition: 'left',
  sidebarCollapsed: false,
};

/**
 * Save app configuration to localStorage
 * @param config - Configuration to save
 */
export function saveConfig(config: Partial<AppConfig>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('app_config', JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save config to localStorage:', err);
  }
}

/**
 * Load app configuration from localStorage with defaults
 * @returns Merged config (defaults + saved)
 */
export function loadConfig(): AppConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;

  try {
    const saved = localStorage.getItem('app_config');
    if (!saved) return DEFAULT_CONFIG;
    return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
  } catch (err) {
    console.error('Failed to load config from localStorage:', err);
    return DEFAULT_CONFIG;
  }
}

/**
 * Save gallery cache (local copy of items from Supabase)
 * @param items - Gallery items to cache
 */
export function saveGalleryCache(items: GalleryItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('gallery_cache', JSON.stringify(items));
    localStorage.setItem('gallery_cache_updated_at', new Date().toISOString());
  } catch (err) {
    console.error('Failed to save gallery cache:', err);
  }
}

/**
 * Load gallery cache from localStorage
 * @returns Cached gallery items or empty array
 */
export function loadGalleryCache(): GalleryItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const cached = localStorage.getItem('gallery_cache');
    return cached ? JSON.parse(cached) : [];
  } catch (err) {
    console.error('Failed to load gallery cache:', err);
    return [];
  }
}

/**
 * Save logs to localStorage
 * @param logs - Log entries to save
 */
export function saveLogs(logs: LogEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('app_logs', JSON.stringify(logs));
  } catch (err) {
    console.error('Failed to save logs to localStorage:', err);
  }
}

/**
 * Load logs from localStorage
 * @returns Previously saved logs or empty array
 */
export function loadLogs(): LogEntry[] {
  if (typeof window === 'undefined') return [];

  try {
    const saved = localStorage.getItem('app_logs');
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.error('Failed to load logs from localStorage:', err);
    return [];
  }
}

/**
 * Save theme preference
 * @param theme - Theme to save (light, dark, auto)
 */
export function saveTheme(theme: 'light' | 'dark' | 'auto'): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('app_theme', theme);
  } catch (err) {
    console.error('Failed to save theme:', err);
  }
}

/**
 * Load theme preference
 * @returns Saved theme or default 'auto'
 */
export function loadTheme(): 'light' | 'dark' | 'auto' {
  if (typeof window === 'undefined') return 'auto';

  try {
    return (localStorage.getItem('app_theme') as any) || 'auto';
  } catch (err) {
    console.error('Failed to load theme:', err);
    return 'auto';
  }
}

/**
 * Clear all app data from localStorage
 */
export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('app_config');
    localStorage.removeItem('gallery_cache');
    localStorage.removeItem('app_logs');
    localStorage.removeItem('app_theme');
  } catch (err) {
    console.error('Failed to clear localStorage:', err);
  }
}

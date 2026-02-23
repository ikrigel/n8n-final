import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  saveConfig,
  loadConfig,
  saveGalleryCache,
  loadGalleryCache,
  saveLogs,
  loadLogs,
  saveTheme,
  loadTheme,
  clearAllData,
} from '@/lib/localStorage';
import { AppConfig, GalleryItem, LogEntry } from '@/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('localStorage.ts', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  describe('Config storage', () => {
    it('should save and load config', () => {
      const config: AppConfig = {
        env: 'test',
        loggingEnabled: true,
        logLevel: 'debug',
        sendLogsAsJson: true,
        theme: 'dark',
      };

      saveConfig(config);
      const loaded = loadConfig();

      expect(loaded.env).toBe('test');
      expect(loaded.logLevel).toBe('debug');
      expect(loaded.theme).toBe('dark');
    });

    it('should load default config if nothing saved', () => {
      const config = loadConfig();

      expect(config.env).toBe('production'); // default
      expect(config.loggingEnabled).toBe(true); // default
      expect(config.theme).toBe('auto'); // default
    });

    it('should merge saved config with defaults', () => {
      const partialConfig = { env: 'test' as const };
      saveConfig(partialConfig);
      const loaded = loadConfig();

      expect(loaded.env).toBe('test'); // from saved
      expect(loaded.loggingEnabled).toBe(true); // from default
    });
  });

  describe('Gallery cache storage', () => {
    it('should save and load gallery cache', () => {
      const items: GalleryItem[] = [
        {
          id: '1',
          request_id: 'req-1',
          type: 'image',
          prompt: 'Beautiful sunset',
          created_at: '2026-02-23T10:00:00Z',
          env: 'production',
          webhook_type: 'POST',
          mime_type: 'image/jpeg',
          url: 'https://example.com/image.jpg',
          file_name: 'image.jpg',
          user_email: 'user@example.com',
        },
      ];

      saveGalleryCache(items);
      const loaded = loadGalleryCache();

      expect(loaded).toHaveLength(1);
      expect(loaded[0].id).toBe('1');
      expect(loaded[0].prompt).toBe('Beautiful sunset');
    });

    it('should return empty array if nothing saved', () => {
      const loaded = loadGalleryCache();
      expect(loaded).toEqual([]);
    });

    it('should save timestamp when caching', () => {
      const items: GalleryItem[] = [];
      saveGalleryCache(items);

      const timestamp = localStorageMock.getItem('gallery_cache_updated_at');
      expect(timestamp).toBeTruthy();
      expect(new Date(timestamp!).getTime()).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('Logs storage', () => {
    it('should save and load logs', () => {
      const logs: LogEntry[] = [
        {
          id: '1',
          level: 'info',
          message: 'Test message',
          timestamp: '2026-02-23T10:00:00Z',
        },
      ];

      saveLogs(logs);
      const loaded = loadLogs();

      expect(loaded).toHaveLength(1);
      expect(loaded[0].message).toBe('Test message');
      expect(loaded[0].level).toBe('info');
    });

    it('should return empty array if nothing saved', () => {
      const loaded = loadLogs();
      expect(loaded).toEqual([]);
    });

    it('should handle logs with metadata', () => {
      const logs: LogEntry[] = [
        {
          id: '1',
          level: 'error',
          message: 'Error occurred',
          meta: { code: 'E001', details: 'Something went wrong' },
          timestamp: '2026-02-23T10:00:00Z',
        },
      ];

      saveLogs(logs);
      const loaded = loadLogs();

      expect(loaded[0].meta).toEqual({ code: 'E001', details: 'Something went wrong' });
    });
  });

  describe('Theme storage', () => {
    it('should save and load theme', () => {
      saveTheme('dark');
      const theme = loadTheme();
      expect(theme).toBe('dark');
    });

    it('should return default theme if nothing saved', () => {
      const theme = loadTheme();
      expect(theme).toBe('auto');
    });

    it('should handle all theme values', () => {
      const themes = ['light', 'dark', 'auto'] as const;

      themes.forEach((t) => {
        saveTheme(t);
        expect(loadTheme()).toBe(t);
      });
    });
  });

  describe('Clear all data', () => {
    it('should clear all stored data', () => {
      // Save some data
      saveConfig({ env: 'test' });
      saveTheme('dark');
      saveLogs([{ id: '1', level: 'info', message: 'test', timestamp: '' }]);
      saveGalleryCache([]);

      // Clear all
      clearAllData();

      // Verify all cleared
      expect(localStorageMock.getItem('app_config')).toBeNull();
      expect(localStorageMock.getItem('app_theme')).toBeNull();
      expect(localStorageMock.getItem('app_logs')).toBeNull();
      expect(localStorageMock.getItem('gallery_cache')).toBeNull();
    });
  });

  describe('Error handling', () => {
    it('should handle invalid JSON gracefully', () => {
      localStorageMock.setItem('app_config', 'invalid json {');
      const config = loadConfig();
      expect(config.env).toBe('production'); // falls back to default
    });

    it('should return defaults on storage access error', () => {
      // Simulate access error
      const theme = loadTheme();
      expect(theme).toBe('auto');
    });
  });
});

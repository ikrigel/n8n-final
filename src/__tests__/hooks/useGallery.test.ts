import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGallery } from '@/hooks/useGallery';
import { GalleryItem } from '@/types';

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

describe('useGallery', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.useFakeTimers();
    vi.advanceTimersByTime(100); // Simulate mount
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with empty items', () => {
    const { result } = renderHook(() => useGallery());

    expect(result.current.items).toEqual([]);
  });

  it('should add items to gallery', () => {
    const { result } = renderHook(() => useGallery());

    const item: GalleryItem = {
      id: '1',
      request_id: 'req-1',
      type: 'image',
      prompt: 'Test image',
      created_at: '2026-02-23T10:00:00Z',
      env: 'test',
      webhook_type: 'POST',
      mime_type: 'image/jpeg',
      url: 'https://example.com/image.jpg',
      file_name: 'image.jpg',
      user_email: 'user@example.com',
    };

    act(() => {
      result.current.addItem(item);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('1');
  });

  it('should filter items by type', () => {
    const { result } = renderHook(() => useGallery());

    const imageItem: GalleryItem = {
      id: '1',
      request_id: 'req-1',
      type: 'image',
      prompt: 'Test',
      created_at: '2026-02-23T10:00:00Z',
      env: 'test',
      webhook_type: 'POST',
      mime_type: 'image/jpeg',
      url: 'https://example.com/image.jpg',
      file_name: 'image.jpg',
      user_email: 'user@example.com',
    };

    const videoItem: GalleryItem = {
      id: '2',
      request_id: 'req-2',
      type: 'video',
      prompt: 'Test',
      created_at: '2026-02-23T11:00:00Z',
      env: 'test',
      webhook_type: 'POST',
      mime_type: 'video/mp4',
      url: 'https://example.com/video.mp4',
      file_name: 'video.mp4',
      user_email: 'user@example.com',
    };

    act(() => {
      result.current.addItem(imageItem);
      result.current.addItem(videoItem);
    });

    const filtered = result.current.filterItems({ type: 'image' });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('1');
  });

  it('should filter items by environment', () => {
    const { result } = renderHook(() => useGallery());

    const testItem: GalleryItem = {
      id: '1',
      request_id: 'req-1',
      type: 'image',
      prompt: 'Test',
      created_at: '2026-02-23T10:00:00Z',
      env: 'test',
      webhook_type: 'POST',
      mime_type: 'image/jpeg',
      url: 'https://example.com/image.jpg',
      file_name: 'image.jpg',
      user_email: 'user@example.com',
    };

    const prodItem: GalleryItem = {
      id: '2',
      request_id: 'req-2',
      type: 'image',
      prompt: 'Test',
      created_at: '2026-02-23T11:00:00Z',
      env: 'production',
      webhook_type: 'POST',
      mime_type: 'image/jpeg',
      url: 'https://example.com/image2.jpg',
      file_name: 'image2.jpg',
      user_email: 'user@example.com',
    };

    act(() => {
      result.current.addItem(testItem);
      result.current.addItem(prodItem);
    });

    const filtered = result.current.filterItems({ env: 'production' });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].env).toBe('production');
  });

  it('should search by prompt text', () => {
    const { result } = renderHook(() => useGallery());

    const item1: GalleryItem = {
      id: '1',
      request_id: 'req-1',
      type: 'image',
      prompt: 'Beautiful sunset landscape',
      created_at: '2026-02-23T10:00:00Z',
      env: 'test',
      webhook_type: 'POST',
      mime_type: 'image/jpeg',
      url: 'https://example.com/image.jpg',
      file_name: 'image.jpg',
      user_email: 'user@example.com',
    };

    const item2: GalleryItem = {
      id: '2',
      request_id: 'req-2',
      type: 'image',
      prompt: 'Mountain vista',
      created_at: '2026-02-23T11:00:00Z',
      env: 'test',
      webhook_type: 'POST',
      mime_type: 'image/jpeg',
      url: 'https://example.com/image2.jpg',
      file_name: 'image2.jpg',
      user_email: 'user@example.com',
    };

    act(() => {
      result.current.addItem(item1);
      result.current.addItem(item2);
    });

    const filtered = result.current.filterItems({ searchText: 'sunset' });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].prompt).toContain('sunset');
  });

  it('should get recent items', () => {
    const { result } = renderHook(() => useGallery());

    // Add 5 items
    for (let i = 0; i < 5; i++) {
      const item: GalleryItem = {
        id: String(i),
        request_id: `req-${i}`,
        type: 'image',
        prompt: 'Test',
        created_at: new Date(Date.now() - i * 1000).toISOString(),
        env: 'test',
        webhook_type: 'POST',
        mime_type: 'image/jpeg',
        url: 'https://example.com/image.jpg',
        file_name: 'image.jpg',
        user_email: 'user@example.com',
      };
      act(() => {
        result.current.addItem(item);
      });
    }

    const recent = result.current.getRecentItems(3);
    expect(recent).toHaveLength(3);
    expect(recent[0].id).toBe('0'); // Most recent first
  });

  it('should get gallery statistics', () => {
    const { result } = renderHook(() => useGallery());

    const items = [
      {
        id: '1',
        type: 'image' as const,
        env: 'test' as const,
      },
      {
        id: '2',
        type: 'video' as const,
        env: 'test' as const,
      },
      {
        id: '3',
        type: 'image' as const,
        env: 'production' as const,
      },
    ];

    items.forEach((item) => {
      act(() => {
        result.current.addItem({
          ...item,
          request_id: `req-${item.id}`,
          prompt: 'Test',
          created_at: '2026-02-23T10:00:00Z',
          webhook_type: 'POST',
          mime_type: 'image/jpeg',
          url: 'https://example.com/file',
          file_name: 'file',
          user_email: 'user@example.com',
        });
      });
    });

    const stats = result.current.getStats();
    expect(stats.total).toBe(3);
    expect(stats.images).toBe(2);
    expect(stats.videos).toBe(1);
    expect(stats.test).toBe(2);
    expect(stats.production).toBe(1);
  });

  it('should persist to localStorage', () => {
    const { result } = renderHook(() => useGallery());

    const item: GalleryItem = {
      id: '1',
      request_id: 'req-1',
      type: 'image',
      prompt: 'Test',
      created_at: '2026-02-23T10:00:00Z',
      env: 'test',
      webhook_type: 'POST',
      mime_type: 'image/jpeg',
      url: 'https://example.com/image.jpg',
      file_name: 'image.jpg',
      user_email: 'user@example.com',
    };

    act(() => {
      result.current.addItem(item);
    });

    // Wait for state update
    vi.advanceTimersByTime(100);

    const stored = localStorageMock.getItem('gallery_cache');
    expect(stored).toBeTruthy();
    expect(stored).toContain('image.jpg');
  });

  it('should remove items', () => {
    const { result } = renderHook(() => useGallery());

    const item: GalleryItem = {
      id: '1',
      request_id: 'req-1',
      type: 'image',
      prompt: 'Test',
      created_at: '2026-02-23T10:00:00Z',
      env: 'test',
      webhook_type: 'POST',
      mime_type: 'image/jpeg',
      url: 'https://example.com/image.jpg',
      file_name: 'image.jpg',
      user_email: 'user@example.com',
    };

    act(() => {
      result.current.addItem(item);
    });

    expect(result.current.items).toHaveLength(1);

    act(() => {
      result.current.removeItem('1');
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('should clear all items', () => {
    const { result } = renderHook(() => useGallery());

    for (let i = 0; i < 3; i++) {
      act(() => {
        result.current.addItem({
          id: String(i),
          request_id: `req-${i}`,
          type: 'image',
          prompt: 'Test',
          created_at: '2026-02-23T10:00:00Z',
          env: 'test',
          webhook_type: 'POST',
          mime_type: 'image/jpeg',
          url: 'https://example.com/image.jpg',
          file_name: 'image.jpg',
          user_email: 'user@example.com',
        });
      });
    }

    expect(result.current.items).toHaveLength(3);

    act(() => {
      result.current.clearAll();
    });

    expect(result.current.items).toHaveLength(0);
  });
});

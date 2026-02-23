'use client';

import { useEffect, useState, useCallback } from 'react';
import { GalleryItem } from '@/types';
import { saveGalleryCache, loadGalleryCache } from '@/lib/localStorage';

interface GalleryFilters {
  type?: 'image' | 'video';
  env?: 'test' | 'production';
  dateFrom?: string;
  dateTo?: string;
  searchText?: string;
}

/**
 * Hook to manage gallery state with localStorage persistence
 */
export function useGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const cached = loadGalleryCache();
    setItems(cached);
    setMounted(true);
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (mounted) {
      saveGalleryCache(items);
    }
  }, [items, mounted]);

  // Add a new gallery item
  const addItem = useCallback((item: GalleryItem) => {
    setItems((prev) => [item, ...prev]);
  }, []);

  // Remove item by ID
  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Filter gallery items based on criteria
  const filterItems = useCallback((filters: GalleryFilters): GalleryItem[] => {
    let filtered = items;

    // Filter by type
    if (filters.type) {
      filtered = filtered.filter((item) => item.type === filters.type);
    }

    // Filter by environment
    if (filters.env) {
      filtered = filtered.filter((item) => item.env === filters.env);
    }

    // Filter by date range
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom).getTime();
      filtered = filtered.filter(
        (item) => new Date(item.created_at).getTime() >= fromDate
      );
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo).getTime();
      filtered = filtered.filter(
        (item) => new Date(item.created_at).getTime() <= toDate
      );
    }

    // Search text in prompt
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter((item) =>
        (item.prompt || '').toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [items]);

  // Get recent items (last N, sorted by created_at descending)
  const getRecentItems = useCallback((count: number = 5): GalleryItem[] => {
    return [...items].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(0, count);
  }, [items]);

  // Get statistics
  const getStats = useCallback(() => {
    return {
      total: items.length,
      images: items.filter((i) => i.type === 'image').length,
      videos: items.filter((i) => i.type === 'video').length,
      test: items.filter((i) => i.env === 'test').length,
      production: items.filter((i) => i.env === 'production').length,
    };
  }, [items]);

  // Clear all items
  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  if (!mounted) {
    return {
      items: [],
      addItem,
      removeItem,
      filterItems,
      getRecentItems,
      getStats,
      clearAll,
    };
  }

  return {
    items,
    addItem,
    removeItem,
    filterItems,
    getRecentItems,
    getStats,
    clearAll,
  };
}

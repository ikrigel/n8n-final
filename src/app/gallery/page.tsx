'use client';

import React, { useState, useCallback } from 'react';
import { useGallery } from '@/hooks/useGallery';
import { useLogger } from '@/hooks/useLogger';
import GalleryFilters from '@/components/gallery/GalleryFilters';
import GalleryGrid from '@/components/gallery/GalleryGrid';
import GalleryPreviewModal from '@/components/gallery/GalleryPreviewModal';
import { GalleryItem } from '@/types';

type MediaType = 'all' | 'image' | 'video';
type EnvType = 'all' | 'test' | 'production';

/**
 * Gallery page - view, filter, and manage generated media
 */
export default function GalleryPage() {
  const { items, getStats } = useGallery();
  const { logInfo } = useLogger();

  // Filter state
  const [mediaType, setMediaType] = useState<MediaType>('all');
  const [environment, setEnvironment] = useState<EnvType>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchText, setSearchText] = useState('');
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);

  // Apply filters
  const filteredItems = useCallback((): GalleryItem[] => {
    let filtered = items;

    if (mediaType !== 'all') {
      filtered = filtered.filter((item) => item.type === mediaType);
    }

    if (environment !== 'all') {
      filtered = filtered.filter((item) => item.env === environment);
    }

    if (dateFrom) {
      const fromTime = new Date(dateFrom).getTime();
      filtered = filtered.filter(
        (item) => new Date(item.created_at).getTime() >= fromTime
      );
    }

    if (dateTo) {
      const toTime = new Date(dateTo).getTime();
      filtered = filtered.filter(
        (item) => new Date(item.created_at).getTime() <= toTime
      );
    }

    if (searchText) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter((item) =>
        (item.prompt || '').toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [items, mediaType, environment, dateFrom, dateTo, searchText]);

  const filtered = filteredItems();
  const stats = getStats();

  // Handle download
  const handleDownload = (item: GalleryItem) => {
    if (!item.url) return;

    const link = document.createElement('a');
    link.href = item.url;
    link.download = item.file_name || `download.${item.type}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logInfo('Downloaded media', { fileName: item.file_name });
  };

  // Handle copy URL
  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      logInfo('URL copied to clipboard');
    } catch (err) {
      logInfo('Failed to copy URL');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 bg-clip-text text-transparent">
          🖼️ Gallery
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-medium">
          Browse and manage your generated images and videos
        </p>
      </div>

      {/* Statistics */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.total}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Items</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.images}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Images</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.videos}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Videos</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.test}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Test Items</p>
          </div>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <GalleryFilters
            currentType={mediaType}
            onTypeChange={setMediaType}
            currentEnv={environment}
            onEnvChange={setEnvironment}
            currentDateFrom={dateFrom}
            onDateFromChange={setDateFrom}
            currentDateTo={dateTo}
            onDateToChange={setDateTo}
            currentSearch={searchText}
            onSearchChange={setSearchText}
          />
        </div>

        {/* Gallery Grid */}
        <div className="lg:col-span-3">
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filtered.length} of {items.length} items
            </p>
          </div>

          <GalleryGrid
            items={filtered}
            onPreviewItem={setPreviewItem}
            onDownloadItem={handleDownload}
            onCopyUrl={handleCopyUrl}
            isEmpty={filtered.length === 0}
          />
        </div>
      </div>

      {/* Preview Modal */}
      <GalleryPreviewModal item={previewItem} onClose={() => setPreviewItem(null)} />
    </div>
  );
}

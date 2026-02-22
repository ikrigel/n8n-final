'use client';

import React from 'react';
import { GalleryItem } from '@/types';
import GalleryItemCard from './GalleryItemCard';

interface GalleryGridProps {
  items: GalleryItem[];
  onPreviewItem: (item: GalleryItem) => void;
  onDownloadItem: (item: GalleryItem) => void;
  onCopyUrl: (url: string) => void;
  isEmpty: boolean;
}

/**
 * Gallery grid display
 */
export default function GalleryGrid({
  items,
  onPreviewItem,
  onDownloadItem,
  onCopyUrl,
  isEmpty,
}: GalleryGridProps) {
  if (isEmpty) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-xl font-bold mb-2">No items found</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Adjust your filters or generate some content to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <GalleryItemCard
          key={item.id}
          item={item}
          onPreview={() => onPreviewItem(item)}
          onDownload={() => onDownloadItem(item)}
          onCopyUrl={() => {
            if (item.url) {
              onCopyUrl(item.url);
            }
          }}
        />
      ))}
    </div>
  );
}

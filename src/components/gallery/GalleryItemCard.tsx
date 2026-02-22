'use client';

import React from 'react';
import { GalleryItem } from '@/types';

interface GalleryItemCardProps {
  item: GalleryItem;
  onPreview: () => void;
  onDownload: () => void;
  onCopyUrl: () => void;
}

/**
 * Gallery item card component
 */
export default function GalleryItemCard({
  item,
  onPreview,
  onDownload,
  onCopyUrl,
}: GalleryItemCardProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Thumbnail */}
      <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative overflow-hidden group">
        {item.type === 'image' && item.url ? (
          <img
            src={item.url}
            alt={item.prompt || 'Gallery item'}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
            loading="lazy"
          />
        ) : item.type === 'video' && item.url ? (
          <video
            src={item.url}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <span className="text-4xl">
              {item.type === 'image' ? '🖼️' : '🎬'}
            </span>
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute top-2 left-2">
          <span className="badge">
            {item.type === 'image' ? '🖼️ Image' : '🎬 Video'}
          </span>
        </div>

        {/* Preview Button Overlay */}
        <button
          onClick={onPreview}
          className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
          title="Preview"
        >
          <span className="text-3xl">👁️</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Metadata */}
        <div className="flex gap-2 flex-wrap">
          <span className="badge-warning text-xs">{item.env}</span>
          <span className="badge text-xs">{item.webhook_type}</span>
        </div>

        {/* Prompt */}
        <p className="text-sm text-gray-700 dark:text-gray-300 truncate-lines">
          {item.prompt || 'No prompt'}
        </p>

        {/* Timestamp */}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(item.created_at).toLocaleDateString()} at{' '}
          {new Date(item.created_at).toLocaleTimeString()}
        </p>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onPreview}
            className="btn-small flex-1 text-xs"
            title="Preview item"
          >
            👁️ Preview
          </button>
          <button
            onClick={onDownload}
            className="btn-small flex-1 text-xs"
            title="Download item"
          >
            ⬇️ Download
          </button>
          <button
            onClick={onCopyUrl}
            disabled={!item.url}
            className="btn-small flex-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            title={item.url ? 'Copy URL' : 'URL not available'}
          >
            📋 Copy
          </button>
        </div>
      </div>
    </div>
  );
}

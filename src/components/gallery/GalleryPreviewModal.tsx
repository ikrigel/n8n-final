'use client';

import React, { useEffect } from 'react';
import { GalleryItem } from '@/types';

interface GalleryPreviewModalProps {
  item: GalleryItem | null;
  onClose: () => void;
}

/**
 * Full-screen gallery preview modal
 */
export default function GalleryPreviewModal({
  item,
  onClose,
}: GalleryPreviewModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (item) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full max-h-[90vh] bg-gray-900 rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors"
          title="Close (ESC)"
        >
          ✕
        </button>

        {/* Media Display */}
        <div className="flex items-center justify-center bg-black h-full">
          {item.type === 'image' && item.url ? (
            <img
              src={item.url}
              alt={item.prompt || 'Preview'}
              className="max-w-full max-h-full object-contain"
            />
          ) : item.type === 'video' && item.url ? (
            <video
              src={item.url}
              controls
              autoPlay
              className="max-w-full max-h-full"
            />
          ) : (
            <div className="text-white text-center">
              <div className="text-6xl mb-4">
                {item.type === 'image' ? '🖼️' : '🎬'}
              </div>
              <p>No preview available</p>
            </div>
          )}
        </div>

        {/* Details Panel */}
        <div className="bg-gray-800 text-white p-6 space-y-4 border-t border-gray-700 max-h-64 overflow-y-auto">
          <div>
            <h3 className="font-bold mb-2">Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Type</p>
                <p className="font-medium">{item.type}</p>
              </div>
              <div>
                <p className="text-gray-400">Environment</p>
                <p className="font-medium">{item.env}</p>
              </div>
              <div>
                <p className="text-gray-400">Webhook Type</p>
                <p className="font-medium">{item.webhook_type}</p>
              </div>
              <div>
                <p className="text-gray-400">Created</p>
                <p className="font-medium">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {item.prompt && (
            <div>
              <p className="text-gray-400 text-sm mb-1">Prompt</p>
              <p className="text-sm">{item.prompt}</p>
            </div>
          )}

          {item.url && (
            <div>
              <p className="text-gray-400 text-sm mb-1">URL</p>
              <input
                type="text"
                readOnly
                value={item.url}
                className="w-full bg-gray-700 px-2 py-1 rounded text-xs truncate"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

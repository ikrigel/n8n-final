'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  loadGalleryIndex,
  deleteGalleryItem,
  downloadGalleryItem,
  copyPublicUrl,
  saveToGoogleDrive,
  getStorageStats,
  GalleryItemMetadata,
} from '@/lib/gallery';

type MediaType = 'all' | 'image' | 'video';
type EnvType = 'all' | 'test' | 'production';

/**
 * Gallery Page - View, manage, and export generated images
 * Files stored on Supabase Storage (100MB free tier)
 * Metadata cached in localStorage for fast access
 */
export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItemMetadata[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItemMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [storageStats, setStorageStats] = useState<any>(null);

  // Filters
  const [mediaType, setMediaType] = useState<MediaType>('all');
  const [environment, setEnvironment] = useState<EnvType>('all');
  const [searchText, setSearchText] = useState('');
  const [viewSize, setViewSize] = useState<'compact' | 'normal' | 'large'>('normal');

  // Load gallery on mount
  useEffect(() => {
    loadGallery();
    loadStats();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = items;

    if (mediaType !== 'all') {
      filtered = filtered.filter((item) => item.type === mediaType);
    }

    if (environment !== 'all') {
      filtered = filtered.filter((item) => item.env === environment);
    }

    if (searchText.trim()) {
      const query = searchText.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.prompt.toLowerCase().includes(query) ||
          item.fileName.toLowerCase().includes(query)
      );
    }

    setFilteredItems(filtered);
  }, [items, mediaType, environment, searchText]);

  async function loadGallery() {
    try {
      setLoading(true);
      const galleryItems = loadGalleryIndex();
      setItems(galleryItems);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessage({ type: 'error', text: `Failed to load gallery: ${msg}` });
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    try {
      const stats = await getStorageStats();
      if (stats.success) {
        setStorageStats(stats);
      }
    } catch (err) {
      console.error('Failed to load storage stats:', err);
    }
  }

  async function handleDelete(item: GalleryItemMetadata) {
    if (!confirm(`Delete "${item.prompt.substring(0, 50)}"?\n\nThis cannot be undone.`)) {
      return;
    }

    try {
      const result = await deleteGalleryItem(item);
      if (result.success) {
        setItems(items.filter((i) => i.id !== item.id));
        setMessage({ type: 'success', text: '✅ Image deleted' });
        setTimeout(() => loadStats(), 500);
      } else {
        setMessage({ type: 'error', text: `❌ Delete failed: ${result.error}` });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessage({ type: 'error', text: `❌ Error: ${msg}` });
    }
  }

  async function handleDownload(item: GalleryItemMetadata) {
    try {
      const result = await downloadGalleryItem(item);
      if (result.success) {
        setMessage({ type: 'success', text: '✅ Download started' });
      } else {
        setMessage({ type: 'error', text: `❌ Download failed: ${result.error}` });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessage({ type: 'error', text: `❌ Error: ${msg}` });
    }
  }

  async function handleCopyUrl(item: GalleryItemMetadata) {
    try {
      const result = await copyPublicUrl(item.publicUrl);
      if (result.success) {
        setMessage({ type: 'success', text: '✅ URL copied to clipboard' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: `❌ Copy failed: ${result.error}` });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessage({ type: 'error', text: `❌ Error: ${msg}` });
    }
  }

  function handleSaveToGoogleDrive(item: GalleryItemMetadata) {
    saveToGoogleDrive(item);
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 mb-6 font-semibold"
          >
            ← Back to Dashboard
          </Link>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 bg-clip-text text-transparent mb-4">
            🎨 Gallery
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            View and manage your generated images
          </p>

          {storageStats && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                  📊 Storage Usage
                </span>
                <span className="text-xs text-blue-700 dark:text-blue-400">
                  {storageStats.usedMB?.toFixed(2)} MB / {storageStats.limitMB} MB
                  ({storageStats.percentUsed?.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all"
                  style={{
                    width: `${Math.min(storageStats.percentUsed || 0, 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg border-l-4 font-semibold mb-6 ${
              message.type === 'success'
                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border-emerald-400'
                : 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200 border-rose-400'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="mb-8 grid md:grid-cols-3 gap-4 card p-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              🔍 Search
            </label>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search prompts..."
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              📁 Type
            </label>
            <select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value as any)}
              className="input-field w-full"
            >
              <option value="all">All Files</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              🌍 Environment
            </label>
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value as any)}
              className="input-field w-full"
            >
              <option value="all">All</option>
              <option value="test">Test</option>
              <option value="production">Production</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading gallery...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 card p-8">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              {items.length === 0 ? '🎨 No images yet' : '🔍 No results found'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
              {items.length === 0
                ? 'Generate some images to see them here!'
                : 'Try adjusting your filters.'}
            </p>
            {items.length === 0 && (
              <Link
                href="/generate/image"
                className="inline-block px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors"
              >
                🎨 Generate First Image
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Gallery ({filteredItems.length})</h2>
              <div className="flex gap-2">
                {['compact', 'normal', 'large'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setViewSize(size as 'compact' | 'normal' | 'large')}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                      viewSize === size
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50'
                    }`}
                  >
                    {size === 'compact' ? '⚙️ Compact' : size === 'normal' ? '📐 Normal' : '🖼️ Large'}
                  </button>
                ))}
              </div>
            </div>
            <div className={`grid ${
              viewSize === 'compact' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6' :
              viewSize === 'normal' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' :
              'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3'
            } gap-4`}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700"
              >
                <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  <a
                    href={item.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                  >
                    <img
                      src={item.publicUrl}
                      alt={item.prompt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </a>

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => setSelectedItemId(item.id)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg"
                      title="View details"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => handleDownload(item)}
                      className="p-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-lg"
                      title="Download"
                    >
                      ⬇️
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-lg"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="p-3">
                  <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate mb-1">
                    {item.prompt.substring(0, 40)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-1 mb-2">
                    <span className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2 py-1 rounded">
                      {item.env}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyUrl(item)}
                    className="text-xs text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    📋 Copy URL
                  </button>
                </div>
              </div>
            ))}
            </div>
          </>
        )}

        {selectedItemId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            {filteredItems.find((item) => item.id === selectedItemId) && (
              <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {(() => {
                  const item = filteredItems.find((i) => i.id === selectedItemId)!;
                  return (
                    <div>
                      <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-700 overflow-hidden">
                        <img
                          src={item.publicUrl}
                          alt={item.prompt}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="p-6 space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          Details
                        </h2>

                        <div>
                          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Prompt
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {item.prompt}
                          </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Created
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {new Date(item.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Size
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {(item.fileSizeBytes / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                          <a
                            href={item.publicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-center text-sm"
                          >
                            👁️ Open
                          </a>
                          <button
                            onClick={() => handleDownload(item)}
                            className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors text-sm"
                          >
                            ⬇️ Download
                          </button>
                          <button
                            onClick={() => handleCopyUrl(item)}
                            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors text-sm"
                          >
                            📋 Copy
                          </button>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => handleSaveToGoogleDrive(item)}
                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors text-sm"
                          >
                            📁 Google Drive
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors text-sm"
                          >
                            🗑️ Delete
                          </button>
                        </div>

                        <button
                          onClick={() => setSelectedItemId(null)}
                          className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-lg transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

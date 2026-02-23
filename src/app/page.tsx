'use client';

import React from 'react';
import Link from 'next/link';
import { useConfig } from '@/contexts/ConfigContext';
import { useGallery } from '@/hooks/useGallery';
import LogsPanel from '@/components/logs/LogsPanel';

/**
 * Dashboard / Home page
 * Launch pad for all major features with recent activity overview
 */
export default function DashboardPage() {
  const { config } = useConfig();
  const { getRecentItems } = useGallery();
  const recentItems = getRecentItems(5);

  return (
    <div className="space-y-8">
      {/* Header with Gradient */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 bg-clip-text text-transparent">
          🍌 POLO BANANA
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-medium">
          Your production-ready single page application
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Configure preferences in Settings, monitor activity in Logs, and manage your data in the Gallery
        </p>
      </div>

      {/* Quick Actions Grid - Launch Pad */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/generate/image"
          className="card hover:shadow-xl transition-all hover:scale-105 cursor-pointer group"
        >
          <div className="text-center space-y-3">
            <div className="text-5xl group-hover:scale-110 transition-transform">🎨</div>
            <h3 className="text-xl font-bold text-amber-600 dark:text-amber-400">Generate Image</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Create AI images with custom prompts</p>
          </div>
        </Link>

        <Link
          href="/generate/video"
          className="card hover:shadow-xl transition-all hover:scale-105 cursor-pointer group"
        >
          <div className="text-center space-y-3">
            <div className="text-5xl group-hover:scale-110 transition-transform">🎬</div>
            <h3 className="text-xl font-bold text-amber-600 dark:text-amber-400">Generate Video</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Create AI videos with custom prompts</p>
          </div>
        </Link>

        <Link
          href="/gallery"
          className="card hover:shadow-xl transition-all hover:scale-105 cursor-pointer group"
        >
          <div className="text-center space-y-3">
            <div className="text-5xl group-hover:scale-110 transition-transform">🖼️</div>
            <h3 className="text-xl font-bold text-amber-600 dark:text-amber-400">Gallery</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Browse all generated media</p>
          </div>
        </Link>

        <Link
          href="/logs"
          className="card hover:shadow-xl transition-all hover:scale-105 cursor-pointer group"
        >
          <div className="text-center space-y-3">
            <div className="text-5xl group-hover:scale-110 transition-transform">📝</div>
            <h3 className="text-xl font-bold text-amber-600 dark:text-amber-400">Activity Logs</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Monitor generation progress</p>
          </div>
        </Link>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Logs Panel */}
        <div className="card lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4 text-amber-600 dark:text-amber-400">📝 Recent Activity</h2>
          <LogsPanel maxEntries={8} />
        </div>

        {/* Recent Media */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4 text-amber-600 dark:text-amber-400">🎬 Latest Media</h2>
          {recentItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-2">📭</p>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                No media yet
              </p>
              <Link href="/gallery" className="text-amber-600 dark:text-amber-400 hover:text-amber-700 font-semibold text-sm mt-2 inline-block">
                Start exploring →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentItems.slice(0, 5).map((item) => (
                <div key={item.id} className="border-2 border-amber-100 dark:border-amber-900/40 rounded-lg p-3 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="badge font-bold">
                      {item.type === 'image' ? '🖼️ Image' : '🎬 Video'}
                    </span>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${item.env === 'test' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' : 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300'}`}>
                      {item.env}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-medium truncate">
                    {item.prompt || 'No prompt'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 text-center">
            <Link href="/gallery" className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-semibold text-sm">
              View all media →
            </Link>
          </div>
        </div>
      </div>

      {/* Environment Info Card */}
      <div className="card bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-200 dark:border-amber-900/40">
        <h3 className="text-lg font-bold text-amber-800 dark:text-amber-300 mb-3">⚙️ Current Configuration</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase">Environment</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{config.env}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase">Logging</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
              {config.loggingEnabled ? '✅ Enabled' : '❌ Disabled'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase">Log Level</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-1 capitalize">{config.logLevel}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

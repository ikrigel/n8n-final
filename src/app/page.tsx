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
  const recentItems = getRecentItems(6);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <div className="space-y-6 pr-8">
        <div>
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 bg-clip-text text-transparent mb-4">
            🍌 POLO BANANA
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 font-semibold mb-2">
            Production-Ready AI Content Generator
          </p>
          <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl">
            Generate stunning AI images and videos with custom prompts. Manage your gallery, monitor activity, and customize your experience.
          </p>
        </div>
      </div>

      {/* Quick Actions Grid - Larger & More Prominent */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-8">
        <Link
          href="/generate/image"
          className="card bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border-2 border-amber-200 dark:border-amber-800 hover:shadow-2xl transition-all hover:scale-105 cursor-pointer group p-8"
        >
          <div className="space-y-4">
            <div className="text-7xl group-hover:scale-110 transition-transform inline-block">🎨</div>
            <div>
              <h3 className="text-2xl font-bold text-amber-700 dark:text-amber-300 mb-2">Generate Image</h3>
              <p className="text-base text-gray-600 dark:text-gray-400">Create stunning AI-powered images with detailed custom prompts. Choose from various styles and techniques.</p>
            </div>
            <div className="pt-2">
              <span className="inline-block bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold group-hover:bg-amber-700 transition-colors">
                Start Generating →
              </span>
            </div>
          </div>
        </Link>

        <Link
          href="/generate/video"
          className="card bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border-2 border-purple-200 dark:border-purple-800 hover:shadow-2xl transition-all hover:scale-105 cursor-pointer group p-8"
        >
          <div className="space-y-4">
            <div className="text-7xl group-hover:scale-110 transition-transform inline-block">🎬</div>
            <div>
              <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-2">Generate Video</h3>
              <p className="text-base text-gray-600 dark:text-gray-400">Create dynamic videos with AI. Describe your vision and let our system bring it to life.</p>
            </div>
            <div className="pt-2">
              <span className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold group-hover:bg-purple-700 transition-colors">
                Create Video →
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-8">
        <Link
          href="/gallery"
          className="card hover:shadow-xl transition-all hover:scale-105 cursor-pointer group p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center gap-4">
            <div className="text-6xl">🖼️</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-1">Gallery</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Browse, download, and manage all your generated media</p>
            </div>
            <div className="text-2xl group-hover:translate-x-2 transition-transform">→</div>
          </div>
        </Link>

        <Link
          href="/logs"
          className="card hover:shadow-xl transition-all hover:scale-105 cursor-pointer group p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800"
        >
          <div className="flex items-center gap-4">
            <div className="text-6xl">📊</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-green-700 dark:text-green-300 mb-1">Activity Logs</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monitor generation progress and system activity</p>
            </div>
            <div className="text-2xl group-hover:translate-x-2 transition-transform">→</div>
          </div>
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pr-8">
        {/* Recent Activity - Spans 2.5 columns */}
        <div className="lg:col-span-2 card">
          <h2 className="text-2xl font-bold mb-6 text-amber-600 dark:text-amber-400">📝 Recent Activity</h2>
          <LogsPanel maxEntries={6} />
        </div>

        {/* Latest Media - Spans 1.5 columns */}
        <div className="lg:col-span-2 card">
          <h2 className="text-2xl font-bold mb-6 text-amber-600 dark:text-amber-400">🎬 Latest Media</h2>
          {recentItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">📭</p>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-4">
                No media generated yet
              </p>
              <Link href="/generate/image" className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Start Generating →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {recentItems.slice(0, 6).map((item) => (
                <Link
                  key={item.id}
                  href="/gallery"
                  className="group relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow aspect-square"
                >
                  <img
                    src={item.url || 'https://via.placeholder.com/300'}
                    alt={item.prompt}
                    className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end opacity-0 group-hover:opacity-100">
                    <div className="w-full p-3 text-white text-xs bg-gradient-to-t from-black/80 to-transparent">
                      <p className="font-semibold truncate">{item.prompt?.substring(0, 25) || 'Untitled'}</p>
                      <p className="text-xs text-gray-300">{new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {recentItems.length > 0 && (
            <div className="mt-6 text-center">
              <Link href="/gallery" className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                View All →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Configuration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-8">
        {/* Environment Config */}
        <div className="card bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-200 dark:border-amber-900/40">
          <h3 className="text-lg font-bold text-amber-800 dark:text-amber-300 mb-4">⚙️ Environment</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase mb-2">Current Mode</p>
              <div className="inline-block px-4 py-2 bg-amber-600 text-white rounded-lg font-bold capitalize">
                {config.env}
              </div>
            </div>
            <Link href="/settings" className="inline-block text-amber-600 dark:text-amber-400 hover:text-amber-700 font-semibold text-sm">
              Manage Settings →
            </Link>
          </div>
        </div>

        {/* Logging Config */}
        <div className="card bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-900/40">
          <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-4">🔍 Logging Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300 font-medium">Status</span>
              <span className={`font-bold ${config.loggingEnabled ? 'text-green-600' : 'text-red-600'}`}>
                {config.loggingEnabled ? '✅ Enabled' : '❌ Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300 font-medium">Level</span>
              <span className="font-bold text-gray-900 dark:text-white capitalize">{config.logLevel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="card bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-indigo-200 dark:border-indigo-900/40 pr-8">
        <h3 className="text-lg font-bold text-indigo-800 dark:text-indigo-300 mb-4">💡 Quick Tips</h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>✓ Use detailed prompts for better AI generation results</li>
          <li>✓ Check your Activity Logs to monitor generation progress</li>
          <li>✓ Visit Settings to customize your sidebar and theme preferences</li>
          <li>✓ Browse your Gallery to download or share generated media</li>
        </ul>
      </div>
    </div>
  );
}

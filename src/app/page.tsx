'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useConfig } from '@/contexts/ConfigContext';
import { useLogger } from '@/hooks/useLogger';
import { useGallery } from '@/hooks/useGallery';
import { useAuth } from '@/contexts/AuthContext';
import { sendWebhookRequest } from '@/lib/webhooks';
import { v4 as uuidv4 } from 'uuid';
import LogsPanel from '@/components/logs/LogsPanel';

/**
 * Dashboard / Home page
 * Shows quick actions, recent logs, and recent gallery items
 */
export default function DashboardPage() {
  const { config } = useConfig();
  const { logInfo, logError } = useLogger();
  const { getRecentItems } = useGallery();
  const { userId, userEmail } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  // Handle generate image (GET)
  const handleGenerateImage = async () => {
    setLoading(true);
    try {
      const requestId = uuidv4();
      const result = await sendWebhookRequest(
        config.env,
        'image',
        userId,
        userEmail,
        undefined,
        { prompt: 'A beautiful landscape' },
        requestId
      );

      if (result.success) {
        await logInfo('Image generation started', { requestId });
        setMessage({
          type: 'success',
          text: 'Image generation request sent successfully',
        });
      } else {
        await logError('Image generation failed', { error: result.error });
        setMessage({ type: 'error', text: result.error || 'Unknown error' });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      await logError('Image generation error', { error: errorMsg });
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  // Handle generate video (POST)
  const handleGenerateVideo = async () => {
    setLoading(true);
    try {
      const requestId = uuidv4();
      const result = await sendWebhookRequest(
        config.env,
        'video',
        userId,
        userEmail,
        undefined,
        { prompt: 'A dynamic animation' },
        requestId
      );

      if (result.success) {
        await logInfo('Video generation started', { requestId });
        setMessage({
          type: 'success',
          text: 'Video generation request sent successfully',
        });
      } else {
        await logError('Video generation failed', { error: result.error });
        setMessage({ type: 'error', text: result.error || 'Unknown error' });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      await logError('Video generation error', { error: errorMsg });
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

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

      {/* Message Display */}
      {message && (
        <div
          className={`p-4 rounded-lg border-l-4 font-semibold ${
            message.type === 'success'
              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border-emerald-400'
              : 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200 border-rose-400'
          }`}
        >
          {message.type === 'success' ? '✅' : '❌'} {message.text}
        </div>
      )}

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={handleGenerateImage}
          disabled={loading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed h-16 text-lg font-bold flex items-center justify-center"
        >
          {loading ? '⏳ Processing...' : '🎨 Generate Image'}
        </button>
        <button
          onClick={handleGenerateVideo}
          disabled={loading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed h-16 text-lg font-bold flex items-center justify-center"
        >
          {loading ? '⏳ Processing...' : '🎬 Generate Video'}
        </button>
        <Link href="/gallery" className="btn-primary text-center h-16 flex items-center justify-center text-lg font-bold">
          🖼️ Gallery
        </Link>
        <Link href="/logs" className="btn-primary text-center h-16 flex items-center justify-center text-lg font-bold">
          📋 View Logs
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

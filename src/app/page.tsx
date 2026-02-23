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
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">POLO BANANA</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          A production-ready single page application. Configure your
          preferences in Settings, monitor activity in Logs, and manage your
          data in the Gallery.
        </p>
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={handleGenerateImage}
          disabled={loading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : '🎨 Generate Image'}
        </button>
        <button
          onClick={handleGenerateVideo}
          disabled={loading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : '🎬 Generate Video'}
        </button>
        <Link href="/gallery" className="btn-primary text-center">
          🖼️ Open Gallery
        </Link>
        <Link href="/settings" className="btn-primary text-center">
          ⚙️ Settings
        </Link>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Logs Panel */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Recent Logs</h2>
          <LogsPanel maxEntries={10} />
        </div>

        {/* Recent Media */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Recent Media</h2>
          {recentItems.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No media generated yet.{' '}
              <Link href="/gallery" className="text-blue-600 hover:underline">
                View Gallery
              </Link>
            </p>
          ) : (
            <div className="space-y-3">
              {recentItems.map((item) => (
                <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="badge">
                      {item.type === 'image' ? '🖼️ Image' : '🎬 Video'}
                    </span>
                    <span className="badge-warning">{item.env}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {item.prompt || 'No prompt'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4">
            <Link href="/gallery" className="text-blue-600 hover:underline text-sm">
              View all →
            </Link>
          </div>
        </div>
      </div>

      {/* Environment Info */}
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Current Environment:</strong> {config.env} |
          <strong className="ml-2">Logging:</strong> {config.loggingEnabled ? 'Enabled' : 'Disabled'} |
          <strong className="ml-2">Log Level:</strong> {config.logLevel}
        </p>
      </div>
    </div>
  );
}

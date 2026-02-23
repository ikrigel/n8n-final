'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useConfig } from '@/contexts/ConfigContext';
import { useLogger } from '@/hooks/useLogger';
import { useAuth } from '@/contexts/AuthContext';
import { sendWebhookRequest } from '@/lib/webhooks';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'polo-banana-video-prompt';

/**
 * Video Generation Page
 * Full-page dedicated interface for generating videos with custom prompts
 */
export default function GenerateVideoPage() {
  const { config } = useConfig();
  const { logInfo, logError } = useLogger();
  const { userId, userEmail } = useAuth();

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);

  // Load prompt from localStorage on mount
  useEffect(() => {
    const savedPrompt = localStorage.getItem(STORAGE_KEY);
    if (savedPrompt) {
      setPrompt(savedPrompt);
    }
  }, []);

  // Save prompt to localStorage whenever it changes
  useEffect(() => {
    if (prompt) {
      localStorage.setItem(STORAGE_KEY, prompt);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [prompt]);

  const handleGenerateVideo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setMessage({ type: 'error', text: 'Please enter a prompt' });
      return;
    }

    setLoading(true);
    try {
      const newRequestId = uuidv4();
      setRequestId(newRequestId);

      const result = await sendWebhookRequest(
        config.env,
        'video',
        userId,
        userEmail,
        undefined,
        { prompt: prompt.trim() },
        newRequestId
      );

      if (result.success) {
        await logInfo('Video generation started', { requestId: newRequestId, prompt });
        setMessage({
          type: 'success',
          text: `✅ Video generation started! Request ID: ${newRequestId.substring(0, 8)}...`,
        });
        setPrompt(''); // Clear input after success
        localStorage.removeItem(STORAGE_KEY); // Clear saved prompt
      } else {
        await logError('Video generation failed', { error: result.error });
        setMessage({ type: 'error', text: `❌ Error: ${result.error || 'Unknown error'}` });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      await logError('Video generation error', { error: errorMsg });
      setMessage({ type: 'error', text: `❌ Error: ${errorMsg}` });
    } finally {
      setLoading(false);
      // Clear message after 6 seconds
      setTimeout(() => setMessage(null), 6000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-2xl">
        {/* Back to Dashboard */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 mb-8 font-semibold"
        >
          ← Back to Dashboard
        </Link>

        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 bg-clip-text text-transparent">
            🎬 Generate Video
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
            Create dynamic AI videos with your custom prompts
          </p>
          <div className="inline-block px-4 py-2 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 rounded-lg text-sm font-semibold">
            Environment: {config.env.toUpperCase()}
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`p-4 rounded-lg border-l-4 font-semibold mb-8 ${
              message.type === 'success'
                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border-emerald-400'
                : 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200 border-rose-400'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        <div className="card space-y-6">
          <form onSubmit={handleGenerateVideo} className="space-y-6">
            {/* Prompt Input */}
            <div>
              <label htmlFor="prompt" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                ✍️ Describe Your Video
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., A smooth camera pan across a futuristic cityscape at night with neon lights, slow motion, cinematic quality..."
                className="input-field h-32 resize-none"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Describe motion, camera movement, and timing for better results.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed py-4 text-lg font-bold flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin">⏳</span>
                  Processing...
                </>
              ) : (
                <>
                  <span>🎬</span>
                  Generate Video
                </>
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="border-t-2 border-amber-200 dark:border-amber-900/40 pt-6">
            <h3 className="font-bold text-amber-700 dark:text-amber-300 mb-3">💡 Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>✓ Describe camera movement (e.g., "pan", "zoom", "tracking shot", "static")</li>
              <li>✓ Mention pacing (e.g., "slow motion", "fast-paced", "cinematic")</li>
              <li>✓ Include visual style (e.g., "3D animation", "live action", "stop motion")</li>
              <li>✓ Specify duration if needed (e.g., "10 seconds", "short clip")</li>
              <li>✓ Check your logs to monitor generation progress</li>
            </ul>
          </div>
        </div>

        {/* Request Status */}
        {requestId && (
          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
              📊 Request Status
            </p>
            <p className="text-xs font-mono text-blue-800 dark:text-blue-400 break-all">
              ID: {requestId}
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-2">
              Check the <Link href="/logs" className="underline font-bold hover:text-blue-900">Logs page</Link> to see your request status.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useConfig } from '@/contexts/ConfigContext';
import { useLogger } from '@/hooks/useLogger';
import { useAuth } from '@/contexts/AuthContext';
import { buildWebhookURL } from '@/lib/webhooks';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'polo-banana-image-prompt';

/**
 * Image Generation Page
 * Full-page dedicated interface for generating images with custom prompts
 */
export default function GenerateImagePage() {
  const { config } = useConfig();
  const { logInfo, logError } = useLogger();
  const { userId, userEmail } = useAuth();

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

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

  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setMessage({ type: 'error', text: 'Please enter a prompt' });
      return;
    }

    setLoading(true);
    setGeneratedImageUrl(null);
    try {
      const newRequestId = uuidv4();
      setRequestId(newRequestId);

      // Send request through Next.js API proxy (avoids CORS issues)
      const response = await fetch('/api/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          env: config.env,
          workflowType: 'image',
          userId,
          email: userEmail,
          telegramId: undefined,
          message: {
            prompt: prompt.trim(),
          },
          requestId: newRequestId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // Check if response is an image (binary) - directly from n8n via proxy
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('image')) {
        // Convert binary image response to blob and create object URL
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setGeneratedImageUrl(imageUrl);

        await logInfo('Image generated successfully', { requestId: newRequestId, prompt });
        setMessage({
          type: 'success',
          text: `✅ Image generated successfully!`,
        });
        setPrompt(''); // Clear input after success
        localStorage.removeItem(STORAGE_KEY); // Clear saved prompt
      } else {
        // If response is JSON (from proxy)
        const data = await response.json();
        if (data.success && data.image) {
          // Handle JSON response with base64 image data from proxy
          setGeneratedImageUrl(`data:image/png;base64,${data.image}`);
          await logInfo('Image generated successfully', { requestId: newRequestId, prompt });
          setMessage({
            type: 'success',
            text: `✅ Image generated successfully!`,
          });
          setPrompt('');
          localStorage.removeItem(STORAGE_KEY); // Clear saved prompt
        } else {
          throw new Error(data.error || 'Image generation failed');
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      await logError('Image generation error', { error: errorMsg });
      setMessage({ type: 'error', text: `❌ Error: ${errorMsg}` });
    } finally {
      setLoading(false);
      // Clear message after 6 seconds (unless it's an error)
      setTimeout(() => {
        if (message?.type !== 'error') {
          setMessage(null);
        }
      }, 6000);
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
            🎨 Generate Image
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
            Create stunning AI images with your custom prompts
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
          <form onSubmit={handleGenerateImage} className="space-y-6">
            {/* Prompt Input */}
            <div>
              <label htmlFor="prompt" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                ✍️ Describe Your Image
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., A serene landscape with mountains at sunset, vibrant colors, oil painting style..."
                className="input-field h-32 resize-none"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Be descriptive! Include style, mood, and details for better results.
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
                  <span>🎨</span>
                  Generate Image
                </>
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="border-t-2 border-amber-200 dark:border-amber-900/40 pt-6">
            <h3 className="font-bold text-amber-700 dark:text-amber-300 mb-3">💡 Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>✓ Include artistic style (e.g., "watercolor", "digital art", "photorealistic")</li>
              <li>✓ Mention lighting and mood (e.g., "golden hour", "dramatic", "peaceful")</li>
              <li>✓ Specify composition details (e.g., "wide angle", "close-up", "bird's eye view")</li>
              <li>✓ Check your logs to monitor generation progress</li>
            </ul>
          </div>
        </div>

        {/* Generated Image Display */}
        {generatedImageUrl && (
          <div className="mt-12 p-8 bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl">
            <h3 className="text-2xl font-bold text-amber-700 dark:text-amber-300 mb-6 text-center">
              🎨 Your Generated Image
            </h3>
            <div className="relative w-full aspect-square max-h-[600px] mx-auto rounded-lg overflow-hidden shadow-2xl bg-gray-200 dark:bg-gray-800">
              <img
                src={generatedImageUrl}
                alt="Generated image"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="mt-6 flex gap-4 justify-center">
              <a
                href={generatedImageUrl}
                download={`polo-banana-${requestId?.substring(0, 8)}.png`}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors"
              >
                ⬇️ Download Image
              </a>
              <button
                onClick={() => {
                  URL.revokeObjectURL(generatedImageUrl);
                  setGeneratedImageUrl(null);
                  setPrompt('');
                  setRequestId(null);
                }}
                className="px-6 py-3 bg-gray-400 hover:bg-gray-500 text-white font-bold rounded-lg transition-colors"
              >
                🔄 Generate Another
              </button>
            </div>
          </div>
        )}

        {/* Request Status */}
        {requestId && !generatedImageUrl && (
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

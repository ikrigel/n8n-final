'use client';

import React from 'react';

/**
 * Help page - usage instructions and examples
 */
export default function HelpPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Help & Documentation</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Learn how to use this application to generate and manage media
        </p>
      </div>

      {/* Quick Start */}
      <div className="card space-y-4">
        <h2 className="text-2xl font-bold">🚀 Quick Start</h2>
        <ol className="space-y-3 list-decimal list-inside">
          <li>
            <strong>Switch Environment:</strong> Go to Settings and choose between
            Test and Production environments
          </li>
          <li>
            <strong>Generate Media:</strong> Click "Generate Image" or "Generate
            Video" buttons on the Home page
          </li>
          <li>
            <strong>Monitor Progress:</strong> Check the Recent Logs panel to see
            workflow status
          </li>
          <li>
            <strong>View Results:</strong> Open the Gallery to see all generated
            media
          </li>
          <li>
            <strong>Download Media:</strong> Click the Download button on any
            gallery item
          </li>
        </ol>
      </div>

      {/* Environment Switching */}
      <div className="card space-y-4">
        <h2 className="text-2xl font-bold">🔄 Switching Environments</h2>
        <p className="text-gray-700 dark:text-gray-300">
          The application supports two environments for testing and production
          workflows:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded p-4">
            <h3 className="font-bold mb-2">🧪 Test Environment</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Safe environment for testing workflows without affecting production
              data.
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono">
              webhook-test/
            </div>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded p-4">
            <h3 className="font-bold mb-2">🚀 Production Environment</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Use this for real workflows and permanent media storage.
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono">
              webhook/
            </div>
          </div>
        </div>
      </div>

      {/* Logging */}
      <div className="card space-y-4">
        <h2 className="text-2xl font-bold">📝 Understanding Logs</h2>
        <p className="text-gray-700 dark:text-gray-300">
          The application logs all events and webhook interactions. Configure
          logging in Settings.
        </p>

        <div className="space-y-3">
          <h3 className="font-bold">Log Levels</h3>
          <ul className="space-y-2">
            <li className="flex gap-2">
              <span className="badge">ℹ️ INFO</span>
              <span className="text-gray-700 dark:text-gray-300">
                General information messages (requests sent, results received)
              </span>
            </li>
            <li className="flex gap-2">
              <span className="badge-warning">🐛 DEBUG</span>
              <span className="text-gray-700 dark:text-gray-300">
                Detailed debug information (helpful for troubleshooting)
              </span>
            </li>
            <li className="flex gap-2">
              <span className="badge-error">❌ ERROR</span>
              <span className="text-gray-700 dark:text-gray-300">
                Errors and failures (webhook errors, network issues)
              </span>
            </li>
          </ul>
        </div>

        <h3 className="font-bold mt-4">JSON Log Example</h3>
        <div className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded font-mono text-xs overflow-x-auto">
          <pre>{`{
  "type": "log",
  "level": "info",
  "message": "Image generation started",
  "meta": {
    "workflow": "image",
    "prompt": "A beautiful sunset",
    "requestId": "abc123"
  },
  "timestamp": "2026-02-23T10:30:00Z"
}`}</pre>
        </div>
      </div>

      {/* Gallery Filters */}
      <div className="card space-y-4">
        <h2 className="text-2xl font-bold">🖼️ Using Gallery Filters</h2>

        <div className="space-y-3">
          <div>
            <h3 className="font-bold mb-2">Media Type</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Filter by image or video to quickly find what you're looking for
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-2">Environment</h3>
            <p className="text-gray-700 dark:text-gray-300">
              View only items from Test or Production environments
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-2">Date Range</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Find media created within a specific time period
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-2">Text Search</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Search by the prompt or description used to generate the media
            </p>
          </div>
        </div>
      </div>

      {/* Workflow Types */}
      <div className="card space-y-4">
        <h2 className="text-2xl font-bold">⚙️ Available Workflows</h2>

        <div className="space-y-3">
          <div className="border border-gray-200 dark:border-gray-700 rounded p-3">
            <div className="font-bold text-blue-600">image</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Generate images using OpenAI DALL-E
            </p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded p-3">
            <div className="font-bold text-purple-600">video</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Generate videos using AI video generation
            </p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded p-3">
            <div className="font-bold text-pink-600">audio</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get voice responses from AI chat
            </p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded p-3">
            <div className="font-bold text-green-600">question</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get text responses from AI chat
            </p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded p-3">
            <div className="font-bold text-orange-600">chucknorris</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get random Chuck Norris jokes from API
            </p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded p-3">
            <div className="font-bold text-yellow-600">dad</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get random dad jokes from API
            </p>
          </div>
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="card space-y-4">
        <h2 className="text-2xl font-bold">🔧 Troubleshooting</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-red-600 mb-2">❌ Webhook Test Failed</h3>
            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 list-disc list-inside">
              <li>Check your internet connection</li>
              <li>Verify the correct environment is selected</li>
              <li>Check the n8n workflow status</li>
              <li>Review error logs in the Logs panel</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-red-600 mb-2">❌ No Results in Gallery</h3>
            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 list-disc list-inside">
              <li>Check if logging is enabled in Settings</li>
              <li>Verify the workflow completed successfully</li>
              <li>Try clearing filters to see all items</li>
              <li>Check the Logs panel for errors</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-red-600 mb-2">❌ Settings Not Persisting</h3>
            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 list-disc list-inside">
              <li>Check if browser localStorage is enabled</li>
              <li>Try clearing browser cache</li>
              <li>Refresh the page and try again</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded p-6 space-y-3">
        <h2 className="text-xl font-bold text-green-900 dark:text-green-100">
          💡 Tips & Best Practices
        </h2>
        <ul className="space-y-2 text-green-900 dark:text-green-100">
          <li>✅ Use Test environment to verify workflows before production</li>
          <li>✅ Enable JSON logging to track all webhook interactions</li>
          <li>✅ Regularly clear old logs to keep the application responsive</li>
          <li>✅ Use descriptive prompts for better media generation results</li>
          <li>✅ Export and backup important generated media regularly</li>
          <li>✅ Check workflow logs in n8n if results are unexpected</li>
        </ul>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Image from 'next/image';

/**
 * About page - information about programmer and app
 */
export default function AboutPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">About</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Learn about this project and the person behind it
        </p>
      </div>

      {/* About the Programmer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="card text-center">
          <div className="mb-6">
            {/* Note: Replace with actual image */}
            <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
              <span className="text-6xl">👤</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">About the Programmer</h2>
          <p className="text-gray-600 dark:text-gray-400">
            A passionate developer building innovative solutions with modern
            technologies. Specialized in full-stack development, automation,
            and AI integration.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-lg mb-2">Skills & Expertise</h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>✅ Full-Stack Development (React, Next.js, TypeScript)</li>
              <li>✅ Automation & Workflow Design (n8n, Zapier)</li>
              <li>✅ AI/ML Integration (OpenAI, Nano Banana, Gemini)</li>
              <li>✅ Database Design (PostgreSQL, Supabase)</li>
              <li>✅ Cloud Deployment (Vercel, AWS, GCP)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Focus Areas</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Building production-ready applications that integrate modern AI
              capabilities with intuitive user interfaces. Passionate about
              creating efficient automation workflows that save time and improve
              productivity.
            </p>
          </div>
        </div>
      </div>

      {/* About the App */}
      <div className="card space-y-4">
        <h2 className="text-2xl font-bold">About This Application</h2>

        <p className="text-gray-700 dark:text-gray-300">
          This Single Page Application (SPA) serves as a modern frontend for n8n
          automation workflows. It enables users to generate stunning images and
          videos powered by leading AI services.
        </p>

        <div className="space-y-3">
          <h3 className="font-bold text-lg">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded p-4">
              <div className="font-bold mb-2">🎨 Image Generation</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Generate high-quality images using OpenAI DALL-E and Nano Banana
                models
              </p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded p-4">
              <div className="font-bold mb-2">🎬 Video Generation</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Create dynamic videos using AI-powered video generation services
              </p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded p-4">
              <div className="font-bold mb-2">💬 AI Chat Integration</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Interact with advanced AI models for text and voice responses
              </p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded p-4">
              <div className="font-bold mb-2">🗂️ Gallery Management</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Organize, filter, and manage your generated media with ease
              </p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded p-4">
              <div className="font-bold mb-2">📝 Activity Logging</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track all webhook interactions and system events in real-time
              </p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded p-4">
              <div className="font-bold mb-2">🌓 Theme Support</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Seamless light, dark, and auto theme switching
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-lg">Technology Stack</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="badge">React 18</div>
            <div className="badge">Next.js 15</div>
            <div className="badge">TypeScript</div>
            <div className="badge">Tailwind CSS</div>
            <div className="badge">n8n</div>
            <div className="badge">Supabase</div>
            <div className="badge">Vitest</div>
            <div className="badge">Playwright</div>
            <div className="badge">OpenAI</div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Version:</strong> 1.0.0 | <strong>Built:</strong> February 2026 |
            <strong className="ml-2">Deployed on:</strong> Vercel
          </p>
        </div>
      </div>
    </div>
  );
}

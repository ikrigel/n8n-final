'use client';

import React from 'react';
import { useConfig } from '@/contexts/ConfigContext';
import EnvSelector from '@/components/settings/EnvSelector';
import WebhookTester from '@/components/settings/WebhookTester';
import LogSettings from '@/components/settings/LogSettings';

/**
 * Settings page
 * Configure environment, logging, sidebar, and test webhooks
 */
export default function SettingsPage() {
  const { config, updateConfig } = useConfig();

  const positions = ['left', 'right', 'top', 'bottom'] as const;
  const positionLabels: Record<typeof positions[number], string> = {
    left: '⬅️ Left',
    right: '➡️ Right',
    top: '⬆️ Top',
    bottom: '⬇️ Bottom',
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 py-8">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 bg-clip-text text-transparent">
          ⚙️ Settings
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-medium">
          Configure your application environment, logging preferences, sidebar, and test webhook connections.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <EnvSelector />
        <LogSettings />
      </div>

      {/* Sidebar Position & Collapse */}
      <div className="card">
        <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-6">📍 Sidebar Settings</h2>

        {/* Position Selector */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Navigation Position</h3>
          <div className="flex flex-wrap gap-3">
            {positions.map((pos) => (
              <button
                key={pos}
                onClick={() => updateConfig({ sidebarPosition: pos })}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  config.sidebarPosition === pos
                    ? 'bg-amber-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {positionLabels[pos]}
              </button>
            ))}
          </div>
        </div>

        {/* Collapse Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Collapse Sidebar</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Show icons only on desktop</p>
          </div>
          <button
            onClick={() => updateConfig({ sidebarCollapsed: !config.sidebarCollapsed })}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              config.sidebarCollapsed
                ? 'bg-amber-500 text-white shadow-lg'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
            }`}
          >
            {config.sidebarCollapsed ? '✓ Collapsed' : '✗ Expanded'}
          </button>
        </div>
      </div>

      <WebhookTester />
    </div>
  );
}

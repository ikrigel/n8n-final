'use client';

import React from 'react';
import EnvSelector from '@/components/settings/EnvSelector';
import WebhookTester from '@/components/settings/WebhookTester';
import LogSettings from '@/components/settings/LogSettings';

/**
 * Settings page
 * Configure environment, logging, and test webhooks
 */
export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 py-8">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 bg-clip-text text-transparent">
          ⚙️ Settings
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-medium">
          Configure your application environment, logging preferences, and test webhook connections.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <EnvSelector />
        <LogSettings />
      </div>

      <WebhookTester />
    </div>
  );
}

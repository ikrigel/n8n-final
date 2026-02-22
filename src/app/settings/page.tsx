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
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure your application environment, logging preferences, and test
          webhook connections.
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

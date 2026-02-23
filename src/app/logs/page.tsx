'use client';

import React from 'react';
import LogsManager from '@/components/logs/LogsManager';

/**
 * Logs page - displays the logs manager with full functionality
 */
export default function LogsPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 bg-clip-text text-transparent">
          📝 Activity Logs
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-medium">
          View, search, and manage all activity logs from your POLO BANANA operations
        </p>
      </div>

      {/* Logs Manager Component */}
      <div className="card">
        <LogsManager />
      </div>
    </div>
  );
}

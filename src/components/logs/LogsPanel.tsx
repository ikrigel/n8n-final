'use client';

import React, { useState } from 'react';
import { useLogs } from '@/contexts/LogsContext';
import { LogEntry } from '@/types';

interface LogsPanelProps {
  maxEntries?: number;
}

/**
 * Logs panel component - displays logs with filtering
 */
export default function LogsPanel({ maxEntries = 20 }: LogsPanelProps) {
  const { logs, clearLogs, getLogs } = useLogs();
  const [filter, setFilter] = useState<'all' | 'info' | 'debug' | 'error'>('all');

  const filtered =
    filter === 'all'
      ? logs.slice(0, maxEntries)
      : getLogs({ level: filter }).slice(0, maxEntries);

  const levelColors = {
    info: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    debug: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
    error: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
  };

  const levelIcons = {
    info: 'ℹ️',
    debug: '🐛',
    error: '❌',
  };

  return (
    <div className="space-y-3">
      {/* Filters and Controls */}
      <div className="flex items-center gap-2 mb-4">
        <label className="text-sm font-medium">Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="select-field text-sm py-1"
        >
          <option value="all">All</option>
          <option value="info">Info</option>
          <option value="debug">Debug</option>
          <option value="error">Error</option>
        </select>
        <button
          onClick={clearLogs}
          className="btn-small ml-auto text-sm"
          title="Clear all logs"
        >
          Clear
        </button>
      </div>

      {/* Logs Container */}
      <div className="space-y-2 max-h-80 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-900">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {logs.length === 0 ? 'No logs yet' : 'No logs match the filter'}
          </p>
        ) : (
          filtered.map((log: LogEntry) => (
            <div key={log.id} className="text-xs space-y-1">
              <div className="flex items-start gap-2">
                <span
                  className={`badge ${levelColors[log.level]}`}
                >
                  {levelIcons[log.level]} {log.level.toUpperCase()}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{log.message}</p>
              {log.meta && (
                <details className="ml-2">
                  <summary className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                    View metadata
                  </summary>
                  <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto">
                    {JSON.stringify(log.meta, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Showing {filtered.length} of {logs.length} logs
      </p>
    </div>
  );
}

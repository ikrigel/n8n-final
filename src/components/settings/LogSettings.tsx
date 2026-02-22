'use client';

import React from 'react';
import { useConfig } from '@/contexts/ConfigContext';

/**
 * Logging settings component
 */
export default function LogSettings() {
  const { config, updateConfig } = useConfig();

  return (
    <div className="card space-y-4">
      <h2 className="text-xl font-bold">Logging Settings</h2>

      {/* Enable Logging */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="logging-enabled"
          checked={config.loggingEnabled}
          onChange={(e) => updateConfig({ loggingEnabled: e.target.checked })}
          className="checkbox-field"
        />
        <label htmlFor="logging-enabled" className="font-medium cursor-pointer">
          Enable Logging
        </label>
      </div>

      {/* Log Level Selection */}
      {config.loggingEnabled && (
        <div className="space-y-2">
          <label htmlFor="log-level" className="block font-medium">
            Log Level
          </label>
          <select
            id="log-level"
            value={config.logLevel}
            onChange={(e) => updateConfig({ logLevel: e.target.value as any })}
            className="select-field"
          >
            <option value="info">Info - General information messages</option>
            <option value="debug">Debug - Detailed debugging information</option>
            <option value="error">Error - Only error messages</option>
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Choose the verbosity level for logs. Debug includes all messages,
            while Error only shows failures.
          </p>
        </div>
      )}

      {/* Send Logs as JSON */}
      {config.loggingEnabled && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="send-json-logs"
              checked={config.sendLogsAsJson}
              onChange={(e) => updateConfig({ sendLogsAsJson: e.target.checked })}
              className="checkbox-field"
            />
            <label htmlFor="send-json-logs" className="font-medium cursor-pointer">
              Send Logs as JSON to POST Webhook
            </label>
          </div>

          {config.sendLogsAsJson && (
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded p-3">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Logs will be sent to the n8n POST webhook with payload:
              </p>
              <pre className="mt-2 bg-white dark:bg-gray-800 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(
                  {
                    type: 'log',
                    level: 'info|debug|error',
                    message: 'Log message',
                    meta: { /* extra data */ },
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Info Panel */}
      {!config.loggingEnabled && (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded p-3">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Logging is currently disabled. Enable it to track application events
            and webhook interactions.
          </p>
        </div>
      )}
    </div>
  );
}

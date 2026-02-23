'use client';

import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { LogEntry } from '@/types';
import { useLogs } from '@/contexts/LogsContext';
import { useConfig } from '@/contexts/ConfigContext';
import { useAuth } from '@/contexts/AuthContext';
import { sendWebhookRequest } from '@/lib/webhooks';

/**
 * Hook to log messages with optional JSON sending to webhook
 */
export function useLogger() {
  const { logs, addLog, clearLogs, getLogs } = useLogs();
  const { config } = useConfig();
  const { userId, userEmail } = useAuth();

  // Log info message
  const logInfo = useCallback(
    async (message: string, meta?: Record<string, any>) => {
      if (!config.loggingEnabled || config.logLevel === 'error') return;

      const logEntry: LogEntry = {
        id: uuidv4(),
        level: 'info',
        message,
        meta,
        timestamp: new Date().toISOString(),
      };

      addLog(logEntry);

      // Send to webhook if JSON logging enabled
      if (config.sendLogsAsJson) {
        await sendWebhookRequest(
          config.env,
          'log',
          userId,
          userEmail,
          undefined,
          {
            type: 'log',
            level: 'info',
            message,
            meta,
          },
          uuidv4()
        );
      }
    },
    [config, addLog, userId, userEmail]
  );

  // Log error message
  const logError = useCallback(
    async (message: string, meta?: Record<string, any>) => {
      if (!config.loggingEnabled) return;

      const logEntry: LogEntry = {
        id: uuidv4(),
        level: 'error',
        message,
        meta,
        timestamp: new Date().toISOString(),
      };

      addLog(logEntry);

      // Send to webhook if JSON logging enabled
      if (config.sendLogsAsJson) {
        await sendWebhookRequest(
          config.env,
          'log',
          userId,
          userEmail,
          undefined,
          {
            type: 'log',
            level: 'error',
            message,
            meta,
          },
          uuidv4()
        );
      }
    },
    [config, addLog, userId, userEmail]
  );

  // Log debug message
  const logDebug = useCallback(
    async (message: string, meta?: Record<string, any>) => {
      if (!config.loggingEnabled || config.logLevel === 'error') return;
      if (config.logLevel !== 'debug') return; // Only log if level is debug

      const logEntry: LogEntry = {
        id: uuidv4(),
        level: 'debug',
        message,
        meta,
        timestamp: new Date().toISOString(),
      };

      addLog(logEntry);
    },
    [config, addLog]
  );

  return {
    logs,
    addLog,
    clearLogs,
    getLogs,
    logInfo,
    logError,
    logDebug,
  };
}

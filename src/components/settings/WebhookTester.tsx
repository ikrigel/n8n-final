'use client';

import React, { useState } from 'react';
import { useConfig } from '@/contexts/ConfigContext';
import { useLogger } from '@/hooks/useLogger';
import { testGetWebhook, testPostWebhook } from '@/lib/webhooks';
import { v4 as uuidv4 } from 'uuid';

/**
 * Webhook tester component - test GET and POST webhooks
 */
export default function WebhookTester() {
  const { config } = useConfig();
  const { logInfo, logError } = useLogger();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    type: 'get' | 'post';
    success: boolean;
    data?: any;
    error?: string;
    timestamp: string;
  } | null>(null);

  const handleTestGet = async () => {
    setLoading(true);
    try {
      const result = await testGetWebhook(config.env);

      const res = {
        type: 'get' as const,
        ...result,
        timestamp: new Date().toISOString(),
      };
      setResponse(res);

      if (result.success) {
        await logInfo('GET webhook test successful', { data: result.data });
      } else {
        await logError('GET webhook test failed', { error: result.error });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setResponse({
        type: 'get',
        success: false,
        error: errorMsg,
        timestamp: new Date().toISOString(),
      });
      await logError('GET webhook test error', { error: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleTestPost = async () => {
    setLoading(true);
    try {
      const requestId = uuidv4();
      const result = await testPostWebhook(config.env, requestId);

      const res = {
        type: 'post' as const,
        ...result,
        timestamp: new Date().toISOString(),
      };
      setResponse(res);

      if (result.success) {
        await logInfo('POST webhook test successful', { data: result.data });
      } else {
        await logError('POST webhook test failed', { error: result.error });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setResponse({
        type: 'post',
        success: false,
        error: errorMsg,
        timestamp: new Date().toISOString(),
      });
      await logError('POST webhook test error', { error: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card space-y-4">
      <h2 className="text-xl font-bold">Webhook Testing</h2>

      {/* Test Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleTestGet}
          disabled={loading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Testing...' : '🧪 Test GET Webhook'}
        </button>
        <button
          onClick={handleTestPost}
          disabled={loading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Testing...' : '🧪 Test POST Webhook'}
        </button>
      </div>

      {/* Response Display */}
      {response && (
        <div className="space-y-2">
          <h3 className="font-semibold">
            {response.type.toUpperCase()} Response
            <span className={`ml-2 text-sm ${response.success ? 'text-green-600' : 'text-red-600'}`}>
              {response.success ? '✅ Success' : '❌ Failed'}
            </span>
          </h3>

          <div className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-auto max-h-64">
            {response.error ? (
              <div className="text-red-400">{response.error}</div>
            ) : (
              <pre>{JSON.stringify(response.data, null, 2)}</pre>
            )}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(response.timestamp).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}

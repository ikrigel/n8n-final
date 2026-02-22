'use client';

import React from 'react';
import { useConfig } from '@/contexts/ConfigContext';

/**
 * Environment selector component
 */
export default function EnvSelector() {
  const { config, updateConfig } = useConfig();

  const webhookUrls = {
    test: {
      get: 'https://ikrigel4.app.n8n.cloud/webhook-test/48c78a6c-559b-4573-acc6-5ca425efd8cf',
      post: 'https://ikrigel4.app.n8n.cloud/webhook-test/32e4df61-486f-42a5-a2e8-5fb0d595417d',
    },
    production: {
      get: 'https://ikrigel4.app.n8n.cloud/webhook/48c78a6c-559b-4573-acc6-5ca425efd8cf',
      post: 'https://ikrigel4.app.n8n.cloud/webhook/32e4df61-486f-42a5-a2e8-5fb0d595417d',
    },
  };

  return (
    <div className="card space-y-4">
      <h2 className="text-xl font-bold">Environment Selection</h2>

      {/* Environment Toggle */}
      <div className="space-y-2">
        <label className="block font-medium">Active Environment</label>
        <div className="flex gap-4">
          {['test', 'production'].map((env) => (
            <label key={env} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="environment"
                value={env}
                checked={config.env === env}
                onChange={() => updateConfig({ env: env as any })}
                className="checkbox-field"
              />
              <span className="capitalize font-medium">{env}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Webhook URLs Display */}
      <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold">Webhook URLs</h3>

        {/* GET URLs */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">GET Webhooks</label>
          <div className="space-y-1">
            <div className="text-xs">
              <p className="font-semibold text-gray-600 dark:text-gray-400">Test</p>
              <input
                type="text"
                readOnly
                value={webhookUrls.test.get}
                className="input-field text-xs"
                title="Click to copy"
              />
              <button
                onClick={() => navigator.clipboard.writeText(webhookUrls.test.get)}
                className="btn-small text-xs mt-1"
              >
                📋 Copy
              </button>
            </div>
            <div className="text-xs">
              <p className="font-semibold text-gray-600 dark:text-gray-400">Production</p>
              <input
                type="text"
                readOnly
                value={webhookUrls.production.get}
                className="input-field text-xs"
                title="Click to copy"
              />
              <button
                onClick={() => navigator.clipboard.writeText(webhookUrls.production.get)}
                className="btn-small text-xs mt-1"
              >
                📋 Copy
              </button>
            </div>
          </div>
        </div>

        {/* POST URLs */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">POST Webhooks</label>
          <div className="space-y-1">
            <div className="text-xs">
              <p className="font-semibold text-gray-600 dark:text-gray-400">Test</p>
              <input
                type="text"
                readOnly
                value={webhookUrls.test.post}
                className="input-field text-xs"
                title="Click to copy"
              />
              <button
                onClick={() => navigator.clipboard.writeText(webhookUrls.test.post)}
                className="btn-small text-xs mt-1"
              >
                📋 Copy
              </button>
            </div>
            <div className="text-xs">
              <p className="font-semibold text-gray-600 dark:text-gray-400">Production</p>
              <input
                type="text"
                readOnly
                value={webhookUrls.production.post}
                className="input-field text-xs"
                title="Click to copy"
              />
              <button
                onClick={() => navigator.clipboard.writeText(webhookUrls.production.post)}
                className="btn-small text-xs mt-1"
              >
                📋 Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

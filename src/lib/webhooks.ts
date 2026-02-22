// Webhook client for communicating with n8n workflows
import { WebhookEnvironment, WebhookRequest, WebhookResponse, WorkflowType } from '@/types';

// Webhook URLs for n8n
const WEBHOOK_URLS = {
  test: 'https://ikrigel4.app.n8n.cloud/webhook-test/32e4df61-486f-42a5-a2e8-5fb0d595417d',
  production:
    'https://ikrigel4.app.n8n.cloud/webhook/32e4df61-486f-42a5-a2e8-5fb0d595417d',
};

/**
 * Build complete webhook URL based on environment
 * @param env - test or production environment
 * @returns Full webhook URL
 */
export function buildWebhookURL(env: WebhookEnvironment): string {
  return WEBHOOK_URLS[env];
}

/**
 * Send a workflow request to n8n via webhook
 * n8n will route internally based on workflow_type field
 * @param env - Environment (test/production)
 * @param workflowType - Type of workflow to trigger
 * @param userId - User ID from session
 * @param email - User email for RLS
 * @param telegramId - Optional Telegram ID
 * @param message - Workflow-specific message payload
 * @param requestId - UUID for tracking response
 * @returns Response with request_id and queued status
 */
export async function sendWebhookRequest(
  env: WebhookEnvironment,
  workflowType: WorkflowType,
  userId: string,
  email: string,
  telegramId: string | undefined,
  message: Record<string, any>,
  requestId: string
): Promise<{ success: boolean; requestId: string; queued: boolean; error?: string }> {
  try {
    const url = buildWebhookURL(env);

    // Build complete webhook request payload
    const payload: WebhookRequest = {
      request_id: requestId,
      user_id: userId,
      email,
      telegram_id: telegramId,
      workflow_type: workflowType,
      timestamp: new Date().toISOString(),
      message,
    };

    // Send POST request to n8n webhook
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Webhook error: ${response.status} - ${errorText}`);
      return {
        success: false,
        requestId,
        queued: false,
        error: `HTTP ${response.status}: ${errorText}`,
      };
    }

    // n8n workflow started successfully
    return {
      success: true,
      requestId,
      queued: true,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('Webhook send error:', errorMessage);
    return {
      success: false,
      requestId,
      queued: false,
      error: errorMessage,
    };
  }
}

/**
 * Test GET webhook (health check)
 * @param env - Environment
 * @returns Response from GET webhook
 */
export async function testGetWebhook(env: WebhookEnvironment): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const url = buildWebhookURL(env);

    // Call GET endpoint (n8n routes GET separately if configured)
    const response = await fetch(`${url}?test=true`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return { success: false, error: errorMessage };
  }
}

/**
 * Test POST webhook with simple test payload
 * @param env - Environment
 * @param requestId - Request ID for tracking
 * @returns Response from POST webhook
 */
export async function testPostWebhook(
  env: WebhookEnvironment,
  requestId: string
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const url = buildWebhookURL(env);

    const payload = {
      request_id: requestId,
      user_id: 'test-user',
      email: 'test@example.com',
      workflow_type: 'test',
      timestamp: new Date().toISOString(),
      message: { test: true },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return { success: false, error: errorMessage };
  }
}

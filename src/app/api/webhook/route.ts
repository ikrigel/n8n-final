import { NextRequest, NextResponse } from 'next/server';
import { WebhookEnvironment, WorkflowType, WebhookRequest } from '@/types';

// Webhook URLs for n8n (same as in lib/webhooks.ts)
const WEBHOOK_URLS = {
  test: 'https://ikrigel4.app.n8n.cloud/webhook-test/32e4df61-486f-42a5-a2e8-5fb0d595417d',
  production: 'https://ikrigel4.app.n8n.cloud/webhook/32e4df61-486f-42a5-a2e8-5fb0d595417d',
};

interface WebhookRequestBody {
  env: WebhookEnvironment;
  workflowType: WorkflowType;
  userId: string;
  email: string;
  telegramId?: string;
  message: Record<string, any>;
  requestId: string;
}

/**
 * API Proxy for n8n webhooks
 * Calls n8n from server-side, avoiding CORS issues on client-side
 */
export async function POST(request: NextRequest) {
  try {
    const body: WebhookRequestBody = await request.json();

    const { env, workflowType, userId, email, telegramId, message, requestId } = body;

    // Validate required fields
    if (!env || !workflowType || !userId || !email || !message || !requestId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Build the webhook URL
    const webhookUrl = WEBHOOK_URLS[env];
    if (!webhookUrl) {
      return NextResponse.json(
        { success: false, error: 'Invalid environment' },
        { status: 400 }
      );
    }

    // Build complete webhook payload
    const payload: WebhookRequest = {
      request_id: requestId,
      user_id: userId,
      email,
      telegram_id: telegramId,
      workflow_type: workflowType,
      timestamp: new Date().toISOString(),
      message,
    };

    // Call n8n webhook from server (no CORS issues)
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Webhook error: ${response.status} - ${errorText}`);
      return NextResponse.json(
        {
          success: false,
          requestId,
          queued: false,
          error: `HTTP ${response.status}: ${errorText}`,
        },
        { status: response.status }
      );
    }

    // Success
    return NextResponse.json({
      success: true,
      requestId,
      queued: true,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('Webhook proxy error:', errorMessage);
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

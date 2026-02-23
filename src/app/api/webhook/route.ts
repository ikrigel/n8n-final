import { NextRequest, NextResponse } from 'next/server';

// Webhook URLs for n8n
const WEBHOOK_URLS = {
  test: 'https://ikrigel4.app.n8n.cloud/webhook-test/32e4df61-486f-42a5-a2e8-5fb0d595417d',
  production: 'https://ikrigel4.app.n8n.cloud/webhook/32e4df61-486f-42a5-a2e8-5fb0d595417d',
};

/**
 * Webhook proxy - forwards requests to n8n from the server
 * This avoids CORS issues by making the n8n call server-side instead of from the browser
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { env = 'production', workflowType, userId, email, telegramId, message, requestId } = body;

    // Select webhook URL based on environment
    const webhookUrl = WEBHOOK_URLS[env as keyof typeof WEBHOOK_URLS] || WEBHOOK_URLS.production;

    // Forward the request to n8n
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workflow_type: workflowType,
        user_id: userId,
        email,
        telegram_id: telegramId,
        request_id: requestId,
        message,
      }),
    });

    // Check if n8n returned a binary response (image)
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('image')) {
      // If it's an image, return it as-is
      const blob = await response.arrayBuffer();
      return new NextResponse(blob, {
        status: response.status,
        headers: {
          'Content-Type': contentType,
        },
      });
    }

    // Otherwise, try to parse as JSON
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          success: false,
          error: `n8n webhook error: HTTP ${response.status} - ${errorText}`,
        },
        { status: response.status }
      );
    }

    // Return the JSON response from n8n
    const data = await response.json();
    return NextResponse.json(
      {
        success: true,
        requestId,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
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

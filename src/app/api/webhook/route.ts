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

    // Validate required fields
    if (!workflowType || !userId || !email || !message) {
      console.warn('Webhook proxy: Missing required fields', {
        hasWorkflowType: !!workflowType,
        hasUserId: !!userId,
        hasEmail: !!email,
        hasMessage: !!message
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: workflowType, userId, email, message',
        },
        { status: 400 }
      );
    }

    // Select webhook URL based on environment
    const webhookUrl = WEBHOOK_URLS[env as keyof typeof WEBHOOK_URLS] || WEBHOOK_URLS.production;
    console.log('Webhook proxy forwarding to:', webhookUrl, 'with env:', env);

    // Build request payload, filtering out undefined values
    // Transform message to nested structure expected by n8n Set node
    const payload: Record<string, any> = {
      workflow_type: workflowType,
      user_id: userId,
      email,
      request_id: requestId,
      message: {
        prompt: message,  // n8n Set node expects message.prompt
      },
    };

    // Only include telegram_id if it's defined
    if (telegramId !== undefined && telegramId !== null) {
      payload.telegram_id = telegramId;
    }

    console.log('Sending to n8n:', JSON.stringify(payload, null, 2));

    // Forward the request to n8n
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('n8n response status:', response.status, 'content-type:', response.headers.get('content-type'));

    // Check if n8n returned a binary response (image)
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('image')) {
      // If it's an image, return it as-is
      const blob = await response.arrayBuffer();
      console.log('Returning image response, size:', blob.byteLength);
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
      console.error('n8n error response:', response.status, errorText);
      return NextResponse.json(
        {
          success: false,
          error: `n8n workflow error: HTTP ${response.status} - ${errorText}`,
        },
        { status: response.status }
      );
    }

    // Return the JSON response from n8n
    const data = await response.json();
    console.log('n8n success response:', data);
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
    const errorStack = error instanceof Error ? error.stack : '';
    console.error('Webhook proxy error:', errorMessage);
    if (errorStack) console.error('Stack:', errorStack);
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

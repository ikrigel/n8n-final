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
    console.log('🔵 [WEBHOOK] Request received at', new Date().toISOString());

    const body = await request.json();
    console.log('🔵 [WEBHOOK] Raw body received:', JSON.stringify(body, null, 2));

    const { env = 'production', workflowType, userId, email, telegramId, message, requestId } = body;

    console.log('🔵 [WEBHOOK] Extracted fields:');
    console.log('  - workflowType:', workflowType);
    console.log('  - userId:', userId);
    console.log('  - email:', email);
    console.log('  - message:', message);
    console.log('  - telegramId:', telegramId);
    console.log('  - requestId:', requestId);
    console.log('  - env:', env);

    // Validate required fields
    if (!workflowType || !userId || !email || !message) {
      console.error('🔴 [WEBHOOK] Missing required fields!', {
        hasWorkflowType: !!workflowType,
        hasUserId: !!userId,
        hasEmail: !!email,
        hasMessage: !!message,
        receivedKeys: Object.keys(body)
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: workflowType, userId, email, message',
          received: Object.keys(body)
        },
        { status: 400 }
      );
    }

    // Select webhook URL based on environment
    const webhookUrl = WEBHOOK_URLS[env as keyof typeof WEBHOOK_URLS] || WEBHOOK_URLS.production;
    console.log('🔵 [WEBHOOK] Using URL:', webhookUrl, 'for env:', env);

    // Build request payload, filtering out undefined values
    // Handle both cases: message as string OR as nested object { prompt: "..." }
    let messagePayload: any;

    if (typeof message === 'string') {
      // If message is a string, nest it
      messagePayload = { prompt: message };
      console.log('🔵 [WEBHOOK] Message was string, nested to object');
    } else if (typeof message === 'object' && message !== null && 'prompt' in message) {
      // If message is already { prompt: "..." }, use as-is
      messagePayload = message;
      console.log('🔵 [WEBHOOK] Message already nested, using as-is');
    } else {
      // Fallback: treat entire message as prompt
      messagePayload = { prompt: JSON.stringify(message) };
      console.log('🔵 [WEBHOOK] Message was complex object, stringified');
    }

    // Build payload in the EXACT same format as the original working version
    const payload: Record<string, any> = {
      request_id: requestId,
      user_id: userId,
      email,
      telegram_id: telegramId || null,
      workflow_type: workflowType,
      timestamp: new Date().toISOString(),
      message: messagePayload,  // Use the correctly formatted message
    };

    console.log('🔵 [WEBHOOK] Transformed payload to send to n8n:');
    console.log(JSON.stringify(payload, null, 2));
    console.log('🔵 [WEBHOOK] Payload type check:');
    console.log('  - typeof payload:', typeof payload);
    console.log('  - JSON.stringify works:', !!JSON.stringify(payload));
    console.log('  - payload.message:', payload.message);
    console.log('  - payload.message.prompt:', payload.message?.prompt);

    // Forward the request to n8n
    console.log('🟡 [WEBHOOK] Sending to n8n...');
    const sendTime = Date.now();

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseTime = Date.now() - sendTime;
    console.log('🟡 [WEBHOOK] n8n response received in', responseTime, 'ms');
    console.log('🟡 [WEBHOOK] Status:', response.status);
    console.log('🟡 [WEBHOOK] Headers:', {
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length'),
      allHeaders: Array.from(response.headers.entries())
    });

    // Check if n8n returned a binary response (image)
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('image')) {
      // If it's an image, return it as-is
      const blob = await response.arrayBuffer();
      console.log('🟢 [WEBHOOK] Returning image response, size:', blob.byteLength, 'bytes');
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
      console.error('🔴 [WEBHOOK] n8n error response:');
      console.error('  - Status:', response.status);
      console.error('  - Content-Type:', contentType);
      console.error('  - Body:', errorText);
      console.error('  - Parsed attempt:', (() => {
        try {
          return JSON.parse(errorText);
        } catch {
          return 'Could not parse as JSON';
        }
      })());
      return NextResponse.json(
        {
          success: false,
          error: `n8n workflow error: HTTP ${response.status}`,
          details: errorText,
          requestPayload: payload
        },
        { status: response.status }
      );
    }

    // Return the JSON response from n8n
    const data = await response.json();
    console.log('🟢 [WEBHOOK] n8n success response:');
    console.log('  - Data type:', typeof data);
    console.log('  - Data:', JSON.stringify(data, null, 2));
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
    console.error('🔴 [WEBHOOK] Proxy error:');
    console.error('  - Message:', errorMessage);
    console.error('  - Type:', error instanceof Error ? error.constructor.name : typeof error);
    if (errorStack) {
      console.error('  - Stack:');
      errorStack.split('\n').forEach(line => console.error('    ', line));
    }
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        errorType: error instanceof Error ? error.constructor.name : typeof error,
      },
      { status: 500 }
    );
  }
}

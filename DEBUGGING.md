# POLO BANANA - Debugging Guide

## Current Issue: 500 Error from n8n Webhook

When attempting to generate images via `/generate/image`, the frontend receives a 500 error from the webhook proxy endpoint `/api/webhook`. The proxy is working correctly, but n8n is failing to execute the image generation workflow.

### Enhanced Debugging (Latest Changes)

The webhook proxy and image generation page now include comprehensive logging to help identify the issue:

#### Frontend Logging (`src/app/generate/image/page.tsx`)

Open your browser's Developer Console (F12) and look for these logs when generating an image:

```
📤 Sending image generation request: {
  env: "production" | "test",
  workflowType: "image",
  userId: "...",
  email: "...",
  message: { prompt: "..." },
  requestId: "..."
}

📥 Webhook response status: 500 | 200 | etc
❌ Webhook error response: [error text from n8n]
```

**What to look for:**
- Does `userId` show as "guest"? (indicates not authenticated)
- Is `email` the default "user@example.com"? (indicates not authenticated)
- What does the error response say?

#### Server-Side Logging (`src/app/api/webhook/route.ts`)

Check your Next.js server logs (terminal where you ran `npm run dev`):

```
Webhook proxy forwarding to: https://ikrigel4.app.n8n.cloud/webhook/[ID] with env: production

Sending to n8n: {
  "workflow_type": "image",
  "user_id": "...",
  "email": "...",
  "request_id": "...",
  "message": { "prompt": "..." }
}

n8n response status: 500 content-type: application/json

n8n error response: [detailed error from n8n workflow]
```

### Troubleshooting Steps

#### 1. Check if n8n Workflow is Enabled

**Location:** n8n Cloud Dashboard → Workflows → Image Generation

**Required:**
- Workflow should be in "Active" state (not disabled)
- All nodes should be properly connected
- No red warning badges on nodes

**If disabled:**
- Click the toggle to activate the workflow
- Save the workflow

#### 2. Verify Request Data Format

The webhook proxy sends this structure to n8n:

```json
{
  "workflow_type": "image",
  "user_id": "...",
  "email": "...",
  "request_id": "...",
  "message": {
    "prompt": "..."
  }
}
```

**In n8n, verify:**
- Your nodes are extracting data with correct paths:
  - `$json.message.prompt` (NOT `$json.body.message.prompt`)
  - `$json.user_id` (NOT `$json.body.user_id`)
  - `$json.workflow_type`

#### 3. Check OpenAI API Configuration

**In n8n:**
- Look for the "Generate an image" node (typically using OpenAI)
- Verify the API key is set and valid
- Verify the model is set (e.g., "dall-e-3")
- Check that your OpenAI account has available credits

**Common OpenAI Issues:**
- API key expired or rotated
- Account out of credits
- Rate limit exceeded
- Model unavailable in your region

#### 4. Test the Workflow Manually in n8n

**Steps:**
1. In n8n, open the Image Generation workflow
2. Click "Test workflow" or click the play button on the Webhook node
3. Send a test payload:

```json
{
  "workflow_type": "image",
  "user_id": "test-user",
  "email": "test@example.com",
  "request_id": "test-request-123",
  "message": {
    "prompt": "a red apple on a table"
  }
}
```

4. Watch the execution logs to see which node fails
5. If a node fails, hover over it to see the error message

#### 5. Check the Webhook Configuration

**In n8n webhook node:**
- Correct URL is configured (test or production)
- Method is set to POST
- Authentication (if enabled) is correct
- Response is configured (should be: "Always send response")

#### 6. Verify the Response Node

**Common issue:** "Respond to Webhook node is unused"

**Fix:**
- Ensure the final node in your workflow has a "Respond to Webhook" node connected
- The response node should receive data from the image generation node
- Configure it to respond with the generated image or a success message

### How to Read n8n Execution Logs

1. In n8n, go to **Executions** tab
2. Click the most recent failed execution (red badge)
3. Expand each node to see:
   - Input data received
   - Output data produced
   - Error messages (if any)
4. The first red node in the chain is where the error occurred

### Webhook Proxy Data Flow

```
Browser sends:
{
  env: "production",
  workflowType: "image",
  userId: "...",
  email: "...",
  message: { prompt: "..." },
  requestId: "..."
}
    ↓
API Proxy (/api/webhook) transforms to:
{
  workflow_type: "image",
  user_id: "...",
  email: "...",
  request_id: "...",
  message: { prompt: "..." }
}
    ↓
Sends to n8n Webhook URL
    ↓
n8n processes workflow (webhook node → extract → image gen → respond)
    ↓
Returns response (binary image or JSON error)
    ↓
Proxy returns to browser
    ↓
Frontend handles (displays image or shows error)
```

### Testing Locally

1. **Stop and restart the dev server:**
   ```bash
   npm run dev
   ```

2. **Open DevTools (F12) in browser**

3. **Go to image generation page:** http://localhost:3000/generate/image

4. **Enter a test prompt:** "a blue bird sitting on a branch"

5. **Click "Generate Image"**

6. **Check both:**
   - Browser console for frontend logs
   - Terminal/server logs for proxy logs

7. **Note what fails:**
   - If frontend logs look good but server logs show n8n error
   - Check n8n dashboard execution history for detailed error

### Testing with Different Environments

The proxy supports both "test" and "production" environments:

```javascript
// In src/app/generate/image/page.tsx, you can control the environment:
env: config.env  // This comes from ConfigContext
```

Both should use different n8n webhook URLs:
- **test:** `https://ikrigel4.app.n8n.cloud/webhook-test/[id]`
- **production:** `https://ikrigel4.app.n8n.cloud/webhook/[id]`

If one fails but the other works, the issue is specific to that n8n workflow.

### Next Steps if Still Stuck

If you've checked all the above and still see 500 errors:

1. **Get the exact n8n error:**
   - Look at n8n Executions → Latest failed execution
   - Copy the full error message from the failed node

2. **Check n8n logs directly:**
   - n8n Cloud → Monitor/Logs section
   - Look for entries matching your request_id

3. **Test with curl:**
   ```bash
   curl -X POST "https://ikrigel4.app.n8n.cloud/webhook/[id]" \
     -H "Content-Type: application/json" \
     -d '{
       "workflow_type": "image",
       "user_id": "test",
       "email": "test@example.com",
       "request_id": "test-123",
       "message": {"prompt": "test"}
     }'
   ```

4. **Verify webhook routing:**
   - In n8n, check if the Webhook node has routing logic
   - Verify it correctly routes "image" workflow type to the image generation nodes

5. **Check node configuration:**
   - Every node should have proper error handling
   - Look for unconnected outputs that might cause "workflow configuration error"

---

**Last Updated:** 2026-02-23
**Related Files:**
- `src/app/api/webhook/route.ts` — Webhook proxy
- `src/app/generate/image/page.tsx` — Image generation page
- `src/lib/webhooks.ts` — Webhook utilities

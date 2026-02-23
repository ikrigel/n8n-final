# Architecture & Data Flow

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Browser / Client                             │
├─────────────────────────────────────────────────────────────────┤
│                    POLO BANANA                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ React Components (Dashboard, Gallery, Settings, etc)      │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ React Contexts (Config, Logs, Auth)                      │   │
│  │ Custom Hooks (useGallery, useLogger, useAuth, etc)       │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓↑
                    (HTTP / HTTPS requests)
                              ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                   Next.js Backend (Vercel)                       │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ NextAuth API Handler (/api/auth/[...nextauth])              │ │
│ │ - Google OAuth authentication                               │ │
│ │ - JWT token management                                      │ │
│ │ - Session cookies                                           │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Web Hooks Client & Helpers                                  │ │
│ │ - Webhook request builder                                   │ │
│ │ - Response validation                                       │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
         ↓↑                                    ↓↑
    (OAuth2)                           (REST API)
         ↓↑                                    ↓↑
┌──────────────────┐          ┌────────────────────────────┐
│  Google OAuth    │          │  Supabase (PostgreSQL)     │
│  - Sign-in       │          ├────────────────────────────┤
│  - User profile  │          │ Tables:                    │
│  - Sessions      │          │ - tasks (workflow state)   │
└──────────────────┘          │ - gallery (media metadata) │
                              │ - profiles (user info)     │
                              ├────────────────────────────┤
                              │ Storage:                   │
                              │ - media bucket             │
                              │ - (for image/video files)  │
                              └────────────────────────────┘
                                       ↓↑
                              (Webhook callbacks)
                                       ↓↑
┌──────────────────────────────────────────────────────────┐
│              N8N Automation Platform                     │
├──────────────────────────────────────────────────────────┤
│ Workflows:                                               │
│ - Image generation (OpenAI, Nano Banana)                │
│ - Video generation (OpenAI, Nano Banana)                │
│ - Chat (voice & text responses)                         │
│ - Utility workflows (jokes, file upload, etc)           │
│ - Webhook triggers & response handling                  │
└──────────────────────────────────────────────────────────┘
```

## Component Architecture

### Pages (in `/src/app`)

```
/                     → Dashboard with quick actions
  /gallery            → Gallery with filtering & preview
  /settings           → Configuration & webhook testing
  /about              → About page
  /help               → Help & documentation
  /auth/signin        → Google OAuth sign-in
  /auth/error         → Authentication errors
  /api/auth/[...nextauth] → NextAuth API
```

### Components (in `/src/components`)

**Layout:**
- `Layout.tsx` - Main wrapper with nav & footer
- `NavBar.tsx` - Navigation with user menu
- `ThemeToggle.tsx` - Theme switcher

**Gallery:**
- `GalleryGrid.tsx` - Responsive grid display
- `GalleryFilters.tsx` - Filter controls
- `GalleryItemCard.tsx` - Individual item card
- `GalleryPreviewModal.tsx` - Fullscreen preview

**Settings:**
- `EnvSelector.tsx` - Environment toggle
- `WebhookTester.tsx` - Webhook testing
- `LogSettings.tsx` - Logging configuration

**Providers:**
- `Providers.tsx` - Context providers wrapper
- `AuthGuard.tsx` - Route protection

**Logs:**
- `LogsPanel.tsx` - Logs display with filtering

### Contexts (in `/src/contexts`)

**ConfigContext:**
- Manages: environment, theme, logging config
- Persists to: localStorage
- Updates via: `updateConfig()`

**LogsContext:**
- Manages: log entries array
- Persists to: localStorage
- Methods: `addLog()`, `clearLogs()`, `getLogs()`

**AuthContext:**
- Manages: user session info
- Sources: NextAuth session
- Values: `userId`, `userEmail`, `userName`, `isAuthenticated`

### Hooks (in `/src/hooks`)

**useTheme():**
- Get/set theme (light/dark/auto)
- Updates document attribute
- Persists to localStorage

**useGallery():**
- Manages gallery items
- Methods: `addItem()`, `filterItems()`, `getStats()`
- Persists to localStorage

**useLogger():**
- Create log entries
- Methods: `logInfo()`, `logError()`, `logDebug()`
- Sends to webhook if JSON logging enabled
- Persists to localStorage

**useSession():**
- Get NextAuth session
- Status: loading, authenticated, unauthenticated

**useAuth():**
- Wrapper around useSession
- Provides user info to whole app
- Fallback for unauthenticated state

**useSupabaseSync():**
- Register user in Supabase
- Create workflow tasks
- Poll for results
- Fetch gallery items

### Libraries (in `/src/lib`)

**webhooks.ts:**
- `sendWebhookRequest()` - Send to n8n
- `testGetWebhook()` - Test GET endpoint
- `testPostWebhook()` - Test POST endpoint

**localStorage.ts:**
- `saveConfig()`, `loadConfig()`
- `saveGalleryCache()`, `loadGalleryCache()`
- `saveLogs()`, `loadLogs()`
- `saveTheme()`, `loadTheme()`

**supabase.ts:**
- Supabase client initialization
- RLS-enforced queries

**supabase-helpers.ts:**
- `createRequestTask()` - Store workflow request
- `pollForResponse()` - Wait for completion
- `fetchGalleryItems()` - Get media from tasks
- `getUserTasks()` - Get recent tasks
- `registerUser()` - Register new user

### Types (in `/src/types`)

**Core Types:**
- `WorkflowType` - Union of all supported workflows
- `WebhookEnvironment` - 'test' | 'production'
- `LogEntry` - Logging structure
- `WebhookRequest` - Request to n8n
- `WebhookResponse` - Response from n8n
- `GalleryItem` - Media metadata
- `TaskRecord` - Supabase task row
- `AppConfig` - Configuration state

## Data Flow

### 1. User Authentication Flow

```
User visits app
    ↓
AuthGuard checks session
    ↓
No session? → Redirect to /auth/signin
    ↓
User clicks "Sign in with Google"
    ↓
NextAuth → Google OAuth flow
    ↓
User authorizes app
    ↓
JWT token created & stored in httpOnly cookie
    ↓
Register user in Supabase
    ↓
Redirect to home / dashboard
    ↓
AuthContext populated with user info
```

### 2. Webhook Request Flow

```
User clicks "Generate Image"
    ↓
Dashboard calls sendWebhookRequest()
    ↓
Build payload with:
  - workflow_type: 'image'
  - user_email: from AuthContext
  - message: { prompt: "..." }
  - request_id: UUID
    ↓
POST to n8n webhook URL
    ↓
Log entry created (if logging enabled)
    ↓
Create task record in Supabase
    ↓
Poll for response every 2 seconds
    ↓
Task status changes to 'completed'
    ↓
Fetch media_url from task record
    ↓
Add to gallery
    ↓
Display in Dashboard & Gallery
```

### 3. Gallery Data Flow

```
User visits /gallery
    ↓
useGallery loads from localStorage cache
    ↓
Display cached items immediately
    ↓
(Optional) Fetch fresh data from Supabase:
    ↓
fetchGalleryItems() queries tasks table
    ↓
Filter by:
  - user_email (RLS enforced)
  - status='completed'
  - type, env, date range (if specified)
    ↓
Transform task records to GalleryItems
    ↓
Apply client-side search filter
    ↓
Update cache in localStorage
    ↓
Update gallery state
    ↓
Re-render grid with filtered items
```

### 4. Logging Flow

```
Any action triggers logInfo/logError/logDebug
    ↓
Create LogEntry with:
  - id: UUID
  - level: 'info' | 'error' | 'debug'
  - message: string
  - meta: { request_id, ... }
  - timestamp: ISO string
    ↓
Add to LogsContext (memory)
    ↓
Persist to localStorage
    ↓
Display in LogsPanel (realtime)
    ↓
If JSON logging enabled:
  ↓
  Create webhook payload
  ↓
  POST to n8n with log data
```

## Database Schema

### Tasks Table

```
id (BIGINT PK)
email (TEXT, RLS filter)
telegram_id (BIGINT)
task_text (TEXT)
status ('pending' | 'completed' | 'failed')
created_at (TIMESTAMP)
completed_at (TIMESTAMP nullable)
request_id (UUID, linked to frontend)
webhook_type ('GET' | 'POST')
env ('test' | 'production')
workflow_type (e.g., 'image', 'video')
request_payload (JSONB)
response_payload (JSONB)
response_received_at (TIMESTAMP)
media_url (TEXT)
media_mime_type (TEXT)
```

### Gallery Table

```
id (UUID PK)
request_id (UUID FK → tasks)
user_email (TEXT, RLS filter)
type ('image' | 'video')
prompt (TEXT)
created_at (TIMESTAMP)
env ('test' | 'production')
webhook_type ('GET' | 'POST')
mime_type (e.g., 'image/jpeg')
url (TEXT)
signed_url (TEXT nullable)
file_name (TEXT)
```

## State Management

### Client-Side State

**localStorage:**
- `app_config` - User settings
- `app_logs` - Log entries (last 100)
- `gallery_cache` - Gallery items
- `app_theme` - Theme preference

**React Context:**
- `ConfigContext` - App config (theme, env, logging)
- `LogsContext` - Logs array & methods
- `AuthContext` - User session info

**React State (per component):**
- Form inputs
- Modal open/close
- Menu open/close
- Loading states

### Server-Side State

**Supabase (Database):**
- Tasks (workflow requests & results)
- Gallery metadata (media info)
- User registration

**NextAuth (Sessions):**
- JWT token in httpOnly cookie
- Session info in Redis (Vercel default)

**Supabase Storage:**
- Media files (images, videos)
- Public URLs for media

## Security Architecture

### Authentication

- Google OAuth via NextAuth
- JWT tokens signed with NEXTAUTH_SECRET
- Sessions stored in httpOnly cookies (CSRF safe)
- Session validation on every request

### Authorization (RLS)

- Supabase RLS on tasks & gallery tables
- User email from JWT used for filtering
- Users can only access their own records
- Storage policies enforce object ownership

### Data Protection

- HTTPS only (Vercel auto-enables)
- Database secrets never exposed to client
- Only anon key used in frontend
- Sensitive operations via API routes

### Validation

- TypeScript strict mode
- Zod/type checking on webhook responses
- Email validation for user registration
- UUID validation for request tracking

## Performance Optimizations

### Frontend

- Code splitting: Each page is own bundle
- Image optimization: Next.js Image component
- Lazy loading: Components load on demand
- Client-side caching: localStorage + memory

### Backend

- Database indexes on email, created_at
- Query optimization: Select only needed fields
- Connection pooling: Vercel serverless
- Edge Functions: For low-latency APIs (future)

### Caching

- localStorage for config (instant)
- In-memory state for UI (instant)
- Supabase cache via headers (browser)
- CDN caching via Vercel Edge Network

## Error Handling

### User-Facing Errors

- Try-catch blocks around API calls
- User-friendly error messages
- Fallback to localStorage data
- Error logging to dashboard

### Silent Logging

- Console errors for debugging
- Supabase error logs
- Vercel function logs
- Analytics for monitoring

## Scaling Considerations

### As Usage Grows

1. **Database Optimization**
   - Add database indexes
   - Implement query pagination
   - Archive old records

2. **Caching Strategy**
   - Add Redis cache layer
   - Implement CDN caching
   - Use Supabase Realtime for live updates

3. **Storage**
   - Implement S3 for media (vs Supabase)
   - Add image resizing/optimization
   - Implement cleanup jobs

4. **API Rate Limiting**
   - Webhook rate limits
   - Per-user request quotas
   - Prevent abuse

## Testing Strategy

### Unit Tests (Vitest)

- Utility functions (webhooks, helpers)
- Hooks (useGallery, useLogger)
- Components in isolation

### Integration Tests (Vitest + RTL)

- Component interactions
- Context provider behavior
- localStorage persistence

### E2E Tests (Playwright)

- Full user flows
- Multi-page navigation
- Webhook integration
- Auth flows

## Deployment Pipeline

```
Local Development
    ↓
GitHub Push
    ↓
Vercel Webhook Triggered
    ↓
Build: npm run build
    ↓
Test Build Output
    ↓
Deploy to Preview URL (PR)
    ↓
Manual Approval (optional)
    ↓
Deploy to Production
    ↓
Automatic Rollback on Failure
```

## Monitoring & Observability

### Logs

- Vercel Function logs
- Browser console logs
- Supabase query logs
- NextAuth debug logs

### Metrics

- Vercel Analytics (CWV, response time)
- Error rate & frequency
- Database query performance
- API response times

### Alerts

- Build failures
- Deployment errors
- High error rate
- Performance degradation

---

This architecture provides:

✅ Scalability - Can handle growth
✅ Security - User isolation via RLS
✅ Performance - Optimized caching
✅ Reliability - Error handling & fallbacks
✅ Maintainability - Clear separation of concerns
✅ Testability - Isolated units & integration tests

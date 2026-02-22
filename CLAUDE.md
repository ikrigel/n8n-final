# N8N SPA Frontend - Project Overview

## Project Summary

A production-ready Single Page Application (SPA) built with **Next.js 15 + TypeScript** that serves as a frontend for n8n automation workflows. The app enables users to trigger image/video generation, run various utility workflows, manage a gallery, and monitor logs—all via webhook integration with n8n.

**Deploy target:** Vercel

## Tech Stack

- **Framework:** Next.js 15 with App Router + TypeScript
- **Styling:** Tailwind CSS + CSS Variables (for theming)
- **State Management:** React Context (ConfigContext, LogsContext)
- **Database:** Supabase (PostgreSQL) for storing tasks and gallery metadata
- **Testing:**
  - Unit/Integration: Vitest + React Testing Library
  - E2E: Playwright
- **Code Quality:** ESLint + Prettier
- **Build Tools:** npm

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Dashboard / Home
│   ├── settings/page.tsx        # Settings
│   ├── gallery/page.tsx         # Gallery
│   ├── about/page.tsx           # About
│   ├── help/page.tsx            # Help
│   ├── layout.tsx               # Root layout
│   └── auth/...                 # Authentication pages (Gmail)
├── components/
│   ├── layout/                  # Layout components
│   │   ├── Layout.tsx
│   │   ├── NavBar.tsx
│   │   └── ThemeToggle.tsx
│   ├── gallery/                 # Gallery-related
│   │   ├── GalleryGrid.tsx
│   │   ├── GalleryFilters.tsx
│   │   ├── GalleryItemCard.tsx
│   │   └── GalleryPreviewModal.tsx
│   ├── logs/
│   │   └── LogsPanel.tsx
│   └── settings/                # Settings-related
│       ├── EnvSelector.tsx
│       ├── WebhookTester.tsx
│       └── LogSettings.tsx
├── contexts/
│   ├── ConfigContext.tsx        # App config, env, theme
│   └── LogsContext.tsx          # Logging state
├── hooks/
│   ├── useTheme.ts              # Theme logic
│   ├── useGallery.ts            # Gallery state + localStorage
│   └── useLogger.ts             # Logging logic
├── lib/
│   ├── webhooks.ts              # Webhook client (already started)
│   ├── localStorage.ts          # LocalStorage helpers
│   └── supabase*.ts             # Supabase client & helpers
├── types/
│   └── index.ts                 # Shared TypeScript types
└── __tests__/                   # Unit tests
    ├── lib/
    ├── hooks/
    └── components/

tests/                           # Playwright E2E tests
├── navigation.spec.ts
├── settings-webhook.spec.ts
├── gallery.spec.ts
└── theme.spec.ts

docs/
├── Claude.md                    # (this file)
├── Architecture.md
├── Gallery.md
├── Settings.md
└── Deployment.md
```

## Key Features

### 1. Dashboard / Home (`/`)
- Intro text about the app
- Quick action buttons:
  - Generate Image (GET)
  - Generate Video (POST)
  - Open Gallery
  - Open Settings
- **Logs Panel:** Shows recent log entries
- **Recent Media:** Displays last N generated images/videos

### 2. Settings (`/settings`)
- **Environment Selector:** Toggle between test and production
- **Webhook URLs:** Display GET/POST URLs (read-only)
- **Logging Options:**
  - Enable/disable logging
  - Log level selector (info | debug | error)
  - "Send logs as JSON to POST webhook" checkbox
- **Test Buttons:**
  - "Test GET Webhook" – calls the selected GET URL
  - "Test POST Webhook" – sends `{ message: "Test from frontend", timestamp, env }`
- **Console Panel:** Shows raw webhook responses
- **Persistence:** All settings saved to localStorage

### 3. Gallery (`/gallery`)
- **Responsive Grid:** Shows all generated images and videos
- **Item Card:** Displays thumbnail, type badge, timestamp, prompt, origin metadata
- **Filters:**
  - By media type (All | Images | Videos)
  - By environment (All | Test | Production)
  - By date range (from/to)
  - Text search (prompt/description)
- **Item Actions:**
  - Preview (fullscreen modal)
  - Download (browser download)
  - Copy URL (if available)
- **Persistence:** Gallery index stored in localStorage and Supabase

### 4. About (`/about`)
- Programmer bio section
- Display `public/pvlv.jpg` in a nice card
- App description: SPA frontend for n8n workflows (image/video generation via OpenAI, Nano Banana, Gemini)

### 5. Help (`/help`)
- Step-by-step usage guide
- Environment switching instructions
- Image/video generation walkthrough
- Gallery filter and download instructions
- Logging console usage
- Example JSON log payloads

### 6. Authentication
- Gmail registration flow (to be integrated)
- Session management via next-auth
- User context stored in React state and localStorage

## Webhook Payloads & Workflow Types

The app supports the following workflow types (sent in `payload.workflow_type`):

| Type | Trigger | Description |
|------|---------|-------------|
| `image` | POST | Generate image via OpenAI |
| `video` | POST | Generate video via OpenAI |
| `nanobananaimage` | POST | Generate image via Nano Banana |
| `nanobananavideo` | POST | Generate video via Nano Banana |
| `audio` | POST | Chat response as voice message |
| `question` | POST | Chat response as text message |
| `chucknorris` | GET/POST | Fetch random Chuck Norris joke from API |
| `dad` | GET/POST | Fetch random dad joke from API |
| `addfiletogoogledrive` | POST | Upload file to Google Drive |
| `log` | POST | Send structured logs to n8n |
| `test` | POST | Health check / test request |

**Note:** Workflows that don't return a webhook response should include an identifier (e.g., `request_id` in `message.return_to_frontend`) so n8n's `if` node can route responses back to the webhook endpoint instead of Telegram.

### Webhook URLs

- **Test GET:** `https://ikrigel4.app.n8n.cloud/webhook-test/48c78a6c-559b-4573-acc6-5ca425efd8cf`
- **Production GET:** `https://ikrigel4.app.n8n.cloud/webhook/48c78a6c-559b-4573-acc6-5ca425efd8cf`
- **Test POST:** `https://ikrigel4.app.n8n.cloud/webhook-test/32e4df61-486f-42a5-a2e8-5fb0d595417d`
- **Production POST:** `https://ikrigel4.app.n8n.cloud/webhook/32e4df61-486f-42a5-a2e8-5fb0d595417d`

## Data Persistence

### localStorage
- App configuration (env, theme, logging options)
- Gallery index (metadata only, not blobs—use Supabase Storage for media)
- Logs (recent entries)

### Supabase
- **tasks** table: Workflow requests and their status (already exists)
- **gallery** table (to be created): Gallery item metadata
- **profiles** table (if needed): User information

## Theming

- **Modes:** light | dark | auto
- **Implementation:** CSS variables + data-theme attribute on root element
- **Persistence:** Theme choice saved to localStorage
- **Theme Switcher:** Sun/Moon/Auto icons in top nav

## Testing Strategy

### Vitest (Unit/Integration Tests)

**src/__tests__/lib/webhooks.test.ts**
- Test URL building for test vs production
- Test JSON body serialization for POST
- Mock fetch for success/error responses

**src/__tests__/hooks/useGallery.test.ts**
- Test adding items to gallery
- Test filtering by type and env
- Test localStorage persistence

**src/__tests__/hooks/useLogger.test.ts**
- Test logging with info/error levels
- Test JSON logging enabled
- Mock POST webhook calls

**src/__tests__/components/**
- GalleryFilters: Test filter callbacks
- LogsPanel: Test rendering and level filtering
- Settings page: Test env toggle and localStorage

### Playwright (E2E Tests)

**tests/navigation.spec.ts**
- Verify all navigation links work
- Check page headings and content

**tests/settings-webhook.spec.ts**
- Toggle env selector
- Test GET/POST webhook buttons with mocked responses
- Verify settings persist after reload

**tests/gallery.spec.ts**
- Pre-seed localStorage with test items
- Test filter functionality
- Test preview modal open/close

**tests/theme.spec.ts**
- Toggle light/dark/auto themes
- Assert theme class/attribute changes

## Code Guidelines

### File Size Limit
- **Maximum: 250 lines per file** (TS/TSX/JS/JSX)
- If approaching 230 lines, split into smaller components, hooks, or utilities
- Comments should clarify logic where not self-evident

### Naming Conventions
- **Components:** PascalCase (e.g., `GalleryGrid.tsx`)
- **Hooks:** camelCase with `use` prefix (e.g., `useGallery.ts`)
- **Types/Interfaces:** PascalCase (e.g., `GalleryItem`)
- **Utility functions:** camelCase (e.g., `buildWebhookURL`)

### Imports
- Use absolute imports: `@/components/...`, `@/lib/...`, `@/types`
- Avoid relative paths when possible

## Development Workflow

### Setup
```bash
npm install
```

### Development
```bash
npm run dev
# Open http://localhost:3000
```

### Testing
```bash
# Unit tests (watch mode)
npm run test:unit

# E2E tests
npm run test:e2e

# UI test dashboard
npm run test:ui
```

### Linting & Formatting
```bash
npm run lint
# Fix with: npm run lint -- --fix

# Format with Prettier (configured in .prettierrc)
npx prettier --write "src/**/*.{ts,tsx,js,jsx}"
```

### Build
```bash
npm run build
npm start
```

## Environment Variables

Create `.env.local` in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# NextAuth (for Gmail OAuth)
NEXTAUTH_SECRET=<generate-with: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000  # Change for production

# Gmail OAuth (create in Google Cloud Console)
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

## Deployment to Vercel

1. Push repo to GitHub
2. Import project in Vercel dashboard
3. Set environment variables (see above)
4. Deploy
5. Update `NEXTAUTH_URL` in Vercel settings

## Next Steps (Implementation Order)

1. **Contexts & Hooks** (Priority 1)
   - [ ] ConfigContext – app config, env, theme
   - [ ] LogsContext – logging state
   - [ ] useTheme hook
   - [ ] useGallery hook
   - [ ] useLogger hook
   - [ ] localStorage helpers

2. **Layout & Navigation** (Priority 2)
   - [ ] Root layout.tsx with providers
   - [ ] NavBar with theme toggle
   - [ ] Layout wrapper

3. **Pages** (Priority 3)
   - [ ] Dashboard / home page
   - [ ] Settings page
   - [ ] Gallery page
   - [ ] About page
   - [ ] Help page

4. **Components** (Priority 4)
   - [ ] GalleryGrid, GalleryFilters, GalleryItemCard, GalleryPreviewModal
   - [ ] LogsPanel
   - [ ] EnvSelector, WebhookTester, LogSettings

5. **Authentication** (Priority 5)
   - [ ] NextAuth setup
   - [ ] Gmail OAuth flow
   - [ ] Session management

6. **Testing** (Priority 6)
   - [ ] Vitest unit tests
   - [ ] Playwright E2E tests

7. **Documentation** (Priority 7)
   - [ ] Architecture.md
   - [ ] Gallery.md
   - [ ] Settings.md
   - [ ] Deployment.md

## Notes for Future Work

- All code should include clarifying remarks where logic isn't self-evident
- If more information or decisions are needed, clarify with the user before implementing
- Consult with user about n8n or Supabase schema changes if required
- Keep in sync with n8n workflow requirements
- Ensure every webhook response includes `request_id` for proper tracking
- Gallery items should support both direct URLs and signed Supabase URLs for private content

---

**Last Updated:** February 2026
**Status:** Initial setup complete. Ready for implementation.

# Next Steps - N8N SPA Frontend

## 🎯 Current Status

✅ **Phase 1 Complete:** Core application built and tested
- All pages implemented
- All components created
- Styling complete
- Build successful

## 🚀 Getting Started

### 1. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see:
- ✅ Home page with quick action buttons
- ✅ Responsive navigation bar
- ✅ Theme toggle (sun/moon/auto icons)
- ✅ All 5 pages accessible from nav

### 2. Test the UI
- Navigate through all pages
- Try toggling the theme
- Test the environment selector in Settings
- Try the webhook test buttons (will fail since n8n webhooks aren't loaded)
- Add test items to gallery manually (via browser dev tools localStorage)

## 📋 Phase 2: Authentication Setup

### Install NextAuth
```bash
npm install next-auth@beta
npm install -D @types/next-auth
```

### Create Auth Configuration
1. **Get OAuth Credentials**
   - Create Google OAuth app: https://console.cloud.google.com
   - Get Client ID and Secret
   - Set authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

2. **Create `src/auth.ts`**
```typescript
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
})
```

3. **Create `src/app/api/auth/[...nextauth]/route.ts`**
```typescript
import { handlers } from "@/auth"
export const { GET, POST } = handlers
```

4. **Update `src/app/layout.tsx`**
```typescript
import { SessionProvider } from "next-auth/react"
// Add SessionProvider around children
```

5. **Set Environment Variables** in `.env.local`
```
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
```

## 🗄️ Phase 3: Supabase Setup

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com)
- Create new project
- Note your project URL and anon key

### 2. Update Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

### 3. Create Database Tables

**Run in Supabase SQL Editor:**

```sql
-- Gallery table (new)
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  prompt TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  env TEXT NOT NULL CHECK (env IN ('test', 'production')),
  webhook_type TEXT NOT NULL CHECK (webhook_type IN ('GET', 'POST')),
  mime_type TEXT NOT NULL,
  url TEXT,
  signed_url TEXT,
  file_name TEXT NOT NULL,
  user_email TEXT NOT NULL
);

-- Enable RLS
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own items
CREATE POLICY "Users can view their own gallery items" ON public.gallery
  FOR SELECT USING (auth.jwt() ->> 'email' = user_email);

-- Policy: Users can insert their own items
CREATE POLICY "Users can insert their own gallery items" ON public.gallery
  FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = user_email);

-- Policy: Users can update their own items
CREATE POLICY "Users can update their own gallery items" ON public.gallery
  FOR UPDATE USING (auth.jwt() ->> 'email' = user_email);

-- Policy: Users can delete their own items
CREATE POLICY "Users can delete their own gallery items" ON public.gallery
  FOR DELETE USING (auth.jwt() ->> 'email' = user_email);
```

## 🧪 Phase 4: Testing

### Vitest (Unit Tests)
```bash
npm run test:unit
```

Create tests in `src/__tests__/`:
- `lib/webhooks.test.ts` - Webhook client tests
- `hooks/useGallery.test.ts` - Gallery hook tests
- `hooks/useLogger.test.ts` - Logger hook tests
- `components/LogsPanel.test.tsx` - Component tests

### Playwright (E2E Tests)
```bash
npm run test:e2e
```

Create tests in `tests/`:
- `navigation.spec.ts` - Page navigation
- `settings-webhook.spec.ts` - Settings functionality
- `gallery.spec.ts` - Gallery filtering
- `theme.spec.ts` - Theme switching

## 🌐 Phase 5: Deployment to Vercel

### 1. Push to GitHub
```bash
git remote add origin https://github.com/your-username/n8n-spa.git
git branch -M main
git push -u origin main
```

### 2. Deploy via Vercel
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Set environment variables in Vercel dashboard:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL` (your Vercel domain)
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`

### 3. Update OAuth Redirect URI
- Update Google OAuth app with Vercel domain
- Redirect URI: `https://your-vercel-domain.vercel.app/api/auth/callback/google`

## 📚 Key Files to Modify

### User Session Integration
Replace "guest" with real session in:
- `src/app/page.tsx` line 46
- `src/hooks/useLogger.ts` lines 27, 54
- Any other hardcoded user references

Use NextAuth session:
```typescript
import { useSession } from "next-auth/react"

const { data: session } = useSession()
const userId = session?.user?.id || 'guest'
const userEmail = session?.user?.email || 'user@example.com'
```

### Supabase Integration
Update `src/hooks/useGallery.ts` to sync with Supabase:
```typescript
// Load from Supabase
const { data } = await supabase
  .from('gallery')
  .select('*')
  .eq('user_email', userEmail)

// Save to Supabase
await supabase
  .from('gallery')
  .insert([item])
```

## 🔐 Environment Variables Checklist

### Required for Production
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `NEXTAUTH_SECRET`
- [ ] `NEXTAUTH_URL` (Vercel domain)
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`

### Optional
- [ ] `NEXT_PUBLIC_API_URL` (if using custom API)
- [ ] `LOG_LEVEL` (if implementing server-side logging)

## 📖 Quick Reference

### Build Commands
```bash
npm run dev       # Development server
npm run build     # Production build
npm run start     # Run production build
npm run lint      # Lint with ESLint
npm run test:unit # Run Vitest
npm run test:e2e  # Run Playwright
npm run test:ui   # Vitest UI dashboard
```

### Project Structure
```
src/
├── app/          # Pages and routes
├── components/   # React components
├── contexts/     # React Context providers
├── hooks/        # Custom React hooks
├── lib/          # Utilities and clients
├── types/        # TypeScript types
└── styles/       # Global styles
```

## 🐛 Troubleshooting

**Issue:** Settings not persisting
- Solution: Check browser localStorage is enabled (F12 > Application > Local Storage)

**Issue:** Webhook tests fail
- Solution: Verify n8n webhooks are active in n8n editor
- Check environment selection (test vs production)

**Issue:** Build fails
- Solution: Run `npm install` to ensure all dependencies
- Delete `.next` folder and rebuild

**Issue:** Auth not working
- Solution: Ensure environment variables are set correctly
- Check Google OAuth credentials in console

## ✨ Tips

1. **Test locally first** - Use `npm run dev` before deploying
2. **Use devtools** - Browser DevTools helps debug context/state
3. **Check logs** - Browser console and Logs panel show useful info
4. **Read Help page** - `/help` has comprehensive documentation
5. **Ask questions** - If anything is unclear, refer to CLAUDE.md

## 📞 Need Help?

- **Documentation:** See `CLAUDE.md` and `PROGRESS.md`
- **Usage Guide:** Visit `/help` page in the app
- **Code Examples:** Check component implementations
- **TypeScript Types:** See `src/types/index.ts`

---

**Good luck! You've got this! 🚀**

Next milestone: Get authentication working!

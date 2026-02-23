# Deployment Guide - Vercel

## Overview

Deploy POLO BANANA to Vercel in minutes with automatic CI/CD, domain management, and analytics.

## Prerequisites

Before deploying, ensure you have:

- ✅ GitHub repository with your code pushed
- ✅ Supabase project created with tables set up
- ✅ Google OAuth credentials created
- ✅ All environment variables configured locally and tested

## Step 1: Push Code to GitHub

```bash
# Add remote if not already done
git remote add origin https://github.com/your-username/n8n-spa.git
git branch -M main
git push -u origin main

# Or update if already connected
git push origin main
```

## Step 2: Connect to Vercel

### Option A: Via Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in with GitHub
3. Click **"Add New..."** → **"Project"**
4. Select your GitHub repository: `n8n-spa`
5. Vercel auto-detects Next.js configuration ✅
6. Click **"Deploy"** (no other config needed yet)

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts:
# - Scope: your-account
# - Link to existing project? No
# - Project name: n8n-spa
# - Directory: ./
# - Override settings? No
```

## Step 3: Configure Environment Variables

After initial deployment, add environment variables:

### In Vercel Dashboard

1. Go to your project → **Settings** → **Environment Variables**
2. Add each variable:

| Name | Value | Notes |
|------|-------|-------|
| `NEXTAUTH_SECRET` | Generate with: `openssl rand -base64 32` | Required for sessions |
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` | Update after custom domain |
| `GOOGLE_CLIENT_ID` | Your Google OAuth Client ID | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth Secret | Keep secret! |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | From Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | From Supabase |

### Generate NEXTAUTH_SECRET

```bash
# macOS/Linux/WSL
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Step 4: Update Google OAuth

The Google OAuth redirect URI needs to match your Vercel domain.

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Under **Authorized redirect URIs**, add:
   - `https://your-domain.vercel.app/api/auth/callback/google`
   - `https://your-project-staging.vercel.app/api/auth/callback/google` (optional, for preview)
6. Click **Save**

## Step 5: Redeploy with Environment Variables

Vercel will auto-redeploy when you add environment variables. Wait for the deployment to complete.

1. Go to **Deployments** tab
2. Wait for latest deployment to show **✅ Ready**
3. Click the preview link to test

## Step 6: Test the Deployment

### Test Sign-In Flow

1. Open your deployed URL
2. You should be redirected to sign-in
3. Click "Sign in with Google"
4. Complete OAuth flow
5. Should redirect to Dashboard

### Test Webhook Integration

1. On Dashboard, click "Generate Image"
2. Check browser console for logs
3. Verify request is sent to n8n webhook
4. Check Supabase for task record

### Test Gallery

1. After generation completes, go to **Gallery**
2. Should show generated media items
3. Test filters and download

## Step 7: Connect Custom Domain (Optional)

### Add Custom Domain

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Enter your domain: `myapp.com`
3. Follow DNS instructions for your registrar
4. Update `NEXTAUTH_URL` environment variable to `https://myapp.com`

### DNS Setup (Example: Namecheap)

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: ALIAS/ANAME (for root domain)
Name: @
Value: alias.vercel-dns.com
```

## Step 8: Monitor Deployment

### Check Build Logs

1. Go to **Deployments** tab
2. Click on a deployment
3. Check **Build Logs** for errors

### View Analytics

1. Go to **Analytics** tab
2. Monitor:
   - Page views and users
   - Response time
   - Errors
   - Core Web Vitals

### Monitor Errors

1. Go to **Monitoring** tab
2. View error logs
3. Set up alerts if needed

## Common Issues & Solutions

### "Missing environment variables"

**Solution:** Add all required variables in Vercel dashboard, then redeploy.

```bash
vercel env list  # View configured vars
```

### "Google OAuth redirect URI mismatch"

**Solution:** Update both:
1. Google Cloud Console (add Vercel domain)
2. Vercel environment variables (`NEXTAUTH_URL`)

### "Supabase connection fails"

**Solution:** Verify:
- `NEXT_PUBLIC_SUPABASE_URL` is correct
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is valid
- Supabase RLS policies allow public access
- Test in Supabase SQL editor

### "Sign-in loops infinitely"

**Solution:**
1. Clear browser cookies for the domain
2. Check `NEXTAUTH_SECRET` is set
3. Ensure `NEXTAUTH_URL` matches domain exactly
4. Check NextAuth logs in browser console

### "Build times out"

**Solution:**
1. Check for long-running operations
2. Increase timeout in `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next",
      "config": {
        "maxLambdaSize": "50mb"
      }
    }
  ]
}
```

## Rollback & Deployment History

### View Deployment History

1. Go to **Deployments** tab
2. Click on any previous deployment
3. Click **"Promote to Production"** to rollback

### Automatic Rollback

Vercel auto-detects build failures and keeps previous version running.

## Performance Optimization

### Enable Image Optimization

Next.js image optimization is enabled by default.

### Edge Caching

```javascript
// In any page or component
export const revalidate = 3600; // Cache for 1 hour
```

### Monitor Performance

1. Go to **Analytics** tab
2. Check **Core Web Vitals**
3. View PageSpeed Insights recommendations

## CI/CD Workflow

### GitHub → Vercel Auto-Deploy

Every push to `main` branch:
1. Vercel detects git push
2. Runs build command: `npm run build`
3. Tests Next.js build
4. Deploys on success
5. Rolls back on failure

### Skip Deployment

Add `[skip ci]` to commit message:

```bash
git commit -m "docs: update README [skip ci]"
```

### Deploy Preview for Pull Requests

Every PR automatically gets:
- Preview URL: `https://n8n-spa-pr-123.vercel.app`
- Automatic comment on PR with preview link
- Automatic cleanup when PR closes

## Environment Secrets Best Practices

✅ **Do:**
- Use Vercel's environment variable UI (UI-only variables)
- Rotate `GOOGLE_CLIENT_SECRET` periodically
- Review who has access to Production variables
- Use different secrets for staging vs production

❌ **Don't:**
- Commit `.env.local` to git
- Share secrets in code or comments
- Use same secrets for all environments
- Log sensitive values

## Monitoring & Alerts

### Enable Email Alerts

1. Go to **Settings** → **Notifications**
2. Enable:
   - Build failures
   - Performance alerts
   - Security alerts

### Set Up Custom Alerts

Via Slack, PagerDuty, or email:

1. Go to **Settings** → **Alerts**
2. Configure notification channels
3. Set thresholds

## Scaling & Limits

### Vercel Deployment Limits

- **Build time**: 45 minutes (Pro: 1 hour)
- **Lambda size**: 50MB (Pro: 250MB)
- **Edge Functions**: 10MB
- **Serverless Functions**: Per plan

### Optimize for Vercel

```typescript
// Use Edge Functions for low-latency APIs
export const config = {
  runtime: 'edge',
};

export default function handler(req: Request) {
  return new Response('Hello from Edge!');
}
```

## Security Checklist

Before going to production:

- [ ] All environment variables configured
- [ ] Google OAuth domain verified
- [ ] Supabase RLS policies enabled
- [ ] NEXTAUTH_SECRET is strong (32+ chars)
- [ ] NEXTAUTH_URL matches deployed domain
- [ ] No secrets in source code
- [ ] CORS configured correctly
- [ ] Rate limiting enabled (if needed)
- [ ] SSL certificate auto-enabled
- [ ] DDoS protection via Vercel

## Maintenance

### Regular Updates

```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Update major versions carefully
npm install next@latest

# Test locally
npm run build
npm run dev

# Deploy
git push origin main
```

### Monitor Third-Party Services

- Supabase status: https://status.supabase.com
- Google Cloud status: https://status.cloud.google.com
- N8N workflows: Check n8n editor

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **NextAuth Docs**: https://next-auth.js.org
- **Supabase Docs**: https://supabase.com/docs

---

**Next Steps:**

1. ✅ Deploy to Vercel
2. ✅ Configure environment variables
3. ✅ Update Google OAuth
4. ✅ Test sign-in flow
5. ✅ Monitor analytics
6. 🚀 Share with users!

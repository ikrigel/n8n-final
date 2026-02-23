# Supabase Setup Guide

## Overview

This guide walks through setting up Supabase for the N8N SPA Frontend with proper table schemas, Row Level Security (RLS) policies, and Storage configuration.

## Step 1: Create Supabase Project

1. Visit [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in details:
   - Name: `n8n-spa` (or your preference)
   - Database Password: Generate a strong password
   - Region: Choose closest to your location
5. Click "Create new project" and wait for provisioning

## Step 2: Get Credentials

After project is created:

1. Go to **Settings** → **API**
2. Copy:
   - `Project URL` → Save as `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → Save as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Add to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 3: Create Tables

### Option A: Via SQL Editor (Recommended)

1. Go to **SQL Editor** in Supabase dashboard
2. Click **New Query**
3. Copy and paste the entire SQL schema below
4. Click **Run**

### Option B: Using supabase CLI

```bash
npx supabase link --project-ref your-project-id
npx supabase db push
```

### SQL Schema

```sql
-- Create tasks table (for storing workflow requests and results)
CREATE TABLE IF NOT EXISTS public.tasks (
  id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  telegram_id BIGINT,
  task_text TEXT NOT NULL,
  status CHARACTER VARYING DEFAULT 'pending'::CHARACTER VARYING,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  request_id UUID UNIQUE,
  webhook_type CHARACTER VARYING DEFAULT 'POST'::CHARACTER VARYING,
  env CHARACTER VARYING DEFAULT 'production'::CHARACTER VARYING,
  workflow_type TEXT,
  request_payload JSONB,
  response_payload JSONB,
  response_received_at TIMESTAMP WITH TIME ZONE,
  media_url TEXT,
  media_mime_type TEXT
);

-- Create gallery table (for storing media metadata)
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  request_id UUID NOT NULL REFERENCES public.tasks(request_id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  prompt TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  env TEXT NOT NULL DEFAULT 'production',
  webhook_type TEXT NOT NULL DEFAULT 'POST',
  mime_type TEXT NOT NULL DEFAULT 'image/jpeg',
  url TEXT,
  signed_url TEXT,
  file_name TEXT NOT NULL,
  UNIQUE(request_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_email ON public.tasks(email);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON public.tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_gallery_email ON public.gallery(user_email);
CREATE INDEX IF NOT EXISTS idx_gallery_env ON public.gallery(env);

-- Enable RLS on tables
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can view own gallery" ON public.gallery;
DROP POLICY IF EXISTS "Users can insert own gallery" ON public.gallery;
DROP POLICY IF EXISTS "Users can update own gallery" ON public.gallery;
DROP POLICY IF EXISTS "Users can delete own gallery" ON public.gallery;

-- Tasks RLS Policies
-- Policy: Users can view their own tasks
CREATE POLICY "Users can view own tasks" ON public.tasks
  FOR SELECT
  USING (auth.jwt() ->> 'email' = email);

-- Policy: Users can insert their own tasks
CREATE POLICY "Users can insert own tasks" ON public.tasks
  FOR INSERT
  WITH CHECK (auth.jwt() ->> 'email' = email);

-- Policy: Users can update their own tasks
CREATE POLICY "Users can update own tasks" ON public.tasks
  FOR UPDATE
  USING (auth.jwt() ->> 'email' = email)
  WITH CHECK (auth.jwt() ->> 'email' = email);

-- Policy: Users can delete their own tasks
CREATE POLICY "Users can delete own tasks" ON public.tasks
  FOR DELETE
  USING (auth.jwt() ->> 'email' = email);

-- Gallery RLS Policies
-- Policy: Users can view their own gallery items
CREATE POLICY "Users can view own gallery" ON public.gallery
  FOR SELECT
  USING (auth.jwt() ->> 'email' = user_email);

-- Policy: Users can insert their own gallery items
CREATE POLICY "Users can insert own gallery" ON public.gallery
  FOR INSERT
  WITH CHECK (auth.jwt() ->> 'email' = user_email);

-- Policy: Users can update their own gallery items
CREATE POLICY "Users can update own gallery" ON public.gallery
  FOR UPDATE
  USING (auth.jwt() ->> 'email' = user_email)
  WITH CHECK (auth.jwt() ->> 'email' = user_email);

-- Policy: Users can delete their own gallery items
CREATE POLICY "Users can delete own gallery" ON public.gallery
  FOR DELETE
  USING (auth.jwt() ->> 'email' = user_email);
```

## Step 4: Create Storage Bucket

1. Go to **Storage** in Supabase dashboard
2. Click **Create new bucket**
3. Name: `media`
4. **Uncheck** "Private bucket" (make it public)
5. Click **Create bucket**
6. Click on `media` bucket
7. Go to **Policies** tab
8. Add public policy:
   - Click **New policy**
   - Select **For full customization**
   - Paste this policy:

```sql
-- Allow public read access
CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'media');

-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated users to upload" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'media'
    AND auth.role() = 'authenticated'
  );

-- Allow users to delete their own files
CREATE POLICY "Allow users to delete own files" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'media'
    AND auth.uid() = owner
  );
```

## Step 5: Verify Setup

Test the connection:

```bash
npm run dev
```

In browser console, test:

```javascript
// Test Supabase connection
import { supabase } from '@/lib/supabase';
const { data, error } = await supabase.from('tasks').select('count()');
console.log('Connection test:', { data, error });
```

## Step 6: Update App Configuration

No additional configuration needed! The app will:

1. Auto-register users on first sign-in via `registerUser()`
2. Store workflow requests in `tasks` table
3. Poll for results automatically
4. Fetch gallery items from `tasks` table
5. Store media URLs in `media_url` field

## API Functions

The app uses these Supabase helper functions (see `src/lib/supabase-helpers.ts`):

- `createRequestTask()` - Store new workflow request
- `pollForResponse()` - Wait for workflow completion
- `fetchGalleryItems()` - Get user's completed workflows
- `getUserTasks()` - Get recent tasks for dashboard
- `registerUser()` - Register user on first sign-in
- `getStorageUrlBase()` - Get media storage URL

## Troubleshooting

### RLS Policy Errors
- Ensure `auth.jwt() ->> 'email'` is used (not `auth.user_id`)
- Check that user email from JWT matches `email` column
- Test policies with `EXPLAIN (ANALYZE)` in SQL editor

### Storage Upload Failing
- Verify bucket name is `media` (lowercase)
- Check bucket is public (not private)
- Ensure file path includes email folder: `media/{env}/{sanitized-email}/file.jpg`

### No Data Returned
- Verify RLS policies are enabled
- Check user email is in the records
- Check `created_at` timestamps are recent
- Look at Postgres logs in Supabase

## Security Considerations

- ✅ RLS enforces user isolation via email matching
- ✅ anon key has read-only access to public data
- ✅ User can only modify their own records
- ✅ Media storage is public-read only
- ✅ NextAuth ensures authenticated JWT is valid

## Next Steps

Once Supabase is set up:

1. Test auth flow: Sign in with Google
2. Generate an image - should create task record
3. Check Tasks table for new records
4. View Gallery - should show your media

## Support

For Supabase issues:
- https://supabase.com/docs
- https://supabase.com/docs/guides/auth
- https://supabase.com/docs/guides/realtime

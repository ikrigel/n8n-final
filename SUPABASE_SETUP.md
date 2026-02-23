# Supabase Storage Setup Guide

The gallery system requires a Supabase Storage bucket called "media" to store generated images. Follow these steps to set it up.

## Step 1: Create the Storage Bucket

1. Go to your Supabase project: https://app.supabase.com
2. Click **Storage** in the left sidebar
3. Click **Create a new bucket**
4. **Bucket name:** `media`
5. **Public bucket:** ✅ **CHECK THIS BOX** (required for public URLs)
6. Click **Create bucket**

## Step 2: Configure Bucket Policies (RLS)

1. Click on the **media** bucket you just created
2. Go to the **Policies** tab
3. Click **New Policy** → **For full customization**
4. **Name:** `Allow public inserts`
5. **Statement:** Choose `INSERT`
6. **Target roles:** Select all (or `anon`)
7. **USING expression:** Leave blank or use `true`
8. **WITH CHECK expression:** Leave blank or use `true`
9. Click **Review**
10. Click **Save policy**

This allows authenticated users (with anon key) to upload files.

## Step 3: Verify Environment Variables

Check your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Where to find these:**
1. Go to Supabase Project Settings → **API**
2. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **Anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 4: Test the Upload

1. Restart your dev server: `npm run dev`
2. Go to **http://localhost:3000/generate/image**
3. Generate an image with prompt "test sheep"
4. Check browser console (F12) for these logs:

### Success logs should show:
```
💾 Starting Supabase upload: {
  fileName: "polo-banana-abc12345.png",
  blobSize: 1700000,
  blobType: "image/png",
  userEmail: "your-email@gmail.com",
  env: "production"
}
📤 Uploading image to Supabase Storage: media/production/user-email-com/polo-banana-abc12345.png
  - Blob size: 1700000 bytes
  - Blob type: image/png
✅ File uploaded to storage: {...}
✅ Public URL generated: https://your-project.supabase.co/storage/v1/object/public/media/...
✅ Image saved to gallery and localStorage
✅ Image saved to gallery and Supabase Storage!
```

### If upload fails, check the error message:

| Error | Solution |
|-------|----------|
| `Bucket "media" not found` | Create the bucket (Step 1) |
| `Permission denied` | Enable public bucket or fix RLS policies (Step 2) |
| `Not authenticated` | Check SUPABASE_ANON_KEY in .env.local (Step 3) |

## Step 5: Verify in Supabase Dashboard

1. Go to Supabase → **Storage** → **media** bucket
2. You should see folder structure like:
   ```
   media/
   ├── production/
   │   └── user-email-com/
   │       └── polo-banana-abc12345.png
   └── test/
       └── user-email-com/
           └── polo-banana-xyz12345.png
   ```

3. Click any image to verify it's publicly accessible

## Troubleshooting

### Images are generated but not saved
- Check browser console for upload error message
- Follow solution from the error table above

### "Bucket not found" error
- Verify bucket name is exactly `media` (case-sensitive)
- Make sure you created it in Storage, not Database

### "Permission denied" error
- Go to bucket settings → check **Public bucket** is enabled
- Or add the INSERT policy from Step 2

### URLs aren't working
- Verify the bucket is marked as **Public**
- Check that public access is enabled in bucket settings

## Storage Limits

- **Free tier:** 100MB total storage
- **Realistic capacity:** 50-100 images (1-2MB average per image)
- **Monitor usage:** Gallery page shows "Storage Usage" bar

## After Setup

Once configured, images will:
1. ✅ Auto-save to Supabase Storage after generation
2. ✅ Show in Gallery page immediately
3. ✅ Be deletable from the gallery
4. ✅ Have public URLs for sharing
5. ✅ Support download and export


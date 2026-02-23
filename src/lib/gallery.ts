// Gallery file management - Supabase Storage uploads with localStorage metadata index
import { supabase } from '@/lib/supabase';

export interface GalleryItemMetadata {
  id: string; // UUID
  requestId: string;
  type: 'image' | 'video';
  prompt: string;
  createdAt: string; // ISO timestamp
  env: 'test' | 'production';
  userEmail: string;
  storagePath: string; // Path in Supabase Storage
  publicUrl: string; // Signed or public URL
  mimeType: string;
  fileName: string;
  fileSizeBytes: number;
}

const GALLERY_INDEX_KEY = 'gallery_index_v1';

/**
 * Save gallery metadata to localStorage index (metadata only, not files)
 * Files are stored on Supabase Storage, metadata is cached locally for fast access
 */
function saveGalleryIndex(items: GalleryItemMetadata[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GALLERY_INDEX_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save gallery index to localStorage:', err);
  }
}

/**
 * Load gallery metadata index from localStorage
 * Returns cached metadata for fast gallery loading
 */
export function loadGalleryIndex(): GalleryItemMetadata[] {
  if (typeof window === 'undefined') return [];
  try {
    const cached = localStorage.getItem(GALLERY_INDEX_KEY);
    return cached ? JSON.parse(cached) : [];
  } catch (err) {
    console.error('Failed to load gallery index from localStorage:', err);
    return [];
  }
}

/**
 * Add item to gallery index and save
 */
function addToGalleryIndex(item: GalleryItemMetadata): void {
  const index = loadGalleryIndex();
  index.unshift(item); // Add to beginning (most recent first)
  saveGalleryIndex(index);
}

/**
 * Remove item from gallery index and save
 */
function removeFromGalleryIndex(id: string): void {
  const index = loadGalleryIndex();
  const filtered = index.filter((item) => item.id !== id);
  saveGalleryIndex(filtered);
}

/**
 * Upload generated image to Supabase Storage
 * Stores file in: media/{env}/{userEmail}/{filename}
 */
export async function uploadGeneratedImage(
  blob: Blob,
  fileName: string,
  userEmail: string,
  env: 'test' | 'production',
  requestId: string,
  prompt: string
): Promise<{ success: boolean; item?: GalleryItemMetadata; error?: string }> {
  try {
    // Sanitize email for use in path
    const sanitizedEmail = userEmail.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const storagePath = `${env}/${sanitizedEmail}/${fileName}`;

    console.log('📤 Uploading image to Supabase Storage:', storagePath);
    console.log('  - Blob size:', blob.size, 'bytes');
    console.log('  - Blob type:', blob.type);

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('media')
      .upload(storagePath, blob, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('❌ Storage upload error:');
      console.error('  - Message:', error.message);
      console.error('  - Status:', (error as any).status);
      console.error('  - Full error:', error);

      // Provide helpful error messages
      let helpMessage = error.message;
      if (error.message?.includes('not found') || (error as any).status === 404) {
        helpMessage = 'Bucket "media" not found. Create it in Supabase Storage.';
      } else if (error.message?.includes('permission') || (error as any).status === 403) {
        helpMessage = 'Permission denied. Check bucket RLS policies or public access settings.';
      } else if (error.message?.includes('unauthenticated') || (error as any).status === 401) {
        helpMessage = 'Not authenticated. Check NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local';
      }

      return { success: false, error: helpMessage };
    }

    console.log('✅ File uploaded to storage:', data);

    // Generate public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(storagePath);

    const publicUrl = urlData?.publicUrl || '';
    console.log('✅ Public URL generated:', publicUrl);

    // Create metadata item
    const item: GalleryItemMetadata = {
      id: requestId,
      requestId,
      type: 'image',
      prompt,
      createdAt: new Date().toISOString(),
      env,
      userEmail,
      storagePath,
      publicUrl,
      mimeType: blob.type || 'image/png',
      fileName,
      fileSizeBytes: blob.size,
    };

    // Add to local index
    addToGalleryIndex(item);

    console.log('✅ Image saved to gallery and localStorage');
    return { success: true, item };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    const errorStack = err instanceof Error ? err.stack : '';
    console.error('❌ Upload error:', errorMsg);
    if (errorStack) {
      console.error('Stack:', errorStack);
    }
    return { success: false, error: errorMsg };
  }
}

/**
 * Delete image from Supabase Storage
 */
export async function deleteGalleryItem(item: GalleryItemMetadata): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('🗑️ Deleting image from storage:', item.storagePath);

    // Delete from Supabase Storage
    const { error } = await supabase.storage
      .from('media')
      .remove([item.storagePath]);

    if (error) {
      console.error('❌ Delete error:', error);
      return { success: false, error: error.message };
    }

    // Remove from local index
    removeFromGalleryIndex(item.id);

    console.log('✅ Image deleted from gallery');
    return { success: true };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('❌ Delete error:', errorMsg);
    return { success: false, error: errorMsg };
  }
}

/**
 * Download image to user's local device
 */
export async function downloadGalleryItem(
  item: GalleryItemMetadata
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('⬇️ Downloading image:', item.fileName);

    // Fetch the image from Supabase Storage
    const { data, error } = await supabase.storage
      .from('media')
      .download(item.storagePath);

    if (error) {
      console.error('❌ Download error:', error);
      return { success: false, error: error.message };
    }

    // Create blob URL and trigger download
    const blob = data;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = item.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('✅ Image downloaded');
    return { success: true };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('❌ Download error:', errorMsg);
    return { success: false, error: errorMsg };
  }
}

/**
 * Open Google Drive save dialog
 * Note: Requires Google Drive API integration in your backend
 * For now, this is a placeholder that guides users to save manually
 */
export function saveToGoogleDrive(item: GalleryItemMetadata): void {
  console.log('📁 Saving to Google Drive:', item.fileName);
  // This would require Google Drive API integration
  // For now, provide the public URL for manual upload
  const message = `To save to Google Drive:\n1. Open ${item.publicUrl}\n2. Right-click → "Save image as..."\n3. Upload to Google Drive\n\nOr use the Download button to save locally first, then upload.`;
  alert(message);
}

/**
 * Copy public URL to clipboard
 */
export async function copyPublicUrl(url: string): Promise<{ success: boolean; error?: string }> {
  try {
    await navigator.clipboard.writeText(url);
    console.log('✅ URL copied to clipboard');
    return { success: true };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('❌ Copy error:', errorMsg);
    return { success: false, error: errorMsg };
  }
}

/**
 * Get storage usage statistics
 * Helps track the 100MB free tier limit
 */
export async function getStorageStats(): Promise<{
  success: boolean;
  usedMB?: number;
  limitMB?: number;
  percentUsed?: number;
  error?: string;
}> {
  try {
    // Note: This requires Supabase to expose storage stats via Admin API
    // For now, we can estimate based on localStorage gallery index
    const index = loadGalleryIndex();
    const totalBytes = index.reduce((sum, item) => sum + item.fileSizeBytes, 0);
    const usedMB = totalBytes / (1024 * 1024);
    const limitMB = 100; // Free tier limit
    const percentUsed = (usedMB / limitMB) * 100;

    console.log(`📊 Storage: ${usedMB.toFixed(2)}MB / ${limitMB}MB (${percentUsed.toFixed(1)}%)`);

    return {
      success: true,
      usedMB,
      limitMB,
      percentUsed,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('❌ Stats error:', errorMsg);
    return { success: false, error: errorMsg };
  }
}

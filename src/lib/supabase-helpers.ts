// Supabase data helpers and queries with RLS enforcement
import { supabase } from '@/lib/supabase';
import { GalleryItem, TaskRecord, WebhookEnvironment, WorkflowType } from '@/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create a new request task in Supabase with initial pending status
 * RLS: Only user with matching email can insert their own records
 */
export async function createRequestTask(
  email: string,
  workflowType: WorkflowType,
  env: WebhookEnvironment,
  requestId: string,
  payload: Record<string, any>
): Promise<{ success: boolean; taskId?: string; error?: string }> {
  try {
    const { data, error } = await supabase.from('tasks').insert([
      {
        email, // RLS filtering
        task_text: `${workflowType} - ${new Date().toISOString()}`,
        status: 'pending',
        request_id: requestId,
        webhook_type: 'POST', // Default to POST for now
        env,
        workflow_type: workflowType,
        request_payload: payload,
        created_at: new Date().toISOString(),
      },
    ]).select('id');

    if (error) {
      console.error('Insert task error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, taskId: data?.[0]?.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Create task error:', msg);
    return { success: false, error: msg };
  }
}

/**
 * Poll Supabase for workflow result
 * Waits up to maxWait milliseconds for status to change from 'pending' to 'completed'
 * RLS: Only sees own records (via email in session)
 */
export async function pollForResponse(
  requestId: string,
  maxWait: number = 30000
): Promise<{
  success: boolean;
  result?: TaskRecord;
  timedOut?: boolean;
  error?: string;
}> {
  const startTime = Date.now();
  const pollInterval = 2000; // Poll every 2 seconds

  while (Date.now() - startTime < maxWait) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('request_id', requestId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned
        console.error('Poll query error:', error);
        return { success: false, error: error.message };
      }

      if (data && data.status !== 'pending') {
        // Result is ready
        return { success: true, result: data as TaskRecord };
      }

      // Not ready yet, wait before polling again
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Poll error:', msg);
      // Continue polling on error
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }
  }

  return { success: false, timedOut: true, error: 'Response timeout - max wait exceeded' };
}

/**
 * Fetch gallery items for current user with optional filters
 * RLS: Only fetches current user's records (email match via JWT)
 */
export async function fetchGalleryItems(
  email: string,
  filters?: {
    type?: 'image' | 'video';
    env?: WebhookEnvironment;
    startDate?: string;
    endDate?: string;
    searchText?: string;
  }
): Promise<{ success: boolean; items?: GalleryItem[]; error?: string }> {
  try {
    let query = supabase.from('tasks').select('*').eq('email', email).eq('status', 'completed');

    // Filter by media type if specified
    if (filters?.type) {
      query = query.like('response_payload', `%"${filters.type}"%`);
    }

    // Filter by environment
    if (filters?.env) {
      query = query.eq('env', filters.env);
    }

    // Filter by date range
    if (filters?.startDate) {
      query = query.gte('created_at', filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte('created_at', filters.endDate);
    }

    // Execute query with ordering
    const { data, error } = await query.order('created_at', { ascending: false }).limit(100);

    if (error) {
      console.error('Fetch gallery error:', error);
      return { success: false, error: error.message };
    }

    // Transform task records to gallery items
    const items: GalleryItem[] = (data || [])
      .filter((task) => task.media_url && task.workflow_type)
      .map((task) => ({
        id: task.id,
        request_id: task.request_id || '',
        type: task.workflow_type?.includes('video') ? 'video' : 'image',
        prompt: task.task_text,
        created_at: task.created_at,
        env: task.env,
        webhook_type: task.webhook_type || 'POST',
        mime_type: task.media_mime_type || 'image/jpeg',
        url: task.media_url,
        file_name: `${task.workflow_type}-${task.id}.jpg`,
        user_email: email,
      }));

    // Apply text search filter on client side (Postgres LIKE would work on server)
    if (filters?.searchText) {
      const search = filters.searchText.toLowerCase();
      return {
        success: true,
        items: items.filter((item) => item.prompt?.toLowerCase().includes(search)),
      };
    }

    return { success: true, items };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Fetch gallery error:', msg);
    return { success: false, error: msg };
  }
}

/**
 * Get user's recent tasks (for dashboard logging)
 * RLS: Only fetches current user's records
 */
export async function getUserTasks(
  email: string,
  limit: number = 20
): Promise<{ success: boolean; tasks?: TaskRecord[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Get user tasks error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, tasks: (data || []) as TaskRecord[] };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Get user tasks error:', msg);
    return { success: false, error: msg };
  }
}

/**
 * Register or update user in tasks table
 * Called after successful OAuth sign-in
 */
export async function registerUser(email: string, telegramId?: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabase.from('tasks').insert([
      {
        email,
        telegram_id: telegramId ? parseInt(telegramId, 10) : null,
        task_text: `User registration - ${new Date().toISOString()}`,
        status: 'completed',
        created_at: new Date().toISOString(),
      },
    ]);

    if (error && error.code !== '23505') {
      // 23505 = unique constraint (user already exists)
      console.error('Register user error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Register user error:', msg);
    return { success: false, error: msg };
  }
}

/**
 * Get or create Supabase Storage directory for user
 * Returns public URL base for media uploads
 */
export function getStorageUrlBase(userEmail: string, env: WebhookEnvironment): string {
  const sanitizedEmail = userEmail.replace(/[^a-z0-9]/gi, '-');
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${env}/${sanitizedEmail}`;
}

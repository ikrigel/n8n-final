// Supabase client initialization and configuration
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Client-side Supabase instance (uses anon key, RLS enforced)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export types for database tables
export type { Database } from '@/lib/database.types';

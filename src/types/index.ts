// Core type definitions for the n8n SPA frontend

/** Available workflow types that can be triggered */
export type WorkflowType =
  | 'image'
  | 'video'
  | 'audio'
  | 'chucknorris'
  | 'dad'
  | 'question'
  | 'nanobananaimage'
  | 'nanobananavideo'
  | 'addfiletogoogledrive'
  | 'log'
  | 'test';

/** Environment selection: test or production */
export type WebhookEnvironment = 'test' | 'production';

/** Log entry with level, message, and metadata */
export interface LogEntry {
  id: string; // UUID
  level: 'info' | 'debug' | 'error';
  message: string;
  meta?: Record<string, any>;
  timestamp: string; // ISO string
}

/** Webhook request payload sent to n8n */
export interface WebhookRequest {
  request_id: string; // UUID to track response
  user_id: string; // User identifier
  email: string; // User email for Supabase RLS
  telegram_id?: string; // Optional Telegram ID
  workflow_type: WorkflowType;
  timestamp: string; // ISO string
  message: Record<string, any>; // Varies by workflow type
}

/** Webhook response callback from n8n */
export interface WebhookResponse {
  request_id: string;
  workflow_type: WorkflowType;
  status: 'completed' | 'failed' | 'pending';
  result?: Record<string, any>;
  media_url?: string;
  media_mime_type?: string;
  error?: string;
  timestamp: string;
}

/** Gallery item metadata stored in Supabase */
export interface GalleryItem {
  id: string; // Primary key
  request_id: string; // Links to task request
  type: 'image' | 'video'; // Media type
  prompt?: string; // Original prompt/description
  created_at: string; // ISO timestamp
  env: WebhookEnvironment; // test or production
  webhook_type: 'GET' | 'POST';
  mime_type: string; // image/png, video/mp4, etc.
  url?: string; // Supabase Storage URL or public URL
  signed_url?: string; // Temporary signed URL if private
  file_name: string;
  user_email: string; // For RLS filtering
}

/** Task table row from Supabase (for logging workflow state) */
export interface TaskRecord {
  id: string;
  telegram_id?: number;
  task_text: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
  email: string;
  request_id?: string;
  workflow_type?: WorkflowType;
  request_payload?: Record<string, any>;
  response_payload?: Record<string, any>;
  response_received_at?: string;
  media_url?: string;
  media_mime_type?: string;
}

/** Configuration state stored in localStorage and context */
export interface AppConfig {
  env: WebhookEnvironment;
  loggingEnabled: boolean;
  logLevel: 'info' | 'debug' | 'error';
  sendLogsAsJson: boolean;
  telegramId?: string;
  theme: 'light' | 'dark' | 'auto';
}

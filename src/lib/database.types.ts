// Database type definitions - auto-generated from Supabase or manually defined
// This is a placeholder for the Supabase types

export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: number;
          telegram_id: number | null;
          task_text: string;
          status: string;
          created_at: string;
          completed_at: string | null;
          email: string;
          request_id?: string;
          workflow_type?: string;
        };
        Insert: Omit<Database['public']['Tables']['tasks']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['tasks']['Insert']>;
      };
      gallery: {
        Row: {
          id: string;
          request_id: string;
          type: 'image' | 'video';
          prompt: string | null;
          created_at: string;
          env: 'test' | 'production';
          webhook_type: 'GET' | 'POST';
          mime_type: string;
          url: string | null;
          signed_url: string | null;
          file_name: string;
          user_email: string;
        };
        Insert: Omit<Database['public']['Tables']['gallery']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['gallery']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

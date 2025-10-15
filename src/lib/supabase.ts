import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const storageBucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET || 'guestbook_canvas';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Storage helpers
export const getStorageUrl = (path: string) => {
  return `${supabaseUrl}/storage/v1/object/public/${storageBucket}/${path}`;
};

export const uploadToStorage = async (
  file: File,
  folder: 'originals' | 'thumbnails' | 'downloads' | 'full-canvas',
  fileName: string
) => {
  const filePath = `${folder}/${fileName}`;
  
  const { data, error } = await supabase.storage
    .from(storageBucket)
    .upload(filePath, file, {
      upsert: true,
      cacheControl: '3600',
    });

  if (error) throw error;
  return getStorageUrl(filePath);
};

// Database types
export interface GuestbookTile {
  id?: string;
  tile_number: number;
  position_row: number;
  position_col: number;
  guest_name: string;
  guest_email?: string;
  guest_phone?: string;
  guest_relation?: 'family' | 'friend' | 'colleague' | 'other';
  canvas_data_url?: string;
  canvas_data_json?: any;
  image_url?: string;
  thumbnail_url?: string;
  badges?: string[];
  hover_message?: string;
  status: 'draft' | 'submitted' | 'approved' | 'edit_requested' | 'rejected';
  moderation_notes?: string;
  admin_notes?: string;
  created_at?: string;
  updated_at?: string;
  submitted_at?: string;
  approved_at?: string;
  creation_time_minutes?: number;
  tools_used?: any;
  edit_count?: number;
}

export interface GuestbookDraft {
  id?: string;
  guest_email?: string;
  guest_name: string;
  session_id?: string;
  canvas_data_url?: string;
  canvas_data_json?: any;
  tile_number?: number;
  created_at?: string;
  last_saved_at?: string;
  expires_at?: string;
  save_count?: number;
  last_action?: string;
}

export interface GuestbookBadge {
  id: string;
  label: string;
  emoji: string;
  category: 'humor' | 'artistic' | 'emotional' | 'effort' | 'style' | 'special';
  description?: string;
  display_order: number;
  is_active: boolean;
}

export interface GuestbookConfig {
  id: string;
  is_enabled: boolean;
  is_revealed: boolean;
  reveal_date?: string;
  max_tiles: number;
  grid_rows: number;
  grid_cols: number;
  tile_width_px: number;
  tile_height_px: number;
  max_stickers_per_tile: number;
  max_text_boxes_per_tile: number;
  max_file_size_mb: number;
  auto_save_interval_seconds: number;
  draft_expiry_days: number;
  default_theme: string;
}

// Session management
export const getSessionId = () => {
  if (typeof window === 'undefined') return null;
  
  let sessionId = localStorage.getItem('guestbook_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('guestbook_session_id', sessionId);
  }
  return sessionId;
};

// Guest email management
export const getGuestEmail = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('guestbook_email');
};

export const setGuestEmail = (email: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('guestbook_email', email);
};
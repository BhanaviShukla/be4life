-- Migration 003: Storage Bucket Setup
-- Description: SQL representation of storage bucket configuration
-- Author: Wedding Website System
-- Date: 2024
-- 
-- NOTE: This file documents the storage setup. 
-- Actual bucket creation must be done via Supabase Dashboard or API

-- =====================================================
-- Storage Bucket: guestbook_canvas
-- =====================================================

/*
IMPORTANT: Run these commands in Supabase Dashboard SQL Editor
or use Supabase CLI/API to create the storage bucket

The bucket name should be: guestbook_canvas
*/

-- Create the storage bucket (if using Supabase SQL Editor)
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES (
    'guestbook_canvas',
    'guestbook_canvas', 
    false, -- Not public by default, controlled by policies
    false,
    5242880, -- 5MB limit
    ARRAY[
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/gif',
        'image/svg+xml',
        'image/webp'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY[
        'image/jpeg',
        'image/jpg',
        'image/png', 
        'image/gif',
        'image/svg+xml',
        'image/webp'
    ];

-- =====================================================
-- Storage Policies
-- =====================================================

-- Policy 1: Public can view thumbnails and downloads after reveal
INSERT INTO storage.policies (bucket_id, name, definition, check_expression, using_expression)
VALUES (
    'guestbook_canvas',
    'Public views after reveal',
    '{"operation": "SELECT"}',
    NULL,
    '(bucket_id = ''guestbook_canvas'' AND 
     (name LIKE ''thumbnails/%'' OR name LIKE ''downloads/%'' OR name LIKE ''full-canvas/%'') AND
     EXISTS (SELECT 1 FROM public.guestbook_config WHERE id = ''main'' AND is_revealed = true))'
)
ON CONFLICT DO NOTHING;

-- Policy 2: Authenticated users can upload their own tiles
INSERT INTO storage.policies (bucket_id, name, definition, check_expression, using_expression)
VALUES (
    'guestbook_canvas',
    'Users upload own tiles',
    '{"operation": "INSERT"}',
    '(bucket_id = ''guestbook_canvas'' AND 
     name LIKE ''originals/%'' AND
     (SELECT COUNT(*) FROM public.guestbook_tiles 
      WHERE guest_email = auth.jwt()->>''email'' 
      AND status IN (''draft'', ''submitted'')) > 0)',
    NULL
)
ON CONFLICT DO NOTHING;

-- Policy 3: Users can view their own uploaded tiles
INSERT INTO storage.policies (bucket_id, name, definition, check_expression, using_expression)
VALUES (
    'guestbook_canvas',
    'Users view own tiles',
    '{"operation": "SELECT"}',
    NULL,
    '(bucket_id = ''guestbook_canvas'' AND 
     name LIKE ''originals/%'' AND
     EXISTS (SELECT 1 FROM public.guestbook_tiles 
             WHERE guest_email = auth.jwt()->>''email''
             AND (image_url LIKE ''%'' || name || ''%'' 
                  OR thumbnail_url LIKE ''%'' || name || ''%'')))'
)
ON CONFLICT DO NOTHING;

-- Policy 4: Service role has full access
INSERT INTO storage.policies (bucket_id, name, definition, check_expression, using_expression)
VALUES (
    'guestbook_canvas',
    'Service role full access',
    '{"operation": "ALL"}',
    'auth.jwt()->>''role'' = ''service_role''',
    'auth.jwt()->>''role'' = ''service_role'''
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- Storage Functions
-- =====================================================

-- Function to get storage URL for a file
CREATE OR REPLACE FUNCTION get_storage_url(bucket TEXT, file_path TEXT)
RETURNS TEXT AS $$
DECLARE
    supabase_url TEXT;
BEGIN
    -- Get Supabase URL from environment or config
    supabase_url := current_setting('app.supabase_url', true);
    
    IF supabase_url IS NULL THEN
        -- Fallback to a default or raise an error
        RAISE EXCEPTION 'Supabase URL not configured';
    END IF;
    
    RETURN supabase_url || '/storage/v1/object/public/' || bucket || '/' || file_path;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate thumbnail path from original path
CREATE OR REPLACE FUNCTION generate_thumbnail_path(original_path TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN regexp_replace(original_path, '^originals/', 'thumbnails/');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to generate download path from original path
CREATE OR REPLACE FUNCTION generate_download_path(original_path TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN regexp_replace(original_path, '^originals/', 'downloads/');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =====================================================
-- Expected Folder Structure
-- =====================================================

/*
guestbook_canvas/
├── originals/          -- Original high-resolution tiles
│   ├── tile_001.png
│   ├── tile_002.png
│   └── ...
├── thumbnails/         -- 300x200px thumbnails for quick loading
│   ├── tile_001.png
│   ├── tile_002.png
│   └── ...
├── downloads/          -- Watermarked versions for sharing
│   ├── tile_001.png
│   ├── tile_002.png
│   └── ...
└── full-canvas/        -- Complete canvas compositions
    ├── canvas_latest.png
    ├── canvas_print.png
    └── canvas_preview.png
*/

-- =====================================================
-- Storage Metadata Table (Optional)
-- =====================================================

CREATE TABLE IF NOT EXISTS guestbook_storage_metadata (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tile_id UUID REFERENCES guestbook_tiles(id) ON DELETE CASCADE,
    
    -- File paths
    original_path TEXT,
    thumbnail_path TEXT,
    download_path TEXT,
    
    -- File metadata
    original_size_bytes INTEGER,
    thumbnail_size_bytes INTEGER,
    download_size_bytes INTEGER,
    mime_type TEXT,
    
    -- Processing status
    thumbnail_generated BOOLEAN DEFAULT false,
    download_generated BOOLEAN DEFAULT false,
    watermark_applied BOOLEAN DEFAULT false,
    
    -- Timestamps
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(tile_id)
);

CREATE INDEX idx_storage_metadata_tile ON guestbook_storage_metadata(tile_id);

-- =====================================================
-- Storage Cleanup Function
-- =====================================================

-- Function to clean up orphaned storage files
CREATE OR REPLACE FUNCTION cleanup_orphaned_storage()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    -- This is a placeholder for cleanup logic
    -- Actual implementation would need to interact with storage API
    
    -- Delete metadata for tiles that no longer exist
    DELETE FROM guestbook_storage_metadata
    WHERE tile_id NOT IN (SELECT id FROM guestbook_tiles);
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Notes for Manual Setup in Supabase Dashboard
-- =====================================================

/*
1. Go to Storage section in Supabase Dashboard
2. Create new bucket named "guestbook_canvas"
3. Set the following options:
   - Public: No (we'll control access via policies)
   - File size limit: 5MB
   - Allowed MIME types: image/jpeg, image/png, image/gif, image/svg+xml, image/webp

4. After creating the bucket, go to Policies tab
5. Create the policies as described above using the Dashboard UI

6. Create the folder structure by uploading placeholder files:
   - Upload a small image to originals/placeholder.txt
   - Upload a small image to thumbnails/placeholder.txt
   - Upload a small image to downloads/placeholder.txt
   - Upload a small image to full-canvas/placeholder.txt
   - These can be deleted after folders are created

7. Test the policies:
   - Try uploading as authenticated user
   - Try viewing as public (should fail before reveal)
   - Set is_revealed = true in guestbook_config
   - Try viewing as public again (should succeed)
*/
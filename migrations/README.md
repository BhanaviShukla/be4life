# Database Migrations for Digital Guestbook Canvas

## Overview
This folder contains SQL migration files for setting up the Digital Guestbook Canvas feature in Supabase.

## Migration Files

1. **001_create_guestbook_tables.sql**
   - Creates all core tables (tiles, drafts, badges, config, analytics, moderation_log)
   - Adds indexes for performance
   - Inserts default badge data (18 badges)
   - Creates helper functions and triggers

2. **002_create_rls_policies.sql**
   - Enables Row Level Security on all tables
   - Creates access policies for public, authenticated, and admin users
   - Adds helper functions for authentication

3. **003_storage_setup.sql**
   - Documents storage bucket configuration
   - Provides SQL for storage policies
   - Includes manual setup instructions

## How to Apply Migrations

### Step 1: Run Database Migrations
1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `001_create_guestbook_tables.sql`
4. Click "Run" to execute
5. Repeat for `002_create_rls_policies.sql`

### Step 2: Configure Storage
1. Go to Storage section in Supabase Dashboard
2. The bucket "guestbook_canvas" should already be created
3. Apply the storage policies as documented in `003_storage_setup.sql`
4. Create the folder structure by uploading placeholder files to:
   - `originals/placeholder.txt`
   - `thumbnails/placeholder.txt`
   - `downloads/placeholder.txt`
   - `full-canvas/placeholder.txt`

### Step 3: Verify Setup
Run this query in SQL Editor to verify tables are created:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'guestbook%'
ORDER BY table_name;
```

Expected result:
- guestbook_analytics
- guestbook_badges
- guestbook_config
- guestbook_drafts
- guestbook_moderation_log
- guestbook_storage_metadata
- guestbook_tiles

### Step 4: Test RLS Policies
```sql
-- Check if badges are accessible
SELECT * FROM guestbook_badges WHERE is_active = true;

-- Check config
SELECT * FROM guestbook_config WHERE id = 'main';
```

## Important Notes

- **RLS is enabled** on all tables - ensure your application uses proper authentication
- **Storage bucket** is named `guestbook_canvas` (not `guestbook-tiles` as originally planned)
- **Default configuration** is inserted automatically with:
  - 100 max tiles (10×10 grid)
  - Reveal date set to November 25, 2025
  - Feature enabled by default

## Rollback
If you need to remove the guestbook feature:
```sql
-- Drop all guestbook tables
DROP TABLE IF EXISTS guestbook_moderation_log CASCADE;
DROP TABLE IF EXISTS guestbook_analytics CASCADE;
DROP TABLE IF EXISTS guestbook_storage_metadata CASCADE;
DROP TABLE IF EXISTS guestbook_drafts CASCADE;
DROP TABLE IF EXISTS guestbook_tiles CASCADE;
DROP TABLE IF EXISTS guestbook_badges CASCADE;
DROP TABLE IF EXISTS guestbook_config CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS claim_next_tile CASCADE;
DROP FUNCTION IF EXISTS is_admin CASCADE;
DROP FUNCTION IF EXISTS get_current_user_email CASCADE;
DROP FUNCTION IF EXISTS get_current_session_id CASCADE;
DROP FUNCTION IF EXISTS is_guestbook_revealed CASCADE;
DROP FUNCTION IF EXISTS sanitize_html CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- Drop view
DROP VIEW IF EXISTS public_tiles CASCADE;
```

## Environment Variables
Ensure these are set in your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_STORAGE_BUCKET=guestbook_canvas
```
-- Migration 002: Row Level Security Policies
-- Description: RLS policies for secure access to guestbook tables
-- Author: Wedding Website System
-- Date: 2024

-- =====================================================
-- Enable RLS on all tables
-- =====================================================
ALTER TABLE guestbook_tiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbook_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbook_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbook_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbook_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbook_moderation_log ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 1. Policies for guestbook_tiles
-- =====================================================

-- Public can view their own tile always
CREATE POLICY "Users can view own tiles"
ON guestbook_tiles FOR SELECT
USING (
    guest_email = current_setting('request.jwt.claims', true)::json->>'email'
    OR 
    guest_email = current_setting('request.cookies', true)::json->>'guest_email'
);

-- Public can view approved tiles after reveal
CREATE POLICY "Public can view approved tiles after reveal"
ON guestbook_tiles FOR SELECT
USING (
    status = 'approved' 
    AND EXISTS (
        SELECT 1 FROM guestbook_config 
        WHERE id = 'main' 
        AND is_revealed = true
    )
);

-- Public can view tile count (limited fields)
CREATE POLICY "Public can view tile count"
ON guestbook_tiles FOR SELECT
USING (
    true
);

-- Users can insert their own tile
CREATE POLICY "Users can create own tile"
ON guestbook_tiles FOR INSERT
WITH CHECK (
    guest_email = current_setting('request.jwt.claims', true)::json->>'email'
    OR 
    guest_email = current_setting('request.cookies', true)::json->>'guest_email'
);

-- Users can update their own draft tiles
CREATE POLICY "Users can update own draft tiles"
ON guestbook_tiles FOR UPDATE
USING (
    status = 'draft' 
    AND (
        guest_email = current_setting('request.jwt.claims', true)::json->>'email'
        OR 
        guest_email = current_setting('request.cookies', true)::json->>'guest_email'
    )
);

-- Service role can do everything (for admin functions)
CREATE POLICY "Service role full access"
ON guestbook_tiles FOR ALL
USING (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
);

-- =====================================================
-- 2. Policies for guestbook_drafts
-- =====================================================

-- Users can view their own drafts
CREATE POLICY "Users can view own drafts"
ON guestbook_drafts FOR SELECT
USING (
    guest_email = current_setting('request.jwt.claims', true)::json->>'email'
    OR 
    session_id = current_setting('request.cookies', true)::json->>'session_id'
);

-- Users can create drafts
CREATE POLICY "Users can create drafts"
ON guestbook_drafts FOR INSERT
WITH CHECK (
    guest_email = current_setting('request.jwt.claims', true)::json->>'email'
    OR 
    session_id = current_setting('request.cookies', true)::json->>'session_id'
);

-- Users can update their own drafts
CREATE POLICY "Users can update own drafts"
ON guestbook_drafts FOR UPDATE
USING (
    guest_email = current_setting('request.jwt.claims', true)::json->>'email'
    OR 
    session_id = current_setting('request.cookies', true)::json->>'session_id'
);

-- Users can delete their own drafts
CREATE POLICY "Users can delete own drafts"
ON guestbook_drafts FOR DELETE
USING (
    guest_email = current_setting('request.jwt.claims', true)::json->>'email'
    OR 
    session_id = current_setting('request.cookies', true)::json->>'session_id'
);

-- Service role full access
CREATE POLICY "Service role full access drafts"
ON guestbook_drafts FOR ALL
USING (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
);

-- =====================================================
-- 3. Policies for guestbook_badges
-- =====================================================

-- Everyone can read active badges
CREATE POLICY "Public can read active badges"
ON guestbook_badges FOR SELECT
USING (is_active = true);

-- Only service role can modify badges
CREATE POLICY "Service role manages badges"
ON guestbook_badges FOR ALL
USING (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
);

-- =====================================================
-- 4. Policies for guestbook_config
-- =====================================================

-- Public can read certain config fields
CREATE POLICY "Public can read basic config"
ON guestbook_config FOR SELECT
USING (true);

-- Only service role can modify config
CREATE POLICY "Service role manages config"
ON guestbook_config FOR UPDATE
USING (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
);

-- =====================================================
-- 5. Policies for guestbook_analytics
-- =====================================================

-- Anyone can insert analytics events
CREATE POLICY "Public can insert analytics"
ON guestbook_analytics FOR INSERT
WITH CHECK (true);

-- Only service role can read analytics
CREATE POLICY "Service role reads analytics"
ON guestbook_analytics FOR SELECT
USING (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
);

-- =====================================================
-- 6. Policies for guestbook_moderation_log
-- =====================================================

-- Only service role can access moderation log
CREATE POLICY "Service role only moderation"
ON guestbook_moderation_log FOR ALL
USING (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
);

-- =====================================================
-- Create storage policies
-- =====================================================

-- Note: Storage policies need to be created in Supabase Dashboard
-- Here's the SQL representation of what needs to be configured:

/*
Storage Bucket: guestbook_canvas

Policies needed:
1. Public can view images in /thumbnails/ and /downloads/ after reveal
2. Authenticated users can upload to /originals/ for their own tiles
3. Service role has full access to all folders
4. Public can view /full-canvas/ after reveal date

Example policy for Supabase Dashboard:
- Bucket: guestbook_canvas
- Allowed operations: SELECT
- Target roles: public
- WITH CHECK expression: 
    (bucket_id = 'guestbook_canvas' AND 
     (name LIKE 'thumbnails/%' OR name LIKE 'downloads/%') AND
     EXISTS (SELECT 1 FROM guestbook_config WHERE id = 'main' AND is_revealed = true))
*/

-- =====================================================
-- Create helper functions for RLS
-- =====================================================

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
        OR current_setting('request.jwt.claims', true)::json->>'email' IN (
            SELECT unnest(string_to_array(
                current_setting('app.admin_emails', true), ','
            ))
        );
EXCEPTION
    WHEN OTHERS THEN
        RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current user email
CREATE OR REPLACE FUNCTION get_current_user_email()
RETURNS TEXT AS $$
BEGIN
    RETURN COALESCE(
        current_setting('request.jwt.claims', true)::json->>'email',
        current_setting('request.cookies', true)::json->>'guest_email'
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current session id
CREATE OR REPLACE FUNCTION get_current_session_id()
RETURNS TEXT AS $$
BEGIN
    RETURN current_setting('request.cookies', true)::json->>'session_id';
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Additional security functions
-- =====================================================

-- Function to check if guestbook is revealed
CREATE OR REPLACE FUNCTION is_guestbook_revealed()
RETURNS BOOLEAN AS $$
DECLARE
    v_is_revealed BOOLEAN;
    v_reveal_date TIMESTAMP WITH TIME ZONE;
BEGIN
    SELECT is_revealed, reveal_date 
    INTO v_is_revealed, v_reveal_date
    FROM guestbook_config 
    WHERE id = 'main';
    
    -- Check both manual reveal flag and date-based reveal
    RETURN v_is_revealed OR (v_reveal_date IS NOT NULL AND v_reveal_date <= NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to sanitize user input (basic XSS prevention)
CREATE OR REPLACE FUNCTION sanitize_html(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN regexp_replace(
        regexp_replace(
            regexp_replace(
                regexp_replace(
                    regexp_replace(input_text, '<script[^>]*>.*?</script>', '', 'gi'),
                    '<iframe[^>]*>.*?</iframe>', '', 'gi'
                ),
                'javascript:', '', 'gi'
            ),
            'on\w+\s*=', '', 'gi'
        ),
        '<[^>]*>', '', 'g'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Grant necessary permissions
-- =====================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant appropriate permissions on tables
GRANT SELECT ON guestbook_badges TO anon, authenticated;
GRANT SELECT ON guestbook_config TO anon, authenticated;
GRANT SELECT ON public_tiles TO anon, authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION claim_next_tile TO anon, authenticated;
GRANT EXECUTE ON FUNCTION is_guestbook_revealed TO anon, authenticated;
GRANT EXECUTE ON FUNCTION sanitize_html TO anon, authenticated;

-- Note: Additional permissions should be configured through Supabase Dashboard
-- based on your authentication setup
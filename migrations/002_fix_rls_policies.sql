-- Fix RLS Policies for Guestbook
-- This migration updates RLS policies to allow proper public access

-- =====================================================
-- Drop existing restrictive policies
-- =====================================================
DROP POLICY IF EXISTS "Users can view own tiles" ON guestbook_tiles;
DROP POLICY IF EXISTS "Public can view approved tiles after reveal" ON guestbook_tiles;
DROP POLICY IF EXISTS "Public can view tile count" ON guestbook_tiles;
DROP POLICY IF EXISTS "Users can create own tile" ON guestbook_tiles;
DROP POLICY IF EXISTS "Users can update own draft tiles" ON guestbook_tiles;
DROP POLICY IF EXISTS "Service role full access" ON guestbook_tiles;

DROP POLICY IF EXISTS "Users can view own drafts" ON guestbook_drafts;
DROP POLICY IF EXISTS "Users can create drafts" ON guestbook_drafts;
DROP POLICY IF EXISTS "Users can update own drafts" ON guestbook_drafts;
DROP POLICY IF EXISTS "Users can delete own drafts" ON guestbook_drafts;
DROP POLICY IF EXISTS "Service role full access drafts" ON guestbook_drafts;

-- =====================================================
-- Create simpler, working policies for guestbook_tiles
-- =====================================================

-- Allow public to read all tiles (visibility controlled by app logic)
CREATE POLICY "public_read_tiles"
ON guestbook_tiles FOR SELECT
USING (true);

-- Allow public to insert tiles (claim_next_tile function handles logic)
CREATE POLICY "public_insert_tiles"
ON guestbook_tiles FOR INSERT
WITH CHECK (true);

-- Allow public to update tiles (app controls which tiles can be updated)
CREATE POLICY "public_update_tiles"
ON guestbook_tiles FOR UPDATE
USING (true)
WITH CHECK (true);

-- =====================================================
-- Create simpler policies for guestbook_drafts
-- =====================================================

-- Allow public to read all drafts (filtered by session in app)
CREATE POLICY "public_read_drafts"
ON guestbook_drafts FOR SELECT
USING (true);

-- Allow public to insert drafts
CREATE POLICY "public_insert_drafts"
ON guestbook_drafts FOR INSERT
WITH CHECK (true);

-- Allow public to update drafts
CREATE POLICY "public_update_drafts"
ON guestbook_drafts FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow public to delete drafts
CREATE POLICY "public_delete_drafts"
ON guestbook_drafts FOR DELETE
USING (true);

-- =====================================================
-- Ensure functions have proper permissions
-- =====================================================

-- Grant necessary permissions
GRANT ALL ON guestbook_tiles TO anon, authenticated;
GRANT ALL ON guestbook_drafts TO anon, authenticated;
GRANT ALL ON guestbook_badges TO anon, authenticated;
GRANT ALL ON guestbook_config TO anon, authenticated;
GRANT ALL ON guestbook_analytics TO anon, authenticated;

-- Grant sequence permissions for auto-incrementing
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Ensure the claim_next_tile function works
GRANT EXECUTE ON FUNCTION claim_next_tile TO anon, authenticated;
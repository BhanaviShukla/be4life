-- =====================================================
-- COMPLETE FIX FOR GUESTBOOK RLS AND FUNCTION ISSUES
-- Run this entire script in Supabase SQL Editor
-- =====================================================

-- Step 1: Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Users can view own tiles" ON guestbook_tiles;
DROP POLICY IF EXISTS "Public can view approved tiles after reveal" ON guestbook_tiles;
DROP POLICY IF EXISTS "Public can view tile count" ON guestbook_tiles;
DROP POLICY IF EXISTS "Users can create own tile" ON guestbook_tiles;
DROP POLICY IF EXISTS "Users can update own draft tiles" ON guestbook_tiles;
DROP POLICY IF EXISTS "Service role full access" ON guestbook_tiles;
DROP POLICY IF EXISTS "public_read_tiles" ON guestbook_tiles;
DROP POLICY IF EXISTS "public_insert_tiles" ON guestbook_tiles;
DROP POLICY IF EXISTS "public_update_tiles" ON guestbook_tiles;

DROP POLICY IF EXISTS "Users can view own drafts" ON guestbook_drafts;
DROP POLICY IF EXISTS "Users can create drafts" ON guestbook_drafts;
DROP POLICY IF EXISTS "Users can update own drafts" ON guestbook_drafts;
DROP POLICY IF EXISTS "Users can delete own drafts" ON guestbook_drafts;
DROP POLICY IF EXISTS "Service role full access drafts" ON guestbook_drafts;
DROP POLICY IF EXISTS "public_read_drafts" ON guestbook_drafts;
DROP POLICY IF EXISTS "public_insert_drafts" ON guestbook_drafts;
DROP POLICY IF EXISTS "public_update_drafts" ON guestbook_drafts;
DROP POLICY IF EXISTS "public_delete_drafts" ON guestbook_drafts;

-- Step 2: Create simple, permissive policies for guestbook_tiles
CREATE POLICY "allow_all_select_tiles"
ON guestbook_tiles FOR SELECT
USING (true);

CREATE POLICY "allow_all_insert_tiles"
ON guestbook_tiles FOR INSERT
WITH CHECK (true);

CREATE POLICY "allow_all_update_tiles"
ON guestbook_tiles FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "allow_all_delete_tiles"
ON guestbook_tiles FOR DELETE
USING (true);

-- Step 3: Create simple, permissive policies for guestbook_drafts
CREATE POLICY "allow_all_select_drafts"
ON guestbook_drafts FOR SELECT
USING (true);

CREATE POLICY "allow_all_insert_drafts"
ON guestbook_drafts FOR INSERT
WITH CHECK (true);

CREATE POLICY "allow_all_update_drafts"
ON guestbook_drafts FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "allow_all_delete_drafts"
ON guestbook_drafts FOR DELETE
USING (true);

-- Step 4: Drop ALL versions of claim_next_tile function
DO $$ 
BEGIN
    -- Drop all possible versions
    DROP FUNCTION IF EXISTS claim_next_tile CASCADE;
    DROP FUNCTION IF EXISTS claim_next_tile(VARCHAR, VARCHAR) CASCADE;
    DROP FUNCTION IF EXISTS claim_next_tile(VARCHAR(255), VARCHAR(255)) CASCADE;
    DROP FUNCTION IF EXISTS claim_next_tile(TEXT, TEXT) CASCADE;
    DROP FUNCTION IF EXISTS claim_next_tile(CHARACTER VARYING, CHARACTER VARYING) CASCADE;
EXCEPTION
    WHEN undefined_function THEN NULL;
END $$;

-- Step 5: Create new claim_next_tile function
CREATE OR REPLACE FUNCTION claim_next_tile(
    p_guest_name VARCHAR(255),
    p_guest_email VARCHAR(255) DEFAULT NULL
)
RETURNS TABLE(tile_number INTEGER) 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_next_tile INTEGER;
    v_existing_tile INTEGER;
BEGIN
    -- First check if email already has a tile
    IF p_guest_email IS NOT NULL AND p_guest_email != '' THEN
        SELECT gt.tile_number INTO v_existing_tile
        FROM guestbook_tiles gt
        WHERE gt.guest_email = p_guest_email
        LIMIT 1;
        
        -- If email already has a tile, return it
        IF v_existing_tile IS NOT NULL THEN
            RETURN QUERY SELECT v_existing_tile;
            RETURN;
        END IF;
    END IF;

    -- Get the next available tile
    SELECT MIN(t.tile_number) INTO v_next_tile
    FROM generate_series(1, 100) AS t(tile_number)
    WHERE NOT EXISTS (
        SELECT 1 FROM guestbook_tiles gt 
        WHERE gt.tile_number = t.tile_number
    );
    
    -- Check if we have an available tile
    IF v_next_tile IS NULL THEN
        RAISE EXCEPTION 'All tiles have been claimed';
    END IF;
    
    -- Create the tile
    INSERT INTO guestbook_tiles (
        tile_number,
        position_row,
        position_col,
        guest_name,
        guest_email,
        status
    ) VALUES (
        v_next_tile,
        ((v_next_tile - 1) / 10) + 1,  -- Calculate row (1-10)
        ((v_next_tile - 1) % 10) + 1,  -- Calculate column (1-10)
        p_guest_name,
        p_guest_email,
        'draft'
    );
    
    RETURN QUERY SELECT v_next_tile;
EXCEPTION
    WHEN unique_violation THEN
        -- Handle race condition - try to get the tile that was just created
        IF p_guest_email IS NOT NULL THEN
            SELECT gt.tile_number INTO v_existing_tile
            FROM guestbook_tiles gt
            WHERE gt.guest_email = p_guest_email
            LIMIT 1;
            
            IF v_existing_tile IS NOT NULL THEN
                RETURN QUERY SELECT v_existing_tile;
                RETURN;
            END IF;
        END IF;
        RAISE;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Grant all necessary permissions
GRANT ALL ON guestbook_tiles TO anon, authenticated, public;
GRANT ALL ON guestbook_drafts TO anon, authenticated, public;
GRANT ALL ON guestbook_badges TO anon, authenticated, public;
GRANT ALL ON guestbook_config TO anon, authenticated, public;
GRANT ALL ON guestbook_analytics TO anon, authenticated, public;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, public;

-- Grant function execution
GRANT EXECUTE ON FUNCTION claim_next_tile(VARCHAR, VARCHAR) TO anon, authenticated, public;

-- Step 7: Test the function works
-- Uncomment to test:
-- SELECT * FROM claim_next_tile('Test User', 'test@example.com');
-- Update claim_next_tile function to handle email duplicates
-- and add SECURITY DEFINER for proper permissions

-- Drop ALL existing versions of the function
DROP FUNCTION IF EXISTS claim_next_tile CASCADE;
DROP FUNCTION IF EXISTS claim_next_tile(VARCHAR, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS claim_next_tile(VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS claim_next_tile(TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS claim_next_tile(TEXT) CASCADE;

-- Create the new version
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

-- Grant execute permission to public
GRANT EXECUTE ON FUNCTION claim_next_tile(VARCHAR, VARCHAR) TO anon, authenticated, public;
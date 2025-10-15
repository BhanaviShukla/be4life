# 🚨 IMPORTANT: Run These Migrations in Supabase

## Run these SQL migrations in order to fix the RLS policy error:

### Step 1: Go to Supabase Dashboard
1. Open your Supabase project dashboard
2. Navigate to **SQL Editor** (in the left sidebar)

### Step 2: Run Migration 002 - Fix RLS Policies
Run the contents of `002_fix_rls_policies.sql`:

This will:
- Remove restrictive RLS policies
- Add permissive policies that allow public access
- Grant necessary permissions

### Step 3: Run Migration 003 - Update Claim Function
Run the contents of `003_update_claim_function.sql`:

This will:
- Update the claim_next_tile function with SECURITY DEFINER
- Add email duplicate checking
- Handle race conditions

### Step 4: Verify Everything Works
After running both migrations:
1. Try creating a new tile at `/guestbook`
2. The canvas should load without RLS errors
3. Same email should not be able to claim multiple tiles

## Quick Copy-Paste Commands

If you want to run everything at once, copy and paste this entire block into SQL Editor:

```sql
-- Fix RLS Policies
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

-- Create new permissive policies
CREATE POLICY "public_read_tiles" ON guestbook_tiles FOR SELECT USING (true);
CREATE POLICY "public_insert_tiles" ON guestbook_tiles FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_tiles" ON guestbook_tiles FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "public_read_drafts" ON guestbook_drafts FOR SELECT USING (true);
CREATE POLICY "public_insert_drafts" ON guestbook_drafts FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_drafts" ON guestbook_drafts FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "public_delete_drafts" ON guestbook_drafts FOR DELETE USING (true);

-- Grant permissions
GRANT ALL ON guestbook_tiles TO anon, authenticated;
GRANT ALL ON guestbook_drafts TO anon, authenticated;
GRANT ALL ON guestbook_badges TO anon, authenticated;
GRANT ALL ON guestbook_config TO anon, authenticated;
GRANT ALL ON guestbook_analytics TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Update claim function
DROP FUNCTION IF EXISTS claim_next_tile(VARCHAR, VARCHAR);

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
    IF p_guest_email IS NOT NULL AND p_guest_email != '' THEN
        SELECT gt.tile_number INTO v_existing_tile
        FROM guestbook_tiles gt
        WHERE gt.guest_email = p_guest_email
        LIMIT 1;
        
        IF v_existing_tile IS NOT NULL THEN
            RETURN QUERY SELECT v_existing_tile;
            RETURN;
        END IF;
    END IF;

    SELECT MIN(t.tile_number) INTO v_next_tile
    FROM generate_series(1, 100) AS t(tile_number)
    WHERE NOT EXISTS (
        SELECT 1 FROM guestbook_tiles gt 
        WHERE gt.tile_number = t.tile_number
    );
    
    IF v_next_tile IS NULL THEN
        RAISE EXCEPTION 'All tiles have been claimed';
    END IF;
    
    INSERT INTO guestbook_tiles (
        tile_number,
        position_row,
        position_col,
        guest_name,
        guest_email,
        status
    ) VALUES (
        v_next_tile,
        ((v_next_tile - 1) / 10) + 1,
        ((v_next_tile - 1) % 10) + 1,
        p_guest_name,
        p_guest_email,
        'draft'
    );
    
    RETURN QUERY SELECT v_next_tile;
EXCEPTION
    WHEN unique_violation THEN
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

GRANT EXECUTE ON FUNCTION claim_next_tile TO anon, authenticated, public;
```

## Troubleshooting

If you still get RLS errors after running these:

1. **Check RLS is enabled but policies are permissive:**
   - Go to Authentication > Policies in Supabase
   - Ensure the new "public_*" policies are active
   
2. **Check Storage Bucket:**
   - Go to Storage in Supabase
   - Ensure "guestbook_canvas" bucket exists
   - Set it to PUBLIC bucket if needed

3. **Test with SQL Editor:**
   ```sql
   -- Test the function works
   SELECT * FROM claim_next_tile('Test User', 'test@example.com');
   
   -- Check if tiles can be read
   SELECT * FROM guestbook_tiles;
   ```

## Important Notes

- These policies are permissive for a wedding guestbook (trusted guests)
- For production apps with untrusted users, implement proper authentication
- The app logic handles validation and security checks
- Email duplicate prevention is handled in the function
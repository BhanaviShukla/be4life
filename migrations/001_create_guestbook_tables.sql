-- Migration 001: Create Guestbook Tables
-- Description: Initial setup for Digital Guestbook Canvas feature
-- Author: Wedding Website System
-- Date: 2024

-- Enable UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. Create guestbook_tiles table
-- =====================================================
CREATE TABLE IF NOT EXISTS guestbook_tiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tile_number INTEGER UNIQUE NOT NULL CHECK (tile_number >= 1 AND tile_number <= 100),
    position_row INTEGER NOT NULL CHECK (position_row BETWEEN 1 AND 10),
    position_col INTEGER NOT NULL CHECK (position_col BETWEEN 1 AND 10),
    
    -- Guest Information
    guest_name TEXT NOT NULL,
    guest_email TEXT,
    guest_phone TEXT,
    guest_relation TEXT CHECK (guest_relation IN ('family', 'friend', 'colleague', 'other')),
    
    -- Canvas Data
    canvas_data_url TEXT, -- Base64 encoded canvas data
    canvas_data_json JSONB, -- Fabric.js canvas state for editing
    image_url TEXT, -- URL to stored image in Supabase Storage
    thumbnail_url TEXT, -- URL to thumbnail version
    
    -- Metadata
    badges TEXT[] DEFAULT '{}',
    hover_message TEXT CHECK (length(hover_message) <= 50),
    
    -- Status Management
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'edit_requested', 'rejected')),
    moderation_notes TEXT,
    admin_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submitted_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    
    -- Analytics
    creation_time_minutes INTEGER,
    tools_used JSONB DEFAULT '{}',
    edit_count INTEGER DEFAULT 0,
    device_type TEXT,
    browser_info TEXT,
    
    -- Constraints
    UNIQUE(position_row, position_col),
    CONSTRAINT valid_tile_position CHECK (
        tile_number = ((position_row - 1) * 10 + position_col)
    )
);

-- Create indexes for performance
CREATE INDEX idx_guestbook_tiles_status ON guestbook_tiles(status);
CREATE INDEX idx_guestbook_tiles_guest_email ON guestbook_tiles(guest_email);
CREATE INDEX idx_guestbook_tiles_guest_name ON guestbook_tiles(guest_name);
CREATE INDEX idx_guestbook_tiles_created_at ON guestbook_tiles(created_at DESC);
CREATE INDEX idx_guestbook_tiles_badges ON guestbook_tiles USING GIN(badges);

-- =====================================================
-- 2. Create guestbook_drafts table
-- =====================================================
CREATE TABLE IF NOT EXISTS guestbook_drafts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Guest Information
    guest_email TEXT,
    guest_name TEXT NOT NULL,
    session_id TEXT, -- For non-authenticated users
    
    -- Canvas Data
    canvas_data_url TEXT,
    canvas_data_json JSONB, -- Fabric.js state for recovery
    
    -- Reference to claimed tile
    tile_number INTEGER REFERENCES guestbook_tiles(tile_number) ON DELETE CASCADE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
    
    -- Auto-save tracking
    save_count INTEGER DEFAULT 0,
    last_action TEXT,
    
    -- Unique constraint: one draft per guest
    UNIQUE(guest_email),
    UNIQUE(session_id)
);

-- Create indexes for drafts
CREATE INDEX idx_guestbook_drafts_tile_number ON guestbook_drafts(tile_number);
CREATE INDEX idx_guestbook_drafts_expires_at ON guestbook_drafts(expires_at);
CREATE INDEX idx_guestbook_drafts_session ON guestbook_drafts(session_id);

-- =====================================================
-- 3. Create guestbook_badges table
-- =====================================================
CREATE TABLE IF NOT EXISTS guestbook_badges (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    emoji TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('humor', 'artistic', 'emotional', 'effort', 'style', 'special')),
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for active badges
CREATE INDEX idx_guestbook_badges_active ON guestbook_badges(is_active, display_order);

-- =====================================================
-- 4. Create guestbook_config table
-- =====================================================
CREATE TABLE IF NOT EXISTS guestbook_config (
    id TEXT PRIMARY KEY DEFAULT 'main',
    
    -- Feature flags
    is_enabled BOOLEAN DEFAULT true,
    is_revealed BOOLEAN DEFAULT false,
    reveal_date TIMESTAMP WITH TIME ZONE,
    
    -- Canvas settings
    max_tiles INTEGER DEFAULT 100,
    grid_rows INTEGER DEFAULT 10,
    grid_cols INTEGER DEFAULT 10,
    tile_width_px INTEGER DEFAULT 300,
    tile_height_px INTEGER DEFAULT 200,
    
    -- Limits
    max_stickers_per_tile INTEGER DEFAULT 10,
    max_text_boxes_per_tile INTEGER DEFAULT 5,
    max_file_size_mb INTEGER DEFAULT 5,
    
    -- Auto-save settings
    auto_save_interval_seconds INTEGER DEFAULT 30,
    draft_expiry_days INTEGER DEFAULT 7,
    
    -- Theme settings
    default_theme TEXT DEFAULT 'his',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. Create guestbook_analytics table
-- =====================================================
CREATE TABLE IF NOT EXISTS guestbook_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Event tracking
    event_type TEXT NOT NULL,
    event_category TEXT,
    event_data JSONB DEFAULT '{}',
    
    -- References
    tile_id UUID REFERENCES guestbook_tiles(id) ON DELETE CASCADE,
    guest_email TEXT,
    session_id TEXT,
    
    -- Context
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_address INET,
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for analytics
CREATE INDEX idx_guestbook_analytics_event ON guestbook_analytics(event_type, created_at DESC);
CREATE INDEX idx_guestbook_analytics_tile ON guestbook_analytics(tile_id);
CREATE INDEX idx_guestbook_analytics_session ON guestbook_analytics(session_id);

-- =====================================================
-- 6. Create guestbook_moderation_log table
-- =====================================================
CREATE TABLE IF NOT EXISTS guestbook_moderation_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- References
    tile_id UUID REFERENCES guestbook_tiles(id) ON DELETE CASCADE,
    
    -- Action details
    action TEXT NOT NULL CHECK (action IN ('approve', 'reject', 'edit_request', 'flag', 'unflag')),
    reason TEXT,
    notes TEXT,
    
    -- Admin info
    admin_email TEXT NOT NULL,
    admin_name TEXT,
    
    -- Previous state
    previous_status TEXT,
    new_status TEXT,
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for moderation log
CREATE INDEX idx_moderation_log_tile ON guestbook_moderation_log(tile_id, created_at DESC);

-- =====================================================
-- 7. Insert default badges
-- =====================================================
INSERT INTO guestbook_badges (id, label, emoji, category, description, display_order) VALUES
-- Humor Category
('funny', 'Funny', '🤣', 'humor', 'Makes us laugh', 10),
('playful', 'Playful', '😜', 'humor', 'Lighthearted and fun', 11),
('witty', 'Witty', '🎭', 'humor', 'Clever and cheeky', 12),

-- Artistic Category
('artistic', 'Artistic', '🎨', 'artistic', 'Beautiful design', 20),
('colorful', 'Colorful', '🌈', 'artistic', 'Vibrant and bold', 21),
('creative', 'Creative', '✨', 'artistic', 'Unique idea', 22),

-- Emotional Category
('heartfelt', 'Heartfelt', '❤️', 'emotional', 'Sweet and touching', 30),
('loving', 'Loving', '🥰', 'emotional', 'Warm and affectionate', 31),
('blessed', 'Blessed', '🙏', 'emotional', 'Spiritual/meaningful', 32),

-- Effort Category
('detailed', 'Detailed', '⭐', 'effort', 'Intricate work', 40),
('ambitious', 'Ambitious', '💪', 'effort', 'Complex creation', 41),
('thoughtful', 'Thoughtful', '🎯', 'effort', 'Well-considered', 42),

-- Style Category
('elegant', 'Elegant', '🌸', 'style', 'Refined and graceful', 50),
('bold', 'Bold', '🎪', 'style', 'Eye-catching', 51),
('photo_based', 'Photo-based', '📸', 'style', 'Image-centered', 52),

-- Special Category
('unique', 'Unique', '💎', 'special', 'One-of-a-kind', 60),
('standout', 'Standout', '🏆', 'special', 'Show-stopping', 61),
('personal', 'Personal', '✍️', 'special', 'Deeply personal', 62)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 8. Insert default configuration
-- =====================================================
INSERT INTO guestbook_config (
    id,
    is_enabled,
    is_revealed,
    reveal_date,
    max_tiles,
    grid_rows,
    grid_cols
) VALUES (
    'main',
    true,
    false,
    '2025-11-25 00:00:00+00',
    100,
    10,
    10
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 9. Create update trigger for updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_guestbook_tiles_updated_at 
    BEFORE UPDATE ON guestbook_tiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guestbook_config_updated_at 
    BEFORE UPDATE ON guestbook_config 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 10. Create function to claim next available tile
-- =====================================================
CREATE OR REPLACE FUNCTION claim_next_tile(
    p_guest_name TEXT,
    p_guest_email TEXT DEFAULT NULL
)
RETURNS TABLE (
    tile_number INTEGER,
    position_row INTEGER,
    position_col INTEGER
) AS $$
DECLARE
    v_tile_number INTEGER;
    v_row INTEGER;
    v_col INTEGER;
BEGIN
    -- Check if guest already has a tile
    IF p_guest_email IS NOT NULL THEN
        SELECT t.tile_number, t.position_row, t.position_col
        INTO v_tile_number, v_row, v_col
        FROM guestbook_tiles t
        WHERE t.guest_email = p_guest_email
        LIMIT 1;
        
        IF FOUND THEN
            RETURN QUERY SELECT v_tile_number, v_row, v_col;
            RETURN;
        END IF;
    END IF;
    
    -- Find next available tile number
    SELECT MIN(n.tile_num)
    INTO v_tile_number
    FROM generate_series(1, 100) n(tile_num)
    WHERE NOT EXISTS (
        SELECT 1 FROM guestbook_tiles t 
        WHERE t.tile_number = n.tile_num
    );
    
    -- If no tiles available
    IF v_tile_number IS NULL THEN
        RAISE EXCEPTION 'No tiles available';
    END IF;
    
    -- Calculate position
    v_row := ((v_tile_number - 1) / 10) + 1;
    v_col := ((v_tile_number - 1) % 10) + 1;
    
    -- Create tile entry
    INSERT INTO guestbook_tiles (
        tile_number, 
        position_row, 
        position_col, 
        guest_name, 
        guest_email,
        status
    ) VALUES (
        v_tile_number, 
        v_row, 
        v_col, 
        p_guest_name, 
        p_guest_email,
        'draft'
    );
    
    RETURN QUERY SELECT v_tile_number, v_row, v_col;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 11. Create view for public tile display
-- =====================================================
CREATE OR REPLACE VIEW public_tiles AS
SELECT 
    tile_number,
    position_row,
    position_col,
    guest_name,
    thumbnail_url,
    badges,
    hover_message,
    approved_at
FROM guestbook_tiles
WHERE status = 'approved'
ORDER BY tile_number;

-- Grant appropriate permissions (adjust based on your Supabase auth setup)
-- These will need to be configured in Supabase dashboard for RLS

COMMENT ON TABLE guestbook_tiles IS 'Main table storing individual guest tiles for the wedding canvas';
COMMENT ON TABLE guestbook_drafts IS 'Temporary storage for work-in-progress tiles with auto-save';
COMMENT ON TABLE guestbook_badges IS 'Available badges that guests can assign to their tiles';
COMMENT ON TABLE guestbook_config IS 'Global configuration for the guestbook feature';
COMMENT ON TABLE guestbook_analytics IS 'Event tracking for guestbook interactions';
COMMENT ON TABLE guestbook_moderation_log IS 'Audit trail for admin moderation actions';
# Digital Guestbook Canvas - Planning Context v1.0

## Executive Summary

A collaborative digital canvas where wedding guests create personalized 3cm×2cm tiles that combine into a unified artwork. The canvas remains hidden from guests until the big reveal during/post-wedding, creating anticipation and surprise. Each guest can download their individual tile for sharing, while the complete mosaic serves as a lasting wedding keepsake.

---

## Core Concept

### The Vision
"Leave Your Mark on Our Story" - Every guest contributes one mini-canvas to create a collective masterpiece that represents the community celebrating Bhanvi & Eshlok's union.

### Key Principles
1. **Privacy First**: Full canvas hidden until reveal
2. **Individual Ownership**: Each guest can share their own tile
3. **Quality Control**: Admin moderation before tiles go live
4. **Theme Integration**: Dual aesthetic (His/Hers) reflected throughout
5. **Emotional Impact**: The reveal moment is significant

---

## Canvas Specifications

### Grid Structure
- **Initial Size**: 10×10 grid = 100 tiles
- **Scalability**: Expandable to 15×15 (225 tiles) if needed
- **Tile Dimensions**: 3cm × 2cm (300px × 200px at 100dpi)
- **Total Canvas**: 30cm × 20cm (3000px × 2000px)
- **Aspect Ratio**: 3:2 (landscape orientation)

### Layout Strategy
```
Grid Visualization:
     Col1  Col2  Col3  ...  Col10
Row1 [ 1 ][ 2 ][ 3 ] ... [ 10 ]
Row2 [ 11][ 12][ 13] ... [ 20 ]
Row3 [ 21][ 22][ 23] ... [ 30 ]
...
Row10[ 91][ 92][ 93] ... [100]

Total: 100 tiles (10 rows × 10 columns)
```

### Tile Allocation Philosophy
- **No Specific Positioning**: Guests don't choose their spot
- **Sequential Assignment**: First-come, first-served tile allocation
- **Behind the Scenes**: System assigns next available position
- **Mystery Element**: Guests don't know where they'll be on final canvas
- **Equality**: No "better" or "worse" positions

---

## User Journey

### Phase 1: Discovery (Pre-Submission)

**Landing Page** (`/guestbook`)
```
Visual Design:
- Theme-aware hero section
  His theme: Deep teal background, gold accents
  Hers theme: Ivory background, dusty rose accents
- Elegant typography
- Watercolor elements (subtle)

Content:
┌─────────────────────────────────────────────┐
│                                             │
│        🎨 Leave Your Mark on Our Story      │
│                                             │
│   Create your personal tile on our digital │
│   wedding canvas - a keepsake we'll reveal │
│              during the celebration         │
│                                             │
│           [Claim Your Tile] 💫             │
│                                             │
│         "47 of 100 tiles created"          │
│                                             │
└─────────────────────────────────────────────┘

Key Messages:
- "Your contribution is part of something bigger"
- "The full canvas will be revealed at the wedding"
- "You can share your personal creation anytime"
- Gentle urgency: Counter showing tiles remaining
```

**Entry Flow**
1. Click "Claim Your Tile"
2. Name input field (required)
   - If guest has RSVP'd: Autocomplete from database
   - If new: Manual entry
   - Links to guest record (for relationship categorization)
3. System checks: One tile per guest enforced
4. Confirmation: "Your tile is reserved! Let's create."

### Phase 2: Creation Studio

**Canvas Editor Interface**

**Layout Structure:**
```
┌─────────────────────────────────────────────────────────┐
│ Header: "Your Canvas - [Guest Name]"           [X Close]│
├────────┬────────────────────────────────────────────────┤
│        │                                                │
│ TOOLS  │          CANVAS PREVIEW                        │
│ PANEL  │          (3cm × 2cm)                          │
│        │                                                │
│ [🖌️]   │      ┌──────────────────────┐                 │
│ [✏️]   │      │                      │                 │
│ [🖼️]   │      │   YOUR CREATION      │                 │
│ [🎨]   │      │      SPACE          │                 │
│ [🌟]   │      │                      │                 │
│ [↩️]   │      └──────────────────────┘                 │
│ [🗑️]   │                                                │
│        │    Zoom: [─────●─────] 100%                   │
│        │                                                │
├────────┴────────────────────────────────────────────────┤
│ Preview: "This is actual size on final canvas"         │
│ [Cancel] [← Back] [Preview →] Badge: [❤️ Heartfelt]    │
└─────────────────────────────────────────────────────────┘
```

**Tool Panel Details:**

**🖌️ Draw Tool**
```
Features:
- Brush sizes: XS (2px), S (4px), M (8px), L (12px)
- Color palette:
  • Theme colors (teal, gold, ivory, rose)
  • Full spectrum color picker
  • Recent colors (last 5 used)
- Opacity slider: 0-100%
- Brush styles: Solid, Soft, Calligraphy
- Eraser mode toggle
- Smooth anti-aliasing
- Pressure sensitivity (if device supports)

Use Cases:
- Signatures
- Doodles
- Abstract art
- Handwritten messages
- Decorative borders
```

**✏️ Text Tool**
```
Features:
- Font selection (6-8 options):
  • Elegant serif (Playfair Display)
  • Clean sans-serif (Inter)
  • Handwritten script (Dancing Script)
  • Playful (Pacifico)
  • Traditional (Cormorant Garamond)
  • Modern (Raleway)
- Size: 8px - 48px
- Colors: Full palette
- Effects:
  • Bold
  • Italic
  • Underline
  • Outline stroke
- Text alignment: Left/Center/Right
- Rotation: 360° (for angled text)
- Drag to reposition
- Multiple text boxes allowed

Use Cases:
- Names/initials
- Short messages ("Congratulations!")
- Quotes
- Blessings
- Inside jokes
```

**🖼️ Upload Tool**
```
Features:
- Drag & drop or click to browse
- Accepted formats: JPG, PNG, GIF, SVG
- Max file size: 5MB
- Auto-resize to fit 300×200px canvas
- Editing controls:
  • Crop (with aspect ratio lock)
  • Zoom in/out on image
  • Rotate 90° increments
  • Position adjustment
- Filters:
  • Original
  • Black & White
  • Sepia
  • Vintage
  • High contrast
  • Soft blur (for backgrounds)
- Opacity: 0-100%
- Layer position: Send to back/bring to front

Use Cases:
- Personal photos
- Couple photos together
- Meaningful symbols
- Pets
- Shared memories
- Location screenshots
```

**🎨 Background Tool**
```
Features:
- Solid colors:
  • Theme palette (quick access)
  • Custom color picker
- Gradients:
  • Linear (angle adjustable)
  • Radial (center point adjustable)
  • Two-color or multi-stop
- Patterns:
  • Dots
  • Stripes (thin/thick, horizontal/vertical/diagonal)
  • Floral (subtle)
  • Geometric (triangles, hexagons)
  • Watercolor textures
- Transparency slider
- Pattern scale adjustment
- Pattern color customization

Use Cases:
- Clean canvas base
- Color blocking
- Subtle texture
- Thematic consistency (using wedding colors)
```

**🌟 Sticker Library**
```
Categories:

Wedding & Love:
💒 💍 💐 💕 💝 💞 💖 ✨ 🌟 ⭐ 💫
🎊 🎉 🎈 🎀 🥂 🍾 👰 🤵 💏

Cultural & Traditional:
🪔 🕉️ 🙏 🌺 🌸 🌼 🏵️ 🔱 🕊️

Nature & Beauty:
🌹 🌷 🌻 🌿 🍃 🦋 🐝 ☀️ 🌙 🌈 ⭐

Celebratory:
🎆 🎇 ✨ 🎊 🎉 🎈 🎁 🎵 🎶 🎼

Emojis:
😊 😍 🥰 😘 🤗 💛 💚 💙 💜 🧡

Features:
- Drag onto canvas
- Resize (pinch or drag corners)
- Rotate 360°
- Duplicate (for patterns)
- Layer ordering
- Opacity control
- Color tint (for some stickers)
- Delete individual stickers

Limits:
- Max 10 stickers per canvas (prevent clutter)
- Size constraints (min 20px, max 150px)
```

**↩️ History Tool**
```
Features:
- Undo (last 20 actions)
- Redo (after undo)
- Keyboard shortcuts:
  • Cmd/Ctrl + Z (undo)
  • Cmd/Ctrl + Shift + Z (redo)
- Action history panel (optional):
  "Added text 'Congratulations'"
  "Uploaded image"
  "Changed background color"

Use Cases:
- Fixing mistakes
- Experimenting without commitment
- Reverting unwanted changes
```

**🗑️ Clear/Reset Tool**
```
Features:
- "Start Over" button
- Confirmation dialog:
  "Are you sure? This will delete everything."
  [Cancel] [Yes, Clear Canvas]
- Preserves: Guest name, tile assignment
- Resets: All canvas content to blank

Safeguards:
- Double confirmation required
- Cannot undo after confirmation
- Auto-save before clear (recovery option)
```

**Additional Editor Features:**

**Auto-Save**
- Saves every 30 seconds
- Saves on every significant action
- Visual indicator: "Last saved 2 minutes ago"
- Recovery if browser crashes
- Drafts stored in Supabase

**Zoom Controls**
- Slider: 50% - 200%
- Fit to screen button
- Actual size preview toggle
- Pinch to zoom (touch devices)
- Scroll wheel zoom (desktop)

**Grid Overlay (Optional)**
- Toggle on/off
- Helps with alignment
- Doesn't appear in final export
- Subtle lines, doesn't interfere

**Keyboard Shortcuts**
- Delete: Remove selected element
- Cmd/Ctrl + A: Select all
- Cmd/Ctrl + D: Duplicate
- Arrow keys: Nudge selected element
- Spacebar: Pan canvas (when zoomed)

### Phase 3: Preview & Badge Selection

**Preview Screen**

**Layout:**
```
┌─────────────────────────────────────────────────┐
│                                                 │
│              Your Creation                      │
│                                                 │
│         ┌─────────────────────┐                │
│         │                     │                │
│         │   [TILE PREVIEW]    │                │
│         │   (Actual size)     │                │
│         │                     │                │
│         └─────────────────────┘                │
│                                                 │
│   "This is how it will appear on our canvas"   │
│                                                 │
│   What vibe does your tile have?               │
│   (Select badges that fit)                     │
│                                                 │
│   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐         │
│   │  😂  │ │  🎨  │ │  ❤️  │ │  ✨  │         │
│   │Funny │ │Artist│ │Heart │ │Unique│         │
│   └──────┘ └──────┘ └──────┘ └──────┘         │
│                                                 │
│   Optional Message (hover text on canvas):     │
│   ┌─────────────────────────────────────────┐  │
│   │ "Wishing you both endless happiness!"  │  │
│   └─────────────────────────────────────────┘  │
│   (Max 50 characters)                          │
│                                                 │
│   [← Back to Edit]  [Submit for Review →]     │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Badge System**

**Available Badges:**
```
Category: Humor
🤣 Funny - Makes us laugh
😜 Playful - Lighthearted and fun
🎭 Witty - Clever and cheeky

Category: Artistic
🎨 Artistic - Beautiful design
🌈 Colorful - Vibrant and bold
✨ Creative - Unique idea

Category: Emotional
❤️ Heartfelt - Sweet and touching
🥰 Loving - Warm and affectionate
🙏 Blessed - Spiritual/meaningful

Category: Effort
⭐ Detailed - Intricate work
💪 Ambitious - Complex creation
🎯 Thoughtful - Well-considered

Category: Style
🌸 Elegant - Refined and graceful
🎪 Bold - Eye-catching
📸 Photo-based - Image-centered

Category: Special
💎 Unique - One-of-a-kind
🏆 Standout - Show-stopping
✍️ Personal - Deeply personal
```

**Badge Selection Rules:**
- Multi-select allowed (max 3 badges)
- Optional (can submit without badges)
- Guest self-identifies (honor system)
- Used for filtering/sorting post-reveal
- Helps with "awards" at wedding
- Admin can add/modify badges during moderation

**Hover Message:**
- Optional text that appears when hovering over tile (post-reveal)
- Max 50 characters
- Examples:
  - "Love you both! - Sarah"
  - "May your adventure never end"
  - "From your college roommate 💕"
  - "Remember London? This is for that!"
- Can include emoji
- Moderated for appropriateness

### Phase 4: Submission

**Submission Flow:**
```
1. Guest clicks "Submit for Review"

2. Confirmation Screen:
   "Your tile has been submitted! 🎉"
   
   What happens next:
   ✓ Your tile is saved securely
   ✓ Bhanvi & Eshlok will review it
   ✓ Once approved, it's locked in forever
   ✓ You can download your tile now
   ✓ Full canvas reveals at the wedding!
   
   [Download My Tile] [Create Another] [Done]

3. Tile Status:
   - Pending Approval (admin notification sent)
   - Guest cannot edit after submission
   - Stored in Supabase with metadata

4. Email Confirmation (Optional):
   "Thanks for creating your tile!
   We can't wait to reveal the full canvas.
   Download your tile: [link]
   See you at the wedding! 💕"
```

**Download Feature:**

**Individual Tile Download:**
```
Formats Available:
- PNG (transparent background option)
- JPG (with white/theme color background)
- High Resolution (600×400px, 2x scale for clarity)

Download Options:
1. "Download my tile" button
2. Includes small watermark (optional):
   "Part of Bhanvi & Eshlok's Wedding Canvas"
3. Social sharing pre-populated text:
   "I just created my tile for Bhanvi & Eshlok's 
    wedding canvas! 🎨💕 #BE4Life"

Use Cases:
- Share on Instagram/Facebook
- Send to friends/family
- Personal keepsake before reveal
- Show off creativity

Technical:
- Canvas to image conversion (HTML5 Canvas API)
- Client-side generation (no server needed)
- Instant download
```

**Post-Download Actions:**
```
After download screen:
"Share your creation! 📱"

[Share on Instagram] [Share on Facebook] [Copy Link]

Pre-filled caption:
"I contributed to @bhanvi & @eshlok's wedding 
canvas! Can't wait to see the full masterpiece 
at their celebration 🎨💕 #BE4Life #WeddingCanvas"

Encourages:
- Social media buzz
- Other guests to participate
- FOMO for those who haven't created yet
```

---

## Admin Moderation System

### Admin Dashboard (`/admin`)

**Pending Approvals Queue:**
```
┌────────────────────────────────────────────────────┐
│  Digital Guestbook - Pending Review (7)           │
├────────────────────────────────────────────────────┤
│                                                    │
│  Tile #23 - Sarah Martinez                        │
│  ┌──────────┐  Badges: ❤️ Heartfelt, ✨ Creative │
│  │ [TILE]   │  Message: "Love you both!"          │
│  │ PREVIEW  │  Submitted: 2 hours ago             │
│  └──────────┘                                      │
│  [✓ Approve] [✏️ Request Edit] [✗ Reject]        │
│                                                    │
├────────────────────────────────────────────────────┤
│                                                    │
│  Tile #24 - Rajesh Kumar                          │
│  ┌──────────┐  Badges: 🤣 Funny                   │
│  │ [TILE]   │  Message: "Finally tying the knot!" │
│  │ PREVIEW  │  Submitted: 5 hours ago             │
│  └──────────┘                                      │
│  ⚠️ Flagged: Check content                        │
│  [✓ Approve] [✏️ Request Edit] [✗ Reject]        │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Moderation Actions:**

**1. Approve**
- Tile becomes permanent
- Guest cannot edit anymore
- Tile now part of final canvas
- Guest receives notification (optional):
  "Your tile has been approved! 🎉"

**2. Request Edit**
- Opens dialog:
  ```
  Request Changes:
  ┌─────────────────────────────────────┐
  │ Reason for edit request:            │
  │ [Text area]                         │
  │                                     │
  │ Example: "Could you remove the      │
  │ profanity and resubmit? Thanks!"    │
  └─────────────────────────────────────┘
  [Cancel] [Send Request]
  ```
- Guest gets email/notification with feedback
- Tile status: "Edit Requested"
- Guest can access editor again
- Previous version saved (in case they prefer it)

**3. Reject**
- Rare, extreme cases only
- Opens dialog:
  ```
  Reject Tile:
  ┌─────────────────────────────────────┐
  │ Reason (will be sent to guest):     │
  │ [Text area]                         │
  │                                     │
  │ Example: "This content violates     │
  │ our guidelines. Please create a new │
  │ tile with appropriate content."     │
  └─────────────────────────────────────┘
  ⚠️ Guest will need to create new tile
  [Cancel] [Confirm Rejection]
  ```
- Tile deleted from system
- Guest notified with reason
- Guest can create new tile (one retry allowed)

**Moderation Guidelines:**

**Auto-Approve Triggers (Future):**
- Known trusted guests (family, close friends)
- Simple text-only tiles
- No uploads, just drawing/text
- No profanity detected

**Flag for Review:**
- Contains uploaded images
- Profanity filter triggered
- All-caps text (might be shouting)
- Excessive stickers (>7)
- Blank or nearly blank tiles
- Very dark/unreadable content

**Instant Reject Criteria:**
- Hate speech
- Inappropriate imagery
- Spam/advertising
- Malicious content
- Completely off-topic

**Batch Actions:**
```
Select multiple tiles:
[✓ Tile #23] [✓ Tile #24] [✓ Tile #25]

Bulk Actions:
[Approve Selected] [Download Selected] [Export Data]
```

**Admin Metrics Dashboard:**
```
┌─────────────────────────────────────────┐
│  Guestbook Statistics                   │
├─────────────────────────────────────────┤
│  Total Tiles: 47/100                    │
│  Approved: 40                           │
│  Pending: 7                             │
│  Edit Requested: 0                      │
│  Rejected: 0                            │
│                                         │
│  By Badge:                              │
│  ❤️ Heartfelt: 18                      │
│  🤣 Funny: 12                          │
│  🎨 Artistic: 15                       │
│  ✨ Creative: 22                       │
│                                         │
│  Completion Rate:                       │
│  Started: 52 | Completed: 47 (90%)     │
│                                         │
│  Average Time to Complete: 8 min       │
│  Most Used Tool: Text (73%)            │
│  Most Popular Color: Rose (#B77C87)    │
└─────────────────────────────────────────┘
```

---

## Privacy & Reveal Strategy

### Pre-Reveal (Guest Experience)

**What Guests Can See:**
- ✅ Their own tile (full access)
- ✅ Download their tile anytime
- ✅ Tile count: "47 of 100 tiles created"
- ✅ Approval status: "Your tile is approved!"
- ❌ Other guests' tiles
- ❌ Full canvas
- ❌ Tile positions
- ❌ Who else has created tiles

**UI Messaging:**
```
On guestbook page after submission:
┌─────────────────────────────────────────┐
│  Your tile is saved! 🎉                 │
│                                         │
│  The full canvas is a surprise and will │
│  be revealed during our celebration.    │
│                                         │
│  In the meantime:                       │
│  • [Download your tile]                 │
│  • [Share on social media]              │
│  • Tell your friends to create theirs!  │
│                                         │
│  See you at the wedding! 💕             │
└─────────────────────────────────────────┘
```

**Tease Campaign (Leading Up to Wedding):**
- Week -4: "50% of the canvas is filled!"
- Week -2: "Only 20 tiles left - claim yours!"
- Week -1: "The canvas is almost complete..."
- Day -1: "Tomorrow, you'll see the masterpiece!"

### The Big Reveal

**Option 1: Physical Reveal at Wedding**
```
Timing: Cocktail hour or during reception

Setup:
- Print full canvas as large poster (2ft × 3ft)
- Cover with elegant draping
- Unveiling ceremony:
  • Short speech about collaboration
  • "You each created one piece..."
  • Dramatic reveal moment
  • Guests find their tiles
  • Photo opportunity

Digital Component:
- Simultaneously unlock on website
- Live URL displayed: be4.life/guestbook/reveal
- QR codes on tables to view online
```

**Option 2: Digital-First Reveal**
```
Timing: During welcome dinner or first event

Method:
- Projector display at venue
- Animated reveal:
  • Start with grid outline
  • Tiles "paint in" one by one
  • Accompanying music
  • Final flourish when complete
- Guests can follow along on phones
```

**Option 3: Surprise Morning-Of**
```
Timing: Wedding morning (email blast)

Method:
- Email to all guests:
  "Good morning! Today's the day! 💕
   As a gift, here's the complete guestbook
   canvas you all created together.
   Find your tile and see the beautiful
   masterpiece you made.
   [View Canvas]"
- Unlocks website viewing
- Creates pre-ceremony excitement
```

### Post-Reveal Features

**Full Canvas Page** (`/guestbook/reveal`)

**Interactive Canvas View:**
```
Features:
- Infinite zoom (out: full canvas, in: individual tiles)
- Click any tile:
  • Enlarges
  • Shows guest name
  • Shows hover message
  • Shows badges
  • "Created by [Name]" caption
- Navigation:
  • Arrow keys: Navigate tile by tile
  • Search: "Find [guest name]'s tile"
  • Filter by badge: Show only ❤️ Heartfelt tiles
- Timeline scrubber:
  • "Watch the canvas being built"
  • Playback of tile-by-tile creation
  • Shows dates/times

Layout:
┌──────────────────────────────────────────────┐
│  Our Wedding Canvas - Complete! 🎨           │
├──────────────────────────────────────────────┤
│  [Zoom Out]  [Zoom In]  [Download]  [Share] │
├──────────────────────────────────────────────┤
│                                              │
│         [FULL 10×10 CANVAS DISPLAYED]        │
│         (Click any tile to enlarge)          │
│                                              │
├──────────────────────────────────────────────┤
│  Filters: [All] [❤️] [🤣] [🎨] [✨]         │
│  Search: [Find guest name...]                │
│  Timeline: [◀ Replay Creation]              │
└──────────────────────────────────────────────┘
```

**Social Sharing (Post-Reveal):**
```
Share buttons:
- "Share full canvas" → Social media
- "Share my tile" → Highlights specific tile
- "Share before/after" → Teaser vs reveal

Pre-filled captions:
"The complete wedding canvas for @bhanvi & @eshlok! 
 🎨 100 guests, 100 tiles, 1 masterpiece.
 Can you find mine? 💕 #BE4Life #WeddingCanvas"
```

**Download Options (Post-Reveal):**
```
For Couple:
- Ultra high-res (6000×4000px, print quality)
- Individual tiles as ZIP file
- With guest names overlay (for reference)
- Without names (clean version)
- PDF compilation book (one tile per page)

For Guests:
- Medium res (3000×2000px)
- Watermarked with wedding info
- Personal tile highlighted version
```

**Awards & Recognition:**

**Categories (Announced at Reception):**
```
🏆 Most Creative: Voted by couple
🎨 Most Artistic: Technical skill
😂 Funniest: Made us laugh most
❤️ Most Heartfelt: Touched our hearts
✨ Most Unique: Completely unexpected
👥 Guest Favorite: Most likes (if voting enabled)

Winners get:
- Highlighted on canvas display
- Special mention in speech
- Small gift/prize
- Feature on thank-you page
```

**Physical Products (Post-Wedding):**
```
Ideas:
- Canvas print for home (framed)
- Photo book with tile compilation
- Individual thank-you cards with each guest's tile
- Anniversary editions (revisit each year)
- Tile coasters (select favorites)
- Tote bag with canvas pattern
```

---

## Technical Architecture

### Database Schema (Supabase)

**Table: `guestbook_tiles`**
```sql
{
  id: uuid (primary key),
  tile_number: integer (1-100),
  position_row: integer (1-10),
  position_col: integer (1-10),
  
  -- Guest info
  guest_id: uuid (foreign key to guests table),
  guest_name: text,
  guest_email: text,
  guest_relation: enum (family, friend, colleague),
  
  -- Canvas data
  canvas_data_url: text, -- Base64 data URL or blob reference
  image_url: text, -- If uploaded image, Supabase Storage URL
  thumbnail_url: text, -- Smaller version for quick loading
  
  -- Metadata
  badges: text[], -- Array of badge IDs
  hover_message: text (max 50 chars),
  
  -- Status
  status: enum (draft, submitted, approved, edit_requested, rejected),
  moderation_notes: text,
  
  -- Timestamps
  created_at: timestamp,
  updated_at: timestamp,
  submitted_at: timestamp,
  approved_at: timestamp,
  
  -- Analytics
  creation_time_minutes: integer, -- How long to create
  tools_used: jsonb, -- Which tools they used
  edit_count: integer, -- Number of times edited
  
  -- Constraints
  UNIQUE(guest_id), -- One tile per guest
  UNIQUE(tile_number) -- Each tile number used once
}
```

**Table: `guestbook_drafts`**
```sql
{
  id: uuid (primary key),
  guest_id: uuid (foreign key),
  canvas_data_url: text,
  last_saved_at: timestamp,
  
  -- Auto-save functionality
  -- Allows recovery if browser crashes
  -- Deleted after successful submission
}
```

**Table: `guestbook_badges`**
```sql
{
  id: text (primary key, e.g., "heartfelt"),
  label: text ("Heartfelt"),
  emoji: text ("❤️"),
  category: text ("emotional"),
  display_order: integer,
  is_active: boolean
}
```

**Table: `guestbook_analytics`**
```sql
{
  id: uuid (primary key),
  event_type: text (tile_started, tile_submitted, tool_used, etc.),
  guest_id: uuid,
  tile_id: uuid,
  metadata: jsonb,
  timestamp: timestamp
}
```

### Storage (Supabase Storage)

**Buckets:**
```
guestbook-tiles/
  ├── originals/
  │   ├── tile_001_original.png (high-res)
  │   ├── tile_002_original.png
  │   └── ...
  ├── thumbnails/
  │   ├── tile_001_thumb.png (300×200)
  │   └── ...
  ├── downloads/
  │   ├── tile_001_share.png (with watermark)
  │   └── ...
  └── full-canvas/
      ├── canvas_complete.png (full resolution)
      ├── canvas_complete_print.png (ultra high-res)
      └── canvas_preview.png (low-res for quick load)
```

**Storage Policies:**
- Guests: Read-only access to their own tile
- Admin: Full access to all tiles
- Public: No access until reveal (flag flipped)
- Post-reveal: Read-only public access

### Authentication (Supabase Auth)

**Guest Authentication:**
```
Current MVP: No login required
- Guest identified by name + email
- Session cookie to prevent multiple submissions
- Linked to RSVP data if exists

Future: Full Auth
- Magic link login (email)
- Or phone OTP
- Tied to RSVP guest record
- Enables:
  • Returning to edit drafts
  • Viewing submission status
  • Profile page with their contributions
```

**Admin Authentication:**
```
- Supabase Auth with email/password
- Admin role in user metadata
- Protected routes: /admin/*
- Row-level security policies
- Session-based (stay logged in)
```

### API Endpoints (Next.js API Routes)

**`/api/guestbook/claim-tile`**
```
POST request
Body: { guestName, guestEmail, guestId }
Returns: { tileNumber, position: {row, col}, draftId }

Logic:
1. Check if guest already has tile (return existing)
2. Find next available tile number
3. Create draft record
4. Return tile assignment
```

**`/api/guestbook/save-draft`**
```
POST request (auto-save, every 30 sec)
Body: { draftId, canvasDataUrl, toolsUsed }
Returns: { success, lastSavedAt }

Logic:
1. Validate guest session
2. Update draft record
3. Store canvas data
4. Return confirmation
```

**`/api/guestbook/submit-tile`**
```
POST request
Body: { 
  draftId, 
  canvasDataUrl, 
  badges, 
  hoverMessage,
  creationTimeMinutes 
}
Returns: { success, tileId, status }

Logic:
1. Validate complete tile
2. Create tile record (status: submitted)
3. Upload to Supabase Storage
4. Generate thumbnail
5. Delete draft
6. Notify admin (email/webhook)
7. Return confirmation
```

**`/api/guestbook/download-tile`**
```
GET request
Params: ?tileId=xxx&format=png&includeWatermark=true
Returns: Image file (download)

Logic:
1. Validate guest owns this tile (or post-reveal)
2. Fetch tile from storage
3. Apply watermark if requested
4. Return image with proper headers
```

**`/api/admin/guestbook/pending`**
```
GET request (admin only)
Returns: { tiles: [...], count }

Logic:
1. Verify admin auth
2. Fetch all tiles with status=submitted
3. Sort by submission time
4. Return with metadata
```

**`/api/admin/guestbook/moderate`**
```
POST request (admin only)
Body: { tileId, action: approve|edit|reject, notes }
Returns: { success }

Logic:
1. Verify admin auth
2. Update tile status
3. If approved: Increment approved count, notify guest
4. If edit: Send feedback to guest
5. If reject: Mark for deletion
6. Log action
```

**`/api/guestbook/reveal-status`**
```
GET request
Returns: { isRevealed: boolean, revealDate, totalTiles }

Logic:
1. Check reveal flag in config
2. Return current status
3. Used to show/hide full canvas
```

**`/api/guestbook/canvas/full`**
```
GET request (post-reveal only)
Returns: { 
  canvasImageUrl, 
  tiles: [...],
  stats: {...}
}

Logic:
1. Check if revealed
2. Fetch all approved tiles
3. Composite canvas image (if not cached)
4. Return full data with positions
```

---

## Content & Messaging

### Call-to-Action Copy

**Primary CTA (Homepage):**
```
"Be Part of Our Story"
Create your tile on our digital wedding canvas
[Get Started →]
```

**Secondary CTA (After RSVP):**
```
"One more thing! 🎨"
Leave your creative mark on our guestbook canvas
[Create Your Tile]
```

**Urgency Messaging:**
```
When 70% full:
"Only 30 tiles remaining! Claim yours before they're gone."

When 90% full:
"Almost complete! Just 10 tiles left to fill our canvas."

When 100% full:
"Canvas Complete! 🎉 The full masterpiece will be revealed at the wedding."
```

### Email Touchpoints

**Tile Approved:**
```
Subject: Your tile is approved! 🎉

Hi [Name],

Your beautiful tile for our wedding canvas has been approved! 
It's now a permanent part of our celebration.

The full canvas will be revealed at the wedding, but you can 
download your personal tile anytime to share with friends.

[Download My Tile]

Can't wait to celebrate with you!
Love,
Bhanvi & Eshlok
```

**Edit Requested:**
```
Subject: Quick edit needed for your guestbook tile

Hi [Name],

We love what you created! Could you make a small adjustment?

Reason: [Admin's feedback]

You can edit your tile here: [Link]

Thanks for understanding!
B & E
```

**Reveal Day:**
```
Subject: 🎨 The big reveal is here!

Good morning [Name]!

Today's the day! 💕

As a special treat, we're revealing the complete guestbook canvas 
that you all created together. It's absolutely beautiful.

[View the Full Canvas]

Find your tile and see the masterpiece we made together.
See you soon!

Love,
Bhanvi & Eshlok
```

### Social Media Assets

**For Guests to Share:**
```
Instagram Story Template:
- Background: Their tile
- Sticker: "I contributed to Bhanvi & Eshlok's wedding canvas!"
- Date: November 25, 2025
- Countdown timer
- Link sticker to be4.life/guestbook

Instagram Post Caption:
"Just added my tile to @be4life wedding canvas! 
🎨💕 Can't wait to see the full masterpiece at their 
celebration. Create yours too! Link in bio. #BE4Life"

Facebook Post:
"I just contributed to Bhanvi and Eshlok's digital wedding 
canvas! Each guest creates a personalized 3cm×2cm tile, and 
the full canvas will be revealed at their wedding in November. 
Such a beautiful way to be part of their story! 💕"
```

**For Couple to Share:**
```
Progress Updates (Instagram Stories):
Week 1: "10 tiles created already! 🎨"
Week 4: "Halfway there! The canvas is taking shape..."
Week 8: "80 tiles! We're amazed by your creativity!"
Week 10: "The canvas is complete! Reveal coming soon..."

Teaser Posts:
- Blurred close-ups of interesting tiles
- Color palette visualization
- "Guess who made this one?" polls
- Behind-the-scenes of approval process
```

---

## Success Metrics

### Engagement Metrics
- **Participation Rate**: Target 80%+ of invited guests
- **Completion Rate**: 90%+ of started tiles finished
- **Average Creation Time**: 5-10 minutes (sweet spot)
- **Tile Approval Rate**: 95%+ approved without edits
- **Social Shares**: 30%+ of guests share their tile

### Quality Metrics
- **Badge Distribution**: Balanced across categories
- **Tool Usage**: Variety (not everyone uses same tool)
- **Visual Diversity**: Mix of styles, colors, approaches
- **Message Inclusion**: 60%+ add hover messages

### Technical Metrics
- **Page Load Time**: <2 seconds
- **Canvas Save Time**: <1 second
- **Download Generation**: <3 seconds
- **Mobile Completion Rate**: 70%+ on mobile devices
- **Browser Compatibility**: 99%+ success rate

### Post-Reveal Metrics
- **Canvas Views**: Every guest views at least once
- **Time on Canvas Page**: 5+ minutes average
- **Tile Search Usage**: 60%+ use search feature
- **Download Rate**: 40%+ download full canvas

---

## Risk Mitigation

### Technical Risks

**Risk: Canvas rendering issues on mobile**
- Mitigation: Responsive canvas sizing, tested on 10+ devices
- Fallback: Desktop-only editor with mobile preview

**Risk: Data loss during creation**
- Mitigation: Auto-save every 30 seconds, recovery system
- Fallback: Draft emails sent after 5 minutes of inactivity

**Risk: Storage limits (Supabase free tier)**
- Mitigation: Compress images, use efficient formats
- Fallback: Upgrade plan, or use Cloudinary

**Risk: Abuse/spam submissions**
- Mitigation: Rate limiting, moderation queue, email verification
- Fallback: Manual review all submissions

### User Experience Risks

**Risk: Guests confused by tools**
- Mitigation: Inline tooltips, video tutorial, examples
- Fallback: "Start with template" option

**Risk: Low participation rate**
- Mitigation: Multiple reminder emails, social proof counter
- Fallback: Fill remaining tiles with couple's memories

**Risk: Inappropriate content submitted**
- Mitigation: Moderation queue, profanity filter, content policy
- Fallback: Admin can edit or replace tiles

**Risk: Guests disappointed by reveal timing**
- Mitigation: Clear messaging about reveal date
- Fallback: Early reveal option if too much demand

### Social Risks

**Risk: Guests compare tiles (embarrassment)**
- Mitigation: Emphasize "no wrong way to create"
- Fallback: "Every tile is special" messaging

**Risk: Forgotten guests (didn't get invite)**
- Mitigation: Guest list verification, flexible tile count
- Fallback: Expand grid to accommodate extras

---

## Future Enhancements

### Phase 2 Features (Post-Wedding)
- **Collaborative tiles**: Two guests work on one tile together
- **Animation**: Tiles can have subtle animations
- **Video tiles**: 3-second video clips in tiles
- **Sound**: Attach audio messages to tiles
- **3D depth**: Layered tiles with parallax effect

### Advanced Interactions
- **Tile trading**: Guests can request position swaps
- **Tile evolution**: Update tiles on anniversaries
- **Guest comments**: Comment on others' tiles post-reveal
- **Voting system**: Upvote favorite tiles
- **Tile stories**: Click to read extended story behind tile

### Physical Integration
- **QR codes on tiles**: Print canvas with QR codes linking to digital
- **AR overlay**: Point phone at printed canvas to see animations
- **Tile postcards**: Send physical postcard of each tile to guest
- **Canvas puzzle**: Order physical puzzle of the canvas

### Gamification
- **Achievements**: Unlock badges for milestones
- **Easter eggs**: Hidden surprises in certain tile positions
- **Scavenger hunt**: Find specific elements across tiles
- **Tile bingo**: Create bingo card from tile elements

---

## Launch Checklist

### Pre-Launch (2 weeks before)
- [ ] Test on 10+ device/browser combinations
- [ ] Load test with 50 simultaneous users
- [ ] Backup strategy confirmed (daily Supabase backups)
- [ ] Admin dashboard fully functional
- [ ] Moderation guidelines documented
- [ ] Support email/contact established
- [ ] Tutorial video recorded
- [ ] Example tiles created (3-5 diverse styles)

### Launch Day
- [ ] Announcement email sent to all guests
- [ ] Social media posts published
- [ ] Monitoring alerts active (Supabase, Vercel)
- [ ] Admin logged in and monitoring submissions
- [ ] Response templates ready for common questions

### Weekly Monitoring
- [ ] Review participation rate
- [ ] Approve pending tiles (within 24 hours)
- [ ] Send reminder to guests who haven't created
- [ ] Share progress updates on social media
- [ ] Address any technical issues immediately

### Pre-Wedding (1 week before)
- [ ] Final reminder to complete tiles
- [ ] Prepare reveal logistics
- [ ] Export all tiles as backup
- [ ] Generate full canvas composite
- [ ] Test reveal page thoroughly
- [ ] Print physical canvas (if applicable)

### Reveal Day
- [ ] Flip reveal flag (make canvas public)
- [ ] Send reveal email to all guests
- [ ] Monitor server load (high traffic expected)
- [ ] Post social media with full canvas
- [ ] Gather guest reactions

### Post-Wedding
- [ ] Thank guests for participation
- [ ] Share awards/winners
- [ ] Make high-res downloads available
- [ ] Order physical products
- [ ] Archive project (keep forever!)

---

## Conclusion

The Digital Guestbook Canvas is more than a feature—it's a collaborative art project that brings your wedding community together. By giving each guest agency to contribute while maintaining the mystery of the full picture, you create anticipation and excitement that pays off with a beautiful reveal moment.

The 10×10 grid is perfectly sized for intimacy (100 tiles = close friends and family), and the moderation system ensures quality while respecting creative freedom. The post-reveal experience transforms the canvas from a hidden surprise into a cherished keepsake that you'll revisit for years.

Most importantly, every guest leaves a literal mark on your wedding story—a digital fingerprint that says "I was here, I celebrated with you, and I'm part of this moment forever."

---

**Document Version**: 1.0  

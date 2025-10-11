# Digital Guestbook Canvas - Implementation Plan

## Overview
Implementation of a 10×10 grid digital canvas where wedding guests create personalized tiles. The complete canvas remains hidden until reveal at the wedding, maintaining the design system from `design_system.md`.

## 📊 Current Progress Summary
**Last Updated:** Phase 3 Complete (Canvas Tools Implemented)

### ✅ Completed Phases:
- **Phase 1**: Infrastructure Setup (SQL migrations created, dependencies installed)
- **Phase 2**: Core Pages (75% - Landing, Canvas Editor, Reveal pages done)
- **Phase 3**: Canvas Editor Tools (90% - Drawing, Text, Background, Stickers complete)

### 🚧 In Progress:
- Image Upload Tool (Phase 3.3)
- Admin Dashboard (Phase 2.3)

### 📝 Next Steps:
- Complete Image Upload Tool
- Implement Phase 4: API Endpoints
- Build Admin Dashboard

---

## Phase 1: Infrastructure Setup (Priority: Critical)

### Task 1.1: Supabase Project Setup
**Subtasks:**
- [x] Create Supabase project
- [x] Copy credentials to `.env.local` from `.env.example`
- [ ] Enable Row Level Security (RLS)
- [ ] Configure CORS settings for your domain

### Task 1.2: Database Schema Creation
**Subtasks:**
- [x] Create `guestbook_tiles` table with enhanced schema (see `migrations/001_create_guestbook_tables.sql`)
- [x] Create `guestbook_drafts` table with auto-expiry
- [x] Create `guestbook_badges` table with categories
- [x] Create `guestbook_config` table for feature flags
- [x] Create `guestbook_analytics` table for tracking
- [x] Create `guestbook_moderation_log` table for audit trail
- [x] Insert default badges data (18 badges across 6 categories)
- [x] Create indexes for performance
- [x] Add helper functions (claim_next_tile, update triggers)
- [ ] Run migration files in Supabase SQL Editor

### Task 1.3: Supabase Storage Setup
**Subtasks:**
- [x] Create storage bucket `guestbook_canvas` (user already created)
- [x] Document folder structure in migration file:
  - `/originals/` - High-res tiles
  - `/thumbnails/` - 300×200px versions
  - `/downloads/` - Watermarked versions
  - `/full-canvas/` - Complete canvas renders
- [x] Create storage policies SQL (see `migrations/003_storage_setup.sql`)
- [ ] Apply storage policies in Supabase Dashboard
- [ ] Create folder structure by uploading placeholder files

### Task 1.4: Install Dependencies
**Subtasks:**
- [x] Install Supabase client: `@supabase/supabase-js` and `@supabase/auth-helpers-nextjs`
- [x] Install canvas libraries: `fabric` (v6.7.1)
- [x] Install image processing: `html2canvas` (v1.4.1)
- [x] Update `.env.example` with storage bucket name
- [x] Update `CLAUDE.md` with guestbook feature documentation

---

## Phase 2: Core Pages & Routes (Priority: High) ✅ 75% Complete

### Task 2.1: Create Guestbook Landing Page ✅
**File:** `/src/app/guestbook/page.tsx`
**Subtasks:**
- [x] Create page structure following design system
- [x] Implement theme-aware hero section (His/Hers themes)
- [x] Add tile counter with live count from database
- [x] Create "Claim Your Tile" CTA button
- [x] Apply glass morphism effects per design system
- [x] Add progress bar visualization
- [x] Ensure responsive design (mobile-first)
- [x] Handle full canvas state
- [x] Guest name/email collection form

### Task 2.2: Create Canvas Editor Page ✅ 
**File:** `/src/app/guestbook/create/page.tsx`
**Subtasks:**
- [x] Set up HTML5 Canvas (300×200px) - Pivoted from Fabric.js
- [x] Create responsive layout with tool panel
- [x] Implement zoom controls (50%-200%)
- [x] Add undo/redo functionality
- [x] Set up auto-save mechanism (30-second intervals)
- [x] Apply theme-aware styling
- [x] Create Supabase client utility (`/src/lib/supabase.ts`)
- [x] Implement full drawing tools
- [x] Add text tool functionality
- [x] Add stickers/emoji panel
- [x] Add background patterns and gradients
- [x] Integrate all tools with tabbed interface
- [ ] Implement image upload (pending Phase 3.3)

### Task 2.3: Create Admin Dashboard 🚧
**File:** `/src/app/admin/guestbook/page.tsx`
**Subtasks:**
- [ ] Implement authentication check
- [ ] Create moderation queue UI
- [ ] Add batch action controls
- [ ] Build statistics dashboard
- [ ] Implement approve/reject/edit request actions
- [ ] Add export functionality

### Task 2.4: Create Canvas Reveal Page ✅
**File:** `/src/app/guestbook/reveal/page.tsx`
**Subtasks:**
- [x] Check reveal flag before displaying
- [x] Create interactive 10×10 grid canvas viewer
- [x] Implement zoom controls (25%-200%)
- [x] Add tile search functionality
- [x] Build filter by badge feature
- [x] Show tile details on click/hover
- [x] Lock screen for pre-reveal state
- [x] Responsive grid display
- [ ] Create timeline scrubber for playback
- [ ] Implement full canvas download

---

## Phase 3: Canvas Editor Tools (Priority: High) ✅ 90% Complete

### Task 3.1: Drawing Tool ✅
**Component:** `/src/components/guestbook/tools/DrawingTool.tsx`
**Subtasks:**
- [x] Implement brush sizes (XS, S, M, L)
- [x] Create color palette with theme colors
- [x] Add opacity slider
- [x] Add eraser mode
- [x] Ensure smooth drawing performance
- [ ] Implement brush styles (solid, soft, calligraphy)

### Task 3.2: Text Tool ✅
**Component:** `/src/components/guestbook/tools/TextTool.tsx`
**Subtasks:**
- [x] Add font selection (serif, sans-serif, cursive, fantasy, monospace, Georgia)
- [x] Implement size control (8px-48px)
- [x] Add color picker
- [x] Create text effects (bold, italic)
- [x] Text alignment (left, center, right)
- [ ] Enable rotation control
- [ ] Allow multiple text boxes

### Task 3.3: Upload Tool 🚧
**Component:** `/src/components/guestbook/tools/UploadTool.tsx`
**Subtasks:**
- [ ] Implement drag & drop
- [ ] Add file validation (type, size)
- [ ] Create crop functionality
- [ ] Add image filters (B&W, sepia, vintage)
- [ ] Implement positioning controls
- [ ] Handle upload to Supabase Storage

### Task 3.4: Background Tool ✅
**Component:** `/src/components/guestbook/tools/BackgroundTool.tsx`
**Subtasks:**
- [x] Add solid color picker
- [x] Create gradient generator
- [x] Implement pattern library (dots, stripes, grid, floral)
- [x] Include theme-specific patterns
- [ ] Add transparency control

### Task 3.5: Sticker Library ✅
**Component:** `/src/components/guestbook/tools/StickerTool.tsx`
**Subtasks:**
- [x] Create categorized sticker sets (wedding, celebration, nature, shapes)
- [x] Implement click-to-add functionality
- [x] Add resize controls via slider
- [x] Add rotation controls (-180° to 180°)
- [x] Include 36+ emoji stickers
- [x] Custom emoji input support

### Task 3.6: Canvas Management ✅
**Component:** `/src/lib/canvas-context.tsx`
**Subtasks:**
- [x] Implement undo/redo (20 actions history)
- [x] Create Canvas Context with state management
- [x] Add clear/reset with confirmation
- [x] Export canvas as PNG
- [x] Auto-save functionality (30-second intervals)
- [ ] Add keyboard shortcuts

---

## Phase 4: API Endpoints (Priority: Critical)

### Task 4.1: Tile Management APIs
**Files in:** `/src/app/api/guestbook/`
**Subtasks:**
- [ ] Create `POST /api/guestbook/claim-tile`
  - Check for existing tile
  - Assign next available position
  - Create draft record
- [ ] Create `POST /api/guestbook/save-draft`
  - Auto-save every 30 seconds
  - Update draft in Supabase
- [ ] Create `POST /api/guestbook/submit-tile`
  - Validate complete tile
  - Upload to storage
  - Generate thumbnail
  - Notify admin
- [ ] Create `GET /api/guestbook/download-tile`
  - Validate ownership
  - Apply watermark
  - Return image

### Task 4.2: Admin APIs
**Files in:** `/src/app/api/admin/guestbook/`
**Subtasks:**
- [ ] Create `GET /api/admin/guestbook/pending`
- [ ] Create `POST /api/admin/guestbook/moderate`
- [ ] Create `GET /api/admin/guestbook/stats`
- [ ] Create `POST /api/admin/guestbook/export`

### Task 4.3: Public APIs
**Subtasks:**
- [ ] Create `GET /api/guestbook/reveal-status`
- [ ] Create `GET /api/guestbook/canvas/full`
- [ ] Create `GET /api/guestbook/tile-count`

---

## Phase 5: UI Components (Priority: High)

### Task 5.1: Create Shared Components
**Subtasks:**
- [ ] `TilePreview.tsx` - Display individual tiles
- [ ] `BadgeSelector.tsx` - Multi-select badge UI
- [ ] `CanvasGrid.tsx` - Display full 10×10 grid
- [ ] `TileCounter.tsx` - "X of 100 tiles" display
- [ ] `LoadingCanvas.tsx` - Skeleton loader
- [ ] `ShareButtons.tsx` - Social media sharing

### Task 5.2: Ensure Design System Compliance
**Subtasks:**
- [ ] Apply dual-theme support throughout
- [ ] Use correct color tokens from design system
- [ ] Implement proper spacing (gap-2, gap-4, gap-8)
- [ ] Apply glass morphism where specified
- [ ] Use correct animation durations (0.4s, 0.6s, 0.8s)
- [ ] Ensure responsive breakpoints (md:, lg:)

---

## Phase 6: Features & Polish (Priority: Medium)

### Task 6.1: Auto-save Implementation
**Subtasks:**
- [ ] Set up 30-second interval saves
- [ ] Add visual save indicator
- [ ] Implement recovery mechanism
- [ ] Handle connection errors gracefully

### Task 6.2: Social Sharing
**Subtasks:**
- [ ] Generate share images with watermark
- [ ] Create pre-filled social media captions
- [ ] Add copy-to-clipboard for links
- [ ] Track sharing analytics

### Task 6.3: Email Notifications
**Subtasks:**
- [ ] Set up email templates
- [ ] Implement approval notifications
- [ ] Create edit request emails
- [ ] Add reminder system

### Task 6.4: Performance Optimization
**Subtasks:**
- [ ] Implement image lazy loading
- [ ] Add canvas render caching
- [ ] Optimize thumbnail generation
- [ ] Set up CDN for static assets

---

## Phase 7: Testing & QA (Priority: Critical)

### Task 7.1: Functional Testing
**Subtasks:**
- [ ] Test all drawing tools
- [ ] Verify save/load functionality
- [ ] Test moderation workflow
- [ ] Validate reveal mechanism
- [ ] Check tile assignment logic

### Task 7.2: Cross-browser Testing
**Subtasks:**
- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Verify mobile browsers (iOS Safari, Chrome)
- [ ] Check tablet responsiveness
- [ ] Test with different screen sizes

### Task 7.3: Theme Testing
**Subtasks:**
- [ ] Verify His theme consistency
- [ ] Verify Hers theme consistency
- [ ] Test theme switching
- [ ] Check color contrast (WCAG AA)

### Task 7.4: Performance Testing
**Subtasks:**
- [ ] Load test with 100 tiles
- [ ] Measure canvas render times
- [ ] Check API response times
- [ ] Verify image optimization

---

## Phase 8: Launch Preparation (Priority: High)

### Task 8.1: Documentation
**Subtasks:**
- [ ] Create user guide
- [ ] Write admin documentation
- [ ] Document troubleshooting steps
- [ ] Create FAQ section

### Task 8.2: Monitoring Setup
**Subtasks:**
- [ ] Configure error tracking
- [ ] Set up performance monitoring
- [ ] Create admin alerts
- [ ] Implement analytics tracking

### Task 8.3: Backup & Recovery
**Subtasks:**
- [ ] Set up automated backups
- [ ] Test restore procedures
- [ ] Create data export scripts
- [ ] Document recovery process

### Task 8.4: Pre-launch Checklist
**Subtasks:**
- [ ] Review all error messages
- [ ] Test with sample guests
- [ ] Verify email deliverability
- [ ] Check mobile experience
- [ ] Validate accessibility
- [ ] Test social sharing
- [ ] Confirm reveal date logic

---

## Implementation Order

1. **Week 1**: Infrastructure (Phase 1)
2. **Week 2**: Core Pages & Routes (Phase 2)
3. **Week 3-4**: Canvas Editor Tools (Phase 3)
4. **Week 5**: API Endpoints (Phase 4)
5. **Week 6**: UI Components (Phase 5)
6. **Week 7**: Features & Polish (Phase 6)
7. **Week 8**: Testing & QA (Phase 7)
8. **Week 9**: Launch Preparation (Phase 8)
9. **Week 10**: Soft launch with family/friends
10. **Week 11**: Full launch to all guests

---

## Critical Success Factors

1. **Maintain Design System Consistency**
   - Always reference `design_system.md`
   - Use existing color tokens
   - Follow animation patterns
   - Apply theme-aware styling

2. **Preserve Existing Functionality**
   - Don't modify existing RSVP flow
   - Keep current theme system intact
   - Maintain current routing structure
   - Preserve all existing components

3. **Privacy & Security**
   - Implement proper authentication
   - Enforce one tile per guest
   - Hide canvas until reveal date
   - Secure admin functions

4. **Performance**
   - Optimize for mobile devices
   - Minimize bundle size
   - Cache where possible
   - Use lazy loading

5. **User Experience**
   - Clear instructions
   - Intuitive tools
   - Fast save times
   - Graceful error handling

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Canvas performance on mobile | Limit tool complexity, optimize rendering |
| Storage limits | Compress images, use efficient formats |
| Low participation | Email reminders, social proof, urgency messaging |
| Inappropriate content | Moderation queue, content filters |
| Data loss | Auto-save, draft recovery, backups |

---

## Notes

- All components should follow the established design system
- Maintain backward compatibility with existing features
- Test thoroughly on mobile devices (primary use case)
- Consider implementing Progressive Web App features
- Keep accessibility in mind (WCAG AA compliance)

## Technical Implementation Notes

### Canvas Implementation (Phase 3)
- **Technology Choice**: Switched from Fabric.js to HTML5 Canvas API for better compatibility
- **Canvas Size**: 300×200px (3cm×2cm at 100dpi)
- **State Management**: Created custom Canvas Context using React Context API
- **Tools Implemented**:
  - Drawing Tool: 4 brush sizes, theme-aware colors, eraser mode, opacity control
  - Text Tool: 6 fonts, size range 8-48px, bold/italic, alignment options
  - Background Tool: Solid colors, gradients, 4 pattern types
  - Sticker Tool: 4 categories, 36+ emojis, rotation/size controls
- **Features**:
  - Undo/Redo with 20-state history
  - Auto-save every 30 seconds
  - Zoom controls (50%-200%)
  - PNG export functionality
  - Theme-aware color suggestions

### UI Components Added:
- `/src/components/ui/slider.tsx` - For size/rotation controls
- `/src/components/ui/tabs.tsx` - For tool switching interface

### Dependencies Added:
- `@radix-ui/react-slider` - Slider component
- `@radix-ui/react-tabs` - Tabs component
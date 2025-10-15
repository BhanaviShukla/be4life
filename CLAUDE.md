# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Development**
- `npm run dev` - Start development server with Turbopack on http://localhost:3000
- `npm run build` - Build production bundle
- `npm start` - Run production server
- `npm run lint` - Run Next.js linter

## Architecture

This is a Next.js 15 wedding website using App Router with a sophisticated dual-theme system. The architecture centers around theme-aware components that switch between "His" (dark sophisticated) and "Hers" (light cottagecore) themes.

### Theme System
The dual-theme architecture is implemented through:
- HTML `data-theme` attribute ("his" or "hers") controlling CSS variables
- Theme provider wrapping the app for runtime switching
- CSS custom properties defined in `globals.css` that change based on `[data-theme]` selectors
- Components use Tailwind's arbitrary value syntax with HSL color tokens: `bg-[hsl(var(--bg))]`
- Each theme has distinct visual identity: His uses deep teal/gold/burgundy with horizontal texture, Hers uses ivory/burgundy/sage with organic textures

### Component Architecture
- **UI Components** (`src/components/ui/`): shadcn/ui primitives built on Radix UI, styled with Tailwind tokens
- **Feature Components** (`src/components/`): Wedding-specific components like `hero-names.tsx`, `animated-date.tsx` that compose UI primitives
- **Pages** (`src/app/`): Route components using file-based routing (page.tsx files)
- **Styling**: All styling through Tailwind CSS v4 with `@theme` tokens - no separate CSS files
- **Class Merging**: Use `cn()` utility from `lib/utils.ts` for conditional classes

### Key Implementation Patterns
- All components are client-side ("use client") for interactivity
- Framer Motion for animations with theme-aware timing
- WhatsApp integration for RSVP form submission
- Background textures change per theme using CSS selectors
- Names order in hero switches based on active theme
- Form validation with required fields before WhatsApp message generation

### Development Standards
- TypeScript with explicit types for all values
- Functional components with props interfaces
- Event handlers prefixed with `handle`
- Keep functions under 20 instructions
- Use `map`, `filter`, `reduce` over loops
- Test in both themes before changes
- Responsive breakpoints: mobile-first, then `md:` and `lg:`
- WCAG AA accessibility standards

## Features in Development

### Digital Guestbook Canvas
A 10×10 grid canvas where wedding guests create personalized tiles. Implementation details:
- **Database**: PostgreSQL via Supabase (tables: guestbook_tiles, guestbook_drafts, guestbook_badges)
- **Storage**: Supabase Storage bucket "guestbook_canvas" for images
- **Canvas**: Fabric.js for drawing tools, html2canvas for exports
- **Implementation Plan**: See `guestbook_implementation_plan.md` for detailed tasks
- **Migrations**: SQL files in `/migrations/` folder
- **Key Routes**: 
  - `/guestbook` - Landing page
  - `/guestbook/create` - Canvas editor
  - `/guestbook/reveal` - Full canvas display (post-wedding)
  - `/admin/guestbook` - Moderation dashboard
- **Design**: Maintains dual-theme system with theme-aware tools and UI
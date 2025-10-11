# Project Context v1.0 - Bhanvi & Eshlok Wedding Website

## Executive Summary

**What it is:** A sophisticated, dual-theme wedding website for Bhanvi and Eshlok's multi-city Indian wedding celebration in November 2025. The site serves as the primary digital touchpoint for guest communication, RSVP collection, and travel coordination.

**Live URL:** https://be4.life

**Repository:** https://github.com/BhanaviShukla/be4life

**Current Status:** MVP launched with core features operational. Approximately 30% complete toward full vision.

## Project Vision & Purpose

### Core Mission
Create an elegant, personalized digital experience that:
1. Reflects both partners' personalities through distinct visual themes
2. Streamlines guest communication and RSVP management
3. Provides comprehensive travel and event information
4. Reduces coordination overhead for wedding planners
5. Serves as a keepsake of the celebration

### Target Audience
- **Primary:** Wedding guests (100-300 people)
- **Secondary:** Wedding planning team
- **Tertiary:** Vendors and service providers

### Key Events
- **Bhopal Ceremonies:** November 21-22, 2025
- **Ayodhya Ceremonies:** November 24-26, 2025
- **Main Wedding Date:** November 25, 2025

## Current Implementation Status

### ✅ Completed Features (30%)

#### 1. **Dual Theme System**
- **His Theme:** "English Gentleman / Peaky Sophistication"
  - Deep teal (#0D1418) background with warm gold (#D4AF6A) accents
  - Horizontal linen texture overlay
  - Dark, club-like refinement aesthetic
- **Hers Theme:** "Cottagecore Village Chic"  
  - Ivory (#F8F4E3) background with dusty rose (#B77C87) accents
  - Organic paper texture with flowing waves
  - Light, romantic countryside aesthetic
- Runtime theme switching with smooth transitions
- Theme-aware component ordering (names swap based on theme)

#### 2. **Hero Landing Page**
- Animated couple names with theme-based ordering
- Typewriter effect for wedding date (25·11·25)
- Watercolor silhouettes (positioned bottom corners)
- Scroll indicator with infinite pulse animation
- Responsive scaling across devices

#### 3. **RSVP System (Client-Side Only)**
- Multi-step form with validation
- Dynamic guest/children count management
- Multi-event selection (Bhopal & Ayodhya)
- Relationship categorization
- WhatsApp integration for submission
  - Pre-formatted message generation
  - Direct link to +919711545145
  - Fallback phone number display
- No backend storage yet (WhatsApp-only submission)

#### 4. **Component Library**
- shadcn/ui components (Button, Input, Select, Checkbox, Label)
- Custom wedding components (HeroNames, AnimatedDate, ScrollCue, ThemeToggle)
- Glass morphism effects on forms
- Consistent design tokens via CSS variables

#### 5. **Technical Foundation**
- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS v4 with @theme tokens
- Framer Motion animations
- Responsive design (mobile-first)
- WCAG AA accessibility compliance
- PWA-ready with manifest
- SEO optimized with complete metadata

### 🚧 In Progress Features (0%)

#### Travel Section
- Placeholder markdown files exist but no implementation
- Planned features documented in `/src/app/travel/feature.md`
- Will include city guides, flight booking, packing lists

### 📋 Planned Features (70%)

#### Phase 1: Backend Infrastructure
1. **Google Sheets Integration**
   - RSVP data storage
   - Guest list management
   - Real-time sync
   - Admin dashboard

2. **Session Management**
   - Guest authentication via phone/email
   - Personalized content based on invite scope
   - Secure httpOnly cookies

3. **API Layer**
   - `/api/rsvp/submit` - Process and store RSVPs
   - `/api/travel/guest` - Fetch personalized travel info
   - `/api/travel/config` - Dynamic content management

#### Phase 2: Travel Features
1. **Travel Hub** (`/travel`)
   - Overview with timeline
   - City-specific guides
   - Weather widgets
   - Emergency contacts

2. **City Pages** (`/travel/bhopal`, `/travel/ayodhya`)
   - How to reach guides
   - Accommodation options
   - Local highlights
   - Cultural notes
   - Maps and directions

3. **Flight Booking Assistant** (`/travel/flights`)
   - Origin city input with autocomplete
   - Dynamic itinerary generation
   - Deeplinks to Google Flights/Skyscanner
   - Recommended arrival/departure windows

4. **Packing Checklist** (`/travel/checklist`)
   - Interactive checkbox list
   - Category-based organization
   - Print/PDF export
   - Personalized based on events attending

#### Phase 3: Enhanced Features
1. **Photo Gallery**
   - Pre-wedding photoshoot display
   - Guest photo uploads
   - Social sharing

2. **Event Schedule**
   - Detailed timeline
   - Venue information
   - Dress codes
   - Transportation details

3. **Guest Communication**
   - Announcements system
   - FAQ section
   - Contact forms
   - Emergency notifications

4. **Admin Dashboard**
   - RSVP management
   - Guest list views
   - Analytics
   - Content editing

#### Phase 4: Post-Wedding
1. **Thank You Page**
   - Personalized messages
   - Photo highlights
   - Video messages

2. **Digital Album**
   - Professional photos
   - Guest submissions
   - Download options

## Technical Architecture

### Frontend Stack
```
- Framework: Next.js 15.4.6 (App Router)
- Language: TypeScript 5.x
- Styling: Tailwind CSS 4.1.12
- UI Library: shadcn/ui with Radix UI primitives
- Animations: Framer Motion 12.23.22
- Themes: next-themes 0.4.6
- Icons: Lucide React
```

### Dependencies
```json
{
  "Core": ["next", "react@19.1.0", "react-dom@19.1.0"],
  "UI": ["@radix-ui/react-*", "class-variance-authority", "clsx", "tailwind-merge"],
  "Styling": ["tailwindcss@4.1.12", "@tailwindcss/postcss"],
  "Animation": ["framer-motion"],
  "Utilities": ["lucide-react", "next-themes"]
}
```

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Landing page
│   ├── globals.css        # Theme tokens & global styles
│   ├── rsvp/
│   │   └── page.tsx       # RSVP form page
│   └── travel/            # Travel section (placeholder)
│       ├── feature.md     # Implementation plan
│       └── flights/
│           └── feature.md # Flights feature spec
├── components/
│   ├── ui/                # shadcn/ui components
│   └── *.tsx              # Custom components
└── lib/
    └── utils.ts           # Utility functions
```

### Build & Development
```bash
npm run dev    # Development with Turbopack
npm run build  # Production build
npm start      # Production server
npm run lint   # ESLint
```

### Deployment
- **Platform:** Vercel (assumed based on Next.js)
- **Domain:** be4.life (custom domain)
- **SSL:** Automatic via Vercel
- **CDN:** Vercel Edge Network

## Design System Highlights

### Color Psychology
- **His Theme:** Authority, sophistication, timelessness
- **Hers Theme:** Warmth, romance, natural beauty

### Typography Strategy
- Currently using system fonts (Geist Sans/Mono)
- Planned custom fonts:
  - His: Cormorant Garamond (display)
  - Hers: Great Vibes (script), Libre Baskerville (serif)

### Animation Philosophy
- Subtle, elegant movements
- Respects prefers-reduced-motion
- Staggered reveals for visual hierarchy
- No jarring transitions

### Responsive Strategy
- Mobile-first development
- Breakpoints: md (768px), lg (1024px), xl (1280px)
- Touch-friendly tap targets
- Optimized for phone-based RSVPs

## Current Limitations & Gaps

### Technical Debt
1. No backend/database (WhatsApp-only RSVP)
2. No data persistence
3. No admin interface
4. No analytics tracking
5. Manual content updates only

### Missing Core Features
1. Guest authentication/sessions
2. Personalized content delivery
3. Travel planning tools
4. Photo galleries
5. Event schedule details

### Performance Opportunities
1. Image optimization needed
2. Font loading strategies pending
3. Code splitting for travel section
4. Caching strategies not implemented

## Immediate Priorities

### Must-Have for Launch
1. **Backend Integration** - Google Sheets for RSVP storage
2. **Session Management** - Guest identification system
3. **Travel Hub** - Basic city guides and logistics
4. **Event Schedule** - Detailed timeline and venues

### Nice-to-Have
1. Weather widgets
2. PDF exports
3. Flight booking assistant
4. Interactive packing lists

## Success Metrics

### User Engagement
- RSVP completion rate
- Average session duration
- Theme toggle usage
- Travel page views

### Technical Performance
- Lighthouse score > 90
- First Contentful Paint < 1.5s
- Time to Interactive < 3.5s
- Zero accessibility violations

### Business Goals
- 100% guest RSVP collection
- Reduced planner coordination calls
- Positive guest feedback
- Smooth event coordination

## Development Philosophy

### Code Standards
- TypeScript for everything
- Functional components only
- Composition over inheritance
- Early returns, pure functions
- Comprehensive error handling

### Design Principles
- Both themes equally polished
- Accessibility never compromised
- Mobile experience prioritized
- Performance over fancy effects
- Cultural sensitivity maintained

### Collaboration Approach
- Atomic commits with conventional format
- Feature branches for development
- Thorough testing before merge
- Documentation for complex logic

## Risk Factors

### Technical Risks
- WhatsApp API limitations
- Google Sheets scalability
- Theme switching performance
- Mobile browser compatibility

### User Experience Risks
- Complex RSVP flow
- International guest accessibility
- Language barriers
- Technical literacy variance

### Timeline Risks
- 11 months to wedding
- Travel section complexity
- Third-party integrations
- Content creation time

## Future Vision

### During Wedding
- Live updates and announcements
- Real-time schedule changes
- Photo sharing stream
- Guest check-in system

### Post-Wedding
- Thank you message system
- Photo/video galleries
- Guest book entries
- Anniversary revisits

### Long-term Potential
- Template for other weddings
- Open-source wedding platform
- SaaS wedding website builder
- Event planning toolkit

## Summary

The be4life wedding website is an ambitious project that balances aesthetic elegance with functional utility. Currently at 30% completion, it has successfully established the visual foundation and core RSVP functionality. The dual-theme system is a unique differentiator that personalizes the experience for both partners.

The immediate focus should be on backend integration to capture RSVP data and building out the travel section to assist guests with logistics. With 11 months until the wedding, there's adequate time to implement the planned features while maintaining quality.

The project demonstrates strong technical foundations with modern tooling and thoughtful architecture. The biggest opportunity lies in transforming it from a beautiful static site into a dynamic, personalized guest experience platform that truly streamlines the wedding planning and attendance process.
# Wedding Website Design System

## Table of Contents
1. [Design Philosophy](#design-philosophy)
2. [Theme System](#theme-system)
3. [Color System](#color-system)
4. [Typography](#typography)
5. [Spacing & Layout](#spacing--layout)
6. [Animation System](#animation-system)
7. [Component Patterns](#component-patterns)
8. [Interaction States](#interaction-states)
9. [Responsive Design](#responsive-design)
10. [Accessibility](#accessibility)
11. [Visual Effects & Textures](#visual-effects--textures)

---

## Design Philosophy

### Core Principles
- **Duality**: Two distinct themes representing both partners' personalities
- **Elegance**: Sophisticated, refined aesthetic appropriate for a wedding
- **Performance**: Smooth animations with reduced motion support
- **Accessibility**: WCAG AA compliant with semantic HTML

### Theme Personalities

#### His Theme - "English Gentleman / Peaky Sophistication"
- **Character**: Dark, sophisticated, club-like refinement
- **Mood**: Grounded, structured, vintage elegance
- **Visual Language**: Deep colors, horizontal textures, strong contrasts

#### Hers Theme - "Cottagecore Village Chic"
- **Character**: Light, airy, romantic countryside aesthetic
- **Mood**: Soft, flowing, watercolor-like delicacy
- **Visual Language**: Pastel tones, organic textures, gentle gradients

---

## Theme System

### Implementation
- Themes controlled via `data-theme` attribute on HTML element
- Values: `"his"` (default) or `"hers"`
- CSS custom properties update based on `[data-theme]` selectors
- Runtime switching via `next-themes` with `useTheme()` hook

### Theme Provider Setup
```typescript
// Wraps entire app in src/app/layout.tsx
<ThemeProvider>{children}</ThemeProvider>
```

---

## Color System

### Color Token Structure
All colors use HSL format with separate values for flexibility:
- Format: `--token-name: H S% L%`
- Usage: `hsl(var(--token) / <alpha>)` for alpha support
- Tailwind: `bg-[hsl(var(--bg))]` or semantic classes like `bg-background`

### His Theme Palette

| Token | HSL Value | Hex Equivalent | Usage |
|-------|-----------|----------------|--------|
| `--bg` | 195 35% 8% | #0D1418 | Deep teal background |
| `--fg` | 43 58% 72% | #D4AF6A | Warm gold text |
| `--muted` | 195 20% 12% | ~#182428 | Subtle panels |
| `--border` | 43 32% 50% | ~#A68B5C | Muted gold borders |
| `--brand-1` | 12 44% 26% | #5F2A2C | Burgundy (primary brand) |
| `--brand-2` | 150 25% 22% | #2A3D33 | Emerald (secondary brand) |
| `--brand-3` | 43 58% 60% | #C4A55A | Gold (tertiary/hover) |
| `--accent-1` | 43 58% 72% | #D4AF6A | Primary gold accent |
| `--accent-2` | 28 55% 55% | #C28844 | Warm amber secondary |

### Hers Theme Palette

| Token | HSL Value | Hex Equivalent | Usage |
|-------|-----------|----------------|--------|
| `--bg` | 48 61% 93% | #F8F4E3 | Ivory background |
| `--fg` | 0 0% 24% | #3D3D3D | Charcoal text |
| `--muted` | 94 19% 61% | #98AE87 | Sage for subtle elements |
| `--border` | 45 47% 56% | #C4A95B | Antique gold borders |
| `--brand-1` | 353 61% 30% | #7B1E28 | Burgundy (primary brand) |
| `--brand-2` | 146 66% 26% | #166D3B | Emerald (secondary brand) |
| `--brand-3` | 45 47% 56% | #C4A95B | Antique gold (tertiary) |
| `--accent-1` | 349 29% 60% | #B77C87 | Dusty rose accent |
| `--accent-2` | 94 19% 61% | #98AE87 | Sage accent |

### Semantic Color Mappings

| Semantic Token | Maps To | Purpose |
|----------------|---------|---------|
| `--color-background` | `hsl(var(--bg))` | Page backgrounds |
| `--color-foreground` | `hsl(var(--fg))` | Primary text |
| `--color-primary` | `hsl(var(--brand-1))` | Primary actions, buttons |
| `--color-secondary` | `hsl(var(--brand-2))` | Secondary actions |
| `--color-accent` | `hsl(var(--accent-1))` | Highlights, emphasis |
| `--color-muted` | `hsl(var(--muted))` | Subdued elements |
| `--color-border` | `hsl(var(--border))` | Borders, dividers |
| `--color-destructive` | `#dc2626` | Errors, warnings |

### Special Colors
- **Theme Color (Meta)**: `#C76E47` (Terracotta) - Used for browser theme
- **Shadow Neon**: Dynamic based on theme for glow effects

---

## Typography

### Font Stack

#### Primary Fonts
- **Geist Sans** (`--font-geist-sans`): Body text, UI elements
- **Geist Mono** (`--font-geist-mono`): Code, technical text
- **System Serif** (`font-serif`): Headings, display text

Note: The README mentions Great Vibes (script) and Libre Baskerville for Hers theme, and Cormorant Garamond for His theme, but these are not yet implemented in code.

### Type Scale

| Element | Mobile | Tablet (md:) | Desktop (lg:/xl:) | Usage |
|---------|--------|--------------|-------------------|--------|
| Hero Names | text-6xl | text-7xl | text-8xl | Main couple names |
| Hero Date | text-3xl | text-5xl | - | Wedding date |
| Section Heading | text-4xl | text-6xl | - | Major sections |
| Form Heading | text-4xl | text-5xl | - | RSVP form title |
| Body Text | text-base | text-sm | - | General content |
| Small Text | text-sm | - | - | Labels, hints |
| Button Text | text-sm | - | text-xl (for lg size) | Interactive elements |

### Typography Properties

#### Letter Spacing
- **Date Display**: `tracking-[0.3em]` - Wide tracking for elegance
- **Uppercase Labels**: `tracking-wider` - Subtle expansion
- **Default**: Normal tracking for readability

#### Line Height
- **Hero Names**: `leading-tight` - Compact for impact
- **Body**: Default leading for readability

#### Text Alignment
- **Hero Content**: `text-center` - Centered for formality
- **Form Content**: Left-aligned for usability

---

## Spacing & Layout

### Spacing Scale
Based on Tailwind's default spacing system with rem units:
- `gap-2`: 0.5rem (8px)
- `gap-4`: 1rem (16px)  
- `gap-8`: 2rem (32px)
- `p-6`: 1.5rem (24px)
- `p-10`: 2.5rem (40px) - md: breakpoint
- `p-12`: 3rem (48px) - lg: breakpoint

### Container Widths
- **Form Container**: `max-w-md` (28rem) base, `lg:max-w-2xl` (42rem) large screens
- **Hero Content**: `max-w-2xl` (42rem) centered
- **Full Width Sections**: `min-h-screen` for viewport-height sections

### Border Radius
```css
--radius-xl2: 1.25rem;
--radius-lg: var(--radius-xl2);
--radius-md: calc(var(--radius-xl2) - 4px);
--radius-sm: calc(var(--radius-xl2) - 8px);
```

Applied via Tailwind classes:
- `rounded-full`: Pills, theme toggle
- `rounded-2xl`: Cards, forms
- `rounded-lg`: Buttons (via component)
- `rounded-md`: Inputs

---

## Animation System

### Core Animation Principles
- **Easing**: Custom bezier `[0.43, 0.13, 0.23, 0.96]` for natural motion
- **Reduced Motion**: Full support via `useReducedMotion()` hook
- **Duration Standards**:
  - Instant: 0.01s (reduced motion)
  - Fast: 0.4s
  - Medium: 0.5-0.6s
  - Slow: 0.8s
  - Very Slow: 1.5s (loops)

### Animation Patterns

#### Fade In with Y Translation
```typescript
fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}
// Duration: 0.8s, Delay: 0.5s
```

#### Typewriter Effect (Date)
```typescript
dateSegmentVariants = {
  hidden: { opacity: 0 },
  visible: (i) => ({
    opacity: 1,
    transition: {
      delay: 0.8 + i * 0.2,  // Staggered
      duration: 0.4
    }
  })
}
```

#### Infinite Pulse (Scroll Cue)
```typescript
pulse: {
  y: [0, 8, 0],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    repeatType: "loop",
    ease: "easeInOut"
  }
}
```

#### Silhouette Animations
- **Left Silhouette**: Slides in from left (-30 to 0), rotates (-2deg to 0)
- **Right Silhouette**: Slides in from right (30 to 0), rotates (2deg to 0)
- **Duration**: 1s with 0.3s delay

### Transition Utilities
- **Button Hover**: `transition-colors` - Color transitions only
- **Form Elements**: `transition-[color,box-shadow]` - Multiple properties
- **Theme Toggle**: Smooth background color changes

---

## Component Patterns

### Button Component

#### Variants
| Variant | Styles | Use Case |
|---------|--------|----------|
| `default` | Primary colors, shadow | Primary CTAs |
| `secondary` | Secondary colors, shadow | Alternative actions |
| `outline` | Border only, transparent bg | Tertiary actions |
| `ghost` | No border, hover bg only | Minimal actions |
| `link` | Underline on hover | Inline text links |
| `destructive` | Red/warning colors | Dangerous actions |

#### Sizes
- `sm`: h-8 px-3 (32px height)
- `default`: h-9 px-4 (36px height)
- `lg`: h-10 px-6 (40px height)
- `icon`: size-9 (36x36px square)

#### Special Button Patterns
- **Large RSVP Button**: `text-xl px-12 py-6 h-auto` with border
- **Theme Toggle**: `min-w-20 rounded-full` for pill shape

### Input Component
- Base: `h-9 px-3 py-1 rounded-md border`
- Responsive: `text-base md:text-sm`
- States: Focus ring, disabled opacity
- Background: `bg-transparent dark:bg-input/30`

### Form Layout
- Container: Glass morphism effect with `bg-background/95 backdrop-blur-sm`
- Border: `border-border/50` for subtle definition
- Shadow: `shadow-card` for depth
- Padding: Responsive `p-6 md:p-10 lg:p-12`

### Card Pattern
```css
.card {
  background: bg-background/95;
  backdrop-filter: blur-sm;
  border: 1px solid border/50;
  border-radius: rounded-2xl;
  box-shadow: shadow-card;
}
```

---

## Interaction States

### Hover States
- **Buttons**: 90% opacity on brand colors (`hover:bg-primary/90`)
- **Ghost Elements**: 40% muted background (`hover:bg-muted/40`)
- **Links**: Underline appearance
- **Borders**: Increased opacity (`hover:border-accent/60`)

### Focus States
- Ring color matches primary brand
- Visible focus indicators for accessibility
- `focus-visible` for keyboard navigation only

### Active States
- Slight scale reduction (not currently implemented)
- Color intensity increase

### Disabled States
- `opacity-50` for all disabled elements
- `pointer-events-none` to prevent interaction
- `cursor-not-allowed` for visual feedback

---

## Responsive Design

### Breakpoint System
Based on Tailwind defaults:
- **Mobile First**: Base styles for mobile
- **sm**: 640px (rarely used)
- **md**: 768px (tablet)
- **lg**: 1024px (desktop)
- **xl**: 1280px (large desktop)
- **2xl**: 1536px (not used)

### Responsive Patterns

#### Typography Scaling
```css
/* Mobile → Tablet → Desktop */
text-6xl md:text-7xl xl:text-8xl  /* Hero names */
text-3xl md:text-5xl               /* Dates */
text-4xl md:text-6xl               /* Section headings */
```

#### Container Widths
```css
max-w-md lg:max-w-2xl              /* Forms */
w-full max-w-2xl mx-auto           /* Content containers */
```

#### Silhouette Sizing
- **Left**: `w-[57vw] h-[73vh]` → `md:w-[52vw] md:h-[83vh]` → `lg:w-[55vw] lg:h-[86vh]`
- **Right**: `w-[50vw] h-[70vh]` → `md:w-[45vw] md:h-[80vh]`

#### Spacing Adjustments
```css
p-6 md:p-10 lg:p-12                /* Form padding */
px-8                                /* Horizontal padding mobile */
```

---

## Accessibility

### WCAG AA Compliance
- **Color Contrast**: All text meets minimum 4.5:1 ratio
- **Focus Indicators**: Visible focus rings on interactive elements
- **Semantic HTML**: Proper heading hierarchy, ARIA labels
- **Keyboard Navigation**: Full keyboard support, tab order

### Motion Accessibility
- **Reduced Motion**: Detected via `prefers-reduced-motion`
- **Implementation**: `useReducedMotion()` hook from Framer Motion
- **Behavior**: Instant transitions (0.01s) when preferred

### Form Accessibility
- **Labels**: Associated with inputs via `htmlFor`
- **Validation**: Clear error messages
- **Required Fields**: Marked appropriately
- **Focus Management**: Logical tab order

---

## Visual Effects & Textures

### His Theme Texture
**Horizontal Linen Pattern**
```css
/* Fine horizontal weave */
repeating-linear-gradient(
  0deg,
  transparent,
  transparent 2px,
  rgba(255, 255, 255, 0.08) 2px,
  rgba(255, 255, 255, 0.08) 3px
)
/* Plus noise overlay for depth */
```
- **Character**: Structured, refined, fabric-like
- **Opacity**: Very subtle (8% white lines)
- **Blend Mode**: `overlay` for integration

### Hers Theme Texture
**Organic Paper Pattern**
```css
/* Soft diagonal waves */
repeating-linear-gradient(-45deg, ...)
repeating-linear-gradient(45deg, ...)
/* Curved wave radial gradients */
radial-gradient(ellipse 800px 600px at corners)
/* Fine grain noise */
```
- **Character**: Flowing, organic, watercolor paper
- **Opacity**: Extremely subtle (1.5-3% opacity)
- **Blend Mode**: `overlay` for softness

### Glass Morphism
```css
.glass {
  background: bg-background/95;
  backdrop-filter: blur-sm;
  border: 1px solid border/50;
}
```
Used on:
- RSVP form container
- Scroll cue button
- Overlays on patterned backgrounds

### Shadows

#### Shadow Types
- **Card Shadow**: `0 10px 30px rgba(0, 0, 0, 0.12)`
- **Input Shadow**: `shadow-xs` (minimal)
- **Neon Glow**: Uses `--shadow-neon` color (theme-aware)

### Background Patterns
- **Sand Dunes**: Full-page background image for RSVP section
- **Motif Overlays**: 60% background opacity for readability
- **Hero Silhouettes**: Watercolor-style PNG images, absolutely positioned

---

## Implementation Guidelines

### CSS Variable Usage
1. Always use HSL format with var() for theme flexibility
2. Include `/` for alpha channel support
3. Use semantic token names in components

### Component Development
1. Client components for interactivity (`"use client"`)
2. Compose with shadcn/ui primitives
3. Use `cn()` utility for conditional classes
4. Support theme switching via CSS variables

### Performance Considerations
1. Reduced motion support mandatory
2. Lazy load heavy images
3. Optimize animation keyframes
4. Use CSS transforms over position changes

### Testing Requirements
1. Test both themes thoroughly
2. Check all responsive breakpoints
3. Verify keyboard navigation
4. Validate color contrast ratios
5. Test with screen readers

---

## Future Enhancements

### Typography
- Implement custom fonts (Great Vibes, Cormorant Garamond, Libre Baskerville)
- Add font loading optimization
- Create modular type scale system

### Animations
- Page transitions between routes
- Micro-interactions on form elements
- Parallax scrolling effects
- Loading states and skeletons

### Components
- Toast notifications
- Modal dialogs
- Image galleries
- Timeline component
- Map integration

### Themes
- Theme-specific fonts
- Seasonal variations
- Print stylesheet
- Dark mode variants within themes
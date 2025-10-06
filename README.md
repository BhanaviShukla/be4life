# Bhanvi & Eshlok Wedding Website

Live at: **[be4.life](https://be4.life)**

A Next.js wedding website with dual theme support (His & Hers), RSVP functionality, and elegant animations.

---

## 🎨 Design System

### Dual Themes

**♟ His Theme** — English Gentleman / Peaky Sophistication (DEFAULT)
- **Palette**: Deep teal (`#0D1418`), Warm gold (`#D4AF6A`), Burgundy, Charcoal
- **Fonts**: Cormorant Garamond (display serif), Geist Sans (body), Geist Mono (code)
- **Style**: Dark, sophisticated, club-like refinement with vintage elegance
- **Texture**: Horizontal linen-like weave with fine noise

**🌸 Hers Theme** — Cottagecore Village Chic
- **Palette**: Ivory (`#F8F4E3`), Burgundy, Antique Gold, Sage Green, Dusky Rose
- **Fonts**: Great Vibes (script), Libre Baskerville (serif), Geist Sans (body)
- **Style**: Light, airy, watercolor textures, soft gradients, romantic
- **Texture**: Organic paper with flowing fabric-like waves

Themes switch via `data-theme="his"` or `data-theme="hers"` on the `<html>` element.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui (Radix UI primitives)
- **Animations**: Framer Motion
- **Theming**: next-themes
- **Language**: TypeScript
- **Deployment**: Vercel

---

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📂 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata & theme provider
│   ├── page.tsx            # Landing page (hero, names, date, scroll cue)
│   ├── rsvp/
│   │   └── page.tsx        # RSVP form with WhatsApp integration
│   └── globals.css         # Tailwind v4 @theme tokens + theme-aware textures
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── theme-toggle.tsx    # Theme switcher (His ↔ Hers)
│   ├── hero-names.tsx      # Animated names with theme-aware ordering
│   ├── animated-date.tsx   # Typewriter date animation
│   ├── hero-silhouettes.tsx # Watercolor silhouettes
│   └── scroll-cue.tsx      # Animated scroll indicator
└── lib/
    └── utils.ts            # cn() utility for className merging
```

---

## 🤝 Collaboration Guidelines

### Code Standards

**Naming Conventions**
- Classes → `PascalCase`
- Variables/functions → `camelCase`
- Files/directories → `kebab-case` (React components may be `PascalCase`)
- Booleans → `is/has/can` prefix
- Functions → Start with verb (`handle`, `get`, `create`, etc.)

**TypeScript**
- Explicit types for all variables, params, and returns
- Avoid `any`; create specific types/interfaces
- Use JSDoc for exported functions/components
- One export per file

**Functions**
- Keep functions short (<20 instructions)
- Single purpose, single abstraction level
- Prefer early returns
- Use HOFs: `map`, `filter`, `reduce`
- Use const arrow functions with explicit types

**React/Next.js**
- Functional components with TypeScript
- Props interfaces defined above component
- Event handlers prefixed with `handle` (e.g., `handleClick`)
- Use React hooks appropriately
- Prefer composition over prop drilling

### Styling

**Tailwind CSS**
- Use Tailwind v4 `@theme` in `globals.css` for design tokens
- All colors: `hsl(var(--token) / <alpha-value>)`
- Use `cn()` utility for conditional classes (avoid long ternaries)
- No inline CSS or separate CSS files
- Components use shadcn/ui primitives + Tailwind tokens

**Design Principles**
- Generous whitespace for wedding aesthetic
- Consistent vertical rhythm between sections
- Strong button states (hover, focus) that feel tactile
- Visual balance: Hers theme = airy/light, His theme = grounded/structured
- Background motifs at subtle opacity (watermark style)
- Responsive: mobile-first, scale at `md:` and `lg:` breakpoints
- Accessibility: WCAG AA contrast, semantic HTML, focus-visible states

### Theme Implementation

**Theme-Aware Components**
- Use `[data-theme="his"]` and `[data-theme="hers"]` selectors in CSS
- Check current theme with `useTheme()` hook when needed
- Ensure both themes look visually balanced
- Test all components in both themes before committing

**Typography Hierarchy**
- Script fonts for hero names (large, romantic)
- Serif for headings
- Sans-serif for body text
- Maintain readability with proper line-height and spacing

### Development Workflow

1. **Write pseudocode first** for complex features
2. **Confirm approach** before implementing
3. **Include all imports** and correct naming
4. **Test in both themes** (His & Hers)
5. **Test responsive** (mobile, tablet, desktop)
6. **Check accessibility** (keyboard nav, screen readers)
7. **No regressions** — ensure existing features still work

### Feature Integration

**Reuse First**
- Search for existing utilities/hooks/components before creating new ones
- Extend existing components rather than duplicating
- Composition over new modules
- Extract shared logic to utilities

**No Breaking Changes**
- Maintain backward compatibility
- Don't change public component props or API shapes
- If breaking change needed, provide deprecation pathway + migration notes

**Documentation**
- Update README for new features
- Add JSDoc for exported functions/components
- Comment complex logic inline
- Add TODOs for missing pieces or placeholders

### Commit Guidelines

- Write clear, descriptive commit messages
- Use conventional commits format: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`
- Keep commits atomic and focused
- Test before committing

### Code Review Checklist

- [ ] TypeScript types defined for all values
- [ ] Works in both His & Hers themes
- [ ] Responsive on mobile, tablet, desktop
- [ ] Accessible (keyboard nav, ARIA labels where needed)
- [ ] No console errors or warnings
- [ ] Follows naming conventions
- [ ] Reused existing utilities where possible
- [ ] No duplicate code
- [ ] Tailwind/shadcn conventions followed
- [ ] JSDoc added for exports
- [ ] Tested thoroughly

---

## 🎯 Key Features

- **Dual Theme System**: Toggle between His (sophisticated dark) and Hers (light cottagecore) themes
- **Hero Section**: Animated names, date, and watercolor silhouettes with paper texture backgrounds
- **RSVP Form**: Full-featured form with WhatsApp integration
  - Dynamic guest/children count
  - Multi-event selection (Bhopal & Ayodhya)
  - Relationship selector
  - Form validation
  - Phone fallback for non-WhatsApp users
- **Theme-Aware Textures**: Different background patterns for each theme
- **Responsive Design**: Mobile-first approach with breakpoints
- **Accessibility**: WCAG AA compliant, semantic HTML, keyboard navigation
- **SEO Optimized**: Complete metadata, Open Graph, Twitter Cards
- **PWA Ready**: Web manifest for installable app experience

---

## 📝 Environment & Config

- **Production URL**: `https://be4.life`
- **Metadata**: Configured in `src/app/layout.tsx`
- **Theme Color**: `#C76E47` (Terracotta)
- **PWA Manifest**: `public/site.webmanifest`
- **Favicons**: All sizes in `public/` directory
- **OG Image**: `public/og-image.png` (1200x630)

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Radix UI](https://www.radix-ui.com/)

---

## 🐛 Troubleshooting

**Theme not switching?**
- Check `data-theme` attribute on `<html>` element
- Verify theme provider is wrapping app in `layout.tsx`

**Styles not applying?**
- Ensure Tailwind is watching files: `npm run dev`
- Check for typos in `cn()` class merging
- Verify CSS variables in `globals.css`

**RSVP form not working?**
- Check WhatsApp number in `src/app/rsvp/page.tsx`
- Verify form validation logic
- Test in both themes

---

Made with 💛 for Bhanvi & Eshlok's wedding celebration

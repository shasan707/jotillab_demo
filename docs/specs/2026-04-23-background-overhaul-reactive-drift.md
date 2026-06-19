# Background Overhaul: Reactive Drift

**Date:** 2026-04-23
**Status:** Approved
**Scope:** Background system only (blobs, grain, smooth scroll, section reveals). Does not touch nav, footer, messenger, or page content.

## Problem

The current background system feels static and dated:
- 5 gradient blobs on slow 28-35s CSS keyframe loops look sluggish ("slob, boring")
- Static SVG grain overlay lacks life (Photoshop-filter feel)
- No scroll narrative connecting background movement to user interaction
- Base color `#F0F2F8` reads lavender-tinted rather than the clean white of modern premium B2B sites
- No smooth scrolling (browser-native scroll feels abrupt)

## Reference

- **Target feel:** britive.com-style whitish base with grain texture, but with more energy and animation
- **Energy:** "Electric & Modern" -- sharper, saturated, cyan accent prominent. Tech company that moves fast.
- **Brand guide:** Respects JotilLabs brand DNA (royal blue `#3859a8`, navy `#0f1129`, Montserrat Alternates, hexagonal logo). Extends beyond the guide's limited 4-color palette without contradicting it.

## Design

### 1. Base Layer

Background color shifts from `#F0F2F8` to `#F6F7FB` (near-white, faintest blue undertone). Enough warmth that white cards pop; not so tinted that it reads lavender.

### 2. New Blob System: "Electric Drift"

4 blobs replacing the current 5. Larger, faster, blurrier, scroll-aware.

| Blob | Color (rgba) | Size | Position | Role |
|------|-------------|------|----------|------|
| Anchor | `56, 89, 168, 0.35` | ~45vw | Bottom-left | Brand gravity |
| Cyan Flare | `34, 211, 238, 0.18` | ~35vw | Top-right | Energy accent |
| Sapphire | `59, 130, 246, 0.25` | ~40vw | Center-left | Bridge tone |
| Violet Edge | `99, 102, 241, 0.12` | ~30vw | Bottom-right | Depth |

**Animation:**
- GSAP timelines: 12-18s drift cycles per blob (independent)
- Bezier-like drift paths (organic, not linear)
- Scale pulse: 0.95x-1.05x on 8-10s secondary cycle
- Blur: 60-80px (atmospheric, not discrete circles)
- **Scroll-reactive:** GSAP ScrollTrigger redistributes blob positions as user scrolls. Hero = top-heavy. Content = spread. CTA = anchor front-and-center.

**Mobile:** Reduce to 2 blobs (Anchor + Cyan Flare). Lighter opacity.

### 3. Animated Film Grain

SVG feTurbulence (existing technique, zero new assets) with CSS animation that translates the grain layer for film-grain flicker.

- Animation: translate jitter, ~50ms steps (stepped, not smooth)
- Translate range: -200px to 200px
- Grain tile: 1024px (up from 512px to accommodate movement)

**Opacity by zone:**
- Hero: 0.18
- Content sections: 0.08
- Navy sections (footer/CTA): 0.12
- Watermark logo: 0 (clean, isolated via z-index)
- Nav: grain shows through (transparent/glass)

**Reduced motion:** Grain visible but static (animation paused).

### 4. Smooth Scrolling (Lenis)

- Initialized at app layout level
- Synced with GSAP ScrollTrigger (shared scroll position)
- `lerp: 0.1`, `duration: 1.2`
- Disabled on mobile touch devices (native momentum is superior)

### 5. Section Reveals (GSAP ScrollTrigger)

- Trigger: section enters viewport at 20% from bottom
- Stagger: title (0ms) -> subtitle (80ms) -> content blocks (150ms intervals)
- Animation: `opacity: 0->1` + `translateY: 40px->0`, `power2.out`, 600ms
- Once only (no reverse on scroll-up)
- Nav/footer/messenger untouched

### 6. Blob Scroll Choreography

As sections enter view, ScrollTrigger nudges blob positions 5-10% of viewport. Subtle, not dramatic. Creates "page breathes with you" effect.

## Dependencies (New)

| Package | Size (gzipped) | Purpose |
|---------|---------------|---------|
| gsap | ~24KB | Animation engine |
| @gsap/react | ~2KB | React integration |
| ScrollTrigger (GSAP plugin) | ~12KB | Scroll-based triggers |
| lenis | ~3KB | Smooth scroll |
| **Total** | **~41KB** | |

## Performance

- All animations GPU-composited (transform, opacity only)
- Grain: single div with will-change: transform
- No new images or fonts
- `prefers-reduced-motion`: grain static, blobs static, Lenis disabled, no scroll reveals

## Files to Modify

- `app/globals.css` -- base color, remove old orb keyframes, add grain animation keyframes
- `components/design/BrandBackground.jsx` -- complete rewrite (new blobs, GSAP, grain animation)
- `app/layout.js` -- Lenis provider integration
- `lib/brand.js` -- update bg color token
- New: `components/design/SmoothScroll.jsx` -- Lenis wrapper component
- New: `components/design/SectionReveal.jsx` -- ScrollTrigger reveal wrapper

## Exclusions

- Homepage hero/content rework (separate future task -- current content needs business-first rewrite)
- Nav, footer, messenger modifications
- Page-specific content changes
- Dark mode

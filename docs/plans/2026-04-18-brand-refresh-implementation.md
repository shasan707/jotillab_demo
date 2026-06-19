# Brand Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the JotilLabs marketing site from the legacy "Jotil Labs" brand (bright-blue + indigo + cyan palette, Outfit font, two-word wordmark) to the new brand doc identity (royal-blue + deep-navy + cyan accent, Montserrat Alternates font, one-word "JotilLabs" wordmark) across every brand surface while preserving live legal-page body copy.

**Architecture:** Single source-of-truth module (`lib/brand.js`) → consumed by Tailwind `@theme` tokens, `next/font` setup, Logo component (parametric tones), metadata, JSON-LD, and OG image. Single feature branch (`redesign/brand-refresh-2026`) with 8 ordered commits, each standalone-green. Playwright visual regression covers top 5 routes × 2 viewports.

**Tech Stack:** Next.js 15 (App Router) + React 19 + JSX + Tailwind CSS v4 (`@theme` directive) + `next/font/google` + Framer Motion + Playwright (new).

**Spec:** `docs/plans/2026-04-18-brand-refresh-design.md`

---

## Pre-flight

### Task 0: Verify branch state

**Files:** none (git sanity check)

- [ ] **Step 1: Confirm we're on the feature branch**

Run: `git rev-parse --abbrev-ref HEAD`
Expected: `redesign/brand-refresh-2026`

- [ ] **Step 2: Confirm working tree clean**

Run: `git status --short`
Expected: empty output (spec + explorations already committed)

- [ ] **Step 3: Confirm dependencies install and dev server starts**

Run:
```bash
npm install
npm run dev
```
Expected: server at `http://localhost:3000`, no errors. Kill after verifying.

- [ ] **Step 4: Create GitHub issue for the rebrand**

Run:
```bash
gh issue create \
  --title "Brand refresh: rebrand to JotilLabs with new palette, typography, logo" \
  --body "$(cat <<'EOF'
## Summary
Migrate marketing site to the new brand identity per brand doc delivered on 2026-04-18.

## Scope
- New palette: royal blue #3859a8 + deep navy #0f1129 + electric cyan #22D3EE accent
- Typography: Montserrat Alternates (display), Inter (body, unchanged)
- Logo: existing SVG geometry, new color tones, "JotilLabs" wordmark
- Tagline: "Automate. Empower. Scale." in footer + OG + hero eyebrow
- Name: "JotilLabs" (one word) brand-wide; "Jotil Labs LLC" retained in legal-page bodies
- Founding year: 2024 → 2026

## Out of scope
- Site-wide dark mode
- New pages/features
- Legal page body copy (T&Cs, Privacy, Opt-In contract text preserved)

## Spec
See `docs/plans/2026-04-18-brand-refresh-design.md`

## Acceptance criteria
- [ ] `lib/brand.js` is the single source of truth for all brand constants
- [ ] All `bg-primary`, `text-primary` etc. reflect new palette
- [ ] Logo renders correctly in light + dark contexts with heartbeat animation
- [ ] "JotilLabs" (no space) appears in nav, footer, metadata, OG
- [ ] "Jotil Labs LLC" appears in legal-page bodies unchanged (diff check)
- [ ] Footer © line: "© 2026 Jotil Labs LLC"
- [ ] Hero eyebrow: "Automate. Empower. Scale."
- [ ] Favicon + apple-touch + manifest updated
- [ ] Playwright visual snapshots pass on 5 routes × 2 viewports
- [ ] Vercel preview URL verified by user before merge
EOF
)"
```
Expected: issue URL printed to stdout. Record it for PR linkage.

- [ ] **Step 5: Commit nothing — Task 0 is sanity only**

No commit.

---

## Task 1: Add `lib/brand.js` source-of-truth module

**Files:**
- Create: `lib/brand.js`

- [ ] **Step 1: Create the module**

Create `lib/brand.js`:

```js
// Single source of truth for all JotilLabs brand constants.
// Consumers: globals.css @theme (colors), layout.jsx (metadata), JsonLd.jsx
// (schema), og/route.jsx (OG image), Footer.jsx (wordmark + copy),
// manifest.json (regenerated manually in sync), and any copy referencing
// name/tagline/contact.
//
// To change a brand value site-wide: edit here, then verify the consumers
// listed in the spec at docs/plans/2026-04-18-brand-refresh-design.md.

export const brand = {
  name: 'JotilLabs',                 // wordmark / brand
  legalName: 'Jotil Labs LLC',       // registered LLC — legal pages + © footer
  tagline: 'Automate. Empower. Scale.',
  domain: 'jotillabs.com',
  url: 'https://jotillabs.com',
  urlWww: 'https://www.jotillabs.com',
  email: 'contact@jotillabs.com',
  phone: '+1 (358) 900-0040',
  phoneHref: 'tel:+13589000040',
  address: {
    city: 'Lehi',
    state: 'Utah',
    stateCode: 'UT',
    country: 'US',
  },
  founded: 2026,

  colors: {
    primary: '#3859a8',              // royal blue
    primaryDark: '#2a4688',          // hover state
    navy: '#0f1129',                 // deep navy
    accent: '#22D3EE',               // electric cyan — UI accent only
    logoMuted: '#8ca3cc',            // logo dots + wordmark "Labs" on dark bg
    black: '#000000',
    white: '#FFFFFF',
  },

  neutrals: {
    bg: '#FAFBFD',
    bgAlt: '#F4F6FB',
    surface: 'rgba(15,17,41,0.04)',
    border: 'rgba(15,17,41,0.08)',
    text: '#0F1129',
    muted: '#4A4D6A',
    subtle: '#6B7098',
  },

  fonts: {
    display: 'Montserrat Alternates',
    body: 'Inter',
    mono: 'JetBrains Mono',
  },

  social: {
    linkedin: 'https://linkedin.com/company/jotillabs',
    x: 'https://x.com/jotillabs',
    youtube: 'https://youtube.com/@jotillabs',
  },
}

// Convenience: © line rendered in footers.
export function copyrightLine() {
  return `© ${new Date().getFullYear()} ${brand.legalName}. All rights reserved.`
}
```

- [ ] **Step 2: Verify it imports**

Run:
```bash
node --input-type=module -e "import('./lib/brand.js').then(m => console.log(m.brand.name, m.copyrightLine()))"
```
Expected: `JotilLabs © 2026 Jotil Labs LLC. All rights reserved.`

- [ ] **Step 3: Verify lint passes**

Run: `npm run lint`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add lib/brand.js
git commit -m "feat(brand): add brand.js source-of-truth module"
```

---

## Task 2: Replace palette and typography tokens

**Files:**
- Modify: `app/globals.css` (replace `@theme` block + add `@keyframes heartbeat`)
- Modify: `app/layout.jsx` (swap `Outfit` → `Montserrat_Alternates`, update metadata references in Task 5)

- [ ] **Step 1: Replace the `@theme` block in `app/globals.css`**

Open `app/globals.css`. Find the block starting at line 3 (`@theme {`) and ending at line 40 (the closing `}` before `/* ── Keyframes ── */`). Replace with:

```css
@theme {
  /* Fonts */
  --font-display: var(--font-montserrat-alternates), "Montserrat Alternates", system-ui, -apple-system, sans-serif;
  --font-sans: var(--font-montserrat-alternates), "Montserrat Alternates", system-ui, -apple-system, sans-serif;
  --font-body: var(--font-inter), "Inter", system-ui, -apple-system, sans-serif;
  --font-mono: var(--font-jetbrains), "JetBrains Mono", ui-monospace, monospace;

  /* Brand colors */
  --color-primary: #3859a8;
  --color-primary-dark: #2a4688;
  --color-navy: #0f1129;
  --color-accent: #22D3EE;
  --color-logo-muted: #8ca3cc;

  /* Backgrounds */
  --color-bg: #FAFBFD;
  --color-bg-alt: #F4F6FB;
  --color-surface: rgba(15, 17, 41, 0.04);
  --color-surface-hover: rgba(15, 17, 41, 0.07);

  /* Text */
  --color-text: #0F1129;
  --color-text-secondary: #4A4D6A;
  --color-text-muted: #6B7098;
  --color-dark: #0F1129;
  --color-white: #FFFFFF;

  /* Borders */
  --color-border: rgba(15, 17, 41, 0.08);
  --color-border-hover: rgba(56, 89, 168, 0.20);

  /* Animations (existing, preserved) */
  --animate-float: float 6s ease-in-out infinite;
  --animate-icon-bob: icon-bob 3s ease-in-out infinite;
  --animate-orb-1: orb-drift-1 30s ease-in-out infinite;
  --animate-orb-2: orb-drift-2 35s ease-in-out infinite;
  --animate-orb-3: orb-drift-3 28s ease-in-out infinite;
  --animate-orb-4: orb-drift-4 32s ease-in-out infinite;
  --animate-ring-pulse: ring-pulse 3s ease-in-out infinite;
  --animate-ring-pulse-reverse: ring-pulse-reverse 3s ease-in-out infinite;
  --animate-ring-rotate: ring-rotate 60s linear infinite;
  --animate-orbit: orbit 25s linear infinite;
  --animate-heartbeat: heartbeat 10s ease-in-out infinite;
}
```

Key changes:
- `--color-primary: #3B7BF2 → #3859a8`
- `--color-primary-dark: #1B4FBA → #2a4688`
- Added `--color-navy`, `--color-logo-muted`
- `--color-accent: #0EA5E9 → #22D3EE`
- Removed `--color-primary-accent`, `--color-primary-light`, `--color-secondary`, `--color-glow`
- `--color-dark: #0A0F1C → #0F1129`
- `--color-text: #111111 → #0F1129`
- `--color-text-secondary: #6B7280 → #4A4D6A` (per spec muted)
- `--color-text-muted: #9CA3AF → #6B7098`
- `--color-border: rgba(0,0,0,0.05) → rgba(15,17,41,0.08)`
- `--color-border-hover: rgba(59,123,242,0.15) → rgba(56,89,168,0.20)`
- `--color-bg-alt: #F0F4FF → #F4F6FB`
- `--color-surface: rgba(15,23,42,...) → rgba(15,17,41,...)` (aligned with navy)
- Added font tokens `--font-display` + `--font-montserrat-alternates` variable reference
- Added `--animate-heartbeat` token

- [ ] **Step 2: Add `@keyframes heartbeat` at the end of `app/globals.css`**

Append at the bottom of `app/globals.css` (after all existing keyframes):

```css
/* Logo heartbeat pulse (10s cycle, short double-beat, long quiet) */
@keyframes heartbeat {
  0%   { transform: scale(1);   opacity: 0.55; }
  3%   { transform: scale(1.3); opacity: 1; }
  5%   { transform: scale(1);   opacity: 0.7; }
  7%   { transform: scale(1.2); opacity: 1; }
  10%  { transform: scale(1);   opacity: 0.55; }
  100% { transform: scale(1);   opacity: 0.55; }
}
```

- [ ] **Step 3: Swap font imports in `app/layout.jsx`**

Replace lines 1-31 of `app/layout.jsx`:

```jsx
import './globals.css'
import { Montserrat_Alternates, Inter, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { OrganizationJsonLd, WebsiteJsonLd } from '@/components/layout/JsonLd'
import { AIWidget } from '@/components/widgets/AIWidget'
import { ScrollToTop } from '@/components/layout/ScrollToTop'

const montserratAlternates = Montserrat_Alternates({
  subsets: ['latin'],
  variable: '--font-montserrat-alternates',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500'],
})
```

And line 92 (the `html` className):
```jsx
className={`scroll-smooth ${montserratAlternates.variable} ${inter.variable} ${jetbrainsMono.variable}`}
```

(Metadata block in the same file is updated in Task 5.)

- [ ] **Step 4: Build the site**

Run: `npm run build`
Expected: clean build, no errors. If errors reference unknown tokens (`--color-primary-accent`, `--color-secondary`, `--color-glow`, `--color-primary-light`), they must be fixed in whatever file references them — `grep -rn "text-primary-accent\|bg-primary-accent\|text-secondary\|text-primary-light\|bg-glow" app components`. Patch each usage to reference the new token (`primary`, `navy`, `accent`) or inline the old color as a plain CSS value if intentionally retained.

- [ ] **Step 5: Verify dev server renders without font/color errors**

Run: `npm run dev` → visit `http://localhost:3000/`. Visual check: text renders (font visible), blues look darker/richer than before.

Kill dev server.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css app/layout.jsx
git commit -m "feat(brand): replace palette + typography tokens in Tailwind theme"
```

---

## Task 3: Rebuild Logo component + derivative assets

**Files:**
- Modify: `components/ui/Logo.jsx` (full rewrite)
- Modify: `public/favicon.svg` (replace with new mark)
- Modify: `public/apple-touch-icon.svg` (replace with padded new mark)
- Modify: `public/manifest.json` (update brand refs + theme color)

- [ ] **Step 1: Rewrite `components/ui/Logo.jsx`**

Replace the entire contents of `components/ui/Logo.jsx` with:

```jsx
import { cn } from '@/lib/utils'

// Size presets in px. Pass a number for custom sizes.
const sizeMap = { xs: 24, sm: 32, md: 40, lg: 56, xl: 72 }

// Tone palettes — defines which colors the Icon SVG groups use.
const tonePalettes = {
  brand:    { hex: '#3859a8', depth: '#0f1129', dot: '#8ca3cc' }, // default light bg
  'on-dark':{ hex: '#ffffff', depth: '#8ca3cc', dot: '#8ca3cc' }, // footer, dark sections
  mono:     { hex: 'currentColor', depth: 'currentColor', dot: 'currentColor' }, // favicon, print
}

/**
 * Inner SVG primitive — renders the hex + 3D L + 3 dots.
 * Reused by Logo (wrapper) and any consumer that needs raw paths.
 */
function Icon({ hex, depth, dot, animate }) {
  const dotStyle = (delay) =>
    animate
      ? { animation: `heartbeat 10s ease-in-out infinite ${delay}s`, transformBox: 'fill-box', transformOrigin: 'center' }
      : undefined

  return (
    <>
      <g fill={hex}>
        <path d="M341.48 360.32 c-21.48 -12.68 -59.08 -34.74 -84 -49.33 l-6.82 -3.96 0 -67.36 0 -67.36 3.15 -2.49 c3.44 -2.79 17.52 -11.07 20.08 -11.87 l1.69 -0.44 0 67.36 0 67.43 6.82 3.96 c79.09 46.40 83.48 48.96 84.88 48.96 0.66 0 4.25 -1.83 7.99 -4.10 3.81 -2.27 8.43 -4.98 10.41 -6.01 6.60 -3.66 7.55 -4.25 10.70 -6.23 1.76 -1.10 4.03 -2.35 5.13 -2.79 1.10 -0.44 4.10 -2.20 6.74 -3.88 2.64 -1.76 8.21 -5.13 12.46 -7.55 4.25 -2.42 11.36 -6.60 15.83 -9.24 4.54 -2.64 8.65 -4.91 9.16 -5.06 0.59 -0.07 3.59 -1.83 6.67 -3.88 l5.64 -3.66 0.07 -44.12 0 -44.20 2.79 -1.39 c1.47 -0.73 6.16 -3.44 10.33 -5.94 4.25 -2.49 8.58 -4.69 9.75 -4.91 l2.05 -0.37 0 57.90 0 57.98 -1.61 0.88 c-0.95 0.51 -3.96 2.35 -6.67 4.10 -2.79 1.83 -6.08 3.74 -7.33 4.32 -1.32 0.59 -3.30 1.69 -4.54 2.49 -1.17 0.73 -3.01 1.83 -4.03 2.42 -1.76 1.03 -22.94 13.27 -25.51 14.81 -0.66 0.44 -3.30 1.98 -5.72 3.52 -2.49 1.47 -4.69 2.71 -4.98 2.71 -0.22 0 -2.79 1.54 -5.72 3.44 -2.93 1.83 -6.30 3.81 -7.55 4.40 -3.81 1.83 -18.62 10.41 -27.63 16.13 -1.54 0.88 -2.93 1.69 -3.15 1.69 -0.29 0 -1.83 0.95 -3.52 2.05 -2.57 1.69 -4.98 3.01 -7.92 4.32 -0.22 0.07 -11.80 -6.52 -25.65 -14.73z" />
        <path d="M362.01 313.04 c-1.91 -1.17 -15.10 -9.02 -29.32 -17.30 -14.29 -8.36 -27.19 -15.98 -28.66 -16.93 l-2.79 -1.76 0 -68.02 0 -67.94 4.62 -2.71 c2.49 -1.54 6.01 -3.52 7.84 -4.47 1.83 -0.95 7.18 -4.10 11.95 -6.96 4.69 -2.93 8.80 -5.28 8.94 -5.28 0.37 0 10.77 -6.08 15.03 -8.80 0.59 -0.37 4.69 -2.71 9.02 -5.20 7.33 -4.18 8.14 -4.47 9.89 -3.59 2.05 0.88 21.92 12.46 49.25 28.59 8.65 5.13 21.84 12.83 29.32 17.15 7.48 4.32 14 8.28 14.51 8.80 0.81 0.81 -0.07 1.47 -4.40 3.74 -2.93 1.54 -5.86 3.22 -6.45 3.74 -1.69 1.39 -12.68 6.89 -13.93 6.89 -0.66 0 -1.76 -0.44 -2.57 -1.03 -0.81 -0.51 -14.29 -8.58 -30.05 -17.81 -15.69 -9.24 -29.98 -17.74 -31.74 -18.84 -6.08 -3.81 -5.64 -7.18 -5.86 43.17 -0.15 24.63 0 48.38 0.22 52.92 l0.51 8.21 22.79 13.41 c12.61 7.33 26.97 15.76 31.96 18.69 4.98 2.93 9.16 5.42 9.31 5.57 0.44 0.37 -7.26 5.42 -12.17 8.06 -2.20 1.17 -4.54 2.57 -5.13 3.08 -0.59 0.44 -2.05 1.39 -3.30 1.98 -3.01 1.54 -5.28 2.86 -8.80 5.06 -1.61 0.95 -3.74 2.20 -4.76 2.71 -4.18 2.05 -8.80 5.06 -10.77 6.96 -1.17 1.10 -2.64 1.98 -3.30 1.98 -1.61 0 -5.28 1.98 -6.82 3.66 -0.73 0.81 -1.76 1.47 -2.20 1.47 -0.51 0 -1.76 0.66 -2.79 1.47 -2.57 2.05 -5.42 1.83 -9.38 -0.66z" />
      </g>
      <g fill={depth}>
        <path d="M341.48 360.32 c-21.48 -12.68 -59.08 -34.74 -84 -49.33 -4.03 -2.35 -6.82 -4.40 -6.82 -5.06 0 -0.73 0.44 -1.03 1.03 -0.81 0.51 0.22 2.79 -0.73 4.91 -2.05 2.20 -1.39 6.96 -4.25 10.70 -6.38 l6.67 -3.88 0 -63.03 c0 -63.25 -0.15 -70.36 -1.39 -69.56 -0.37 0.22 -0.51 0.66 -0.29 1.03 0.22 0.37 0 0.88 -0.44 1.10 -0.37 0.29 -0.59 0.95 -0.37 1.54 1.10 2.79 -2.20 4.40 -4.40 2.13 -0.66 -0.59 -1.47 -1.10 -1.91 -1.10 -0.44 0 -0.59 0.22 -0.37 0.51 0.88 0.81 -1.10 2.42 -3.08 2.42 -1.17 0 -2.27 0.59 -2.93 1.54 -0.66 1.17 -1.10 1.39 -1.54 0.66 -0.44 -0.73 -0.88 -0.73 -2.27 0 -1.76 0.95 -1.76 0.95 -0.37 -0.59 1.69 -1.91 17.37 -11.14 18.91 -11.14 1.83 0 2.05 6.74 2.05 71.98 l0 62.01 6.82 3.96 c79.09 46.40 83.48 48.96 84.88 48.96 0.66 0 4.25 -1.83 7.99 -4.10 3.81 -2.27 8.43 -4.98 10.41 -6.01 6.60 -3.66 7.55 -4.25 10.70 -6.23 1.76 -1.10 4.03 -2.35 5.13 -2.79 1.10 -0.44 4.10 -2.20 6.74 -3.88 2.64 -1.76 8.21 -5.13 12.46 -7.55 4.25 -2.42 11.36 -6.60 15.83 -9.24 4.54 -2.64 8.65 -4.91 9.16 -5.06 0.59 -0.07 3.59 -1.83 6.67 -3.88 l5.64 -3.66 0.07 -44.12 0 -44.20 2.79 -1.39 c1.47 -0.73 6.16 -3.44 10.33 -5.94 4.25 -2.49 8.58 -4.69 9.75 -4.91 l2.05 -0.37 0 57.90 0 57.98 -1.61 0.88 c-0.95 0.51 -3.96 2.35 -6.67 4.10 -2.79 1.83 -6.08 3.74 -7.33 4.32 -1.32 0.59 -3.30 1.69 -4.54 2.49 -1.17 0.73 -3.01 1.83 -4.03 2.42 -1.76 1.03 -22.94 13.27 -25.51 14.81 -0.66 0.44 -3.30 1.98 -5.72 3.52 -2.49 1.47 -4.69 2.71 -4.98 2.71 -0.22 0 -2.79 1.54 -5.72 3.44 -2.93 1.83 -6.30 3.81 -7.55 4.40 -3.81 1.83 -18.62 10.41 -27.63 16.13 -1.54 0.88 -2.93 1.69 -3.15 1.69 -0.29 0 -1.83 0.95 -3.52 2.05 -2.57 1.69 -4.98 3.01 -7.92 4.32 -0.22 0.07 -11.80 -6.52 -25.65 -14.73z m139.70 -163.74 c-0.15 -0.22 -0.73 0 -1.32 0.44 -0.51 0.44 -1.32 0.51 -1.98 0.15 -0.95 -0.59 -7.18 2.27 -15.03 6.82 l-2.93 1.76 -0.22 43.68 -0.15 43.61 7.40 4.32 c4.03 2.35 8.94 5.28 10.77 6.52 l3.44 2.27 0.22 -54.61 c0.07 -30.05 0 -54.75 -0.22 -54.97z" />
        <path d="M354.02 308.28 c-6.23 -3.74 -20.23 -12.02 -31.15 -18.40 -10.85 -6.30 -20.08 -11.87 -20.52 -12.24 -0.51 -0.51 -0.44 -0.88 0.15 -1.10 0.44 -0.15 6.89 -3.88 14.29 -8.21 7.40 -4.32 21.04 -12.31 30.27 -17.66 9.31 -5.35 17.52 -10.11 18.25 -10.63 1.25 -0.73 4.84 1.17 27.49 14.51 14.37 8.43 28.95 17 32.54 18.98 3.52 2.05 6.38 3.74 6.38 3.88 0 0.37 -8.72 5.94 -12.46 7.92 -2.20 1.17 -4.54 2.57 -5.13 3.08 -0.59 0.44 -2.05 1.39 -3.30 1.98 -3.01 1.54 -5.28 2.86 -8.80 5.06 -1.61 0.95 -3.74 2.20 -4.76 2.71 -4.18 2.05 -8.80 5.06 -10.77 6.96 -1.17 1.10 -2.64 1.98 -3.30 1.98 -1.61 0 -5.28 1.98 -6.82 3.66 -0.73 0.81 -1.76 1.47 -2.20 1.47 -0.51 0 -1.76 0.66 -2.79 1.47 -3.15 2.49 -5.28 1.83 -17.37 -5.42z" />
      </g>
      <g fill={dot} style={dotStyle(0)}>
        <path d="M424.23 202.37 c-2.05 -1.83 -2.42 -2.64 -2.42 -5.42 0 -4.18 2.05 -7.11 5.94 -8.50 2.57 -0.88 3.22 -0.88 5.57 0.22 3.37 1.61 5.35 5.42 4.62 9.02 -1.25 6.60 -8.80 9.09 -13.71 4.69z" />
      </g>
      <g fill={dot} style={dotStyle(0.15)}>
        <path d="M453.70 193.35 c-4.54 -2.35 -6.60 -5.64 -6.60 -10.63 0 -7.48 3.52 -11.29 11.73 -12.75 10.70 -1.83 17.22 11.80 9.82 20.60 -3.81 4.47 -9.53 5.50 -14.95 2.79z" />
      </g>
      <g fill={dot} style={dotStyle(0.3)}>
        <path d="M491.08 180.60 c-6.16 -2.64 -9.53 -8.06 -9.53 -15.32 0 -10.41 7.33 -17.88 17.44 -17.96 9.68 0 16.27 6.67 16.27 16.49 0 7.18 -3.81 13.12 -10.41 16.56 -3.30 1.69 -10.11 1.83 -13.78 0.22z" />
      </g>
    </>
  )
}

/**
 * Logo mark — hex icon only.
 * @param {'xs'|'sm'|'md'|'lg'|'xl'|number} size
 * @param {'brand'|'on-dark'|'mono'} tone
 * @param {boolean} animate — heartbeat pulse on dots
 */
export default function Logo({ size = 'md', tone = 'brand', animate = true, className }) {
  const dimension = typeof size === 'number' ? size : sizeMap[size] || sizeMap.md
  const palette = tonePalettes[tone] || tonePalettes.brand

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="220 130 320 280"
      width={dimension}
      height={dimension}
      className={cn('shrink-0', className)}
      aria-label="JotilLabs logo"
      role="img"
    >
      <Icon {...palette} animate={animate} />
    </svg>
  )
}

/**
 * Wordmark — "JotilLabs" text only.
 * "Jotil" in navy/white; "Labs" in primary/muted.
 */
export function LogoWordmark({ tone = 'brand', className }) {
  const jotilCls = tone === 'on-dark' ? 'text-white' : 'text-navy'
  const labsCls  = tone === 'on-dark' ? 'text-[color:var(--color-logo-muted)]' : 'text-primary'
  return (
    <span
      className={cn('font-display font-bold tracking-[-0.5px] leading-none', className)}
    >
      <span className={jotilCls}>Jotil</span><span className={labsCls}>Labs</span>
    </span>
  )
}

/**
 * Lockup — mark + wordmark side by side, optional tagline beneath.
 */
export function LogoLockup({ size = 'md', tone = 'brand', showTagline = false, className, textClassName, taglineClassName }) {
  const dim = typeof size === 'number' ? size : sizeMap[size] || sizeMap.md
  const textSize = dim >= 56 ? 'text-3xl' : dim >= 40 ? 'text-2xl' : dim >= 32 ? 'text-xl' : 'text-lg'
  const taglineTone = tone === 'on-dark' ? 'text-[color:var(--color-logo-muted)]/60' : 'text-[color:var(--color-logo-muted)]'

  return (
    <span className={cn('inline-flex items-center gap-2.5', !showTagline && className)}>
      {showTagline ? (
        <span className={cn('inline-flex flex-col items-start gap-0.5', className)}>
          <span className="inline-flex items-center gap-2.5">
            <Logo size={size} tone={tone} />
            <LogoWordmark tone={tone} className={cn(textSize, textClassName)} />
          </span>
          <span className={cn('font-display font-semibold text-[10px] tracking-[0.25em] uppercase', taglineTone, taglineClassName)}>
            Automate. Empower. Scale.
          </span>
        </span>
      ) : (
        <>
          <Logo size={size} tone={tone} />
          <LogoWordmark tone={tone} className={cn(textSize, textClassName)} />
        </>
      )}
    </span>
  )
}

// Back-compat — old code imported { LogoText }. Alias to new API.
export { LogoWordmark as LogoText }
export { LogoLockup as LogoWithText }
```

- [ ] **Step 2: Replace `public/favicon.svg`**

Replace the entire contents of `public/favicon.svg` with:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="220 130 320 280" width="32" height="32" aria-label="JotilLabs">
  <g fill="#3859a8">
    <path d="M341.48 360.32 c-21.48 -12.68 -59.08 -34.74 -84 -49.33 l-6.82 -3.96 0 -67.36 0 -67.36 3.15 -2.49 c3.44 -2.79 17.52 -11.07 20.08 -11.87 l1.69 -0.44 0 67.36 0 67.43 6.82 3.96 c79.09 46.40 83.48 48.96 84.88 48.96 0.66 0 4.25 -1.83 7.99 -4.10 3.81 -2.27 8.43 -4.98 10.41 -6.01 6.60 -3.66 7.55 -4.25 10.70 -6.23 1.76 -1.10 4.03 -2.35 5.13 -2.79 1.10 -0.44 4.10 -2.20 6.74 -3.88 2.64 -1.76 8.21 -5.13 12.46 -7.55 4.25 -2.42 11.36 -6.60 15.83 -9.24 4.54 -2.64 8.65 -4.91 9.16 -5.06 0.59 -0.07 3.59 -1.83 6.67 -3.88 l5.64 -3.66 0.07 -44.12 0 -44.20 2.79 -1.39 c1.47 -0.73 6.16 -3.44 10.33 -5.94 4.25 -2.49 8.58 -4.69 9.75 -4.91 l2.05 -0.37 0 57.90 0 57.98 -1.61 0.88 c-0.95 0.51 -3.96 2.35 -6.67 4.10 -2.79 1.83 -6.08 3.74 -7.33 4.32 -1.32 0.59 -3.30 1.69 -4.54 2.49 -1.17 0.73 -3.01 1.83 -4.03 2.42 -1.76 1.03 -22.94 13.27 -25.51 14.81 -0.66 0.44 -3.30 1.98 -5.72 3.52 -2.49 1.47 -4.69 2.71 -4.98 2.71 -0.22 0 -2.79 1.54 -5.72 3.44 -2.93 1.83 -6.30 3.81 -7.55 4.40 -3.81 1.83 -18.62 10.41 -27.63 16.13 -1.54 0.88 -2.93 1.69 -3.15 1.69 -0.29 0 -1.83 0.95 -3.52 2.05 -2.57 1.69 -4.98 3.01 -7.92 4.32 -0.22 0.07 -11.80 -6.52 -25.65 -14.73z"/>
    <path d="M362.01 313.04 c-1.91 -1.17 -15.10 -9.02 -29.32 -17.30 -14.29 -8.36 -27.19 -15.98 -28.66 -16.93 l-2.79 -1.76 0 -68.02 0 -67.94 4.62 -2.71 c2.49 -1.54 6.01 -3.52 7.84 -4.47 1.83 -0.95 7.18 -4.10 11.95 -6.96 4.69 -2.93 8.80 -5.28 8.94 -5.28 0.37 0 10.77 -6.08 15.03 -8.80 0.59 -0.37 4.69 -2.71 9.02 -5.20 7.33 -4.18 8.14 -4.47 9.89 -3.59 2.05 0.88 21.92 12.46 49.25 28.59 8.65 5.13 21.84 12.83 29.32 17.15 7.48 4.32 14 8.28 14.51 8.80 0.81 0.81 -0.07 1.47 -4.40 3.74 -2.93 1.54 -5.86 3.22 -6.45 3.74 -1.69 1.39 -12.68 6.89 -13.93 6.89 -0.66 0 -1.76 -0.44 -2.57 -1.03 -0.81 -0.51 -14.29 -8.58 -30.05 -17.81 -15.69 -9.24 -29.98 -17.74 -31.74 -18.84 -6.08 -3.81 -5.64 -7.18 -5.86 43.17 -0.15 24.63 0 48.38 0.22 52.92 l0.51 8.21 22.79 13.41 c12.61 7.33 26.97 15.76 31.96 18.69 4.98 2.93 9.16 5.42 9.31 5.57 0.44 0.37 -7.26 5.42 -12.17 8.06 -2.20 1.17 -4.54 2.57 -5.13 3.08 -0.59 0.44 -2.05 1.39 -3.30 1.98 -3.01 1.54 -5.28 2.86 -8.80 5.06 -1.61 0.95 -3.74 2.20 -4.76 2.71 -4.18 2.05 -8.80 5.06 -10.77 6.96 -1.17 1.10 -2.64 1.98 -3.30 1.98 -1.61 0 -5.28 1.98 -6.82 3.66 -0.73 0.81 -1.76 1.47 -2.20 1.47 -0.51 0 -1.76 0.66 -2.79 1.47 -2.57 2.05 -5.42 1.83 -9.38 -0.66z"/>
  </g>
  <g fill="#0f1129">
    <path d="M341.48 360.32 c-21.48 -12.68 -59.08 -34.74 -84 -49.33 -4.03 -2.35 -6.82 -4.40 -6.82 -5.06 0 -0.73 0.44 -1.03 1.03 -0.81 0.51 0.22 2.79 -0.73 4.91 -2.05 2.20 -1.39 6.96 -4.25 10.70 -6.38 l6.67 -3.88 0 -63.03 c0 -63.25 -0.15 -70.36 -1.39 -69.56 -0.37 0.22 -0.51 0.66 -0.29 1.03 0.22 0.37 0 0.88 -0.44 1.10 -0.37 0.29 -0.59 0.95 -0.37 1.54 1.10 2.79 -2.20 4.40 -4.40 2.13 -0.66 -0.59 -1.47 -1.10 -1.91 -1.10 -0.44 0 -0.59 0.22 -0.37 0.51 0.88 0.81 -1.10 2.42 -3.08 2.42 -1.17 0 -2.27 0.59 -2.93 1.54 -0.66 1.17 -1.10 1.39 -1.54 0.66 -0.44 -0.73 -0.88 -0.73 -2.27 0 -1.76 0.95 -1.76 0.95 -0.37 -0.59 1.69 -1.91 17.37 -11.14 18.91 -11.14 1.83 0 2.05 6.74 2.05 71.98 l0 62.01 6.82 3.96 c79.09 46.40 83.48 48.96 84.88 48.96 0.66 0 4.25 -1.83 7.99 -4.10 3.81 -2.27 8.43 -4.98 10.41 -6.01 6.60 -3.66 7.55 -4.25 10.70 -6.23 1.76 -1.10 4.03 -2.35 5.13 -2.79 1.10 -0.44 4.10 -2.20 6.74 -3.88 2.64 -1.76 8.21 -5.13 12.46 -7.55 4.25 -2.42 11.36 -6.60 15.83 -9.24 4.54 -2.64 8.65 -4.91 9.16 -5.06 0.59 -0.07 3.59 -1.83 6.67 -3.88 l5.64 -3.66 0.07 -44.12 0 -44.20 2.79 -1.39 c1.47 -0.73 6.16 -3.44 10.33 -5.94 4.25 -2.49 8.58 -4.69 9.75 -4.91 l2.05 -0.37 0 57.90 0 57.98 -1.61 0.88 c-0.95 0.51 -3.96 2.35 -6.67 4.10 -2.79 1.83 -6.08 3.74 -7.33 4.32 -1.32 0.59 -3.30 1.69 -4.54 2.49 -1.17 0.73 -3.01 1.83 -4.03 2.42 -1.76 1.03 -22.94 13.27 -25.51 14.81 -0.66 0.44 -3.30 1.98 -5.72 3.52 -2.49 1.47 -4.69 2.71 -4.98 2.71 -0.22 0 -2.79 1.54 -5.72 3.44 -2.93 1.83 -6.30 3.81 -7.55 4.40 -3.81 1.83 -18.62 10.41 -27.63 16.13 -1.54 0.88 -2.93 1.69 -3.15 1.69 -0.29 0 -1.83 0.95 -3.52 2.05 -2.57 1.69 -4.98 3.01 -7.92 4.32 -0.22 0.07 -11.80 -6.52 -25.65 -14.73z m139.70 -163.74 c-0.15 -0.22 -0.73 0 -1.32 0.44 -0.51 0.44 -1.32 0.51 -1.98 0.15 -0.95 -0.59 -7.18 2.27 -15.03 6.82 l-2.93 1.76 -0.22 43.68 -0.15 43.61 7.40 4.32 c4.03 2.35 8.94 5.28 10.77 6.52 l3.44 2.27 0.22 -54.61 c0.07 -30.05 0 -54.75 -0.22 -54.97z"/>
    <path d="M354.02 308.28 c-6.23 -3.74 -20.23 -12.02 -31.15 -18.40 -10.85 -6.30 -20.08 -11.87 -20.52 -12.24 -0.51 -0.51 -0.44 -0.88 0.15 -1.10 0.44 -0.15 6.89 -3.88 14.29 -8.21 7.40 -4.32 21.04 -12.31 30.27 -17.66 9.31 -5.35 17.52 -10.11 18.25 -10.63 1.25 -0.73 4.84 1.17 27.49 14.51 14.37 8.43 28.95 17 32.54 18.98 3.52 2.05 6.38 3.74 6.38 3.88 0 0.37 -8.72 5.94 -12.46 7.92 -2.20 1.17 -4.54 2.57 -5.13 3.08 -0.59 0.44 -2.05 1.39 -3.30 1.98 -3.01 1.54 -5.28 2.86 -8.80 5.06 -1.61 0.95 -3.74 2.20 -4.76 2.71 -4.18 2.05 -8.80 5.06 -10.77 6.96 -1.17 1.10 -2.64 1.98 -3.30 1.98 -1.61 0 -5.28 1.98 -6.82 3.66 -0.73 0.81 -1.76 1.47 -2.20 1.47 -0.51 0 -1.76 0.66 -2.79 1.47 -3.15 2.49 -5.28 1.83 -17.37 -5.42z"/>
  </g>
  <g fill="#8ca3cc">
    <path d="M424.23 202.37 c-2.05 -1.83 -2.42 -2.64 -2.42 -5.42 0 -4.18 2.05 -7.11 5.94 -8.50 2.57 -0.88 3.22 -0.88 5.57 0.22 3.37 1.61 5.35 5.42 4.62 9.02 -1.25 6.60 -8.80 9.09 -13.71 4.69z"/>
    <path d="M453.70 193.35 c-4.54 -2.35 -6.60 -5.64 -6.60 -10.63 0 -7.48 3.52 -11.29 11.73 -12.75 10.70 -1.83 17.22 11.80 9.82 20.60 -3.81 4.47 -9.53 5.50 -14.95 2.79z"/>
    <path d="M491.08 180.60 c-6.16 -2.64 -9.53 -8.06 -9.53 -15.32 0 -10.41 7.33 -17.88 17.44 -17.96 9.68 0 16.27 6.67 16.27 16.49 0 7.18 -3.81 13.12 -10.41 16.56 -3.30 1.69 -10.11 1.83 -13.78 0.22z"/>
  </g>
</svg>
```

- [ ] **Step 3: Replace `public/apple-touch-icon.svg`**

Same SVG as favicon, but wrapped with a white background (Apple guidelines want solid bg). Replace contents with:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="180" height="180">
  <rect width="180" height="180" fill="#FFFFFF" rx="36" />
  <g transform="translate(26,22) scale(0.4)">
    <svg viewBox="220 130 320 280" width="320" height="280">
      <g fill="#3859a8"><path d="M341.48 360.32 c-21.48 -12.68 -59.08 -34.74 -84 -49.33 l-6.82 -3.96 0 -67.36 0 -67.36 3.15 -2.49 c3.44 -2.79 17.52 -11.07 20.08 -11.87 l1.69 -0.44 0 67.36 0 67.43 6.82 3.96 c79.09 46.40 83.48 48.96 84.88 48.96 0.66 0 4.25 -1.83 7.99 -4.10 3.81 -2.27 8.43 -4.98 10.41 -6.01 6.60 -3.66 7.55 -4.25 10.70 -6.23 1.76 -1.10 4.03 -2.35 5.13 -2.79 1.10 -0.44 4.10 -2.20 6.74 -3.88 2.64 -1.76 8.21 -5.13 12.46 -7.55 4.25 -2.42 11.36 -6.60 15.83 -9.24 4.54 -2.64 8.65 -4.91 9.16 -5.06 0.59 -0.07 3.59 -1.83 6.67 -3.88 l5.64 -3.66 0.07 -44.12 0 -44.20 2.79 -1.39 c1.47 -0.73 6.16 -3.44 10.33 -5.94 4.25 -2.49 8.58 -4.69 9.75 -4.91 l2.05 -0.37 0 57.90 0 57.98 -1.61 0.88 c-0.95 0.51 -3.96 2.35 -6.67 4.10 -2.79 1.83 -6.08 3.74 -7.33 4.32 -1.32 0.59 -3.30 1.69 -4.54 2.49 -1.17 0.73 -3.01 1.83 -4.03 2.42 -1.76 1.03 -22.94 13.27 -25.51 14.81 -0.66 0.44 -3.30 1.98 -5.72 3.52 -2.49 1.47 -4.69 2.71 -4.98 2.71 -0.22 0 -2.79 1.54 -5.72 3.44 -2.93 1.83 -6.30 3.81 -7.55 4.40 -3.81 1.83 -18.62 10.41 -27.63 16.13 -1.54 0.88 -2.93 1.69 -3.15 1.69 -0.29 0 -1.83 0.95 -3.52 2.05 -2.57 1.69 -4.98 3.01 -7.92 4.32 -0.22 0.07 -11.80 -6.52 -25.65 -14.73z"/><path d="M362.01 313.04 c-1.91 -1.17 -15.10 -9.02 -29.32 -17.30 -14.29 -8.36 -27.19 -15.98 -28.66 -16.93 l-2.79 -1.76 0 -68.02 0 -67.94 4.62 -2.71 c2.49 -1.54 6.01 -3.52 7.84 -4.47 1.83 -0.95 7.18 -4.10 11.95 -6.96 4.69 -2.93 8.80 -5.28 8.94 -5.28 0.37 0 10.77 -6.08 15.03 -8.80 0.59 -0.37 4.69 -2.71 9.02 -5.20 7.33 -4.18 8.14 -4.47 9.89 -3.59 2.05 0.88 21.92 12.46 49.25 28.59 8.65 5.13 21.84 12.83 29.32 17.15 7.48 4.32 14 8.28 14.51 8.80 0.81 0.81 -0.07 1.47 -4.40 3.74 -2.93 1.54 -5.86 3.22 -6.45 3.74 -1.69 1.39 -12.68 6.89 -13.93 6.89 -0.66 0 -1.76 -0.44 -2.57 -1.03 -0.81 -0.51 -14.29 -8.58 -30.05 -17.81 -15.69 -9.24 -29.98 -17.74 -31.74 -18.84 -6.08 -3.81 -5.64 -7.18 -5.86 43.17 -0.15 24.63 0 48.38 0.22 52.92 l0.51 8.21 22.79 13.41 c12.61 7.33 26.97 15.76 31.96 18.69 4.98 2.93 9.16 5.42 9.31 5.57 0.44 0.37 -7.26 5.42 -12.17 8.06 -2.20 1.17 -4.54 2.57 -5.13 3.08 -0.59 0.44 -2.05 1.39 -3.30 1.98 -3.01 1.54 -5.28 2.86 -8.80 5.06 -1.61 0.95 -3.74 2.20 -4.76 2.71 -4.18 2.05 -8.80 5.06 -10.77 6.96 -1.17 1.10 -2.64 1.98 -3.30 1.98 -1.61 0 -5.28 1.98 -6.82 3.66 -0.73 0.81 -1.76 1.47 -2.20 1.47 -0.51 0 -1.76 0.66 -2.79 1.47 -2.57 2.05 -5.42 1.83 -9.38 -0.66z"/></g>
      <g fill="#0f1129"><path d="M341.48 360.32 c-21.48 -12.68 -59.08 -34.74 -84 -49.33 -4.03 -2.35 -6.82 -4.40 -6.82 -5.06 0 -0.73 0.44 -1.03 1.03 -0.81 0.51 0.22 2.79 -0.73 4.91 -2.05 2.20 -1.39 6.96 -4.25 10.70 -6.38 l6.67 -3.88 0 -63.03 c0 -63.25 -0.15 -70.36 -1.39 -69.56 -0.37 0.22 -0.51 0.66 -0.29 1.03 0.22 0.37 0 0.88 -0.44 1.10 -0.37 0.29 -0.59 0.95 -0.37 1.54 1.10 2.79 -2.20 4.40 -4.40 2.13 -0.66 -0.59 -1.47 -1.10 -1.91 -1.10 -0.44 0 -0.59 0.22 -0.37 0.51 0.88 0.81 -1.10 2.42 -3.08 2.42 -1.17 0 -2.27 0.59 -2.93 1.54 -0.66 1.17 -1.10 1.39 -1.54 0.66 -0.44 -0.73 -0.88 -0.73 -2.27 0 -1.76 0.95 -1.76 0.95 -0.37 -0.59 1.69 -1.91 17.37 -11.14 18.91 -11.14 1.83 0 2.05 6.74 2.05 71.98 l0 62.01 6.82 3.96 c79.09 46.40 83.48 48.96 84.88 48.96 0.66 0 4.25 -1.83 7.99 -4.10 3.81 -2.27 8.43 -4.98 10.41 -6.01 6.60 -3.66 7.55 -4.25 10.70 -6.23 1.76 -1.10 4.03 -2.35 5.13 -2.79 1.10 -0.44 4.10 -2.20 6.74 -3.88 2.64 -1.76 8.21 -5.13 12.46 -7.55 4.25 -2.42 11.36 -6.60 15.83 -9.24 4.54 -2.64 8.65 -4.91 9.16 -5.06 0.59 -0.07 3.59 -1.83 6.67 -3.88 l5.64 -3.66 0.07 -44.12 0 -44.20 2.79 -1.39 c1.47 -0.73 6.16 -3.44 10.33 -5.94 4.25 -2.49 8.58 -4.69 9.75 -4.91 l2.05 -0.37 0 57.90 0 57.98 -1.61 0.88 c-0.95 0.51 -3.96 2.35 -6.67 4.10 -2.79 1.83 -6.08 3.74 -7.33 4.32 -1.32 0.59 -3.30 1.69 -4.54 2.49 -1.17 0.73 -3.01 1.83 -4.03 2.42 -1.76 1.03 -22.94 13.27 -25.51 14.81 -0.66 0.44 -3.30 1.98 -5.72 3.52 -2.49 1.47 -4.69 2.71 -4.98 2.71 -0.22 0 -2.79 1.54 -5.72 3.44 -2.93 1.83 -6.30 3.81 -7.55 4.40 -3.81 1.83 -18.62 10.41 -27.63 16.13 -1.54 0.88 -2.93 1.69 -3.15 1.69 -0.29 0 -1.83 0.95 -3.52 2.05 -2.57 1.69 -4.98 3.01 -7.92 4.32 -0.22 0.07 -11.80 -6.52 -25.65 -14.73z m139.70 -163.74 c-0.15 -0.22 -0.73 0 -1.32 0.44 -0.51 0.44 -1.32 0.51 -1.98 0.15 -0.95 -0.59 -7.18 2.27 -15.03 6.82 l-2.93 1.76 -0.22 43.68 -0.15 43.61 7.40 4.32 c4.03 2.35 8.94 5.28 10.77 6.52 l3.44 2.27 0.22 -54.61 c0.07 -30.05 0 -54.75 -0.22 -54.97z"/><path d="M354.02 308.28 c-6.23 -3.74 -20.23 -12.02 -31.15 -18.40 -10.85 -6.30 -20.08 -11.87 -20.52 -12.24 -0.51 -0.51 -0.44 -0.88 0.15 -1.10 0.44 -0.15 6.89 -3.88 14.29 -8.21 7.40 -4.32 21.04 -12.31 30.27 -17.66 9.31 -5.35 17.52 -10.11 18.25 -10.63 1.25 -0.73 4.84 1.17 27.49 14.51 14.37 8.43 28.95 17 32.54 18.98 3.52 2.05 6.38 3.74 6.38 3.88 0 0.37 -8.72 5.94 -12.46 7.92 -2.20 1.17 -4.54 2.57 -5.13 3.08 -0.59 0.44 -2.05 1.39 -3.30 1.98 -3.01 1.54 -5.28 2.86 -8.80 5.06 -1.61 0.95 -3.74 2.20 -4.76 2.71 -4.18 2.05 -8.80 5.06 -10.77 6.96 -1.17 1.10 -2.64 1.98 -3.30 1.98 -1.61 0 -5.28 1.98 -6.82 3.66 -0.73 0.81 -1.76 1.47 -2.20 1.47 -0.51 0 -1.76 0.66 -2.79 1.47 -3.15 2.49 -5.28 1.83 -17.37 -5.42z"/></g>
      <g fill="#8ca3cc"><path d="M424.23 202.37 c-2.05 -1.83 -2.42 -2.64 -2.42 -5.42 0 -4.18 2.05 -7.11 5.94 -8.50 2.57 -0.88 3.22 -0.88 5.57 0.22 3.37 1.61 5.35 5.42 4.62 9.02 -1.25 6.60 -8.80 9.09 -13.71 4.69z"/><path d="M453.70 193.35 c-4.54 -2.35 -6.60 -5.64 -6.60 -10.63 0 -7.48 3.52 -11.29 11.73 -12.75 10.70 -1.83 17.22 11.80 9.82 20.60 -3.81 4.47 -9.53 5.50 -14.95 2.79z"/><path d="M491.08 180.60 c-6.16 -2.64 -9.53 -8.06 -9.53 -15.32 0 -10.41 7.33 -17.88 17.44 -17.96 9.68 0 16.27 6.67 16.27 16.49 0 7.18 -3.81 13.12 -10.41 16.56 -3.30 1.69 -10.11 1.83 -13.78 0.22z"/></g>
    </svg>
  </g>
</svg>
```

- [ ] **Step 4: Update `public/manifest.json`**

Replace the entire contents of `public/manifest.json` with:

```json
{
  "name": "JotilLabs",
  "short_name": "JotilLabs",
  "description": "AI-first customer platform — Automate. Empower. Scale.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FAFBFD",
  "theme_color": "#3859a8",
  "icons": [
    {
      "src": "/favicon.svg",
      "type": "image/svg+xml",
      "sizes": "any"
    },
    {
      "src": "/apple-touch-icon.svg",
      "type": "image/svg+xml",
      "sizes": "180x180",
      "purpose": "any maskable"
    }
  ]
}
```

- [ ] **Step 5: Build + dev smoke**

Run: `npm run build`
Expected: clean build.

Run: `npm run dev`
Visit `http://localhost:3000/`. Visual check:
- Nav logo visible with royal-blue hex + navy bottom depth + heartbeat dots
- Wordmark reads "JotilLabs" in Montserrat Alternates (not "Jotil Labs" in Outfit)
- Browser tab favicon updated (may require hard refresh)

Kill dev server.

- [ ] **Step 6: Commit**

```bash
git add components/ui/Logo.jsx public/favicon.svg public/apple-touch-icon.svg public/manifest.json
git commit -m "feat(logo): rebuild Logo component with new palette, wordmark, tones"
```

---

## Task 4: Rename "Jotil Labs" → "JotilLabs" across brand surfaces (skip legal bodies)

**Files:** see 6.1 of spec. Legal-page bodies (`app/terms/page.jsx`, `app/privacy/page.jsx`, `app/opt-in/page.jsx` body copy) are handled in Task 5.

- [ ] **Step 1: Rename in `app/layout.jsx` metadata**

Modify `app/layout.jsx`:

```jsx
// Replace metadata block (lines 33-86)
export const metadata = {
  title: {
    default: 'JotilLabs — AI Voice, Chat & Automation Platform',
    template: '%s | JotilLabs',
  },
  description:
    'JotilLabs builds AI systems that handle your calls, chats, leads, and workflows. Voice agents, chatbots, SMS automation, and CRM tools for modern businesses.',
  metadataBase: new URL('https://www.jotillabs.com'),
  keywords: [
    'AI voice agent',
    'AI chatbot',
    'business automation',
    'AI receptionist',
    'SMS automation',
    'JotilLabs',
    'AI CRM',
    'workflow automation',
  ],
  authors: [{ name: 'JotilLabs' }],
  creator: 'JotilLabs',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.jotillabs.com',
    siteName: 'JotilLabs',
    title: 'JotilLabs — AI Voice, Chat & Automation Platform',
    description:
      'AI systems that handle your calls, chats, leads, and workflows. Built for modern businesses.',
    images: [{ url: '/og', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JotilLabs — AI Voice, Chat & Automation Platform',
    description:
      'AI systems that handle your calls, chats, leads, and workflows.',
    images: ['/og'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.svg',
  },
  manifest: '/manifest.json',
}
```

- [ ] **Step 2: Rewrite `components/layout/JsonLd.jsx` using `brand`**

Replace entire contents of `components/layout/JsonLd.jsx`:

```jsx
import { brand } from '@/lib/brand'

export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.name,
    legalName: brand.legalName,
    url: brand.url,
    logo: `${brand.url}/favicon.svg`,
    description:
      'AI-powered business automation. Voice agents, chatbots, SMS automation, CRM, and workflow tools for modern businesses.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: brand.address.city,
      addressRegion: brand.address.stateCode,
      addressCountry: brand.address.country,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-358-900-0040',
      email: brand.email,
      contactType: 'sales',
    },
    sameAs: [
      brand.social.linkedin,
      brand.social.x,
    ],
    foundingDate: String(brand.founded),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function WebsiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: brand.name,
    url: brand.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${brand.url}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

- [ ] **Step 3: Sed-rename non-legal pages**

For each of the following files, replace `"Jotil Labs"` with `"JotilLabs"` (do this manually via editor find/replace, confirming each hit):

Files to modify (exclude `app/terms/page.jsx`, `app/privacy/page.jsx`, `app/opt-in/page.jsx` — handled in Task 5):

```
app/page.jsx
app/not-found.jsx
app/sitemap.js
app/og/route.jsx   (revised fully in Task 6)
app/about/page.jsx (also handle founding year — see step 4)
app/products/page.jsx
app/blog/page.jsx
app/blog/[slug]/page.jsx
app/contact/page.jsx
app/consultancy/page.jsx
app/custom-development/page.jsx
app/use-cases/page.jsx
app/design/icons/page.jsx
app/api/contact/route.js
components/sections/ContactForm.jsx
content/blog/ai-voice-agents-transform-business-calls.mdx
content/blog/complete-guide-sms-automation-small-business.mdx
```

Command to preview every hit outside legal files:

```bash
grep -rn "Jotil Labs" \
  --include='*.jsx' --include='*.js' --include='*.mdx' \
  app/ components/ content/ \
  | grep -v "app/terms/" | grep -v "app/privacy/" | grep -v "app/opt-in/" | grep -v "components/sections/OptInForm.jsx"
```

Run that, then for each line shown, open the file and rename. Alternatively use this safe macOS sed command (it excludes the legal files):

```bash
find app components content \
  -type f \( -name '*.jsx' -o -name '*.js' -o -name '*.mdx' \) \
  -not -path '*/terms/*' -not -path '*/privacy/*' -not -path '*/opt-in/*' \
  -not -name 'OptInForm.jsx' \
  -exec sed -i '' 's/Jotil Labs/JotilLabs/g' {} +
```

- [ ] **Step 4: Update founding year in `app/about/page.jsx`**

In `app/about/page.jsx`:
- Line 105: change `"JotilLabs was founded in 2024"` → `"JotilLabs was founded in 2026"`
- Line 203: change `<p className="text-2xl font-bold text-text tracking-tight">2024</p>` → `<p className="text-2xl font-bold text-text tracking-tight">2026</p>`

- [ ] **Step 5: Update `components/sections/OptInForm.jsx`**

This file is OUTSIDE the legal-pages directory but its copy is still part of consent language. Keep references inside quoted consent text as `Jotil Labs LLC` (matching legal entity), not `JotilLabs`. Open the file and change each "Jotil Labs" occurrence to "Jotil Labs LLC" (preserving the two-word legal form).

Preview: `grep -n "Jotil Labs" components/sections/OptInForm.jsx`

Manually edit each line to read "Jotil Labs LLC" (only adding "LLC"; text remains two-word).

- [ ] **Step 6: Verify no unintentional matches remain**

Run:
```bash
grep -rn "Jotil Labs" \
  --include='*.jsx' --include='*.js' --include='*.mdx' --include='*.json' \
  app/ components/ content/ public/ \
  | grep -v "app/terms/" | grep -v "app/privacy/" | grep -v "app/opt-in/"
```
Expected: only matches in `components/sections/OptInForm.jsx` with form `Jotil Labs LLC` (OK — legal entity preserved).

- [ ] **Step 7: Build + dev smoke**

Run: `npm run build`
Expected: clean build.

Run: `npm run dev` → visit `/`, `/about`, `/contact`, `/products`, `/blog`. Look for rendered "JotilLabs" text; confirm no rendered "Jotil Labs" on non-legal pages.

Kill dev server.

- [ ] **Step 8: Commit**

```bash
git add app/ components/ content/
git commit -m "chore(copy): rename Jotil Labs -> JotilLabs across brand surfaces"
```

---

## Task 5: Legal pages — metadata only, preserve bodies

**Files:**
- Modify: `app/terms/page.jsx` (metadata description only)
- Modify: `app/privacy/page.jsx` (metadata description only)
- Modify: `app/opt-in/page.jsx` (metadata description + one line of intro)

- [ ] **Step 1: `app/terms/page.jsx` — metadata only**

Open `app/terms/page.jsx`. In the `metadata` export near line 6, change:
```jsx
description: 'Terms and Conditions for Jotil Labs AI-powered communication services...'
```
to:
```jsx
description: 'Terms and Conditions for JotilLabs AI-powered communication services, including TCPA compliance and AI disclosure.'
```

Do NOT modify any other line. Body text at lines 57, 59, 77, 126, 201, 263 (all "Jotil Labs") **stays unchanged** — this is the legal entity name customers consented to.

- [ ] **Step 2: `app/privacy/page.jsx` — metadata only**

Open `app/privacy/page.jsx`. Change the metadata description:
```jsx
description: 'Privacy Policy for Jotil Labs — how we collect...'
```
to:
```jsx
description: 'Privacy Policy for JotilLabs — how we collect, use, and protect your data across AI voice, chat, and SMS services.'
```

Body "Jotil Labs" references (lines 47, 159) stay unchanged.

- [ ] **Step 3: `app/opt-in/page.jsx` — metadata + intro only**

Open `app/opt-in/page.jsx`.

Change metadata description (line 7):
```jsx
description: 'Provide your consent to receive AI-powered communications from Jotil Labs, including voice calls, SMS, and chat messages. TCPA-compliant opt-in form.'
```
to:
```jsx
description: 'Provide your consent to receive AI-powered communications from JotilLabs, including voice calls, SMS, and chat messages. TCPA-compliant opt-in form.'
```

Line 36 is a page intro (not consent legal text):
```jsx
from Jotil Labs. Please review each section carefully.
```
Change to:
```jsx
from JotilLabs. Please review each section carefully.
```

All other references (inside the consent text blocks) stay `Jotil Labs` or `Jotil Labs LLC` — do NOT touch.

- [ ] **Step 4: Diff check legal bodies unchanged**

Run:
```bash
git diff app/terms/page.jsx | grep -E "^[+-]" | grep -v "^[+-]{3}" | grep -v "description:"
```
Expected: empty (only the description line changed).

Same for `app/privacy/page.jsx` and `app/opt-in/page.jsx` (opt-in will also show the intro line change):
```bash
git diff app/privacy/page.jsx | grep -E "^[+-]" | grep -v "^[+-]{3}" | grep -v "description:"
git diff app/opt-in/page.jsx | grep -E "^[+-]" | grep -v "^[+-]{3}" | grep -v "description:" | grep -v "JotilLabs. Please review"
```

- [ ] **Step 5: Build + dev smoke**

Run: `npm run build`
Expected: clean build.

Run: `npm run dev` → visit `/terms`, `/privacy`, `/opt-in`. Read body text; confirm "Jotil Labs" still appears where customers consented to it.

Kill dev server.

- [ ] **Step 6: Commit**

```bash
git add app/terms/page.jsx app/privacy/page.jsx app/opt-in/page.jsx
git commit -m "chore(legal): update wordmark on legal pages, preserve legal-entity body"
```

---

## Task 6: Tagline + Footer + OG image

**Files:**
- Modify: `components/layout/Footer.jsx` (use `brand` constants, add tagline, update gradient line)
- Modify: `app/og/route.jsx` (full rebuild with new palette, new wordmark, tagline)
- Modify: `components/sections/Hero.jsx` (change eyebrow text to tagline)

- [ ] **Step 1: Rewrite Footer**

Replace entire contents of `components/layout/Footer.jsx`:

```jsx
import Link from 'next/link'
import Logo from '@/components/ui/Logo'
import { products } from '@/data/products'
import { brand, copyrightLine } from '@/lib/brand'

const PRODUCT_LINKS = products.map((p) => ({
  label: p.shortName,
  to: `/products/${p.slug}`,
}))

const COMPANY_LINKS = [
  { label: 'About', to: '/about' },
  { label: 'Industries', to: '/use-cases' },
  { label: 'Blog', to: '/blog' },
  { label: 'Consultancy', to: '/consultancy' },
  { label: 'Custom Development', to: '/custom-development' },
  { label: 'Contact', to: '/contact' },
]

const LEGAL_LINKS = [
  { label: 'Terms & Conditions', to: '/terms' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Opt-In Consent', to: '/opt-in' },
]

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="font-display text-sm font-semibold text-white mb-5">
        {title}
      </h4>
      <ul className="space-y-3 list-none p-0 m-0">
        {links.map(({ label, to }) => (
          <li key={label}>
            <Link
              href={to}
              className="text-sm text-slate-400 no-underline hover:text-white transition-colors duration-200"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="bg-navy text-white relative">
      <div
        className="h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, #3859a8, #22D3EE, #3859a8, transparent)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="mb-3 flex items-center gap-2">
              <Logo size="sm" tone="on-dark" />
              <span className="font-display text-xl font-bold tracking-[-0.5px] leading-none">
                <span className="text-white">Jotil</span>
                <span className="text-[color:var(--color-logo-muted)]">Labs</span>
              </span>
            </div>
            <p className="font-display text-[10px] font-semibold tracking-[0.25em] uppercase text-[color:var(--color-logo-muted)]/70 mb-5">
              {brand.tagline}
            </p>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs mb-8">
              The AI-first customer platform. We help businesses answer every
              call, handle every conversation, and grow without adding
              headcount.
            </p>

            <div className="space-y-2 mb-6">
              <p className="text-sm text-slate-400">
                <a
                  href={`mailto:${brand.email}`}
                  className="no-underline text-slate-400 hover:text-white transition-colors"
                >
                  {brand.email}
                </a>
              </p>
              <p className="text-sm text-slate-400">
                <a
                  href={brand.phoneHref}
                  className="no-underline text-slate-400 hover:text-white transition-colors"
                >
                  {brand.phone}
                </a>
              </p>
              <p className="text-sm text-slate-400">{brand.address.city}, {brand.address.state}</p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={brand.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-[10px] bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200 no-underline"
                aria-label="LinkedIn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href={brand.social.x}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-[10px] bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200 no-underline"
                aria-label="X (Twitter)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={brand.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-[10px] bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200 no-underline"
                aria-label="YouTube"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                  <path d="m10 15 5-3-5-3z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 lg:col-start-6">
            <FooterColumn title="Solutions" links={PRODUCT_LINKS} />
          </div>
          <div className="lg:col-span-2">
            <FooterColumn title="Company" links={COMPANY_LINKS} />
          </div>
          <div className="lg:col-span-2">
            <FooterColumn title="Legal" links={LEGAL_LINKS} />
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            {copyrightLine()}
          </p>
          <p className="text-xs text-slate-500">
            Built with AI-first principles.
          </p>
        </div>
      </div>
    </footer>
  )
}
```

Note: `bg-dark` → `bg-navy` (per Task 2 token rename). Hardcoded gradient hex updated from `#3B7BF2, #6366F1, #0EA5E9` → `#3859a8, #22D3EE, #3859a8`. © line now uses `copyrightLine()` which outputs "© 2026 Jotil Labs LLC. All rights reserved."

- [ ] **Step 2: Rewrite `app/og/route.jsx`**

Replace entire contents of `app/og/route.jsx`:

```jsx
import { ImageResponse } from 'next/og'
import { brand } from '@/lib/brand'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #3859a8 0%, #0f1129 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Hex mark — inlined SVG using same paths as Logo component */}
        <svg
          width="128"
          height="128"
          viewBox="220 130 320 280"
          style={{ marginBottom: 40 }}
        >
          <g fill="#ffffff">
            <path d="M341.48 360.32 c-21.48 -12.68 -59.08 -34.74 -84 -49.33 l-6.82 -3.96 0 -67.36 0 -67.36 3.15 -2.49 c3.44 -2.79 17.52 -11.07 20.08 -11.87 l1.69 -0.44 0 67.36 0 67.43 6.82 3.96 c79.09 46.40 83.48 48.96 84.88 48.96 0.66 0 4.25 -1.83 7.99 -4.10 3.81 -2.27 8.43 -4.98 10.41 -6.01 6.60 -3.66 7.55 -4.25 10.70 -6.23 1.76 -1.10 4.03 -2.35 5.13 -2.79 1.10 -0.44 4.10 -2.20 6.74 -3.88 2.64 -1.76 8.21 -5.13 12.46 -7.55 4.25 -2.42 11.36 -6.60 15.83 -9.24 4.54 -2.64 8.65 -4.91 9.16 -5.06 0.59 -0.07 3.59 -1.83 6.67 -3.88 l5.64 -3.66 0.07 -44.12 0 -44.20 2.79 -1.39 c1.47 -0.73 6.16 -3.44 10.33 -5.94 4.25 -2.49 8.58 -4.69 9.75 -4.91 l2.05 -0.37 0 57.90 0 57.98 -1.61 0.88 c-0.95 0.51 -3.96 2.35 -6.67 4.10 -2.79 1.83 -6.08 3.74 -7.33 4.32 -1.32 0.59 -3.30 1.69 -4.54 2.49 -1.17 0.73 -3.01 1.83 -4.03 2.42 -1.76 1.03 -22.94 13.27 -25.51 14.81 -0.66 0.44 -3.30 1.98 -5.72 3.52 -2.49 1.47 -4.69 2.71 -4.98 2.71 -0.22 0 -2.79 1.54 -5.72 3.44 -2.93 1.83 -6.30 3.81 -7.55 4.40 -3.81 1.83 -18.62 10.41 -27.63 16.13 -1.54 0.88 -2.93 1.69 -3.15 1.69 -0.29 0 -1.83 0.95 -3.52 2.05 -2.57 1.69 -4.98 3.01 -7.92 4.32 -0.22 0.07 -11.80 -6.52 -25.65 -14.73z" />
            <path d="M362.01 313.04 c-1.91 -1.17 -15.10 -9.02 -29.32 -17.30 -14.29 -8.36 -27.19 -15.98 -28.66 -16.93 l-2.79 -1.76 0 -68.02 0 -67.94 4.62 -2.71 c2.49 -1.54 6.01 -3.52 7.84 -4.47 1.83 -0.95 7.18 -4.10 11.95 -6.96 4.69 -2.93 8.80 -5.28 8.94 -5.28 0.37 0 10.77 -6.08 15.03 -8.80 0.59 -0.37 4.69 -2.71 9.02 -5.20 7.33 -4.18 8.14 -4.47 9.89 -3.59 2.05 0.88 21.92 12.46 49.25 28.59 8.65 5.13 21.84 12.83 29.32 17.15 7.48 4.32 14 8.28 14.51 8.80 0.81 0.81 -0.07 1.47 -4.40 3.74 -2.93 1.54 -5.86 3.22 -6.45 3.74 -1.69 1.39 -12.68 6.89 -13.93 6.89 -0.66 0 -1.76 -0.44 -2.57 -1.03 -0.81 -0.51 -14.29 -8.58 -30.05 -17.81 -15.69 -9.24 -29.98 -17.74 -31.74 -18.84 -6.08 -3.81 -5.64 -7.18 -5.86 43.17 -0.15 24.63 0 48.38 0.22 52.92 l0.51 8.21 22.79 13.41 c12.61 7.33 26.97 15.76 31.96 18.69 4.98 2.93 9.16 5.42 9.31 5.57 0.44 0.37 -7.26 5.42 -12.17 8.06 -2.20 1.17 -4.54 2.57 -5.13 3.08 -0.59 0.44 -2.05 1.39 -3.30 1.98 -3.01 1.54 -5.28 2.86 -8.80 5.06 -1.61 0.95 -3.74 2.20 -4.76 2.71 -4.18 2.05 -8.80 5.06 -10.77 6.96 -1.17 1.10 -2.64 1.98 -3.30 1.98 -1.61 0 -5.28 1.98 -6.82 3.66 -0.73 0.81 -1.76 1.47 -2.20 1.47 -0.51 0 -1.76 0.66 -2.79 1.47 -2.57 2.05 -5.42 1.83 -9.38 -0.66z" />
          </g>
          <g fill="#8ca3cc">
            <path d="M424.23 202.37 c-2.05 -1.83 -2.42 -2.64 -2.42 -5.42 0 -4.18 2.05 -7.11 5.94 -8.50 2.57 -0.88 3.22 -0.88 5.57 0.22 3.37 1.61 5.35 5.42 4.62 9.02 -1.25 6.60 -8.80 9.09 -13.71 4.69z" />
            <path d="M453.70 193.35 c-4.54 -2.35 -6.60 -5.64 -6.60 -10.63 0 -7.48 3.52 -11.29 11.73 -12.75 10.70 -1.83 17.22 11.80 9.82 20.60 -3.81 4.47 -9.53 5.50 -14.95 2.79z" />
            <path d="M491.08 180.60 c-6.16 -2.64 -9.53 -8.06 -9.53 -15.32 0 -10.41 7.33 -17.88 17.44 -17.96 9.68 0 16.27 6.67 16.27 16.49 0 7.18 -3.81 13.12 -10.41 16.56 -3.30 1.69 -10.11 1.83 -13.78 0.22z" />
          </g>
        </svg>

        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            letterSpacing: '-2px',
            lineHeight: 1,
            marginBottom: 24,
            display: 'flex',
          }}
        >
          <span style={{ color: '#ffffff' }}>Jotil</span>
          <span style={{ color: '#8ca3cc' }}>Labs</span>
        </div>

        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: '#8ca3cc',
            letterSpacing: '6px',
            textTransform: 'uppercase',
          }}
        >
          {brand.tagline}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
```

- [ ] **Step 3: Update Hero eyebrow in `components/sections/Hero.jsx`**

Open `components/sections/Hero.jsx`. Find lines 121-123:

```jsx
<span className="text-[11px] font-semibold text-primary tracking-[0.08em] uppercase" style={{ fontFamily: 'var(--font-outfit), Outfit, sans-serif' }}>
  The AI-First Customer Platform
</span>
```

Replace with:

```jsx
<span className="text-[11px] font-semibold text-primary tracking-[0.25em] uppercase font-display">
  Automate. Empower. Scale.
</span>
```

Changes: text replaced with brand tagline; tracking widened from `0.08em` to `0.25em` (matches the wordmark lockup); `font-display` class replaces inline Outfit font style.

- [ ] **Step 4: Build + dev smoke + OG test**

Run: `npm run build`
Expected: clean build.

Run: `npm run dev`. Visit:
- `/` — footer shows "Automate. Empower. Scale." eyebrow above description; © line reads "© 2026 Jotil Labs LLC. All rights reserved."; hero eyebrow reads "AUTOMATE. EMPOWER. SCALE."
- `/og` — OG image renders with white hex logo, gradient bg, wordmark, tagline

Kill dev server.

- [ ] **Step 5: Commit**

```bash
git add components/layout/Footer.jsx app/og/route.jsx components/sections/Hero.jsx
git commit -m "feat(brand): add tagline to footer + OG + hero eyebrow"
```

---

## Task 7: Playwright visual regression

**Files:**
- Create: `playwright.config.js`
- Create: `tests/brand.spec.js`
- Modify: `package.json` (add `test:visual` script + `@playwright/test` devDep)
- Create: `.github/workflows/visual-tests.yml` (or extend existing CI — see Step 7)

- [ ] **Step 1: Install Playwright**

Run:
```bash
npm install --save-dev @playwright/test
npx playwright install chromium
```
Expected: Chromium downloads; `@playwright/test` appears in `devDependencies` of `package.json`.

- [ ] **Step 2: Add test script to `package.json`**

Open `package.json`. In `"scripts"`, add:

```json
"test:visual": "playwright test",
"test:visual:update": "playwright test --update-snapshots"
```

- [ ] **Step 3: Create `playwright.config.js`**

Create `playwright.config.js` at repo root:

```js
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01, // 1% threshold
    },
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'] },
    },
  ],
  webServer: {
    command: 'npm run build && npm run start',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
```

- [ ] **Step 4: Create `tests/brand.spec.js`**

Create `tests/brand.spec.js`:

```js
import { test, expect } from '@playwright/test'

const routes = ['/', '/about', '/products', '/contact', '/terms']

for (const route of routes) {
  test(`visual — ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'networkidle' })
    // Hide animated elements to reduce flakiness (heartbeat dots, orbs, waveform)
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
        }
      `,
    })
    await page.waitForTimeout(300)
    await expect(page).toHaveScreenshot({ fullPage: true })
  })
}

test('logo renders at all sizes', async ({ page }) => {
  await page.setContent(`
    <html>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat+Alternates:wght@700&display=swap" rel="stylesheet" />
      <style>
        body { margin: 0; padding: 24px; background: #FAFBFD; display: flex; gap: 24px; align-items: center; font-family: 'Montserrat Alternates', sans-serif; }
        .row { display: flex; flex-direction: column; gap: 6px; align-items: center; font-size: 10px; color: #6b7098; }
      </style>
    </head>
    <body>
      ${[24, 32, 40, 56, 72].map(s => `
        <div class="row">
          <img src="http://localhost:3000/favicon.svg" width="${s}" height="${s}" />
          <span>${s}px</span>
        </div>
      `).join('')}
    </body>
    </html>
  `)
  await expect(page).toHaveScreenshot('logo-sizes.png')
})

test('favicon accessible', async ({ request }) => {
  const res = await request.get('/favicon.svg')
  expect(res.status()).toBe(200)
  expect(res.headers()['content-type']).toContain('image/svg')
})

test('og image generates', async ({ request }) => {
  const res = await request.get('/og')
  expect(res.status()).toBe(200)
  expect(res.headers()['content-type']).toContain('image/png')
})

test('legal entity preserved on terms page', async ({ page }) => {
  await page.goto('/terms')
  const body = await page.locator('main').textContent()
  expect(body).toContain('Jotil Labs') // legal entity preserved in body
  expect(body).not.toContain('JotilLabs') // brand name NOT substituted in body text
})

test('legal entity preserved on privacy page', async ({ page }) => {
  await page.goto('/privacy')
  const body = await page.locator('main').textContent()
  expect(body).toContain('Jotil Labs')
  expect(body).not.toContain('JotilLabs')
})
```

- [ ] **Step 5: Generate initial snapshots**

Run:
```bash
npm run build
npm run test:visual:update
```
Expected: tests run, snapshots saved to `tests/brand.spec.js-snapshots/`. First run generates baselines; no failures because no comparison yet.

- [ ] **Step 6: Run tests to confirm baseline passes**

Run: `npm run test:visual`
Expected: all tests pass (snapshots match the baselines just generated).

- [ ] **Step 7: Add CI step (if `.github/workflows/` exists)**

Check for existing workflow:
```bash
ls .github/workflows/ 2>/dev/null
```

If there's an existing workflow (e.g. `ci.yml`), open it and add a step after `npm run lint`:

```yaml
      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Visual regression
        run: npm run test:visual
```

If no workflow exists, create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium
      - run: npm run test:visual
```

- [ ] **Step 8: Commit**

```bash
git add playwright.config.js tests/ package.json package-lock.json .github/workflows/
git commit -m "test(brand): add Playwright visual regression snapshots"
```

---

## Task 8: Update `CLAUDE.md` + `README.md`

**Files:**
- Modify: `CLAUDE.md` (update palette + fonts + name + founding year)
- Modify: `README.md` (brand refs)

- [ ] **Step 1: Update `CLAUDE.md`**

Open `CLAUDE.md`. Replace the following sections:

Line 4 (company description):
```
Jotil Labs — The AI-First Customer Platform (Founded 2024, Lehi, Utah). ...
```
→
```
JotilLabs (legal entity: Jotil Labs LLC) — The AI-First Customer Platform (Founded 2026, Lehi, Utah). ...
```

Under `## Design System → ### Fonts`:
```
- Headings: Outfit (via --font-outfit CSS variable)
```
→
```
- Headings: Montserrat Alternates (via --font-montserrat-alternates CSS variable)
```

Under `## Design System → ### Color Palette`:
```
- Primary: #3B7BF2
- Primary Dark: #1B4FBA
- Primary Accent: #2D6AE0
- Secondary: #6366F1
- Accent: #0EA5E9
- Background: #FAFBFD
- Background Alt: #F0F4FF
- Text: #111111 / Secondary: #6B7280 (WCAG AA compliant)
- Dark (footer): #0A0F1C
```
→
```
- Primary: #3859a8 (royal blue)
- Primary Dark: #2a4688 (hover)
- Navy: #0f1129 (footer, deep sections)
- Accent: #22D3EE (electric cyan — highlights only)
- Logo Muted: #8ca3cc (logo dots, wordmark on dark bg)
- Background: #FAFBFD
- Background Alt: #F4F6FB
- Text: #0F1129 / Secondary: #4A4D6A / Muted: #6B7098 (WCAG AA)
- All brand constants in `lib/brand.js` — edit there, not in components.
```

- [ ] **Step 2: Update `README.md`**

Replace any "Jotil Labs" references with "JotilLabs" except where referring to the legal entity. Minimum expected edits:
- Project title
- Description
- Any badges / links

Run: `grep -n "Jotil Labs" README.md` to see exact lines, then edit.

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md README.md
git commit -m "docs(brand): update CLAUDE.md + README for new brand identity"
```

---

## Task 9: Smoke test end-to-end + push branch

**Files:** none modified — final validation.

- [ ] **Step 1: Full local smoke**

Run: `npm run build && npm run start`
Visit `http://localhost:3000`. Walk through checklist:

- [ ] Nav renders: hex logo + "JotilLabs" wordmark in Montserrat Alternates
- [ ] Hero eyebrow: "AUTOMATE. EMPOWER. SCALE."
- [ ] Footer: logo + "JotilLabs" + "Automate. Empower. Scale." caption + © 2026 Jotil Labs LLC
- [ ] Homepage loads without console errors
- [ ] `/about` — founding year 2026
- [ ] `/products`, `/contact` — all "Jotil Labs" replaced by "JotilLabs"
- [ ] `/terms`, `/privacy` — "Jotil Labs" preserved in body (legal entity)
- [ ] `/opt-in` — consent copy intact
- [ ] Browser tab favicon shows new hex mark
- [ ] `/og` — OG image renders with white logo on navy gradient
- [ ] Heartbeat animation visible on nav logo dots

- [ ] **Step 2: Run tests one more time**

Run: `npm run lint && npm run build && npm run test:visual`
Expected: all green.

- [ ] **Step 3: Push branch**

Run:
```bash
git push -u origin redesign/brand-refresh-2026
```
Expected: branch pushed to GitHub; Vercel auto-generates preview URL.

- [ ] **Step 4: Open PR**

Run:
```bash
gh pr create \
  --title "feat: brand refresh — rebrand to JotilLabs" \
  --body "$(cat <<'EOF'
## Summary
- Migrates site from legacy "Jotil Labs" brand to new brand doc identity (JotilLabs).
- Single source of truth in `lib/brand.js`; all colors, fonts, names, contact flow from there.
- New palette (royal blue #3859a8, deep navy #0f1129, cyan #22D3EE accent).
- Typography swap: Outfit → Montserrat Alternates (display); Inter unchanged (body).
- Logo rebuilt with parametric tones (brand / on-dark / mono).
- Tagline "Automate. Empower. Scale." added to footer, OG, hero eyebrow.
- Legal-page bodies untouched — "Jotil Labs" preserved as legal entity.
- Playwright visual regression tests on 5 routes × 2 viewports.

## Test plan
- [ ] Review Vercel preview URL end-to-end
- [ ] Verify `/terms`, `/privacy`, `/opt-in` body copy unchanged (`git diff app/terms/page.jsx app/privacy/page.jsx app/opt-in/page.jsx` shows only metadata/intro edits)
- [ ] Verify nav, footer, OG on preview
- [ ] Confirm favicon renders in browser tab
- [ ] CI green (lint + build + visual regression)

Closes #<ISSUE_NUMBER>

Spec: `docs/plans/2026-04-18-brand-refresh-design.md`
Plan: `docs/plans/2026-04-18-brand-refresh-implementation.md`
EOF
)"
```
Replace `<ISSUE_NUMBER>` with the issue number from Task 0 Step 4.

- [ ] **Step 5: Report PR URL**

Print the PR URL returned by `gh pr create`. Hand off to user for review.

---

## Self-review checklist

- [x] Every task has exact file paths
- [x] Every code step has complete, copy-pasteable code
- [x] Every command has expected output
- [x] No TBDs, TODOs, or placeholders
- [x] Legal-page bodies explicitly not modified (Task 5 is metadata-only)
- [x] Branch workflow: one PR, 8 meaningful commits + 1 setup + 1 docs + 1 smoke
- [x] Playwright scope sized: 5 routes × 2 viewports + specific guards
- [x] Rollback implicit in standalone-green commits

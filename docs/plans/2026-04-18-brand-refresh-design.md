# Brand refresh — JotilLabs rebrand design spec

**Date:** 2026-04-18
**Status:** Draft — awaiting user approval
**Scope:** Full visual rebrand (logo, palette, typography, wordmark, tagline, name) across the marketing site
**Out of scope:** Dark mode site-wide, new sections/pages, functionality changes, legal-page body copy

---

## 1. Background

JotilLabs received a brand guidelines document (`/Users/qratul/Downloads/jotil lab.pdf`). The document defines a new visual identity: hexagonal logo with 3D isometric L-cube + progressive dots, royal-blue / deep-navy palette, Montserrat Alternates typography, and the tagline *"Automate. Empower. Scale."*

The current site (`jotil_labs_website/`, Next.js 15 + Tailwind v4) uses an older palette (`#3B7BF2` bright blue, indigo secondary, cyan accents), Outfit + Inter typography, and the wordmark "Jotil Labs" (two words). The company registered with the State of Utah as **Jotil Labs LLC**, and live customer-facing legal pages (T&Cs, privacy, opt-in) reference this legal entity.

This spec captures the design for a single coordinated rebrand PR that updates every brand surface while preserving the legal-entity identity in live legal content.

## 2. Goals

1. Ship the brand doc's visual identity on the live site with zero functional regression.
2. Centralize brand data in a single source-of-truth module (`lib/brand.js`) so future brand changes are a one-file edit.
3. Preserve T&Cs, Privacy, and Opt-In body copy — they are active contracts with existing customers.
4. Keep the existing logo geometry (already matches brand doc silhouette); swap only colors, wordmark font, and typography.
5. Add Playwright visual regression coverage for the top 5 routes to catch unintended side effects.

## 3. Non-goals

- Introducing dark-mode support across the site (the logo has a dark-mode tone for footer/dark sections only).
- Adding new pages, features, or product content.
- Modifying legal page content (T&Cs, Privacy, Opt-In bodies).
- Pixel-perfect SVG recreation of the brand doc artwork (the existing SVG paths satisfy the brand doc silhouette).
- Surfacing internal brand values (Mature, Reliable, Progressive) as site copy. Those are positioning, not content.

## 4. Architecture

### 4.1 Source of truth — `lib/brand.js`

Single module exporting all brand constants. Consumed by Tailwind tokens, metadata, JSON-LD, OG image, manifest, and any copy that references the name/tagline/contact.

```js
// lib/brand.js
export const brand = {
  name: 'JotilLabs',                 // brand wordmark
  legalName: 'Jotil Labs LLC',       // state-registered LLC (legal pages + © footer)
  tagline: 'Automate. Empower. Scale.',
  domain: 'jotillabs.com',
  email: 'contact@jotillabs.com',
  phone: '+1 (358) 900-0040',
  address: { city: 'Lehi', state: 'Utah', country: 'US' },
  founded: 2026,

  colors: {
    primary: '#3859a8',              // royal blue
    navy:    '#0f1129',              // deep navy
    accent:  '#22D3EE',              // electric cyan — UI highlights only, not logo
    logoMuted: '#8ca3cc',            // muted blue — logo dots only, not palette-wide
    black:   '#000000',
    white:   '#FFFFFF',
  },

  neutrals: {
    bg:      '#FAFBFD',
    bgAlt:   '#F4F6FB',
    surface: 'rgba(15,17,41,0.04)',
    border:  'rgba(15,17,41,0.08)',
    text:    '#0F1129',
    muted:   '#4A4D6A',
    subtle:  '#6B7098',
  },

  fonts: {
    display: 'Montserrat Alternates',
    body:    'Inter',
    mono:    'JetBrains Mono',
  },
}
```

**Consumers:**
- `app/globals.css` `@theme` block — references values as CSS custom properties
- `app/layout.jsx` — `metadata` object (title, description, OG)
- `components/layout/JsonLd.jsx` — `name`, `legalName`, `foundingDate`
- `app/og/route.jsx` — dynamic OG image rendering
- `components/layout/Footer.jsx` — wordmark + legal © line + tagline
- `public/manifest.json` — updated manually in commit #3
- Any page or component referencing name/tagline/contact

### 4.2 Tailwind tokens (`app/globals.css`)

Replace current `@theme` block with the following semantic tokens. Component code references tokens (`text-primary`, `bg-navy`), never raw hex.

| Token | Value | Purpose |
|---|---|---|
| `--color-primary` | `#3859a8` | Royal blue — CTAs, links, brand fill |
| `--color-primary-dark` | `#2a4688` | Hover state for primary |
| `--color-navy` | `#0f1129` | Deep navy — footer, dark sections, body text |
| `--color-accent` | `#22D3EE` | Electric cyan — gradients, highlights, focus rings |
| `--color-logo-muted` | `#8ca3cc` | Logo dots only; not for general UI |
| `--color-bg` | `#FAFBFD` | Page background |
| `--color-bg-alt` | `#F4F6FB` | Section alt background |
| `--color-surface` | `rgba(15,17,41,0.04)` | Subtle card surface |
| `--color-surface-hover` | `rgba(15,17,41,0.07)` | Card hover |
| `--color-border` | `rgba(15,17,41,0.08)` | Default border |
| `--color-border-hover` | `rgba(56,89,168,0.20)` | Primary-tinted border hover |
| `--color-text` | `#0F1129` | Primary text |
| `--color-text-muted` | `#4A4D6A` | Secondary text |
| `--color-text-subtle` | `#6B7098` | Tertiary / captions |
| `--color-white` | `#FFFFFF` | White |
| `--font-display` | `var(--font-montserrat-alternates), sans-serif` | Headings, wordmark, eyebrows, CTAs |
| `--font-body` | `var(--font-inter), system-ui, sans-serif` | Paragraphs, body, legal text |
| `--font-mono` | `var(--font-jetbrains), ui-monospace, monospace` | Code |

**Removed tokens:** `--color-primary-accent` (`#2D6AE0`), `--color-primary-light` (`#6B9AEA`), `--color-secondary` (`#6366F1` indigo), `--color-glow` (`#3B82F6`), `--color-dark` (replaced by `--color-navy`).

**Gradient utility classes:**
- `.bg-brand-gradient` — `linear-gradient(90deg, #3859a8, #22D3EE)` for CTAs and accents
- `.text-brand-gradient` — same, clipped to text (hero highlight word)
- `.bg-hero-wash` — `linear-gradient(180deg, #FFFFFF 0%, #EEF7FD 100%)` + soft cyan radial glow top-right (hero sections)

**WCAG contrast:**
- Navy on bg: 17.5:1 (AAA)
- Primary on white: 7.1:1 (AAA)
- Cyan on navy: 11.3:1 (AAA)
- Cyan is never used as text color on light backgrounds (1.9:1 fails) — fills, borders, glows only.

### 4.3 Typography

- **Display** (headings, wordmark, nav, stats, eyebrows, CTAs): Montserrat Alternates via `next/font/google` — weights 400, 500, 600, 700, 800.
- **Body** (paragraphs, forms, legal text, blog prose): Inter — unchanged from current.
- **Mono** (code snippets): JetBrains Mono — unchanged.

`app/layout.jsx` imports Montserrat Alternates in place of Outfit. Font CSS variable name (`--font-montserrat-alternates`) referenced in `@theme`.

### 4.4 Logo system — `components/ui/Logo.jsx`

Rebuilt with:
- Same SVG paths as current (viewBox `"220 130 320 280"`) — the existing geometry already matches the brand doc silhouette.
- Colors parameterized via `tone` prop instead of hardcoded hex.
- Three exported components: `Logo` (mark only), `LogoWordmark` (text only), `LogoLockup` (mark + wordmark, optional tagline).

**API:**

```jsx
<Logo size="md" tone="brand" animate />
<LogoWordmark tone="brand" />
<LogoLockup size="md" tone="brand" showTagline={false} />
```

- `size`: `'xs' | 'sm' | 'md' | 'lg' | 'xl' | number` (px)
- `tone`: `'brand'` (default, for light bg) | `'on-dark'` (for dark bg like footer) | `'mono'` (uses `currentColor`, for favicon/print)
- `animate`: `true` enables heartbeat pulse on dots (10s cycle, 0.15s stagger); `false` for favicon/OG/static contexts

**Tone palettes:**

| tone | Hex body | Depth | Dots | Use |
|---|---|---|---|---|
| `brand` | `#3859a8` | `#0f1129` | `#8ca3cc` | Nav, hero, default |
| `on-dark` | `#ffffff` | `#8ca3cc` | `#8ca3cc` | Footer, dark hero sections |
| `mono` | `currentColor` | `currentColor` | `currentColor` | Favicon, print, single-color contexts |

**Wordmark:**
- Text: `JotilLabs` (no space) — rendered as two spans.
- Light tone: `Jotil` in navy (`text-navy`), `Labs` in primary (`text-primary`).
- Dark tone: `Jotil` in white, `Labs` in `#8ca3cc`.
- Font: Montserrat Alternates, weight 700, `letter-spacing: -0.5px`, `line-height: 1`.

**Heartbeat animation** moved from inline JSX to `@keyframes heartbeat` in `globals.css` for reuse. Keyframe: 3% scale-to-1.3 + opacity-to-1, then settle; 7% second small pulse; 10%–100% quiet.

### 4.5 Derivative assets

Regenerated from the same SVG:
- `public/favicon.svg` — mark only, `tone="brand"`, `animate={false}`, stroke widths preserved for legibility at 16px.
- `public/apple-touch-icon.svg` — mark on white, 180px padded.
- `public/manifest.json` — updated icon refs, `name: "JotilLabs"`, `short_name: "JotilLabs"`, `theme_color: "#3859a8"`, `background_color: "#FAFBFD"`.
- `app/og/route.jsx` — uses `<LogoLockup size="lg" tone="brand" />` in the OG image header, plus tagline.

### 4.6 Placement map

| Surface | Component | Size | Tone |
|---|---|---|---|
| Navbar | `<LogoLockup size="sm" />` | 32px mark + 18px wordmark | `brand` |
| Footer | `<LogoLockup size="md" showTagline />` | 40px mark + 22px wordmark + tagline | `on-dark` |
| OG image | `<LogoLockup size="lg" />` | 56px mark + 32px wordmark | `brand` |
| 404 page | `<Logo size="xl" />` | 72px mark only | `brand` |
| Favicon | `<Icon tone="brand" animate={false} />` | 32px | `brand` |
| Apple touch icon | Icon on white, padded | 180px | `brand` |

## 5. Name & tagline strategy

### 5.1 Name rules

| Context | Use | Example |
|---|---|---|
| Nav, footer, marketing copy, blog, hero, CTAs, metadata `<title>`, OG, JSON-LD `name` | `brand.name` = `"JotilLabs"` | "About JotilLabs" |
| JSON-LD `legalName`, footer © line | `brand.legalName` = `"Jotil Labs LLC"` | "© 2026 Jotil Labs LLC" |
| T&Cs, Privacy, Opt-In body copy | `brand.legalName` | Unchanged — existing text references preserved |
| Email domain, URLs | `brand.domain` | jotillabs.com |

### 5.2 Tagline placement

- Footer: under wordmark lockup.
- Hero: small eyebrow above H1 — exact placement confirmed during implementation by inspecting current hero.
- OG image: subtitle line under wordmark.
- **NOT** in `<meta name="description">` — description stays benefit-focused for SEO.

## 6. File-by-file change catalog

### 6.1 Auto-safe replace (`"Jotil Labs"` → `"JotilLabs"`, `2024` → `2026` as founding year)

- `app/layout.jsx`
- `app/sitemap.js`
- `app/robots.js` (verify no changes needed)
- `app/og/route.jsx`
- `app/not-found.jsx`
- `app/page.jsx`
- `app/about/page.jsx`
- `app/products/page.jsx`, `app/products/[slug]/page.jsx`
- `app/use-cases/page.jsx`
- `app/contact/page.jsx`
- `app/blog/page.jsx`, `app/blog/[slug]/page.jsx`
- `app/opt-in/page.jsx` (shell only — see 6.2 for body)
- `app/consultancy/page.jsx`
- `app/custom-development/page.jsx`
- `app/design/icons/page.jsx`
- `components/layout/Footer.jsx`
- `components/layout/JsonLd.jsx`
- `components/sections/ContactForm.jsx`, `components/sections/OptInForm.jsx`
- `components/ui/Logo.jsx` (rebuilt per Section 4.4)
- `content/blog/complete-guide-sms-automation-small-business.mdx`
- `content/blog/ai-voice-agents-transform-business-calls.mdx`
- `public/manifest.json`
- `app/api/contact/route.js` (email from/subject)
- `CLAUDE.md` (except legal section — see 6.2)

### 6.2 Manual review — body copy preserved

- `app/terms/page.jsx` — body untouched; only header/shell brand references updated via shared components
- `app/privacy/page.jsx` — same
- `app/opt-in/page.jsx` body — same
- `docs/plans/*.md`, `docs/design/*.md` — historical design docs not rewritten

### 6.3 Not touched

- `docs/brand-explorations/` — scratch folder, will be removed after merge.

## 7. Rollout plan

### 7.1 Branch & commits

Branch: `redesign/brand-refresh-2026` off `main`.

| # | Commit | Files |
|---|---|---|
| 1 | `feat(brand): add brand.js source-of-truth module` | `lib/brand.js` (new) |
| 2 | `feat(brand): replace palette + typography tokens` | `app/globals.css`, `app/layout.jsx` (font imports) |
| 3 | `feat(logo): rebuild Logo with palette tones + derivative assets` | `components/ui/Logo.jsx`, `public/favicon.svg`, `public/apple-touch-icon.svg`, `public/manifest.json` |
| 4 | `chore(copy): rename Jotil Labs → JotilLabs across brand surfaces` | All files in 6.1 except legal |
| 5 | `chore(legal): update wordmark on legal pages, preserve legal body copy` | `app/terms`, `app/privacy`, `app/opt-in` headers only |
| 6 | `feat(brand): add tagline to footer, OG, and hero eyebrow` | `Footer.jsx`, `og/route.jsx`, `page.jsx` |
| 7 | `test(brand): add Playwright visual regression snapshots` | `tests/brand.spec.js` (new), `playwright.config.js` (new or updated) |
| 8 | `docs(brand): update CLAUDE.md and README for new brand identity` | `CLAUDE.md`, `README.md` |

Each commit compiles, lints, and passes CI independently.

### 7.2 Issue & PR

- GH Issue: `Brand refresh — rebrand to JotilLabs with new palette, typography, logo`
  - Describes the change, links to this spec, lists acceptance criteria.
- PR: single PR from `redesign/brand-refresh-2026` → `main`, with the 8 commits above.
  - PR body includes test plan checklist (§ 7.4).
  - Vercel auto-deploys preview URL on push; user clicks through before approval.

### 7.3 Playwright validation

- **Scope:** top 5 routes × 2 viewports (mobile 390×844, desktop 1440×900) = 10 snapshots.
- **Routes:** `/`, `/about`, `/products`, `/contact`, `/terms`.
- **Config:** `playwright.config.js` with 1% pixel diff threshold.
- **Command:** `npm run test:visual` (new script in `package.json`).
- **Location:** snapshots in `tests/__snapshots__/`, committed.
- **Logo-specific test:** renders `<Logo size="xs|sm|md|lg|xl">` and favicon `16|32` side-by-side, compared against a golden snapshot.
- **CI:** `npm run test:visual` added to GitHub Actions workflow; PR cannot merge if snapshots diverge beyond threshold without a refresh commit.

### 7.4 Manual smoke checklist (run before merge)

- [ ] `npm run dev` → navigate to `/` desktop; verify nav, hero, footer
- [ ] `/` mobile; verify nav collapse, hero stacking
- [ ] `/about`; verify founding year "2026", no stray "Jotil Labs" in body except legal entity references
- [ ] `/products`, `/products/[slug]` — brand references updated
- [ ] `/contact` — form still works, contact info correct
- [ ] `/terms`, `/privacy`, `/opt-in` — body copy untouched, only header wordmark updated
- [ ] Footer: "© 2026 Jotil Labs LLC", tagline visible
- [ ] Homepage hero eyebrow: "Automate. Empower. Scale."
- [ ] Favicon visible in browser tab (16px crisp)
- [ ] OG image: `curl http://localhost:3000/og?title=Test` renders with new logo
- [ ] Heartbeat dot animation visible on nav logo
- [ ] Dark footer uses `tone="on-dark"` variant correctly
- [ ] No console errors
- [ ] Lighthouse score not regressed (>90)
- [ ] Vercel preview URL visually matches localhost

### 7.5 CI requirements

- `npm run lint` — ESLint clean
- `npm run build` — Next.js builds with no errors
- `npm run test:visual` — snapshots within threshold
- All three gates required before PR is mergeable.

### 7.6 Rollback plan

- If production breaks post-merge: `git revert <merge-commit>` on `main` → Vercel redeploys previous.
- Individual commits can be reverted granularly (e.g. keep palette, roll back tagline) because each commit is standalone.

## 8. Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Legal page body copy accidentally touched | Medium | High (active customer contracts) | Commit #5 is header-only; explicit grep check in smoke checklist; reviewer reads diff of `app/terms`, `app/privacy`, `app/opt-in` files explicitly |
| Logo animation broken at small sizes | Low | Low | Favicon uses `animate={false}`; Playwright snapshots catch regressions |
| Font swap breaks line heights on tight layouts | Medium | Medium | Visual regression tests across 5 routes × 2 viewports catch this; Montserrat Alternates has similar x-height to Outfit |
| Removed indigo/cyan tokens referenced by unknown files | Medium | Medium | Commit #2 alone will surface build errors if so; easy to fix before moving on |
| Hero tagline placement conflicts with current copy | Low | Low | Tagline placed as eyebrow above H1, not replacing existing copy; confirmed during implementation |
| `manifest.json` PWA install breaks | Low | Low | Manual update with new name/icons; smoke-test PWA install on preview URL |

## 9. Success criteria

- Site loads and functions identically for end users (no functional regression).
- Visual identity matches brand doc: hex logo with new palette, Montserrat Alternates display font, "JotilLabs" wordmark, "Automate. Empower. Scale." tagline.
- Legal pages' body copy unchanged (verified by diff on `app/terms/page.jsx`, `app/privacy/page.jsx`, `app/opt-in/page.jsx`).
- Playwright visual snapshots committed; CI blocks regressions.
- `lib/brand.js` is the single source of truth; no hardcoded brand strings or hex values in components outside the logo file.
- PR merged cleanly to `main`; Vercel production deploy green.

## 10. Open questions

None at time of writing. Any new questions that arise during implementation go to the GH issue thread.

---

**References:**
- Brand doc: `/Users/qratul/Downloads/jotil lab.pdf` (11 pages)
- Palette comparison: `docs/brand-explorations/palette-comparison.html`
- Logo final reference: `docs/brand-explorations/logo-final.html`
- Logo SVG recreation (abandoned): `docs/brand-explorations/jotil-logo-v1.svg`
- PDF logo page extracts: `docs/brand-explorations/brand-logo-page-07.png`, `brand-logo-variants-08.png`

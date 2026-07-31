# Lightweight Hero Background + Scroll Performance — Design

Date: 2026-06-26
Status: Approved (pending spec review)
Owner: web

## 1. Problem

The marketing site (Next.js 15 App Router, React 19, Tailwind v4, Framer Motion +
GSAP + Lenis, Spline 3D hero) feels laggy while scrolling, worst on the hero and
on phones. A measured audit (production build, Playwright frame-timing + live DOM
scan) found the root causes are continuous main-thread / GPU work, not bundle size:

- **55 live `backdrop-filter` elements** on the homepage — the dominant scroll-jank
  cause. ~42 come from the 5 device showcase mockups (frames + internal glass
  rows); the rest from `.card`/`.card-premium` (blur 16px), `.glass` (blur 20px),
  and the sticky navbar. `backdrop-filter` re-samples and re-blurs the backdrop
  every frame during scroll.
- **No `content-visibility`** anywhere — every off-screen section (all 5 device
  mockups included) is fully painted, composited, and animated even when not
  visible.
- **~60 continuously-running animations**, many off-screen (device glows ×10,
  waveform bars, typing dots, pulse rings, aurora drift).
- **Spline WebGL iframe** — the single biggest GPU consumer, running continuously,
  worst on mobile.
- **Lenis smooth scroll** re-transforms the whole page every frame on top of all
  the above, multiplying the cost.

(Absolute FPS in the headless audit is inflated by software rendering, but the
relative signals — counts of backdrop-filters, animations, and the WebGL canvas —
are real and explain the lag.)

## 2. Goals / Non-goals

**Goals**
- Smooth scrolling (no visible jank) on the homepage, on both desktop and phones.
- Remove the heaviest background work and recreate the same visual look with a
  lightweight, browser-friendly technique.
- Keep the design feel: light, elegant, premium, slick, subtle.

**Non-goals**
- No content/copy changes. No layout/section-order changes.
- No redesign of the device showcase screens themselves (only their blur).
- No change to the legal pages or any non-homepage content beyond shared
  components (navbar, cards, background).

## 3. Decisions (approved)

1. **Fidelity vs speed:** desktop stays visually faithful; mobile (≤767px / touch)
   may take an invisible-to-small lighter path.
2. **Hero background:** remove the live Spline 3D entirely and recreate the *same
   look* in pure CSS, on **both** desktop and mobile. (The Spline scene is, in
   practice, a clean light background with a faint soft glow on the right-center —
   so a CSS recreation is visually near-identical.) This supersedes an earlier
   idea of "static image on mobile / Spline on desktop" — no split is needed once
   the iframe is gone.
3. **Scope:** Approach "A — surgical": fix the five root causes, nothing more.

## 4. Design

### 4.1 Hero background (the core change)

File: `components/sections/SplineAura.jsx`

- Remove the `<iframe src="https://my.spline.design/...">` and the `showSpline`
  state + `requestIdleCallback` mount logic that exist only to defer it.
- Replace with a pure-CSS background layer inside the hero `<section>` that
  recreates the look:
  - Base: a near-white cool vertical/diagonal gradient (e.g. `#ffffff` →
    very light blue/lavender), matching the current airy light field.
  - One soft radial glow positioned right-center (low-opacity blue/lavender,
    large soft radius) to echo the Spline bloom.
  - An optional very faint concentric ring (single radial-gradient or 1px
    bordered circle at low opacity) to echo the scene's subtle ring.
  - Keep the existing white legibility veil over the left column (or fold it into
    the base gradient).
- Performance constraints: transform/opacity only; no `backdrop-filter`; at most
  one slow (≥20s) transform-based drift, or fully static. No WebGL, no iframe, no
  large animated `filter: blur` that re-rasters each frame.
- The hero "subject" — badge, headline (with its per-word directional shadows),
  paragraph, CTAs, and the cycling glass orb (`HeroOrb`) — is unchanged.
- Result: the hero looks essentially the same but costs near-zero, on every
  device, and removes the audit's #1 item.

### 4.2 `content-visibility: auto` on off-screen sections

Files: `app/globals.css` (utility class) + section components.

- Add a utility (e.g. `.cv-auto { content-visibility: auto; contain-intrinsic-size: 0 <h>px; }`)
  with a `contain-intrinsic-size` placeholder height per section type to prevent
  scrollbar jump.
- Apply to: each **showcase device row** (`ScrollProductShowcase` rows), and the
  `SolutionsBento`, `HowItWorks`, `IntegrationStrip`, `CTASection` sections.
- **Exclude** `LiveConsole` — it is scroll-driven via `useScroll`, and
  `content-visibility` would break its scroll measurement. Also exclude any
  currently-in-view / above-the-fold content.
- Effect: the browser skips paint/composite **and pauses CSS/Framer animations**
  for these sections while off-screen — this also neutralizes most of the ~60
  always-on animations without touching them individually.

### 4.3 Strip `backdrop-filter` from the device mockups

Files: `components/sections/showcase/devices/{Phone,Browser,Laptop,Monitor}Mockup.jsx`,
`components/sections/showcase/screens/AvatarScreen.jsx`,
`components/sections/showcase/cards/FloatingCards.jsx`, and any `.glass` usage
inside the showcase.

- Replace `backdrop-filter: blur(...)` + translucent background with an opaque or
  near-opaque solid background. These elements sit on solid device screens, so the
  blur refracts nothing meaningful — the result is visually identical.
- Removes ~42 of the 55 live backdrop-filters.

### 4.4 Mobile = native scroll (disable Lenis on touch)

File: `components/design/SmoothScroll.jsx`

- Skip Lenis initialization when `matchMedia('(hover: none)')` /
  `matchMedia('(max-width: 767px)')` indicates a touch/phone device; fall back to
  native scrolling there.
- GSAP ScrollTrigger and the IntersectionObserver-based reveals work on native
  scroll, so only the per-frame page transform is removed on mobile.
- Desktop keeps Lenis unchanged.

### 4.5 Lighter sticky-navbar blur on mobile

File: `components/layout/Navbar.jsx` (+ `app/globals.css` if class-based).

- The navbar is the one blurred element always on screen during scroll. On
  ≤767px, reduce its `backdrop-filter` blur radius (or make it a solid/near-solid
  background). Desktop navbar unchanged.
- Cards already drop to `blur(8px)` on mobile (existing rule) — no change needed.

## 5. Mechanism notes

- **Device tier:** a single `matchMedia('(max-width: 767px)')` check (the pattern
  already used in `HeroOrb`) drives the mobile-only behaviors (Lenis off, navbar
  blur). Default to the desktop value during SSR to avoid hydration mismatch, then
  adjust on mount.
- **No new heavy assets:** the hero recreation is CSS only — no image download, no
  WebGL.

## 6. Testing / success criteria

Re-run the same Playwright audit (production build) before/after:

1. **Scroll frame timing:** record frame intervals while programmatically
   scrolling the full page at desktop (1440) and mobile (390). Target: large
   reduction in frames > 33ms and > 50ms vs baseline.
2. **Live composite/animation counts:** live `backdrop-filter` count drops from
   ~55 to ≈10; with sections off-screen, "actively animating" element count drops
   substantially (content-visibility pausing).
3. **Hero cost:** no `iframe[title="3D background"]` in the DOM; no WebGL context.
4. **Visual parity:** screenshot the hero and key sections; desktop hero should
   read as essentially the same light/premium background; sections unchanged.
5. **No regressions:** `npm run build` passes; no console errors; `npm run
   lint:colors` passes (no retired hexes); showcase reveals + Live Console scroll
   animation still work; anchor links / find-in-page still work with
   `content-visibility`.

## 7. Risks / mitigations

- **`content-visibility` breaking scroll-driven animation** → exclude
  `LiveConsole`; verify reveals and the Live Console docking still work.
- **`contain-intrinsic-size` wrong → scrollbar jump** → set per-section estimates
  close to real heights; verify no visible jump while scrolling.
- **Removing device blur changes look** → only applies where elements sit on solid
  backgrounds; verify against before screenshots.
- **Disabling Lenis changes scroll feel on mobile** → intended (native scroll);
  confirm ScrollTrigger-driven sections still fire.
- **Hero CSS recreation drifts from the original look** → tune against the captured
  reference screenshot of the current hero.

## 8. Out of scope

- Desktop Lenis behavior, font system, copy, section order, legal pages.
- Replacing or refactoring the device showcase screens beyond removing blur.
- The site-wide aurora (`BrandBackground`) drift is already frozen on mobile; no
  further change here unless a follow-up is requested.

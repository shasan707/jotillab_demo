# Theme refresh and phased redesign plan

**Date:** 2026-04-21
**Owner:** qratul + Claude
**Status:** Draft, awaiting approval before implementation
**Supersedes:** the earlier hero-first sequencing proposed in-chat on 2026-04-20/21

## 0. TL;DR

The JotilLabs site reads as "flat design" despite Phase 1 shipping the primitives (Fraunces, atmospheric divider, mesh, grain, shadow ladder, warm cream). The primitives sit unused on the live site; the baseline surfaces are still plain white cards with 1px rules between sections, and the 2026-04-18 rebrand only migrated the `@theme` tokens — not the hundreds of hard-coded `#3B7BF2` legacy-blue references scattered through `globals.css` and section components. Animation layered on that baseline would just amplify the gap between "designed" moments and "undesigned" ones.

This plan reorders the upcoming work into three phases:

1. **Phase A — Theme refresh** (3-4 PRs): fix color drift, introduce a tonal scale, consume Phase 1 primitives sitewide, upgrade card/surface/transition systems. Goal: even the unremarkable sections feel premium.
2. **Phase B — Product showcases** (1 framework PR + 5 product PRs, Messenger parked): per-product Signal→Core→Outcome animations on product pages.
3. **Phase C — Homepage hero** (3 PRs): two-variant preview + merge the winner. Deferred until Phase B teaches us what the framework actually feels like in production.

Phase D (JotilMessenger showcase) ships whenever the Messenger product itself ships.

## 1. Current-state diagnosis (flatness audit)

### 1.1 Color drift — the rebrand is incomplete

The `@theme` block in `app/globals.css` (lines 13-19) was correctly updated on 2026-04-18 to the brand-guide palette:

- `--color-primary: #3859a8`
- `--color-primary-dark: #2a4688`
- `--color-navy: #0f1129`
- `--color-accent: #22D3EE`

But the utility classes *inside* the same file — which override or supplement those tokens — still hard-code the OLD legacy blue `#3B7BF2`:

| Location | Code |
|---|---|
| `globals.css:250, 252` | `.glass-hover:hover` border + shadow |
| `globals.css:275, 277` | `.card:hover` shadow + border |
| `globals.css:291-292` | `.card-premium:hover` shadow + border |
| `globals.css:312` | `.card-premium:hover::before` gradient |
| `globals.css:392` | `.gradient-divider` background |
| `globals.css:408` | `.badge` color + bg |
| `globals.css:424` | `.nav-link-hover::after` gradient |
| `globals.css:448` | `a:focus-visible` outline |
| `globals.css:459` | `.skip-to-main` bg |
| `globals.css:475` | `::selection` bg |
| `globals.css:438` | `::-webkit-scrollbar-thumb` (uses `#0F172A` — not navy either) |

The legacy blue also permeates section components. In `components/sections/Hero.jsx` alone: `#3B7BF2` appears in the badge background, gradient orbs, glow, mic-button, waveform, live-indicator icons, button shadows — every single visual element. Verified: same issue exists in `CTASection`, `Stats`, `ProductShowcase`, `Testimonials`, `HowItWorks`, `LogoCloud`, `IntegrationStrip`, `Navbar`, `Footer`, plus every `components/product/DemoVisualization.jsx` sub-component.

**Impact:** two visually similar but not identical blues (`#3859a8` vs `#3B7BF2`) render simultaneously — producing the subtle "off" feeling that reads as flat/amateurish to the eye without the viewer knowing why.

### 1.2 No tonal scale

The official brand guide defines 4 colors (`#3859a8`, `#0f1129`, `#000`, `#fff`). The `@theme` block adds cyan + logo-muted + warm cream — still only 7 named colors. There is no scale like `primary-50 → primary-900`. Every subtle tint on the site is an ad-hoc `rgba()` call:

- `rgba(59, 123, 242, 0.06)` in Hero badge bg (Hero.jsx:118)
- `rgba(59,123,242,0.08)` in Hero mic glow (Hero.jsx:35)
- `rgba(56, 89, 168, 0.10)` in `.icon-gradient-bg` (globals.css:330)

These are all "the same primary tinted" but authored independently. Without a tonal scale they drift, reinforce flatness, and can't be refactored to new palette without touching every file.

### 1.3 Card system is plain white with thin shadow

`.card` (globals.css:266-278) and `.card-premium` (280-314) are both:
- `background: #FFFFFF`
- `border: 1px solid rgba(0, 0, 0, 0.05)`
- Hover: translateY(-2px) + shadow tinted legacy-blue

No edge highlight, no inner luminance, no surface gradient, no warm/cool variation per surface role. Every card on the site looks identical regardless of whether it's a feature card, a pricing card, a testimonial, or a product card.

### 1.4 Section transitions are 1px hard rules

`.gradient-divider` (globals.css:390-393) is a 1px horizontal line with a 2-color gradient on transparent. Used between every section on every page. Reads as a literal rule, not a transition. Phase 1 shipped `AtmosphericDivider` as the replacement — it is not imported or used anywhere yet.

### 1.5 Phase 1 primitives are unused on live pages

| Primitive | Imported where on live pages |
|---|---|
| `ScrollGradientMesh` | Nowhere |
| `GrainOverlay` | Nowhere |
| `AtmosphericDivider` | Nowhere |
| `MagneticButton` | Nowhere |
| `CustomCursor` | Nowhere (also not mounted in `app/layout.jsx`) |
| `SerifAccent` | Nowhere (Fraunces never renders on any live surface) |

Verified by grep — zero consumers outside the `components/design/` folder itself.

### 1.6 Ambient atmosphere exists only inside the Hero

The homepage Hero (`Hero.jsx`) has 4 animated gradient orbs, a grid pattern, a faint isometric hex watermark (`.bg-brand-wash-mark`), a bottom fade, and a glass voice-orb with rings. It is the most atmospheric section on the whole site. The moment you scroll past the hero — flat white cards on `#FAFBFD` body background until you hit the footer's navy block. The visual journey drops off a cliff.

### 1.7 Typography has no editorial moment

- Display font: Montserrat Alternates — loaded, used for headings
- Body: Inter — loaded, used for body
- Mono: JetBrains Mono — loaded, used sparingly for stats
- Serif (Fraunces): **loaded, used nowhere**

No section uses Fraunces for a pull-quote, editorial emphasis, or key-phrase accent. The serif is paying for itself in kilobytes and contributing nothing.

### 1.8 Motion baseline is ad-hoc

Every section authors its own Framer Motion variants inline. No shared easing curve, no shared duration, no shared stagger pattern. Result: animations across sections don't feel orchestrated, they feel like separate websites stitched together.

## 2. Phase A — Theme refresh

**Goal:** every page, every section, every card on the live site feels lively, cohesive, and on-brand before we add a single new animation. 3-4 PRs, each small enough to review cleanly and merge independently.

### 2.1 PR A1 — Color drift cleanup + tonal scale

**Scope:**
- Replace every hard-coded `#3B7BF2` (and its close variants `#2D6AE0`, `#6B9AEA`, `#1B4FBA`) with the correct Tailwind/CSS-var references to `--color-primary` (`#3859a8`) and its new tonal scale (see below).
- Extend `@theme` with a full tonal scale for primary, navy, and accent:
  ```
  --color-primary-50  #EEF2FB
  --color-primary-100 #D8E1F4
  --color-primary-200 #B2C2E8
  --color-primary-300 #8CA3CC   (same as --color-logo-muted, unified)
  --color-primary-400 #5A78B8
  --color-primary-500 #3859a8   (base — same as --color-primary)
  --color-primary-600 #2a4688   (same as --color-primary-dark)
  --color-primary-700 #22396E
  --color-primary-800 #182A54
  --color-primary-900 #0F1E3A
  --color-primary-950 #0A1428
  ```
  Same treatment for `--color-accent-*` (cyan scale) and `--color-navy-*`.
- Remove legacy animations (`vbPulse`, `mdDot`, `ppFly`, `csSlot*`, `flPulse`, `flDot` still reference old blues `#6B9AEA` `#2D6AE0`) OR migrate them to new palette variables.
- Add dev-time guard: a lint rule (eslint-plugin-custom or simple grep in CI) that fails the build if `#3B7BF2`, `#2D6AE0`, or `#6B9AEA` reappear in source. Prevents regression.

**Files touched:** `app/globals.css`, every file under `components/sections/`, `components/widgets/AIWidget.jsx`, `components/product/DemoVisualization.jsx`, `components/product/FAQAccordion.jsx`, `components/ui/*.jsx`, `components/layout/Navbar.jsx`, `components/layout/Footer.jsx`, `components/layout/ScrollToTop.jsx`, `components/layout/JsonLd.jsx` (if any), `lib/brand.js` (audit — ensure it has the tonal scale).

**Risk:** touches many files. Mitigation: keep visual diff minimal — replace legacy blues with the closest equivalent on the new scale (`#3B7BF2` → `primary-500`, `#2D6AE0` → `primary-600`, `#6B9AEA` → `primary-300`). Run full Playwright visual snapshot suite; regenerate baselines where shifts are intentional.

**Acceptance:**
- `grep -r "#3B7BF2\|#2D6AE0\|#6B9AEA\|#1B4FBA" app components lib` returns zero hits
- Tonal scale is live in `@theme` and rendered correctly in devtools
- Playwright 58 tests pass with intentional baseline updates documented in PR body
- Site visually reads as "more cohesive" at a scan — same-site Before/After screenshot included in PR

### 2.2 PR A2 — Card / surface / interaction refresh

**Scope:**
- Redesign `.card` and `.card-premium` to stop being flat white rectangles:
  - Soft surface gradient from `#FFFFFF` to `#FAFBFD` (imperceptible diagonal)
  - 1px border in `primary-100` instead of black-rgba
  - Inner highlight: `inset 0 1px 0 rgba(255, 255, 255, 0.8)` (a "light-from-above" luminance)
  - Replace hover shadow with `--shadow-lg-brand` + cyan glow accent on `card-premium`
  - Retain translateY(-2px) on hover
- Introduce new surface variants: `.surface-raised`, `.surface-sunken`, `.surface-warm` (cream cream editorial sections), `.surface-navy` (dark sections with cyan accents) — so a page can alternate cool/warm/dark rather than run on one flat `#FAFBFD`.
- Interaction tokens: standardize transition-duration (200ms for micro, 300ms for card lift, 600ms for section reveals), easing (`cubic-bezier(0.22, 1, 0.36, 1)` for reveals, `ease-out` for micro).
- Focus-ring upgrade: switch `a:focus-visible` from legacy blue `rgba(59, 123, 242, 0.5)` to cyan ring — it reads more premium and distinguishes focus state from hover.
- Selection color: move to `rgba(56, 89, 168, 0.15)` (new primary tint).

**Files touched:** `app/globals.css` (most changes live here as utility class redefinitions), spot-check for any component using inline `.card` classes that now behave differently.

**Acceptance:**
- Playwright snapshot diff shows every card on the site gained visible depth without layout shift
- Devtools computed styles on `.card` confirm the inner highlight, surface gradient, and primary-tinted border
- Focus ring is cyan on Tab; selection is navy-tinted on text selection
- No regression in legal pages (terms, privacy, opt-in) — those must remain readable and professional

### 2.3 PR A3 — Section atmospherics applied sitewide

**Scope:**
- Replace `<div className="gradient-divider" />` occurrences with `<AtmosphericDivider from={...} to={...} />` — one transition per section boundary, each with appropriate from/to colors based on the two sections it connects.
- Apply `<GrainOverlay tone="light" opacity={0.025} />` at the body/layout level as a global atmosphere layer. Single instance in `app/layout.jsx`, positioned fixed, below content, pointer-events-none.
- On the homepage only, apply `<ScrollGradientMesh tone="light" opacity={0.25} />` inside the hero section AND inside the CTASection.
- Introduce section background variation on the homepage:
  1. Hero (light wash + orbs — keep current but on new palette)
  2. LogoCloud (surface-warm) — editorial, cream
  3. ProductShowcase (surface-raised, primary-50 tint)
  4. HowItWorks (surface-sunken, primary-100 tint)
  5. Stats (surface-navy, dark with cyan accents — the "pause" moment)
  6. Testimonials (surface-warm cream again)
  7. IntegrationStrip (surface-raised)
  8. CTASection (navy with gradient mesh — the closer)
- Each section transition uses `AtmosphericDivider` with from/to matching its neighbors.

**Files touched:** `app/layout.jsx`, `app/page.jsx`, every section in `components/sections/*`, potentially `components/product/DemoVisualization.jsx` if its wrapper needs atmosphere.

**Acceptance:**
- Scrolling the homepage reveals a deliberate cool/warm/dark rhythm rather than one-color monotony
- No hard 1px lines between sections; every transition is a color bleed
- Global grain overlay is visible but subliminal (on/off comparison is noticeable, but live readers can't consciously point to it)
- Mobile: ScrollGradientMesh is hidden below `md`; grain is kept; atmospheric dividers scale down gracefully
- prefers-reduced-motion: mesh drift disabled, grain kept, section colors kept (those aren't motion)

### 2.4 PR A4 — Typography editorial moments + motion baseline (OPTIONAL — only if Phase A feels incomplete after A3)

**Scope:**
- Introduce Fraunces usage in specific, disciplined places:
  - One pull-quote in Testimonials section: outer wrap in `SerifAccent` for the quote body, keeping attribution in Inter
  - One editorial emphasis word in the CTASection subline (e.g. "tirelessly")
  - Pricing page tier names: optional — could render in Fraunces for editorial weight
- Shared motion tokens: `--ease-reveal`, `--ease-micro`, `--duration-section-reveal`, `--duration-card-lift` — consumed by section-level wrappers.
- Standardize page-entry stagger: every section fades/slides in 20px with `--duration-section-reveal` and `cubic-bezier(0.22, 1, 0.36, 1)`.

**Acceptance:**
- At least three Fraunces moments visible on a full homepage scroll
- Motion across sections feels orchestrated (as if one person designed all of them), verified by DevTools Animations panel showing shared timing tokens
- Reduced-motion still honored

### 2.5 Phase A out-of-scope (deliberately)

- Any new animations beyond orchestration of existing
- Rewriting legal page content
- Touching the AIWidget chat/voice/avatar internals (just recolor, no logic change)
- New sections or removal of sections on any page
- New copywriting (except the Fraunces editorial moments if A4 happens)

## 3. Phase B — Product showcases

**Prerequisite:** Phase A is merged and deployed. We are no longer designing showcases against a flat baseline; every product showcase lands in an already-atmospheric page.

### 3.1 Framework PR (B-Framework)

Builds the shared animation engine once:

- `components/product/demos/DemoStage.jsx` — dark-navy section wrapper with ScrollGradientMesh + GrainOverlay + eyebrow + Fraunces pull-phrase + content slot
- `components/product/demos/IntelligenceCore.jsx` — animated SVG of the brand's hex + isometric cube, with pulse / absorb / emit states. This component is literally the brand logo, animated
- `components/product/demos/SignalChip.jsx` — incoming-signal primitive with variants (phone, chat, lead, query, trigger, visitor)
- `components/product/demos/OutcomeCard.jsx` — outgoing-outcome primitive with variants (calendar event, CRM entry, campaign metric, unified answer, action receipt, avatar instance)
- `components/product/demos/useSignalOrchestration.js` — hook that manages timing of signal-in → core-pulse → outcome-out for a given product

All framework components respect prefers-reduced-motion (static composition fallback showing signal + core + outcome labeled side-by-side).

### 3.2 Per-product PRs

Each consumes the framework with product-specific content. Order (Messenger deferred):

1. **B1 — JotilSpace** (#42): dashboard screenshots + model-swap animation + unified-query outcome. You flagged this as priority and it's the purest animation-only product (no live-try possible), so it's the best framework stress test.
2. **B2 — JotilReceptionist** (#39): phone-ring signal + voice waveform in core + calendar event + SMS outcome. Also places the real Retell phone number prominently on the page (not as demo, but as a "call us" trust element).
3. **B3 — JotilOutreach** (#41): campaign list signal + parallel dial outcomes + results stack. No live-try in this phase (phone-entry OTP is Tier 2 infra).
4. **B4 — JotilFlow** (#43): trigger signal + blocks-light-up through core + action outcome. Library grid section below.
5. **B5 — JotilAvatar** (#44): visitor-context signal + avatar embodiment + three-vignette outcome (web / Zoom / kiosk). If Anam embed is available, wire it as a Tier 2 follow-up.
6. **B6 — JotilMessenger** (parked — waits on Messenger product build).

### 3.3 Phase B out-of-scope

- Homepage hero rebuild
- Wiring any live-demo infrastructure (Retell phone-entry OTP, HeyGen/Anam embed, etc.) — all showcases are scripted in Phase B. Live infra is its own issue per product, Tier 2.
- Homepage product-router rebuild (Phase D candidate, separate)

## 4. Phase C — Homepage hero

**Prerequisite:** Phases A and B are merged. The framework has proven itself on 5 product pages, we know which timings read mature vs frantic, and the primitives are battle-tested.

### 4.1 PR C1 — Hero framework tweaks (if needed)

Adjust `IntelligenceCore`, `SignalChip`, `OutcomeCard` if Phase B revealed limitations. Often zero changes — framework was designed for this scale.

### 4.2 PR C2 — Two hero variants on preview routes

- Variant A — Radial thesis: six product signals orbit into the Intelligence Core, outcomes emit outward, 4.5s cycle. Tagline `Automate. Empower. Scale.` as the headline itself.
- Variant B — Editorial minimal: typographic hero, three-line stacked headline, Fraunces italic accent on subline, subtle ScrollGradientMesh drift, one thin cyan underline draw.
- Both deployed at `/preview/hero/radial` and `/preview/hero/minimal` — noindex, not in nav, not in sitemap.
- User compares Vercel preview URLs and picks.

### 4.3 PR C3 — Winning variant → homepage

Replace current `Hero.jsx` with the winner. Delete the loser. Remove preview routes (or retain for internal design reference).

## 5. Phase D — Messenger showcase (future)

Triggered when the Messenger product is deployed. Scope = one PR using the framework from Phase B, consuming a bakery/SMB embed mockup + SMS/WhatsApp/Teams channel chips. Closes the parked Messenger issue (whatever number is open at that time).

## 6. Sequencing rationale

- **Phase A first** because no animation survives a flat baseline; every later phase benefits from the refreshed theme as the surrounding context
- **Phase B before C** because the hero is the highest-leverage screen on the site and we want it designed with the most-complete understanding of the framework; building it first would either (a) under-exercise the framework and require revision, or (b) force rework when product showcases revealed framework gaps
- **Messenger last** because it's on the product team's critical path, not ours — no sense designing a showcase for a product that isn't deployed yet
- **Preview-route strategy for hero** because the hero is irreversible in visitor perception; two A/B'd options is worth the extra PR

## 7. Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Color refactor breaks a page layout | Medium | Medium | Playwright visual regression suite after each PR; keep PRs small so diffs are reviewable |
| Atmospheric dividers make low-end Android scroll janky | Medium | Low | AtmosphericDivider is pure CSS gradient — near-zero runtime cost. ScrollGradientMesh already has mobile kill-switch |
| Global grain overlay tints legal page content | Low | High | Legal pages flagged as "DO NOT MODIFY CONTENT." Grain overlay is 2.5% opacity, text contrast unchanged. Verify with a11y contrast tool after A3 |
| Tonal scale names conflict with Tailwind default color palette | Low | Low | Tailwind v4 `@theme` directive namespaces our tokens; no collision. Verified in Phase 1 |
| Section color variation (cool/warm/dark rhythm) feels too maximalist | Medium | Medium | Keep variation subtle on initial implementation, user-test on preview before merging A3. If too much, pull back to warm/cool alternation only and park navy-section-on-homepage for later |
| Phase B framework doesn't generalize across 5 products | Low | High | Build Space (#42) first as worst-case (pure animation, no live-try) — if the framework handles it, the other 4 are simpler |
| Hero Variant A (radial) looks busy at full resolution | Medium | Medium | That's why we build two variants and preview before committing. Minimal variant is the safety net |
| Fraunces file weight hurts LCP | Low | Low | Already shipped in Phase 1, already loaded via `next/font/google` with `display: 'swap'`. Used sparingly so subset is small |

## 8. Acceptance criteria — phase-level

### Phase A complete when:
- Zero legacy-blue hexes in source (grep guard passes in CI)
- Full tonal scale live in @theme
- Card system has visible depth without layout shift
- Every section transition uses AtmosphericDivider
- Homepage + at least one product page show cool/warm/dark rhythm on scroll
- Global grain overlay visible in devtools, unnoticeable at a glance
- Fraunces used in at least one editorial moment on the site
- All Playwright tests pass, baselines updated for intentional visual shifts
- PR-by-PR Before/After screenshots documented

### Phase B complete when:
- Framework PR is reviewed, merged, documented at `components/product/demos/README.md`
- 5 of 6 product pages have a Signal→Core→Outcome showcase section
- Each product showcase respects prefers-reduced-motion with a static fallback
- Each product page's original `DemoVisualization` content is replaced (old `MessengerDemo` et al retired except Messenger, which keeps the old showcase until Phase D)
- Acceptance criteria per product (defined in each product's issue body) pass

### Phase C complete when:
- Both hero variants deployed on preview routes, user has compared
- Winning variant merged, losing variant deleted, preview routes removed (or retained per user preference)
- Current Hero's VoiceOrb and animation logic is archived (deleted from codebase, but git history retains it)
- Homepage LCP is same or better than pre-refresh
- Lighthouse performance score on homepage >= 90 mobile

## 9. Open decisions for qratul

1. **Phase A4 — yes or no?** Typography editorial moments + motion baseline are genuinely optional. If the site looks lively after A3, skip A4 and go straight to Phase B. If it feels close but flat in text rhythm, do A4.
2. **Section color rhythm on homepage (A3):** the proposed cool/warm/dark/warm/cool progression is assertive. Do you want that, or prefer a gentler alternation (all cools with one warm cream testimonial section)?
3. **Dev-time color guard (A1):** I proposed a grep-based CI guard that fails the build if `#3B7BF2` / `#2D6AE0` / `#6B9AEA` reappear. OK to add? Gives you long-term protection against regression.
4. **Legal pages policy:** do you want Phase A changes to touch legal page *styling* (card surfaces, atmosphere) even though CONTENT is locked? My proposal: yes, because a flat legal page next to an atmospheric marketing page is itself a brand inconsistency. But content is untouched. Confirm.
5. **Phase B order:** I proposed Space first as framework stress test. Alternative order options: Receptionist first (easiest content + already-wired phone number to highlight), or Avatar first (most visually distinctive). Your call.

## 10. What I need from you to proceed

Approval on the phased ordering + answers to §9. Once you sign off, I will:

1. File each PR's issue with full detail matching the quality bar set by #39-#44 and #63. Each issue will cite this doc as the source of truth.
2. Open branches and PRs one at a time, merging sequentially through Phase A.
3. No implementation code is written until you approve this doc.

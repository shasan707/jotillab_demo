# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Note: README.md is a leftover Vite template and is NOT accurate. This file is authoritative.

## Company
JotilLabs (legal entity: Jotil Labs LLC) - The AI-First Customer Platform (Founded 2026, Lehi, Utah). We help SMBs never miss a customer through AI-powered communication automation. 9 solutions: Receptionist, Messenger, Outreach, Space, Flow, Avatar (core products) + Devs, Consult, Education (engagement-based services, contact pricing). Industries: 9, alphabetical (Beauty & Spa, Finance & Insurance, Health & Wellness, Home Services, Legal, Personal Secretary, Real Estate, Restaurant, Small Business). Target market: SMB, contact-based sales (no self-signup).

## Stack
- Next.js 15 App Router + React 19 + JSX (NOT TypeScript) + Tailwind CSS v4
- Animation: Framer Motion (component-level) + GSAP/ScrollTrigger + Lenis smooth scroll (site-wide, see Animation Rules)
- Tailwind v4 uses `@theme` directive in `app/globals.css` (no separate tailwind.config)
- `clsx` + `tailwind-merge` via `cn()` helper in `lib/utils.js`
- MDX blog: `next-mdx-remote/rsc` + `gray-matter` + `reading-time`
- Contact form email: Resend (`app/api/contact/route.js`, requires `RESEND_API_KEY`)
- Path alias: `@/*` → `./` via jsconfig.json
- Deployment: Vercel at jotillabs.com

## Build & Test Commands
- `npm run dev` — dev server (localhost:3000)
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm run lint:colors` — bash script (`scripts/lint-colors.sh`) that fails if retired pre-rebrand palette hexes (incl. old cyan #22D3EE) reappear in app/, components/, lib/, data/
- `npm run test:visual` — Playwright visual regression (tests/). Runs against `npm run start` on port 3000, so run `npm run build` first. Two projects: `desktop` (1440x900) and `mobile-chrome` (390x844); screenshot diff threshold 2%. Run a single file with `npx playwright test tests/pricing.spec.js`, or one project with `--project=desktop`
- `npm run test:visual:update` — regenerate Playwright snapshots (tests/*-snapshots/)

## Environment Variables (see .env.example)
- `RESEND_API_KEY` — contact form email delivery; the API route returns 503 without it (build still works)
- `NEXT_PUBLIC_GA_ID` — Google Analytics 4; GA scripts only injected when set

## File Structure (key areas)
```
app/
  layout.jsx            — Root layout (fonts, metadata, SmoothScroll wrapper,
                          BrandBackgroundGate, Navbar, Footer, AIWidget, GA4)
  page.jsx              — Homepage
  globals.css           — @theme tokens, keyframes, glass/card system, utilities
  og/route.jsx          — Dynamic OG image generation
  about/ blog/ blog/[slug]/ contact/ use-cases/ use-cases/[slug]/
  products/page.jsx     — Solutions overview + comparison table
  products/[slug]/      — Individual product pages (SSG)
  products/[slug]/pricing/ — Per-product pricing pages
  consultancy/ custom-development/ — Service pages
  design/icons/         — Internal icon reference page
  terms/ privacy/ opt-in/ — LIVE legal pages (DO NOT MODIFY CONTENT)
  api/contact/route.js  — Contact form endpoint (Resend)

components/
  ui/        — Button, Badge, AnimatedSection, CountUp, SplitText, IconBox,
               Logo, ProductLogos, BrandLogos
  sections/  — Hero, ScrollProductShowcase, HowItWorks, Stats, Testimonials,
               IntegrationStrip, CTASection, ContactForm, OptInForm, industry/
  sections/showcase/ — Scroll-driven product showcase: device mockups
               (phone/laptop/monitor/browser) + per-product screens
  design/    — Site-wide design layer: SmoothScroll (Lenis+GSAP),
               BrandBackground/Gate (route-aware), GrainOverlay, HomeWatermark,
               SectionReveal, SerifAccent, MagneticButton, CustomCursor
  pricing/   — PricingCard, BillingToggle, FeatureComparison, etc.
  layout/    — Navbar, Footer, ScrollToTop, JsonLd
  product/   — DemoVisualization (interactive per-product), FAQAccordion
  widgets/   — AIWidget (Chat/Voice/Avatar floating panel)

lib/brand.js            — SINGLE SOURCE OF TRUTH for brand constants
                          (colors + tonal scales, fonts, contact, social)
lib/industries.js       — Industry data for use-cases pages
lib/mdx.js              — MDX blog utilities
data/products.js        — 9 solutions with full data incl. pricing tiers
content/blog/           — MDX blog posts
docs/plans/ docs/specs/ — Design/implementation history (read before redesigning)
tests/                  — Playwright visual specs + snapshots
.github/workflows/ci.yml — CI: lint + build (Node 22)
```

## Design System

### Fonts
- Headings/Display: Roboto (--font-roboto; --font-display and --font-sans both resolve to it, and h1-h6 are forced to it in globals.css). ONE display face site-wide.
- Hero headline only: Russo One (--font-russo, .hero-display)
- Body: Inter (--font-inter, exposed as --font-body, body default)
- Mono: JetBrains Mono (--font-jetbrains, exposed as --font-mono)
- Serif accent: Fraunces (--font-fraunces, intentional accent words/SerifAccent only)

### Color Palette (single source of truth: lib/brand.js)
- Primary: #3859a8 (royal blue)
- Primary Dark: #2a4688 (hover)
- Navy: #0f1129 (footer, deep sections)
- Accent: #3B82F6 (sapphire blue, UI accent only). The old cyan #22D3EE is RETIRED and enforced by `npm run lint:colors`
- Logo Muted: #8ca3cc (logo dots, "Labs" wordmark on dark bg; === primary-300)
- Background: #FAFBFD / Alt: #F4F6FB
- Text: #0F1129 / Secondary: #4A4D6A / Muted: #6B7098 (WCAG AA)
- Full tonal scales (primary/navy/accent 50–950) live in lib/brand.js and mirror @theme tokens in app/globals.css
- Edit colors and other brand constants in `lib/brand.js`, then sync the @theme tokens in `app/globals.css`. Use scale tokens, not ad-hoc rgba() tints

### CSS Utility Classes (defined in globals.css)
- `.glass` / `.glass-hover` / `.glass-dark` — frosted glass surfaces
- `.card` / `.card-premium` — white card with hover shadow / gradient border
- `.text-gradient` — gradient text
- `.btn-gradient` — primary CTA background gradient
- `.gradient-divider` — 1px horizontal gradient separator
- `.badge` — small pill badge
- `.nav-link-hover` — underline on hover

### Design Rules
- Light theme ONLY
- NO emojis in UI
- Icons: lucide-react, strokeWidth 1.5
- Border radius: 10-12px buttons, 14-16px icons, 20px cards
- Quality benchmark: Linear.app, Vercel.com, Stripe.com
- Target audience: SMB (no self-signup, contact-based sales)

## Animation Rules (STRICT)
1. Site-wide smooth scroll: Lenis + GSAP ScrollTrigger via SmoothScroll in root layout; respects prefers-reduced-motion. Register ScrollTrigger-driven sections against this setup (see ScrollProductShowcase, SectionReveal)
2. Scroll reveal: AnimatedSection (whileInView, 20px, easeOut)
3. Hover lift: translateY(-2px) + shadow (card/card-premium CSS)
4. Button: hover scale(1.02), tap scale(0.98)
5. Hero: CSS keyframe orbs, rings, orbit dots, waveform bars
6. CountUp: number animation on scroll
7. Background layer: route-aware BrandBackgroundGate (fixed blob + masked grain + homepage watermark) — the ONLY allowed full-page background treatment
8. Hero "alive" layer: auto-playing AI conversation demo (typewriter transcript, loops) + headline word-cycling (CyclingWord in Hero.jsx). Both respect prefers-reduced-motion (static transcript / no cycling)
9. Card tilt: TiltCard (components/design) — cursor tilt capped at 4° + soft-light sheen; rAF-throttled, inert under reduced motion. Used on testimonial cards; allowed on premium cards as the exception to rule 3
10. Shine sweep: `.btn-shine` class on gradient CTAs (one-way sweep on hover, snaps back)
11. Marquee: `.marquee` / `.marquee-track` / `.marquee-reverse` (globals.css) — duplicated content, translateX(-50% - gap/2) loop, pause on hover, disabled under reduced motion
12. Aurora background: BrandBackground's three blurred radial layers drift on ALL routes (atmosphere-drift-1/2/3, 22s/28s/36s, transform-only). Hero section is transparent so the aurora shows through; other homepage sections stay solid
13. Hero depth: mouse parallax (springs, orb +, notification cards −) + FloatingNotifications (3 glass cards cycling business events every ~4s). Inert on touch and reduced motion
14. Stat rings: motion.circle pathLength draws a partial radial ring around stat icons in sync with CountUp
15. Beam line: `.beam-line` — 1px rail with a traveling highlight (CTA band top edge)
16. Page transitions: app/template.jsx fades each route in, opacity ONLY (a transform would break GSAP ScrollTrigger pinning)
17. NO canvas backgrounds, particles, blur reveals

## Homepage Section Order
HeroConsole > SolutionsBento > HowItWorks > Stats > Testimonials > IntegrationStrip > CTASection
- HeroConsole: editorial centered headline (Fraunces italic cycling word) over a "Live Console" glass panel (typewriter call transcript + streaming activity feed + stats strip)
- SolutionsBento: asymmetric bento grid of the 9 solutions (large Receptionist anchor tile with live micro-visual, wide Messenger + Devs tiles, compact tiles, navy CTA tile)
- TestimonialSpotlight: single customer quote card (between IntegrationStrip and LiveConsole)
- Hero.jsx (voice orb), ScrollProductShowcase, LogoCloud, HomeWatermark are unused on the homepage but kept in the codebase

## Contact Info
- Email: contact@jotillabs.com
- Phone: +1 (358) 900-0040
- Location: Lehi, Utah

## Critical Legal Pages — DO NOT MODIFY CONTENT
- /terms — Terms & Conditions (Twilio/TCPA compliance, LIVE with customers)
- /opt-in — Opt-In Consent (Twilio A2P 10DLC compliance, LIVE with customers)
- /privacy — Privacy Policy (LIVE with customers)
- All linked in footer

## Git Info
- Remote: https://github.com/Jotil-Labs/jotil_labs_website.git
- Branch: redesign/nextjs-migration (current work)
- Production: main branch → Vercel auto-deploy
- CI (`.github/workflows/ci.yml`) runs lint + build on pushes to main and redesign/**, and on PRs to main; must pass before merge

## Messaging Rules (STRICT)
- Present from the CUSTOMER's perspective, not the company's
- Frame everything as outcomes: what the customer GETS, not what we built
- No product catalog language ("Six AI Products", "Inbound Voice", "Outbound")
- Use "Solutions" not "Products" in navigation
- No em-dashes in customer-facing copy (use periods or commas)
- No emojis anywhere
- No technical jargon (API, SDK, LLM, pipeline, etc.) in customer-facing copy
- Benchmark: Intercom, HubSpot, Dialpad messaging style

## Conventions
- JSX only (NOT TypeScript)
- PascalCase components
- Tailwind utility classes preferred
- No Co-Authored-By in commits
- No Lorem ipsum, real copy only
- Responsive mobile-first
- GitHub Issues for tracking, feature branches, PRs with test plans
- Check docs/plans/ and docs/specs/ for prior design decisions before reworking a section

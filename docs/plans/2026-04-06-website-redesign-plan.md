# Jotil Labs Website Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild jotillabs.com from React+Vite SPA to Next.js 15 App Router with 5 branded product pages, blog, use cases, premium editorial design, SEO optimization, and unified AI widget.

**Architecture:** Next.js 15 App Router with static generation (SSG) for all pages. MDX for blog. Framer Motion for animations. Tailwind CSS v4 for styling. Vercel for deployment with GitHub Actions CI/CD.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS v4, Framer Motion, Lucide React, MDX (next-mdx-remote + gray-matter), Recharts, Vercel AI SDK, next-sitemap, @vercel/analytics

---

## Phase 1: Project Bootstrap & Foundation

### Task 1: Initialize Next.js project in existing repo

**Files:**
- Delete: All files in `src/`, `vite.config.js`, `index.html`
- Create: `next.config.js`, `tsconfig.json` (jsconfig.json), `app/layout.jsx`, `app/page.jsx`
- Modify: `package.json`

**Step 1:** Remove old Vite files and src/ directory (preserve git history)
```bash
rm -rf src/ vite.config.js index.html eslint.config.js
```

**Step 2:** Initialize Next.js 15 with App Router
```bash
npx create-next-app@latest . --js --app --tailwind --eslint --no-src-dir --import-alias "@/*" --use-npm
```
Note: Since directory exists, may need to merge. Alternatively, create fresh and copy.

**Step 3:** Install all dependencies
```bash
npm install framer-motion lucide-react clsx tailwind-merge recharts next-mdx-remote gray-matter next-sitemap @vercel/analytics reading-time
```

**Step 4:** Verify dev server starts
```bash
npm run dev
```

**Step 5:** Commit
```bash
git add -A && git commit -m "chore: migrate from Vite to Next.js 15 App Router"
```

### Task 2: Set up design system (CSS, fonts, tokens)

**Files:**
- Create: `app/globals.css`
- Create: `app/layout.jsx` (root layout with fonts, metadata)
- Create: `lib/utils.js` (cn helper)

**Step 1:** Create globals.css with Tailwind v4 theme, all keyframes, glass system, gradient utilities — ported from old index.css but updated with new color palette (#3B7BF2, #1B4FBA, #2D6AE0) and Outfit + Inter fonts.

**Step 2:** Create root layout.jsx with:
- Google Fonts: Outfit (400-800) + Inter (400-600) + JetBrains Mono
- Global metadata: title, description, OG tags, icons
- Vercel Analytics component
- Body with font classes

**Step 3:** Create lib/utils.js with cn() helper (clsx + tailwind-merge)

**Step 4:** Verify fonts render correctly
```bash
npm run dev
```

**Step 5:** Commit
```bash
git add -A && git commit -m "feat: set up design system with Outfit font and blue palette"
```

### Task 3: Create shared UI components

**Files:**
- Create: `components/ui/Button.jsx`
- Create: `components/ui/Card.jsx`
- Create: `components/ui/Badge.jsx`
- Create: `components/ui/AnimatedSection.jsx`
- Create: `components/ui/CountUp.jsx`
- Create: `components/ui/IconBox.jsx`
- Create: `components/ui/SplitText.jsx`

Port from old codebase, updating:
- `Link` from `react-router-dom` → `next/link`
- Remove `motion` from `framer-motion` where using `react-router` specific APIs
- Update color references to new palette
- Update font references

**Step 1:** Create each component file, adapted for Next.js
**Step 2:** Verify imports work
**Step 3:** Commit
```bash
git add -A && git commit -m "feat: port UI components to Next.js"
```

### Task 4: Create Logo components (from brand HTML)

**Files:**
- Create: `components/ui/JotilLabsLogo.jsx` (main company logo with hex + animated dots)
- Create: `components/ui/ProductLogos.jsx` (all 5 product logos as React SVG components with animations)
- Create: `public/favicon.ico` (generated from hex logo)
- Create: `public/favicon.svg`
- Create: `public/apple-touch-icon.png` (placeholder)
- Create: `app/icon.svg` (Next.js favicon)

Convert the SVG hex logos from the brand HTML into React components. Each product logo is the shared hex container + unique accent element (dots, waveform, outlined dots, planes, shapes, flow lines) with CSS keyframe animations.

**Step 1:** Create JotilLabsLogo.jsx — the parent brand hex with heartbeat dots
**Step 2:** Create ProductLogos.jsx — exports ReceptionistLogo, MessengerLogo, OutreachLogo, SpaceLogo, FlowLogo
**Step 3:** Create favicon.svg from hex shape
**Step 4:** Commit
```bash
git add -A && git commit -m "feat: add brand logo components and favicon"
```

### Task 5: Create layout components (Navbar, Footer)

**Files:**
- Create: `components/layout/Navbar.jsx`
- Create: `components/layout/Footer.jsx`

**Step 1:** Port Navbar from old codebase:
- `Link` → `next/link`
- `useLocation` → `usePathname` from `next/navigation`
- Update NAV_LINKS to include new pages (Products dropdown, Use Cases, About, Blog, Contact)
- Add products dropdown menu showing all 5 products
- Keep mobile menu
- Update logo to JotilLabsLogo component

**Step 2:** Port Footer:
- Update PRODUCT_LINKS to 5 new products with correct routes
- Update COMPANY_LINKS to include Blog, Use Cases
- Keep social links, legal links
- Preserve contact info (contact@jotillabs.com, Lehi Utah)

**Step 3:** Verify navigation works
**Step 4:** Commit
```bash
git add -A && git commit -m "feat: add Navbar and Footer with product navigation"
```

---

## Phase 2: Homepage

### Task 6: Homepage Hero section

**Files:**
- Create: `app/page.jsx`
- Create: `components/sections/Hero.jsx`

Hero with:
- Large Outfit headline "AI That Talks, Texts & Works For You"
- Subtitle about Jotil Labs
- CTA buttons: "Explore Products" + "Book a Demo"
- JotilLabs hex logo (large, animated heartbeat dots)
- CSS gradient orb background (ported from old Hero)
- Voice Orb visualization (ported and adapted)

**Step 1:** Create Hero.jsx with all sub-components
**Step 2:** Create homepage page.jsx importing Hero
**Step 3:** Verify renders correctly
**Step 4:** Commit

### Task 7: Homepage sections (Social Proof, Products, How It Works)

**Files:**
- Create: `components/sections/LogoCloud.jsx`
- Create: `components/sections/ProductShowcase.jsx`
- Create: `components/sections/HowItWorks.jsx`

**Step 1:** LogoCloud — "Trusted by X+ businesses" with placeholder company logos
**Step 2:** ProductShowcase — 5 cards, each with animated product hex icon, name, badge, one-liner, "Learn more" link
**Step 3:** HowItWorks — 3-step visual: Connect → Automate → Scale
**Step 4:** Commit

### Task 8: Homepage sections (Stats, Demo Strip, Industry, Testimonials, Integrations, CTA)

**Files:**
- Create: `components/sections/Stats.jsx`
- Create: `components/sections/DemoStrip.jsx`
- Create: `components/sections/IndustrySolutions.jsx`
- Create: `components/sections/Testimonials.jsx`
- Create: `components/sections/IntegrationStrip.jsx`
- Create: `components/sections/CTASection.jsx`

**Step 1:** Stats — animated counters (calls handled, messages, hours saved, uptime)
**Step 2:** DemoStrip — "Talk to our AI right now" section with widget trigger
**Step 3:** IndustrySolutions — 4-6 industry cards (Healthcare, Real Estate, Legal, etc.)
**Step 4:** Testimonials — carousel with placeholder quotes
**Step 5:** IntegrationStrip — logo grid (Twilio, OpenAI, Slack, HubSpot, etc.)
**Step 6:** CTASection — "Ready to automate?" gradient CTA
**Step 7:** Wire all into homepage page.jsx
**Step 8:** Commit

---

## Phase 3: Product Pages

### Task 9: Product data structure

**Files:**
- Create: `data/products.js`

Define all 5 products with:
- slug, name, tagline, badge, description
- services array (2-3 sub-services each with name, description, features)
- features array (6-8 features with icon, title, description)
- integrations array
- pricing tiers (Starter/Pro/Enterprise or "Contact for pricing")
- FAQ items
- hex accent type (for logo selection)

**Step 1:** Write complete product data file
**Step 2:** Commit

### Task 10: Products overview page

**Files:**
- Create: `app/products/page.jsx`

**Step 1:** Hero with all 5 hex icons
**Step 2:** Product grid — 5 large cards with logo, name, badge, services list, CTA
**Step 3:** Comparison feature matrix table
**Step 4:** CTA section
**Step 5:** Commit

### Task 11: Individual product page template

**Files:**
- Create: `app/products/[slug]/page.jsx`
- Create: `components/product/ProductHero.jsx`
- Create: `components/product/ServiceBreakdown.jsx`
- Create: `components/product/DemoVisual.jsx`
- Create: `components/product/FeaturesGrid.jsx`
- Create: `components/product/PricingTable.jsx`
- Create: `components/product/ProductFAQ.jsx`

**Step 1:** Create ProductHero — large animated product logo, name, tagline, badge, gradient mesh BG
**Step 2:** Create ServiceBreakdown — 2-3 detailed cards for sub-services
**Step 3:** Create DemoVisual — unique per product:
  - Receptionist: phone call UI animation (ringing → answer → transcript)
  - Messenger: chat bubble conversation animation
  - Outreach: campaign dashboard with dispatching animation
  - Space: multi-panel workspace mockup
  - Flow: workflow node builder visualization
**Step 4:** Create FeaturesGrid — icon + title + description grid
**Step 5:** Create PricingTable — 3 tier cards or "Contact for pricing"
**Step 6:** Create ProductFAQ — accordion
**Step 7:** Wire into [slug]/page.jsx with generateStaticParams
**Step 8:** Add generateMetadata for SEO
**Step 9:** Commit

---

## Phase 4: Use Cases & About

### Task 12: Use Cases page

**Files:**
- Create: `app/use-cases/page.jsx`
- Create: `data/industries.js`
- Create: `components/sections/ROICalculator.jsx`

**Step 1:** Create industries data (Healthcare, Real Estate, Legal, Hospitality, Finance, E-commerce)
**Step 2:** Hero section
**Step 3:** Industry cards with pain points, Jotil solutions, ROI stats
**Step 4:** ROI Calculator — input call volume, handle time → shows savings
**Step 5:** CTA to demo widget
**Step 6:** Commit

### Task 13: About page

**Files:**
- Create: `app/about/page.jsx`

Port and enhance from old About.jsx:
- Keep team data (Sayeed Sajal CEO, Saikat Das COO, Qudrat E Alahy Ratul CTO)
- Keep company story, mission, vision, values
- Keep stats
- Add timeline (unhide it)
- Update styling to new design system
- `Link` → `next/link`

**Step 1:** Port About page
**Step 2:** Commit

---

## Phase 5: Blog

### Task 14: Blog infrastructure

**Files:**
- Create: `lib/mdx.js` (MDX utilities: getAllPosts, getPostBySlug)
- Create: `content/blog/` directory
- Create: `components/blog/PostCard.jsx`
- Create: `components/blog/PostLayout.jsx`
- Create: `components/blog/TableOfContents.jsx`

**Step 1:** Create MDX utility functions (read .mdx files, parse frontmatter, sort by date)
**Step 2:** Create PostCard component (thumbnail, title, excerpt, date, category, reading time)
**Step 3:** Create PostLayout (article layout with TOC sidebar, share buttons, related posts)
**Step 4:** Commit

### Task 15: Blog pages and sample posts

**Files:**
- Create: `app/blog/page.jsx` (listing)
- Create: `app/blog/[slug]/page.jsx` (individual post)
- Create: `content/blog/ai-voice-agents-2026.mdx` (sample post)
- Create: `content/blog/automating-customer-communication.mdx` (sample post)
- Create: `content/blog/choosing-right-ai-platform.mdx` (sample post)

**Step 1:** Create blog listing page with featured post + grid
**Step 2:** Create individual post page with MDX rendering
**Step 3:** Write 3 sample blog posts with proper frontmatter
**Step 4:** Commit

---

## Phase 6: Contact & Legal

### Task 16: Contact page

**Files:**
- Create: `app/contact/page.jsx`
- Create: `app/api/contact/route.js` (API route for form submission)

Port from old Contact.jsx:
- Keep form fields, FAQ, contact info
- Keep phone number, email, location
- Convert to Next.js (Link, usePathname)
- Add API route for form handling (Resend or basic email)

**Step 1:** Port Contact page
**Step 2:** Create API route
**Step 3:** Commit

### Task 17: Legal pages

**Files:**
- Create: `app/terms/page.jsx`
- Create: `app/privacy/page.jsx`
- Create: `app/opt-in/page.jsx`

Port from old legal pages with updated styling.

**Step 1:** Port all three legal pages
**Step 2:** Commit

---

## Phase 7: Widget & Integrations

### Task 18: Unified AI Widget

**Files:**
- Create: `components/widgets/AIWidget.jsx`
- Create: `components/widgets/ChatTab.jsx`
- Create: `components/widgets/VoiceTab.jsx`
- Create: `components/widgets/AvatarTab.jsx`

Unified floating widget with tabs: Chat | Voice | Avatar
- Chat: Text input with Vercel AI SDK (placeholder API connection)
- Voice: Mic button with Retell SDK placeholder
- Avatar: Anam SDK integration placeholder
- Floating button bottom-right, expands to panel

**Step 1:** Create widget shell with tab navigation
**Step 2:** Create ChatTab with message UI
**Step 3:** Create VoiceTab with mic UI
**Step 4:** Create AvatarTab with avatar placeholder
**Step 5:** Add to root layout
**Step 6:** Commit

---

## Phase 8: SEO, Analytics & CI/CD

### Task 19: SEO optimization

**Files:**
- Create: `next-sitemap.config.js`
- Create: `app/sitemap.js` (Next.js sitemap)
- Create: `app/robots.js` (Next.js robots.txt)
- Create: `lib/metadata.js` (SEO helpers, JSON-LD generators)
- Modify: all page files to add generateMetadata

**Step 1:** Create sitemap config
**Step 2:** Create robots.txt
**Step 3:** Add JSON-LD structured data (Organization, Product, FAQ schemas)
**Step 4:** Ensure every page has proper title, description, OG image
**Step 5:** Commit

### Task 20: Analytics & CI/CD

**Files:**
- Create: `.github/workflows/ci.yml`
- Modify: `app/layout.jsx` (add analytics)
- Create: `vercel.json` (updated for Next.js)

**Step 1:** Add Vercel Analytics to root layout
**Step 2:** Add Google Analytics 4 script tag (with env var for measurement ID)
**Step 3:** Create GitHub Actions workflow: lint + build on PR, auto-deploy on merge
**Step 4:** Update vercel.json for Next.js
**Step 5:** Commit

---

## Phase 9: Polish & QA

### Task 21: Responsive testing and polish

**Step 1:** Test all pages at mobile (375px), tablet (768px), desktop (1440px)
**Step 2:** Fix any layout issues
**Step 3:** Test page transitions and animations
**Step 4:** Verify all links work
**Step 5:** Run Lighthouse audit
**Step 6:** Final commit

### Task 22: Build verification

**Step 1:** Run production build
```bash
npm run build
```
**Step 2:** Preview production build
```bash
npm run start
```
**Step 3:** Fix any build errors
**Step 4:** Final commit and push

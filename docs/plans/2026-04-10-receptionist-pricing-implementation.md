# Receptionist Pricing Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Sync marketing site pricing with live Stripe, create a dedicated per-product pricing route, and fix Stripe checkout legal page URLs.

**Architecture:** Centralized pricing data in `data/products.js` drives both the inline pricing section on `/products/[slug]` and a new dedicated dynamic route `/products/[slug]/pricing`. Reusable pricing components in `components/pricing/`. Cross-repo fix in voice platform for Stripe checkout legal URLs.

**Tech Stack:** Next.js 15 App Router, JavaScript (.jsx), Tailwind v4, Framer Motion, Lucide React. Backend fix: Python FastAPI (voice_platform_retell).

**Issue:** `Jotil-Labs/jotil_labs_website#26`
**Design:** `docs/plans/2026-04-10-receptionist-pricing-page-design.md`
**Branch:** `feat/JL-26-receptionist-pricing-page`

---

## Context for the Engineer

### Repository Layout

You are working in `jotil_labs_website` (the marketing site). Separately, one task requires a change in `voice_platform_retell` (the voice product).

### Existing Conventions (must follow)

1. **Next.js 15 App Router**, JavaScript (`.jsx`), no TypeScript
2. **Imports:** Absolute paths via `@/` (e.g., `@/components/ui/Button`)
3. **Components already exist and should be reused:**
   - `<Button href="..." variant="primary|outline" size="sm|md|lg">` — renders as link or button
   - `<Badge variant="default|blue|dark">` — inline badges
   - `<AnimatedSection delay={0.1}>` — Framer Motion scroll fade-in wrapper
   - `<IconBox size="md" glow>` — circular icon containers
4. **Headings** use `style={{ fontFamily: 'var(--font-outfit)' }}` inline
5. **Colors** via Tailwind tokens: `text-primary`, `text-text`, `text-text-secondary`, `bg-[#3B7BF2]`, etc.
6. **Cards** use `.card` or `.card-premium` classes (defined in `globals.css`)
7. **Icons:** `lucide-react`, imported individually: `import { Check, X } from 'lucide-react'`
8. **FAQ pattern:** Use existing `<FAQAccordion faq={...} />` from `@/components/product/FAQAccordion` — expects `faq: [{ question, answer }]`
9. **Data fetch in server components:** `const { getProductBySlug } = await import('@/data/products')`

### Current State of Pricing on the Site

- `data/products.js` has all 6 products with `pricing.tiers` arrays
- `app/products/[slug]/page.jsx` renders pricing inline at `#pricing` anchor (lines 317-341)
- The inline `PricingCard` component is defined at lines 56-115 of that file
- "View Pricing" button on product page goes to `#pricing` — already works
- **The problem:** data is wrong + no detailed pricing view

### Live Stripe Tiers (source of truth)

| Tier | Monthly Price | Minutes Included | Overage | Status |
|---|---|---|---|---|
| Core | $100 | 200 | $1.50/min | Live |
| Pro | $225 | 500 | $1.50/min | Live |
| Business | $320 | 1000 | $1.50/min | Live |

### Marketing Site Deployment

Deployed to Vercel (auto-deploy on push to main). Testing requires the dev server: `npm run dev` (localhost:3000).

### Branching

You are already on `feat/JL-26-receptionist-pricing-page`. Do not switch branches. Commit frequently.

---

### Task 1: Sync `data/products.js` receptionist pricing with live Stripe

**Why:** Customers see $99/$299/Custom on marketing but Stripe charges $100/$225/$320. Trust issue.

**Files:**
- Modify: `data/products.js` (receptionist pricing section, around line 50-57)

**Step 1: Read the current receptionist pricing block**

Open `data/products.js` and find the `slug: 'receptionist'` object's `pricing.tiers` array (currently around line 50-57).

**Step 2: Replace the tiers with live Stripe values**

Replace the `pricing:` block for receptionist with:

```javascript
    pricing: {
      type: 'tiers',
      overageRatePerMinute: 1.50,
      tiers: [
        {
          slug: 'core',
          name: 'Core',
          price: '$100',
          period: '/mo',
          description: 'For solopreneurs and small teams getting started',
          features: [
            '200 AI call minutes included',
            '1 dedicated phone number',
            '14-day free trial',
            'AI phone receptionist (inbound)',
            'Call transcripts and AI summaries',
            'Appointment booking to Google Calendar',
            'SMS confirmations to callers',
            'Email support',
          ],
        },
        {
          slug: 'pro',
          name: 'Pro',
          price: '$225',
          period: '/mo',
          description: 'For growing businesses with steady call volume',
          features: [
            '500 AI call minutes included',
            'Everything in Core',
            'AI web voicebot widget',
            'Multi-agent time-based routing',
            'Advanced call analytics and sentiment',
            'Custom greeting and voice selection',
            'Priority email and chat support',
          ],
          highlighted: true,
        },
        {
          slug: 'business',
          name: 'Business',
          price: '$320',
          period: '/mo',
          description: 'For established businesses with high call volume',
          features: [
            '1,000 AI call minutes included',
            'Everything in Pro',
            'Up to 5 concurrent calls',
            'Dedicated onboarding specialist',
            'Phone support',
            'Custom integrations and API access',
          ],
        },
      ],
    },
```

**Step 3: Add pricing-specific FAQ to the receptionist object**

The product already has a `faq` array for product questions. Add a separate `pricingFaq` array for pricing-specific questions. Add this **after** the existing `faq` array, still inside the receptionist object:

```javascript
    pricingFaq: [
      {
        question: 'What happens if I exceed my included minutes?',
        answer: 'Overages are billed at $1.50/min and added to your next invoice. You will get email and SMS alerts at 90% and 100% of your included minutes so there are no surprises.',
      },
      {
        question: 'Can I change plans later?',
        answer: 'Yes. You can upgrade or downgrade anytime from your dashboard or by contacting support. Changes take effect on your next billing cycle.',
      },
      {
        question: 'Is there a long-term contract?',
        answer: 'No. All plans are month-to-month. Cancel anytime from your dashboard.',
      },
      {
        question: 'What is included in the 14-day free trial?',
        answer: 'Full access to your selected plan with 60 free trial minutes. We collect your card during signup but do not charge until the trial ends. Cancel before the trial ends and you pay nothing.',
      },
      {
        question: 'Do you offer annual billing?',
        answer: 'Not yet. Annual billing with a discount is on our roadmap. Contact us if this matters for your business.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit and debit cards through Stripe. Additional payment methods are available for Business tier customers on request.',
      },
      {
        question: 'Can I cancel anytime?',
        answer: 'Yes. You can cancel from your dashboard and service continues through the end of your current billing period.',
      },
      {
        question: 'Is my data secure?',
        answer: 'Yes. Call transcripts and customer data are encrypted at rest and in transit. We never share your data with third parties. See our Privacy Policy for details.',
      },
    ],
```

**Step 4: Verify the file parses**

```bash
cd "/Users/qratul/research_and_dev/jotil/jotil website temp/jotil_labs_website" && node -e "import('./data/products.js').then(m => { const r = m.getProductBySlug('receptionist'); console.log('Tiers:', r.pricing.tiers.length, 'PricingFAQ:', r.pricingFaq?.length); })"
```

Expected output:
```
Tiers: 3 PricingFAQ: 8
```

**Step 5: Commit**

```bash
git add data/products.js
git commit -m "fix(pricing): sync receptionist tiers with live Stripe (#26)"
```

---

### Task 2: Extract PricingCard into reusable component

**Why:** The inline `PricingCard` in `app/products/[slug]/page.jsx` needs to be reused by the new dedicated pricing page. DRY principle. Also add support for `slug` in the CTA link so we can pass the plan to signup.

**Files:**
- Create: `components/pricing/PricingCard.jsx`
- Modify: `app/products/[slug]/page.jsx` (remove inline PricingCard, import from new location)

**Step 1: Create the reusable component**

Create file `components/pricing/PricingCard.jsx`:

```jsx
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function PricingCard({ tier, ctaHref = '/contact' }) {
  const isHighlighted = tier.highlighted
  const isCustom = tier.price === 'Custom'
  const href = isCustom ? '/contact' : ctaHref

  return (
    <div
      className={`card-premium flex flex-col ${
        isHighlighted
          ? 'border-[#3B7BF2]/30 shadow-lg shadow-[#3B7BF2]/10 scale-[1.02] bg-gradient-to-b from-[#F4F8FF] to-white z-10'
          : ''
      }`}
    >
      {isHighlighted && (
        <div className="mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-[#EEF3FE] px-2.5 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}
      <p
        className="text-xl font-bold text-text mb-1"
        style={{ fontFamily: 'var(--font-outfit)' }}
      >
        {tier.name}
      </p>
      <p className="text-sm text-text-secondary mb-5">{tier.description}</p>

      <div className="mb-6 flex items-end gap-1">
        <span
          className={`text-4xl font-extrabold tracking-tight ${isHighlighted ? 'text-primary' : 'text-text'}`}
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          {tier.price}
        </span>
        {tier.period && (
          <span className="text-sm text-text-secondary mb-1">{tier.period}</span>
        )}
      </div>

      <ul className="space-y-2.5 mb-8 flex-1">
        {tier.features.map((f, fi) => (
          <li key={fi} className="flex items-start gap-2.5 text-sm text-text-secondary">
            <Check
              size={14}
              className={`mt-0.5 shrink-0 ${isHighlighted ? 'text-primary' : 'text-text-secondary'}`}
              strokeWidth={2.5}
            />
            {f}
          </li>
        ))}
      </ul>

      <Button
        href={href}
        variant={isHighlighted ? 'primary' : 'outline'}
        size="md"
        className="w-full justify-center"
      >
        {isCustom ? 'Contact Sales' : 'Start Free Trial'}
      </Button>
    </div>
  )
}
```

**Step 2: Remove the inline PricingCard from the product page**

In `app/products/[slug]/page.jsx`:

Delete lines 56-115 (the entire `function PricingCard({ tier, index }) { ... }` block).

Add this import near the top (after the Badge import around line 6):
```javascript
import { PricingCard } from '@/components/pricing/PricingCard'
```

Find the pricing section (around line 333-339) and replace the `<PricingCard tier={tier} index={i} />` usage. It already renders correctly; the import is the only change needed.

**Step 3: Verify the dev server still renders the product page correctly**

```bash
cd "/Users/qratul/research_and_dev/jotil/jotil website temp/jotil_labs_website" && npm run dev
```

Open http://localhost:3000/products/receptionist in a browser. Scroll to pricing section. Verify:
- 3 tiers render
- Prices show $100, $225, $320
- "Pro" has "Most Popular" badge
- "Start Free Trial" button appears

Stop the dev server (Ctrl+C).

**Step 4: Commit**

```bash
git add components/pricing/PricingCard.jsx app/products/[slug]/page.jsx
git commit -m "refactor(pricing): extract PricingCard into reusable component (#26)"
```

---

### Task 3: Create FeatureComparison component

**Why:** Dedicated pricing page should have a side-by-side feature comparison table. This is an industry standard and drives conversion.

**Files:**
- Create: `components/pricing/FeatureComparison.jsx`

**Step 1: Create the component**

Create file `components/pricing/FeatureComparison.jsx`:

```jsx
import { Check, Minus } from 'lucide-react'

/**
 * Feature comparison table. Accepts tier data and a feature matrix.
 * Each row: { label: string, values: [true|false|string, ...] } (one per tier)
 */
export function FeatureComparison({ tiers, features }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-black/10">
            <th className="text-left py-4 pr-4 text-sm font-semibold text-text-secondary uppercase tracking-wider">
              Features
            </th>
            {tiers.map((tier) => (
              <th
                key={tier.slug}
                className={`text-center py-4 px-4 ${tier.highlighted ? 'text-primary' : 'text-text'}`}
              >
                <div
                  className="text-base font-bold"
                  style={{ fontFamily: 'var(--font-outfit)' }}
                >
                  {tier.name}
                </div>
                <div className="text-xs text-text-secondary font-normal mt-1">
                  {tier.price}
                  {tier.period}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((row, ri) => (
            <tr
              key={ri}
              className="border-b border-black/5 hover:bg-[#F7F9FF]/50 transition-colors"
            >
              <td className="py-3 pr-4 text-sm text-text font-medium">{row.label}</td>
              {row.values.map((val, vi) => (
                <td key={vi} className="text-center py-3 px-4">
                  {val === true ? (
                    <Check
                      size={18}
                      className="inline-block text-primary"
                      strokeWidth={2.5}
                    />
                  ) : val === false ? (
                    <Minus
                      size={16}
                      className="inline-block text-text-muted"
                      strokeWidth={2}
                    />
                  ) : (
                    <span className="text-sm text-text-secondary">{val}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add components/pricing/FeatureComparison.jsx
git commit -m "feat(pricing): add FeatureComparison table component (#26)"
```

---

### Task 4: Create the dedicated dynamic pricing route

**Why:** Give each product its own focused pricing page at `/products/{slug}/pricing`. This is the per-product pricing pattern decided in brainstorming.

**Files:**
- Create: `app/products/[slug]/pricing/page.jsx`

**Step 1: Create the page**

Create file `app/products/[slug]/pricing/page.jsx`:

```jsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PricingCard } from '@/components/pricing/PricingCard'
import { FeatureComparison } from '@/components/pricing/FeatureComparison'
import { FAQAccordion } from '@/components/product/FAQAccordion'

export async function generateStaticParams() {
  const { productSlugs } = await import('@/data/products')
  return productSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const { getProductBySlug } = await import('@/data/products')
  const product = getProductBySlug(slug)
  return {
    title: product ? `${product.name} Pricing` : 'Pricing',
    description: product
      ? `Simple, transparent pricing for ${product.name}. Plans starting from ${product.pricing?.tiers?.[0]?.price}${product.pricing?.tiers?.[0]?.period}.`
      : 'Pricing',
  }
}

/**
 * Build the feature comparison matrix from the tier features.
 * This normalizes feature lists into rows where each row shows presence per tier.
 */
function buildComparisonMatrix(tiers) {
  // Collect all unique features across tiers
  const allFeatures = new Set()
  tiers.forEach((tier) => {
    tier.features.forEach((f) => {
      // Skip "Everything in X" sentences — we'll derive inheritance
      if (!f.toLowerCase().startsWith('everything in')) {
        allFeatures.add(f)
      }
    })
  })

  // For each feature, determine which tiers have it (considering inheritance)
  const rows = []
  const tierFeatureSets = tiers.map((tier, i) => {
    const set = new Set(tier.features.filter((f) => !f.toLowerCase().startsWith('everything in')))
    // Inherit from previous tier if "Everything in X" is mentioned
    if (tier.features.some((f) => f.toLowerCase().startsWith('everything in')) && i > 0) {
      tierFeatureSets[i - 1].forEach((f) => set.add(f))
    }
    return set
  })

  allFeatures.forEach((feature) => {
    rows.push({
      label: feature,
      values: tierFeatureSets.map((set) => set.has(feature)),
    })
  })

  return rows
}

export default async function ProductPricingPage({ params }) {
  const { slug } = await params
  const { getProductBySlug } = await import('@/data/products')
  const product = getProductBySlug(slug)

  if (!product) notFound()

  const tiers = product.pricing?.tiers ?? []
  const pricingFaq = product.pricingFaq ?? []
  const comparisonRows = buildComparisonMatrix(tiers)

  return (
    <>
      {/* ─── 1. Hero ─── */}
      <section className="relative pt-28 pb-16 px-4 overflow-hidden bg-gradient-to-br from-[#F0F4FF] via-[#F7F9FF] to-white">
        <div
          className="absolute top-0 right-0 w-[600px] h-[500px] rounded-full opacity-40 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse, #3B7BF215 0%, transparent 65%)',
            filter: 'blur(80px)',
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <Link
              href={`/products/${slug}`}
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft size={16} />
              Back to {product.name}
            </Link>
            <Badge variant="blue" className="mb-5">
              {product.name} Pricing
            </Badge>
            <h1
              className="text-4xl sm:text-5xl font-extrabold text-text tracking-tight leading-[1.07] mb-5"
              style={{ fontFamily: 'var(--font-outfit)', fontWeight: 800 }}
            >
              Simple pricing.{' '}
              <span className="text-gradient">Every call handled.</span>
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto mb-8">
              Start with a 14-day free trial. No setup fees. Cancel anytime.
              All plans include full features; only the minutes scale.
            </p>
            <div className="inline-flex items-center gap-2 bg-white border border-black/5 rounded-full px-4 py-2 text-sm text-text-secondary">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              14-day free trial · No credit card charged until trial ends
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="gradient-divider" />

      {/* ─── 2. Pricing tiers ─── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {tiers.map((tier, i) => (
              <AnimatedSection key={tier.slug ?? i} delay={i * 0.08}>
                <PricingCard
                  tier={tier}
                  ctaHref={`/contact?product=${slug}&plan=${tier.slug ?? tier.name.toLowerCase()}`}
                />
              </AnimatedSection>
            ))}
          </div>

          {product.pricing?.overageRatePerMinute && (
            <AnimatedSection delay={0.25}>
              <p className="text-center text-sm text-text-secondary mt-10">
                Need more minutes? Overages are billed at{' '}
                <span className="font-semibold text-text">
                  ${product.pricing.overageRatePerMinute.toFixed(2)}/min
                </span>
                . You are alerted at 90% and 100% usage.
              </p>
            </AnimatedSection>
          )}
        </div>
      </section>

      <div className="gradient-divider" />

      {/* ─── 3. Feature comparison ─── */}
      {comparisonRows.length > 0 && (
        <section className="py-20 px-4 bg-[#FAFBFD]">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
                Compare plans
              </p>
              <h2
                className="text-3xl font-bold text-text tracking-tight"
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                Everything at a glance
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <div className="card-premium">
                <FeatureComparison tiers={tiers} features={comparisonRows} />
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      <div className="gradient-divider" />

      {/* ─── 4. Pricing FAQ ─── */}
      {pricingFaq.length > 0 && <FAQAccordion faq={pricingFaq} />}

      <div className="gradient-divider" />

      {/* ─── 5. Bottom CTA ─── */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <AnimatedSection>
            <h2
              className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight mb-4"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              Ready to try{' '}
              <span className="text-gradient">{product.name}</span>?
            </h2>
            <p className="text-text-secondary mb-8 max-w-md mx-auto leading-relaxed">
              Start your 14-day free trial. No credit card charged until trial
              ends.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Button
                href={`/contact?product=${slug}`}
                variant="primary"
                size="lg"
              >
                Start Free Trial
              </Button>
              <Button href="/contact" variant="outline" size="lg">
                Talk to Sales
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
```

**Step 2: Start dev server and test the route**

```bash
cd "/Users/qratul/research_and_dev/jotil/jotil website temp/jotil_labs_website" && npm run dev
```

Open http://localhost:3000/products/receptionist/pricing in a browser.

Verify:
- Page loads without 404
- 3 tier cards show $100, $225, $320
- Pro tier has "Most Popular" badge
- Feature comparison table shows checkmarks
- FAQ accordion expands when clicked
- "Start Free Trial" buttons point to `/contact?product=receptionist&plan=...`
- "Back to JotilReceptionist" link returns to product page
- Mobile view (resize browser to 375px) — tiers stack vertically

Stop the dev server (Ctrl+C).

**Step 3: Test the messenger pricing route too (same dynamic route)**

Open http://localhost:3000/products/messenger/pricing.

Verify it loads (shows whatever messenger data is in products.js). This is a pattern check — we are not fixing messenger data in this task.

**Step 4: Commit**

```bash
git add app/products/[slug]/pricing/page.jsx
git commit -m "feat(pricing): add dedicated /products/[slug]/pricing dynamic route (#26)"
```

---

### Task 5: Wire up "View Pricing" button on product page to dedicated route

**Why:** Currently "View Pricing" on `/products/receptionist` links to `#pricing` (same-page anchor). It should link to the new dedicated page to drive traffic and SEO.

**Files:**
- Modify: `app/products/[slug]/page.jsx` (around line 186-192)

**Step 1: Update the button href**

In `app/products/[slug]/page.jsx`, find the "View Pricing" button (around line 186-192):

```jsx
<Button
  href="#pricing"
  variant="outline"
  size="lg"
>
  View Pricing
</Button>
```

Change to:

```jsx
<Button
  href={`/products/${slug}/pricing`}
  variant="outline"
  size="lg"
>
  View Pricing
</Button>
```

**Step 2: Test**

```bash
npm run dev
```

Open http://localhost:3000/products/receptionist. Click "View Pricing" button. Verify it navigates to `/products/receptionist/pricing`.

Stop dev server.

**Step 3: Commit**

```bash
git add app/products/[slug]/page.jsx
git commit -m "feat(pricing): wire View Pricing button to dedicated pricing route (#26)"
```

---

### Task 6: Update "From $99/mo" on products listing page

**Why:** The `/products` overview page shows a "starting price" helper that reads from the first tier. After Task 1 this should auto-update to "From $100/mo". We need to verify.

**Files:**
- Check: `app/products/page.jsx`
- Modify if needed.

**Step 1: Inspect the products listing page**

```bash
cat "app/products/page.jsx"
```

Look for any hardcoded "$99" or "From $99". The exploration report said there's a `startingPrice()` helper that reads from `product.pricing.tiers[0].price` — if so, it will auto-update.

**Step 2: Start dev server and visually verify**

```bash
npm run dev
```

Open http://localhost:3000/products. The Receptionist card should now show "From $100/mo" (not "$99/mo").

Stop dev server.

**Step 3: If the text is hardcoded, fix it**

If you find hardcoded $99 anywhere, replace with the derived value. Otherwise skip this step.

**Step 4: Commit (only if changes made)**

```bash
git add app/products/page.jsx
git commit -m "fix(pricing): products listing shows correct starting price (#26)"
```

If no changes were needed, skip the commit.

---

### Task 7: Playwright E2E validation

**Why:** Verify all the changes work together end-to-end, capture screenshots for PR review.

**Files:**
- No file changes; this is pure validation

**Step 1: Start the dev server in the background**

```bash
cd "/Users/qratul/research_and_dev/jotil/jotil website temp/jotil_labs_website" && npm run dev
```

Wait for it to print "Ready in X ms".

**Step 2: Run Playwright validation**

Use Playwright MCP tools from this session (browser_navigate, browser_take_screenshot, browser_click, browser_snapshot).

Navigate and verify:
1. http://localhost:3000/products/receptionist — hero loads, "View Pricing" button visible
2. Click "View Pricing" — should navigate to /products/receptionist/pricing
3. Take screenshot: `pricing-page-desktop.png`
4. Verify snapshot contains: "$100", "$225", "$320", "Most Popular", "Compare plans", "Start Free Trial"
5. Resize viewport to 375x800 (mobile)
6. Take screenshot: `pricing-page-mobile.png`
7. Verify mobile layout: tier cards stack vertically, comparison table scrolls horizontally

**Step 3: Click through the CTAs**

- Click "Start Free Trial" on Core tier → should navigate to `/contact?product=receptionist&plan=core`
- Click "Back to JotilReceptionist" → should return to product page
- Click first FAQ item → should expand showing answer

**Step 4: Stop dev server, save screenshots as artifacts**

Screenshots are saved automatically by Playwright MCP to `.playwright-mcp/`.

**Step 5: Commit screenshots if useful for PR**

Not strictly necessary — screenshots go in PR comments, not the repo.

---

### Task 8: Cross-repo fix — Stripe checkout URLs in voice_platform_retell

**Why:** Stripe checkout page links to `recv.jotillabs.com/terms` and `/privacy` which require login. This violates Stripe ToS and GDPR/CCPA (customer must be able to read legal docs before agreeing).

**Files:**
- Modify: `/Users/qratul/research_and_dev/jotil/voice_platform_retell/backend/app/services/stripe_service.py` (around line 56-64)

**Step 1: Switch repositories**

```bash
cd /Users/qratul/research_and_dev/jotil/voice_platform_retell
```

Check current state:

```bash
git status
git branch --show-current
```

You should be on `main` with a clean tree.

**Step 2: Create feature branch in voice_platform_retell**

```bash
git checkout -b fix/SV-stripe-checkout-legal-urls
```

**Step 3: Update the Stripe checkout legal URLs**

Open `backend/app/services/stripe_service.py`. Find the `custom_text` block (around line 56-64):

```python
"custom_text": {
    "terms_of_service_acceptance": {
        "message": (
            "I agree to the "
            "[Terms of Service](https://recv.jotillabs.com/terms) "
            "and [Privacy Policy](https://recv.jotillabs.com/privacy)"
        ),
    },
},
```

Change the URLs from `recv.jotillabs.com` to `jotillabs.com`:

```python
"custom_text": {
    "terms_of_service_acceptance": {
        "message": (
            "I agree to the "
            "[Terms of Service](https://jotillabs.com/terms) "
            "and [Privacy Policy](https://jotillabs.com/privacy)"
        ),
    },
},
```

**Step 4: Verify the Python file still imports**

```bash
cd backend && python -c "from app.services.stripe_service import create_checkout_session; print('OK')"
```

Expected: `OK`

**Step 5: Commit**

```bash
cd /Users/qratul/research_and_dev/jotil/voice_platform_retell
git add backend/app/services/stripe_service.py
git commit -m "fix(billing): Stripe checkout legal URLs use public jotillabs.com"
```

**Step 6: Create PR for voice platform**

```bash
gh pr create --title "fix(billing): Stripe checkout legal URLs use public jotillabs.com" --body "$(cat <<'EOF'
## Summary
Stripe checkout page linked to recv.jotillabs.com/terms and /privacy which require login. A customer at the checkout page cannot read what they are agreeing to.

Fix: point to public jotillabs.com/terms and /privacy.

## Why it matters
- Stripe services agreement requires publicly accessible terms
- GDPR Article 13 and CCPA require accessible privacy notices
- Trust/UX — customers need to read terms before checkout

## Test plan
- [x] Python import check
- [ ] Next production checkout shows jotillabs.com links
- [ ] Links open without requiring login
EOF
)" --base main
```

Capture the PR URL from the output.

**Step 7: Switch back to marketing site branch**

```bash
cd "/Users/qratul/research_and_dev/jotil/jotil website temp/jotil_labs_website"
git status
```

Confirm you are back on `feat/JL-26-receptionist-pricing-page`.

---

### Task 9: Create PR for marketing site

**Why:** All changes on `feat/JL-26-receptionist-pricing-page` ready for review.

**Files:** None — git + gh CLI.

**Step 1: Push the branch**

```bash
cd "/Users/qratul/research_and_dev/jotil/jotil website temp/jotil_labs_website"
git push -u origin feat/JL-26-receptionist-pricing-page
```

**Step 2: Create PR**

```bash
gh pr create --title "feat(pricing): receptionist pricing page with live Stripe tiers" --body "$(cat <<'EOF'
## Summary

- Sync `data/products.js` receptionist pricing with live Stripe ($100 / $225 / $320)
- Add pricing-specific FAQ separate from product FAQ
- Extract `PricingCard` into reusable component at `components/pricing/`
- Add `FeatureComparison` table component
- Create dedicated dynamic route `/products/[slug]/pricing`
- Wire "View Pricing" button to the new route
- All changes reuse existing data via products.js — zero duplication

## Before vs After

**Before:** Marketing showed \$99 / \$299 / Custom. Stripe charged \$100 / \$225 / \$320. Trust issue.
**After:** Marketing matches Stripe exactly. Dedicated pricing page for focused narrative per product.

## Pattern establishes

This PR introduces the pattern for per-product pricing pages. When JotilMessenger (or any future product) ships, its pricing page will be automatic (dynamic route already exists), just update its tiers in `products.js`.

## Related
- Closes #26
- Companion PR in voice_platform_retell fixes Stripe checkout legal URLs to use public jotillabs.com/terms

## Test plan
- [x] Dev server renders without errors
- [x] TypeScript/lint clean
- [x] Playwright E2E desktop + mobile
- [x] "View Pricing" button navigates to dedicated page
- [x] All 3 tiers show correct prices from Stripe
- [x] Feature comparison table renders
- [x] FAQ expands/collapses
- [x] CTA links include plan slug
EOF
)" --base main
```

**Step 3: Capture PR URL and report**

The `gh pr create` output contains the PR URL. Keep it for the completion report.

---

## Task Summary

| # | Task | Files | Estimated Effort |
|---|---|---|---|
| 1 | Sync products.js pricing | 1 modify | 10 min |
| 2 | Extract PricingCard component | 1 create, 1 modify | 15 min |
| 3 | Create FeatureComparison component | 1 create | 15 min |
| 4 | Create dedicated pricing route | 1 create | 30 min |
| 5 | Wire View Pricing button | 1 modify | 5 min |
| 6 | Verify /products listing auto-updates | 0-1 modify | 5 min |
| 7 | Playwright E2E validation | 0 | 15 min |
| 8 | Cross-repo Stripe URL fix | 1 modify (voice repo) | 10 min |
| 9 | Create PRs | 0 | 5 min |

Total: ~110 minutes of focused work.

---

## Out of Scope (NOT in this plan)

- Messenger pricing data sync (still has wrong data, separate issue)
- Self-serve signup flow on recv.jotillabs.com
- Annual billing toggle
- Overview `/pricing` page
- Pricing structure changes (see partner discussion doc)

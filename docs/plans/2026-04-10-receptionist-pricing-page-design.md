# Receptionist Pricing Page — Design Doc

**Date:** 2026-04-10
**Status:** Approved
**Scope:** Build `/products/receptionist/pricing` on jotillabs.com, establish per-product pricing pattern for future products

---

## Problem Statement

1. **Pricing page missing.** `jotillabs.com/pricing` returns 404. "View Pricing" button on the receptionist product page has nowhere to go.
2. **Marketing/Stripe mismatch.** Product cards show "From $99/mo" but JotilReceptionist's live Stripe tiers are $100/$225/$320. Customers see different price at checkout than on marketing — trust issue.
3. **Stripe compliance issue.** Stripe checkout links to `recv.jotillabs.com/terms` and `/privacy`. Those URLs require login. A new customer completing checkout cannot read what they're agreeing to. This violates Stripe's ToS and GDPR/CCPA.
4. **No pattern for multi-product pricing.** When Messenger ships, there's no established structure for its pricing page.

---

## Decisions (from brainstorm)

| Decision | Choice | Rationale |
|---|---|---|
| Pricing pages | Per-product only (`/products/{name}/pricing`) | Niche focus per product, better SEO, simpler than shared overview |
| Legal pages | Shared across products (`/terms`, `/privacy`, `/opt-in`) | All products under Jotil Labs LLC, existing pages already comprehensive |
| Checkout/signup | Each product app handles its own | No central identity system needed yet, loose coupling, matches current state |
| Content management | JSON files in marketing site repo | Rare updates, dev team handles it, CMS is overkill |
| Tier numbers | Keep as-is ($100/$225/$320), update marketing copy | Avoid Stripe migration disruption, fix inconsistency via copy change |

---

## Design

### Page Structure (`/products/receptionist/pricing`)

```
1. Hero
   - Breadcrumb: Products > JotilReceptionist > Pricing
   - Title: "Simple pricing. Every missed call handled."
   - Subtitle: Short value prop
   - Trial badge: "14-day free trial. No credit card required until after trial."

2. Three Pricing Tiers (cards)
   - Core ($100/mo) — starter
   - Pro ($225/mo) — "Most Popular" badge
   - Business ($320/mo) — for higher volume
   - Each card shows: name, price, minutes included, top 4-5 features, CTA
   - CTA: "Start 14-Day Free Trial" → /contact?product=receptionist&plan=core (until self-serve signup ships)

3. Feature Comparison Table
   - All features in left column, checkmarks per tier
   - Shows differentiation between tiers clearly

4. FAQ Section
   - What happens if I exceed my minutes?
   - Can I change plans later?
   - Is there a long-term contract?
   - What's included in the free trial?
   - Do you offer annual billing?
   - What payment methods do you accept?
   - Can I cancel anytime?
   - Is my data secure?

5. Footer CTA
   - "Still have questions? Book a demo"
   - Links to /contact
```

### Data Source (Single Source of Truth)

**File:** `content/pricing/receptionist.json`

```json
{
  "product": "JotilReceptionist",
  "tagline": "Your AI Front Desk. Never Miss a Call Again.",
  "trial_days": 14,
  "trial_minutes": 60,
  "signup_url": "/contact?product=receptionist",
  "overage_rate_per_minute": 1.50,
  "currency": "USD",
  "tiers": [
    {
      "slug": "core",
      "name": "Core",
      "price_monthly": 100,
      "minutes_included": 200,
      "popular": false,
      "description": "Perfect for solopreneurs and small teams",
      "features": [
        "AI phone receptionist (inbound calls)",
        "Call transcripts and AI analysis",
        "Appointment booking to Google Calendar",
        "SMS confirmations to callers",
        "Basic dashboard with call history",
        "Email support"
      ]
    },
    {
      "slug": "pro",
      "name": "Pro",
      "price_monthly": 225,
      "minutes_included": 500,
      "popular": true,
      "description": "For growing businesses with higher call volume",
      "features": [
        "Everything in Core",
        "AI web voicebot widget",
        "Multi-agent routing (day/night, custom schedules)",
        "Advanced call analytics and sentiment",
        "Priority email + chat support",
        "Custom greeting and voice selection"
      ]
    },
    {
      "slug": "business",
      "name": "Business",
      "price_monthly": 320,
      "minutes_included": 1000,
      "popular": false,
      "description": "For established businesses with high call volume",
      "features": [
        "Everything in Pro",
        "Up to 5 concurrent calls",
        "Dedicated onboarding specialist",
        "Phone support",
        "Custom integrations (API access)",
        "White-glove setup"
      ]
    }
  ],
  "faq": [
    {
      "q": "What happens if I exceed my included minutes?",
      "a": "Overages are billed at $1.50/min and added to your next invoice. You'll get email and SMS alerts at 90% and 100% of your included minutes so there are no surprises."
    },
    {
      "q": "Can I change plans later?",
      "a": "Yes, you can upgrade or downgrade anytime from your dashboard or by contacting support. Changes take effect on your next billing cycle."
    },
    {
      "q": "Is there a long-term contract?",
      "a": "No. All plans are month-to-month. Cancel anytime."
    },
    {
      "q": "What is included in the free trial?",
      "a": "14 days and 60 minutes of AI receptionist service, fully featured. We collect your card during signup but do not charge until the trial ends. You can cancel before the trial ends to avoid any charges."
    },
    {
      "q": "Do you offer annual billing?",
      "a": "Not yet. Annual billing with a discount is on our roadmap. Contact us if this is important for you."
    },
    {
      "q": "What payment methods do you accept?",
      "a": "We accept all major credit cards and debit cards through Stripe. Additional payment methods are available for Business tier customers."
    },
    {
      "q": "Can I cancel anytime?",
      "a": "Yes. You can cancel from your dashboard and service continues through the end of your current billing period."
    },
    {
      "q": "Is my data secure?",
      "a": "Yes. Call transcripts and customer data are encrypted at rest and in transit. We never share your data with third parties. See our Privacy Policy for details."
    }
  ]
}
```

### Component Architecture

```
app/products/receptionist/pricing/page.jsx
  ↓ imports
components/pricing/PricingHero.jsx
components/pricing/PricingTiers.jsx       (renders the 3 cards)
components/pricing/FeatureComparison.jsx  (comparison table)
components/pricing/PricingFAQ.jsx
components/pricing/PricingFooterCTA.jsx

lib/pricing.js
  - getPricingData(slug) → reads content/pricing/{slug}.json
```

**Reusability:** All components accept a `pricingData` prop. When Messenger pricing ships, `app/products/messenger/pricing/page.jsx` reuses the same components with `messenger.json`.

### CTA Wiring

- **"Start 14-Day Free Trial"** (tier cards) → `/contact?product=receptionist&plan={tier_slug}` (until self-serve signup exists)
- **"Book a Demo"** (footer) → `/contact`
- **Feature comparison table CTAs** → same as tier card CTAs

### Side-Fix: Stripe Checkout URLs

**In `voice_platform_retell` repo (separate PR):**

Update `backend/app/services/stripe_service.py` checkout session's `custom_text.terms_of_service_acceptance.message`:
- Before: `https://recv.jotillabs.com/terms` and `/privacy`
- After: `https://jotillabs.com/terms` and `/privacy`

Why: Supabase/Stripe and GDPR/CCPA compliance requires public access. The recv subdomain requires login.

### Update Marketing Card

Update the existing `/products/receptionist` page and `/products` overview page:
- "From $99/mo" → "From $100/mo"
- "View Pricing" button → `/products/receptionist/pricing` (currently broken link)

---

## What Does NOT Change

- Legal pages (`/terms`, `/privacy`, `/opt-in`) — already live
- Existing product pages — only copy fix and button wiring
- Voice platform billing logic — unchanged, already uses $100/$225/$320
- Stripe price IDs — unchanged
- Messenger product — not touched (separate future work)
- Self-serve signup on recv.jotillabs.com — not built (future work)

---

## Out of Scope (Follow-Up Work)

| Item | When |
|---|---|
| Self-serve signup at `recv.jotillabs.com/signup` | Future — admin creates accounts now |
| Messenger pricing page | When Messenger ships |
| Annual billing toggle | Requires Stripe changes, deferred |
| Overview `/pricing` page | Add if /pricing 404s show up in analytics |
| Pricing structure review | Partner discussion (see `docs/research/2026-04-10-pricing-tiers-partner-discussion.md` in voice_platform_retell repo) |

---

## Files to Create / Modify

**Create (jotil_labs_website):**
- `content/pricing/receptionist.json`
- `app/products/receptionist/pricing/page.jsx`
- `app/products/receptionist/pricing/loading.jsx`
- `lib/pricing.js`
- `components/pricing/PricingHero.jsx`
- `components/pricing/PricingTiers.jsx`
- `components/pricing/FeatureComparison.jsx`
- `components/pricing/PricingFAQ.jsx`
- `components/pricing/PricingFooterCTA.jsx`

**Modify (jotil_labs_website):**
- `app/products/receptionist/page.jsx` — wire "View Pricing" button
- Marketing card showing "From $99/mo" (location TBD during implementation) — update to "From $100/mo"

**Modify (voice_platform_retell, separate PR):**
- `backend/app/services/stripe_service.py` — update Stripe checkout URLs to `jotillabs.com/terms` and `/privacy`

---

## Testing Plan

- [ ] `/products/receptionist/pricing` renders without 404
- [ ] All 3 tier cards display with correct prices, minutes, features
- [ ] "Most Popular" badge shows on Pro
- [ ] Feature comparison table shows all features with correct checkmarks
- [ ] FAQ section expands/collapses
- [ ] "Start 14-Day Free Trial" CTAs link to `/contact?product=receptionist&plan={slug}`
- [ ] Mobile responsive (test viewport 375px)
- [ ] `/products/receptionist` "View Pricing" button navigates to new pricing page
- [ ] Stripe checkout (on recv.jotillabs.com) links to `jotillabs.com/terms` and `/privacy` (not recv)
- [ ] New Stripe checkout page shows the public jotillabs.com legal links (verify in browser without being logged in)
- [ ] Playwright: navigate to new page, take screenshot, verify all elements present

---

## Related

- Issue: TBD (to be created in jotil_labs_website)
- Partner discussion: `voice_platform_retell/docs/research/2026-04-10-pricing-tiers-partner-discussion.md`
- Research: Multi-product SaaS pricing page best practices (conducted 2026-04-10 via WebSearch)

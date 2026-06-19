# Pricing Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the 6 product pricing pages to match the approved pricing strategy (5 tiers for Messenger/Outreach/Space, bespoke services for Flow/Avatar, Receptionist minor polish), with a new shared pricing component system that supports 4 billing models (tiers, conversation buckets, credits, per-user) plus a contact-only variant.

**Architecture:** Extend `data/products.js` with a `billingModel` discriminator per product. Build a small library of shared pricing components under `components/pricing/` that render different card layouts based on billing model. Update the per-product pricing page template to consume the shared components. Keep the existing pricing page route (`app/products/[slug]/pricing/page.jsx`).

**Tech Stack:** Next.js 15 App Router + React 19 + JSX + Tailwind v4 + Framer Motion. Existing: `lucide-react` icons, `components/ui/Button.jsx`, `components/ui/Badge.jsx`, `components/pricing/PricingCard.jsx`, `components/pricing/FeatureComparison.jsx`. Playwright for snapshot tests (already wired).

**Spec:** `docs/plans/2026-04-19-pricing-strategy.md`

**Related issues closed by this plan:** #46, #47, #48, #49, #50, #51, and partly #57 (Avatar false-claims removal happens here as part of the page rewrite).

---

## Pre-flight

### Task 0: Branch + environment setup

**Files:** none (git + env sanity check)

- [ ] **Step 1: Pull latest main, create feature branch**

Run:
```bash
git checkout main && git pull --ff-only
git checkout -b feat/pricing-pages-rewrite
```

- [ ] **Step 2: Confirm dev server starts**

Run: `npm run dev`
Expected: server on localhost:3000, no errors.
Kill after verifying.

- [ ] **Step 3: Confirm existing Playwright tests still pass (baseline)**

Run: `npm run test:visual`
Expected: all 22 existing brand tests pass.

- [ ] **Step 4: Create GitHub issue for tracking**

Run:
```bash
gh issue create \
  --title "Implement pricing pages per strategy doc (5 products + Flow/Avatar contact variants)" \
  --body "Implements the pricing strategy at docs/plans/2026-04-19-pricing-strategy.md. Closes #46 #47 #48 #49 #50 #51. Scope: data/products.js refactor + shared pricing components + all 6 pricing pages rewritten."
```
Record the issue number for the final PR body.

---

## Task 1: Extend data/products.js with billingModel + new tier structure

**Files:**
- Modify: `data/products.js`

- [ ] **Step 1: Add billingModel discriminator + new tier data for all products**

Replace the `pricing` blocks in `data/products.js` product-by-product. The full replacement is below (paste into each product's `pricing` field):

**Receptionist** (unchanged structurally, just rename Core→Starter):
```js
pricing: {
  billingModel: 'minute_tiers',
  unitLabel: 'minute',
  overageRatePerUnit: 1.50,
  tiers: [
    { slug: 'starter', name: 'Starter', price: '$100', period: '/mo', description: 'For solopreneurs and small teams getting started', includedUnits: 200, features: [
      '200 AI call minutes included',
      '1 dedicated phone number',
      '14-day free trial',
      'AI phone receptionist (inbound)',
      'Call transcripts and AI summaries',
      'Appointment booking to Google Calendar',
      'SMS confirmations to callers',
      'Email support',
    ]},
    { slug: 'pro', name: 'Pro', price: '$225', period: '/mo', description: 'For growing businesses with steady call volume', includedUnits: 500, highlighted: true, features: [
      '500 AI call minutes included',
      'Everything in Starter',
      'AI web voicebot widget',
      'Multi-agent time-based routing',
      'Advanced call analytics and sentiment',
      'Custom greeting and voice selection',
      'Priority email and chat support',
    ]},
    { slug: 'business', name: 'Business', price: '$320', period: '/mo', description: 'For established businesses with high call volume', includedUnits: 1000, features: [
      '1,000 AI call minutes included',
      'Everything in Pro',
      'Up to 5 concurrent calls',
      'Dedicated onboarding specialist',
      'Phone support',
      'Custom integrations and API access',
    ]},
  ],
  enterprise: {
    priceFrom: '$1,500',
    description: 'For high-volume call centers and enterprise deployments',
    features: ['Unlimited minutes', 'Custom AI fine-tuning', 'SSO/SAML', 'Data residency (US/EU)', 'SLA 99.9%', 'Dedicated CSM'],
  },
  setupFee: { strikethrough: '$999', current: 'Free for founding customers' },
  annualDiscountPct: 17,
},
```

**Messenger** (5 tiers: Essentials + 3 cards + Enterprise):
```js
pricing: {
  billingModel: 'conversation_buckets',
  unitLabel: 'conversation',
  overageRatePerUnit: null, // varies per tier - see tier objects
  essentials: {
    slug: 'essentials',
    name: 'Essentials',
    price: '$39',
    period: '/mo',
    includedUnits: 100,
    overageRate: 0.30,
    knowledgeBases: 1,
    description: 'For solopreneurs and side businesses just getting started',
    features: ['Web chat + SMS', '100 conversations/mo', '1 knowledge base', 'Basic analytics', 'Email-only support'],
  },
  tiers: [
    { slug: 'starter', name: 'Starter', price: '$89', period: '/mo', includedUnits: 500, overageRate: 0.20, knowledgeBases: 1, description: 'For small businesses', features: [
      'Web chat + SMS',
      '500 conversations/mo',
      '1 knowledge base',
      'Business-hours coverage',
      'Basic analytics',
      'Email support',
    ]},
    { slug: 'pro', name: 'Pro', price: '$249', period: '/mo', includedUnits: 2500, overageRate: 0.14, knowledgeBases: 5, highlighted: true, description: 'For growing SMBs', features: [
      'Web chat + SMS + WhatsApp',
      '2,500 conversations/mo',
      '5 knowledge bases',
      '24/7 coverage',
      'AI training on your content',
      'CRM sync (HubSpot, Salesforce)',
      'Custom branding',
      'Chat + email support',
    ]},
    { slug: 'business', name: 'Business', price: '$599', period: '/mo', includedUnits: 10000, overageRate: 0.08, knowledgeBases: 10, description: 'For multi-location SMBs', features: [
      'All channels + Teams',
      '10,000 conversations/mo',
      '10 knowledge bases',
      'API access',
      'SSO',
      'Advanced analytics',
      'Multi-user admin',
      'Priority support',
    ]},
  ],
  enterprise: {
    priceFrom: '$1,500',
    description: 'For agencies, franchises, and 100+ employee teams',
    features: ['Unlimited conversations', 'Custom AI fine-tuning', 'SSO/SAML', 'Data residency', 'Custom integrations', 'SLA 99.9%', 'Dedicated CSM'],
  },
  setupFee: { strikethrough: '$999', current: 'Free for founding customers' },
  annualDiscountPct: 17,
  conversationDefinition: 'A conversation is any customer-initiated thread, from the first customer message through 24 hours of silence.',
},
```

**Outreach** (credits system):
```js
pricing: {
  billingModel: 'credits',
  unitLabel: 'credit',
  creditEquivalence: { voiceMinutes: 1, sms: 5 },
  overageRatePerUnit: null, // varies per tier
  essentials: {
    slug: 'essentials',
    name: 'Essentials',
    price: '$149',
    period: '/mo',
    includedUnits: 150,
    overageRate: 1.20,
    description: 'For light-touch reactivation and solo practitioners',
    callDurationCapMinutes: 3,
    concurrentCalls: 1,
    features: ['150 credits/mo', '~100 calls OR 750 SMS', '1 active campaign', '1 concurrent call', 'Basic AI script templates', 'Simple scheduler', 'Email support'],
  },
  tiers: [
    { slug: 'starter', name: 'Starter', price: '$249', period: '/mo', includedUnits: 500, overageRate: 0.60, callDurationCapMinutes: 5, concurrentCalls: 2, description: 'For small businesses with active outreach', features: [
      '500 credits/mo',
      '~330 calls OR 2,500 SMS',
      '3 active campaigns',
      '2 concurrent calls',
      'AI-generated scripts from your offer',
      'Time-zone aware scheduling',
      'CRM CSV import',
      'Configurable retry logic',
    ]},
    { slug: 'pro', name: 'Pro', price: '$599', period: '/mo', includedUnits: 1500, overageRate: 0.40, callDurationCapMinutes: 7, concurrentCalls: 5, highlighted: true, description: 'For growing SMBs with a dedicated sales function', features: [
      '1,500 credits/mo',
      '~1,000 calls OR 7,500 SMS',
      '10 active campaigns',
      '5 concurrent calls',
      'WhatsApp outbound + voicemail drops',
      'AI trained on your knowledge base',
      'Advanced scheduling + drip sequences',
      'A/B testing + CRM sync',
      'Chat + email support',
    ]},
    { slug: 'business', name: 'Business', price: '$999', period: '/mo', includedUnits: 3000, overageRate: 0.30, callDurationCapMinutes: 10, concurrentCalls: 15, description: 'For multi-location and serious sales ops', features: [
      '3,000 credits/mo',
      '~2,000 calls OR 15,000 SMS',
      'Unlimited campaigns',
      '15 concurrent calls',
      'Live transfer (AI to human)',
      'API access + dedicated number pool',
      'SSO + custom roles',
      'Custom analytics + scheduled reports',
      'Priority support',
    ]},
  ],
  enterprise: {
    priceFrom: '$2,000',
    description: 'For agencies, franchises, and regulated industries',
    features: ['Custom credit allocation', '25+ concurrent calls', 'Custom AI fine-tuning', 'TCPA compliance audit', 'SLA 99.9%', 'Data residency', 'Dedicated CSM + onboarding'],
  },
  setupFee: { strikethrough: '$999', current: 'Free for founding customers' },
  annualDiscountPct: 17,
  creditDefinition: '1 credit = 1 minute of outbound voice OR 5 SMS messages. Mix freely.',
},
```

**Space** (per-user):
```js
pricing: {
  billingModel: 'per_user',
  unitLabel: 'user',
  essentials: {
    slug: 'essentials',
    name: 'Essentials',
    price: '$19',
    period: '/user/mo',
    aiQueriesPerUser: 0,
    contactsPerUser: 500,
    ticketsPerMonth: 200,
    description: 'Basic workspace without AI agents',
    features: ['CRM pipelines (500 contacts)', 'Tickets (200/mo)', 'Calendar', 'No AI agents', 'Email support'],
  },
  tiers: [
    { slug: 'starter', name: 'Starter', price: '$39', period: '/user/mo', aiQueriesPerUser: 500, contactsPerUser: 2500, ticketsPerMonth: 1000, description: 'For small teams', features: [
      '$39/user/mo',
      '2,500 contacts',
      '1,000 tickets/mo',
      '500 AI queries/user/mo',
      'AI model: GPT-4o-mini',
      '5 automations',
      'Zapier integration',
      'Email support',
    ]},
    { slug: 'pro', name: 'Pro', price: '$79', period: '/user/mo', aiQueriesPerUser: 2500, contactsPerUser: null, ticketsPerMonth: 5000, highlighted: true, description: 'For growing teams (SMB sweet spot)', features: [
      '$79/user/mo',
      'Unlimited contacts',
      '5,000 tickets/mo',
      '2,500 AI queries/user/mo',
      'AI models: GPT-4o, Claude Sonnet, Gemini Pro',
      'Concurrent multi-agent',
      '25 automations',
      'CRM sync + HubSpot/Salesforce',
      'Custom roles',
      'Chat + email support',
    ]},
    { slug: 'business', name: 'Business', price: '$149', period: '/user/mo', aiQueriesPerUser: 5000, contactsPerUser: null, ticketsPerMonth: null, description: 'For serious SMBs and multi-location', features: [
      '$149/user/mo',
      'Unlimited contacts + tickets',
      '5,000 AI queries/user/mo',
      'All frontier AI models',
      'Custom system prompts per agent',
      'Unlimited automations',
      'API access',
      'SSO + RBAC',
      'Custom dashboards + scheduled reports',
      'Priority support',
    ]},
  ],
  enterprise: {
    priceFrom: '$199/user',
    minimumUsers: 25,
    description: 'For agencies, enterprises, and regulated industries',
    features: ['All models + fine-tuned on your data', 'Unlimited AI queries', 'SSO/SAML', 'Data residency (US/EU)', 'SLA 99.9%', 'Dedicated CSM', 'Custom integrations', 'BYO API key option'],
  },
  setupFee: { strikethrough: '$999', current: 'Free for founding customers' },
  annualDiscountPct: 17,
  queryDefinition: 'One user-AI interaction producing a model response. Multi-turn conversations count as multiple queries.',
},
```

**Flow** (contact-only):
```js
pricing: {
  billingModel: 'contact',
  headline: 'Not one-size-fits-all.',
  subhead: 'Your automations are designed around your business. Every Flow engagement starts with a 30-minute discovery call.',
  primaryCTA: { label: 'Book discovery call', href: '/contact?product=flow' },
  engagementTypes: [
    { name: 'Custom workflow build', description: '1-3 automations scoped and delivered in 1-2 weeks', priceNote: 'Project-based' },
    { name: 'Monthly retainer', description: 'Ongoing builds + maintenance + team availability', priceNote: 'Monthly' },
    { name: 'AI agent development', description: 'Custom LLM agents for specific business tasks', priceNote: 'Project-based' },
    { name: 'Process consulting', description: 'Audit + roadmap + prioritized ROI plan', priceNote: 'Project-based' },
  ],
  whatsIncluded: ['Discovery + scoping', 'Design + build', 'Testing + monitoring', 'Training + handoff', 'Documentation'],
},
```

**Avatar** (contact-only):
```js
pricing: {
  billingModel: 'contact',
  headline: 'Every avatar is built for your brand.',
  subhead: 'Your avatar looks like your brand, sounds like your brand, and knows your products. Every engagement starts with a 30-minute discovery call.',
  primaryCTA: { label: 'Book discovery call', href: '/contact?product=avatar' },
  engagementTypes: [
    { name: 'Single-avatar website deployment', description: 'Branded avatar + content ingestion + embed', priceNote: 'Project + monthly' },
    { name: 'Multi-avatar (3+ personas)', description: 'Different personas for marketing, support, onboarding', priceNote: 'Project + monthly' },
    { name: 'On-premise deployment', description: 'Private compute for regulated industries', priceNote: 'Project + monthly' },
    { name: 'Monthly tuning retainer', description: 'Content updates, persona adjustments, analytics review', priceNote: 'Monthly' },
  ],
  whatsIncluded: ['Avatar design (appearance, voice, personality)', 'Content ingestion (FAQs, product docs)', 'Website embed with brand styling', 'Multi-language if needed', 'Analytics dashboard', '30-day tuning after launch'],
},
```

- [ ] **Step 2: Remove false Avatar feature claims per issue #57**

In the same `data/products.js`, update the Avatar product's `services` and `features` arrays:

Remove the entire `Video Meeting Avatar` service (lines ~428-440 of the avatar block). Remove the `'Enterprise Security'` feature entry claiming 'SOC 2 compliant' (line ~447). Remove `Google Meet` and `Zoom` from the `integrations` array.

Keep: Website AI Avatar service, Lifelike Presence, Video-Ready, Brand Customization, Multilingual, Context-Aware AI features.

Replace the `'Enterprise Security'` feature with:

```js
{ icon: 'Server', title: 'On-Premise Option', description: 'Deploy avatar infrastructure on your environment for data-sensitive use cases' },
```

Update `integrations` for Avatar to:
```js
integrations: ['Anam AI', 'OpenAI', 'HubSpot', 'Salesforce'],
```

- [ ] **Step 3: Verify the file parses as JS and the products export is intact**

Run:
```bash
node --input-type=module -e "import('./data/products.js').then(m => console.log(m.products.length, m.products.map(p => p.slug)))"
```
Expected: `6 [ 'receptionist', 'messenger', 'outreach', 'space', 'flow', 'avatar' ]`

- [ ] **Step 4: Run build to catch any syntax or structural errors**

Run: `npm run build`
Expected: clean build, no errors.

- [ ] **Step 5: Commit**

```bash
git add data/products.js
git commit -m "feat(pricing): extend products.js with billingModel + 5-tier structure + contact variants

Closes #46, #47, #48, #49, #50, #51. Partial #57 (Avatar false claims removed)."
```

---

## Task 2: Build shared pricing components

**Files:**
- Create: `components/pricing/EssentialsCard.jsx`
- Create: `components/pricing/EnterpriseBanner.jsx`
- Create: `components/pricing/ContactOnlyPricing.jsx`
- Create: `components/pricing/BillingToggle.jsx`
- Create: `components/pricing/ConciergeSetupBanner.jsx`
- Modify: `components/pricing/PricingCard.jsx` (extend to support new billing models)

- [ ] **Step 1: Create `components/pricing/EssentialsCard.jsx`**

```jsx
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export function EssentialsCard({ product, essentials }) {
  const contactHref = `/contact?product=${product.slug}&tier=essentials`

  return (
    <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-border bg-white px-6 py-5 shadow-sm">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={14} className="text-primary" strokeWidth={1.5} />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-primary font-display">
            {essentials.name} - just getting started?
          </span>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          {essentials.description}. <span className="font-semibold text-text">{essentials.price}{essentials.period}</span>
          {essentials.includedUnits ? ` for ${essentials.includedUnits.toLocaleString()} ${product.pricing.unitLabel}s/mo.` : '.'}
        </p>
      </div>
      <Link
        href={contactHref}
        className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary no-underline hover:bg-primary/10 transition-colors"
      >
        Get started
        <ArrowRight size={14} strokeWidth={2} />
      </Link>
    </div>
  )
}
```

- [ ] **Step 2: Create `components/pricing/EnterpriseBanner.jsx`**

```jsx
import Link from 'next/link'
import { ArrowRight, Building2 } from 'lucide-react'
import { Check } from 'lucide-react'

export function EnterpriseBanner({ product, enterprise }) {
  const contactHref = `/contact?product=${product.slug}&tier=enterprise`

  return (
    <div className="mt-12 rounded-2xl border border-navy/10 bg-gradient-to-br from-navy/[0.03] to-primary/[0.03] p-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center shrink-0">
          <Building2 size={20} strokeWidth={1.5} className="text-navy" />
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-navy/70 font-display mb-1">Enterprise</p>
          <h3 className="text-xl font-bold text-text mb-2 font-display">Need more than {product.pricing.tiers[product.pricing.tiers.length - 1]?.name}?</h3>
          <p className="text-sm text-text-secondary mb-4 leading-relaxed">{enterprise.description} From <span className="font-semibold text-text">{enterprise.priceFrom}/mo</span>.</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 mb-5">
            {enterprise.features?.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                <Check size={14} strokeWidth={2} className="text-primary mt-0.5 shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Link
            href={contactHref}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary no-underline hover:gap-2 transition-all"
          >
            Talk to sales
            <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create `components/pricing/ContactOnlyPricing.jsx`**

```jsx
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'

export function ContactOnlyPricing({ product }) {
  const { pricing } = product

  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-2xl border border-border bg-white p-8 sm:p-10 shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-bold text-text mb-3 font-display tracking-tight">
          {pricing.headline}
        </h2>
        <p className="text-text-secondary mb-8 leading-relaxed">{pricing.subhead}</p>

        <Link
          href={pricing.primaryCTA.href}
          className="inline-flex items-center gap-2 btn-gradient no-underline text-white font-semibold rounded-lg px-6 py-3 mb-10 hover:-translate-y-0.5 transition-transform"
        >
          {pricing.primaryCTA.label}
          <ArrowRight size={16} strokeWidth={2} />
        </Link>

        {pricing.engagementTypes?.length > 0 && (
          <div className="mb-10">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-text-secondary mb-4 font-display">Typical engagements</h3>
            <ul className="space-y-3">
              {pricing.engagementTypes.map((e, i) => (
                <li key={i} className="flex items-start justify-between gap-4 pb-3 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-text">{e.name}</p>
                    <p className="text-sm text-text-secondary leading-relaxed mt-0.5">{e.description}</p>
                  </div>
                  <span className="text-xs font-medium text-primary whitespace-nowrap mt-0.5">{e.priceNote}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {pricing.whatsIncluded?.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-text-secondary mb-4 font-display">Every engagement includes</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {pricing.whatsIncluded.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <Check size={14} strokeWidth={2} className="text-primary mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create `components/pricing/BillingToggle.jsx`**

```jsx
'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export function BillingToggle({ onChange, annualDiscountPct = 17, className }) {
  const [mode, setMode] = useState('monthly')

  const select = (next) => {
    setMode(next)
    if (onChange) onChange(next)
  }

  return (
    <div className={cn('inline-flex items-center rounded-full border border-border bg-white p-1 text-sm font-medium', className)}>
      <button
        type="button"
        onClick={() => select('monthly')}
        className={cn(
          'rounded-full px-4 py-1.5 transition-all',
          mode === 'monthly' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-text'
        )}
      >
        Monthly
      </button>
      <button
        type="button"
        onClick={() => select('annual')}
        className={cn(
          'rounded-full px-4 py-1.5 transition-all inline-flex items-center gap-1.5',
          mode === 'annual' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-text'
        )}
      >
        Annual
        <span className={cn(
          'text-[10px] font-semibold rounded-full px-1.5 py-0.5',
          mode === 'annual' ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
        )}>
          -{annualDiscountPct}%
        </span>
      </button>
    </div>
  )
}
```

- [ ] **Step 5: Create `components/pricing/ConciergeSetupBanner.jsx`**

```jsx
import { Sparkles } from 'lucide-react'

export function ConciergeSetupBanner({ setupFee }) {
  if (!setupFee) return null

  return (
    <div className="mt-10 rounded-xl border border-primary/20 bg-primary/[0.03] px-6 py-5">
      <div className="flex items-start gap-3">
        <Sparkles size={18} strokeWidth={1.5} className="text-primary mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-text mb-1 font-display">
            Concierge Setup included{' '}
            <span className="text-text-secondary">
              <span className="line-through">{setupFee.strikethrough}</span>{' '}
              <span className="text-primary">{setupFee.current}</span>
            </span>
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            Our team configures your AI, knowledge base, and channels. No technical skills required - you're live in days, not weeks.
          </p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Modify `components/pricing/PricingCard.jsx` to support new tier shape**

Open `components/pricing/PricingCard.jsx`. Keep the existing rendering but update to read from the new tier shape (tier.features array same, tier.highlighted same). The component should continue to receive a `tier` prop and render unchanged. Verify the existing props usage matches the new data shape by inspecting the file - if it relies on `price`, `period`, `description`, `features`, `highlighted` that's fine - all still present.

If the component depends on any removed fields, fix inline.

- [ ] **Step 7: Run build to catch import errors**

Run: `npm run build`
Expected: clean build.

- [ ] **Step 8: Commit**

```bash
git add components/pricing/
git commit -m "feat(pricing): shared components for Essentials card, Enterprise banner, contact pricing, billing toggle, setup banner"
```

---

## Task 3: Rewrite pricing page template to consume new components

**Files:**
- Modify: `app/products/[slug]/pricing/page.jsx`

- [ ] **Step 1: Inspect the current pricing page**

Run:
```bash
cat app/products/\[slug\]/pricing/page.jsx | head -80
```
Note the current structure. You will rewrite to handle multiple billing models.

- [ ] **Step 2: Replace pricing page rendering with billing-model-aware template**

Open `app/products/[slug]/pricing/page.jsx`. Find the main render block (after the hero "Ready to try ..." section, the 3-card pricing grid section). Replace that grid block with this conditional rendering:

```jsx
import { EssentialsCard } from '@/components/pricing/EssentialsCard'
import { EnterpriseBanner } from '@/components/pricing/EnterpriseBanner'
import { ContactOnlyPricing } from '@/components/pricing/ContactOnlyPricing'
import { BillingToggle } from '@/components/pricing/BillingToggle'
import { ConciergeSetupBanner } from '@/components/pricing/ConciergeSetupBanner'
import { PricingCard } from '@/components/pricing/PricingCard'
```

Where the pricing tiers currently render (look for `{product.pricing.tiers.map(...)}`), replace with:

```jsx
{/* Pricing block - branches by billingModel */}
<section className="py-12 sm:py-16">
  <div className="max-w-6xl mx-auto px-6">
    {product.pricing.billingModel === 'contact' ? (
      <ContactOnlyPricing product={product} />
    ) : (
      <>
        {/* Billing toggle (only for tiered products) */}
        {product.pricing.annualDiscountPct && (
          <div className="flex justify-center mb-10">
            <BillingToggle annualDiscountPct={product.pricing.annualDiscountPct} />
          </div>
        )}

        {/* Essentials card (quiet, above the grid) */}
        {product.pricing.essentials && (
          <div className="max-w-5xl mx-auto">
            <EssentialsCard product={product} essentials={product.pricing.essentials} />
          </div>
        )}

        {/* Main 3-tier grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {product.pricing.tiers.map((tier) => (
            <PricingCard key={tier.slug || tier.name} tier={tier} productSlug={product.slug} />
          ))}
        </div>

        {/* Enterprise banner below grid */}
        {product.pricing.enterprise && (
          <div className="max-w-5xl mx-auto">
            <EnterpriseBanner product={product} enterprise={product.pricing.enterprise} />
          </div>
        )}

        {/* Concierge Setup banner */}
        {product.pricing.setupFee && (
          <div className="max-w-5xl mx-auto">
            <ConciergeSetupBanner setupFee={product.pricing.setupFee} />
          </div>
        )}
      </>
    )}
  </div>
</section>
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: clean build. All 6 pricing pages generate statically.

- [ ] **Step 4: Dev smoke test**

Run: `npm run dev`
Visit these URLs and verify each renders without crash:
- http://localhost:3000/products/receptionist/pricing
- http://localhost:3000/products/messenger/pricing
- http://localhost:3000/products/outreach/pricing
- http://localhost:3000/products/space/pricing
- http://localhost:3000/products/flow/pricing (should show contact-only)
- http://localhost:3000/products/avatar/pricing (should show contact-only)

Kill dev server.

- [ ] **Step 5: Commit**

```bash
git add app/products/\[slug\]/pricing/page.jsx
git commit -m "feat(pricing): rewrite pricing page to render Essentials + 3-tier grid + Enterprise + setup banner, with contact-only variant for Flow/Avatar"
```

---

## Task 4: PricingCard component handles new tier shape

**Files:**
- Modify: `components/pricing/PricingCard.jsx`

- [ ] **Step 1: Inspect current PricingCard**

Run: `cat components/pricing/PricingCard.jsx`
Note what props it expects and how it renders.

- [ ] **Step 2: Update PricingCard to accept productSlug + use new tier shape**

Replace the entire file contents with:

```jsx
import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PricingCard({ tier, productSlug }) {
  const contactHref = `/contact?product=${productSlug}&tier=${tier.slug || tier.name?.toLowerCase()}`
  const ctaLabel = tier.highlighted ? 'Start 14-day trial' : 'Get started'

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl border bg-white p-6 transition-all',
        tier.highlighted
          ? 'border-primary shadow-xl shadow-primary/10 scale-[1.02]'
          : 'border-border hover:border-primary/30 hover:shadow-lg'
      )}
    >
      {tier.highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-md">
          Most popular
        </div>
      )}

      <h3 className="text-lg font-bold text-text mb-1 font-display">{tier.name}</h3>
      {tier.description && (
        <p className="text-xs text-text-secondary leading-relaxed mb-5">{tier.description}</p>
      )}

      <div className="mb-6">
        <span className="text-4xl font-extrabold text-text font-display tracking-tight">{tier.price}</span>
        {tier.period && <span className="text-sm text-text-secondary ml-1">{tier.period}</span>}
      </div>

      <ul className="space-y-2.5 mb-8 flex-1">
        {tier.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
            <Check size={14} strokeWidth={2} className="text-primary mt-0.5 shrink-0" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Link
        href={contactHref}
        className={cn(
          'inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold no-underline transition-colors',
          tier.highlighted
            ? 'btn-gradient text-white hover:shadow-lg'
            : 'bg-surface text-text hover:bg-surface-hover'
        )}
      >
        {ctaLabel}
        <ArrowRight size={14} strokeWidth={2} />
      </Link>
    </div>
  )
}
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: clean build.

- [ ] **Step 4: Commit**

```bash
git add components/pricing/PricingCard.jsx
git commit -m "feat(pricing): PricingCard uses new tier shape with productSlug-prefilled contact CTAs"
```

---

## Task 5: Playwright snapshot tests for all 6 pricing pages

**Files:**
- Modify: `tests/brand.spec.js` (extend with pricing-page tests) OR create `tests/pricing.spec.js`

- [ ] **Step 1: Create `tests/pricing.spec.js`**

```js
import { test, expect } from '@playwright/test'

const tieredProducts = ['receptionist', 'messenger', 'outreach', 'space']
const contactOnlyProducts = ['flow', 'avatar']

for (const slug of tieredProducts) {
  test(`pricing page ${slug} renders tiers + enterprise banner`, async ({ page }) => {
    await page.goto(`/products/${slug}/pricing`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(300)

    // Main pricing grid must exist
    const cards = page.locator('[class*="grid"] > div').filter({ hasText: /mo/ })
    const cardCount = await cards.count()
    expect(cardCount).toBeGreaterThanOrEqual(3)

    // Enterprise banner must exist
    const enterpriseSection = await page.getByText(/Enterprise/i).first()
    await expect(enterpriseSection).toBeVisible()
  })

  test(`pricing page ${slug} has Concierge Setup banner`, async ({ page }) => {
    await page.goto(`/products/${slug}/pricing`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(300)
    const setup = await page.getByText(/Concierge Setup/i).first()
    await expect(setup).toBeVisible()
  })

  test(`pricing page ${slug} visual snapshot`, async ({ page }) => {
    await page.goto(`/products/${slug}/pricing`, { waitUntil: 'networkidle' })
    await page.addStyleTag({
      content: `*, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }`,
    })
    await page.waitForTimeout(300)
    await expect(page).toHaveScreenshot({ fullPage: true })
  })
}

for (const slug of contactOnlyProducts) {
  test(`pricing page ${slug} shows contact-only card`, async ({ page }) => {
    await page.goto(`/products/${slug}/pricing`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(300)

    // Should NOT show tier grid
    const tierCards = page.locator('[class*="grid"] > div').filter({ hasText: /\/mo/ })
    await expect(tierCards).toHaveCount(0)

    // Should show discovery call CTA
    const cta = await page.getByText(/Book discovery call/i).first()
    await expect(cta).toBeVisible()
  })

  test(`pricing page ${slug} visual snapshot`, async ({ page }) => {
    await page.goto(`/products/${slug}/pricing`, { waitUntil: 'networkidle' })
    await page.addStyleTag({
      content: `*, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }`,
    })
    await page.waitForTimeout(300)
    await expect(page).toHaveScreenshot({ fullPage: true })
  })
}

test('Avatar page does NOT claim SOC 2', async ({ page }) => {
  await page.goto('/products/avatar', { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  const body = await page.locator('main').textContent()
  expect(body).not.toContain('SOC 2')
  expect(body).not.toContain('SOC2')
})

test('Avatar page does NOT claim Video Meeting Avatar', async ({ page }) => {
  await page.goto('/products/avatar', { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  const body = await page.locator('main').textContent()
  expect(body).not.toMatch(/Video Meeting Avatar/i)
})
```

- [ ] **Step 2: Generate baseline snapshots**

Run: `npm run test:visual:update`
Expected: all tests pass. New snapshot files created under `tests/pricing.spec.js-snapshots/`.

- [ ] **Step 3: Run tests again (against the baselines just generated)**

Run: `npm run test:visual`
Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add tests/pricing.spec.js tests/pricing.spec.js-snapshots/
git commit -m "test(pricing): Playwright tests for 6 pricing pages + brand-truth guards"
```

---

## Task 6: Smoke + push + open PR

- [ ] **Step 1: Final build + lint check**

Run:
```bash
npm run lint
npm run build
```
Expected: both green.

- [ ] **Step 2: Run all Playwright tests**

Run: `npm run test:visual`
Expected: all tests pass (22 existing brand tests + new pricing tests).

- [ ] **Step 3: Local smoke check on all 6 pages**

Run: `npm run dev`
Walk through each pricing page in browser:
- `/products/receptionist/pricing` - 3 tiers + setup banner + enterprise banner
- `/products/messenger/pricing` - Essentials card + 3 tiers + setup banner + enterprise banner
- `/products/outreach/pricing` - Essentials card + 3 tiers + credits note + setup + enterprise
- `/products/space/pricing` - Essentials card + 3 tiers per-user + setup + enterprise
- `/products/flow/pricing` - single contact card with discovery CTA
- `/products/avatar/pricing` - single contact card with discovery CTA

Avatar product page (`/products/avatar`) - verify NO mention of SOC 2, Video Meeting Avatar, or Google Meet/Zoom integrations.

Kill dev server.

- [ ] **Step 4: Push + open PR**

Run:
```bash
git push -u origin feat/pricing-pages-rewrite
gh pr create \
  --title "feat: rewrite pricing pages per strategy spec (5 products + 2 contact-only)" \
  --body "$(cat <<'EOF'
Implements the approved pricing strategy at docs/plans/2026-04-19-pricing-strategy.md.

## Changes
- data/products.js: new billingModel discriminator, 5-tier structure for Messenger/Outreach/Space, per-minute tiers for Receptionist, contact-only descriptor for Flow/Avatar, false Avatar claims removed (SOC 2, Video Meeting Avatar)
- New shared components: EssentialsCard, EnterpriseBanner, ContactOnlyPricing, BillingToggle, ConciergeSetupBanner
- PricingCard extended to use new tier shape with productSlug-prefilled contact CTAs
- pricing page template branches by billingModel
- Playwright tests: per-page tier/banner assertions + snapshots + brand-truth guards (no SOC 2 / Video Meeting Avatar claims)

## Closes
Closes #46 #47 #48 #49 #50 #51 #57

## Test plan
- [ ] Vercel preview: walk all 6 pricing pages
- [ ] Confirm Essentials card above grid on Messenger/Outreach/Space
- [ ] Confirm Enterprise banner below grid on all tiered products
- [ ] Confirm Concierge Setup banner shows strike-through $999
- [ ] Confirm Flow/Avatar show single contact card with discovery CTA
- [ ] Confirm Avatar product page does NOT mention SOC 2 or Video Meeting Avatar
- [ ] CI green (lint + build + Playwright)
EOF
)"
```
Record PR URL in the session.

---

## Self-review checklist (controller runs this before declaring done)

- [x] Spec sections 1-6 each have a matching task: data model (Task 1), shared components (Task 2), page template (Task 3), card component (Task 4), tests (Task 5), deploy (Task 6).
- [x] Flow + Avatar contact-only routed through ContactOnlyPricing (Task 2 + 3).
- [x] Concierge Setup banner has strike-through $999 (Task 2 + Task 1 data).
- [x] Billing toggle wired but not persisting price changes (intentional - annual discount messaging only, price calculation deferred until backend supports annual billing).
- [x] Essentials card is quiet/above-grid per spec (Task 2).
- [x] Enterprise banner below grid with "from $X/mo" price hint (Task 2).
- [x] No placeholders or TBDs.
- [x] Avatar false claims removed (Task 1 Step 2, verified by tests in Task 5).

## Open questions logged for follow-up (not in this PR)

- Annual price calculation: BillingToggle UI is in place but tier prices don't actually update when user toggles to annual. Needs a small follow-up to compute annual-adjusted price (monthly × 12 × 0.83) and display alternatively. Scoped as a separate issue.
- Stripe integration: not in this PR. CTAs route to /contact form until self-serve infra is built.
- Add-ons section (custom integrations, custom AI): not in this PR. Scoped as a separate issue.
- Feature comparison table update: the existing `FeatureComparison.jsx` may need adjustments for the new tier shape if the comparison section is shown on any pricing page. Verify during smoke test.

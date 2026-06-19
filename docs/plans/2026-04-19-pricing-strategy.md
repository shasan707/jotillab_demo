# JotilLabs pricing strategy

**Date:** 2026-04-19
**Status:** Living document. Updated per-product as we brainstorm through each.
**Scope:** Market analysis, positioning, tier structure, overage model, and Enterprise mechanics for all six JotilLabs products.
**Out of scope:** Implementation of the pricing pages (handled in a separate plan once this doc is approved).

## 0. Resume context

- Pricing philosophy picked: **D (no strong preference, recommend per product based on category)**.
- Ordering: **Messenger → Outreach → Space → Flow → Avatar**. Receptionist already has a reasonable tier structure; revisit only if the other products produce a convention change.
- Each product section is added after brainstorming and user approval.

## 1. Global pricing framework

### 1.1 Tier naming convention
Standardize on **Essentials / Starter / Pro / Business / Enterprise** across every product.

- **Essentials**: solopreneur / freelancer entry point. Self-serve only. Under $50/mo. New - added after research showed prospect bounce at $89+ minimum.
- **Starter**: small-business entry. Under $100/mo where possible.
- **Pro**: highlighted default. SMB sweet spot. Mid-range price, most value.
- **Business**: serious SMB / multi-location. Concrete price, not "Contact us".
- **Enterprise**: Custom pricing, talk-to-sales. Above the Business cap.

**Why the "Essentials" name:**
- Customer-centric: signals "what's essential for YOUR business," not a stripped-down version.
- Proven across big SaaS (Dropbox Essentials, Adobe Essentials, Shopify equivalents) - prospects recognize the label instantly.
- Doesn't carry "cheap / not serious" connotations like Lite or Basic.
- Ladders cleanly across all six products (Essentials works for Messenger, Receptionist, Outreach, Space, Flow, Avatar).

Why 4 visible + Enterprise Custom:
- Essentials captures the price-first comparison shopper who currently bounces.
- Starter / Pro / Business keep the SMB comparison clean.
- Enterprise preserves pricing power for custom deals.
- 4 cards + 1 link is still scannable, especially if Essentials is styled as a "quiet" discovery card above the 3-card comparison grid (recommended layout).

### 1.2 Overage policy
Every usage-metered tier ships with an **overage rate per unit** billed at end of cycle. Rate is set so the **break-even upgrade point** happens at a reasonable overage volume (i.e., if a customer is consistently hitting overage, the math nudges them to upgrade).

Formula:
```
overage_rate = next_tier_price / (next_tier_included - current_tier_included)
```

This means: if you consistently use overage until you match the next tier's included quota, you pay exactly the next tier's price. Upgrade is the obviously-better choice before that.

Customer-facing copy: "Soft cap with per-unit overage billed at end of cycle. Alerts at 90% and 100% of included volume. Upgrade anytime to avoid overage."

### 1.3 Enterprise mechanics (applies to all products)

"Enterprise / Custom" is NOT just "call us for a number". It is a concrete tier with:

- **Minimum annual commit**: typically $15-30K ARR depending on product.
- **Volume above the Business tier cap** on the relevant metric (conversations, minutes, users, executions, interactions).
- **Paid POC / pilot**: $2-5K, credited against year-1 contract if they convert.
- **Dedicated CS + onboarding specialist.**
- **SLA guarantees**: 99.9% uptime with credits for misses.
- **SSO/SAML and advanced RBAC.**
- **Data residency option**: US, EU.
- **Custom AI fine-tuning on customer data.**
- **Custom integrations** beyond the standard connector set.
- **White-glove migration** from competitor tool.
- **Annual billing preferred** (monthly negotiable at 20%+ premium).

**Sales process:**
1. Inbound lead from pricing page "Enterprise: Talk to sales" CTA.
2. Discovery call (30 min). Needs, volume, timeline, current tool.
3. Paid POC scoped. 2-4 weeks.
4. Annual contract.

### 1.4 Unit economics framework
Assumptions (revisit quarterly with actual COGS):

| Cost element | Estimate |
|---|---|
| LLM API (per conversation, ~5-10 turns) | $0.01 - $0.05 depending on model choice |
| Twilio SMS (per outbound) | $0.0075 |
| Twilio voice (per minute, outbound AI call) | $0.015 - $0.025 |
| WhatsApp session (24h window) | ~$0.005 |
| Voice synthesis (Retell, per minute) | $0.07 - $0.12 |
| HeyGen avatar (per minute interactive) | ~$0.30 - $0.50 |
| Compute / infra overhead amortized | $0.01 - $0.02 per interaction |

**Gross margin target: 60-80%** at Pro and Business tiers. Starter can run slim for acquisition.

## 2. JotilMessenger

### 2.1 Current state (before rewrite)
- Starter $79 / 500 conversations / basic
- Professional $249 / 5,000 conversations / multi-channel
- Enterprise Custom / unlimited

### 2.2 Market analysis - full competitor tier breakdown

#### Tidio + Lyro AI (closest SMB competitor)
| Tier | Price | Lyro conversations | Channels | Notes |
|---|---|---|---|---|
| Free | $0 | 50 Lyro/mo | Web chat | Bait. Limited features. |
| Starter | $29 / mo | 100 Lyro/mo | Web chat | No SMS, no WhatsApp |
| Growth | $59 / mo | 250 Lyro/mo | Web chat | No SMS, no WhatsApp |
| Plus | $749 / mo | 5,000 Lyro/mo | + some channels | Big step, steep |
| Premium | $2,999 / mo | 10,000 Lyro/mo | All channels | $0.30 per conversation - expensive |

Per-conversation at Starter: $0.29. At Plus: $0.15. At Premium: $0.30. Not cheap at scale.

#### Intercom Fin (AI-add to Intercom)
| Line | Price | Notes |
|---|---|---|
| Intercom seat | $39-$139 / user / mo | Required baseline |
| Fin AI add-on | $0.99 / resolution | On top of seat |

Unpredictable monthly spend. A high-traffic month can balloon bills. Enterprise-trend pricing disguised as SMB.

#### ChatBot.com
| Tier | Price | Conversations | Notes |
|---|---|---|---|
| Starter | $52 / mo | 1,000 | Basic rule-based + limited AI |
| Team | $142 / mo | 5,000 | Web + FB Messenger |
| Business | $424 / mo | 25,000 | Multi-channel |
| Enterprise | Custom | Unlimited | - |

Decent value per conversation but AI quality below Intercom/Tidio.

#### Drift AI Chatbot
| Tier | Price | Notes |
|---|---|---|
| Premium | Starting ~$2,500 / mo | Contracted annual |
| Advanced | Starting ~$5,000 / mo | Enterprise |
| Enterprise | Custom | $10K+/mo |

Enterprise-only. Not for SMB.

#### HubSpot Chatbot + ChatSpot AI
| Tier | Price | Notes |
|---|---|---|
| Free | $0 | Bundled in Marketing Hub Free. Limited AI. |
| Starter | $45 / mo | Marketing Hub Starter bundle. Low-tier AI. |
| Professional | $800 / mo | Full AI features. Expensive. |
| Enterprise | $3,600+ / mo | Custom. |

Bundled with Marketing Hub, not pure-play AI chat. Appeals to customers who need the full stack.

#### Ada
| Tier | Price | Notes |
|---|---|---|
| All plans | $2,000+ / mo | Enterprise sales only |

Not SMB.

#### LivePerson (Conversational AI platform)
| Tier | Price | Notes |
|---|---|---|
| Entry | Custom, typically $1,500+/mo | Enterprise sales only |

Not SMB.

#### Competitor summary insights

1. **SMB price floor** in the category is $29-$52/mo (Tidio Starter, ChatBot.com Starter). Below this, all competitors are free tiers only.
2. **SMB Pro/Mid** is $59-$249/mo (Tidio Growth, ChatBot.com Team, Messenger proposed Pro).
3. **SMB Business** is $400-$800/mo (ChatBot.com Business, HubSpot Professional).
4. **Enterprise** starts at $1,500-$3,000/mo (Drift, Ada, LivePerson, HubSpot Enterprise).
5. **No competitor below Tidio Premium bundles web + SMS + WhatsApp + Teams in one SMB plan.** That multi-channel bundle is our wedge.
6. **Per-resolution/per-conversation metering** (Intercom Fin) is the outlier. SMBs hate unpredictable bills.

**Market finding:** SMB has converged on $50-$600/mo flat monthly tiers. JotilMessenger positioning should be:
- Essentials $39: undercuts Tidio Starter $29 only on per-conversation rate (Tidio gives 100, we give 100 at nearly identical price but include SMS).
- Starter $89: positions at-or-just-above Tidio Growth $59, with more conversations and SMS included.
- Pro $249: at SMB sweet spot, undercuts ChatBot.com Team $142 per-conversation, and multi-channel from day one.
- Business $599: far undercuts Tidio Plus $749 and ChatBot.com Business $424 on per-conversation AI capability.
- Enterprise: matches the $1,500+ Drift/Ada range but with SMB ergonomics.

### 2.3 Target customer
10-100 employee SMBs handling 500-10K customer messages per month. Dental, real-estate, small e-commerce, hospitality. Will not tolerate per-resolution metered uncertainty. Want a predictable monthly number with transparent overage.

### 2.4 Positioning
"The multi-channel AI chat SMB bundle: cheaper than Intercom, more channels than Tidio, transparent pricing."

### 2.5 Proposed tiers (revised with Essentials)

| Tier | Price | Included conversations | Knowledge bases | Channels | Key unlocks | Audience |
|---|---|---|---|---|---|---|
| **Essentials** | $39 / mo | 100 | 1 | Web chat + SMS | Basic analytics, email-only support (docs + AI bot first), self-serve signup | solopreneur, freelancer, single-practitioner, side business |
| **Starter** | $89 / mo | 500 | 1 | Web chat + SMS | Business-hours coverage, basic analytics, email support | small business (2-20 employees) |
| **Pro** (highlighted) | $249 / mo | 2,500 | 5 | + WhatsApp | 24/7, AI training, CRM sync, custom branding, chat + email support | growing SMB (10-50 employees) |
| **Business** | $599 / mo | 10,000 | 10 | + Teams, + API access | SSO, advanced analytics, priority support, multi-user admin | serious SMB / multi-location (20-100 employees) |
| **Enterprise** | Custom (from $1,500 / mo) | 10,000+ | Unlimited | All + dedicated infra | Custom AI fine-tuning, SLA, SSO/SAML, data residency, custom integrations | agency, franchise, 100+ employees |

**Pricing page layout:** Essentials sits as a "quiet" single-line entry above the 3-card comparison grid (Starter / Pro / Business). Enterprise is a "Need more? Talk to sales →" banner below the grid. Keeps scannable UX.

### 2.6 Overage rates (revised with Essentials)

| Tier | Included | Overage rate | Break-even upgrade point |
|---|---|---|---|
| Essentials | 100 conv | $0.30 / conv | ~166 overage conversations = same price as Starter. Aggressive upgrade nudge. |
| Starter | 500 conv | $0.20 / conv | ~800 overage conversations = same price as Pro. |
| Pro | 2,500 conv | $0.14 / conv | ~2,500 overage conversations = same price as Business. |
| Business | 10,000 conv | $0.08 / conv | At ~20K+ conversations/mo, Enterprise call becomes compelling. |

Customer microcopy: "Included conversations renew monthly. Need more? Overage is transparent and billed at end of cycle. Alerts at 90% and 100% of included volume."

### 2.7 Definition: conversation
A **conversation** = any customer-initiated thread, from the first customer message through 24 hours of silence (then a new customer message starts a new conversation). Industry-standard definition. Clear and predictable.

### 2.8 Unit economics check (revised with Essentials)

Per-conversation included cost at each tier:

| Tier | $/conversation included | Effective gross margin at typical use |
|---|---|---|
| Essentials | $0.390 | 80-87% (heavy headroom, but support cost drag) |
| Starter | $0.178 | 55-83% |
| Pro | $0.100 | 20-70% |
| Business | $0.060 | 0-50% at full cap, 30-70% at typical use |

**Assumed per-conversation COGS** (LLM + SMS/WhatsApp blend + infra): **$0.03 - $0.08**.

**Essentials tier operational caveats:**
- Revenue $39/mo. COGS at capped 100 conv = ~$3-8. Payment processing 3% = ~$1.20.
- Contribution margin BEFORE support: ~$30/mo/customer.
- If support cost averages $5-10/customer/mo, contribution margin NET is $20-25.
- LTV at 6% monthly churn = $300-400.
- CAC must stay below $100-150 (organic only) for Essentials to make sense. No paid ads for this tier.

**Break-even customer count check** (OPEX assumed $20-30K/mo):
- 700-1,000 Essentials customers, OR
- 200-300 Starter customers, OR
- 80-120 Pro customers, OR
- 35-50 Business customers.
Blended: realistic breakeven at ~200-300 SMB customers across all tiers.

### 2.9 Upsell path (revised)
- Essentials -> Starter: unlocked by volume >100 conv/mo, need for business-hours coverage, or staff beyond solo. Target: 15-25% in first 3-6 months.
- Starter -> Pro: unlocked by WhatsApp, AI training, CRM sync, or volume >500/mo. Target: 25-40% within 12 months.
- Pro -> Business: unlocked by Teams, API, SSO, or volume >2,500/mo. Target: 10-20% within 12 months.
- Business -> Enterprise: unlocked by volume >10K, custom AI, data residency, or security review. Target: 5-10% within 24 months.

### 2.10 Pricing page layout (customer-facing psychology)
- Essentials as small "quiet" card above the 3-card grid. Copy: *"Just getting started? Essentials at $39 →"*
- Three main cards side-by-side (Starter / Pro / Business). Pro highlighted.
- "Need more? Talk to sales →" banner below with Enterprise bullets.
- Per-card headline stat: **price + included conversations** (not just price). Makes per-conversation math visible so Tidio comparison flips to our favor.
- **Prominent 14-day free trial on Starter card** (already in data, needs surfacing).
- Toggle: Monthly / Annual. Annual = 2 months free (17% discount).

### 2.11 Open decisions (user to confirm)
- Essentials $39 tier in or out? **Recommend: in.**
- Starter price $89 vs $79: rounder anchor vs under-$80 psychological. **Default: $89.**
- Business price $599 vs publishing a higher number. **Default: $599.**
- Enterprise floor $1,500/mo or higher: **Default: $1,500/mo = $18K ARR minimum.** Lift to $2K/mo if sales finds it too low.
- Overage rates: agree with break-even-upgrade logic?
- Conversation definition (24h thread) OK?
- Annual discount 17% (2 months free) standard for all tiers?
- Essentials = fully self-serve (no sales involvement, docs + AI chatbot support only)?

### 2.12 Implementation notes (for later PR)
- Update `data/products.js` messenger.pricing block with all 5 tiers (Essentials added, Enterprise added as 5th).
- Add `overageRatePerConv` at the product level, mirroring how Receptionist has `overageRatePerMinute`.
- Add "conversation" definition tooltip/microcopy on the pricing page.
- Redesign pricing page layout: Essentials as quiet card, 3 cards main grid, Enterprise banner.
- Surface 14-day free trial prominently on Starter card.
- Add Monthly/Annual toggle.
- Under-the-hood: don't expose LLM model names on marketing page for Messenger (keep generic "best-in-class AI"). Model names exposed only on JotilSpace page.

### 2.13 Concierge Setup (current manual-onboarding reality)

Dev team sets up every account today (no self-serve infrastructure yet). Publish a **Concierge Setup** fee with strike-through messaging as a founding-customer perk.

**Banner copy under the tier grid:**
> **Concierge Setup included** - ~~$999~~ Free for founding customers.
> Our team configures your AI, knowledge base, and channels. No technical skills required - live in days, not weeks.
> [What's included in setup →]

(Note: Messenger strike-through updated from $499 to $999 to standardize across all products.)

**Setup scope by tier (Messenger-specific):**

| Tier | What concierge setup covers |
|---|---|
| Essentials | Knowledge base ingestion (1 source) + Web chat widget install + 1 SMS number + live test. No CRM, calendar, WhatsApp, or Teams. |
| Starter | Above + business-hours config + basic analytics dashboard |
| Pro | Above + WhatsApp channel + CRM sync (HubSpot / Salesforce) + AI training on your content |
| Business | Above + Teams channel + API access + SSO + advanced analytics |
| Enterprise | Full custom - model choice, data residency, white-glove migration, custom integrations |

**Add-ons (separate section, not on pricing cards):**
- Custom integration with a tool we do not support out of the box - from **$1,500**
- Custom AI fine-tuning on your data - from **$2,500**
- Branded customer portal / white-label deployment - from **$3,500**
- Dedicated phone number pool (multi-location) - from **$500/mo**

**Framing rationale:**
- "Founding customer" (not "limited-time offer") matches reality and is honest.
- Allows graceful escalation: setup fee returns after founding-customer cohort closes.
- Anchors the value of Concierge Setup without dark-pattern urgency.
- Tier-scoped features prevent Essentials from promising CRM/Calendar integrations it should not include.

**Current CTAs on pricing page (until self-serve infra ships):**

| Tier | CTA | Flow |
|---|---|---|
| Essentials | "Get started" | `/contact` form, tier-prefilled, dev onboards, Stripe invoice |
| Starter | "Start 14-day trial" | `/contact` form, tier-prefilled |
| Pro | "Start 14-day trial" | Same |
| Business | "Start 14-day trial" or "Talk to sales" | Same |
| Enterprise | "Talk to sales" | Calendar booking via Calendly/Cal.com (pending #56) |

**Self-serve infra is a separate initiative** - will unlock true Stripe checkout for Essentials and move away from manual setup. Targeted for later, not in this PR.

## 3. JotilOutreach

### 3.1 Current state (before rewrite)
- Starter $149 / 500 outbound calls + 2,000 SMS
- Professional $399 / 2,500 calls + 10,000 SMS
- Enterprise Custom / unlimited

Current volumes were enterprise-sized, not SMB. Revised below.

### 3.2 Market analysis - competitor tier breakdown

| Competitor | Tier / price | Notes |
|---|---|---|
| Goodcall | $49-$199 / mo | Voice + some SMS, SMB, decent AI. Closest apples-to-apples. |
| Synthflow | $89-$349 / mo | Voice only, SMB. No SMS bundled. |
| Squad AI | $99-$799 / mo | Outbound voice SMB |
| Bland.ai | ~$0.09 / min + platform fee | Developer, raw API, no campaign tooling |
| Retell | ~$0.07 / min base | Developer, raw API |
| Regal.io | $1,500-$5,000 / mo | Contact-center AI, enterprise |
| Air AI | $2,000-$5,000+ / mo | Enterprise only |
| Replicant | $10K+ / mo | Enterprise only |
| SimpleTexting / EZ Texting | $25-$299 / mo | SMS-only blast, no AI, no voice |
| Klaviyo SMS / Attentive | Usage-based | E-commerce SMS focus |

**Wedge:** No SMB platform bundles AI voice outbound + SMS campaigns + CRM sync in one plan. Competitors are voice-only, SMS-only, or enterprise-only.

### 3.3 Target customer + realistic volumes

| Segment | Typical outbound volume per month |
|---|---|
| Solo practitioner / solopreneur | 50-200 calls |
| Small business (1-10 staff) | 200-500 calls |
| Growing SMB (10-30 staff) | 500-1,000 calls |
| Multi-location SMB ceiling | 1,500-2,000 calls |
| Above 2,000 calls / mo | Call-center / enterprise |

**SMB outbound does not reach 10K calls/mo.** Enterprise-sized tier volumes don't exist in this segment. Revised pricing below reflects this.

Use cases by industry:
- Dental / medical: appointment reminders, lapsed-patient reactivation
- Real estate: lead follow-up, listing notifications
- HVAC / plumbing / field services: seasonal reactivation, scheduling
- Auto dealers: service reminders, trade-in campaigns
- Legal intake: consult booking
- Fitness / gyms: membership renewal, cold outreach

### 3.4 Positioning + wedge
"Voice + SMS outbound in one SMB-priced platform. TCPA-compliant, CRM-synced, scheduled campaigns without a call center."

### 3.5 Pricing model decision: CREDITS (unique to this product)

Why credits instead of separate voice-minutes and SMS buckets:
- Customers mix voice/SMS wildly across campaigns. Fixed buckets waste capacity for most customers.
- Simpler pricing messaging (one number on card vs two).
- Easier to extend (WhatsApp, future channels = one more credit rate).
- Matches industry patterns (Zapier tasks, Make operations, HeyGen credits).
- Better margin through flexible substitution.

**Conversion rate: 1 credit = 1 minute of outbound voice = 5 SMS.**

Why 1:5 ratio:
- 1 min outbound voice COGS ≈ $0.20 (Retell $0.07 + Twilio $0.014 + LLM $0.02 + dialer/pacing $0.04 + scheduling infra $0.025 + compliance $0.015)
- 5 SMS COGS ≈ $0.125 (5 × $0.025 with A2P + LLM)
- Ratio approximates cost parity, clean mental math

**Messenger stays on conversation-buckets (not credits) because chat conversations are naturally one unit.** Credits only for Outreach where channel mix is the flexibility driver.

### 3.6 Proposed tiers (credit-based)

| Tier | Price | Credits / mo | Voice-only max | SMS-only max | $/credit |
|---|---|---|---|---|---|
| **Essentials** | $149 / mo | 150 | 150 min (~100 calls at 90s avg) | 750 SMS | $0.99 |
| **Starter** | $249 / mo | 500 | 500 min (~330 calls) | 2,500 SMS | $0.50 |
| **Pro** (highlighted) | $599 / mo | 1,500 | 1,500 min (~1,000 calls) | 7,500 SMS | $0.40 |
| **Business** | $999 / mo | 3,000 | 3,000 min (~2,000 calls) | 15,000 SMS | $0.33 |
| **Enterprise** | Custom (from **$2,000 / mo**) | 5,000+ | Negotiated | Negotiated | Custom |

**$/credit decreases per tier = built-in volume discount ladder.** Pro is 60% cheaper per credit than Essentials.

**Call duration caps** (protect COGS): Essentials 3 min, Starter 5 min, Pro 7 min, Business 10 min, Enterprise negotiable. Realistic outbound calls are 60-120 sec.

### 3.7 Overage rates

| Tier | Over-credit rate | Break-even upgrade |
|---|---|---|
| Essentials | $1.20 / credit | ~85 overage credits = Starter price |
| Starter | $0.60 / credit | ~580 overage credits = Pro price |
| Pro | $0.40 / credit | ~1,000 overage credits = Business price |
| Business | $0.30 / credit | At 4K+ credits/mo, Enterprise conversation compelling |

### 3.8 Feature matrix

**Every tier baseline (non-negotiable):** TCPA + A2P 10DLC compliance, recording + transcription, basic AMD, opt-out tracking + audit trail, Concierge Setup (free for founding customers).

| Capability | Essentials | Starter | Pro | Business | Enterprise |
|---|---|---|---|---|---|
| Active campaigns | 1 | 3 | 10 | Unlimited | Unlimited |
| Concurrent (parallel) calls | 1 | 2 | 5 | 15 | 25+ |
| Channels: voice + SMS | yes | yes | yes | yes | yes |
| WhatsApp outbound | — | — | yes | yes | yes |
| Voicemail drops (AI) | — | — | yes | yes | yes |
| Live transfer (AI to human) | — | — | — | yes | yes |
| Contact upload (CSV) | 500 | 5,000 | 25,000 | Unlimited | Unlimited |
| CRM sync (HubSpot, Salesforce, Pipedrive) | — | — | yes | yes | yes + custom |
| Script source | AI templates | AI from your offer | AI trained on your KB | + custom scripts | Custom fine-tuning |
| Scheduling | Simple window | Time-zone aware | Advanced (best-time, drip) | + manual overrides | Custom logic |
| Retry logic | 1 retry | Up to 3 configurable | Smart (AMD-aware) | Smart + custom rules | Custom |
| A/B testing | — | — | yes | yes | yes |
| Analytics | Basic | Dashboard | Funnel + sentiment | + custom dashboards + scheduled reports | + data export |
| API access | — | — | — | yes | yes + priority |
| Team + roles | 1 user | 3 users | 10 users | Unlimited + RBAC | + SSO/SAML |
| Dedicated number pool | — | — | Shared | Dedicated | Dedicated + BYON |
| SLA | — | — | — | 99.5% | 99.9% with credits |
| Data residency | US | US | US | US | US or EU |
| Support | Docs + AI chatbot + email | Email | Chat + email | Priority (same-day) | Dedicated CSM |

**Reality flags (confirm before ship):** live transfer, voicemail drops, smart retry, best-time-to-contact ML, drip sequences, A/B testing, WhatsApp outbound, API, SSO/SAML - which are built vs roadmap? Roadmap items move to Enterprise as "available on request" or get cut.

### 3.9 Unit economics check

| Tier | All-voice max COGS | All-SMS max COGS | Mixed (60%) COGS | Margin at max-voice | Margin at 60% mixed |
|---|---|---|---|---|---|
| Essentials | 150 × $0.20 = $30 | 750 × $0.025 = $19 | ~$17 | 80% | 89% |
| Starter | 500 × $0.20 = $100 | 2,500 × $0.025 = $63 | ~$50 | 60% | 80% |
| Pro | 1,500 × $0.20 = $300 | 7,500 × $0.025 = $188 | ~$150 | 50% | 75% |
| Business | 3,000 × $0.20 = $600 | 15,000 × $0.025 = $375 | ~$300 | 40% | 70% |

Every tier clears 40%+ gross margin even at worst-case (all-voice, max usage). Typical use hits 70-80%+.

### 3.10 Concierge Setup scope per tier

| Tier | Setup includes | Estimated internal cost |
|---|---|---|
| Essentials | Caller ID + A2P 10DLC registration + 1 campaign + basic script + test calls | ~3 hrs (~$150) |
| Starter | + CRM CSV import + 2-3 templates + time-zone pacing | ~4 hrs (~$200) |
| Pro | + A/B testing + CRM sync + AI script training + AMD tuning | ~8 hrs (~$400) |
| Business | + API integration + dedicated number pool + SSO + custom analytics | ~15 hrs (~$750) |
| Enterprise | + TCPA compliance audit + custom AI fine-tuning + SLA + white-glove migration | Custom ($2,500-$5,000) |

**Setup-fee messaging on the pricing page:**

> **Concierge Setup included** - ~~$999~~ Free for founding customers.
> We configure your campaigns, register A2P 10DLC, connect your CRM, and train the AI on your scripts. No technical skills required. Live in days, not weeks.
> [What's included in setup →]

Strike-through set at $999 (not $499 like Messenger) because Outreach has materially higher setup overhead - A2P registration alone, compliance verification, caller ID, initial campaign design. Higher strikethrough anchors more perceived value.

### 3.11 Pricing page layout

Same pattern as Messenger:
- Essentials = quiet single-line entry card above main grid
- 3-card comparison grid: Starter / Pro (highlighted) / Business
- Enterprise = "Need more? Talk to sales →" banner below
- "Concierge Setup - $999 free" banner at bottom with expandable details
- Add-ons section (custom integrations, custom AI, dedicated infra)
- Monthly / Annual toggle (annual = 2 months free = 17%)
- On each card, show examples: "150 credits = ~100 calls OR 750 SMS OR any mix"

### 3.12 Current CTAs (until self-serve infra ships)

| Tier | CTA | Flow |
|---|---|---|
| Essentials | "Get started" | `/contact` form, tier-prefilled, dev onboards, Stripe invoice |
| Starter | "Start 14-day trial" | `/contact` form |
| Pro | "Start 14-day trial" | Same |
| Business | "Start 14-day trial" or "Talk to sales" | Same |
| Enterprise | "Talk to sales" | Calendar booking (pending #56) |

### 3.13 Implementation notes (for later PR)

- Update `data/products.js` outreach.pricing block to credit-based model (new shape, different from Messenger's conversation buckets).
- Add `pricing.type: 'credits'` discriminator so the pricing page renders the credit card UI vs bucket UI.
- Credit conversion rate stored alongside: `{ creditMinutesVoice: 1, creditSMS: 5 }`.
- Pricing card template: show credit count + "equals ~X calls OR Y SMS" examples.
- Feature matrix UI for comparison table (probably the existing `FeatureComparison` component needs extension).
- Concierge Setup strike-through: $999 for Outreach (different from Messenger's $499).
- Compliance copy callout on product page (A2P + TCPA as features, not warnings).

## 4. JotilSpace

### 4.1 Current state (before rewrite)
- Team $49 / user / mo / up to 10 users
- Business $99 / user / mo / unlimited users
- Enterprise Custom / custom deployment

### 4.2 Product scope
SMB workspace bundling: CRM + Help Desk / Tickets + Calendar + **multi-model AI Agents** (LibreChat-style). The ONLY JotilLabs product where model names (GPT-4o, Claude, Gemini) are exposed publicly because model choice IS the product value.

### 4.3 Market analysis

| Category | Competitor | Per-user price | Notes |
|---|---|---|---|
| CRM | HubSpot Starter / Pro | $18-$100 / user / mo | Strong SMB |
| CRM | Salesforce | $25-$330 / user / mo | Enterprise-weighted |
| CRM | Pipedrive | $14-$99 / user / mo | SMB standard |
| CRM | Zoho CRM | $14-$52 / user / mo | SMB |
| CRM | Copper | $29-$134 / user / mo | Gmail-first |
| Help desk | Zendesk | $19-$199 / user / mo | Category standard |
| Help desk | Freshdesk | Free-$83 / user / mo | SMB |
| Help desk | Intercom | $39-$139 / user / mo | Premium SMB |
| AI workspace | ChatGPT Team | $25 / user / mo | Single-model |
| AI workspace | Claude Team | $25-$30 / user / mo | Single-model |
| AI workspace | Poe / LibreChat cloud | $5-$20 / user / mo | Chat only, no CRM |
| Workspace | Monday CRM | $19-$28 / user / mo | Generic workspace |
| Workspace | Notion | $10-$15 / user / mo | Docs-first |
| Workspace | ClickUp | $7-$12 / user / mo | Project management |

### 4.4 Wedge
**No competitor bundles CRM + Tickets + Calendar + MULTI-MODEL AI in one product.** HubSpot Einstein locked to their model. Salesforce Einstein same. LibreChat is AI-only (no CRM). Our angle: *"Your CRM + Tickets + Calendar AND every frontier AI model (GPT, Claude, Gemini) in one interface. Stop paying for five subscriptions."*

### 4.5 Target customer
- SMB teams 2-50 users, some mid-market (up to 200 users)
- Currently paying for: CRM (HubSpot/Pipedrive) + Help desk (Zendesk) + Calendar + ChatGPT Team = $100-150/user aggregate
- Want consolidation, multi-model AI access, no enterprise complexity
- Model choice matters (different work suits different models)

### 4.6 Positioning
"One workspace. Your CRM, tickets, calendar, and every AI in one interface. Pay for what your team uses, not five separate subscriptions."

### 4.7 Proposed tiers (per-user, industry standard)

| Tier | Price / user / mo | AI queries / user / mo | Contacts | Tickets / mo | AI models |
|---|---|---|---|---|---|
| **Essentials** | $19 | 0 (no AI agents) | 500 | 200 | — |
| **Starter** | $39 | 500 | 2,500 | 1,000 | GPT-4o-mini |
| **Pro** (highlighted) | $79 | 2,500 | Unlimited | 5,000 | GPT-4o, Claude Sonnet, Gemini Pro |
| **Business** | $149 | 5,000 | Unlimited | Unlimited | All + concurrent multi-agent |
| **Enterprise** | Custom (from **$199 / user**, 25 user minimum) | Unlimited / negotiated | Unlimited | Unlimited | All + fine-tuned on your data |

### 4.8 Feature matrix

| Capability | Essentials | Starter | Pro | Business | Enterprise |
|---|---|---|---|---|---|
| CRM pipelines | yes | yes | + custom fields + sequences | + advanced automations | + custom workflow engine |
| Tickets | yes | yes | + AI auto-response | + AI triage + routing | + custom logic |
| Calendar | yes | + AI booking | + smart scheduling | + team calendars + rules | + custom integrations |
| AI Agents | — | 1 model, 500 q | 3 models, 2,500 q, concurrent | All models, 5,000 q | Custom + fine-tuned |
| Knowledge bases | 1 | 3 | 10 | 50 | Unlimited |
| Automations | — | 5 | 25 | Unlimited | Custom |
| Integrations | Email | + Zapier | + HubSpot/Salesforce + 100+ connectors | + API access | Custom |
| Team roles | 1 admin | Admin + member | + custom roles | RBAC + SSO | SSO/SAML + data residency |
| Analytics | Basic | Dashboard | + funnel + AI insights | + custom dashboards + scheduled reports | + data export |
| Support | Docs + email | Email | Chat + email | Priority (same-day) | Dedicated CSM |

### 4.9 Unit economics check

Per-user COGS assumptions (confirm with real infra data):
- LLM cost per query: $0.01 average (mix of cheap and frontier models)
- Base SaaS infra per user (DB, storage, compute, monitoring): $3-8/mo
- Payment processing: 3% of revenue

| Tier | LLM cost | Infra cost | Total COGS/user | Revenue/user | Margin |
|---|---|---|---|---|---|
| Essentials | $0 | $3 | $3 | $19 | 84% |
| Starter | $5 | $4 | $9 | $39 | 77% |
| Pro | $25 | $6 | $31 | $79 | 61% |
| Business | $50 | $8 | $58 | $149 | 61% |
| Enterprise | Capped per contract | $10+ | Custom | $199+ | Target 65%+ |

All tiers clear 60%+ gross margin. Healthy.

### 4.10 AI query definition
"Query" = one user-AI interaction that produces a model response. Multi-turn conversations = multiple queries (each new user message counts as 1). Token-capped at ~4K input + 2K output per query to prevent runaway cost. Overage rate: $0.05/query above included allotment. Alerts at 90% and 100%.

### 4.11 Concierge Setup

Setup includes:
- CRM pipeline configuration + data migration (from HubSpot/Pipedrive/Salesforce CSV)
- Ticket routing rules + templates
- Calendar integration (Google/Outlook)
- User provisioning + roles setup
- AI agents configured per tier (Starter+)
- Knowledge base ingestion (Starter+)
- Training session with admin user

Per-tier internal cost:

| Tier | Internal hours | Internal cost |
|---|---|---|
| Essentials | ~3 | ~$150 |
| Starter | ~5 | ~$250 |
| Pro | ~10 | ~$500 |
| Business | ~20 | ~$1,000 |
| Enterprise | Custom | $3,000-$10,000 |

**Setup fee: ~~$999~~ free for founding customers** (same strike-through as Outreach for consistency). Business tier's true cost approaches the $999 anchor; Essentials/Starter give room during founding phase.

### 4.12 Multi-model exposure on pricing page

Unlike other products, Space explicitly lists AI models because model choice IS the value:

- **Starter**: "GPT-4o-mini"
- **Pro**: "GPT-4o, Claude Sonnet, Gemini Pro"
- **Business**: "All frontier models + custom system prompts per agent"
- **Enterprise**: "All models + fine-tune on your data + custom deployment"

Copy guideline: *"Bring your own API key OR use ours"* as an Enterprise perk (customers with existing OpenAI/Anthropic contracts can use their own billing, reducing our LLM cost + giving them control).

### 4.13 Current CTAs (until self-serve infra ships)

| Tier | CTA | Flow |
|---|---|---|
| Essentials | "Get started" | `/contact` form, tier-prefilled |
| Starter | "Start 14-day trial" | `/contact` form |
| Pro | "Start 14-day trial" | Same |
| Business | "Start 14-day trial" or "Talk to sales" | Same |
| Enterprise | "Talk to sales" | Calendar booking (pending #56) |

### 4.14 Open decisions

1. Essentials $19 OK or push to $25 for margin safety?
2. Enterprise minimum = 25 users? Some SaaS set 50+; raises floor but harder to land.
3. Business $149 concrete vs "Talk to sales"?
4. Query cap = per-user-per-month vs pooled team quota? Per-user is standard; pooled is more flexible for small teams.
5. Which models are actually wired in the backend today? Marketing pages can only promise what's built.
6. "Bring your own API key" for Enterprise - confirm architecturally possible?

### 4.15 Implementation notes (for later PR)

- Update `data/products.js` space.pricing block to 5-tier per-user structure.
- Add `pricing.billingUnit: 'per_user'` discriminator.
- Add AI queries/user/mo as a field.
- Expose model list per tier on the pricing page (unlike Messenger/Outreach/Receptionist which use generic "best-in-class AI").
- Strike-through $999 Concierge Setup banner.
- Per-user pricing toggle: show monthly-per-user AND annual-per-user (with 17% discount).
- User-count input widget on pricing card: lets visitor enter team size, see total cost per month.

## 5. JotilFlow

### 5.1 Current positioning (approved)

**JotilFlow is a bespoke service offering: workflow automation and custom AI agent development for SMBs.** Not a self-serve product today. The pricing page shows a single "Contact us" path, not tiered plans.

Why this position for now:
- Product is service-led. Each customer's automation is designed and built by the JotilLabs team.
- Requirements vary wildly by customer; fixed tiers would mis-price 80% of engagements.
- Consulting + development hours are the actual work, not SaaS quota.
- Allows the team to say yes to revenue without forcing customers into a bad-fit tier.

Pricing page messaging:
> "**JotilFlow** - Workflow automation and AI agent development tailored to your business. Every engagement is scoped to what you need. Talk to us and we'll map the first automation in your free discovery call."
> [Book discovery call →]

### 5.2 Services we offer (for the Flow page)

1. **Workflow automation design and build** - We map your current manual processes, identify the high-ROI ones, and build automations that run 24/7.
2. **Custom AI agent development** - Build AI agents that handle specific tasks in your business: qualifying leads, drafting replies, summarizing calls, categorizing tickets, generating reports.
3. **Tool integrations** - Connect the tools you already use (CRM, calendar, SMS, email, CMS, accounting, scheduling). We handle auth, data mapping, error handling.
4. **Scheduled and event-driven automations** - Cron-like triggers, webhook listeners, time-zone-aware pacing.
5. **AI decision logic** - Inject AI reasoning into your workflows: classifier nodes, routing decisions, content generation, content validation.
6. **Process consulting** - Audit current operations, identify automation opportunities, prioritize by ROI, build a phased roadmap.
7. **Migration from existing tools** - Move automations out of Zapier / Make / n8n when they've become fragile or expensive to maintain.
8. **Monitoring and maintenance** - Ongoing watch on running workflows, alerts, and tuning.
9. **Training and handoff** - Team training so your internal people can operate and extend the automations we build.
10. **Retainer arrangements** - Monthly retainer for ongoing automation work (new builds + maintenance).

### 5.3 Pricing page copy (Flow specifically)

Replace the existing 3-tier pricing table with a single contact card:

```
Not one-size-fits-all.
Your automations are designed around your business.

Every Flow engagement starts with a 30-minute discovery call.
We map the highest-ROI automations for you, then scope the build.

[Book discovery call →]

Typical engagements
- Custom workflow build (1-3 automations): project-based
- Monthly retainer (ongoing builds + maintenance): monthly
- AI agent development (custom LLM agents): project-based
- Process consulting (audit + roadmap): project-based

Every engagement includes:
- Discovery + scoping
- Design + build
- Testing + monitoring
- Training + handoff
- Documentation
```

### 5.4 Indicative price bands (internal reference, NOT published)

Keep this internal for sales calls and quoting. Do NOT publish on website.

| Engagement type | Typical price band | Notes |
|---|---|---|
| Single custom workflow build (1-3 automations) | $1,500-$5,000 project | Scoped to complexity. 1-2 weeks delivery. |
| AI agent development (1 agent, specific task) | $3,000-$8,000 project | 2-4 weeks delivery. Includes prompt engineering, testing, deployment. |
| Process audit + roadmap | $1,500-$3,000 project | 1 week delivery. Written report + prioritized list. |
| Monthly retainer (ongoing builds + maintenance) | $1,500-$5,000 / mo | Negotiated. Hours of build + monitoring + team availability. |
| Migration from existing platform (Zapier/Make/n8n) | $2,000-$10,000 project | Depending on number of workflows. |
| Dedicated automation engineer (embedded) | $8,000-$15,000 / mo | Enterprise-only. Full-time equivalent. |

**Minimum engagement: $1,500.** Below that, direct them to self-serve alternatives (Zapier, Make). Not worth our dev cycle.

### 5.5 Future productization (DEFERRED)

If you later decide to productize Flow as self-serve with tiers (like Zapier competitor), see Section 5.6 below for the tier analysis done during brainstorming. That analysis is **paused**, not executed. Revisit when:
- Self-serve infrastructure is built
- Connector library has 100+ integrations
- Visual workflow builder is stable
- Customer demand validates a productized model over bespoke services

### 5.6 Deferred: productized tier analysis (future reference)

The following analysis was done during pricing brainstorming and is preserved here for future use. **NOT the current plan.** The current plan is bespoke services per Section 5.3.

Proposed tier structure (for when Flow becomes self-serve):

| Tier | Price | Workflows | Executions/mo | AI Decision calls/mo | Concurrent | Consulting hours |
|---|---|---|---|---|---|---|
| Essentials | $99 / mo | 3 | 1,000 | — | 1 | Setup only |
| Starter | $249 / mo | 10 | 10,000 | 500 | 2 | + 1 hr/mo check-in |
| Pro | $599 / mo | 50 | 50,000 | 2,500 | 5 | + 2 hrs/quarter review |
| Business | $1,499 / mo | Unlimited | 200,000 | 10,000 | 15 | + 2 hrs/mo dedicated consultant |
| Enterprise | Custom (from $3,000 / mo) | Unlimited | Unlimited | Unlimited | Unlimited | Dedicated + weekly sync |

**Key design decisions preserved:**
- Metering: executions AND AI decision calls priced separately (protects margin on AI-heavy workflows).
- Concurrent executions capped per tier (infra cost lever).
- Consulting hours bundled (managed-service positioning vs DIY Zapier).
- Setup fee ~~$999~~ free for founding customers (consistent with other products).
- Target gross margin: 60%+ at typical use across all tiers.

**Open questions that would need answering before productization:**
- Is the visual builder built? Real drag-and-drop or hand-coded?
- AI Decision Nodes - real feature or aspirational?
- Connector count - 20? 50? 100+?
- Current customers - are any actually using Flow today?

### 5.7 Concierge Setup (for bespoke services)

Setup fee is effectively the discovery + scoping + build time of the project itself. No separate setup line item on the website. Project price IS the setup+build price.

### 5.8 Implementation notes

- Replace `data/products.js` flow.pricing tier block with a single "contact" descriptor.
- Update the Flow product page to remove the 3-card pricing table, replace with the single discovery-call CTA block (copy in Section 5.3).
- Keep Flow in the nav Solutions dropdown with the updated oneLiner.
- Add a separate internal Google Doc / Notion with the indicative price bands from Section 5.4 for sales team reference.

## 6. JotilAvatar

### 6.1 Current positioning (approved)

**JotilAvatar is a bespoke service offering: branded AI avatars for websites and digital touchpoints.** Not self-serve. Every engagement is scoped per customer because avatar training, brand voice, and integration setup are custom work.

Status as of 2026-04-20:
- Avatar is LIVE
- Backed by **Anam AI** (Anam has its own subscription + per-minute usage cost that flows to us)
- Real features: website embedding, on-premise deployment option, 30+ languages
- **NOT built (but marketing claims it):** video-meeting avatar, SOC 2 compliance, video-call context-awareness. See issue #57 for removal.

### 6.2 Services we offer (for the Avatar page)

1. **Website AI Avatar deployment** - Embed a branded avatar on your site that greets visitors, answers questions, guides them to products. Real-time lip sync + natural conversation.
2. **Custom avatar creation** - Train an avatar on your brand voice, clothing, personality, appearance. Multiple personas for different site sections if needed.
3. **Multilingual avatars** - Deploy in any of 30+ languages with native accents.
4. **Integration with your content** - Feed the avatar your product docs, FAQs, pricing so it answers grounded in your actual business.
5. **On-premise deployment** (for regulated industries) - Deploy avatar infrastructure inside your environment for data-sensitive use cases.
6. **Analytics and conversation review** - See what visitors ask, improve the avatar's responses over time.
7. **Ongoing tuning** - Monthly retainer for updates, new content ingestion, persona changes.

### 6.3 Pricing page copy (Avatar specifically)

Replace the existing 3-tier pricing table with a single contact card:

```
Every avatar is built for your brand.

Your avatar looks like your brand, sounds like your brand, and knows your products.
Every engagement starts with a 30-minute discovery call.
We design the avatar, train it on your content, and deploy it on your site.

[Book discovery call →]

What's included in every engagement
- Avatar design (appearance, voice, personality tuned to your brand)
- Content ingestion (your FAQs, product docs, pricing)
- Website embed with brand-matched styling
- Multi-language support if needed
- Analytics dashboard
- 30-day tuning period after launch

Optional add-ons
- On-premise deployment (for regulated industries)
- Multiple avatars / personas (different for marketing, support, onboarding)
- Monthly retainer for content updates and tuning
```

### 6.4 Indicative price bands (internal reference, NOT published)

| Engagement type | Typical price band | Notes |
|---|---|---|
| Single-avatar website deployment | $3,000-$8,000 project + monthly | Project = avatar design + training + embed. Monthly = Anam AI subscription pass-through + our compute + light maintenance. |
| Monthly subscription (after launch) | $299-$999 / mo | Covers Anam AI usage (~$200-600/mo typical) + our infra + minor tuning. Plan limits based on avatar-minute usage. |
| Multi-avatar deployment (3+ personas) | $8,000-$20,000 project + $899+/mo | Multiple personas share infra, different content domains. |
| On-premise deployment | $20,000-$50,000 project + $2,000-$5,000/mo | Private compute, dedicated Anam enterprise contract or alternative. |
| Monthly tuning retainer | $500-$1,500 / mo | Content updates, persona adjustments, analytics review. |
| Dedicated avatar engineer (enterprise) | $10,000-$18,000 / mo | Full-time equivalent for enterprise deployments. |

**Minimum engagement: $3,000 one-time + $299/mo.** Below that, the cost of Anam AI + our infra + engineering time makes it unprofitable.

**Anam AI pass-through consideration:** Anam has its own subscription + per-minute usage costs. These flow to JotilLabs as COGS. Monthly subscription tiers should be **margin-positive above Anam cost + our infra**, not just cover Anam.

### 6.5 Unit economics (so you know the cost floor)

Per-minute of interactive avatar use:
- Anam AI per-minute: $0.30-$0.50
- LLM for conversation: $0.02-$0.05
- TTS / streaming: $0.02-$0.05
- Our compute / infra: $0.02-$0.04
- **Total per-minute COGS: $0.36-$0.64**

Typical usage patterns:
- Light use (small website, 5-10 avatar-min/day): 150-300 min/mo = $54-$192 COGS
- Moderate (medium website, 30-60 avatar-min/day): 900-1,800 min/mo = $324-$1,152 COGS
- Heavy (high-traffic site, 100+ avatar-min/day): 3,000+ min/mo = $1,080+ COGS

Monthly pricing must cover COGS + infra + margin. Minimum $299/mo covers light use. Heavier use requires bigger monthly subscriptions (or usage-metered overage).

### 6.6 Monthly subscription tiers (internal reference - may eventually publish)

These are NOT the website pricing. They're what we quote in discovery calls after scoping the customer's expected avatar-minutes.

| Plan | Monthly | Included avatar-minutes | Target customer |
|---|---|---|---|
| Avatar Lite | $299 / mo | 500 min | Low-traffic website, single avatar |
| Avatar Standard | $699 / mo | 1,500 min | Medium website, 1-2 personas |
| Avatar Pro | $1,499 / mo | 4,000 min | High-traffic site, multiple personas, full tuning |
| Avatar Enterprise | Custom (from $3,500/mo) | Custom | On-premise, enterprise deployment |

Overage at all tiers: $0.75/min above included allotment. Equivalent to "upgrade to next tier makes sense at ~30% over cap."

### 6.7 Future productization (DEFERRED)

If Avatar becomes self-serve later (customer-driven avatar creation UI, auto-training on uploaded content, self-serve billing), productized tier model would look like:

| Tier | Price | Avatars | Avatar-minutes/mo | Channels |
|---|---|---|---|---|
| Essentials | $99 | 1 | 200 min | Website embed only |
| Starter | $299 | 1 | 500 min | + multi-language |
| Pro | $699 | 2 | 1,500 min | + analytics + multiple personas |
| Business | $1,499 | 5 | 4,000 min | + on-premise option + API |
| Enterprise | Custom | Unlimited | Negotiated | + dedicated + SLA + fine-tuning |

Gated on:
- Self-serve avatar creation UI (customers design their own avatars without our team)
- Auto content ingestion (upload site URL, auto-extract FAQ)
- Billing integration (Stripe usage-metered)
- SOC 2 certification (for Enterprise)
- Video-meeting avatar capability (if that becomes a feature)

### 6.8 Concierge Setup

For bespoke services: the project fee IS the setup. Discovery call scopes it, invoice is sent.

For when/if productized: Setup fee ~~$1,499~~ free for founding customers (higher than other products because avatar setup is more custom - training the avatar on voice/appearance/content takes ~10-20 hours of work).

### 6.9 Implementation notes

- Replace `data/products.js` avatar.pricing tier block with a single "contact" descriptor.
- Update the Avatar product page to remove the 3-card pricing table, replace with the single discovery-call CTA block (copy in Section 6.3).
- **Fix false claims** per issue #57 before updating pricing page (remove SOC 2, video meeting avatar, video call context).
- Keep Avatar in the nav Solutions dropdown with the updated oneLiner.
- Add indicative price bands from Section 6.4 + monthly tiers from Section 6.6 to the internal sales reference doc.

## 7. Decision log

| Date | Decision | Rationale |
|---|---|---|
| 2026-04-19 | Pricing philosophy = D (recommend per product) | User deferred positioning to me. |
| 2026-04-19 | Tier naming = Starter / Pro / Business / Enterprise across all products | Consistency over per-product labels. |
| 2026-04-19 | Enterprise always = concrete mechanics, not "call us for anything" | Protects margin, sets expectations. |
| 2026-04-19 | Overage formula = break-even-at-next-tier | Self-nudging upgrade path. |
| 2026-04-19 | Added **Essentials** tier at $39/mo across products | Captures price-first comparison shopper. Matches Tidio $29 psychological floor without racing to bottom. |
| 2026-04-19 | "Essentials" chosen over Solo / Lite / Basic / Launch / Spark | Customer-centric, works across all 6 products, proven in category (Dropbox, Adobe, Shopify). |
| 2026-04-19 | LLM model names (GPT, Gemini, Claude) NOT exposed on marketing pages | Avoid lock-in signaling, customer doesn't care, preserves flexibility. **Exception: JotilSpace page exposes model choice as a feature.** |
| 2026-04-19 | Annual discount = 17% (2 months free) on all tiers | Industry standard, cash-flow friendly. |
| 2026-04-20 | Messenger Concierge Setup scope limited per tier (Essentials does NOT include CRM/Calendar integrations) | Tier features must ladder. Essentials is a light-touch entry tier, not a full setup. |
| 2026-04-20 | Outreach uses CREDIT-BASED pricing, 1 cr = 1 min voice = 5 SMS | Multi-channel flexible use demands it. Messenger stays on conversation buckets. |
| 2026-04-20 | Outreach SMB volume ceilings corrected (Business = 3,000 credits ≈ 2,000 calls, not 10K) | Earlier proposal was enterprise-sized; SMB reality is 1.5-2K calls/mo max before call-center territory. |
| 2026-04-20 | Outreach Concierge Setup strike-through = $999 (vs Messenger $499) | Outreach has materially higher setup overhead: A2P registration, caller ID, campaign design, compliance verification. |
| 2026-04-20 | Concurrent/parallel call caps per tier (1/2/5/15/25+) | Parallel calls = real infra cost driver. Throttling protects margin and creates a speed-advantage reason to upgrade. |
| 2026-04-20 | Call duration caps per tier (3/5/7/10/custom min) | Protect COGS. Realistic outbound is 60-120s; caps are generous but prevent runaway cost. |
| 2026-04-20 | Space uses per-user pricing (not credits) | Industry standard for workspace/CRM. Users = seats = value metric. |
| 2026-04-20 | Space AI queries metered per-user-per-month (not pooled) | Standard SaaS AI pattern. Predictable per-seat economics. |
| 2026-04-20 | Space explicitly lists AI model names on pricing page | Multi-model IS the product wedge - naming models is the feature, not lock-in. Exception to the "don't name models" rule for other products. |
| 2026-04-20 | Space Enterprise minimum = 25 users | Reasonable floor. Below that, Business tier covers them. |
| 2026-04-20 | "Bring your own API key" as Enterprise perk | Reduces our LLM cost on the heaviest users. Customer benefits from their own rate-limits / contracts. |
| 2026-04-20 | Setup fee strike-through standardized at $999 across all three products analyzed so far (Messenger was $499; unified to $999 for messaging consistency) | ONE strike-through number across products simplifies marketing and anchors higher perceived value. Updated Messenger to $999 as well. |
| 2026-04-20 | JotilFlow positioned as bespoke services (NOT productized tiers) | Product is service-led today. Self-serve infra and productized tiering deferred until visual builder, connectors, and self-serve UX exist. |
| 2026-04-20 | Flow pricing page = single "Contact us" / "Book discovery call" CTA | Every engagement scoped individually. Fixed tiers would mis-price 80% of customers. |
| 2026-04-20 | Indicative Flow price bands kept INTERNAL (not published) | Sales team reference only. Gives quoting consistency without committing publicly. |
| 2026-04-20 | Flow productized tier analysis PRESERVED in Section 5.6 for future | When the product is ready to self-serve, the analysis is there. Don't start from scratch. |
| 2026-04-20 | JotilAvatar positioned as bespoke services (NOT productized tiers) | Not self-serve today. Avatar training + brand voice + content ingestion is custom per engagement. |
| 2026-04-20 | Avatar uses Anam AI (not HeyGen as previously noted) | Confirmed with user 2026-04-20. Anam has subscription + per-minute cost; flows to JotilLabs as COGS. |
| 2026-04-20 | False claims on Avatar page (SOC 2, video meeting avatar, video call context) flagged for removal | See issue #57. SOC 2 false-claim carries legal risk. |
| 2026-04-20 | Avatar minimum engagement $3,000 one-time + $299/mo | Anam AI + our infra + engineering time make below this unprofitable. |
| 2026-04-20 | Avatar productized tier model deferred; gated on self-serve UI + content ingestion + SOC 2 | Same pattern as Flow. Services-led today, productized later if demand justifies. |

## 8. Open questions

- COGS numbers above are industry-general. Want to tighten with real JotilLabs infra bills.
- Enterprise floor $1,500/mo assumes paid POC preceding. Confirm this fits the current sales motion.
- Annual discount percentage for each tier (standard is 17% = 2 months free). Not decided yet.
- Taxation / billing platform (Stripe, Chargebee, etc.): assumed Stripe but confirm.

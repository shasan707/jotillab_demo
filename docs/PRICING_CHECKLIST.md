# Pricing Change Checklist

When you change any pricing (amount, tier name, included minutes, features, coupons), you MUST update it in ALL 3 places listed below. Pricing drift causes customer trust issues — they see one price on marketing and pay another at checkout.

## The 3 Places

| # | System | What lives here |
|---|---|---|
| 1 | **Stripe Dashboard** | Actual prices, products, coupons, subscriptions (billing truth) |
| 2 | **Voice Platform** (`voice_platform_retell`) | `plans` DB table with Stripe price IDs, admin dashboard |
| 3 | **Marketing Site** (`jotil_labs_website`) | `data/products.js` public display prices |

## Change Process

### Example: Raising Core from $100 to $125

1. **Stripe Dashboard**
   - Product: `JotilReceptionist Core`
   - Create a NEW Price for $125 (never edit existing prices — Stripe doesn't allow it, and existing customers stay on old price)
   - Copy the new price ID (`price_1XXX...`)
   - Archive the old price (optional — stop new customers using it, but grandfather existing)

2. **Voice Platform** (`voice_platform_retell`)
   - Update the `plans` table row for that plan:
     - `stripe_price_id` = new price ID
     - `price_cents` = 12500
   - Commit + push → Railway auto-deploys
   - Admin dashboard now generates checkout links with the new price

3. **Marketing Site** (`jotil_labs_website`)
   - Edit `data/products.js` → receptionist → `pricing.tiers[0].price` → `'$125'`
   - Update any other affected copy (hero text, comparisons, etc.)
   - Commit + push → Vercel auto-deploys
   - Public pricing page now matches Stripe

### Example: Adding a New Coupon

1. **Stripe Dashboard**
   - Products → Coupons → Create coupon (e.g., `LAUNCH50`, 50% off first month)
   - That's it. Stripe handles the rest.
   - Coupon is available to any product's checkout session that passes the code

2. **Voice Platform** — no change needed. The admin checkout link form already accepts a coupon code.

3. **Marketing Site** — only if you want to advertise the coupon publicly.

### Example: Changing Tier Features (no price change)

1. **Stripe Dashboard** — no change needed (Stripe doesn't store feature lists).

2. **Voice Platform** — no change needed (plan features aren't user-facing).

3. **Marketing Site** — update `data/products.js` → the tier's `features` array.

## Why Three Places

- Stripe is the billing truth — what the customer pays
- Voice Platform needs price IDs to generate checkout links
- Marketing Site needs display strings (formatted with $, `/mo`, etc.)

The marketing site and voice platform both reference Stripe but serve different needs. Stripe can't directly power the marketing site's feature lists or descriptions.

## Future: Stripe as Single Source of Truth

When we hit 20+ customers or 3+ products, upgrade to "Stripe as source of truth":
- Marketing site fetches prices from Stripe API at build time
- Voice platform already reads Stripe at runtime
- Only 1 place to edit: Stripe Dashboard

This is a ~30-line build-time fetch script. Not worth the complexity until we scale.

## Current State (2026-04-10)

| Tier | Stripe ID | Price | Minutes |
|---|---|---|---|
| Core | `price_1TGSGwRu8AuEozfBycmBqJsD` | $100/mo | 200 |
| Pro | `price_1TGSHPRu8AuEozfBGDnZmjkI` | $225/mo | 500 |
| Business | `price_1TGSHQRu8AuEozfBZqX3NF4a` | $320/mo | 1000 |

Overage rate: $1.50/min (applied in voice platform, not Stripe).

## Related Files

- Marketing: `data/products.js`
- Voice platform: `backend/app/modules/billing/plan_models.py` and `backend/alembic/versions/` (for `plans` table schema)
- Voice platform checkout: `backend/app/services/stripe_service.py`

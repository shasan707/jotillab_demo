# Product demos + scroll experience - design spec

**Date:** 2026-04-19
**Status:** Draft - awaiting user approval, then handoff to writing-plans skill
**Scope:** Redesign the "Live Preview" / demo section on every product page, plus the homepage product-router section. Replace scripted mockups with (a) real live demos where possible, (b) premium dashboard screenshots + scripted animations where live is not feasible.
**Out of scope:** New pricing page features, new blog templates, new industry pages, dark mode, new CMS.

## Resume context (for future sessions)

If picking this up after a break, here is exactly where we are:

- **Rebrand (JotilLabs palette + typography) shipped to `main`** via PR #29, merged.
- **PR #34 (brand drift cleanup), #36 (product taglines), #38 (no gradient on product names)** are open, ready to squash-merge.
- **6 GH issues filed for this demo initiative:** #39 Receptionist, #40 Messenger, #41 Outreach, #42 Space, #43 Flow, #44 Avatar. Each issue already has Tier 1 / Tier 2 / Tier 3 scope and Retell/HeyGen context noted in comments.
- **This spec** (`docs/plans/2026-04-19-product-demos-design.md`) is the authoritative plan that ties all 6 issues together plus the homepage router.
- **Existing infra:** Retell handles voice + chat (live demo-ready for Receptionist and Messenger). HeyGen handles Avatar (live demo-ready for Avatar). Outreach, Space, Flow need net-new work.
- **What comes next after approval:** invoke `superpowers:writing-plans` skill to produce a step-by-step implementation plan for Tier 1 (all 6 products' visual cleanup). Subsequent tiers get their own plans.
- **Branch strategy:** one PR per tier per product area (so Tier 1 = one PR covering all 6 products' visual cleanup; Tier 2 = one PR per product since infra diverges).

## 1. Context

All 6 product pages currently show a scripted auto-cycling mockup in `components/product/DemoVisualization.jsx`, labeled "Live Preview." None are live. Visitors have no way to experience the product before booking a demo. For contact-based sales (JotilLabs' model), this is the biggest conversion leak.

Existing infra that changes the math:
- **Retell** already set up with a phone number that can voice-call and chat.
- **HeyGen** already set up for Avatar.
- **6 product pages** under `app/products/[slug]/page.jsx`.
- **Homepage** hero + ProductShowcase grid already exists.

## 2. Goals

1. Every product page should let a cold visitor experience the product (or the closest proxy) without signup.
2. Reduce first-demo-attempt anxiety so visitors actually click the live-try CTA.
3. Provide a coherent, on-brand scroll experience on Space and Flow pages where live try is not feasible.
4. Route homepage visitors to the right product page quickly.
5. Keep bounce rate flat or better after the redesign; lift demo-book rate.

## 3. Non-goals

- Building a self-serve signup path (contact-based sales stays).
- Apple-style ambient scroll theater on every page. Our audience does not have the brand familiarity to make that work.
- Rich video production for every product (start with one short tour clip only where needed).

## 4. Strategy - bifurcated by product type

| Product | Demo mode | Primary proof |
|---|---|---|
| JotilReceptionist | **Live**: Retell phone number, tap-to-call, QR code | Real AI voice |
| JotilMessenger | **Live**: embedded Retell chat widget on page, phone number for SMS path | Real AI text |
| JotilAvatar | **Live**: embedded HeyGen interactive session | Real AI video |
| JotilOutreach | **Live-ish**: phone-entry widget, AI calls/texts the visitor back | Real outbound call/SMS |
| JotilSpace | **Mockup + scripted animation**: real UI screenshots + scroll-pinned scene transitions | Dashboard screenshots, named customer stats |
| JotilFlow | **Mockup + scripted animation**: workflow builder animated frame-by-frame | Builder animation, named customer stats |

## 5. Psychology principles baked in

These apply across every product page:

1. **Loss aversion** in hero copy ("Stop losing customers...") - already in place, keep.
2. **Automation anxiety relief** - every live demo includes "takes 60s, nothing stored" microcopy next to the CTA.
3. **Effort justification** - the page is structured so that visitors who click "try it" invest enough attention that the "book a demo" CTA lower on the page converts at a higher rate.
4. **Control illusion** - surface human-in-the-loop features (transcripts, overrides, manual routing) on product pages, especially Receptionist and Messenger.
5. **Peak-end rule** - design for the peak moment (first AI response visible/audible) and the end moment (CTA clarity). Middle can be quieter.
6. **Reactance** - no popups, no gated forms to see the demo, no email-before-chat.
7. **First-attempt anxiety** - sample transcript preview shown above or beside the call/chat CTA so visitors know what to expect.
8. **Choice overload on homepage** - homepage becomes a product-router, not a product-catalog.

## 6. Visitor journey (5 phases) and where each need is answered

| Phase | Visitor question | Answered by |
|---|---|---|
| Landing 0-3s | "Is this for me?" | Hero headline + hero visual + industry pills |
| Scanning 3-15s | "What does it do?" | Subheadline + ONE outcome stat + primary CTA |
| Interest 15-60s | "Does it actually work?" | Live demo (Receptionist/Messenger/Outreach/Avatar) or scripted animation (Space/Flow) |
| Evaluation 60+s | "Can I trust / afford?" | Named customer testimonials, compliance badges, pricing |
| Action | "How do I start?" | Secondary CTA - book a demo, friction-reduced form |

## 7. Per-product plan

### 7.1 JotilReceptionist

- **Hero section:** headline + outcome stat ("80% fewer missed calls") + primary CTA "Call the live AI: +1-xxx-xxx-xxxx" with tap-to-call link + QR code on the right for mobile users.
- **Anxiety-reducer microcopy:** "Takes 60 seconds, no signup, nothing stored."
- **Sample transcript preview:** collapsed-by-default, one tap to expand, shows a real-looking past call.
- **Live demo block:** "Call from your browser" WebRTC button (Retell browser SDK if available) as an alternative to the phone number.
- **Scroll section - industry filter:** pill tabs for dental, real-estate, legal, hospitality - each swaps the hero stat and sample transcript.
- **Proof:** named customer testimonial + "Works with Twilio, HubSpot, Salesforce, Google Calendar" logo strip.
- **Secondary CTA:** book a branded demo.

### 7.2 JotilMessenger

- **Hero section:** headline + outcome stat ("Under 2s response time") + primary CTA "Chat with it now" which opens the inline chat widget.
- **Inline chat widget:** embedded on the page (not a corner popup), reusing the Retell chat integration. Pre-trained on JotilLabs demo FAQ.
- **Channel tabs above widget:** Web (live), SMS (shows Retell number + "Text JOTIL to start"), WhatsApp (link), Teams ("Install for Teams" CTA).
- **Anxiety-reducer:** "No signup, try anything. Your conversation is not stored."
- **Scroll section - industry filter:** same pattern as Receptionist.
- **Proof + secondary CTA:** as above.

### 7.3 JotilOutreach

- **Hero section:** headline + outcome stat + primary CTA is a phone-entry widget ("Hear the AI reach out to you - enter your number").
- **Phone-entry widget behavior:** visitor enters number, short OTP verification. Visitor then chooses: "Call me" (single outbound AI call from a scripted campaign, ~30 seconds) OR "Text me" (2-3 message SMS campaign, demonstrating follow-up cadence). Rate-limited per number (1 demo per 24h) and per IP (3 per 24h).
- **Below widget:** dashboard mockup showing the visitor's demo call / SMS status live (not fake data).
- **Scroll section:** campaign builder scripted animation - "pick your audience, draft with AI, launch in minutes."
- **Proof + secondary CTA:** as above.

### 7.4 JotilSpace

- **Hero section:** headline + outcome stat + hero screenshot of the actual Space workspace (real UI, seeded realistic data, annotated with one caption like "Monday morning in one view"). Primary CTA: "Book a guided walkthrough."
- **Scroll section 1 - "How it works":** scroll-pinned scene with 4 screenshots that transition as visitor scrolls. Each scene has a one-line caption:
  1. CRM pipeline view
  2. Tickets with AI auto-response
  3. Calendar with AI booking
  4. AI Agents tab with multi-model selector (live swap between GPT-4, Claude, Gemini)
- **Scroll section 2 - "For your industry":** industry pills swap the dashboard screenshot to a version with industry-specific seeded data (dental intake vs real-estate leads).
- **Anxiety-reducer / proof:** named customer stats directly under the scroll section. Example (verify real numbers before ship): "Meridian Health: 80% fewer missed calls, 12 hours/week saved." If real testimonials not available yet, use neutral capability stats ("24/7 uptime, sub-2s response, 150+ integrations") instead of fake customer quotes.
- **Secondary CTA:** "See it with your data" - book walkthrough.

### 7.5 JotilFlow

- **Hero section:** headline + outcome stat + hero screenshot of the Flow builder with a 3-block example (Trigger → AI step → Action). Primary CTA: "Watch it run" - triggers an in-place animated run, or book walkthrough.
- **Scroll section 1 - "Build it":** scroll-pinned animation of blocks snapping onto the canvas as visitor scrolls. Frame-by-frame: empty canvas, drag trigger, drag AI step, drag output, click Run, see result.
- **Scroll section 2 - "Library":** static screenshots of the block library categorized by trigger type / AI type / output type.
- **Proof + secondary CTA:** named customer use cases, book walkthrough.

### 7.6 JotilAvatar

- **Hero section:** headline + outcome stat + embedded HeyGen interactive avatar widget. Primary CTA is the widget itself ("Start a 60-second avatar session").
- **Rate-limit microcopy:** "1 session per day per visitor, up to 60 seconds."
- **Fallback if widget unavailable:** pre-recorded 20-second autoplay-muted avatar loop with "Book a live avatar session" CTA.
- **Scroll section - use cases:** short vignettes showing the avatar in different contexts (website greeter, video-call assistant, kiosk mode).
- **Proof + secondary CTA:** as above.

## 8. Homepage - product router

Homepage replaces the current ProductShowcase grid with a smarter router:

- **Hero unchanged** (works well).
- **Section A - "Which one is for you?"**: two entry points surfaced side-by-side:
  - **By industry**: 8 industry pill buttons (dental, real-estate, legal, restaurant, etc.) - each routes to a product with industry-specific landing context.
  - **By pain point**: 4-6 pain pills ("Missed calls," "Slow SMS response," "No-shows," "Manual data entry," "Email overload," "No face-to-face option") - each routes to the most relevant product.
- **Section B - 6-product overview scroll**: horizontal-scroll or scroll-pinned-stack (decision made at implementation time based on perf budget) with one card per product. Each card: product screenshot or live demo teaser, 1-sentence outcome, "Try it" button linking to that product page's live-demo anchor (e.g. `/products/receptionist#live-demo`). "Light" means: no video assets, no parallax, CSS-only transforms, under 200ms per scroll frame.
- **Section C - Proof bar**: logo cloud + 3 named testimonials (keep existing).
- **Section D - CTA**: book a demo with specific AI agents already selected from the visitor's pill choice if they made one.

## 9. Shared components to build

- `<LiveDemoHero>` - hero variant for live-demo products (Receptionist, Messenger, Outreach, Avatar). Props: headline, stat, primary CTA shape (phone-number / chat / phone-entry / avatar-embed), anxiety microcopy.
- `<ScriptedDemoHero>` - hero variant for mockup products (Space, Flow). Props: headline, stat, hero screenshot, primary CTA.
- `<ScrollScene>` - scroll-pinned scene wrapper. Takes an array of frames, each frame has {screenshot, caption}.
- `<IndustryPills>` - pill selector that swaps downstream content (stat, screenshot, transcript).
- `<SampleTranscript>` - collapsible transcript preview for Receptionist / Messenger anxiety-reducer.
- `<PhoneCTA>` - primary CTA with phone number, tap-to-call, QR code, anxiety microcopy.
- `<ChatEmbed>` - wrapped Retell chat widget scoped to the page.
- `<PhoneEntryDemo>` - phone-entry + OTP + outbound-call trigger for Outreach.
- `<AvatarEmbed>` - wrapped HeyGen interactive session widget.

All shared components live in `components/product/demos/` (new directory).

## 10. Tiered rollout

### Tier 1 - visual cleanup, no infra (PR 1)
- Rename section heading "Live Preview" -> "See it in action" on every product page (honest label).
- Wrap each existing canvas in appropriate device chrome (phone for Receptionist/Messenger, browser/laptop for the rest).
- Apply brand gradient backdrop to each demo section.
- Remove "Product demo coming soon" fallback.
- Add placeholder CTA blocks for each product noting what Tier 2 will add ("Live call coming next week" etc.).

Goal: visual consistency in a day. No new infra.

### Tier 2 - live demos where feasible (PR 2 per product)
- Receptionist: wire Retell number, QR code, optional browser WebRTC.
- Messenger: embed Retell chat widget, wire SMS channel tab.
- Avatar: embed HeyGen interactive session.
- Outreach: build phone-entry + OTP + outbound test demo. (Biggest infra of this tier.)

### Tier 3 - premium scripted animation (PR 3 per product)
- Space: hero screenshot, 4-frame scroll-pinned animation, industry-swap.
- Flow: hero screenshot, builder animation, library grid.

### Tier 4 - homepage router (PR 4)
- Replace ProductShowcase grid with router section (industry pills + pain pills).
- Scroll overview linking to product-page demo anchors.

## 11. Success criteria + analytics

### Functional acceptance
- Every product page has either a live try or a high-fidelity scripted animation. Zero scripted mockups labeled "Live Preview."
- Homepage routes visitors to a narrower product choice before deep engagement.
- Live-demo CTAs are tap-to-call / click-to-chat / click-to-start, never "fill out a form first."
- Playwright visual regression snapshots pass for every product page after each tier.

### Measurement plan (events to wire)
Add these custom events (via existing Vercel Analytics):

- `demo_cta_view` - fires when the primary demo CTA is in viewport (per product slug)
- `demo_cta_click` - fires on tap-to-call, click-to-chat, phone-entry submit, avatar start
- `demo_session_start` - fires when a live demo actually begins (call connected, chat message sent, avatar loaded)
- `demo_session_end` - fires with duration and outcome (completed/abandoned)
- `industry_pill_click` - fires on industry filter change
- `book_demo_click` - existing contact form, segmented by whether the session had `demo_session_start`

### Numerical targets (first 30 days post-launch)
- Bounce rate: no regression beyond 5% relative increase.
- `demo_cta_click` / `demo_cta_view` ratio: >=8% per product (baseline TBD from current page-engagement data).
- `book_demo_click` lift attributed to sessions with `demo_session_start`: >=3x the non-engaged session rate.
- Mobile tap-to-call rate on Receptionist page: >=12% of mobile visitors.

If any target misses at day 30, trigger a retro and prioritized fix list before moving to the next tier.

## 12. Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Live Retell demo cost spikes from abuse | Medium | Medium | Per-IP rate limit, daily $ cap, CAPTCHA on phone-entry demo |
| Retell chat widget brand-mismatches the site | Medium | Low | Theme widget via Retell config; otherwise build a thin proxy UI |
| HeyGen session unstable or slow | Medium | Medium | Fallback to recorded 20s loop if widget fails to init in 3s |
| Scroll-pinned animation janky on mid-range Android | High | Medium | Fall back to static screenshots below md breakpoint |
| Space/Flow screenshots fall out of sync with real product | Low | Medium | Generate screenshots from a maintained seed tenant; refresh quarterly |
| Phone-entry demo abused to spam third parties | Medium | High | Only call/SMS the number entered after OTP verification; hard daily cap |

## 13. Open questions (resolve before Tier 2 implementation)

1. Does Retell expose a browser WebRTC SDK we can drop into the Receptionist page (or is it dial-only)? Confirm before Tier 2 Receptionist.
2. Does Retell chat support WhatsApp / Teams channels, or are those separate integrations?
3. Is HeyGen interactive widget embeddable via iframe on our domain, or does it require a custom route?
4. Do Space/Flow have existing high-resolution seeded dashboard screenshots the team can provide, or do we generate fresh ones?
5. Which demo phone number gets primary placement on the homepage CTA if we add one? Receptionist's (voice) is the natural default.
6. What is the monthly $ budget ceiling for live-demo Retell usage? Determines rate-limit thresholds.
7. Are the customer testimonial numbers in existing copy (Meridian Health, Apex Realty, Summit Finance) real or placeholder? If placeholder, replace with capability stats before ship.

## 14. Implementation order (tier-by-tier)

Strict sequencing to avoid blocking on open questions:

**Phase 1 (no open questions needed):** Tier 1 for all 6 products. Visual cleanup PR. 1-2 days.

**Phase 2 (answers open questions #1, #2 needed):** Tier 2 Receptionist + Tier 2 Messenger (parallel if infra scoped cleanly). 2-4 days each.

**Phase 3 (answers open question #3 needed):** Tier 2 Avatar. 1-2 days assuming HeyGen iframe works.

**Phase 4 (answers open questions #6 needed for abuse caps):** Tier 2 Outreach. 3-5 days - most complex infra.

**Phase 5 (answers open question #4 needed):** Tier 3 Space + Flow (parallel). 3-5 days each.

**Phase 6:** Tier 4 Homepage router. 2-3 days.

Phases 1, 2, 3, 4 each produce their own PR linked to the matching issue (#39-#44). Phase 5 uses #42 and #43. Phase 6 is a new issue (create after approval).

## 15. Related GitHub issues

- #39 JotilReceptionist demo upgrade
- #40 JotilMessenger demo upgrade
- #41 JotilOutreach demo upgrade
- #42 JotilSpace demo upgrade
- #43 JotilFlow demo upgrade
- #44 JotilAvatar demo upgrade
- (to be filed) JotilLabs homepage product-router redesign

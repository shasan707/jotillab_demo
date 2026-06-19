# Scroll Product Showcase - Design Spec

**Date:** 2026-04-25
**Replaces:** `components/sections/ProductShowcase.jsx` (6-card grid)
**Branch:** `feat/scroll-product-showcase`

---

## Overview

Replace the homepage ProductShowcase section with a scroll-locked, Apple-style product showcase. Each product gets a full-viewport pinned section with a device mockup and animated screen content. Products transition via panel-split animations (text exits left, device exits right, next product enters). A compact "Custom Solutions" card for Flow appears after the scroll sections.

## Decisions Log

| Decision | Choice | Reason |
|---|---|---|
| Products in scroll showcase | 5 (Receptionist, Messenger, Outreach, Space, Avatar) | All productized. Flow is bespoke-only. |
| Products in compact card | 1 (Flow) | Only true bespoke service (contact-only, project-based) |
| Animation architecture | Single GSAP timeline with ScrollTrigger pin+scrub+snap | Industry standard for this pattern. Already installed. |
| Split transition style | Content splits horizontally (text left, device right) | Reinforces the grid structure, matches user's reference site |
| Phone content animation | Hybrid: scroll controls structural transitions, time-based auto-play for screen content | Best of both worlds. Chat bubbles need consistent timing, not scroll-speed dependency. |
| Device types | Phone (Receptionist, Messenger, Outreach), Laptop (Space), Monitor/Screen (Avatar) | Matches product nature. Device switch at split transition feels intentional. |
| Color palette | Brand blue (#3859a8 / #3B82F6) throughout. No off-brand colors. | All products use brand blue in products.js iconColor |
| Animation mode flexibility | Build Hybrid (C), keep code structured to allow switch to full-scrub (A) or trigger-once (B) later | User wants to compare modes after initial build |

## Architecture

### Component Structure

```
ScrollProductShowcase.jsx (main - mounts in page.jsx)
  useGSAP hook -> single master timeline + ScrollTrigger
  
  showcase/ProductSlide.jsx (shared layout per product)
    SlideText (badge, heading, description, features, CTA)
    SlideDevice (wrapper that picks device type)
  
  showcase/devices/PhoneMockup.jsx (shell + notch + screen container)
  showcase/devices/LaptopMockup.jsx (browser chrome + screen container)
  showcase/devices/MonitorMockup.jsx (monitor frame + screen container)
  
  showcase/screens/ReceptionistScreen.jsx
  showcase/screens/MessengerScreen.jsx
  showcase/screens/OutreachScreen.jsx
  showcase/screens/SpaceScreen.jsx
  showcase/screens/AvatarScreen.jsx
  
  showcase/FlowCard.jsx (compact custom solutions block)
```

### Animation Timeline Structure

One master GSAP timeline attached to a single ScrollTrigger with `pin: true`, `scrub: 1`, and `snap`.

Each product occupies a segment of the timeline with three phases:

```
Product N:  [ENTER 20%] [HOLD 40%] [EXIT 20%]
Gap:        [TRANSITION 20%]
Product N+1: [ENTER 20%] ...
```

- **ENTER:** Text slides in from left (x: -80 to 0, opacity 0 to 1). Device slides in from right (x: 80 to 0, scale 0.95 to 1). Text leads device by ~5%.
- **HOLD:** Content static. Auto-play animations trigger via timeline callback (`onEnter` label). Framer Motion handles the time-based screen content.
- **EXIT:** Text slides out left (x: 0 to -120). Device slides out right (x: 0 to 120). Simultaneous.
- **TRANSITION:** Gap between exit and next enter. Creates the split-apart-reveal feel.

**Snap points** land on each product's HOLD phase center.

**Total scroll distance:** 5 products, ~1500px per product = `end: "+=7500"`.

### Lenis Integration

Already wired in `layout.jsx` via `SmoothScroll` component. Lenis syncs with GSAP ticker (`lenis.on('scroll', ScrollTrigger.update)`). No additional setup needed. The pinned container works natively with Lenis.

## Screen Content Per Product

All screens use brand blue (#3859a8) as primary accent. JotilLabs branding visible in every screen.

### Receptionist (Phone)

- Phone vibration animation on ENTER (CSS shake + pulsing glow ring around device)
- Incoming call notification banner: caller name + "JotilLabs AI Answering"
- Call screen header: brand blue gradient (#3859a8 to #2a4688)
- JotilLabs "J" avatar as the AI agent identity
- Status: "JotilLabs AI is handling this call"
- Waveform bars in brand blue (CSS keyframes, always animating)
- Live transcript auto-types during HOLD: AI lines with JotilLabs icon, caller lines with person icon
- 4 transcript lines appear sequentially

### Messenger (Phone)

- Channel tabs across top: **Web | SMS | WhatsApp | Teams** with channel icons
- Header: "JotilLabs AI" with J avatar, "Online now" status
- During HOLD auto-play:
  1. Web chat conversation plays (3-4 messages)
  2. WhatsApp notification slides in from top mid-conversation
  3. SMS badge counter increments on the tab
- Shows "every channel, one AI" without multiple mockups
- Chat bubbles: brand blue (user), light grey (AI with J avatar)
- Typing indicator between AI responses

### Outreach (Phone)

- Campaign header: "Campaign: Spring Launch" with pulsing live dot
- Three stat cards with counting animation (0 to 247 Contacted, 0% to 68% Reached, 0 to 34 Booked)
- Activity feed shows multi-channel sequencing per lead:
  - "AI call completed - Mike Torres"
  - "AI SMS sent - Lisa Park"
  - "AI email delivered - David Chen"
  - "AI voicemail left - Ana Rivera"
- Feed items slide in from left, color-coded by channel but using brand-adjacent tones (not random colors)
- Optional: mini funnel graphic (247 -> 168 -> 34)

### Space (Laptop)

- Browser chrome: three dots + "app.jotillabs.com" address bar
- Left sidebar: nav icons (conversations, contacts, analytics, models, settings)
- Main area: **AI Model Playground**
  - Two model cards side by side ("Receptionist v2.1" vs "Receptionist v2.3")
  - Each card: response quality score, avg handle time, satisfaction rating
  - "Compare" toggle highlighted
  - Sample conversation snippet showing different responses between models
- Content fades in progressively: sidebar, then model cards, then metrics

### Avatar (Monitor/Screen)

- Monitor frame showing a business website landing page
- Bottom-right: video avatar widget pops up (like a chat widget, but with a face)
- Avatar: stylized gradient silhouette (not a real photo)
- Speech bubble: "Hi! Welcome. I'm here to help you find the right plan."
- Subtle idle animation (gentle breathing scale pulse via CSS)
- JotilLabs branding on widget frame
- Visitor response options appear: "Tell me about pricing" / "I need a demo"

### Flow (Compact Card - Not Scroll-Locked)

- Appears after the scroll showcase, before HowItWorks
- Single card, centered
- Heading: "Need something custom?"
- Description: bespoke workflow automation, agent development, custom integrations
- "Talk to our team" CTA in brand blue
- Subtle animated icon (connected nodes / flow diagram)
- No device mockup

## Integration Points

- **page.jsx:** `<ScrollProductShowcase />` replaces `<ProductShowcase />`
- **layout.jsx:** No changes. SmoothScroll + BrandBackground already wrap everything.
- **globals.css:** May need keyframe additions (phone vibrate, wave, typing dots)
- **ProductShowcase.jsx:** Kept in repo but no longer imported by homepage. Other pages may still reference it.

## Performance Considerations

- GSAP ScrollTrigger pre-calculates positions. Don't animate the pinned element itself, only children.
- Device mockups are pure CSS/HTML (no images to load).
- Screen content uses CSS animations where possible, Framer Motion only for sequenced auto-play.
- `will-change: transform` on animated slide containers only during active animation.
- Respect `prefers-reduced-motion`: skip pin/scrub, show all products stacked with simple fade-in.

## Accessibility

- Pinned section uses `aria-label="Product showcase"` with `role="region"`
- Each product slide has proper heading hierarchy (h2)
- Screen content in device mockups is decorative (`aria-hidden="true"`)
- Snap points ensure users always land on readable content
- Reduced motion: disable pin, show products in normal document flow with AnimatedSection fade-in

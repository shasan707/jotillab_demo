# Scroll Product Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage ProductShowcase grid with a scroll-locked, GSAP-powered product showcase featuring device mockups, split-panel transitions, and auto-playing screen content.

**Architecture:** Single GSAP timeline with ScrollTrigger (pin + scrub + snap) controlling 5 product slides. Each slide has a text panel and device mockup. Structural transitions (enter/hold/exit/split) are scroll-scrubbed. Screen content auto-plays via Framer Motion during the HOLD phase. Lenis smooth scroll is already integrated.

**Tech Stack:** GSAP 3.15 + ScrollTrigger + @gsap/react (useGSAP), Framer Motion 12, Lenis 1.3, React 19, Next.js 15 App Router, Tailwind CSS v4

**Spec:** `docs/superpowers/specs/2026-04-25-scroll-product-showcase-design.md`

---

## File Structure

### Create

```
components/sections/ScrollProductShowcase.jsx    -- Main component, GSAP timeline, pin/scrub
components/sections/showcase/ProductSlide.jsx    -- Shared slide layout (text + device)
components/sections/showcase/SlideText.jsx       -- Badge, heading, description, features, CTA
components/sections/showcase/SlideDevice.jsx     -- Device picker (phone/laptop/monitor)
components/sections/showcase/devices/PhoneMockup.jsx
components/sections/showcase/devices/LaptopMockup.jsx
components/sections/showcase/devices/MonitorMockup.jsx
components/sections/showcase/screens/ReceptionistScreen.jsx
components/sections/showcase/screens/MessengerScreen.jsx
components/sections/showcase/screens/OutreachScreen.jsx
components/sections/showcase/screens/SpaceScreen.jsx
components/sections/showcase/screens/AvatarScreen.jsx
components/sections/showcase/FlowCard.jsx
components/sections/showcase/data.js             -- Product slide data (text, features, device type)
```

### Modify

```
app/page.jsx                -- Swap ProductShowcase -> ScrollProductShowcase
app/globals.css             -- Add keyframes: phone-vibrate, wave, typing-dot
```

### Keep (no changes)

```
components/sections/ProductShowcase.jsx          -- Kept for potential use on other pages
components/design/SmoothScroll.jsx               -- Already wired in layout.jsx
components/design/SectionReveal.jsx              -- Reference for useGSAP patterns
```

---

## Task 1: Scaffold and Data Layer

**Files:**
- Create: `components/sections/showcase/data.js`
- Create: `components/sections/ScrollProductShowcase.jsx` (skeleton)
- Modify: `app/page.jsx`

- [ ] **Step 1: Create slide data**

```js
// components/sections/showcase/data.js
import { Phone, MessageCircle, TrendingUp, LayoutGrid, UserCircle } from 'lucide-react'

export const PRODUCT_SLIDES = [
  {
    slug: 'receptionist',
    icon: Phone,
    badge: 'JotilReceptionist',
    title: 'Every call answered. Every lead captured.',
    desc: 'Your AI receptionist picks up instantly, qualifies the caller, books appointments, and routes urgent calls to your team. No hold music. No missed opportunities.',
    features: [
      'Answers in under 1 second, 24/7',
      'Qualifies leads with custom questions',
      'Books directly into your calendar',
    ],
    deviceType: 'phone',
  },
  {
    slug: 'messenger',
    icon: MessageCircle,
    badge: 'JotilMessenger',
    title: 'Instant replies on every channel. Always.',
    desc: 'Text, web chat, WhatsApp, or Teams. Your AI responds in seconds, handles FAQs, collects information, and hands off complex conversations to your team with full context.',
    features: [
      'Responds in under 3 seconds',
      'Works across SMS, web, WhatsApp, Teams',
      'Smart handoff with full conversation context',
    ],
    deviceType: 'phone',
  },
  {
    slug: 'outreach',
    icon: TrendingUp,
    badge: 'JotilOutreach',
    title: 'Reach every lead before your competitors do.',
    desc: 'Automated multi-channel campaigns that call, text, and email your leads within minutes. AI handles the conversation, qualifies interest, and books meetings while your team sleeps.',
    features: [
      'Voice + SMS + email in one sequence',
      'Contacts leads within 60 seconds',
      '3x more meetings booked on average',
    ],
    deviceType: 'phone',
  },
  {
    slug: 'space',
    icon: LayoutGrid,
    badge: 'JotilSpace',
    title: 'Your AI command center.',
    desc: 'One workspace where every conversation, every lead, and every AI model lives. Compare models, track performance, and optimize your AI across all channels.',
    features: [
      'Side-by-side AI model comparison',
      'Real-time conversation analytics',
      'Unified inbox across all channels',
    ],
    deviceType: 'laptop',
  },
  {
    slug: 'avatar',
    icon: UserCircle,
    badge: 'JotilAvatar',
    title: 'Meet your customers face to face.',
    desc: 'A lifelike digital assistant that greets visitors on your website with real conversation, real expressions, and real personality. Your always-on brand ambassador.',
    features: [
      'Lifelike video presence on your website',
      'Natural conversation with real expressions',
      'Guided selling and onboarding',
    ],
    deviceType: 'monitor',
  },
]
```

- [ ] **Step 2: Create skeleton ScrollProductShowcase**

```jsx
// components/sections/ScrollProductShowcase.jsx
'use client'

import { useRef } from 'react'

export function ScrollProductShowcase() {
  const containerRef = useRef(null)

  return (
    <section ref={containerRef} aria-label="Product showcase" role="region">
      <div className="relative">
        {/* Products render here -- Task 2 */}
        <div className="h-screen flex items-center justify-center text-text-muted">
          Scroll showcase placeholder
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Wire into page.jsx**

In `app/page.jsx`, change the import:

```jsx
// Replace this line:
import { ProductShowcase } from '@/components/sections/ProductShowcase'
// With:
import { ScrollProductShowcase } from '@/components/sections/ScrollProductShowcase'
```

And in the JSX:

```jsx
// Replace:
<ProductShowcase />
// With:
<ScrollProductShowcase />
```

- [ ] **Step 4: Verify dev server loads without errors**

Run: `npm run dev`
Expected: Homepage loads, placeholder text visible where ProductShowcase was.

- [ ] **Step 5: Commit**

```bash
git add components/sections/ScrollProductShowcase.jsx components/sections/showcase/data.js app/page.jsx
git commit -m "feat(showcase): scaffold scroll product showcase with data layer"
```

---

## Task 2: Device Mockup Shells

**Files:**
- Create: `components/sections/showcase/devices/PhoneMockup.jsx`
- Create: `components/sections/showcase/devices/LaptopMockup.jsx`
- Create: `components/sections/showcase/devices/MonitorMockup.jsx`
- Create: `components/sections/showcase/SlideDevice.jsx`

- [ ] **Step 1: Create PhoneMockup**

Pure CSS phone frame. Accepts `children` for screen content. Includes notch, rounded corners, shadow, optional vibrate class.

```jsx
// components/sections/showcase/devices/PhoneMockup.jsx
export function PhoneMockup({ children, vibrate = false }) {
  return (
    <div style={{ perspective: 1200 }}>
      <div
        className={`w-[280px] h-[580px] rounded-[40px] p-3 relative ${vibrate ? 'animate-phone-vibrate' : ''}`}
        style={{
          background: '#0a0a0a',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.1), 0 25px 60px rgba(15,17,41,0.25), 0 8px 20px rgba(15,17,41,0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 w-[120px] h-7 rounded-b-2xl z-10"
          style={{ background: '#0a0a0a' }}
        />
        <div className="w-full h-full rounded-[30px] overflow-hidden bg-white relative">
          {children}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create LaptopMockup**

Browser chrome frame with address bar. Wider aspect ratio.

```jsx
// components/sections/showcase/devices/LaptopMockup.jsx
export function LaptopMockup({ children }) {
  return (
    <div
      className="w-[480px] rounded-xl overflow-hidden"
      style={{
        boxShadow: '0 25px 60px rgba(15,17,41,0.2), 0 8px 20px rgba(15,17,41,0.12)',
        border: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#f6f6f6] border-b border-black/5">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 mx-8">
          <div className="bg-white rounded-md px-3 py-1 text-[11px] text-gray-400 text-center border border-black/5">
            app.jotillabs.com
          </div>
        </div>
      </div>
      <div className="bg-white aspect-[16/10] overflow-hidden relative">
        {children}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create MonitorMockup**

Minimal monitor frame for Avatar.

```jsx
// components/sections/showcase/devices/MonitorMockup.jsx
export function MonitorMockup({ children }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-[460px] rounded-xl overflow-hidden"
        style={{
          boxShadow: '0 25px 60px rgba(15,17,41,0.2), 0 8px 20px rgba(15,17,41,0.12)',
          border: '2px solid #1a1a1a',
        }}
      >
        <div className="bg-white aspect-[16/10] overflow-hidden relative">
          {children}
        </div>
      </div>
      <div className="w-20 h-6 bg-[#2a2a2a] rounded-b-lg" />
      <div className="w-32 h-1.5 bg-[#3a3a3a] rounded-b-md" />
    </div>
  )
}
```

- [ ] **Step 4: Create SlideDevice picker**

```jsx
// components/sections/showcase/SlideDevice.jsx
import { PhoneMockup } from './devices/PhoneMockup'
import { LaptopMockup } from './devices/LaptopMockup'
import { MonitorMockup } from './devices/MonitorMockup'
import { ReceptionistScreen } from './screens/ReceptionistScreen'
import { MessengerScreen } from './screens/MessengerScreen'
import { OutreachScreen } from './screens/OutreachScreen'
import { SpaceScreen } from './screens/SpaceScreen'
import { AvatarScreen } from './screens/AvatarScreen'

const SCREENS = {
  receptionist: ReceptionistScreen,
  messenger: MessengerScreen,
  outreach: OutreachScreen,
  space: SpaceScreen,
  avatar: AvatarScreen,
}

const DEVICES = {
  phone: PhoneMockup,
  laptop: LaptopMockup,
  monitor: MonitorMockup,
}

export function SlideDevice({ slug, deviceType, isActive }) {
  const Device = DEVICES[deviceType]
  const Screen = SCREENS[slug]
  const vibrate = deviceType === 'phone' && slug === 'receptionist'

  return (
    <div className="flex justify-center items-center">
      <Device vibrate={vibrate && isActive}>
        <Screen isActive={isActive} />
      </Device>
    </div>
  )
}
```

- [ ] **Step 5: Create placeholder screens** (one for each product, just a colored box with product name -- real content in Tasks 5-9)

Create 5 files in `components/sections/showcase/screens/`:

```jsx
// Each screen file follows this pattern:
// ReceptionistScreen.jsx, MessengerScreen.jsx, OutreachScreen.jsx, SpaceScreen.jsx, AvatarScreen.jsx
export function ReceptionistScreen({ isActive }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#3859a8] to-[#2a4688]">
      <span className="text-white/60 text-sm font-medium">Receptionist</span>
    </div>
  )
}
```

Repeat for all 5 with appropriate names.

- [ ] **Step 6: Verify all mockups render**

Temporarily render all three device types in the ScrollProductShowcase skeleton to visually verify.

- [ ] **Step 7: Commit**

```bash
git add components/sections/showcase/
git commit -m "feat(showcase): add phone, laptop, monitor device mockup shells"
```

---

## Task 3: Slide Layout (SlideText + ProductSlide)

**Files:**
- Create: `components/sections/showcase/SlideText.jsx`
- Create: `components/sections/showcase/ProductSlide.jsx`

- [ ] **Step 1: Create SlideText**

Badge, heading, description, feature bullets, CTA link. All elements have individual class names so GSAP can target them for staggered entry.

```jsx
// components/sections/showcase/SlideText.jsx
import Link from 'next/link'

export function SlideText({ product }) {
  const { slug, icon: Icon, badge, title, desc, features } = product

  return (
    <div className="slide-text max-w-[460px]">
      <div
        className="slide-badge inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-5"
        style={{ background: 'rgba(56, 89, 168, 0.08)', color: '#3859a8' }}
      >
        <Icon size={14} strokeWidth={2} />
        {badge}
      </div>

      <h2
        className="slide-heading text-[clamp(1.75rem,3vw,2.625rem)] font-bold leading-[1.15] tracking-[-0.03em] text-text mb-4"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {title}
      </h2>

      <p className="slide-desc text-base leading-[1.7] text-text-secondary mb-7">
        {desc}
      </p>

      <ul className="slide-features flex flex-col gap-3 mb-8">
        {features.map((f, i) => (
          <li key={i} className="slide-feature flex items-center gap-2.5 text-sm text-text-secondary">
            <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-primary" />
            {f}
          </li>
        ))}
      </ul>

      <Link
        href={`/products/${slug}`}
        className="slide-cta inline-flex items-center gap-2 px-7 py-3 rounded-[10px] text-sm font-medium text-white no-underline btn-gradient"
      >
        Learn more
      </Link>
    </div>
  )
}
```

- [ ] **Step 2: Create ProductSlide**

Wraps SlideText + SlideDevice in a grid. Alternates layout direction per index. Each slide is absolutely positioned and stacked (GSAP will control visibility via transforms).

```jsx
// components/sections/showcase/ProductSlide.jsx
import { SlideText } from './SlideText'
import { SlideDevice } from './SlideDevice'

export function ProductSlide({ product, index, isActive }) {
  const isEven = index % 2 === 1

  return (
    <div
      className="product-slide absolute inset-0 flex items-center justify-center px-6 md:px-[60px]"
      data-index={index}
    >
      <div
        className="w-full max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center"
        style={{ direction: isEven ? 'rtl' : 'ltr' }}
      >
        <div style={{ direction: 'ltr' }}>
          <SlideText product={product} />
        </div>
        <div style={{ direction: 'ltr' }}>
          <SlideDevice
            slug={product.slug}
            deviceType={product.deviceType}
            isActive={isActive}
          />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Update ScrollProductShowcase to render slides**

```jsx
// In ScrollProductShowcase.jsx, render ProductSlide for each product
// inside a pinned container div with h-screen and relative positioning
```

- [ ] **Step 4: Verify slides render stacked (before GSAP animation)**

Run dev server, check that all 5 slides appear (stacked on top of each other since they're absolute positioned). Only the last one will be visible -- this is expected before GSAP controls opacity/transforms.

- [ ] **Step 5: Commit**

```bash
git add components/sections/showcase/SlideText.jsx components/sections/showcase/ProductSlide.jsx components/sections/ScrollProductShowcase.jsx
git commit -m "feat(showcase): add ProductSlide layout with text and device grid"
```

---

## Task 4: GSAP Timeline + ScrollTrigger (Core Animation)

**Files:**
- Modify: `components/sections/ScrollProductShowcase.jsx`
- Modify: `app/globals.css` (add keyframes)

This is the most critical task. Sets up the single master timeline with pin, scrub, snap, and the enter/hold/exit/split animation per product.

- [ ] **Step 1: Add keyframes to globals.css**

```css
/* At the end of globals.css */
@keyframes phone-vibrate {
  0%, 100% { transform: translateX(0); }
  10% { transform: translateX(-2px) rotate(-0.5deg); }
  20% { transform: translateX(2px) rotate(0.5deg); }
  30% { transform: translateX(-2px) rotate(-0.5deg); }
  40% { transform: translateX(2px) rotate(0.5deg); }
  50% { transform: translateX(0); }
}

@keyframes wave-bar {
  0%, 100% { transform: scaleY(0.4); }
  50% { transform: scaleY(1); }
}

@keyframes typing-dot {
  0%, 100% { opacity: 0.3; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-4px); }
}

.animate-phone-vibrate {
  animation: phone-vibrate 0.6s ease-in-out 3;
}
```

- [ ] **Step 2: Implement the GSAP timeline in ScrollProductShowcase**

Full implementation using `useGSAP`, `ScrollTrigger`, timeline with labels, and snap.

```jsx
'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { PRODUCT_SLIDES } from './showcase/data'
import { ProductSlide } from './showcase/ProductSlide'
import { FlowCard } from './showcase/FlowCard'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const SCROLL_PER_PRODUCT = 1500
const TOTAL_SCROLL = PRODUCT_SLIDES.length * SCROLL_PER_PRODUCT

export function ScrollProductShowcase() {
  const containerRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useGSAP(() => {
    const container = containerRef.current
    if (!container) return

    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const slides = container.querySelectorAll('.product-slide')
      const tl = gsap.timeline()

      // Initial state: all slides hidden except first
      gsap.set(slides, { opacity: 0 })
      slides.forEach(slide => {
        gsap.set(slide.querySelectorAll('.slide-text > *'), { x: -80, opacity: 0 })
        gsap.set(slide.querySelector('.slide-device-wrap') || slide.children[0]?.children[1], { x: 80, opacity: 0, scale: 0.95 })
      })

      const snapPoints = []

      slides.forEach((slide, i) => {
        const textEls = slide.querySelectorAll('.slide-text > *')
        const deviceEl = slide.querySelector('[data-device]') || slide.children[0]?.children[1]
        const progress = i / slides.length

        // ENTER
        tl.addLabel(`enter-${i}`)
        tl.to(slide, { opacity: 1, duration: 0.01 }, `enter-${i}`)
        tl.to(textEls, { x: 0, opacity: 1, stagger: 0.02, duration: 0.15, ease: 'power2.out' }, `enter-${i}`)
        tl.to(deviceEl, { x: 0, opacity: 1, scale: 1, duration: 0.18, ease: 'power2.out' }, `enter-${i}+=0.03`)

        // HOLD
        tl.addLabel(`hold-${i}`)
        snapPoints.push(tl.labels[`hold-${i}`] / tl.duration())
        tl.to({}, { duration: 0.35 }) // hold duration

        // EXIT (skip for last slide)
        if (i < slides.length - 1) {
          tl.addLabel(`exit-${i}`)
          tl.to(textEls, { x: -120, opacity: 0, stagger: 0.01, duration: 0.15, ease: 'power2.in' }, `exit-${i}`)
          tl.to(deviceEl, { x: 120, opacity: 0, scale: 0.95, duration: 0.15, ease: 'power2.in' }, `exit-${i}`)
          tl.to(slide, { opacity: 0, duration: 0.01 }, `exit-${i}+=0.15`)

          // TRANSITION GAP
          tl.to({}, { duration: 0.08 })
        }
      })

      ScrollTrigger.create({
        trigger: container,
        pin: true,
        start: 'top top',
        end: `+=${TOTAL_SCROLL}`,
        scrub: 1,
        snap: {
          snapTo: snapPoints,
          duration: { min: 0.2, max: 0.8 },
          delay: 0.1,
          ease: 'power1.inOut',
        },
        animation: tl,
        onUpdate: (self) => {
          // Determine active product for auto-play trigger
          const idx = Math.round(self.progress * (slides.length - 1))
          setActiveIndex(idx)
        },
      })
    })

    // Reduced motion fallback
    mm.add('(prefers-reduced-motion: reduce)', () => {
      const slides = container.querySelectorAll('.product-slide')
      gsap.set(slides, { position: 'relative', opacity: 1 })
      slides.forEach(slide => {
        gsap.set(slide.querySelectorAll('.slide-text > *'), { x: 0, opacity: 1 })
      })
    })
  }, { scope: containerRef })

  return (
    <>
      <section
        ref={containerRef}
        className="relative h-screen overflow-hidden"
        aria-label="Product showcase"
        role="region"
      >
        {PRODUCT_SLIDES.map((product, i) => (
          <ProductSlide
            key={product.slug}
            product={product}
            index={i}
            isActive={activeIndex === i}
          />
        ))}
      </section>
      <FlowCard />
    </>
  )
}
```

- [ ] **Step 3: Verify scroll-lock, scrub, and snap work**

Run dev server. Scroll through the showcase section:
- Section should pin at top of viewport
- Scrolling should progress through products
- Snap should land on each product's hold phase
- Text should enter from left, device from right
- Exit should split them apart

- [ ] **Step 4: Debug and tune timing**

Adjust `duration` values in timeline, `SCROLL_PER_PRODUCT`, snap delay/duration. These will need tuning based on feel.

- [ ] **Step 5: Commit**

```bash
git add components/sections/ScrollProductShowcase.jsx app/globals.css
git commit -m "feat(showcase): wire GSAP ScrollTrigger timeline with pin, scrub, snap"
```

---

## Task 5: Receptionist Screen Content

**Files:**
- Modify: `components/sections/showcase/screens/ReceptionistScreen.jsx`

- [ ] **Step 1: Implement full screen content**

Replace placeholder with: brand blue call header, JotilLabs J avatar, caller info, waveform bars (CSS keyframe), live transcript that auto-plays when `isActive` becomes true. Use Framer Motion `AnimatePresence` for transcript lines appearing sequentially.

Key elements:
- Call header: gradient `#3859a8` to `#2a4688`
- "JotilLabs AI Answering" status text
- Waveform: 9 bars with staggered `animation-delay`, using `wave-bar` keyframe
- Transcript: 4 lines, each appears 600ms apart when `isActive`
- AI lines styled with brand blue, caller lines with dark text

- [ ] **Step 2: Verify in dev server**

Scroll to Receptionist section. Phone should vibrate on enter, waveform should animate, transcript should auto-play during hold.

- [ ] **Step 3: Commit**

```bash
git add components/sections/showcase/screens/ReceptionistScreen.jsx
git commit -m "feat(showcase): receptionist screen with call UI and live transcript"
```

---

## Task 6: Messenger Screen Content

**Files:**
- Modify: `components/sections/showcase/screens/MessengerScreen.jsx`

- [ ] **Step 1: Implement full screen content**

Channel tabs (Web, SMS, WhatsApp, Teams) across top. Chat conversation auto-plays. WhatsApp notification slides in mid-conversation. Key elements:
- Tab bar with 4 channel icons, active indicator animates between tabs
- JotilLabs AI header with J avatar
- Chat messages: 6 messages appear sequentially (600ms apart)
- After message 3, a WhatsApp notification banner slides down from top
- SMS tab badge counter increments
- Typing indicator (3 dots) between AI responses
- User bubbles: brand blue. AI bubbles: light grey with J avatar.

- [ ] **Step 2: Verify multi-channel switching works**

- [ ] **Step 3: Commit**

```bash
git add components/sections/showcase/screens/MessengerScreen.jsx
git commit -m "feat(showcase): messenger screen with multi-channel chat and notifications"
```

---

## Task 7: Outreach Screen Content

**Files:**
- Modify: `components/sections/showcase/screens/OutreachScreen.jsx`

- [ ] **Step 1: Implement full screen content**

Campaign dashboard with animated counting stats and multi-channel feed. Key elements:
- Campaign header with pulsing live indicator dot
- 3 stat cards with counting animation (CountUp-style, triggered by `isActive`)
- Activity feed: 4 items slide in from left with stagger
- Each item shows channel icon, contact name, AI action, timestamp, status dot
- Channel colors use brand-adjacent tones (not off-brand)

- [ ] **Step 2: Verify counting and feed animations**

- [ ] **Step 3: Commit**

```bash
git add components/sections/showcase/screens/OutreachScreen.jsx
git commit -m "feat(showcase): outreach screen with campaign dashboard and activity feed"
```

---

## Task 8: Space Screen Content

**Files:**
- Modify: `components/sections/showcase/screens/SpaceScreen.jsx`

- [ ] **Step 1: Implement full screen content**

AI Model Playground dashboard. Key elements:
- Left sidebar with nav icons (conversations, contacts, analytics, models, settings)
- Main area: two model comparison cards side by side
- Each card: model name, version, response quality score, avg handle time, satisfaction
- "Compare" toggle button highlighted in brand blue
- Sample conversation snippet below cards
- Content fades in progressively: sidebar first, then cards, then metrics

- [ ] **Step 2: Verify progressive reveal**

- [ ] **Step 3: Commit**

```bash
git add components/sections/showcase/screens/SpaceScreen.jsx
git commit -m "feat(showcase): space screen with AI model comparison dashboard"
```

---

## Task 9: Avatar Screen Content

**Files:**
- Modify: `components/sections/showcase/screens/AvatarScreen.jsx`

- [ ] **Step 1: Implement full screen content**

Website with avatar widget popping up. Key elements:
- Faux landing page background (minimal, brand-tinted)
- Bottom-right: avatar widget container pops up when `isActive`
- Avatar: gradient silhouette (CSS gradient shaped as head/shoulders)
- Breathing idle animation (subtle scale pulse via CSS)
- Speech bubble: "Hi! Welcome. I'm here to help you find the right plan."
- Response options: two pill buttons ("Tell me about pricing" / "I need a demo")
- JotilLabs branding on widget header

- [ ] **Step 2: Verify avatar widget pop-up and breathing animation**

- [ ] **Step 3: Commit**

```bash
git add components/sections/showcase/screens/AvatarScreen.jsx
git commit -m "feat(showcase): avatar screen with video widget and idle animation"
```

---

## Task 10: Flow Custom Solutions Card

**Files:**
- Create: `components/sections/showcase/FlowCard.jsx`

- [ ] **Step 1: Implement FlowCard**

Compact card after the scroll showcase. Single centered card with heading, description, CTA. Subtle animated flow diagram icon (CSS keyframe or Framer Motion).

```jsx
// components/sections/showcase/FlowCard.jsx
import Link from 'next/link'
import { GitBranch } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

export function FlowCard() {
  return (
    <AnimatedSection className="py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{
            background: 'linear-gradient(135deg, rgba(56,89,168,0.08), rgba(59,130,246,0.06))',
            border: '1px solid rgba(56,89,168,0.10)',
          }}
        >
          <GitBranch size={24} strokeWidth={1.5} className="text-primary" />
        </div>
        <h2
          className="text-2xl font-bold tracking-[-0.02em] text-text mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Need something custom?
        </h2>
        <p className="text-text-secondary leading-relaxed mb-8 max-w-lg mx-auto">
          Every business runs differently. We design and build custom AI workflows,
          agent pipelines, and integrations tailored to how your team actually works.
        </p>
        <Link
          href="/products/flow"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-[10px] text-sm font-medium text-white no-underline btn-gradient"
        >
          Talk to our team
        </Link>
      </div>
    </AnimatedSection>
  )
}
```

- [ ] **Step 2: Verify FlowCard renders after showcase**

- [ ] **Step 3: Commit**

```bash
git add components/sections/showcase/FlowCard.jsx
git commit -m "feat(showcase): add Flow custom solutions card"
```

---

## Task 11: Progress Indicator + Polish

**Files:**
- Modify: `components/sections/ScrollProductShowcase.jsx`

- [ ] **Step 1: Add dot-nav progress indicator**

Fixed right-side dots (one per product) that highlight based on `activeIndex`. Clickable to scroll to that product.

- [ ] **Step 2: Add section heading before showcase**

An eyebrow + heading above the pinned section: "What Changes for Your Business" / "One platform. Every customer touchpoint."

- [ ] **Step 3: Mobile responsive adjustments**

- Stack text above device on mobile (no horizontal split)
- Reduce device sizes on small screens
- Consider disabling pin on mobile (show products in normal flow with AnimatedSection)

- [ ] **Step 4: Full visual QA in browser**

Test all 5 products, transitions, snap, auto-play, mobile, reduced motion.

- [ ] **Step 5: Commit**

```bash
git add components/sections/ScrollProductShowcase.jsx
git commit -m "feat(showcase): progress indicator, section heading, responsive adjustments"
```

---

## Task 12: Build Verification + Cleanup

**Files:**
- Modify: `components/sections/ScrollProductShowcase.jsx` (if needed)

- [ ] **Step 1: Production build check**

```bash
rm -rf .next && npm run build
```

Expected: build passes with no errors.

- [ ] **Step 2: Lint check**

```bash
npm run lint
```

Expected: no lint errors.

- [ ] **Step 3: Clean up temp files**

Remove `background-comparison.html` and `scroll-showcase-demo.html` from repo root if present.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore(showcase): build verification and cleanup"
```

- [ ] **Step 5: Present animation modes to user**

Before creating PR, describe what Modes A and B would feel like compared to current Mode C:

**Mode A (Full Scrub):** Every element in the phone screens would be tied to scroll position. Scroll down = next chat bubble. Stop = freeze. Gives complete control but chat conversations feel mechanical at wrong scroll speeds.

**Mode B (Trigger Once):** Phone content plays out fully the moment the section enters, regardless of scroll position. Simpler, but user might scroll past before content finishes playing. No scroll-speed dependency.

**Current Mode C (Hybrid):** Structural transitions scroll-controlled, phone content auto-plays at fixed timing during HOLD. Best balance.

Ask user which mode to keep, or if they want to try A or B.

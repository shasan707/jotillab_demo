# Device Screen Animations & Glass Composition Design

**Goal:** Replace the flat, static device mockups in the scroll product showcase with a premium 3D glass composition -- tilted transparent phone/device in the foreground with animated floating action cards behind it, and cinematic auto-playing screen content inside each device.

**Architecture:** Each product's device area becomes a layered 3D scene. The device itself is glass/frosted with CSS perspective tilt. Behind it, floating cards represent the integrations and actions the AI performs. Screen content inside each device runs a looping time-based animation sequence (Framer Motion) independent of the scroll position.

**Tech:** Framer Motion for screen content auto-play + action card animations. CSS transforms for 3D tilt and perspective. CSS backdrop-filter for glass effect. Existing GSAP ScrollTrigger controls which slide is visible (unchanged).

---

## 1. Glass Device Composition (all 5 products)

### 3D Tilt
- Phone: `transform: perspective(1200px) rotateY(-8deg) rotateX(4deg)` -- subtle tilt, not extreme
- Laptop: `transform: perspective(1400px) rotateY(-6deg) rotateX(3deg)`
- Monitor: `transform: perspective(1400px) rotateY(-5deg) rotateX(2deg)`
- All devices get `transform-style: preserve-3d` on their container

### Glass Effect
- Device body background changes from opaque dark to semi-transparent: `background: rgba(20, 20, 24, 0.65)` with `backdrop-filter: blur(12px)`
- Top edge highlight stays (already implemented)
- Screen area stays opaque white (content must be readable)
- The glass body lets the floating cards behind peek through the frame edges

### Floating Action Cards (behind device)
- 2-4 cards per product, positioned absolutely behind the device at different offsets and slight rotations
- Each card: ~120x80px, white background, subtle border, small shadow, rounded-lg
- Contains: icon + short label + mini visual (e.g., calendar grid, CRM row, SMS bubble)
- Cards are offset: some peek from top-right, some from bottom-left, creating depth
- z-index: behind the device (z-0), device is z-10
- Cards start at `opacity: 0.4, scale: 0.95` and animate to `opacity: 1, scale: 1` when their corresponding action fires in the screen animation
- After highlighting for ~1.5s, they settle back to `opacity: 0.6`

---

## 2. Receptionist Screen Animation (phone)

### Floating Cards Behind Phone
1. **Calendar card** -- mini calendar grid icon + "Thu 10:00 AM" 
2. **SMS card** -- message bubble icon + "Confirmation sent"
3. **CRM card** -- contact icon + "Sarah Mitchell added"

### Animation Loop (~11s total)

**Phase 1: RING (0-2.2s)**
- Screen shows incoming call UI
- JotilLabs logo (the Logo component) centered
- Pulsing concentric rings around the logo (CSS keyframes, 3 rings expanding outward with staggered delays)
- "Incoming Call..." label below
- "JotilLabs AI" caller ID text
- Accept (green circle, phone icon) and Decline (red circle, phone-off icon) at bottom
- Phone vibrates via existing `animate-phone-vibrate` class

**Phase 2: CONNECT (2.2-3s)**
- Accept button scales down (pressed)
- Screen cross-fades to active call view
- Quick "Connecting..." text with animated dots, then disappears

**Phase 3: ACTIVE CALL + ACTIONS (3-9.5s)**
- Call header: caller avatar, "Sarah Mitchell", timer counting up, waveform bars
- Conversation appears as **chat-style bubbles** one by one:
  - t=3.0s: AI bubble: "Good morning! How can I help you today?"
    - Waveform bars pulse while AI "speaks" (before bubble appears)
  - t=4.2s: Caller bubble: "I'd like to schedule a consultation."
  - t=5.4s: AI bubble: "I have Thursday at 10 AM open. Does that work?"
  - t=6.6s: Caller bubble: "Thursday at 10 works great."
  - t=7.4s: **Calendar card** behind phone highlights (scale + glow animation)
    - Small inline action indicator in chat: checkmark + "Appointment booked"
  - t=8.0s: **SMS card** highlights
    - Inline: checkmark + "Confirmation SMS sent"  
  - t=8.6s: **CRM card** highlights
    - Inline: checkmark + "Contact saved to CRM"
  - t=9.0s: AI bubble: "All set! You'll get a confirmation text shortly."

**Phase 4: HOLD + RESET (9.5-11s)**
- Hold completed state for 1s
- Fade out entire screen content
- Reset to Phase 1, loop

### Chat Bubble Styling
- AI bubbles: light gray background (#f1f3f5), left-aligned, rounded-xl rounded-bl-sm
- Caller bubbles: brand blue (#3859a8), white text, right-aligned, rounded-xl rounded-br-sm
- Action indicators: no bubble, just a centered line with icon + text in muted color, smaller font
- Each bubble enters with `initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}`
- Typing indicator (3 pulsing dots) shows for 400ms before each AI bubble

### Waveform Visualization
- 7 vertical bars in the call header area
- When AI is "speaking" (before AI bubble appears): bars pulse with `wave-bar` animation
- When caller is "speaking": bars are static/low
- Uses existing CSS keyframe `wave-bar`

---

## 3. Messenger Screen Animation (phone)

### Floating Cards Behind Phone
1. **WhatsApp card** -- WhatsApp icon + "New message"
2. **Teams card** -- Teams icon + "Channel synced"  
3. **Handoff card** -- user icon + "Escalated to agent"

### Animation Loop (~10s)
- Starts with multi-channel tab bar (Web, SMS, WhatsApp, Teams)
- Chat conversation plays out one bubble at a time
- At t=4s: WhatsApp notification banner slides down from top (already implemented)
- WhatsApp floating card highlights simultaneously
- Conversation continues with booking flow
- At t=7s: "Escalated to human agent" action -- handoff card highlights
- Hold, fade, loop

### Chat Content
- Customer: "Do you offer same-day service?"
- AI: "Yes! I have 2:30 PM and 4:00 PM available today."
- Customer: "2:30 works. Book it!"
- AI: "Booked! I'll send confirmation to your WhatsApp."
- Action: WhatsApp card highlights, Teams card highlights

---

## 4. Outreach Screen Animation (phone)

### Floating Cards Behind Phone  
1. **Email card** -- envelope icon + "Drip sequence sent"
2. **Dialer card** -- phone icon + "Auto-dial queued"
3. **Analytics card** -- chart icon + "3x meetings booked"

### Animation Loop (~10s)
- Dashboard view showing campaign stats
- Numbers count up (reuse CountUp pattern)
- Activity feed items appear one by one:
  - "Called John D. -- Booked meeting"
  - "SMS to Lisa R. -- Replied interested"
  - "Email to Mark T. -- Opened"
- Corresponding floating cards highlight as each activity type fires
- Progress bar fills up showing campaign completion
- Hold, fade, loop

---

## 5. Space Screen Animation (laptop)

### Floating Cards Behind Laptop
1. **Model card** -- brain icon + "GPT-4o"
2. **Analytics card** -- bar chart icon + "Performance"
3. **Inbox card** -- inbox icon + "Unified inbox"

### Animation Loop (~10s)
- AI model playground with sidebar showing model list
- User types a prompt (typing animation in input field)
- Response streams in word-by-word
- Model comparison: two response panels fill simultaneously
- Model card highlights when response generates
- Analytics card highlights showing response metrics
- Hold, fade, loop

---

## 6. Avatar Screen Animation (monitor)

### Floating Cards Behind Monitor
1. **Video card** -- camera icon + "Live presence"
2. **Onboarding card** -- route icon + "Guided selling"
3. **Personality card** -- sparkle icon + "Brand voice"

### Animation Loop (~10s)
- Faux website (already implemented) in background at reduced opacity
- Avatar widget pops up in bottom-right (already implemented)
- Avatar "speaks" with speech bubble appearing
- Quick response buttons shown
- One button gets "clicked" (highlight animation)
- New speech bubble with follow-up response
- Onboarding card highlights during guided selling
- Hold, fade, loop

---

## 7. Component Structure

```
showcase/
  SlideDevice.jsx          -- updated: adds glass composition wrapper + floating cards
  devices/
    PhoneMockup.jsx        -- updated: glass body, accepts tilt prop
    LaptopMockup.jsx       -- updated: glass body, accepts tilt prop
    MonitorMockup.jsx       -- updated: glass body, accepts tilt prop
  screens/
    ReceptionistScreen.jsx -- REWRITE: cinematic call sequence
    MessengerScreen.jsx    -- REWRITE: enhanced with action timing
    OutreachScreen.jsx     -- REWRITE: campaign dashboard with activity feed
    SpaceScreen.jsx        -- REWRITE: model playground with streaming
    AvatarScreen.jsx       -- UPDATE: add response interaction sequence
  cards/
    FloatingCards.jsx       -- NEW: renders 2-4 action cards per product
    cardData.js            -- NEW: card definitions per product (icon, label, position offsets)
```

### Data Flow
- `isActive` prop triggers animation start (from ScrollProductShowcase)
- Each screen manages its own animation timeline via `useEffect` + `useState`
- Screen emits action events (via callback prop or internal state) that trigger floating card highlights
- On `isActive=false`, animation resets to initial state
- On `isActive=true` again, animation loops from the beginning

### Floating Card Positioning
Cards are positioned relative to the device container:
- Card 1: `top: -20px, right: -40px, rotate: 3deg`
- Card 2: `bottom: 30px, right: -50px, rotate: -2deg`  
- Card 3: `top: 40px, left: -35px, rotate: -4deg`
- Exact offsets vary per product for best visual balance
- On mobile: cards hidden (screen too small for the composition)

---

## 8. Performance Considerations

- All screen animations use Framer Motion (time-based, not scroll-based)
- CSS `will-change: transform` on tilted device containers
- `backdrop-filter: blur()` is GPU-accelerated but can be expensive -- use sparingly (only on device body, not on cards)
- Floating cards use simple opacity/scale transitions (cheap)
- Animation cleanup on unmount via useEffect return
- Reduced motion: skip all auto-play, show static final state

---

## 9. Not In Scope

- Sound effects
- Real audio waveform analysis
- Touch/click interactions on the phone screen
- Video or canvas-based animations (pure CSS + Framer Motion only)
- Changes to the outer GSAP ScrollTrigger timeline (already working)

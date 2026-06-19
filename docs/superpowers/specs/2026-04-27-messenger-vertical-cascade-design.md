# MessengerScreen Vertical Cascade Redesign

## Goal
Rewrite the MessengerScreen inside the phone mockup to show 4 messaging channels (SMS, Web Chat, WhatsApp, Teams) as vertically stacked layers -- not flat tabs. Each channel has its own conversation with business actions. The animation auto-cycles through all 4 channels.

## Layout: Vertical Cascade

The phone screen has three zones top to bottom:

### 1. Channel Strip Stack (~70px)
Four horizontal strips stacked vertically at the top of the screen. Each strip shows a channel icon + label. The active channel's strip is visually prominent (full opacity, colored left border accent, active indicator dot). Inactive strips are compressed, lower opacity, subtle background.

When the animation switches channels, the strips rearrange via Framer Motion `layout` + `animate`:
- Previous active strip compresses back to a header bar
- New active strip expands and connects to the chat card below
- Transition duration: ~600ms with ease-out curve

### 2. Active Chat Card (flex-1)
The expanded channel area. Contains:
- JotilLabs AI chat header (logo avatar + "JotilLabs AI" + "Online now" status)
- Message bubbles (AI messages have JotilLabs logo avatar, user messages right-aligned in brand blue)
- Bling action animations (sparkle + bounce icon for calendar, reminder, ticket actions)
- Typing orb indicator (pulsing branded orb + waveform bars) before each AI message

### 3. Bottom Bar (fixed)
- JotilLabs orb (pulses with cyan-blue-indigo gradient when AI is typing, quiet blue when idle)
- Text input field placeholder
- Send button

## Channel Colors
- SMS: `#3859a8` (brand blue)
- Web Chat: `#6366F1` (indigo)
- WhatsApp: `#25d366` (green)
- Teams: `#5b5fc7` (purple)

## Animation Sequence (~40s loop)

### Channel 1: SMS (~8s)
Script:
1. User: "Hey, do you have any openings this week?"
2. AI (typing orb): "I have Thursday at 10 AM and Friday at 3 PM. Which works?"
3. User: "Thursday at 10, please."
4. Bling: Calendar booked (Thu, 10:00 AM) -- fires `onAction('calendar')`
5. AI: "You're all set! I'll send a confirmation."

### Channel 2: Web Chat (~8s)
Strip shuffle animation, chat clears.
Script:
1. User: "What's on the lunch menu today?"
2. AI (typing orb): "Today's specials: Grilled Salmon, Pasta Primavera, and Thai Curry Bowl."
3. User: "Can you remind me about my appointment tomorrow?"
4. Bling: Reminder set (SMS at 9:00 AM) -- fires `onAction('reminder')`
5. AI: "Done! You'll get an SMS at 9 AM tomorrow."

### Channel 3: WhatsApp (~8s)
Strip shuffle animation, chat clears.
Script:
1. User: "I need to reschedule my Friday meeting."
2. AI (typing orb): "Monday 2 PM or Tuesday 11 AM available. Preference?"
3. User: "Tuesday 11 works."
4. Bling: Rescheduled (Tue, 11:00 AM) -- fires `onAction('reschedule')`
5. AI: "Updated! Calendar invite sent."

### Channel 4: Teams (~7s)
Strip shuffle animation, chat clears.
Script:
1. User: "Can you create a support ticket for the billing issue?"
2. AI (typing orb): "I'll create that with all conversation details."
3. Bling: Ticket created (Added to CRM) -- fires `onAction('ticket')`
4. AI: "Ticket #4821 assigned to your account manager."

### Loop Reset
~2s pause, then reset to SMS and restart.

## Timing Constants
- Speaking/typing duration: 1000ms (AI messages show typing orb first)
- Gap between messages: 400ms
- User message appearance: 500ms after previous
- Bling action duration: 1000ms (200ms lead-in, 1000ms visible, then inline)
- Channel switch: 400ms for strip rearrangement + 800ms settle before new script
- Total loop: ~40s

## Components

### New: ChannelStrip
Props: `channel` (icon, label, color, id), `isActive`
- Active state: full opacity, colored left border (3px), active dot, slightly larger height
- Inactive state: compressed height (~24px), 0.5 opacity, no border accent
- Framer Motion `layout` for smooth rearrangement

### Reused patterns (from ReceptionistScreen):
- `ChatBubble` -- AI bubbles include JotilLabs logo avatar (5px round), user bubbles right-aligned brand blue
- `BlingAction` -- sparkle particles + bouncy icon entrance + green dot + label
- `TypingOrb` -- pulsing branded orb + 4 waveform bars in light gray bubble
- Bottom bar orb with color shift on typing state

### Data structure
Each channel has its own script array keyed by channel index. Channel switching is a timeline event that triggers strip rearrangement, clears chat items, resets typing state, and starts the new channel's script.

## Files to Modify
- `components/sections/showcase/screens/MessengerScreen.jsx` -- full rewrite
- `components/sections/showcase/cards/cardData.js` -- update messenger floating cards to: calendar, reminder, reschedule, ticket

## Floating Cards Update
```
messenger: [
  { id: 'calendar', icon: Calendar, label: 'Thu 10:00 AM', sublabel: 'Booked' },
  { id: 'reminder', icon: Bell, label: 'Reminder set', sublabel: 'SMS 9:00 AM' },
  { id: 'ticket', icon: Ticket, label: 'Ticket #4821', sublabel: 'CRM' },
]
```

## Out of Scope
- No changes to PhoneMockup, SlideDevice, or ScrollProductShowcase
- No changes to other screens (Receptionist, Outreach, Space, Avatar)
- No GSAP scroll integration inside the screen (this is time-based auto-play, not scroll-driven)

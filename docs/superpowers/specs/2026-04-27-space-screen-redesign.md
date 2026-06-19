# SpaceScreen Redesign: Scroll-Driven 3-Scene Sequential Flow

**Goal:** Replace the single auto-cycling model comparison view with a 3-scene sequential flow (model selection, chat exchange, agent creation) driven by GSAP ScrollTrigger.

**Related:** GH issue #102, PR #101 (Messenger pattern reference)

---

## Architecture

SpaceScreen follows the same scroll-driven pattern established by MessengerScreen:

- Parent (ScrollProductShowcase) allocates 3x scroll range for the Space slide
- A `spaceProgressRef` ref carries 0-1 progress from the parent GSAP proxy into the child
- SpaceScreen reads progress on a GSAP ticker and determines which scene (0, 1, 2) is active
- Scenes cross-fade via GSAP-set opacity on scene container divs

### Progress-to-scene mapping

| Progress range | Active scene | Description |
|---|---|---|
| 0.00 - 0.33 | Scene 1 | Model Selection |
| 0.33 - 0.66 | Scene 2 | Chat Exchange |
| 0.66 - 1.00 | Scene 3 | Agent Creation |

Transitions use a small blend zone (~0.05 progress width) where the outgoing scene fades to 0 and incoming fades to 1.

---

## Scene 1: Model Selection

A grid of 4 model cards inside the workspace content area. When progress enters scene 1, cards appear with staggered opacity. The third card (Claude) gets a selection highlight (border glow + checkmark) as progress moves through the scene.

### Model cards

| Model | Label | Color accent |
|---|---|---|
| GPT-4 | GPT-4 | #10a37f |
| Claude | Claude | #d97706 |
| Gemini | Gemini | #4285f4 |
| Llama | Llama 3 | #7c3aed |

Each card shows: model name, a small icon/dot in the accent color, and a one-line capability tag (e.g., "Fast reasoning", "Long context").

The selected card (Claude) gets:
- Border changes to accent color
- Small checkmark badge in top-right corner
- Subtle scale bump (1.02)

### Layout

```
+--+------------------------------------------+
|  |  Select a Model                          |
|  |                                          |
|S |  [GPT-4]  [Claude]                       |
|I |  [Gemini] [Llama 3]                      |
|D |                                          |
|E |                                          |
|B |                                          |
|A |                                          |
|R |                                          |
+--+------------------------------------------+
```

---

## Scene 2: Chat Exchange

A chat interface showing a 3-message conversation between a user and "Claude" (the selected model). Messages are static (all visible at once, no typing animation -- consistent with Messenger's static approach for scroll-controlled screens).

### Messages

1. **User:** "Summarize today's missed calls and suggest follow-ups"
2. **AI (Claude):** "You had 3 missed calls today. Two from returning clients asking about pricing -- I recommend a follow-up text with your rate sheet. One new lead from Google Ads -- I suggest an immediate callback, they're comparing providers."
3. **User:** "Schedule the callback for 2 PM"

### Action indicator

Below the messages, a small action chip: calendar icon + "Callback scheduled, 2:00 PM" (same pattern as Messenger's action indicators).

### Layout

```
+--+------------------------------------------+
|  |  Claude Chat                    [Online] |
|  |                                          |
|S |  [User bubble: Summarize...]             |
|I |  [AI bubble: You had 3 missed...]        |
|D |  [User bubble: Schedule...]              |
|E |                                          |
|B |  [Calendar icon] Callback scheduled      |
|A |                                          |
|R |  [Type a message...          ] [Send]    |
+--+------------------------------------------+
```

---

## Scene 3: Agent Creation

A simple creation flow showing the result of clicking "Create Agent". Three substates shown statically at different progress points within scene 3:

- **Early (0.66-0.77):** A form-like card with agent name "Sales Assistant", model "Claude", purpose "Follow-up & scheduling". A blue "Create Agent" button.
- **Mid (0.77-0.88):** Same card but button replaced with a spinner and "Creating..." text.
- **Late (0.88-1.00):** Success state -- green checkmark, "Agent Created", agent name with "Active" status badge.

### Layout

```
+--+------------------------------------------+
|  |  Create New Agent                        |
|  |                                          |
|S |  +------------------------------------+  |
|I |  | Name: Sales Assistant              |  |
|D |  | Model: Claude                      |  |
|E |  | Purpose: Follow-up & scheduling    |  |
|B |  |                                    |  |
|A |  | [checkmark] Agent Created          |  |
|R |  | Sales Assistant -- Active          |  |
|  |  +------------------------------------+  |
+--+------------------------------------------+
```

---

## Workspace Frame (persistent)

The sidebar stays visible across all three scenes. Same 5-icon sidebar as current SpaceScreen but with the active icon changing per scene:

| Scene | Active sidebar icon |
|---|---|
| Model Selection | Cpu |
| Chat Exchange | MessageCircle |
| Agent Creation | Users |

The active icon gets the blue highlight background (`rgba(56, 89, 168, 0.1)`) and blue icon color.

---

## ScrollProductShowcase Changes

### New constants

```
SPACE_INDEX = 3
SPACE_SCENES = 3
```

### TOTAL_SCROLL update

```js
const TOTAL_SCROLL = PRODUCT_SLIDES.reduce((sum, _, i) => {
  if (i === MESSENGER_INDEX) return sum + BASE_SCROLL * MESSENGER_CHANNELS
  if (i === SPACE_INDEX) return sum + BASE_SCROLL * SPACE_SCENES
  return sum + BASE_SCROLL
}, 0)
```

### Timeline hold phase

Same pattern as Messenger: variable hold duration with scene sub-labels and a progress proxy.

```js
if (i === SPACE_INDEX) {
  const holdDur = 0.4 * SPACE_SCENES
  const proxy = { progress: 0 }
  tl.addLabel(`hold-${i}`)
  for (let sc = 0; sc < SPACE_SCENES; sc++) {
    tl.addLabel(`space-scene-${sc}`, `hold-${i}+=${(sc / SPACE_SCENES) * holdDur}`)
  }
  tl.to(proxy, {
    progress: 1, duration: holdDur, ease: 'none',
    onUpdate: () => { spaceProgressRef.current = proxy.progress },
  })
}
```

### Snap points

Add `space-scene-0`, `space-scene-1`, `space-scene-2` to the snap array for the Space slide.

### Props

- Add `spaceProgressRef` to ScrollProductShowcase state
- Pass through ProductSlide -> SlideDevice -> SpaceScreen as `progressRef`

---

## Files to modify

| File | Change |
|---|---|
| `components/sections/showcase/screens/SpaceScreen.jsx` | Complete rewrite: 3 scene components, GSAP ticker, progress-driven scene switching |
| `components/sections/ScrollProductShowcase.jsx` | Add SPACE_INDEX/SPACE_SCENES constants, update TOTAL_SCROLL, add timeline hold/snap/progress for Space |
| `components/sections/showcase/ProductSlide.jsx` | Pass `spaceProgressRef` prop |
| `components/sections/showcase/SlideDevice.jsx` | Pass `progressRef` to SpaceScreen |

---

## What this does NOT cover

- Device reflections and laptop sizing (GH issue #103)
- Mobile-specific Space animations
- Floating card updates for Space slide

# JotilLabs Product Icon Family

## Design System Reference

All products share the same hex container (two overlapping hexagons in #3B7BF2 and #1B4FBA). Each product is differentiated by a unique animated accent element that appears in the upper-right area of the hex.

All animations follow a 10-second cycle: animate briefly (first 10%), rest for remaining 90%. This creates a subtle "alive" feeling without being distracting.

---

## Parent Brand

### JotilLabs
- **Accent**: 3 ascending heartbeat dots (filled circles, increasing size)
- **Animation**: `hbDot` - scale pulse with opacity change, staggered 0s/0.15s/0.3s
- **Meaning**: Growth, progression, vitality. The ascending size represents scaling up.
- **Colors**: Dots in #3B7BF2 (primary blue)

---

## Products

### 1. JotilReceptionist
- **What it does**: AI-powered inbound voice agent. Answers calls, qualifies leads, routes to the right person. Your digital front desk.
- **Accent**: 5 waveform bars (vertical rectangles, varying heights)
- **Animation**: `vbPulse` - opacity and color shift (#6B9AEA to #2D6AE0), staggered
- **Meaning**: Voice/audio visualization. The bars represent active conversation.
- **Badge**: Inbound Voice
- **Key outcome**: "Answer every call, 24/7"

### 2. JotilMessenger
- **What it does**: Conversational AI across web chat, WhatsApp, SMS, Teams. Handles text-based customer conversations.
- **Accent**: 3 hollow outlined dots (same positions as JotilLabs dots, but outlined/unfilled)
- **Animation**: `mdDot` - scale pulse + stroke color shift, staggered
- **Meaning**: Chat/typing indicator. Hollow dots = message bubbles forming. Mirrors the parent brand's dots but outlined = text not voice.
- **Badge**: Inbound Text
- **Key outcome**: "Handle chats, SMS, and WhatsApp"

### 3. JotilOutreach
- **What it does**: Automated outbound calls and SMS campaigns at scale. Reaches leads proactively.
- **Accent**: 3 paper planes that fly outward from the hex opening
- **Animation**: `ppFly` - planes appear near hex, fly upper-right, fade out. Staggered 0s/0.8s/1.6s
- **Meaning**: Messages being dispatched outward. The outbound direction (flying away from hex) contrasts with Receptionist (inbound = bars inside hex).
- **Badge**: Outbound
- **Key outcome**: "Grow your pipeline on autopilot"

### 4. JotilSpace
- **What it does**: Unified AI workspace. CRM, ticketing, calendar, lead management. One interface for your whole team.
- **Accent**: 4-shape carousel (circle, diamond, triangle, square take turns appearing)
- **Animation**: `csSlot1-4` - 16s cycle, each shape visible for ~4s, slides in/out
- **Meaning**: Multiple tools converging into one space. Different shapes = different capabilities (CRM, tickets, calendar, leads) united in one container.
- **Badge**: Multi-AI Platform
- **Key outcome**: "CRM, tickets, and scheduling in one place"

### 5. JotilFlow
- **What it does**: Workflow automation engine. Visual builder to connect tools, trigger actions, and automate repetitive tasks with AI decision nodes.
- **Accent**: 3 curved flow lines with animated dots at endpoints
- **Animation**: `flPulse` for lines (opacity + stroke color), `flDot` for dots (opacity + fill), staggered
- **Meaning**: Data flowing through connected paths. The curves represent workflow branches, dots represent data packets moving through the system.
- **Badge**: Automation
- **Key outcome**: "Connect, trigger, automate"

### 6. JotilAvatar
- **What it does**: Lifelike AI avatars for face-to-face digital interactions on websites, video calls, and kiosks.
- **Accent**: Face silhouette with eyes and smile (added post-original lineup)
- **Animation**: Reuses `hbDot` and `flPulse`/`flDot` patterns
- **Meaning**: Human-like presence. The face represents personal, visual AI interaction.
- **Badge**: AI Avatar
- **Key outcome**: "Meet customers face to face with AI"

---

## Animation Keyframes Reference

All defined in `app/globals.css`:

| Keyframe | Used by | Description |
|----------|---------|-------------|
| `hbDot` | JotilLabs, Avatar | Scale pulse 1 > 1.3 > 1 > 1.2 > 1 with opacity |
| `vbPulse` | Receptionist | Opacity + fill color shift on waveform bars |
| `mdDot` | Messenger | Scale pulse + stroke color shift on outlined dots |
| `ppFly` | Outreach | Translate + scale + opacity for paper plane trajectory |
| `csSlot1-4` | Space | 16s carousel, each slot visible for ~4s with slide transition |
| `flPulse` | Flow | Opacity + stroke color shift on flow lines |
| `flDot` | Flow | Opacity + fill color shift on flow endpoint dots |

---

## Color Reference

| Token | Value | Usage |
|-------|-------|-------|
| Primary | #3B7BF2 | Hex fill, dots, accent elements |
| Primary Dark | #1B4FBA | Hex overlay fill |
| Accent Blue | #2D6AE0 | Animation active state |
| Light Blue | #6B9AEA | Animation rest state, subtle accents |

---

## SVG Structure

All product logos share this structure:
```
<svg viewBox="220 130 320 280">
  <HexContainer />    <!-- shared: two hex paths in #3B7BF2 and #1B4FBA -->
  {accent children}   <!-- unique per product -->
</svg>
```

The accent elements are positioned in the upper-right quadrant of the hex (roughly x: 420-500, y: 160-200).

---

## Usage Guidelines

1. **Full hex logo**: Use on product pages, products overview, and anywhere the product needs full brand presence. Sizes: 48-120px.
2. **Small hex logo**: Use in the Solutions mega-menu dropdown. Size: 28-36px. Animations still run but are subtle at small sizes.
3. **Accent-only reference**: When the full hex is too complex (like nav icons at 14px), use a simplified icon that references the accent theme:
   - Receptionist: waveform/audio bars icon
   - Messenger: chat bubble / typing indicator
   - Outreach: paper plane / send icon
   - Space: grid / layout icon
   - Flow: flow/branch/connect icon
   - Avatar: user/face icon

4. **Never use generic icons** (Phone, MessageCircle, TrendingUp) that have no relationship to the hex accent. The visual language should be consistent from nav to product page.

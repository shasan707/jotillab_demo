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
    title: 'One inbox. Every channel. Instant replies.',
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
    title: 'Be the first to follow up. Every time.',
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
    title: 'Where every channel and model comes together.',
    desc: 'One workspace where every conversation, every lead, and every AI model lives. Compare models, track performance, and optimize your AI across all channels.',
    features: [
      'Side-by-side AI model comparison',
      'Real-time conversation analytics',
      'Unified inbox across all channels',
    ],
    deviceType: 'browser',
  },
  {
    slug: 'avatar',
    icon: UserCircle,
    badge: 'JotilAvatar',
    title: 'Greet every visitor, in person, virtually.',
    desc: 'A lifelike digital assistant that greets visitors on your website with real conversation, real expressions, and real personality. Your always-on brand ambassador.',
    features: [
      'Lifelike video presence on your website',
      'Natural conversation with real expressions',
      'Guided selling and onboarding',
    ],
    deviceType: 'browser',
  },
]

/* Human-readable "what's happening now" labels, indexed to match each screen's
   phase transitions (the screens emit onStep(index) at those points). Surfaced
   by DeviceCaption next to the device so the audience can follow the animation. */
export const PRODUCT_STEPS = {
  receptionist: [
    'Incoming call answered',
    'Caller asks to book',
    'AI checks the calendar',
    'Appointment booked',
    'Confirmation text sent',
  ],
  messenger: [
    'Visitor sends a message',
    'AI replies instantly',
    'Details captured',
    'Demo booked',
  ],
  outreach: [
    'Lead list uploaded',
    'Contacts parsed',
    'AI calls every lead',
    'Personalized emails sent',
    'Follow-up texts delivered',
  ],
  space: [
    'Pick the best AI model',
    'Ask for the sales report',
    'Switch to agent builder',
    'New agent deployed',
  ],
  avatar: [
    'Avatar greets the visitor',
    'Visitor asks about pricing',
    'AI explains the plan',
    'Guides them to a demo',
  ],
}

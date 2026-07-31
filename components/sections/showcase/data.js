import { Phone, MessageCircle, TrendingUp, LayoutGrid, UserCircle, CodeXml, Compass, GraduationCap } from 'lucide-react'

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
  {
    slug: 'jotildevs',
    icon: CodeXml,
    badge: 'JotilDevs',
    title: 'Custom software, built around your business.',
    desc: 'We design and build the apps, tools, and integrations your team actually needs, shipped fast and made to fit how you already work.',
    features: [
      'Custom apps, dashboards, and internal tools',
      'AI agents and pipelines wired into your stack',
      'From prototype to production in weeks',
    ],
    deviceType: 'browser',
  },
  {
    slug: 'jotilconsult',
    icon: Compass,
    badge: 'JotilConsult',
    title: 'A clear plan, backed by your numbers.',
    desc: 'We map where time and money leak across your operations, then hand you a prioritized roadmap of exactly what to fix first and what it is worth.',
    features: [
      'Operational and AI-readiness audit',
      'Prioritized roadmap with projected ROI',
      'Clear next steps, no jargon',
    ],
    deviceType: 'browser',
  },
  {
    slug: 'jotileducation',
    icon: GraduationCap,
    badge: 'JotilEducation',
    title: 'Hands-on training your team will actually use.',
    desc: 'Practical, role-based sessions that get your people confident with modern tools and AI, taught on your real workflows, not slideware.',
    features: [
      'Role-based, hands-on sessions',
      'Built on your actual tools and workflows',
      'Progress tracking and certification',
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
  // Live delivery pipeline: caption follows the active phase.
  jotildevs: [
    'Shaping the idea',
    'Wireframes and mockups',
    'Clickable prototype',
    'Building the real thing',
    'Loading data and content',
    'Quality assurance',
    'Shipped and delivered',
  ],
  // Static mockups: a single frozen caption, no step animation.
  jotilconsult: ['Know exactly what to fix first'],
  jotileducation: ['Your team, leveled up'],
}

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
    deviceType: 'browser',
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
    deviceType: 'browser',
  },
]

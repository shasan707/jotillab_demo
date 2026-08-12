'use client'

import { Globe, Phone, MessageCircle } from 'lucide-react'

/* Small pill naming the platform an interaction came from, like
   "via Messenger" in a CRM. Label plus icon, never color alone. */

const STYLES = {
  Website: { background: 'rgba(56,89,168,0.08)', color: '#3859a8', icon: Globe },
  Phone: { background: 'rgba(15,17,41,0.07)', color: '#0F1129', icon: Phone },
  SMS: { background: 'rgba(100,116,139,0.12)', color: '#475569', icon: MessageCircle },
  WhatsApp: { background: 'rgba(21,128,61,0.10)', color: '#15803D', icon: MessageCircle },
  Messenger: { background: 'rgba(59,130,246,0.10)', color: '#1D4ED8', icon: MessageCircle },
  Instagram: { background: 'rgba(219,39,119,0.10)', color: '#BE185D', icon: MessageCircle },
}

export function PlatformBadge({ platform }) {
  if (!platform) return null
  const style = STYLES[platform] || STYLES.Website
  const Icon = style.icon
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
      style={{ background: style.background, color: style.color }}
    >
      <Icon size={11} strokeWidth={2} />
      {platform}
    </span>
  )
}

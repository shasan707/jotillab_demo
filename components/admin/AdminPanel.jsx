'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { LayoutDashboard, Phone, MessageSquare, ClipboardList, Mail, MessageCircle, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { OverviewTab } from './panels/OverviewTab'
import { CallsTab } from './panels/CallsTab'
import { ChatsTab } from './panels/ChatsTab'
import { LeadsTab } from './panels/LeadsTab'
import { MessagesTab } from './panels/MessagesTab'
import { CommentsTab } from './panels/CommentsTab'

/* Unified admin panel: every customer interaction in one place.
   The stat cards double as navigation; tabs mount on first visit and
   stay mounted (hidden) after, so switching back does not refetch. */

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, component: OverviewTab },
  { id: 'calls', label: 'Calls', icon: Phone, component: CallsTab, tint: 'rgba(56,89,168,0.10)', color: '#3859a8' },
  { id: 'chats', label: 'Chats', icon: MessageSquare, component: ChatsTab, tint: 'rgba(59,130,246,0.10)', color: '#3B82F6' },
  { id: 'leads', label: 'Leads', icon: ClipboardList, component: LeadsTab, tint: 'rgba(34,197,94,0.10)', color: '#15803D' },
  { id: 'messages', label: 'Messages', icon: Mail, component: MessagesTab, tint: 'rgba(217,119,6,0.10)', color: '#D97706' },
  { id: 'comments', label: 'Comments', icon: MessageCircle, component: CommentsTab, tint: 'rgba(15,17,41,0.06)', color: '#4A4D6A' },
]

const STAT_CARDS = TABS.filter((tab) => tab.id !== 'overview')

export function AdminPanel() {
  const router = useRouter()
  const reduce = useReducedMotion()
  const [active, setActive] = useState('overview')
  const [visited, setVisited] = useState(() => new Set(['overview']))
  const [stats, setStats] = useState(null)
  const [statsLoaded, setStatsLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.ok) setStats(data.stats)
      })
      .catch(() => {})
      .finally(() => setStatsLoaded(true))
  }, [])

  function selectTab(id) {
    setActive(id)
    setVisited((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  async function handleLogout() {
    try {
      await fetch('/api/admin/login', { method: 'DELETE' })
    } finally {
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-4 pb-16 pt-28 sm:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="m-0 text-2xl font-extrabold tracking-[-0.02em] text-text">Admin</h1>
            <p className="m-0 mt-1 text-sm text-[var(--color-text-secondary)]">
              Calls, chats, leads, and messages from every channel.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex cursor-pointer items-center gap-2 rounded-[11px] border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-text transition-all hover:bg-black/[0.03]"
          >
            <LogOut size={15} strokeWidth={1.5} />
            Log out
          </button>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {STAT_CARDS.map((tab, i) => {
            const Icon = tab.icon
            const value = stats?.[tab.id]
            const isActive = active === tab.id
            const card = (
              <button
                type="button"
                onClick={() => selectTab(tab.id)}
                className={cn(
                  'flex w-full cursor-pointer items-center gap-3 rounded-2xl border bg-white p-4 text-left transition-all hover:-translate-y-px hover:shadow-md',
                  isActive ? 'border-primary/30 shadow-sm ring-2 ring-primary/10' : 'border-black/[0.06]'
                )}
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: tab.tint }}
                >
                  <Icon size={17} strokeWidth={1.5} color={tab.color} />
                </span>
                <span className="min-w-0">
                  {statsLoaded ? (
                    <span className="block font-mono text-xl font-extrabold leading-tight text-text">
                      {typeof value === 'number' ? value.toLocaleString('en-US') : '—'}
                    </span>
                  ) : (
                    <span className="mb-1 block h-6 w-10 animate-pulse rounded bg-black/[0.06]" />
                  )}
                  <span className="block text-xs font-semibold text-[var(--color-text-secondary)]">
                    {tab.id === 'comments' ? 'Pending comments' : tab.label}
                  </span>
                </span>
              </button>
            )
            if (reduce) return <div key={tab.id}>{card}</div>
            return (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.05, ease: 'easeOut' }}
              >
                {card}
              </motion.div>
            )
          })}
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = active === tab.id
            const count = stats?.[tab.id]
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => selectTab(tab.id)}
                className={cn(
                  'inline-flex cursor-pointer items-center gap-2 rounded-[11px] border px-4 py-2 text-sm font-semibold transition-all',
                  isActive
                    ? 'border-transparent bg-primary text-white shadow-sm'
                    : 'border-black/10 bg-white text-[var(--color-text-secondary)] hover:bg-black/[0.03]'
                )}
              >
                <Icon size={15} strokeWidth={1.5} />
                {tab.label}
                {typeof count === 'number' && count > 0 && (
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.5 font-mono text-[11px] font-bold leading-none',
                      isActive ? 'bg-white/20 text-white' : 'bg-black/[0.06] text-[var(--color-text-secondary)]'
                    )}
                  >
                    {count > 999 ? '999+' : count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {TABS.map((tab) => {
          if (!visited.has(tab.id)) return null
          const Tab = tab.component
          return (
            <div key={tab.id} className={active === tab.id ? '' : 'hidden'}>
              <Tab />
            </div>
          )
        })}
      </div>
    </div>
  )
}

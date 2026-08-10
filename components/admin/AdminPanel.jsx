'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Phone, MessageSquare, ClipboardList, Mail, MessageCircle, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CallsTab } from './panels/CallsTab'
import { ChatsTab } from './panels/ChatsTab'
import { LeadsTab } from './panels/LeadsTab'
import { MessagesTab } from './panels/MessagesTab'
import { CommentsTab } from './panels/CommentsTab'

/* Unified admin panel: every customer interaction in one place.
   Tabs mount on first visit and stay mounted (hidden) after, so
   switching back does not refetch. */

const TABS = [
  { id: 'calls', label: 'Calls', icon: Phone, component: CallsTab },
  { id: 'chats', label: 'Chats', icon: MessageSquare, component: ChatsTab },
  { id: 'leads', label: 'Leads', icon: ClipboardList, component: LeadsTab },
  { id: 'messages', label: 'Messages', icon: Mail, component: MessagesTab },
  { id: 'comments', label: 'Comments', icon: MessageCircle, component: CommentsTab },
]

export function AdminPanel() {
  const router = useRouter()
  const [active, setActive] = useState('calls')
  const [visited, setVisited] = useState(() => new Set(['calls']))

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
      <div className="mx-auto w-full max-w-4xl">
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

        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = active === tab.id
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

'use client'

import { useCallback, useEffect, useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ListState } from './ListState'
import { DetailDrawer } from './DetailDrawer'
import { fmtDateTime, SENTIMENT_STYLES } from './format'

/* Chat sessions, listed live from Retell. The widget creates a session
   when it opens, so sessions where the visitor never typed are hidden
   by default. */

export function ChatsTab() {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [paginationKey, setPaginationKey] = useState(null)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [showEmpty, setShowEmpty] = useState(false)

  const [selectedId, setSelectedId] = useState(null)
  const [detail, setDetail] = useState(null)
  const [detailStatus, setDetailStatus] = useState('idle')

  const load = useCallback(async (key) => {
    try {
      if (key) setLoadingMore(true)
      const params = new URLSearchParams()
      if (key) params.set('paginationKey', key)
      const res = await fetch(`/api/admin/chats?${params}`)
      const data = await res.json()
      if (!res.ok || !data.ok) {
        if (res.status === 503) {
          setStatus('unconfigured')
          setError(data.error)
          return
        }
        throw new Error(data.error || 'Could not load chats.')
      }
      setItems((prev) => (key ? [...prev, ...data.items] : data.items))
      setPaginationKey(data.paginationKey)
      setHasMore(data.hasMore)
      setStatus('ready')
    } catch (err) {
      setStatus('error')
      setError(err.message || 'Could not load chats.')
    } finally {
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    load(null)
  }, [load])

  async function openChat(id) {
    setSelectedId(id)
    setDetail(null)
    setDetailStatus('loading')
    try {
      const res = await fetch(`/api/admin/chats/${encodeURIComponent(id)}`)
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not load the chat.')
      setDetail(data.chat)
      setDetailStatus('ready')
    } catch {
      setDetailStatus('error')
    }
  }

  if (status !== 'ready') {
    return <ListState status={status} error={error} onRetry={() => { setStatus('loading'); load(null) }} />
  }

  const visible = showEmpty ? items : items.filter((c) => c.userMessageCount > 0)

  return (
    <div>
      <div className="mb-3 flex items-center justify-end">
        <label className="flex cursor-pointer items-center gap-2 text-[13px] text-[var(--color-text-secondary)]">
          <input
            type="checkbox"
            checked={showEmpty}
            onChange={(e) => setShowEmpty(e.target.checked)}
            className="accent-[var(--color-primary)]"
          />
          Show empty sessions
        </label>
      </div>

      {visible.length === 0 ? (
        <ListState status="empty" emptyLabel="No chats yet. Conversations from the website chat widget will appear here." />
      ) : (
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {visible.map((chat) => (
            <li key={chat.id}>
              <button
                type="button"
                onClick={() => openChat(chat.id)}
                className="flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-black/[0.06] bg-white px-5 py-4 text-left transition-all hover:-translate-y-px hover:shadow-md"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: 'rgba(59,130,246,0.10)' }}
                >
                  <MessageSquare size={17} strokeWidth={1.5} className="text-accent" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-text">{chat.agent}</span>
                    {chat.sentiment && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                        style={SENTIMENT_STYLES[chat.sentiment] || SENTIMENT_STYLES.Unknown}
                      >
                        {chat.sentiment}
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block truncate text-[13px] text-[var(--color-text-secondary)]">
                    {chat.summary || chat.preview || 'No messages'}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-[13px] font-semibold text-text">
                    {chat.messageCount} {chat.messageCount === 1 ? 'message' : 'messages'}
                  </span>
                  <span className="block text-xs text-[var(--color-text-muted)]">{fmtDateTime(chat.startedAt)}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            disabled={loadingMore}
            onClick={() => load(paginationKey)}
            className="cursor-pointer rounded-[11px] border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-text transition-all hover:bg-black/[0.03] disabled:opacity-60"
          >
            {loadingMore ? 'Loading...' : 'Load more'}
          </button>
        </div>
      )}

      <DetailDrawer open={Boolean(selectedId)} title="Chat details" onClose={() => setSelectedId(null)}>
        {detailStatus === 'loading' && (
          <div className="flex justify-center py-16">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          </div>
        )}
        {detailStatus === 'error' && (
          <p className="text-sm text-[var(--color-text-secondary)]">Could not load this chat. Close and try again.</p>
        )}
        {detailStatus === 'ready' && detail && (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="m-0 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Agent</p>
                <p className="m-0 mt-0.5 text-sm text-text">{detail.agent}</p>
              </div>
              <div>
                <p className="m-0 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Started</p>
                <p className="m-0 mt-0.5 text-sm text-text">{fmtDateTime(detail.startedAt)}</p>
              </div>
            </div>

            {detail.analysis?.summary && (
              <div className="rounded-2xl border border-black/[0.06] bg-[var(--color-bg-alt)] p-4">
                <p className="m-0 mb-1 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Summary</p>
                <p className="m-0 text-sm leading-relaxed text-text">{detail.analysis.summary}</p>
              </div>
            )}

            <div>
              <p className="m-0 mb-3 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Conversation</p>
              {detail.messages.length === 0 ? (
                <p className="m-0 text-sm text-[var(--color-text-muted)]">The visitor opened the chat but never sent a message.</p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {detail.messages.map((m, i) => (
                    <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                      <div
                        className={cn(
                          'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                          m.role === 'user'
                            ? 'bg-primary text-white'
                            : 'border border-black/[0.06] bg-[var(--color-bg-alt)] text-text'
                        )}
                      >
                        {m.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  )
}

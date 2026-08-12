'use client'

import { useCallback, useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
import { ListState } from './ListState'
import { Toolbar } from './Toolbar'
import { AnimatedRow } from './AnimatedRow'
import { fmtDateTime, timeAgo } from './format'

/* Pending blog comments with one-click moderation. Uses the same
   idempotent decision logic as the emailed approve/reject links. */

export function CommentsTab() {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [confirmReject, setConfirmReject] = useState(null)
  const [actingId, setActingId] = useState(null)
  const [notice, setNotice] = useState('')
  const [search, setSearch] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/comments')
      const data = await res.json()
      if (!res.ok || !data.ok) {
        if (res.status === 503) {
          setStatus('unconfigured')
          setError(data.error)
          return
        }
        throw new Error(data.error || 'Could not load comments.')
      }
      setItems(data.items)
      setStatus('ready')
    } catch (err) {
      setStatus('error')
      setError(err.message || 'Could not load comments.')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function decide(id, action) {
    setActingId(id)
    setNotice('')
    try {
      const res = await fetch('/api/admin/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not apply the decision.')
      setItems((prev) => prev.filter((c) => c.id !== id))
      if (data.outcome?.startsWith('already-')) {
        setNotice('That comment had already been decided from the email link.')
      } else if (data.outcome === 'missing') {
        setNotice('That comment was no longer pending. It may have expired.')
      }
    } catch (err) {
      setNotice(err.message || 'Could not apply the decision.')
    } finally {
      setActingId(null)
      setConfirmReject(null)
    }
  }

  if (status !== 'ready') {
    return <ListState status={status} error={error} onRetry={() => { setStatus('loading'); load() }} />
  }

  const q = search.trim().toLowerCase()
  const visible = items.filter((comment) => {
    if (!q) return true
    return [comment.name, comment.email, comment.message, comment.slug]
      .filter(Boolean)
      .some((field) => String(field).toLowerCase().includes(q))
  })

  return (
    <div>
      <Toolbar
        searchValue={search}
        onSearch={setSearch}
        placeholder="Search comments by name, email, or content..."
        onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false) }}
        refreshing={refreshing}
        resultCount={visible.length}
      />

      {notice && (
        <div className="mb-3 rounded-[11px] px-4 py-3 text-sm" style={{ background: 'rgba(56,89,168,0.06)', color: '#3859a8' }}>
          {notice}
        </div>
      )}

      {visible.length === 0 ? (
        <ListState
          status="empty"
          emptyLabel={items.length === 0 ? 'No comments waiting for review.' : 'No comments match this search.'}
        />
      ) : (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {visible.map((comment, i) => (
            <AnimatedRow key={comment.id} index={i}>
              <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-text">{comment.name}</span>
                {comment.email && (
                  <span className="text-[13px] text-[var(--color-text-secondary)]">{comment.email}</span>
                )}
                <a
                  href={`/blog/${comment.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-black/[0.05] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-text-secondary)] no-underline hover:bg-black/[0.08]"
                >
                  {comment.slug}
                </a>
                <span className="ml-auto text-xs text-[var(--color-text-muted)]" title={fmtDateTime(comment.createdAt)}>
                  {timeAgo(comment.createdAt)}
                </span>
              </div>
              <p className="m-0 mb-4 whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {comment.message}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={actingId === comment.id}
                  onClick={() => decide(comment.id, 'approve')}
                  className="btn-gradient inline-flex cursor-pointer items-center gap-1.5 rounded-[11px] border-none px-4 py-2 text-[13px] font-semibold text-white transition-all disabled:opacity-60"
                >
                  <Check size={14} strokeWidth={2} />
                  Approve
                </button>
                <button
                  type="button"
                  disabled={actingId === comment.id}
                  onClick={() =>
                    confirmReject === comment.id ? decide(comment.id, 'reject') : setConfirmReject(comment.id)
                  }
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-[11px] border border-black/10 bg-white px-4 py-2 text-[13px] font-semibold transition-all disabled:opacity-60"
                  style={confirmReject === comment.id ? { background: 'rgba(239,68,68,0.08)', color: '#DC2626', borderColor: 'rgba(239,68,68,0.3)' } : { color: '#DC2626' }}
                >
                  <X size={14} strokeWidth={2} />
                  {confirmReject === comment.id ? 'Confirm reject' : 'Reject'}
                </button>
              </div>
              </div>
            </AnimatedRow>
          ))}
        </ul>
      )}
    </div>
  )
}

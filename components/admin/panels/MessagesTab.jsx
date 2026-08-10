'use client'

import { useCallback, useEffect, useState } from 'react'
import { Mail, CalendarClock } from 'lucide-react'
import { ListState } from './ListState'
import { DetailDrawer } from './DetailDrawer'
import { fmtDateTime } from './format'

/* Contact form and live-demo booking submissions from Neon Postgres. */

const PAGE_SIZE = 50

export function MessagesTab() {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [loadingMore, setLoadingMore] = useState(false)
  const [selected, setSelected] = useState(null)

  const load = useCallback(async (offset) => {
    try {
      if (offset > 0) setLoadingMore(true)
      const res = await fetch(`/api/admin/messages?limit=${PAGE_SIZE}&offset=${offset}`)
      const data = await res.json()
      if (!res.ok || !data.ok) {
        if (res.status === 503) {
          setStatus('unconfigured')
          setError(data.error)
          return
        }
        throw new Error(data.error || 'Could not load messages.')
      }
      setItems((prev) => (offset > 0 ? [...prev, ...data.items] : data.items))
      setTotal(data.total)
      setStatus('ready')
    } catch (err) {
      setStatus('error')
      setError(err.message || 'Could not load messages.')
    } finally {
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    load(0)
  }, [load])

  if (status !== 'ready') {
    return <ListState status={status} error={error} onRetry={() => { setStatus('loading'); load(0) }} />
  }
  if (items.length === 0) {
    return (
      <ListState
        status="empty"
        emptyLabel="No messages stored yet. New contact form submissions will appear here (older ones are only in the email inbox)."
      />
    )
  }

  return (
    <div>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {items.map((msg) => (
          <li key={msg.id}>
            <button
              type="button"
              onClick={() => setSelected(msg)}
              className="flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-black/[0.06] bg-white px-5 py-4 text-left transition-all hover:-translate-y-px hover:shadow-md"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ background: 'rgba(56,89,168,0.10)' }}
              >
                <Mail size={17} strokeWidth={1.5} className="text-primary" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-text">{msg.name}</span>
                  {msg.demo_slot ? (
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                      style={{ background: 'rgba(56,89,168,0.10)', color: '#3859a8' }}
                    >
                      <CalendarClock size={11} strokeWidth={2} />
                      Demo request
                    </span>
                  ) : (
                    msg.inquiry_type && (
                      <span className="rounded-full bg-black/[0.05] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-text-secondary)]">
                        {msg.inquiry_type}
                      </span>
                    )
                  )}
                </span>
                <span className="mt-0.5 block truncate text-[13px] text-[var(--color-text-secondary)]">{msg.message}</span>
              </span>
              <span className="shrink-0 text-xs text-[var(--color-text-muted)]">{fmtDateTime(msg.created_at)}</span>
            </button>
          </li>
        ))}
      </ul>

      {items.length < total && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            disabled={loadingMore}
            onClick={() => load(items.length)}
            className="cursor-pointer rounded-[11px] border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-text transition-all hover:bg-black/[0.03] disabled:opacity-60"
          >
            {loadingMore ? 'Loading...' : `Load more (${items.length} of ${total})`}
          </button>
        </div>
      )}

      <DetailDrawer open={Boolean(selected)} title="Message details" onClose={() => setSelected(null)}>
        {selected && (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-3">
              <Meta label="Name" value={selected.name} />
              <Meta label="Received" value={fmtDateTime(selected.created_at)} />
              <Meta
                label="Email"
                value={
                  <a href={`mailto:${selected.email}`} className="text-primary">
                    {selected.email}
                  </a>
                }
              />
              <Meta
                label="Phone"
                value={
                  selected.phone ? (
                    <a href={`tel:${selected.phone}`} className="text-primary">
                      {selected.phone}
                    </a>
                  ) : null
                }
              />
              <Meta label="Company" value={selected.company} />
              <Meta label="Inquiry type" value={selected.inquiry_type} />
            </div>

            {selected.demo_slot && (
              <div className="rounded-2xl border border-black/[0.06] p-4" style={{ background: 'rgba(56,89,168,0.06)' }}>
                <p className="m-0 mb-1 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Requested demo time
                </p>
                <p className="m-0 text-sm font-semibold text-text">{selected.demo_slot}</p>
              </div>
            )}

            <div className="rounded-2xl border border-black/[0.06] bg-[var(--color-bg-alt)] p-4">
              <p className="m-0 mb-1 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Message</p>
              <p className="m-0 whitespace-pre-wrap text-sm leading-relaxed text-text">{selected.message}</p>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  )
}

function Meta({ label, value }) {
  return (
    <div>
      <p className="m-0 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{label}</p>
      <p className="m-0 mt-0.5 break-words text-sm text-text">{value || '—'}</p>
    </div>
  )
}

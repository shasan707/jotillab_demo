'use client'

import { useCallback, useEffect, useState } from 'react'
import { Phone } from 'lucide-react'
import { ListState } from './ListState'
import { DetailDrawer } from './DetailDrawer'
import { fmtDateTime, fmtDuration, SENTIMENT_STYLES } from './format'

/* Voice calls, listed live from Retell. Row click opens a drawer that
   fetches the full call fresh (recording links can expire, so details
   are never cached). */

export function CallsTab() {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error | unconfigured
  const [error, setError] = useState('')
  const [paginationKey, setPaginationKey] = useState(null)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const [selectedId, setSelectedId] = useState(null)
  const [detail, setDetail] = useState(null)
  const [detailStatus, setDetailStatus] = useState('idle')

  const load = useCallback(async (key) => {
    try {
      if (key) setLoadingMore(true)
      const params = new URLSearchParams()
      if (key) params.set('paginationKey', key)
      const res = await fetch(`/api/admin/calls?${params}`)
      const data = await res.json()
      if (!res.ok || !data.ok) {
        if (res.status === 503) {
          setStatus('unconfigured')
          setError(data.error)
          return
        }
        throw new Error(data.error || 'Could not load calls.')
      }
      setItems((prev) => (key ? [...prev, ...data.items] : data.items))
      setPaginationKey(data.paginationKey)
      setHasMore(data.hasMore)
      setStatus('ready')
    } catch (err) {
      setStatus('error')
      setError(err.message || 'Could not load calls.')
    } finally {
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    load(null)
  }, [load])

  async function openCall(id) {
    setSelectedId(id)
    setDetail(null)
    setDetailStatus('loading')
    try {
      const res = await fetch(`/api/admin/calls/${encodeURIComponent(id)}`)
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not load the call.')
      setDetail(data.call)
      setDetailStatus('ready')
    } catch {
      setDetailStatus('error')
    }
  }

  if (status !== 'ready') {
    return <ListState status={status} error={error} onRetry={() => { setStatus('loading'); load(null) }} />
  }
  if (items.length === 0) {
    return <ListState status="empty" emptyLabel="No calls yet. They will appear here as soon as someone talks to your AI." />
  }

  return (
    <div>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {items.map((call) => (
          <li key={call.id}>
            <button
              type="button"
              onClick={() => openCall(call.id)}
              className="flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-black/[0.06] bg-white px-5 py-4 text-left transition-all hover:-translate-y-px hover:shadow-md"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ background: 'rgba(56,89,168,0.10)' }}
              >
                <Phone size={17} strokeWidth={1.5} className="text-primary" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-text">{call.agent}</span>
                  {call.sentiment && (
                    <span
                      className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                      style={SENTIMENT_STYLES[call.sentiment] || SENTIMENT_STYLES.Unknown}
                    >
                      {call.sentiment}
                    </span>
                  )}
                  {call.status !== 'ended' && (
                    <span className="rounded-full bg-black/[0.05] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-text-secondary)]">
                      {call.status}
                    </span>
                  )}
                </span>
                {call.summary && (
                  <span className="mt-0.5 block truncate text-[13px] text-[var(--color-text-secondary)]">
                    {call.summary}
                  </span>
                )}
              </span>
              <span className="shrink-0 text-right">
                <span className="block text-[13px] font-semibold text-text">{fmtDuration(call.durationMs)}</span>
                <span className="block text-xs text-[var(--color-text-muted)]">{fmtDateTime(call.startedAt)}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

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

      <DetailDrawer open={Boolean(selectedId)} title="Call details" onClose={() => setSelectedId(null)}>
        {detailStatus === 'loading' && (
          <div className="flex justify-center py-16">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          </div>
        )}
        {detailStatus === 'error' && (
          <p className="text-sm text-[var(--color-text-secondary)]">Could not load this call. Close and try again.</p>
        )}
        {detailStatus === 'ready' && detail && (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Meta label="Agent" value={detail.agent} />
              <Meta label="When" value={fmtDateTime(detail.startedAt)} />
              <Meta label="Duration" value={fmtDuration(detail.durationMs)} />
              <Meta label="Status" value={detail.status} />
              {detail.fromNumber && <Meta label="From" value={detail.fromNumber} />}
              {detail.toNumber && <Meta label="To" value={detail.toNumber} />}
            </div>

            {detail.recordingUrl ? (
              <div>
                <p className="m-0 mb-2 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Recording</p>
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <audio controls preload="none" src={detail.recordingUrl} className="w-full" />
              </div>
            ) : null}

            {detail.analysis?.summary && (
              <div className="rounded-2xl border border-black/[0.06] bg-[var(--color-bg-alt)] p-4">
                <p className="m-0 mb-1 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Summary</p>
                <p className="m-0 text-sm leading-relaxed text-text">{detail.analysis.summary}</p>
              </div>
            )}

            <div>
              <p className="m-0 mb-2 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Transcript</p>
              {detail.transcriptObject?.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {detail.transcriptObject.map((u, i) => (
                    <div key={i} className="text-sm leading-relaxed">
                      <span className="font-bold text-text">{u.role === 'agent' ? 'AI' : 'Caller'}: </span>
                      <span className="text-[var(--color-text-secondary)]">{u.content}</span>
                    </div>
                  ))}
                </div>
              ) : detail.transcript ? (
                <p className="m-0 whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {detail.transcript}
                </p>
              ) : (
                <p className="m-0 text-sm text-[var(--color-text-muted)]">
                  No transcript was stored by Retell for this call.
                </p>
              )}
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
      <p className="m-0 mt-0.5 text-sm text-text">{value || '—'}</p>
    </div>
  )
}

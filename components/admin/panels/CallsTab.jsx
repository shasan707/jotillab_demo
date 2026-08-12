'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Phone, Flag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ListState } from './ListState'
import { DetailDrawer } from './DetailDrawer'
import { Toolbar } from './Toolbar'
import { AnimatedRow } from './AnimatedRow'
import { NotesSection } from './NotesSection'
import { useMeta } from './useMeta'
import { fmtDateTime, fmtDuration, timeAgo, SENTIMENT_STYLES } from './format'

/* Voice calls, listed live from Retell. Unread calls show a dot and bold
   name; opening one marks it read. Flags and notes persist in the
   panel's own metadata store. */

const SENTIMENT_CHIPS = [
  { id: 'all', label: 'All' },
  { id: 'Positive', label: 'Positive' },
  { id: 'Neutral', label: 'Neutral' },
  { id: 'Negative', label: 'Negative' },
]

export function CallsTab() {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [paginationKey, setPaginationKey] = useState(null)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const [search, setSearch] = useState('')
  const [sentimentChip, setSentimentChip] = useState('all')

  const [selectedId, setSelectedId] = useState(null)
  const [detail, setDetail] = useState(null)
  const [detailStatus, setDetailStatus] = useState('idle')

  const ids = useMemo(() => items.map((c) => c.id), [items])
  const { metaMap, markRead, toggleFlag, addNote } = useMeta('call', ids)

  const load = useCallback(async (key, { refresh = false } = {}) => {
    try {
      if (key) setLoadingMore(true)
      if (refresh) setRefreshing(true)
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
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load(null)
  }, [load])

  async function openCall(id) {
    setSelectedId(id)
    markRead(id)
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

  const q = search.trim().toLowerCase()
  const visible = items.filter((call) => {
    if (sentimentChip !== 'all' && call.sentiment !== sentimentChip) return false
    if (!q) return true
    return [call.agent, call.summary, call.fromNumber, call.toNumber]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(q))
  })

  const selectedMeta = selectedId ? metaMap[selectedId] : null

  return (
    <div>
      <Toolbar
        searchValue={search}
        onSearch={setSearch}
        placeholder="Search calls by agent, summary, or number..."
        chips={SENTIMENT_CHIPS}
        activeChip={sentimentChip}
        onChipSelect={setSentimentChip}
        onRefresh={() => load(null, { refresh: true })}
        refreshing={refreshing}
        resultCount={visible.length}
      />

      {visible.length === 0 ? (
        <ListState
          status="empty"
          emptyLabel={
            items.length === 0
              ? 'No calls yet. They will appear here as soon as someone talks to your AI.'
              : 'No calls match this search or filter.'
          }
        />
      ) : (
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {visible.map((call, i) => {
            const meta = metaMap[call.id]
            const unread = !meta?.read
            return (
              <AnimatedRow key={call.id} index={i}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => openCall(call.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCall(call.id) } }}
                  className="flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-black/[0.06] bg-white px-5 py-4 text-left transition-all hover:-translate-y-px hover:border-primary/20 hover:shadow-md"
                >
                  <span
                    className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: 'rgba(56,89,168,0.10)' }}
                  >
                    <Phone size={17} strokeWidth={1.5} className="text-primary" />
                    {unread && (
                      <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-accent" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className={cn('text-sm text-text', unread ? 'font-extrabold' : 'font-semibold')}>
                        {call.agent}
                      </span>
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
                    <span className="block font-mono text-[13px] font-semibold text-text">
                      {fmtDuration(call.durationMs)}
                    </span>
                    <span className="block text-xs text-[var(--color-text-muted)]" title={fmtDateTime(call.startedAt)}>
                      {timeAgo(call.startedAt)}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); toggleFlag(call.id) }}
                    title={meta?.flagged ? 'Remove flag' : 'Flag for follow-up'}
                    aria-label={meta?.flagged ? 'Remove flag' : 'Flag for follow-up'}
                    className={cn(
                      'flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent transition-all hover:bg-black/[0.05]',
                      meta?.flagged ? 'opacity-100' : 'opacity-40 hover:opacity-100'
                    )}
                  >
                    <Flag
                      size={15}
                      strokeWidth={1.5}
                      color={meta?.flagged ? '#D97706' : 'currentColor'}
                      fill={meta?.flagged ? '#D97706' : 'none'}
                    />
                  </button>
                </div>
              </AnimatedRow>
            )
          })}
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

            <NotesSection notes={selectedMeta?.notes || []} onAdd={(text) => addNote(selectedId, text)} />
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

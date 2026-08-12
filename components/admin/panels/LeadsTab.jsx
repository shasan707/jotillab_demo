'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { ClipboardList, Flag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getIntakeQuestions } from '@/lib/intakeQuestions'
import { ListState } from './ListState'
import { DetailDrawer } from './DetailDrawer'
import { Toolbar } from './Toolbar'
import { AnimatedRow } from './AnimatedRow'
import { NotesSection } from './NotesSection'
import { useMeta } from './useMeta'
import { fmtDateTime, timeAgo } from './format'

/* Industry intake leads from Neon Postgres. New leads show a dot and
   bold name until opened; the drawer maps every stored answer back to
   its wizard question. */

const PAGE_SIZE = 50

export function LeadsTab() {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [loadingMore, setLoadingMore] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const ids = useMemo(() => items.map((l) => String(l.id)), [items])
  const { metaMap, markRead, toggleFlag, addNote } = useMeta('lead', ids)

  const load = useCallback(async (offset, { refresh = false } = {}) => {
    try {
      if (offset > 0) setLoadingMore(true)
      if (refresh) setRefreshing(true)
      const res = await fetch(`/api/admin/leads?limit=${PAGE_SIZE}&offset=${offset}`)
      const data = await res.json()
      if (!res.ok || !data.ok) {
        if (res.status === 503) {
          setStatus('unconfigured')
          setError(data.error)
          return
        }
        throw new Error(data.error || 'Could not load leads.')
      }
      setItems((prev) => (offset > 0 ? [...prev, ...data.items] : data.items))
      setTotal(data.total)
      setStatus('ready')
    } catch (err) {
      setStatus('error')
      setError(err.message || 'Could not load leads.')
    } finally {
      setLoadingMore(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load(0)
  }, [load])

  if (status !== 'ready') {
    return <ListState status={status} error={error} onRetry={() => { setStatus('loading'); load(0) }} />
  }

  const q = search.trim().toLowerCase()
  const visible = items.filter((lead) => {
    if (!q) return true
    return [lead.business_name, lead.contact_name, lead.contact_email, lead.contact_phone, lead.industry_name]
      .filter(Boolean)
      .some((field) => String(field).toLowerCase().includes(q))
  })

  const questionLabel = (slug, id) => {
    const question = getIntakeQuestions(slug).find((entry) => entry.id === id)
    return question?.label || id.replaceAll('_', ' ')
  }

  const selectedMeta = selected ? metaMap[String(selected.id)] : null

  return (
    <div>
      <Toolbar
        searchValue={search}
        onSearch={setSearch}
        placeholder="Search leads by name, email, phone, or industry..."
        onRefresh={() => load(0, { refresh: true })}
        refreshing={refreshing}
        resultCount={visible.length}
      />

      {visible.length === 0 ? (
        <ListState
          status="empty"
          emptyLabel={
            items.length === 0
              ? 'No leads yet. Intake form submissions from the industry pages will appear here.'
              : 'No leads match this search.'
          }
        />
      ) : (
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {visible.map((lead, i) => {
            const key = String(lead.id)
            const meta = metaMap[key]
            const unread = !meta?.read
            return (
              <AnimatedRow key={key} index={i}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => { setSelected(lead); markRead(key) }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(lead); markRead(key) } }}
                  className="flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-black/[0.06] bg-white px-5 py-4 text-left transition-all hover:-translate-y-px hover:border-primary/20 hover:shadow-md"
                >
                  <span
                    className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: 'rgba(56,89,168,0.10)' }}
                  >
                    <ClipboardList size={17} strokeWidth={1.5} className="text-primary" />
                    {unread && (
                      <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-accent" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className={cn('truncate text-sm text-text', unread ? 'font-extrabold' : 'font-semibold')}>
                        {lead.business_name || lead.contact_name || 'Unnamed lead'}
                      </span>
                      {unread && (
                        <span
                          className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                          style={{ background: 'rgba(59,130,246,0.10)', color: '#1D4ED8' }}
                        >
                          New
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-[13px] text-[var(--color-text-secondary)]">
                      {[lead.industry_name, lead.contact_email].filter(Boolean).join(' | ')}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-[var(--color-text-muted)]" title={fmtDateTime(lead.created_at)}>
                    {timeAgo(lead.created_at)}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); toggleFlag(key) }}
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

      <DetailDrawer open={Boolean(selected)} title="Lead details" onClose={() => setSelected(null)}>
        {selected && (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-3">
              <Meta label="Business" value={selected.business_name} />
              <Meta label="Industry" value={selected.industry_name} />
              <Meta label="Name" value={selected.contact_name} />
              <Meta label="Received" value={fmtDateTime(selected.created_at)} />
              <Meta
                label="Email"
                value={
                  selected.contact_email ? (
                    <a href={`mailto:${selected.contact_email}`} className="text-primary">
                      {selected.contact_email}
                    </a>
                  ) : null
                }
              />
              <Meta
                label="Phone"
                value={
                  selected.contact_phone ? (
                    <a href={`tel:${selected.contact_phone}`} className="text-primary">
                      {selected.contact_phone}
                    </a>
                  ) : null
                }
              />
            </div>

            <div>
              <p className="m-0 mb-3 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Answers</p>
              <div className="flex flex-col gap-3">
                {Object.entries(selected.answers || {})
                  .filter(([id]) => !['business_name', 'contact_name', 'contact_email', 'contact_phone'].includes(id))
                  .map(([id, value]) => (
                    <div key={id} className="rounded-2xl border border-black/[0.06] bg-[var(--color-bg-alt)] p-4">
                      <p className="m-0 mb-1 text-[13px] font-semibold text-[var(--color-text-secondary)]">
                        {questionLabel(selected.slug, id)}
                      </p>
                      <p className="m-0 whitespace-pre-wrap text-sm text-text">{String(value)}</p>
                    </div>
                  ))}
              </div>
            </div>

            <NotesSection
              notes={selectedMeta?.notes || []}
              onAdd={(text) => addNote(String(selected.id), text)}
            />
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

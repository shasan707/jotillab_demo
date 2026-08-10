'use client'

import { useCallback, useEffect, useState } from 'react'
import { ClipboardList } from 'lucide-react'
import { getIntakeQuestions } from '@/lib/intakeQuestions'
import { ListState } from './ListState'
import { DetailDrawer } from './DetailDrawer'
import { fmtDateTime } from './format'

/* Industry intake leads from Neon Postgres. The drawer maps each stored
   answer id back to its wizard question label. */

const PAGE_SIZE = 50

export function LeadsTab() {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [loadingMore, setLoadingMore] = useState(false)
  const [selected, setSelected] = useState(null)

  const load = useCallback(async (offset) => {
    try {
      if (offset > 0) setLoadingMore(true)
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
    }
  }, [])

  useEffect(() => {
    load(0)
  }, [load])

  if (status !== 'ready') {
    return <ListState status={status} error={error} onRetry={() => { setStatus('loading'); load(0) }} />
  }
  if (items.length === 0) {
    return <ListState status="empty" emptyLabel="No leads yet. Intake form submissions from the industry pages will appear here." />
  }

  const questionLabel = (slug, id) => {
    const q = getIntakeQuestions(slug).find((question) => question.id === id)
    return q?.label || id.replaceAll('_', ' ')
  }

  return (
    <div>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {items.map((lead) => (
          <li key={lead.id}>
            <button
              type="button"
              onClick={() => setSelected(lead)}
              className="flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-black/[0.06] bg-white px-5 py-4 text-left transition-all hover:-translate-y-px hover:shadow-md"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ background: 'rgba(56,89,168,0.10)' }}
              >
                <ClipboardList size={17} strokeWidth={1.5} className="text-primary" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-text">
                  {lead.business_name || lead.contact_name || 'Unnamed lead'}
                </span>
                <span className="mt-0.5 block truncate text-[13px] text-[var(--color-text-secondary)]">
                  {[lead.industry_name, lead.contact_email].filter(Boolean).join(' | ')}
                </span>
              </span>
              <span className="shrink-0 text-xs text-[var(--color-text-muted)]">{fmtDateTime(lead.created_at)}</span>
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

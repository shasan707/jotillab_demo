'use client'

import { useState } from 'react'
import { StickyNote } from 'lucide-react'
import { fmtDateTime, timeAgo } from './format'

/* Notes block inside the detail drawer. Notes live in the panel's own
   metadata store, never in the source record. */

export function NotesSection({ notes = [], onAdd }) {
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)

  async function handlePost() {
    const text = draft.trim()
    if (!text || busy) return
    setBusy(true)
    setFailed(false)
    const ok = await onAdd(text)
    if (ok) setDraft('')
    else setFailed(true)
    setBusy(false)
  }

  return (
    <div>
      <p className="m-0 mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
        <StickyNote size={12} strokeWidth={1.5} />
        Notes
      </p>

      {notes.length > 0 && (
        <ul className="m-0 mb-3 flex list-none flex-col gap-2 p-0">
          {notes.map((note, i) => (
            <li
              key={i}
              className="rounded-xl border border-black/[0.06] p-3"
              style={{ background: 'rgba(56,89,168,0.04)' }}
            >
              <p className="m-0 whitespace-pre-wrap text-sm leading-relaxed text-text">{note.text}</p>
              <p className="m-0 mt-1 text-[11px] text-[var(--color-text-muted)]" title={fmtDateTime(note.at)}>
                {timeAgo(note.at)}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-start gap-2">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a note..."
          rows={2}
          className="flex-1 resize-y rounded-[11px] border border-black/10 bg-white px-3.5 py-2.5 text-sm text-text outline-none transition-all placeholder:text-[var(--color-text-muted)] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
        />
        <button
          type="button"
          onClick={handlePost}
          disabled={busy || !draft.trim()}
          className="btn-gradient cursor-pointer rounded-[11px] border-none px-4 py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-50"
        >
          {busy ? 'Posting...' : 'Post'}
        </button>
      </div>
      {failed && (
        <p className="m-0 mt-2 text-xs" style={{ color: '#DC2626' }}>
          The note could not be saved. Try again.
        </p>
      )}
    </div>
  )
}

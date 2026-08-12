'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/* Client hook for per-record admin metadata (read / flagged / notes).
   Fetches metadata for newly seen ids, applies changes optimistically,
   and persists them via /api/admin/meta. If persistence fails the panel
   keeps working; the state just does not survive a reload. */

export function useMeta(kind, ids) {
  const [metaMap, setMetaMap] = useState({})
  const fetchedRef = useRef(new Set())

  useEffect(() => {
    const fresh = ids.filter((id) => id && !fetchedRef.current.has(id))
    if (fresh.length === 0) return
    fresh.forEach((id) => fetchedRef.current.add(id))
    fetch(`/api/admin/meta?kind=${kind}&ids=${encodeURIComponent(fresh.slice(0, 200).join(','))}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.ok && data.meta) setMetaMap((prev) => ({ ...prev, ...data.meta }))
      })
      .catch(() => {})
  }, [kind, ids])

  const persist = useCallback(
    (id, patch) => {
      fetch('/api/admin/meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, id, ...patch }),
      }).catch(() => {})
    },
    [kind]
  )

  const markRead = useCallback(
    (id) => {
      setMetaMap((prev) => {
        if (prev[id]?.read) return prev
        return { ...prev, [id]: { ...prev[id], read: true } }
      })
      persist(id, { read: true })
    },
    [persist]
  )

  const toggleFlag = useCallback(
    (id) => {
      setMetaMap((prev) => {
        const flagged = !prev[id]?.flagged
        persist(id, { flagged })
        return { ...prev, [id]: { ...prev[id], flagged } }
      })
    },
    [persist]
  )

  const addNote = useCallback(
    async (id, text) => {
      const res = await fetch('/api/admin/meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, id, note: text }),
      })
      const data = await res.json().catch(() => null)
      if (data?.ok && data.meta) {
        setMetaMap((prev) => ({ ...prev, [id]: data.meta }))
        return true
      }
      return false
    },
    [kind]
  )

  return { metaMap, markRead, toggleFlag, addNote }
}

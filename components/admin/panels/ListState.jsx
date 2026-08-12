'use client'

import { AlertCircle, Inbox, PlugZap } from 'lucide-react'

/* Shared loading / empty / error / not-configured block for the admin tabs. */

export function ListState({ status, error, emptyLabel, onRetry }) {
  if (status === 'loading') {
    return (
      <div className="flex flex-col gap-2" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-2xl border border-black/[0.06] bg-white px-5 py-4"
          >
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-black/[0.06]" />
            <div className="flex-1">
              <div className="mb-2 h-3 w-1/3 animate-pulse rounded bg-black/[0.06]" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-black/[0.04]" />
            </div>
            <div className="h-3 w-16 shrink-0 animate-pulse rounded bg-black/[0.05]" />
          </div>
        ))}
      </div>
    )
  }

  if (status === 'unconfigured') {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <PlugZap size={28} strokeWidth={1.5} className="text-[var(--color-text-muted)]" />
        <p className="m-0 max-w-sm text-sm text-[var(--color-text-secondary)]">
          {error || 'This service is not configured yet.'}
        </p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <AlertCircle size={28} strokeWidth={1.5} className="text-red-500" />
        <p className="m-0 max-w-sm text-sm text-[var(--color-text-secondary)]">
          {error || 'Something went wrong.'}
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="cursor-pointer rounded-[11px] border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-text transition-all hover:bg-black/[0.03]"
          >
            Try again
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <Inbox size={28} strokeWidth={1.5} className="text-[var(--color-text-muted)]" />
      <p className="m-0 text-sm text-[var(--color-text-secondary)]">{emptyLabel || 'Nothing here yet.'}</p>
    </div>
  )
}

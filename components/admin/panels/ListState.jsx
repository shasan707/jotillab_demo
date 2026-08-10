'use client'

import { AlertCircle, Inbox, PlugZap } from 'lucide-react'

/* Shared loading / empty / error / not-configured block for the admin tabs. */

export function ListState({ status, error, emptyLabel, onRetry }) {
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
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

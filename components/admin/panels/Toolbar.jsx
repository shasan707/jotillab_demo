'use client'

import { Search, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

/* Search + filter chips + refresh row shared by the admin tabs. */

export function Toolbar({
  searchValue,
  onSearch,
  placeholder = 'Search...',
  chips,
  activeChip,
  onChipSelect,
  onRefresh,
  refreshing = false,
  resultCount,
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <div className="relative min-w-[200px] flex-1">
        <Search
          size={15}
          strokeWidth={1.5}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
        />
        <input
          type="search"
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-[11px] border border-black/10 bg-white py-2.5 pl-10 pr-4 text-sm text-text outline-none transition-all placeholder:text-[var(--color-text-muted)] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
        />
      </div>

      {chips && (
        <div className="flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => onChipSelect(chip.id)}
              className={cn(
                'cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold transition-all',
                activeChip === chip.id
                  ? 'border-transparent bg-primary text-white shadow-sm'
                  : 'border-black/10 bg-white text-[var(--color-text-secondary)] hover:bg-black/[0.03]'
              )}
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onRefresh}
        disabled={refreshing}
        title="Refresh"
        aria-label="Refresh"
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[11px] border border-black/10 bg-white text-[var(--color-text-secondary)] transition-all hover:bg-black/[0.03] disabled:opacity-60"
      >
        <RefreshCw size={15} strokeWidth={1.5} className={refreshing ? 'animate-spin' : ''} />
      </button>

      {typeof resultCount === 'number' && (
        <span className="text-xs text-[var(--color-text-muted)]">
          {resultCount} {resultCount === 1 ? 'result' : 'results'}
        </span>
      )}
    </div>
  )
}

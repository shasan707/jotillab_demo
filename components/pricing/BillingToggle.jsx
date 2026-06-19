'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export function BillingToggle({ onChange, annualDiscountPct = 17, className }) {
  const [mode, setMode] = useState('monthly')

  const select = (next) => {
    setMode(next)
    if (onChange) onChange(next)
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-border bg-white p-1 text-sm font-medium',
        className
      )}
    >
      <button
        type="button"
        onClick={() => select('monthly')}
        className={cn(
          'rounded-full px-4 py-1.5 transition-all',
          mode === 'monthly' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-text'
        )}
      >
        Monthly
      </button>
      <button
        type="button"
        onClick={() => select('annual')}
        className={cn(
          'rounded-full px-4 py-1.5 transition-all inline-flex items-center gap-1.5',
          mode === 'annual' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-text'
        )}
      >
        Annual
        <span
          className={cn(
            'text-[10px] font-semibold rounded-full px-1.5 py-0.5',
            mode === 'annual' ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
          )}
        >
          -{annualDiscountPct}%
        </span>
      </button>
    </div>
  )
}

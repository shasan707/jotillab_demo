'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { INDUSTRIES, getIndustry } from '@/lib/industries'
import { ChatIntake } from './ChatIntake'

/* Standalone intake for the shareable /start page: pick an industry from
   a dropdown, then the same guided chat used on the industry pages takes
   over. Changing the industry starts a fresh conversation (key remount). */

export function StartIntake({ initialSlug = null }) {
  const [slug, setSlug] = useState(initialSlug)
  const industry = slug ? getIndustry(slug) : null

  return (
    <div>
      <div className="mx-auto mb-8 max-w-md">
        <label
          htmlFor="start-industry"
          className="mb-2 block text-sm font-semibold text-text"
        >
          What kind of business do you have?
        </label>
        <div className="relative">
          <select
            id="start-industry"
            value={slug || ''}
            onChange={(e) => setSlug(e.target.value || null)}
            className="w-full cursor-pointer appearance-none rounded-[11px] border bg-white px-4 py-3 pr-10 text-sm text-text outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
            style={{ border: '1px solid rgba(0,0,0,0.1)' }}
          >
            <option value="">Choose your industry</option>
            {INDUSTRIES.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            strokeWidth={1.5}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
          />
        </div>
        {!industry && (
          <p className="m-0 mt-2 text-center text-sm text-[var(--color-text-secondary)]">
            Pick your industry and the questions will match your business.
          </p>
        )}
      </div>

      {industry && <ChatIntake key={industry.slug} slug={industry.slug} industryName={industry.name} />}
    </div>
  )
}

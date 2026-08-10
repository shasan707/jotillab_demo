'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

/* Quick-reply chips for select and multiselect questions. A select answers
   on the first tap; a multiselect toggles chips and confirms with Done.
   Optional questions get a skip chip that answers with no value. */

const chipBase =
  'inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0'

export function ChipGroup({ question, onAnswer, onSkip, disabled }) {
  const [picked, setPicked] = useState([])
  const isMulti = question.type === 'multiselect'

  const toggle = (opt) =>
    setPicked((prev) => (prev.includes(opt) ? prev.filter((v) => v !== opt) : [...prev, opt]))

  return (
    <div className="flex flex-wrap items-center gap-2">
      {question.options.map((opt) => {
        const selected = isMulti && picked.includes(opt)
        return (
          <button
            key={opt}
            type="button"
            disabled={disabled}
            onClick={() => (isMulti ? toggle(opt) : onAnswer(opt))}
            className={`${chipBase} text-text bg-white hover:border-primary`}
            style={{
              border: `1px solid ${selected ? '#3859a8' : 'rgba(15,17,41,0.12)'}`,
              background: selected ? 'rgba(56,89,168,0.08)' : '#ffffff',
            }}
          >
            {selected && <Check size={13} strokeWidth={2.4} color="#3859a8" />}
            {opt}
          </button>
        )
      })}

      {isMulti && (
        <button
          type="button"
          disabled={disabled || picked.length === 0}
          onClick={() => onAnswer(picked)}
          className={`${chipBase} text-white btn-gradient border-none`}
        >
          Done
        </button>
      )}

      {!question.required && (
        <button
          type="button"
          disabled={disabled}
          onClick={onSkip}
          className={`${chipBase} text-text-secondary bg-transparent hover:text-text`}
          style={{ border: '1px dashed rgba(15,17,41,0.18)' }}
        >
          {question.skipLabel || 'Skip this'}
        </button>
      )}
    </div>
  )
}

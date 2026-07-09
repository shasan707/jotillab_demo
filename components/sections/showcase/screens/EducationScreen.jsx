'use client'

import { GraduationCap, Check, Play, Award } from 'lucide-react'

/* JotilEducation — static course-progress view. One clean frozen moment: a
   course with a rounded progress bar, module rows, and a certificate chip.
   No animation. */

const BRAND = '#3859a8'
const MONO = { fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' }

const MODULES = [
  { name: 'Working with your AI receptionist', lessons: '6 lessons', status: 'complete' },
  { name: 'Handling handoffs and escalations', lessons: '6 lessons', status: 'complete' },
  { name: 'Automating follow-ups in your CRM', lessons: '6 lessons', status: 'progress' },
]

export function EducationScreen({ isActive, onAction, onStep, progressRef }) {
  return (
    <div className="flex h-full w-full flex-col bg-white text-[12px]">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-black/5 bg-[#F8FAFF] px-5 py-2.5">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-6 w-6 items-center justify-center rounded-md"
            style={{ background: 'rgba(56,89,168,0.10)', border: '1px solid rgba(56,89,168,0.18)' }}
          >
            <GraduationCap size={13} strokeWidth={1.8} style={{ color: BRAND }} />
          </span>
          <span className="text-[13px] font-semibold text-text">Team training</span>
          <span className="text-[11px] text-text-secondary" style={MONO}>front-desk track</span>
        </div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
          style={{ background: 'rgba(56,89,168,0.08)', border: '1px solid rgba(56,89,168,0.18)', color: BRAND }}
        >
          <Award size={11} strokeWidth={2} />
          Certificate
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 px-6 py-4">
        {/* Course header + progress */}
        <div
          className="rounded-xl bg-white px-5 py-4"
          style={{ border: '1px solid rgba(15,17,41,0.06)', boxShadow: '0 4px 14px rgba(56,89,168,0.07)' }}
        >
          <div className="mb-2.5 flex items-center justify-between">
            <div>
              <p className="text-[14px] font-bold text-text">AI at the front desk</p>
              <p className="mt-0.5 text-[11px] text-text-secondary">
                Taught on your real workflows, with your own tools
              </p>
            </div>
            <div className="text-right">
              <p className="text-[17px] font-bold leading-none" style={{ ...MONO, color: BRAND }}>68%</p>
              <p className="mt-1 text-[10.5px] text-text-secondary" style={MONO}>12 of 18 lessons</p>
            </div>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ background: 'rgba(56,89,168,0.10)' }}>
            <div
              className="h-full rounded-full"
              style={{ width: '68%', background: `linear-gradient(90deg, ${BRAND}, #3B82F6)` }}
            />
          </div>
        </div>

        {/* Module rows */}
        <div
          className="flex-1 rounded-xl bg-white"
          style={{ border: '1px solid rgba(15,17,41,0.06)', boxShadow: '0 4px 14px rgba(56,89,168,0.07)' }}
        >
          <div className="border-b border-black/5 px-4 py-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Modules</span>
          </div>
          <div className="divide-y divide-black/[0.04]">
            {MODULES.map((m) => {
              const done = m.status === 'complete'
              return (
                <div key={m.name} className="flex items-center gap-3 px-4 py-3">
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                    style={
                      done
                        ? { background: 'rgba(18,160,107,0.12)', color: '#12a06b' }
                        : { background: 'rgba(56,89,168,0.10)', color: BRAND }
                    }
                  >
                    {done ? <Check size={12} strokeWidth={2.6} /> : <Play size={10} strokeWidth={2.4} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium text-text">{m.name}</p>
                    <p className="text-[10.5px] text-text-secondary" style={MONO}>{m.lessons}</p>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                    style={
                      done
                        ? { background: 'rgba(18,160,107,0.10)', border: '1px solid rgba(18,160,107,0.25)', color: '#12a06b' }
                        : { background: 'rgba(56,89,168,0.08)', border: '1px solid rgba(56,89,168,0.20)', color: BRAND }
                    }
                  >
                    {done ? 'Complete' : 'In progress'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer note */}
        <div className="flex items-center justify-between px-1">
          <span className="text-[10.5px] text-text-secondary">Next session: role-play with live calls</span>
          <span className="text-[10.5px] font-semibold" style={{ ...MONO, color: BRAND }}>8 team members enrolled</span>
        </div>
      </div>
    </div>
  )
}

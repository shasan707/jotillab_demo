'use client'

import { Check, FileCode2, Rocket } from 'lucide-react'

/* JotilDevs — static split builder view. One clean frozen moment: a short
   config definition on the left, the shipped result rendered live on the
   right, with a Deployed pill and a passing build line. No animation. */

const BRAND = '#3859a8'
const MONO = { fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' }

/* Syntax tokens (all palette colors already used elsewhere in the app) */
const T = {
  comment: '#9da3c0',
  keyword: '#a855f7',
  key: BRAND,
  string: '#10b981',
  value: '#f97316',
  plain: '#0f1129',
  punct: '#6B7098',
}

function Line({ n, children }) {
  return (
    <div className="flex gap-3 leading-[1.75]">
      <span className="w-4 shrink-0 select-none text-right" style={{ color: 'rgba(15,17,41,0.22)' }}>{n}</span>
      <span className="whitespace-pre">{children}</span>
    </div>
  )
}

export function DevsScreen({ isActive, onAction, onStep, progressRef }) {
  return (
    <div className="flex h-full w-full flex-col bg-white text-[12px]">
      {/* Builder top bar */}
      <div className="flex items-center justify-between border-b border-black/5 bg-[#F8FAFF] px-5 py-2.5">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-6 w-6 items-center justify-center rounded-md"
            style={{ background: 'rgba(56,89,168,0.10)', border: '1px solid rgba(56,89,168,0.18)' }}
          >
            <FileCode2 size={13} strokeWidth={1.8} style={{ color: BRAND }} />
          </span>
          <span className="text-[13px] font-semibold text-text">booking-widget</span>
          <span className="text-[11px] text-text-secondary" style={MONO}>main</span>
        </div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
          style={{ background: '#e7f6ef', border: '1px solid #c9ecdd', color: '#12a06b' }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#12a06b' }} />
          Deployed
        </span>
      </div>

      {/* Split builder view */}
      <div className="flex min-h-0 flex-1">
        {/* Left: code / config pane */}
        <div className="flex w-[54%] flex-col border-r border-black/5 bg-[#FAFBFD]">
          <div className="flex items-center gap-2 border-b border-black/5 px-5 py-2">
            <span className="text-[11px] font-medium text-text-secondary" style={MONO}>
              booking-widget.config.js
            </span>
          </div>
          <div className="flex-1 overflow-hidden px-5 py-3 text-[11.5px]" style={MONO}>
            <Line n="1"><span style={{ color: T.comment }}>{'// Booking widget for Meridian Dental'}</span></Line>
            <Line n="2">
              <span style={{ color: T.keyword }}>export const</span>
              <span style={{ color: T.plain }}> widget </span>
              <span style={{ color: T.punct }}>= {'{'}</span>
            </Line>
            <Line n="3">
              <span style={{ color: T.key }}>  name</span>
              <span style={{ color: T.punct }}>: </span>
              <span style={{ color: T.string }}>&quot;Book an appointment&quot;</span>
              <span style={{ color: T.punct }}>,</span>
            </Line>
            <Line n="4">
              <span style={{ color: T.key }}>  trigger</span>
              <span style={{ color: T.punct }}>: </span>
              <span style={{ color: T.string }}>&quot;website.visit&quot;</span>
              <span style={{ color: T.punct }}>,</span>
            </Line>
            <Line n="5">
              <span style={{ color: T.key }}>  fields</span>
              <span style={{ color: T.punct }}>: [</span>
              <span style={{ color: T.string }}>&quot;name&quot;</span>
              <span style={{ color: T.punct }}>, </span>
              <span style={{ color: T.string }}>&quot;phone&quot;</span>
              <span style={{ color: T.punct }}>, </span>
              <span style={{ color: T.string }}>&quot;service&quot;</span>
              <span style={{ color: T.punct }}>],</span>
            </Line>
            <Line n="6">
              <span style={{ color: T.key }}>  action</span>
              <span style={{ color: T.punct }}>: </span>
              <span style={{ color: T.plain }}>bookAppointment</span>
              <span style={{ color: T.punct }}>,</span>
            </Line>
            <Line n="7">
              <span style={{ color: T.key }}>  notify</span>
              <span style={{ color: T.punct }}>: [</span>
              <span style={{ color: T.string }}>&quot;sms&quot;</span>
              <span style={{ color: T.punct }}>, </span>
              <span style={{ color: T.string }}>&quot;email&quot;</span>
              <span style={{ color: T.punct }}>],</span>
            </Line>
            <Line n="8">
              <span style={{ color: T.key }}>  calendar</span>
              <span style={{ color: T.punct }}>: </span>
              <span style={{ color: T.string }}>&quot;google&quot;</span>
              <span style={{ color: T.punct }}>,</span>
            </Line>
            <Line n="9">
              <span style={{ color: T.key }}>  theme</span>
              <span style={{ color: T.punct }}>: {'{ '}</span>
              <span style={{ color: T.key }}>brand</span>
              <span style={{ color: T.punct }}>: </span>
              <span style={{ color: T.string }}>&quot;#3859a8&quot;</span>
              <span style={{ color: T.punct }}>{' }'},</span>
            </Line>
            <Line n="10"><span style={{ color: T.punct }}>{'}'}</span></Line>
          </div>
        </div>

        {/* Right: live rendered result */}
        <div className="flex w-[46%] flex-col">
          <div className="flex items-center justify-between border-b border-black/5 px-5 py-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
              Live preview
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-text-secondary" style={MONO}>
              <Rocket size={11} strokeWidth={1.8} style={{ color: BRAND }} />
              v1.4
            </span>
          </div>

          <div
            className="flex flex-1 items-center justify-center px-6"
            style={{ background: 'linear-gradient(160deg, #f5f8fd, #e8eefb)' }}
          >
            {/* The rendered widget */}
            <div
              className="w-full max-w-[240px] rounded-2xl bg-white p-4"
              style={{
                border: '1px solid rgba(15,17,41,0.06)',
                boxShadow: '0 10px 30px rgba(56,89,168,0.14), 0 2px 8px rgba(15,17,41,0.05)',
              }}
            >
              <p className="mb-2.5 text-[13px] font-bold text-text">Book an appointment</p>
              <div className="space-y-1.5">
                <div className="rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-[11px] text-text">
                  Sarah Mitchell
                </div>
                <div className="rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-[11px] text-text-secondary">
                  +1 (801) 555-0147
                </div>
                <div className="flex items-center justify-between rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-[11px] text-text">
                  Teeth cleaning
                  <span className="text-text-secondary">▾</span>
                </div>
              </div>
              <div
                className="mt-2.5 rounded-lg py-2 text-center text-[11px] font-semibold text-white"
                style={{ background: `linear-gradient(120deg, #22396E, ${BRAND})` }}
              >
                Confirm booking
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Build status line */}
      <div className="flex items-center justify-between border-t border-black/5 bg-[#F8FAFF] px-5 py-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium" style={{ color: '#12a06b' }}>
          <span
            className="flex h-3.5 w-3.5 items-center justify-center rounded-full"
            style={{ background: 'rgba(18,160,107,0.14)' }}
          >
            <Check size={9} strokeWidth={3} />
          </span>
          <span style={MONO}>Build passed - 2.4s</span>
        </span>
        <span className="text-[11px] text-text-secondary" style={MONO}>deploy #142 · production</span>
      </div>
    </div>
  )
}

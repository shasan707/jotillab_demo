'use client'

import { Calendar } from 'lucide-react'

/* Google Calendar appointment schedule for live demos. Bookings land straight
   on the team calendar with confirmations and reminders handled by Google. */
const SCHEDULE_URL =
  'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2wB9gNUe0b2LohiRxaaswmPLhiBpDxDft4TM_MarjE1KaBAcfn0sFlqYC9XDjGqCKyMY64h5Y7?gv=true'

export function DemoScheduler() {
  return (
    <div
      className="rounded-[20px] overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #3859a8, #2a4688)',
        boxShadow: '0 12px 40px rgba(56, 89, 168,0.35)',
      }}
    >
      {/* Header */}
      <div className="p-7 pb-5">
        <div className="flex items-center gap-2 mb-2">
          <Calendar size={16} className="text-white/90" strokeWidth={1.8} />
          <h3 className="font-bold text-white text-base">Book a Live Demo</h3>
        </div>
        <p className="text-sm text-white/80 leading-relaxed">
          Pick a time that works for you. You get a confirmed spot on our calendar right away.
        </p>
      </div>

      {/* Google appointment scheduling embed */}
      <div className="bg-white rounded-t-2xl p-1">
        <iframe
          src={SCHEDULE_URL}
          width="100%"
          height="620"
          frameBorder="0"
          title="Book a live demo with JotilLabs"
          className="block rounded-xl"
          loading="lazy"
        />
      </div>
    </div>
  )
}

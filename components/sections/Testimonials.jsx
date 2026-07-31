'use client'

import { useRef, useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { SerifAccent, TiltCard } from '@/components/design'

const TESTIMONIALS = [
  {
    quote:
      'We cut missed calls by 80% in the first month. Patients get scheduled instantly now, even at 2am.',
    name: 'Sarah M.',
    role: 'Practice Manager',
    company: 'Meridian Health',
    initials: 'SM',
    avatarColor: '#3859a8',
  },
  {
    quote:
      'We were skeptical AI could handle our complex inquiries. It handles them better than most of our staff.',
    name: 'James T.',
    role: 'CEO',
    company: 'Apex Realty Group',
    initials: 'JT',
    avatarColor: '#3B82F6',
  },
  {
    quote:
      'The ROI was clear in week one. AI-powered outreach is now our highest-performing lead channel.',
    name: 'Rachel K.',
    role: 'VP Sales',
    company: 'Summit Finance',
    initials: 'RK',
    avatarColor: '#3B82F6',
  },
  {
    quote:
      'Calls used to hit voicemail while my crew was on jobs. Now every caller gets answered and booked before our competitors even pick up.',
    name: 'Miguel A.',
    role: 'Owner',
    company: 'Cascade Plumbing Co.',
    initials: 'MA',
    avatarColor: '#3859a8',
  },
  {
    quote:
      'Our front desk finally focuses on the patients standing in front of them. The AI quietly handles everything else in the background.',
    name: 'Priya N.',
    role: 'Operations Lead',
    company: 'Lakeside Dental',
    initials: 'PN',
    avatarColor: '#2a4688',
  },
  {
    quote:
      'After-hours intake was our biggest leak. Now potential clients get a real conversation at 11pm and we review qualified leads over coffee.',
    name: 'Daniel W.',
    role: 'Managing Partner',
    company: 'Whitfield Law',
    initials: 'DW',
    avatarColor: '#3B82F6',
  },
  {
    quote:
      'Follow-ups happen the minute a lead comes in, not the next morning. Our response time went from hours to seconds.',
    name: 'Amanda C.',
    role: 'General Manager',
    company: 'Harbor Auto Group',
    initials: 'AC',
    avatarColor: '#3859a8',
  },
  {
    quote:
      'Members book, reschedule, and ask questions by text any time of day. It feels like we tripled our front desk without hiring anyone.',
    name: 'Tom B.',
    role: 'Owner',
    company: 'Ridgeline Fitness',
    initials: 'TB',
    avatarColor: '#2a4688',
  },
]

const ROW_ONE = TESTIMONIALS.slice(0, 4)
const ROW_TWO = TESTIMONIALS.slice(4)

export function Testimonials() {
  return (
    <section className="py-24 bg-[#F4F6FB] overflow-hidden">
      {/* Heading */}
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-14">
          <p className="badge mx-auto mb-4 w-fit">Testimonials</p>
          <h2
            className="text-[clamp(1.9rem,3.5vw,2.75rem)] font-extrabold tracking-[-0.04em] text-text"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            What our{' '}
            <span className="text-gradient">clients say</span>
          </h2>
        </AnimatedSection>
      </div>

      {/* Dual-direction marquee — pauses on hover so cards stay readable */}
      <AnimatedSection>
        <div className="flex flex-col gap-5">
          <MarqueeRow items={ROW_ONE} />
          <MarqueeRow items={ROW_TWO} reverse />
        </div>
      </AnimatedSection>
    </section>
  )
}

function MarqueeRow({ items, reverse = false }) {
  // Two copies of the row enable a seamless loop. The track auto-scrolls by
  // animating translateX (so it always moves regardless of screen width) and
  // is draggable by cursor AND touch via pointer events. touch-action:pan-y
  // lets vertical swipes scroll the PAGE while horizontal swipes drag the row.
  const doubled = [...items, ...items]
  const trackRef = useRef(null)
  const reduced = useReducedMotion()
  const st = useRef({ offset: 0, half: 0, paused: false, dragging: false, startX: 0, startOffset: 0, raf: 0 })

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const s = st.current
    const dir = reverse ? 1 : -1
    const speed = 0.5

    const measure = () => { s.half = track.scrollWidth / 2 }
    measure()
    s.offset = reverse ? -s.half : 0
    track.style.transform = `translate3d(${s.offset}px,0,0)`

    const onResize = () => measure()
    window.addEventListener('resize', onResize)

    if (reduced) {
      return () => window.removeEventListener('resize', onResize)
    }

    const tick = () => {
      if (!s.dragging && !s.paused && s.half > 0) {
        s.offset += dir * speed
        if (s.offset <= -s.half) s.offset += s.half
        else if (s.offset >= 0) s.offset -= s.half
        track.style.transform = `translate3d(${s.offset}px,0,0)`
      }
      s.raf = requestAnimationFrame(tick)
    }
    s.raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(s.raf)
      window.removeEventListener('resize', onResize)
    }
  }, [reverse, reduced])

  const applyOffset = (o) => {
    const s = st.current
    if (s.half > 0) {
      while (o <= -s.half) o += s.half
      while (o > 0) o -= s.half
    }
    s.offset = o
    if (trackRef.current) trackRef.current.style.transform = `translate3d(${o}px,0,0)`
  }

  const onPointerDown = (e) => {
    const s = st.current
    s.dragging = true
    s.paused = true
    s.startX = e.clientX
    s.startOffset = s.offset
    if (e.pointerType !== 'touch') e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e) => {
    const s = st.current
    if (!s.dragging) return
    applyOffset(s.startOffset + (e.clientX - s.startX))
  }
  const endDrag = () => {
    const s = st.current
    s.dragging = false
    s.paused = false
  }

  return (
    <div
      className="overflow-hidden select-none cursor-grab active:cursor-grabbing py-2"
      style={{
        touchAction: 'pan-y',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 7%, black 93%, transparent)',
        maskImage: 'linear-gradient(to right, transparent, black 7%, black 93%, transparent)',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
      onMouseEnter={() => { st.current.paused = true }}
      onMouseLeave={() => { if (!st.current.dragging) st.current.paused = false }}
    >
      <div ref={trackRef} className="flex w-max items-stretch gap-5" style={{ willChange: 'transform' }}>
        {doubled.map((t, i) => (
          <TiltCard
            key={`${t.name}-${i}`}
            className="w-[320px] sm:w-[380px] shrink-0 rounded-[20px]"
            aria-hidden={i >= items.length ? 'true' : undefined}
          >
            <TestimonialCard testimonial={t} />
          </TiltCard>
        ))}
      </div>
    </div>
  )
}

function TestimonialCard({ testimonial }) {
  const { quote, name, role, company, initials, avatarColor } = testimonial

  return (
    <div
      className="card-premium flex flex-col gap-5 h-full"
      style={{ padding: '28px 28px 24px' }}
    >
      {/* Decorative quote mark */}
      <div
        aria-hidden="true"
        className="font-extrabold leading-none select-none"
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: 72,
          lineHeight: 0.7,
          background: 'linear-gradient(135deg, rgba(56, 89, 168,0.14), rgba(59, 130, 246,0.08))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.03em',
        }}
      >
        &ldquo;
      </div>

      {/* Quote */}
      <SerifAccent
        as="blockquote"
        className="flex-1 text-[15px] text-text leading-[1.7]"
        weight={400}
      >
        {quote}
      </SerifAccent>

      {/* Divider */}
      <div className="gradient-divider" />

      {/* Author */}
      <div className="flex items-center gap-3 pt-1">
        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
          style={{
            background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}cc)`,
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.02em',
          }}
        >
          {initials}
        </div>

        <div>
          <p
            className="text-[13px] font-semibold text-text leading-none tracking-[-0.01em]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {name}
          </p>
          <p
            className="text-[12px] text-text-secondary mt-1 leading-none"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            {role}, {company}
          </p>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Scissors, TrendingUp, HeartPulse, Wrench, Scale,
  ClipboardCheck, Home, UtensilsCrossed, Store,
  Sparkles, ArrowRight, Check,
} from 'lucide-react'
import Link from 'next/link'
import { CountUp } from '@/components/ui/CountUp'

const BRAND = '#3859a8'

const INDUSTRIES = [
  {
    slug: 'beauty-spa',
    name: 'Beauty & Spa',
    icon: Scissors,
    tagline: 'Fill every chair. Turn missed calls into booked appointments.',
    stat: { value: 60, suffix: '%', label: 'fewer no-shows' },
    useCases: [
      { title: 'Appointment booking', detail: 'Clients book and reschedule by phone or text, any hour.' },
      { title: 'No-show reminders', detail: 'Confirmation texts that keep chairs full and waitlists moving.' },
      { title: 'Rebooking outreach', detail: 'Bring regulars back when their next visit is due.' },
    ],
    products: ['Receptionist', 'Messenger', 'Outreach'],
    quote: {
      text: 'I used to lose bookings every time I had my hands in foils. Now the calendar fills itself while I work.',
      author: 'Dana Whitfield',
      role: 'Owner, Willow & Sage Salon',
    },
  },
  {
    slug: 'finance-insurance',
    name: 'Finance & Insurance',
    icon: TrendingUp,
    tagline: 'Pre-qualify prospects. Book meetings that actually happen.',
    stat: { value: 70, suffix: '%', label: 'fewer missed appointments' },
    useCases: [
      { title: 'Prospect qualification', detail: 'Filter out tire-kickers before they reach an advisor.' },
      { title: 'Calendar booking', detail: 'Auto-sync meetings to advisor calendars.' },
      { title: 'Compliant follow-up', detail: 'TCPA-compliant SMS with built-in opt-in management.' },
    ],
    products: ['Receptionist', 'Outreach', 'Space'],
    quote: {
      text: 'Compliance was our nightmare. JotilLabs handles opt-ins and recordkeeping out of the box.',
      author: 'Vanessa Brooks',
      role: 'Founder, Brooks Wealth Advisors',
    },
  },
  {
    slug: 'health-wellness',
    name: 'Health & Wellness',
    icon: HeartPulse,
    tagline: 'Fewer no-shows, more booked appointments, happier patients.',
    stat: { value: 70, suffix: '%', label: 'reduction in no-shows' },
    useCases: [
      { title: 'Appointment booking', detail: 'Patients schedule and reschedule themselves any hour.' },
      { title: 'Smart reminders', detail: 'Personalized SMS reminders that bring patients back.' },
      { title: 'After-hours coverage', detail: 'Triage urgent calls when the front desk is closed.' },
    ],
    products: ['Receptionist', 'Messenger', 'Outreach'],
    quote: {
      text: 'Our no-show rate dropped by two-thirds. That alone paid for the whole platform in the first month.',
      author: 'Dr. Adrian Kowalski',
      role: 'Lakeside Dental',
    },
  },
  {
    slug: 'home-services',
    name: 'Home Services',
    icon: Wrench,
    tagline: 'Book jobs after hours. Dispatch the right crew without lifting a phone.',
    stat: { value: 90, suffix: '%', label: 'after-hours bookings captured' },
    useCases: [
      { title: 'Emergency dispatch', detail: 'Triage urgency and route the right tech.' },
      { title: 'Quote capture', detail: 'Collect job details and photos on the first call.' },
      { title: 'Service reminders', detail: 'Automated yearly maintenance and renewal outreach.' },
    ],
    products: ['Receptionist', 'Messenger', 'Outreach'],
    quote: {
      text: 'After-hours calls now turn into Monday-morning jobs. We stopped losing weekend leads cold.',
      author: 'Mike Andersson',
      role: 'Owner, Andersson HVAC',
    },
  },
  {
    slug: 'legal',
    name: 'Legal',
    icon: Scale,
    tagline: 'Capture intakes the first time. Free your team for billable work.',
    stat: { value: 60, suffix: '%', label: 'of intakes handled without staff' },
    useCases: [
      { title: 'Intake automation', detail: 'Capture full case details on the first call.' },
      { title: 'Consultation booking', detail: 'Clients book consults without tying up the front desk.' },
      { title: 'Process FAQs', detail: 'Answer common procedural questions instantly.' },
    ],
    products: ['Receptionist', 'Messenger', 'Space'],
    quote: {
      text: 'We capture every intake now, even at 2 AM. Our paralegals get to focus on real legal work.',
      author: 'Helena Park',
      role: 'Managing Partner, Park & Vasquez',
    },
  },
  {
    slug: 'personal-secretary',
    name: 'Personal Secretary',
    icon: ClipboardCheck,
    tagline: 'Your own secretary. Answering, scheduling, and following up while you work.',
    stat: { value: 10, suffix: '+ hrs', label: 'of admin time back weekly' },
    useCases: [
      { title: 'Call answering', detail: 'Every call picked up in your name while you are with clients.' },
      { title: 'Calendar booking', detail: 'Meetings land on your live calendar without interruptions.' },
      { title: 'Follow-up on autopilot', detail: 'Check-ins and reminders go out on time, every time.' },
    ],
    products: ['Receptionist', 'Messenger', 'Outreach'],
    quote: {
      text: 'It runs my day like a full-time assistant. Calls answered, meetings booked, follow-ups sent, and I never touched my phone.',
      author: 'Rachel Odom',
      role: 'Realtor, Odom Homes',
    },
  },
  {
    slug: 'real-estate',
    name: 'Real Estate',
    icon: Home,
    tagline: 'Qualify leads instantly. Book tours without back-and-forth.',
    stat: { value: 3, suffix: 'x', label: 'more qualified leads per agent' },
    useCases: [
      { title: 'Lead qualification', detail: 'Score and route every inbound buyer before agents touch them.' },
      { title: 'Property questions', detail: 'Answer listing details 24/7, even on weekends.' },
      { title: 'Tour booking', detail: 'Buyers schedule tours that sync to your team calendar.' },
    ],
    products: ['Receptionist', 'Outreach', 'Messenger'],
    quote: {
      text: 'My agents spend their time closing, not screening. Every lead they get is already pre-qualified.',
      author: 'Tomás Rivera',
      role: 'Broker, Coastal Properties',
    },
  },
  {
    slug: 'restaurant',
    name: 'Restaurant',
    icon: UtensilsCrossed,
    tagline: 'Fill tables, capture every order, keep guests coming back.',
    stat: { value: 80, suffix: '%', label: 'fewer missed reservations' },
    useCases: [
      { title: 'Reservations', detail: 'Take bookings 24/7 by phone or text — no host needed.' },
      { title: 'Online orders', detail: 'Walk customers through the menu and confirm pickup.' },
      { title: 'Guest follow-up', detail: 'Send reminders and review requests after each visit.' },
    ],
    products: ['Receptionist', 'Messenger', 'Outreach'],
    quote: {
      text: 'We never miss a reservation now. Tuesdays I used to find 8-10 missed calls. Now those bookings just happen.',
      author: 'Marisa Chen',
      role: 'Owner, Casa Vista',
    },
  },
  {
    slug: 'small-business',
    name: 'Small Business',
    icon: Store,
    tagline: 'Every call answered, every booking captured, whatever business you run.',
    stat: { value: 3, suffix: 'x', label: 'more direct bookings' },
    useCases: [
      { title: 'Bookings & reservations', detail: 'Rooms, tours, and test drives booked by phone or text.' },
      { title: 'Customer questions', detail: 'Hours, pricing, and availability answered instantly.' },
      { title: 'Follow-up & reviews', detail: 'Automated review requests and comeback offers.' },
    ],
    products: ['Receptionist', 'Messenger', 'Outreach'],
    quote: {
      text: 'Peak season used to break us. Now the AI handles three calls at once and the desk team can be present.',
      author: 'Jordan Albright',
      role: 'GM, The Riverwalk Inn',
    },
  },
]

export function IndustryShowcase() {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = INDUSTRIES[activeIdx]
  const ActiveIcon = active.icon

  return (
    <div className="relative">
      {/* Tab pills */}
      <div className="relative mb-10">
        <div
          className="flex gap-2 overflow-x-auto pb-3 -mx-6 px-6 md:mx-0 md:px-0 md:flex-wrap md:justify-center"
          style={{ scrollbarWidth: 'none' }}
        >
          {INDUSTRIES.map((ind, i) => {
            const Icon = ind.icon
            const isActive = i === activeIdx
            return (
              <button
                key={ind.slug}
                onClick={() => setActiveIdx(i)}
                className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap"
                style={{
                  backgroundColor: isActive ? BRAND : 'rgba(56, 89, 168, 0.06)',
                  color: isActive ? '#fff' : BRAND,
                  boxShadow: isActive
                    ? '0 6px 20px rgba(56, 89, 168, 0.28), 0 2px 6px rgba(56, 89, 168, 0.15)'
                    : 'none',
                  border: isActive ? '1px solid transparent' : '1px solid rgba(56, 89, 168, 0.15)',
                  transition: 'background-color 0.3s, box-shadow 0.3s, color 0.3s, transform 0.2s',
                  transform: isActive ? 'translateY(-1px)' : 'translateY(0)',
                }}
              >
                <Icon size={16} strokeWidth={1.8} />
                {ind.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Active panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.slug}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="grid lg:grid-cols-5 gap-6"
        >
          {/* Left column: industry summary */}
          <div className="lg:col-span-2 relative rounded-[24px] overflow-hidden p-8 flex flex-col gap-6"
            style={{
              background: 'linear-gradient(160deg, rgba(56,89,168,0.04) 0%, rgba(56,89,168,0.10) 100%)',
              border: '1px solid rgba(56,89,168,0.15)',
            }}
          >
            {/* Decorative icon */}
            <div
              className="pointer-events-none absolute -top-8 -right-8 opacity-[0.06]"
              aria-hidden="true"
            >
              <ActiveIcon size={180} strokeWidth={1} color={BRAND} />
            </div>

            {/* Header */}
            <div className="relative flex items-center gap-3">
              <motion.div
                initial={{ scale: 0.85, rotate: -8 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(56,89,168,0.14), rgba(56,89,168,0.22))',
                  boxShadow: '0 4px 14px rgba(56,89,168,0.18)',
                }}
              >
                <ActiveIcon size={26} color={BRAND} strokeWidth={1.6} />
              </motion.div>
              <div className="min-w-0">
                <h3 className="text-2xl font-bold text-text leading-tight">{active.name}</h3>
                <p className="text-[13px] text-text-secondary mt-0.5">{active.tagline}</p>
              </div>
            </div>

            {/* Animated stat card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative rounded-2xl p-6"
              style={{
                background: 'linear-gradient(135deg, #ffffff, rgba(255,255,255,0.7))',
                border: '1px solid rgba(56,89,168,0.18)',
                boxShadow: '0 8px 24px rgba(56,89,168,0.10)',
              }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: BRAND }}>
                Measured impact
              </p>
              <p className="text-5xl font-extrabold leading-none mb-2" style={{ color: BRAND }}>
                <CountUp end={active.stat.value} suffix={active.stat.suffix} />
              </p>
              <p className="text-sm text-text-secondary leading-snug">{active.stat.label}</p>
            </motion.div>

            {/* Recommended products */}
            <div className="relative">
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-3">
                Recommended products
              </p>
              <div className="flex flex-wrap gap-2">
                {active.products.map((p, i) => (
                  <motion.span
                    key={p}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 + i * 0.06 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{
                      background: 'rgba(56,89,168,0.10)',
                      color: BRAND,
                      border: '1px solid rgba(56,89,168,0.22)',
                    }}
                  >
                    <Sparkles size={11} strokeWidth={2} />
                    Jotil{p}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: use cases */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">
                Common use cases
              </p>
              <Link
                href={`/use-cases/${active.slug}`}
                className="inline-flex items-center gap-1 text-xs font-semibold no-underline hover:gap-2 transition-all"
                style={{ color: BRAND }}
              >
                Deep dive
                <ArrowRight size={12} strokeWidth={2.2} />
              </Link>
            </div>

            {active.useCases.map((uc, i) => (
              <motion.div
                key={uc.title}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.1 + i * 0.08, ease: 'easeOut' }}
                className="group relative rounded-2xl bg-white p-5 cursor-default"
                style={{
                  border: '1px solid rgba(15,17,41,0.06)',
                  boxShadow: '0 1px 2px rgba(15,17,41,0.04)',
                  transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s',
                }}
                whileHover={{
                  y: -2,
                  boxShadow: '0 12px 32px rgba(56,89,168,0.10), 0 4px 10px rgba(56,89,168,0.06)',
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm"
                    style={{
                      background: 'linear-gradient(135deg, rgba(56,89,168,0.10), rgba(56,89,168,0.18))',
                      color: BRAND,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-text text-[15px]">{uc.title}</h4>
                      <Check
                        size={14}
                        strokeWidth={2.5}
                        className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">{uc.detail}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Connect CTA */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl p-5 mt-1 flex items-center gap-4"
              style={{
                background: 'linear-gradient(135deg, rgba(56,89,168,0.06), rgba(56,89,168,0.02))',
                border: '1px solid rgba(56,89,168,0.12)',
              }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text">See it on a {active.name.toLowerCase()} call.</p>
                <p className="text-xs text-text-secondary mt-0.5">15-minute live demo. No commitment.</p>
              </div>
              <Link
                href="/contact"
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white no-underline transition-all hover:gap-2.5 hover:shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${BRAND}, #2a4688)`,
                  boxShadow: `0 4px 12px rgba(56,89,168,0.30)`,
                }}
              >
                Book demo
                <ArrowRight size={12} strokeWidth={2.2} />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export const SHOWCASED_INDUSTRIES = INDUSTRIES

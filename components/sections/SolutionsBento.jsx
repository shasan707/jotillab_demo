'use client'

import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Phone, MessageCircle, TrendingUp, LayoutGrid, GitBranch, UserCircle, Check } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Spotlight, useSpotlight } from '@/components/design/Spotlight'
import { TiltCard } from '@/components/design'

/* Asymmetric bento overview of all six solutions. Outcome-led copy,
   one large "anchor" tile (Receptionist) with a live micro-visual,
   one wide tile (Messenger) with typing dots, four compact tiles,
   and a navy CTA tile closing the grid. */

const TILES = [
  {
    slug: 'receptionist',
    icon: Phone,
    color: '#3859a8',
    title: 'Every call answered',
    copy: 'Your phone gets picked up on the first ring, around the clock. Callers get booked, routed, or helped before voicemail ever happens.',
    size: 'large',
  },
  {
    slug: 'messenger',
    icon: MessageCircle,
    color: '#3B82F6',
    title: 'Every chat handled',
    copy: 'Website, text, and social messages all answered in one place, in seconds.',
    size: 'wide',
  },
  {
    slug: 'outreach',
    icon: TrendingUp,
    color: '#3B82F6',
    title: 'Leads followed up',
    copy: 'New inquiries get a response in seconds, not the next morning.',
    size: 'small',
  },
  {
    slug: 'space',
    icon: LayoutGrid,
    color: '#3859a8',
    title: 'Everything in one view',
    copy: 'Every conversation and customer in a single workspace your team shares.',
    size: 'small',
  },
  {
    slug: 'flow',
    icon: GitBranch,
    color: '#3B82F6',
    title: 'Busywork automated',
    copy: 'Reminders, confirmations, and updates happen on their own.',
    size: 'small',
  },
  {
    slug: 'avatar',
    icon: UserCircle,
    color: '#3B82F6',
    title: 'A face for your brand',
    copy: 'A lifelike guide that greets visitors and walks them to the right place.',
    size: 'small',
  },
]

export function SolutionsBento() {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <AnimatedSection className="text-center mb-14 max-w-2xl mx-auto">
          <p className="badge mx-auto mb-4 w-fit">Solutions</p>
          <h2
            className="headline-shadow text-[clamp(2.05rem,4vw,3.1rem)] font-extrabold tracking-[-0.045em] text-text mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Six ways to{' '}
            <em
              className="text-gradient not-italic"
              style={{ fontFamily: 'var(--font-fraunces), Georgia, serif', fontStyle: 'italic', fontWeight: 560, letterSpacing: 'normal', padding: '0 0.12em' }}
            >
              never miss
            </em>{' '}
            a customer
          </h2>
          <p
            className="text-base text-text-secondary leading-relaxed"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            Start with the one that hurts most. Add the rest when you are ready.
            They all work together.
          </p>
        </AnimatedSection>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(150px,auto)]">
          {TILES.map((tile, i) => (
            <AnimatedSection
              key={tile.slug}
              delay={i * 0.06}
              className={
                tile.size === 'large'
                  ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2'
                  : tile.size === 'wide'
                    ? 'sm:col-span-2 lg:col-span-2'
                    : ''
              }
            >
              <BentoTile tile={tile} />
            </AnimatedSection>
          ))}

          {/* CTA tile */}
          <AnimatedSection delay={0.36} className="sm:col-span-2 lg:col-span-2">
            <CtaTile />
          </AnimatedSection>
        </div>

      </div>
    </section>
  )
}

function BentoTile({ tile }) {
  const { slug, icon: Icon, color, title, copy, size } = tile
  const spot = useSpotlight()

  return (
    <TiltCard maxTilt={4} className="h-full rounded-[20px]">
      <Link
        href={`/products/${slug}`}
        className="card-premium btn-shine group relative flex h-full flex-col overflow-hidden no-underline"
        style={{ padding: size === 'large' ? '32px' : '24px' }}
        {...spot}
      >
        <Spotlight color={`${color}40`} size={size === 'large' ? 460 : 320} />

      {/* Static color wash in the tile's hue (lightweight — no repaint loop) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${color}16, transparent 45%, ${color}10 85%)`,
          opacity: 0.8,
        }}
      />

      {/* Icon + hover arrow */}
      <div className="relative flex items-start justify-between mb-4">
        <span
          className="w-11 h-11 rounded-[12px] flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${color}26, ${color}0a)`,
            border: `1px solid ${color}2b`,
          }}
        >
          <Icon size={20} strokeWidth={1.75} style={{ color }} />
        </span>
        <span
          className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 -translate-y-1 translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0"
          style={{ background: 'rgba(15,17,41,0.05)' }}
          aria-hidden="true"
        >
          <ArrowUpRight size={14} strokeWidth={2} className="text-text" />
        </span>
      </div>

      <h3
        className="font-bold text-text tracking-[-0.025em] mb-2"
        style={{ fontFamily: 'var(--font-display)', fontSize: size === 'large' ? '1.45rem' : '1.05rem' }}
      >
        {title}
      </h3>
      <p
        className="text-sm text-text-secondary leading-relaxed m-0"
        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
      >
        {copy}
      </p>

      {/* Micro-visuals */}
      {size === 'large' && (
        <div className="mt-auto pt-8">
          <div
            className="rounded-2xl p-4 flex items-center gap-3.5"
            style={{ background: 'rgba(56,89,168,0.05)', border: '1px solid rgba(56,89,168,0.10)' }}
          >
            <span className="relative w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #3859a8, #2a4688)' }}>
              <span className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(56,89,168,0.25)' }} />
              <Phone size={15} strokeWidth={1.75} color="#fff" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[12.5px] font-semibold text-text leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                Answering: Riverside Dental
              </span>
              <span className="mt-1.5 flex items-end gap-[2.5px] h-3.5" aria-hidden="true">
                {Array.from({ length: 14 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-[2.5px] rounded-full"
                    style={{
                      background: 'rgba(56,89,168,0.45)',
                      height: 4 + Math.abs(Math.sin(i * 0.9)) * 9,
                      animation: 'wave-bar 1s ease-in-out infinite',
                      animationDelay: `${i * 0.07}s`,
                      transformOrigin: 'bottom',
                    }}
                  />
                ))}
              </span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold shrink-0" style={{ background: 'rgba(22,163,74,0.10)', color: '#15803D', border: '1px solid rgba(22,163,74,0.18)' }}>
              <Check size={10} strokeWidth={2.5} />
              No hold time
            </span>
          </div>
        </div>
      )}

      {size === 'wide' && (
        <div className="mt-auto pt-5 flex items-center gap-2" aria-hidden="true">
          <span className="inline-flex items-center gap-[3px] rounded-full px-3 py-2" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.14)' }}>
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#3B82F6', animation: 'typing-dot 1.2s ease-in-out infinite', animationDelay: `${i * 0.18}s` }}
              />
            ))}
          </span>
          <span className="text-[11px] text-text-muted" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
            Replying to a website visitor
          </span>
        </div>
      )}
      </Link>
    </TiltCard>
  )
}

function CtaTile() {
  const spot = useSpotlight()

  return (
    <TiltCard maxTilt={4} className="h-full rounded-[20px]">
      <Link
        href="/products"
        className="group relative flex h-full min-h-[150px] flex-col justify-between overflow-hidden rounded-[20px] p-7 no-underline"
        style={{ background: 'linear-gradient(135deg, #3859a8 0%, #2a4688 55%, #22396E 100%)' }}
        {...spot}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full"
          style={{ width: 280, height: 280, right: '-15%', top: '-40%', background: 'radial-gradient(circle, rgba(59,130,246,0.45) 0%, transparent 70%)', filter: 'blur(50px)' }}
        />
        <Spotlight color="rgba(120,160,255,0.40)" size={420} blend="screen" />
        <p className="relative text-[15px] leading-relaxed max-w-[320px]" style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
          Not sure where to start? See how the pieces fit together.
        </p>
        <span className="relative inline-flex items-center gap-2 text-white font-semibold text-[15px]" style={{ fontFamily: 'var(--font-display)' }}>
          Explore all solutions
          <ArrowRight size={16} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </Link>
    </TiltCard>
  )
}

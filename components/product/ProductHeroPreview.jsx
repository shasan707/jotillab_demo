'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { TiltCard } from '@/components/design'
import {
  ReceptionistLogo,
  MessengerLogo,
  OutreachLogo,
  SpaceLogo,
  FlowLogo,
  AvatarLogo,
} from '@/components/ui/ProductLogos'

const LOGO_MAP = {
  receptionist: ReceptionistLogo,
  messenger: MessengerLogo,
  outreach: OutreachLogo,
  space: SpaceLogo,
  flow: FlowLogo,
  avatar: AvatarLogo,
}

/* Small animated audio waveform. Transform/opacity only, paused under
   reduced-motion. */
function Waveform({ color, active }) {
  return (
    <span className="flex items-end gap-[3px] h-4" aria-hidden="true">
      {Array.from({ length: 16 }).map((_, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full"
          style={{
            background: color,
            height: 5 + Math.abs(Math.sin(i * 0.9)) * 11,
            animation: active ? `wave-bar 1s ease-in-out ${i * 0.06}s infinite` : 'none',
            transformOrigin: 'bottom',
          }}
        />
      ))}
    </span>
  )
}

/**
 * Interactive, animated hero preview for product pages (replaces the old static
 * "Product demo coming soon" placeholder). Cursor-tilts on hover. For the Avatar
 * product it shows the live brand-ambassador image (Ken-Burns drift + speaking
 * glow + LIVE badge); for the others it shows the product mark inside expanding
 * signal rings. All motion is transform/opacity and inert under reduced-motion.
 */
export function ProductHeroPreview({ slug, productName }) {
  const reduced = useReducedMotion()
  const isAvatar = slug === 'avatar'
  const Logo = LOGO_MAP[slug]

  return (
    <TiltCard maxTilt={5} className="w-full max-w-md rounded-3xl">
      <div
        className="relative w-full aspect-[4/3] overflow-hidden rounded-3xl"
        style={{
          background: '#fff',
          border: '1px solid rgba(56,89,168,0.12)',
          boxShadow: '0 24px 60px rgba(56,89,168,0.14), 0 6px 18px rgba(0,0,0,0.05)',
        }}
      >
        {/* LIVE badge */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 shadow-sm backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            {!reduced && (
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60 animate-ping" />
            )}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          <span className="text-[11px] font-semibold tracking-wide text-text">LIVE</span>
        </div>

        {isAvatar ? (
          <>
            <motion.img
              src="/avatar-sarah.jpg"
              alt={`${productName} — live AI brand ambassador`}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: 'center 22%' }}
              animate={reduced ? undefined : { scale: [1, 1.06, 1] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              draggable={false}
            />
            {!reduced && (
              <motion.div
                aria-hidden="true"
                className="absolute inset-0"
                animate={{ opacity: [0, 0.18, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ background: 'radial-gradient(60% 40% at 50% 82%, rgba(56,89,168,0.55), transparent 70%)' }}
              />
            )}
            <div
              className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-3 px-4 py-3"
              style={{ background: 'linear-gradient(to top, rgba(15,17,41,0.80), transparent)' }}
            >
              <div>
                <p className="text-sm font-semibold leading-tight text-white">Sarah</p>
                <p className="text-[11px] text-white/70">AI Brand Ambassador</p>
              </div>
              <Waveform color="#cfe0ff" active={!reduced} />
            </div>
          </>
        ) : (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-5"
            style={{ background: 'linear-gradient(160deg, #f5f8fd, #e8eefb)' }}
          >
            <div className="relative flex items-center justify-center">
              {!reduced &&
                [0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    aria-hidden="true"
                    className="absolute rounded-full"
                    style={{ width: 116, height: 116, border: '1px solid rgba(56,89,168,0.28)' }}
                    animate={{ scale: [1, 1.85], opacity: [0.55, 0] }}
                    transition={{ duration: 2.6, delay: i * 0.85, repeat: Infinity, ease: 'easeOut' }}
                  />
                ))}
              <div
                className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white"
                style={{ boxShadow: '0 10px 30px rgba(56,89,168,0.18)' }}
              >
                {Logo && <Logo size={56} />}
              </div>
            </div>
            <p className="text-sm font-semibold text-text" style={{ fontFamily: 'var(--font-display)' }}>
              {productName}
            </p>
            <Waveform color="#3859a8" active={!reduced} />
          </div>
        )}
      </div>
    </TiltCard>
  )
}

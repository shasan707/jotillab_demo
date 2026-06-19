'use client'

import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Badge } from '@/components/ui/Badge'
import { HexContainer } from '@/components/ui/Logo'
import Logo from '@/components/ui/Logo'

/* ═══════════════════════════════════════════════════
   PRODUCT ICON EXPLORATION v4
   RULES:
   - All icons visible at rest (min opacity 0.3-0.55, never 0)
   - Unified brand blue: #3859a8, #8CA3CC, #2a4688
   - 10s heartbeat cycle (burst 0-10%, rest 10-100%)
   - Hex versions match original HTML exactly
═══════════════════════════════════════════════════ */

/* ── JOTIL LABS (parent brand) ── */
function JotilLabsLogo({ size = 80 }) {
  return <Logo size={size} />
}

/* ── RECEPTIONIST: Waveform bars ── */
function ReceptionistV1({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="4" y="16" width="5" height="8" rx="2.5" fill="#8CA3CC" className="vb vb1" />
      <rect x="11" y="10" width="5" height="20" rx="2.5" fill="#8CA3CC" className="vb vb2" />
      <rect x="18" y="6" width="5" height="28" rx="2.5" fill="#8CA3CC" className="vb vb3" />
      <rect x="25" y="12" width="5" height="16" rx="2.5" fill="#8CA3CC" className="vb vb4" />
      <rect x="32" y="14" width="5" height="12" rx="2.5" fill="#8CA3CC" className="vb vb5" />
    </svg>
  )
}

function ReceptionistV2({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="6" y="18" width="4" height="4" rx="2" fill="#8CA3CC" className="vb vb1" />
      <rect x="13" y="12" width="4" height="16" rx="2" fill="#8CA3CC" className="vb vb2" />
      <rect x="20" y="6" width="4" height="28" rx="2" fill="#8CA3CC" className="vb vb3" />
      <rect x="27" y="10" width="4" height="20" rx="2" fill="#8CA3CC" className="vb vb4" />
      <rect x="34" y="16" width="4" height="8" rx="2" fill="#8CA3CC" className="vb vb5" />
    </svg>
  )
}

function ReceptionistV3({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="3" y="17" width="3.5" height="6" rx="1.75" fill="#8CA3CC" className="vb vb1" />
      <rect x="9" y="12" width="3.5" height="16" rx="1.75" fill="#8CA3CC" className="vb vb2" />
      <rect x="15" y="7" width="4" height="26" rx="2" fill="#8CA3CC" className="vb vb3" />
      <rect x="21.5" y="9" width="3.5" height="22" rx="1.75" fill="#8CA3CC" className="vb vb4" />
      <rect x="27.5" y="13" width="3.5" height="14" rx="1.75" fill="#8CA3CC" className="vb vb5" />
      <rect x="33.5" y="17" width="3.5" height="6" rx="1.75" fill="#8CA3CC" className="vb vb6" />
    </svg>
  )
}

/* ── MESSENGER: Three FILLED dots (PICKED) ── */
function MessengerV2({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="10" cy="20" r="3.5" fill="#3859a8" className="md md1" />
      <circle cx="20" cy="20" r="3.5" fill="#3859a8" className="md md2" />
      <circle cx="30" cy="20" r="3.5" fill="#3859a8" className="md md3" />
    </svg>
  )
}

/* ── OUTREACH: Paper plane, ALWAYS visible, animates on burst ── */
function OutreachV1({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* Static base plane always visible */}
      <path d="M26 16L8 14l8 10-2 10z" fill="#3859a8" opacity="0.25" />
      {/* Animated planes that fly out */}
      <g className="pp pp1">
        <path d="M26 16L8 14l8 10-2 10z" fill="#3859a8" />
      </g>
      <g className="pp pp2">
        <path d="M26 16L8 14l8 10-2 10z" fill="#3859a8" />
      </g>
    </svg>
  )
}

/* ── SPACE: 4 shapes grid, each morphs/pulses in place (not carousel) ── */
function SpaceV1({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="12" cy="12" r="6" fill="#3859a8" className="sp sp1" />
      <rect x="22" y="6" width="12" height="12" rx="2" fill="#3859a8" className="sp sp2" />
      <polygon points="12,28 18,40 6,40" fill="#3859a8" className="sp sp3" />
      <polygon points="28,26 34,32 28,38 22,32" fill="#3859a8" className="sp sp4" />
    </svg>
  )
}

/* ── FLOW: Branching design from v2 (the one you approved) + 45deg rotation ── */
function FlowV3({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ transform: 'rotate(-45deg)' }}>
      {/* Input dot */}
      <circle cx="6" cy="20" r="4" fill="#3859a8" className="fl-src" />
      {/* Trunk line */}
      <path d="M10 20H18" stroke="#8CA3CC" strokeWidth="2" strokeLinecap="round" className="fl-line fl-b1" />
      {/* Three Q-curve branches splitting from junction */}
      <path d="M18 20Q22 20 26 12" stroke="#8CA3CC" strokeWidth="2" strokeLinecap="round" fill="none" className="fl-line fl-b2" />
      <path d="M18 20Q22 20 26 20" stroke="#8CA3CC" strokeWidth="2" strokeLinecap="round" fill="none" className="fl-line fl-b2" />
      <path d="M18 20Q22 20 26 28" stroke="#8CA3CC" strokeWidth="2" strokeLinecap="round" fill="none" className="fl-line fl-b3" />
      {/* Output dots */}
      <circle cx="30" cy="12" r="3" fill="#8CA3CC" className="fl-out fl-out1" />
      <circle cx="30" cy="20" r="3" fill="#3859a8" className="fl-out fl-out2" />
      <circle cx="30" cy="28" r="3" fill="#8CA3CC" className="fl-out fl-out3" />
    </svg>
  )
}

/* ── AVATAR variations ── */
function AvatarV1({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="18" r="17" stroke="#8CA3CC" strokeWidth="1" fill="none" className="av-ring av-ring1" />
      <circle cx="20" cy="18" r="12" stroke="#8CA3CC" strokeWidth="1.2" fill="none" className="av-ring av-ring2" />
      <circle cx="20" cy="16" r="6" fill="#3859a8" opacity="0.08" />
      <circle cx="18" cy="14.5" r="1.3" fill="#3859a8" />
      <circle cx="22" cy="14.5" r="1.3" fill="#3859a8" />
      <path d="M17 18.5Q20 21 23 18.5" stroke="#3859a8" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <path d="M11 32Q20 26 29 32" stroke="#8CA3CC" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function AvatarV2({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="14" r="8" fill="#3859a8" opacity="0.06" stroke="#3859a8" strokeWidth="1.2" />
      <circle cx="17.5" cy="12.5" r="1.3" fill="#3859a8" />
      <circle cx="22.5" cy="12.5" r="1.3" fill="#3859a8" />
      <path d="M17 17Q20 20 23 17" stroke="#3859a8" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <rect x="10" y="28" width="2.5" height="6" rx="1.25" fill="#8CA3CC" className="vb vb1" />
      <rect x="15" y="26" width="2.5" height="10" rx="1.25" fill="#8CA3CC" className="vb vb2" />
      <rect x="20" y="25" width="2.5" height="12" rx="1.25" fill="#8CA3CC" className="vb vb3" />
      <rect x="25" y="27" width="2.5" height="8" rx="1.25" fill="#8CA3CC" className="vb vb4" />
      <rect x="30" y="29" width="2.5" height="4" rx="1.25" fill="#8CA3CC" className="vb vb5" />
    </svg>
  )
}

function AvatarV3({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="30" r="8" fill="#3859a8" opacity="0.08" stroke="#8CA3CC" strokeWidth="1.5" className="hb hb1" />
      <circle cx="20" cy="19" r="5" fill="#3859a8" opacity="0.1" stroke="#8CA3CC" strokeWidth="1.5" className="hb hb2" />
      <circle cx="20" cy="10" r="6" fill="#3859a8" opacity="0.06" stroke="#3859a8" strokeWidth="1.5" className="hb hb3" />
      <circle cx="18" cy="9" r="1" fill="#3859a8" />
      <circle cx="22" cy="9" r="1" fill="#3859a8" />
      <path d="M18 12Q20 14 22 12" stroke="#3859a8" strokeWidth="1" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function AvatarV4({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="4" y="6" width="32" height="22" rx="4" stroke="#8CA3CC" strokeWidth="1.5" fill="#3859a8" opacity="0.04" />
      <circle cx="20" cy="14" r="5" fill="#3859a8" opacity="0.08" stroke="#3859a8" strokeWidth="1" />
      <circle cx="18.5" cy="13" r="1" fill="#3859a8" />
      <circle cx="21.5" cy="13" r="1" fill="#3859a8" />
      <path d="M18 16.5Q20 18.5 22 16.5" stroke="#3859a8" strokeWidth="1" strokeLinecap="round" fill="none" />
      <circle cx="32" cy="10" r="2" fill="#2a4688" className="av-live" />
      <rect x="12" y="32" width="16" height="3" rx="1.5" fill="#8CA3CC" opacity="0.3" />
    </svg>
  )
}

/* ── HEX VERSIONS ── */
function HexJotilLabs({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="220 130 320 280">
      <HexContainer />
      <g className="hb hb1" fill="#3859a8"><path d="M424.23 202.37 c-2.05 -1.83 -2.42 -2.64 -2.42 -5.42 0 -4.18 2.05 -7.11 5.94 -8.50 2.57 -0.88 3.22 -0.88 5.57 0.22 3.37 1.61 5.35 5.42 4.62 9.02 -1.25 6.60 -8.80 9.09 -13.71 4.69z" /></g>
      <g className="hb hb2" fill="#3859a8"><path d="M453.70 193.35 c-4.54 -2.35 -6.60 -5.64 -6.60 -10.63 0 -7.48 3.52 -11.29 11.73 -12.75 10.70 -1.83 17.22 11.80 9.82 20.60 -3.81 4.47 -9.53 5.50 -14.95 2.79z" /></g>
      <g className="hb hb3" fill="#3859a8"><path d="M491.08 180.60 c-6.16 -2.64 -9.53 -8.06 -9.53 -15.32 0 -10.41 7.33 -17.88 17.44 -17.96 9.68 0 16.27 6.67 16.27 16.49 0 7.18 -3.81 13.12 -10.41 16.56 -3.30 1.69 -10.11 1.83 -13.78 0.22z" /></g>
    </svg>
  )
}

function HexReceptionist({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="220 130 320 280">
      <HexContainer />
      <rect x="424.5" y="188" width="5" height="14" rx="2.5" fill="#8CA3CC" className="vb vb1" />
      <rect x="435.5" y="178" width="5" height="24" rx="2.5" fill="#8CA3CC" className="vb vb2" />
      <rect x="446.5" y="170" width="5" height="30" rx="2.5" fill="#8CA3CC" className="vb vb3" />
      <rect x="457.5" y="170" width="5" height="20" rx="2.5" fill="#8CA3CC" className="vb vb4" />
      <rect x="468.5" y="167" width="5" height="16" rx="2.5" fill="#8CA3CC" className="vb vb5" />
    </svg>
  )
}

function HexMessenger({ size = 80 }) {
  /* FILLED dots, not hollow. Same positions as parent brand but same shape = filled */
  return (
    <svg width={size} height={size} viewBox="220 130 320 280">
      <HexContainer />
      <g className="md md1" fill="#3859a8"><path d="M424.23 202.37 c-2.05 -1.83 -2.42 -2.64 -2.42 -5.42 0 -4.18 2.05 -7.11 5.94 -8.50 2.57 -0.88 3.22 -0.88 5.57 0.22 3.37 1.61 5.35 5.42 4.62 9.02 -1.25 6.60 -8.80 9.09 -13.71 4.69z" /></g>
      <g className="md md2" fill="#3859a8"><path d="M453.70 193.35 c-4.54 -2.35 -6.60 -5.64 -6.60 -10.63 0 -7.48 3.52 -11.29 11.73 -12.75 10.70 -1.83 17.22 11.80 9.82 20.60 -3.81 4.47 -9.53 5.50 -14.95 2.79z" /></g>
      <g className="md md3" fill="#3859a8"><path d="M491.08 180.60 c-6.16 -2.64 -9.53 -8.06 -9.53 -15.32 0 -10.41 7.33 -17.88 17.44 -17.96 9.68 0 16.27 6.67 16.27 16.49 0 7.18 -3.81 13.12 -10.41 16.56 -3.30 1.69 -10.11 1.83 -13.78 0.22z" /></g>
    </svg>
  )
}

function HexOutreach({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="220 130 320 280">
      <HexContainer />
      {/* Static base plane always visible */}
      <path d="M474 174 L450 171 L457 183 L450 195 Z" fill="#3859a8" opacity="0.25" />
      <g className="pp pp1" fill="#3859a8"><path d="M474 174 L450 171 L457 183 L450 195 Z" /></g>
      <g className="pp pp2" fill="#3859a8"><path d="M474 174 L450 171 L457 183 L450 195 Z" /></g>
      <g className="pp pp3" fill="#3859a8"><path d="M474 174 L450 171 L457 183 L450 195 Z" /></g>
    </svg>
  )
}

function HexSpace({ size = 80 }) {
  /* Carousel: one shape at a time (original behavior) */
  return (
    <svg width={size} height={size} viewBox="220 130 320 280">
      <HexContainer />
      <g className="cs cs-circle" opacity="0"><circle cx="458" cy="183" r="10" fill="#3859a8" /></g>
      <g className="cs cs-diamond" opacity="0"><polygon points="458,172 468,183 458,194 448,183" fill="#3859a8" /></g>
      <g className="cs cs-triangle" opacity="0"><polygon points="458,172 470,194 446,194" fill="#3859a8" /></g>
      <g className="cs cs-square" opacity="0"><rect x="448" y="173" width="20" height="20" rx="2" fill="#3859a8" /></g>
    </svg>
  )
}

function HexFlow({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="220 130 320 280">
      <HexContainer />
      {/* Branching design tilted ~25deg, pushed outside hex opening */}
      <g transform="rotate(-25, 460, 180) translate(15, -10)">
        <circle cx="425" cy="190" r="5" fill="#3859a8" className="fl-src" />
        <path d="M430 190H448" stroke="#8CA3CC" strokeWidth="3.5" strokeLinecap="round" className="fl-line fl-b1" />
        <path d="M448 190Q458 190 470 173" stroke="#8CA3CC" strokeWidth="3.5" strokeLinecap="round" fill="none" className="fl-line fl-b2" />
        <path d="M448 190Q458 190 472 190" stroke="#8CA3CC" strokeWidth="3.5" strokeLinecap="round" fill="none" className="fl-line fl-b2" />
        <path d="M448 190Q458 190 470 207" stroke="#8CA3CC" strokeWidth="3.5" strokeLinecap="round" fill="none" className="fl-line fl-b3" />
        <circle cx="474" cy="173" r="5" fill="#8CA3CC" className="fl-out fl-out1" />
        <circle cx="477" cy="190" r="5" fill="#3859a8" className="fl-out fl-out2" />
        <circle cx="474" cy="207" r="5" fill="#8CA3CC" className="fl-out fl-out3" />
      </g>
    </svg>
  )
}

function HexAvatar({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="220 130 320 280">
      <HexContainer />
      <circle cx="455" cy="175" r="12" stroke="#8CA3CC" strokeWidth="2" fill="#3859a8" opacity="0.06" className="av-ring av-ring2" />
      <circle cx="452" cy="173" r="2" fill="#3859a8" />
      <circle cx="458" cy="173" r="2" fill="#3859a8" />
      <path d="M451 178Q455 182 459 178" stroke="#3859a8" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M442 195Q455 188 468 195" stroke="#8CA3CC" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  )
}

/* ── DISPLAY ── */
function IconRow({ label, description, variants, hexComponent: HexComp, sizes = [16, 24, 32, 40, 64] }) {
  return (
    <div className="mb-16">
      <h3 className="text-xl font-bold text-text mb-1 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{label}</h3>
      {description && <p className="text-sm text-text-secondary mb-6">{description}</p>}
      {HexComp && (
        <div className="mb-8">
          <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-3">Hex Logo</p>
          <div className="flex items-end gap-6">
            {[100, 48].map(s => (
              <div key={s} className="flex flex-col items-center gap-2">
                <div className="flex items-center justify-center rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <HexComp size={s} />
                </div>
                <span className="text-[10px] text-text-secondary font-mono">{s}px</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="space-y-8">
        {variants.map(({ name, Component, picked }, vi) => (
          <div key={vi} className={picked ? 'rounded-2xl p-5 -mx-5' : ''} style={picked ? { background: 'rgba(56, 89, 168,0.04)', border: '1px solid rgba(56, 89, 168,0.1)' } : {}}>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">V{vi + 1}: {name}</p>
              {picked && <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">PICKED</span>}
            </div>
            <div className="flex items-end gap-6 flex-wrap">
              {sizes.map(s => (
                <div key={s} className="flex flex-col items-center gap-2">
                  <div className="flex items-center justify-center rounded-xl"
                    style={{ width: Math.max(s + 16, 40), height: Math.max(s + 16, 40), background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <Component size={s} />
                  </div>
                  <span className="text-[10px] text-text-secondary font-mono">{s}px</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── PAGE ── */
export default function IconExplorationPage() {
  return (
    <div className="min-h-screen bg-bg pt-28 pb-20">
      <style jsx global>{`
        /* ═══ Waveform bars (Receptionist) ═══ */
        .vb1 { animation: vbPulse 10s ease-in-out infinite 0s; }
        .vb2 { animation: vbPulse 10s ease-in-out infinite 0.1s; }
        .vb3 { animation: vbPulse 10s ease-in-out infinite 0.2s; }
        .vb4 { animation: vbPulse 10s ease-in-out infinite 0.3s; }
        .vb5 { animation: vbPulse 10s ease-in-out infinite 0.4s; }
        .vb6 { animation: vbPulse 10s ease-in-out infinite 0.5s; }
        @keyframes vbPulse {
          0%   { opacity: 0.55; fill: #8CA3CC; }
          3%   { opacity: 1;    fill: #2a4688; }
          5%   { opacity: 0.65; fill: #8CA3CC; }
          7%   { opacity: 1;    fill: #2a4688; }
          10%  { opacity: 0.55; fill: #8CA3CC; }
          100% { opacity: 0.55; fill: #8CA3CC; }
        }

        /* ═══ Messenger dots: filled, scale pulse ═══ */
        .md1 { animation: mdDot 10s ease-in-out infinite 0s; transform-box: fill-box; transform-origin: center; }
        .md2 { animation: mdDot 10s ease-in-out infinite 0.15s; transform-box: fill-box; transform-origin: center; }
        .md3 { animation: mdDot 10s ease-in-out infinite 0.3s; transform-box: fill-box; transform-origin: center; }
        @keyframes mdDot {
          0%   { transform: scale(1); opacity: 0.45; }
          3%   { transform: scale(1.3); opacity: 1; }
          5%   { transform: scale(1); opacity: 0.55; }
          7%   { transform: scale(1.2); opacity: 1; }
          10%  { transform: scale(1); opacity: 0.45; }
          100% { transform: scale(1); opacity: 0.45; }
        }

        /* ═══ Paper planes (Outreach): visible at rest ═══ */
        .pp1 { animation: ppFly 10s ease-in-out infinite 0s; transform-box: fill-box; transform-origin: center; }
        .pp2 { animation: ppFly 10s ease-in-out infinite 0.8s; transform-box: fill-box; transform-origin: center; }
        .pp3 { animation: ppFly 10s ease-in-out infinite 1.6s; transform-box: fill-box; transform-origin: center; }
        @keyframes ppFly {
          0%   { opacity: 0.3; transform: translate(0, 0) scale(1); }
          2%   { opacity: 1;   transform: translate(0, 0) scale(1.05); }
          5%   { opacity: 1;   transform: translate(5px, -4px) scale(1.05); }
          8%   { opacity: 0;   transform: translate(12px, -8px) scale(0.7); }
          12%  { opacity: 0.3; transform: translate(0, 0) scale(1); }
          100% { opacity: 0.3; transform: translate(0, 0) scale(1); }
        }

        /* ═══ Space shapes: all visible, pulse in sequence ═══ */
        .sp1 { animation: spPulse 10s ease-in-out infinite 0s; transform-box: fill-box; transform-origin: center; }
        .sp2 { animation: spPulse 10s ease-in-out infinite 2.5s; transform-box: fill-box; transform-origin: center; }
        .sp3 { animation: spPulse 10s ease-in-out infinite 5s; transform-box: fill-box; transform-origin: center; }
        .sp4 { animation: spPulse 10s ease-in-out infinite 7.5s; transform-box: fill-box; transform-origin: center; }
        @keyframes spPulse {
          0%   { opacity: 0.35; transform: scale(1); }
          3%   { opacity: 1;    transform: scale(1.15); }
          5%   { opacity: 0.8;  transform: scale(1.05); }
          8%   { opacity: 0.35; transform: scale(1); }
          100% { opacity: 0.35; transform: scale(1); }
        }

        /* ═══ Space hex: carousel (one at a time) ═══ */
        .cs-circle   { animation: csSlot1 16s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
        .cs-diamond  { animation: csSlot2 16s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
        .cs-triangle { animation: csSlot3 16s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
        .cs-square   { animation: csSlot4 16s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
        @keyframes csSlot1 {
          0%   { opacity: 0; transform: translate(-15px, 10px); }
          3%   { opacity: 1; transform: translate(0, 0); }
          20%  { opacity: 1; transform: translate(0, 0); }
          25%  { opacity: 0; transform: translate(15px, -10px); }
          100% { opacity: 0; }
        }
        @keyframes csSlot2 {
          0%   { opacity: 0; } 25%  { opacity: 0; transform: translate(-15px, 10px); }
          28%  { opacity: 1; transform: translate(0, 0); }
          45%  { opacity: 1; transform: translate(0, 0); }
          50%  { opacity: 0; transform: translate(15px, -10px); }
          100% { opacity: 0; }
        }
        @keyframes csSlot3 {
          0%   { opacity: 0; } 50%  { opacity: 0; transform: translate(-15px, 10px); }
          53%  { opacity: 1; transform: translate(0, 0); }
          70%  { opacity: 1; transform: translate(0, 0); }
          75%  { opacity: 0; transform: translate(15px, -10px); }
          100% { opacity: 0; }
        }
        @keyframes csSlot4 {
          0%   { opacity: 0; } 75%  { opacity: 0; transform: translate(-15px, 10px); }
          78%  { opacity: 1; transform: translate(0, 0); }
          95%  { opacity: 1; transform: translate(0, 0); }
          100% { opacity: 0; transform: translate(15px, -10px); }
        }

        /* ═══ Flow: lines pulse, dots light up sequentially ═══ */
        .fl-line { animation: flLine 10s ease-in-out infinite; }
        .fl-b1 { animation-delay: 0s; }
        .fl-b2 { animation-delay: 0.15s; }
        .fl-b3 { animation-delay: 0.3s; }
        @keyframes flLine {
          0%   { opacity: 0.3; stroke: #8CA3CC; }
          3%   { opacity: 1;   stroke: #2a4688; }
          5%   { opacity: 0.4; stroke: #8CA3CC; }
          7%   { opacity: 0.9; stroke: #2a4688; }
          10%  { opacity: 0.3; stroke: #8CA3CC; }
          100% { opacity: 0.3; stroke: #8CA3CC; }
        }
        .fl-src { animation: flSrc 10s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
        @keyframes flSrc {
          0%   { opacity: 0.6; transform: scale(1); }
          2%   { opacity: 1;   transform: scale(1.2); }
          4%   { opacity: 0.6; transform: scale(1); }
          100% { opacity: 0.6; transform: scale(1); }
        }
        /* Output dots: start dim, light up as data arrives */
        .fl-out { animation: flOut 10s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
        .fl-out1 { animation-delay: 0.3s; }
        .fl-out2 { animation-delay: 0.5s; }
        .fl-out3 { animation-delay: 0.7s; }
        @keyframes flOut {
          0%   { opacity: 0.25; fill: #8CA3CC; transform: scale(0.8); }
          4%   { opacity: 1;    fill: #2a4688; transform: scale(1.25); }
          7%   { opacity: 0.7;  fill: #3859a8; transform: scale(1); }
          10%  { opacity: 0.25; fill: #8CA3CC; transform: scale(0.8); }
          100% { opacity: 0.25; fill: #8CA3CC; transform: scale(0.8); }
        }
        /* Data packet travels along the middle branch */
        .fl-packet { animation: flPkt 10s ease-in-out infinite; }
        @keyframes flPkt {
          0%   { cx: 6;  cy: 20; opacity: 0; }
          1%   { cx: 6;  cy: 20; opacity: 1; }
          3%   { cx: 18; cy: 20; opacity: 1; }
          5%   { cx: 30; cy: 20; opacity: 0.8; }
          7%   { cx: 32; cy: 20; opacity: 0; }
          100% { opacity: 0; }
        }

        /* ═══ Heartbeat dots (Parent brand, Avatar V3) ═══ */
        .hb1 { animation: hbDot 10s ease-in-out infinite 0s; transform-box: fill-box; transform-origin: center; }
        .hb2 { animation: hbDot 10s ease-in-out infinite 0.15s; transform-box: fill-box; transform-origin: center; }
        .hb3 { animation: hbDot 10s ease-in-out infinite 0.3s; transform-box: fill-box; transform-origin: center; }
        @keyframes hbDot {
          0%   { transform: scale(1); opacity: 0.55; }
          3%   { transform: scale(1.3); opacity: 1; }
          5%   { transform: scale(1); opacity: 0.7; }
          7%   { transform: scale(1.2); opacity: 1; }
          10%  { transform: scale(1); opacity: 0.55; }
          100% { transform: scale(1); opacity: 0.55; }
        }

        /* ═══ Avatar rings ═══ */
        .av-ring1 { animation: avRing 10s ease-in-out infinite 0s; transform-box: fill-box; transform-origin: center; }
        .av-ring2 { animation: avRing 10s ease-in-out infinite 0.2s; transform-box: fill-box; transform-origin: center; }
        @keyframes avRing {
          0%   { opacity: 0.15; transform: scale(0.95); }
          3%   { opacity: 0.5;  transform: scale(1.05); }
          5%   { opacity: 0.25; transform: scale(0.98); }
          7%   { opacity: 0.4;  transform: scale(1.03); }
          10%  { opacity: 0.15; transform: scale(0.95); }
          100% { opacity: 0.15; transform: scale(0.95); }
        }
        .av-live { animation: avLive 2s ease-in-out infinite; }
        @keyframes avLive { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
      `}</style>

      <div className="max-w-6xl mx-auto px-6">
        <AnimatedSection>
          <Badge variant="blue" className="mb-4">Design Exploration v4</Badge>
          <h1 className="text-4xl font-extrabold text-text tracking-tight mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Product Icon Family
          </h1>
          <p className="text-text-secondary max-w-2xl">
            All icons always visible at rest. Animations burst briefly then rest.
            Brand blue only. Hex versions alongside accent-only versions.
          </p>
        </AnimatedSection>

        <div className="gradient-divider my-10" />

        <IconRow label="JotilLabs (Parent)" description="Ascending heartbeat dots. The parent brand identity." hexComponent={HexJotilLabs}
          variants={[{ name: 'Parent brand logo', Component: JotilLabsLogo, picked: true }]}
        />
        <div className="gradient-divider my-10" />

        <IconRow label="Receptionist" description="Voice waveform. vbPulse animation (color shift #8CA3CC to #2a4688)." hexComponent={HexReceptionist}
          variants={[
            { name: 'Symmetric 5-bar', Component: ReceptionistV1 },
            { name: 'Thin 5-bar', Component: ReceptionistV2 },
            { name: 'Asymmetric 6-bar', Component: ReceptionistV3 },
          ]}
        />
        <div className="gradient-divider my-10" />

        <IconRow label="Messenger" description="FILLED dots (not hollow). Heartbeat scale pulse." hexComponent={HexMessenger}
          variants={[{ name: 'Three filled dots', Component: MessengerV2, picked: true }]}
        />
        <div className="gradient-divider my-10" />

        <IconRow label="Outreach" description="Paper plane always visible at 30% opacity. Bursts with flight trajectory, returns to rest." hexComponent={HexOutreach}
          variants={[{ name: 'Paper plane (always visible, flight on burst)', Component: OutreachV1, picked: true }]}
        />
        <div className="gradient-divider my-10" />

        <IconRow label="Space" description="Accent-only: 4 shapes always visible, each pulses in sequence. Hex: carousel (one shape at a time, original behavior)." hexComponent={HexSpace}
          variants={[{ name: '4 shapes grid, sequential pulse', Component: SpaceV1, picked: true }]}
        />
        <div className="gradient-divider my-10" />

        <IconRow label="Flow" description="Horizontal branch layout, rotated 45deg. Data packet travels from source through junction to outputs. Outputs light up sequentially." hexComponent={HexFlow}
          variants={[{ name: 'Diagonal branch, data packet travels to outputs', Component: FlowV3, picked: true }]}
        />
        <div className="gradient-divider my-10" />

        <IconRow label="Avatar" description="Human-like AI presence. 4 options. None picked yet." hexComponent={HexAvatar}
          variants={[
            { name: 'Pulsing rings + face', Component: AvatarV1 },
            { name: 'Face + speaking waveform', Component: AvatarV2 },
            { name: 'Ascending circles with face (brand-style)', Component: AvatarV3 },
            { name: 'Video frame + face + live dot', Component: AvatarV4 },
          ]}
        />
      </div>
    </div>
  )
}

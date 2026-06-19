import { cn } from '@/lib/utils'
import { HexContainer } from './Logo'

const sizeMap = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 72,
}

function resolveSize(size) {
  return typeof size === 'number' ? size : sizeMap[size] || sizeMap.md
}

/**
 * Base wrapper for all product logos.
 * Renders the shared hex container + product-specific accent children.
 */
function ProductLogoBase({ size = 'md', className, children, label }) {
  const dimension = resolveSize(size)

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="220 130 320 280"
      width={dimension}
      height={dimension}
      className={cn('shrink-0', className)}
      aria-label={label}
      role="img"
    >
      <HexContainer />
      {children}
    </svg>
  )
}

/**
 * Receptionist logo — hex + 5 animated waveform bars.
 */
export function ReceptionistLogo({ size = 'md', className }) {
  return (
    <ProductLogoBase size={size} className={className} label="Jotil Receptionist logo">
      <rect
        x="424.5" y="188" width="5" height="14" rx="2.5"
        fill="#8CA3CC"
        style={{ animation: 'vbPulse 10s ease-in-out infinite 0s', transformBox: 'fill-box', transformOrigin: 'center' }}
      />
      <rect
        x="435.5" y="178" width="5" height="24" rx="2.5"
        fill="#8CA3CC"
        style={{ animation: 'vbPulse 10s ease-in-out infinite 0.1s', transformBox: 'fill-box', transformOrigin: 'center' }}
      />
      <rect
        x="446.5" y="170" width="5" height="30" rx="2.5"
        fill="#8CA3CC"
        style={{ animation: 'vbPulse 10s ease-in-out infinite 0.2s', transformBox: 'fill-box', transformOrigin: 'center' }}
      />
      <rect
        x="457.5" y="170" width="5" height="20" rx="2.5"
        fill="#8CA3CC"
        style={{ animation: 'vbPulse 10s ease-in-out infinite 0.3s', transformBox: 'fill-box', transformOrigin: 'center' }}
      />
      <rect
        x="468.5" y="167" width="5" height="16" rx="2.5"
        fill="#8CA3CC"
        style={{ animation: 'vbPulse 10s ease-in-out infinite 0.4s', transformBox: 'fill-box', transformOrigin: 'center' }}
      />
    </ProductLogoBase>
  )
}

/**
 * Messenger logo — hex + 3 outlined (hollow) dots with stroke animation.
 */
export function MessengerLogo({ size = 'md', className }) {
  return (
    <ProductLogoBase size={size} className={className} label="Jotil Messenger logo">
      <path
        d="M424.23 202.37 c-2.05 -1.83 -2.42 -2.64 -2.42 -5.42 0 -4.18 2.05 -7.11 5.94 -8.50 2.57 -0.88 3.22 -0.88 5.57 0.22 3.37 1.61 5.35 5.42 4.62 9.02 -1.25 6.60 -8.80 9.09 -13.71 4.69z"
        fill="none"
        stroke="#8CA3CC"
        strokeWidth="2"
        style={{
          animation: 'mdDot 10s ease-in-out infinite 0s',
          transformBox: 'fill-box',
          transformOrigin: 'center',
        }}
      />
      <path
        d="M453.70 193.35 c-4.54 -2.35 -6.60 -5.64 -6.60 -10.63 0 -7.48 3.52 -11.29 11.73 -12.75 10.70 -1.83 17.22 11.80 9.82 20.60 -3.81 4.47 -9.53 5.50 -14.95 2.79z"
        fill="none"
        stroke="#8CA3CC"
        strokeWidth="2"
        style={{
          animation: 'mdDot 10s ease-in-out infinite 0.15s',
          transformBox: 'fill-box',
          transformOrigin: 'center',
        }}
      />
      <path
        d="M491.08 180.60 c-6.16 -2.64 -9.53 -8.06 -9.53 -15.32 0 -10.41 7.33 -17.88 17.44 -17.96 9.68 0 16.27 6.67 16.27 16.49 0 7.18 -3.81 13.12 -10.41 16.56 -3.30 1.69 -10.11 1.83 -13.78 0.22z"
        fill="none"
        stroke="#8CA3CC"
        strokeWidth="2"
        style={{
          animation: 'mdDot 10s ease-in-out infinite 0.3s',
          transformBox: 'fill-box',
          transformOrigin: 'center',
        }}
      />
    </ProductLogoBase>
  )
}

/**
 * Outreach logo — hex + 3 paper planes that fly out.
 */
export function OutreachLogo({ size = 'md', className }) {
  return (
    <ProductLogoBase size={size} className={className} label="Jotil Outreach logo">
      <g
        fill="#3859a8"
        opacity="0"
        style={{
          animation: 'ppFly 10s ease-in-out infinite 0s',
          transformBox: 'fill-box',
          transformOrigin: 'center',
        }}
      >
        <path d="M474 174 L450 171 L457 183 L450 195 Z" />
      </g>
      <g
        fill="#3859a8"
        opacity="0"
        style={{
          animation: 'ppFly 10s ease-in-out infinite 0.8s',
          transformBox: 'fill-box',
          transformOrigin: 'center',
        }}
      >
        <path d="M474 174 L450 171 L457 183 L450 195 Z" />
      </g>
      <g
        fill="#3859a8"
        opacity="0"
        style={{
          animation: 'ppFly 10s ease-in-out infinite 1.6s',
          transformBox: 'fill-box',
          transformOrigin: 'center',
        }}
      >
        <path d="M474 174 L450 171 L457 183 L450 195 Z" />
      </g>
    </ProductLogoBase>
  )
}

/**
 * Space logo — hex + 4 shapes cycling in a carousel (circle, diamond, triangle, square).
 */
export function SpaceLogo({ size = 'md', className }) {
  return (
    <ProductLogoBase size={size} className={className} label="Jotil Space logo">
      {/* Circle */}
      <g
        opacity="0"
        style={{
          animation: 'csSlot1 16s ease-in-out infinite',
          transformBox: 'fill-box',
          transformOrigin: 'center',
        }}
      >
        <circle cx="458" cy="183" r="10" fill="#3859a8" />
      </g>

      {/* Diamond */}
      <g
        opacity="0"
        style={{
          animation: 'csSlot2 16s ease-in-out infinite',
          transformBox: 'fill-box',
          transformOrigin: 'center',
        }}
      >
        <rect
          x="449" y="174" width="18" height="18" rx="2"
          fill="#3859a8"
          transform="rotate(45 458 183)"
        />
      </g>

      {/* Triangle */}
      <g
        opacity="0"
        style={{
          animation: 'csSlot3 16s ease-in-out infinite',
          transformBox: 'fill-box',
          transformOrigin: 'center',
        }}
      >
        <polygon points="458,170 470,196 446,196" fill="#3859a8" />
      </g>

      {/* Square */}
      <g
        opacity="0"
        style={{
          animation: 'csSlot4 16s ease-in-out infinite',
          transformBox: 'fill-box',
          transformOrigin: 'center',
        }}
      >
        <rect x="447" y="172" width="22" height="22" rx="3" fill="#3859a8" />
      </g>
    </ProductLogoBase>
  )
}

/**
 * Flow logo — hex + 3 curved flow lines with animated dots.
 */
export function FlowLogo({ size = 'md', className }) {
  return (
    <ProductLogoBase size={size} className={className} label="Jotil Flow logo">
      {/* Flow lines */}
      <path
        d="M422 195 Q440 175 460 185"
        fill="none"
        stroke="#8CA3CC"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{
          animation: 'flPulse 10s ease-in-out infinite 0s',
          transformBox: 'fill-box',
          transformOrigin: 'center',
        }}
      />
      <path
        d="M432 185 Q452 165 472 175"
        fill="none"
        stroke="#8CA3CC"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{
          animation: 'flPulse 10s ease-in-out infinite 0.15s',
          transformBox: 'fill-box',
          transformOrigin: 'center',
        }}
      />
      <path
        d="M445 175 Q465 155 485 165"
        fill="none"
        stroke="#8CA3CC"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{
          animation: 'flPulse 10s ease-in-out infinite 0.3s',
          transformBox: 'fill-box',
          transformOrigin: 'center',
        }}
      />

      {/* Flow dots */}
      <circle
        cx="460" cy="185" r="3.5"
        fill="#8CA3CC"
        style={{
          animation: 'flDot 10s ease-in-out infinite 0s',
          transformBox: 'fill-box',
          transformOrigin: 'center',
        }}
      />
      <circle
        cx="472" cy="175" r="3.5"
        fill="#8CA3CC"
        style={{
          animation: 'flDot 10s ease-in-out infinite 0.15s',
          transformBox: 'fill-box',
          transformOrigin: 'center',
        }}
      />
      <circle
        cx="485" cy="165" r="3.5"
        fill="#8CA3CC"
        style={{
          animation: 'flDot 10s ease-in-out infinite 0.3s',
          transformBox: 'fill-box',
          transformOrigin: 'center',
        }}
      />
    </ProductLogoBase>
  )
}

/**
 * Avatar logo — hex + stylized face silhouette with animated glow.
 */
export function AvatarLogo({ size = 'md', className }) {
  return (
    <ProductLogoBase size={size} className={className} label="Jotil Avatar logo">
      {/* Face circle */}
      <circle
        cx="455" cy="170" r="12"
        fill="none"
        stroke="#8CA3CC"
        strokeWidth="2.5"
        style={{
          animation: 'hbDot 10s ease-in-out infinite 0s',
          transformBox: 'fill-box',
          transformOrigin: 'center',
        }}
      />
      {/* Eyes */}
      <circle cx="450" cy="167" r="2" fill="#3859a8"
        style={{ animation: 'flDot 10s ease-in-out infinite 0.1s', transformBox: 'fill-box', transformOrigin: 'center' }}
      />
      <circle cx="460" cy="167" r="2" fill="#3859a8"
        style={{ animation: 'flDot 10s ease-in-out infinite 0.2s', transformBox: 'fill-box', transformOrigin: 'center' }}
      />
      {/* Smile */}
      <path
        d="M449 174 Q455 179 461 174"
        fill="none"
        stroke="#3859a8"
        strokeWidth="1.8"
        strokeLinecap="round"
        style={{
          animation: 'flPulse 10s ease-in-out infinite 0.15s',
          transformBox: 'fill-box',
          transformOrigin: 'center',
        }}
      />
      {/* Body silhouette */}
      <path
        d="M440 190 Q455 183 470 190"
        fill="none"
        stroke="#8CA3CC"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{
          animation: 'flPulse 10s ease-in-out infinite 0.3s',
          transformBox: 'fill-box',
          transformOrigin: 'center',
        }}
      />
    </ProductLogoBase>
  )
}

/**
 * Atmospheric section divider - replaces the hard gradient-divider line.
 *
 * Fades one section's background color into the next, instead of a razor-thin
 * horizontal rule. Used between sections of different tones (e.g. light hero
 * wash -> warm cream testimonials -> dark CTA -> navy footer).
 *
 * Props:
 *  - from: CSS color (top of divider)
 *  - to:   CSS color (bottom of divider)
 *  - height: div height (default 80px)
 *  - direction: 'vertical' (default) | 'radial' (soft center highlight)
 *
 * @example
 * // Between a light section and the dark CTA:
 * <AtmosphericDivider from="#FAFBFD" to="#0f1129" height={120} />
 */
export function AtmosphericDivider({
  from = 'var(--color-bg)',
  to = 'var(--color-navy)',
  height = 80,
  direction = 'vertical',
  className = '',
}) {
  const bg =
    direction === 'radial'
      ? `radial-gradient(ellipse 80% 100% at 50% 100%, ${to} 0%, ${from} 80%)`
      : `linear-gradient(to bottom, ${from} 0%, ${to} 100%)`

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none w-full ${className}`}
      style={{ height, background: bg }}
    />
  )
}

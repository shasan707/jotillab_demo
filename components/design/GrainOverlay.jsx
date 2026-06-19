/**
 * SVG noise overlay layer.
 *
 * Renders a fractal-noise-filled SVG as an absolutely-positioned layer at low
 * opacity. Adds micro-texture to atmospheric sections (hero washes, dark CTAs,
 * testimonial cards) without taxing render.
 *
 * Pair with `opacity` appropriate to the surface:
 *  - dark surfaces: 0.05-0.08
 *  - light surfaces: 0.03-0.05
 *
 * The noise is a data-URL inline SVG - zero network cost, cached with the HTML.
 *
 * @example
 * <section className="relative bg-navy">
 *   <GrainOverlay tone="dark" />
 *   <div className="relative z-10">...</div>
 * </section>
 */
export function GrainOverlay({
  tone = 'light',
  opacity,
  blendMode,
  className = '',
}) {
  // Reasonable defaults per tone
  const resolvedOpacity = opacity ?? (tone === 'dark' ? 0.06 : 0.04)
  const resolvedBlend = blendMode ?? (tone === 'dark' ? 'overlay' : 'multiply')

  // Noise matrix: lightens for dark bgs, darkens for light bgs.
  // feColorMatrix coefficients pulled to white (1,1,1) for dark; pulled to navy for light.
  const matrix =
    tone === 'dark'
      ? '0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'
      : '0 0 0 0 0.2  0 0 0 0 0.2  0 0 0 0 0.4  0 0 0 0.6 0'

  const svg = `<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='${matrix}'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`
  const encoded = svg.replace(/#/g, '%23').replace(/"/g, "'")

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml;utf8,${encoded}")`,
        opacity: resolvedOpacity,
        mixBlendMode: resolvedBlend,
      }}
    />
  )
}

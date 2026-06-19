import { cn } from '@/lib/utils'

/**
 * Editorial serif accent.
 *
 * Use SPARINGLY: one emphasis word inside a hero H1, a pull-quote, section intros,
 * numerical displays. Never the whole heading - the contrast is what makes it work.
 *
 * Fraunces is a variable font; weight/opsz axes supported natively.
 *
 * @example
 * <h1>Meet every customer, <SerifAccent>beautifully.</SerifAccent></h1>
 * <SerifAccent as="blockquote" className="text-2xl">
 *   "Their AI answered every call that night."
 * </SerifAccent>
 */
export function SerifAccent({
  as: Tag = 'span',
  className,
  italic = true,
  weight = 500,
  children,
}) {
  return (
    <Tag
      className={cn('font-serif', italic && 'italic', className)}
      style={{ fontWeight: weight, fontOpticalSizing: 'auto' }}
    >
      {children}
    </Tag>
  )
}

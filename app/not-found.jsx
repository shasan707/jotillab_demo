import Link from 'next/link'

export const metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist or has been moved. Return to the JotilLabs homepage or contact us for help.',
}

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(56, 89, 168,0.06) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 text-center max-w-lg">
        <p
          className="text-gradient font-extrabold tracking-tight mb-4"
          style={{ fontSize: 'clamp(5rem, 12vw, 8rem)', lineHeight: 1, fontFamily: 'var(--font-display)' }}
        >
          404
        </p>
        <h1
          className="text-2xl sm:text-3xl font-bold text-text tracking-tight mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Page not found
        </h1>
        <p className="text-text-secondary mb-8 leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/"
            className="inline-flex items-center no-underline text-sm font-semibold text-white btn-gradient px-6 py-3 rounded-[11px] shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:-translate-y-0.5 transition-all duration-300"
          >
            Go Home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center no-underline text-sm font-semibold text-text px-6 py-3 rounded-[11px] transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.07)' }}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}

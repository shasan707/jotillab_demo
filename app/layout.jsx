import './globals.css'
import { Inter, JetBrains_Mono, Fraunces, Russo_One, Roboto } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { OrganizationJsonLd, WebsiteJsonLd } from '@/components/layout/JsonLd'
import { DeferredWidgets } from '@/components/layout/DeferredWidgets'
import { BrandBackgroundGate, SmoothScroll } from '@/components/design'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500'],
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: 'variable',
  axes: ['opsz'],
})

const russoOne = Russo_One({
  subsets: ['latin'],
  variable: '--font-russo',
  display: 'swap',
  weight: '400',
})

// The site's single display face: every heading and heading-styled element
// uses Roboto (--font-display / --font-sans both resolve to it), EXCEPT the
// hero headline (Russo One) and Fraunces serif accents. Mid weights are
// loaded because styled UI text uses medium/semibold, not just bold.
const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata = {
  title: {
    default: 'JotilLabs - AI Voice, Chat & Automation Platform',
    template: '%s | JotilLabs',
  },
  description:
    'JotilLabs builds AI systems that handle your calls, chats, leads, and workflows. Voice agents, chatbots, SMS automation, and CRM tools for modern businesses.',
  metadataBase: new URL('https://www.jotillabs.com'),
  keywords: [
    'AI voice agent',
    'AI chatbot',
    'business automation',
    'AI receptionist',
    'SMS automation',
    'JotilLabs',
    'AI CRM',
    'workflow automation',
  ],
  authors: [{ name: 'JotilLabs' }],
  creator: 'JotilLabs',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.jotillabs.com',
    siteName: 'JotilLabs',
    title: 'JotilLabs - AI Voice, Chat & Automation Platform',
    description:
      'AI systems that handle your calls, chats, leads, and workflows. Built for modern businesses.',
    images: [{ url: '/og', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JotilLabs - AI Voice, Chat & Automation Platform',
    description:
      'AI systems that handle your calls, chats, leads, and workflows.',
    images: ['/og'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.svg',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${fraunces.variable} ${russoOne.variable} ${roboto.variable}`}
    >
      <head>
        <OrganizationJsonLd />
        <WebsiteJsonLd />
        {/* Google Analytics 4 -- replace GA_MEASUREMENT_ID with your actual ID */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');`}
            </Script>
          </>
        )}
      </head>
      <body className="min-h-screen bg-bg text-text antialiased" suppressHydrationWarning>
        {/* Signature brand background — asymmetric blue blob bottom-left,
            grain masked to the blob, optional logo watermark on the right
            (homepage only). Fixed-positioned behind all content. Variant
            is route-aware: hero treatment on "/", quieter elsewhere. */}
        <SmoothScroll>
          <BrandBackgroundGate />
          <a href="#main-content" className="skip-to-main">
            Skip to main content
          </a>
          <Navbar />
          <main id="main-content" className="relative z-10">{children}</main>
          <Footer />
        </SmoothScroll>
        <DeferredWidgets />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

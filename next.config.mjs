/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      // Industry restructure (2026-07): old slugs -> new homes
      { source: '/use-cases/dental-medical', destination: '/use-cases/health-wellness', permanent: true },
      { source: '/use-cases/hospitality', destination: '/use-cases/small-business', permanent: true },
      { source: '/use-cases/ecommerce', destination: '/use-cases', permanent: true },
    ]
  },
}

export default nextConfig

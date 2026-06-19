import { brand } from '@/lib/brand'

export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.name,
    legalName: brand.legalName,
    url: brand.url,
    logo: `${brand.url}/favicon.svg`,
    description:
      'AI-powered business automation. Voice agents, chatbots, SMS automation, CRM, and workflow tools for modern businesses.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: brand.address.city,
      addressRegion: brand.address.stateCode,
      addressCountry: brand.address.country,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-358-900-0040',
      email: brand.email,
      contactType: 'sales',
    },
    sameAs: [
      brand.social.linkedin,
      brand.social.x,
    ],
    foundingDate: String(brand.founded),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function WebsiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: brand.name,
    url: brand.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${brand.url}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

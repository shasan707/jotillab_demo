export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin', '/studio'],
      },
    ],
    sitemap: 'https://jotillabs.com/sitemap.xml',
  }
}

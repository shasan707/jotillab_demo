import { test, expect } from '@playwright/test'

const routes = ['/', '/about', '/products', '/contact', '/terms']

for (const route of routes) {
  test(`visual snapshot ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'networkidle' })
    // Freeze animations to keep snapshots stable
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
        }
      `,
    })
    await page.waitForTimeout(300)
    await expect(page).toHaveScreenshot({ fullPage: true })
  })
}

test('favicon serves SVG', async ({ request }) => {
  const res = await request.get('/favicon.svg')
  expect(res.status()).toBe(200)
  expect(res.headers()['content-type']).toContain('svg')
})

test('og image generates PNG', async ({ request }) => {
  const res = await request.get('/og')
  expect(res.status()).toBe(200)
  expect(res.headers()['content-type']).toContain('image/png')
})

test('legal entity preserved on terms page body', async ({ page }) => {
  await page.goto('/terms', { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  const body = await page.locator('main').textContent()
  expect(body).toContain('Jotil Labs')
})

test('legal entity preserved on privacy page body', async ({ page }) => {
  await page.goto('/privacy', { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  const body = await page.locator('main').textContent()
  expect(body).toContain('Jotil Labs')
})

test('footer copyright reads Jotil Labs LLC', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  const footer = await page.locator('footer').textContent()
  expect(footer).toContain('Jotil Labs LLC')
  expect(footer).toContain('Automate. Empower. Scale.')
})

test('hero eyebrow shows tagline', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  const eyebrow = await page.locator('main').textContent()
  expect(eyebrow).toContain('Automate. Empower. Scale.')
})

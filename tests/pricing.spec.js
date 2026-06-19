import { test, expect } from '@playwright/test'

const tieredProducts = ['receptionist', 'messenger', 'outreach', 'space']
const contactOnlyProducts = ['flow', 'avatar']

for (const slug of tieredProducts) {
  test(`pricing ${slug} renders tiers + enterprise banner`, async ({ page }) => {
    await page.goto(`/products/${slug}/pricing`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(300)

    // Hero headline visible
    const hero = await page.locator('h1').first()
    await expect(hero).toBeVisible()

    // Enterprise section visible
    const enterpriseLabel = await page.getByText('Enterprise', { exact: false }).first()
    await expect(enterpriseLabel).toBeVisible()
  })

  test(`pricing ${slug} has Concierge Setup banner`, async ({ page }) => {
    await page.goto(`/products/${slug}/pricing`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(300)
    const setup = await page.getByText(/Concierge Setup/i).first()
    await expect(setup).toBeVisible()
  })
}

// Essentials tier: only exists for Messenger/Outreach/Space (not Receptionist)
for (const slug of ['messenger', 'outreach', 'space']) {
  test(`pricing ${slug} shows Essentials entry card`, async ({ page }) => {
    await page.goto(`/products/${slug}/pricing`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(300)
    const essentials = await page.getByText(/Essentials/i).first()
    await expect(essentials).toBeVisible()
  })
}

for (const slug of contactOnlyProducts) {
  test(`pricing ${slug} shows contact-only card + discovery CTA`, async ({ page }) => {
    await page.goto(`/products/${slug}/pricing`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(300)

    const cta = await page.getByRole('link', { name: /Book discovery call/i }).first()
    await expect(cta).toBeVisible()
  })

  test(`pricing ${slug} does NOT show monthly tier grid`, async ({ page }) => {
    await page.goto(`/products/${slug}/pricing`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(300)
    const body = await page.locator('main').textContent()
    // Contact-only pages should not mention Starter/Pro/Business tier names
    expect(body).not.toContain('Most Popular')
  })
}

test('Avatar page does NOT claim SOC 2', async ({ page }) => {
  await page.goto('/products/avatar', { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  const body = await page.locator('main').textContent()
  expect(body).not.toContain('SOC 2')
  expect(body).not.toContain('SOC2')
})

test('Avatar page does NOT claim Video Meeting Avatar', async ({ page }) => {
  await page.goto('/products/avatar', { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  const body = await page.locator('main').textContent()
  expect(body).not.toMatch(/Video Meeting Avatar/i)
})

test('Avatar page does NOT list Google Meet or Zoom integrations', async ({ page }) => {
  await page.goto('/products/avatar', { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  const body = await page.locator('main').textContent()
  expect(body).not.toContain('Google Meet')
  expect(body).not.toContain('Zoom')
})

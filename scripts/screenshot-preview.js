/* One-off preview screenshots of the redesigned homepage sections.
   Usage: node scripts/screenshot-preview.js */
const { chromium } = require('@playwright/test')

const OUT = 'screenshots'

async function main() {
  const fs = require('fs')
  fs.mkdirSync(OUT, { recursive: true })

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })

  // 1. Hero mid-demo: wait for the conversation to start typing
  await page.waitForTimeout(5000)
  await page.screenshot({ path: `${OUT}/1-hero-demo-typing.png` })

  // 2. Hero later in the loop: AI reply + (eventually) booked pill, plus a
  //    different cycling headline word
  await page.waitForTimeout(7000)
  await page.screenshot({ path: `${OUT}/2-hero-demo-reply.png` })

  // 3. HowItWorks: scroll there and let connectors draw + steps activate
  await page.locator('text=Up and running in').scrollIntoViewIfNeeded()
  await page.waitForTimeout(2200)
  await page.screenshot({ path: `${OUT}/3-how-it-works.png` })

  // 4. Testimonials marquee
  await page.locator('text=What our').scrollIntoViewIfNeeded()
  await page.waitForTimeout(1800)
  await page.screenshot({ path: `${OUT}/4-testimonials-marquee.png` })

  // 5. Booked state: go back to top and wait for a full demo loop to finish
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(14000)
  await page.screenshot({ path: `${OUT}/5-hero-booked.png` })

  await browser.close()
  console.log('done')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})

// node scripts/qa.mjs http://127.0.0.1:8787 — screenshot loop for the QA gate (see docs/UI-SPEC.md §11)
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const base = process.argv[2] ?? 'http://127.0.0.1:8787'
mkdirSync('qa', { recursive: true })
const browser = await chromium.launch()
const errors = []
const page = await browser.newPage()
page.on('console', (m) => { if (m.type() === 'error') errors.push(`${page.url()} → ${m.text()}`) })
page.on('pageerror', (e) => errors.push(`${page.url()} → ${e.message}`))

async function shot(name, width) {
  await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
  await page.waitForTimeout(500)
  await page.screenshot({ path: `qa/${name}-${width}.png`, fullPage: true })
}

// 1. populated console (latest stored sweep)
for (const w of [1440, 1024, 390]) { await page.goto(`${base}/`, { waitUntil: 'networkidle' }); await shot('console', w) }
const scroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
console.log('horizontal page scroll at 390:', scroll)

// 2. demo run: watch the grid fill, then open a red chip
await page.setViewportSize({ width: 1440, height: 900 })
await page.goto(`${base}/?demo=1`, { waitUntil: 'networkidle' })
await page.waitForTimeout(900)
await page.screenshot({ path: 'qa/demo-running-1440.png', fullPage: true })
await page.waitForSelector('text=/^Done:/', { timeout: 30000 })
await page.screenshot({ path: 'qa/demo-done-1440.png', fullPage: true })
const fakeChip = page.locator('button.chip-fake').first()
await fakeChip.click()
await page.waitForTimeout(600)
await page.screenshot({ path: 'qa/drawer-1440.png', fullPage: false })
await page.keyboard.press('Escape')
await page.waitForTimeout(400)

// 3. network view
await page.getByRole('button', { name: 'Scam network' }).first().click()
await page.waitForTimeout(1200)
await page.screenshot({ path: 'qa/network-1440.png', fullPage: false })

// 4. states + kit
for (const [name, url] of [['empty', '/?state=empty'], ['error', '/?state=error'], ['kit', '/_kit']]) {
  await page.goto(`${base}${url}`, { waitUntil: 'networkidle' })
  await shot(name, 1440)
}
await page.goto(`${base}/_kit`, { waitUntil: 'networkidle' }); await shot('kit', 390)

// 5. keyboard path: Tab to Sweep now → Enter, then Tab to a chip → Enter opens drawer → Esc closes
await page.goto(`${base}/`, { waitUntil: 'networkidle' })
const sweepBtn = page.getByRole('button', { name: /Sweep (now|again)/ })
await sweepBtn.focus(); await page.keyboard.press('Enter')
await page.waitForSelector('text=/^Done:/', { timeout: 30000 })
await page.locator('button.chip-fake').first().focus(); await page.keyboard.press('Enter')
await page.waitForSelector('[role="dialog"]')
await page.keyboard.press('Escape')
await page.waitForTimeout(900)
const dialogGone = (await page.locator('[role="dialog"]').count()) === 0
console.log('keyboard path ok:', dialogGone)

// 6. pack download works
const packLink = page.locator('a:has-text("Download takedown pack")')
const href = await packLink.getAttribute('href')
const res = await page.request.get(base + href)
console.log('pack download:', res.status(), res.headers()['content-type'])

console.log('console errors:', errors.length)
for (const e of errors) console.log('  ', e)
await browser.close()

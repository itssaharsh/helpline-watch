// node scripts/qa.mjs http://127.0.0.1:8787 — screenshot loop for the QA gate
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const base = process.argv[2] ?? 'http://127.0.0.1:8787'
mkdirSync('qa', { recursive: true })
const browser = await chromium.launch()
const errors = []
const page = await browser.newPage()
page.on('console', (m) => { if (m.type() === 'error') errors.push(`${page.url()} → ${m.text()}`) })
page.on('pageerror', (e) => errors.push(`${page.url()} → ${e.message}`))

async function shot(name, width, full = false) {
  await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
  await page.waitForTimeout(500)
  await page.screenshot({ path: `qa/${name}-${width}.png`, fullPage: full })
}

for (const w of [1440, 1024, 390]) { await page.goto(`${base}/`, { waitUntil: 'networkidle' }); await shot('console', w) }
const scroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
console.log('horizontal page scroll at 390:', scroll)

await page.setViewportSize({ width: 1440, height: 900 })
await page.goto(`${base}/?demo=1`, { waitUntil: 'networkidle' })
await page.waitForTimeout(900)
await page.screenshot({ path: 'qa/demo-running-1440.png' })
await page.getByRole('button', { name: 'Sweep again' }).waitFor({ timeout: 30000 })
await page.waitForTimeout(800)
await page.screenshot({ path: 'qa/demo-done-1440.png' })
await page.locator('button.mark-fake').first().click()
await page.waitForTimeout(600)
await page.screenshot({ path: 'qa/evidence-1440.png' })
await page.keyboard.press('Escape')
await page.waitForTimeout(300)
await page.locator('button', { hasText: 'Kolkata' }).first().click()
await page.waitForTimeout(500)
await page.screenshot({ path: 'qa/kolkata-1440.png' })
await page.getByRole('tab', { name: /Across brands/ }).click()
await page.waitForTimeout(2500)
await page.screenshot({ path: 'qa/network-1440.png' })
await page.getByRole('button', { name: 'Cities' }).click()
await page.waitForTimeout(400)
await page.screenshot({ path: 'qa/cities-1440.png' })
await page.keyboard.press('Escape')

for (const [name, url] of [['empty', '/?state=empty'], ['error', '/?state=error'], ['kit', '/_kit']]) {
  await page.goto(`${base}${url}`, { waitUntil: 'networkidle' })
  await shot(name, 1440, name === 'kit')
}
await page.goto(`${base}/_kit`, { waitUntil: 'networkidle' }); await shot('kit', 390, true)

// keyboard path: Tab to Sweep → Enter → ↓ selects a finding → Esc clears
await page.goto(`${base}/`, { waitUntil: 'networkidle' })
await page.getByRole('button', { name: /Sweep/ }).last().focus(); await page.keyboard.press('Enter')
await page.getByRole('button', { name: 'Sweep again' }).waitFor({ timeout: 30000 })
await page.keyboard.press('ArrowDown')
await page.waitForTimeout(300)
const selectedAfterArrow = await page.locator('[role="option"][aria-selected="true"]').count()
await page.keyboard.press('Escape')
await page.waitForTimeout(300)
const cleared = (await page.locator('[role="option"][aria-selected="true"]').count()) === 0
console.log('keyboard path ok:', selectedAfterArrow === 1 && cleared)

const href = await page.locator('a:has-text("Download takedown pack")').getAttribute('href')
const res = await page.request.get(base + href)
console.log('pack download:', res.status(), res.headers()['content-type'])
console.log('console errors:', errors.length)
for (const e of errors) console.log('  ', e)
await browser.close()

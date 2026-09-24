// Renders the two globe framings once (WebGL on) as PNG fallbacks for machines without WebGL.
import { chromium } from 'playwright'
const base = process.argv[2] ?? 'http://127.0.0.1:8787'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
const hide = `.globe-wrap::after, .globe-hero::after { display: none !important } .globe-wrap > div:not(:has(canvas)) { visibility: hidden !important }`
await page.goto(`${base}/`, { waitUntil: 'networkidle' }); await page.waitForTimeout(1500)
await page.addStyleTag({ content: hide })
await page.locator('.globe-hero canvas').screenshot({ path: 'public/globe-hero.png', omitBackground: true })
await page.goto(`${base}/app`, { waitUntil: 'networkidle' }); await page.waitForTimeout(1500)
await page.addStyleTag({ content: hide })
await page.locator('.globe-wrap canvas').screenshot({ path: 'public/globe-console.png', omitBackground: true })
await browser.close()
console.log('globe stills written')

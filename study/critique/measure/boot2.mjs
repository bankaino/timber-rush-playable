import { createRequire } from 'node:module'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const req = createRequire(import.meta.url); const { chromium } = req(process.env.PLAYWRIGHT);
const browser = await chromium.launch({ args: ['--enable-gpu', '--ignore-gpu-blocklist'] }); const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
for (let k = 0; k < 2; k++) { const p = await ctx.newPage(); await p.goto(pathToFileURL(path.resolve('dist/default/preview.html')).href); await p.waitForFunction(() => window.__ready);
const n = await p.evaluate(() => { const e = performance.getEntriesByType('navigation')[0]; return { fetchStart: e.fetchStart, responseEnd: e.responseEnd, domInteractive: e.domInteractive, dcl: e.domContentLoadedEventEnd, load: e.loadEventEnd, res: performance.getEntriesByType('resource').map((r) => r.name.slice(0, 60) + ' ' + Math.round(r.duration)) }; });
console.log(JSON.stringify(n)); await p.close(); }
await browser.close();

import { createRequire } from 'node:module'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const req = createRequire(import.meta.url); const { chromium } = req(process.env.PLAYWRIGHT);
const browser = await chromium.launch(); const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); await p.goto(pathToFileURL(path.resolve('dist/default/preview.html')).href); await p.waitForFunction(() => window.__ready);
await p.waitForTimeout(800);
await p.mouse.move(195, 540); await p.mouse.down();
for (let i = 0; i < 10; i++) { await p.mouse.move(195, 515, { steps: 2 }); await p.waitForTimeout(100); console.log(await p.evaluate(() => JSON.stringify({ anc: SCENE.state.anc, fi: SCENE.state.firstIn, m: SCENE.state.money, y: SCENE.state.p.y }))); }
await browser.close();

import { createRequire } from 'node:module'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const req = createRequire(import.meta.url); const { chromium } = req(process.env.PLAYWRIGHT);
const browser = await chromium.launch({ args: ['--enable-gpu', '--ignore-gpu-blocklist'] }); const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); await p.goto(pathToFileURL(path.resolve('dist/default/preview.html')).href); await p.waitForFunction(() => window.__ready);
console.log(await p.evaluate(() => ({ readyAt: Math.round(performance.now()), dcl: Math.round(performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd), gl: (() => { const c = document.createElement('canvas').getContext('webgl2'); const d = c.getExtension('WEBGL_debug_renderer_info'); return d ? c.getParameter(d.UNMASKED_RENDERER_WEBGL) : '?'; })(), canvas: [document.getElementById('c').width, document.getElementById('c').height] })));
// frame time with CPU throttling 4x (mid-range phone proxy)
const cdp = await ctx.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await p.mouse.move(195, 540); await p.mouse.down(); await p.mouse.move(195, 515, { steps: 3 });
await p.waitForTimeout(1500);
const fps = await p.evaluate(() => new Promise((res) => { const ts = []; const f = (t) => { ts.push(t); if (ts.length < 120) requestAnimationFrame(f); else { const d = ts.slice(1).map((x, i) => x - ts[i]).sort((a, b) => a - b); res({ median: d[59].toFixed(1), p95: d[113].toFixed(1) }); } }; requestAnimationFrame(f); }));
console.log('4x cpu throttle frame ms', fps);
await browser.close();

// real-time play of the packed preview build with a phone viewport; screenshots at the beats
import { createRequire } from 'node:module'; import path from 'node:path'; import fs from 'node:fs'; import { pathToFileURL } from 'node:url';
const req = createRequire(import.meta.url); const { chromium } = req(process.env.PLAYWRIGHT);
const file = path.resolve('dist/default/applovin.html'), out = 'study/critique/measure/shots'; fs.mkdirSync(out, { recursive: true });
const vp = (process.argv[2] || '390x844').split('x').map(Number), tag = process.argv[3] || 'good';
const browser = await chromium.launch({ args: ['--enable-gpu', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: vp[0], height: vp[1] }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const ext = []; ctx.on('request', (r) => { const u = r.url(); if (!u.startsWith('data:') && !u.startsWith('file:')) ext.push(u); });
await ctx.route('**/mraid.js', (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: `window.mraid={_l:{},opened:[],getState:()=>'default',isViewable:()=>true,addEventListener(k,f){},open(u){this.opened.push(u);}};` }));
const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
const t0 = Date.now(); await p.goto(pathToFileURL(file).href); await p.waitForFunction(() => window.__ready, null, { timeout: 20000 });
console.log('ready ms', Date.now() - t0);
const box = await p.locator('canvas').boundingBox(), VIEW = await p.evaluate(() => SIM.VIEW);
const V = (x, y) => [box.x + x / VIEW.W * box.width, box.y + y / VIEW.H * box.height];
const shot = (n) => p.screenshot({ path: path.join(out, `${tag}_${n}.png`) });
await p.waitForTimeout(800); await shot('00_start');
if (tag === 'idle') { await p.waitForTimeout(6000); await shot('01_idle6s'); const s = await p.evaluate(() => ({ t: SCENE.state.t, end: SCENE.state.end })); console.log('idle', s); await browser.close(); process.exit(0); }
const [ax, ay] = V(540, 1500); await p.mouse.move(ax, ay); await p.mouse.down();
const shotsAt = {}; const beat = async (k) => { if (!shotsAt[k]) { shotsAt[k] = 1; await shot(k); } };
const tstart = Date.now(); let fr = [];
while (Date.now() - tstart < 45000) {
  const S = await p.evaluate(() => { const s = SCENE.state; return { t: s.t, x: s.p.x, y: s.p.y, lv: s.p.lv, money: s.money, padLv: s.padLv, end: s.end, rv: s.rv && { x: s.rv.x, y: s.rv.y, lv: s.rv.lv, alive: s.rv.alive }, ev: s.ev.slice(-3).map((e) => e.k + '@' + e.t.toFixed(2)) }; });
  const cost = [0, 90, 200, 999][S.padLv]; let dir;
  if (S.end >= 0) break;
  if (S.rv && S.rv.alive && S.lv > S.rv.lv) { dir = [S.rv.x - S.x, S.rv.y - S.y]; await beat('05_chase'); }
  else if (S.rv && S.rv.alive && Math.hypot(S.rv.x - S.x, S.rv.y - S.y) < 260) dir = [S.x - S.rv.x, S.y - S.rv.y];
  else if (cost < 999 && S.money >= cost) { dir = [580 - S.x, 3400 - S.y]; dir.pad = 1; await beat(S.padLv === 1 ? '02_afford1' : '04_afford2'); }
  else dir = [Math.sin(S.t * 0.9), -0.6];
  if (S.t > 3 && S.t < 3.2) await beat('01_mow3s');
  if (S.rv && S.t < 9) await beat('03_rival');
  if (dir.pad && Math.hypot(dir[0], dir[1]) < 40) { await p.mouse.up(); await p.waitForTimeout(150); await p.mouse.move(ax, ay); await p.mouse.down(); continue; }
  const d = Math.hypot(dir[0], dir[1]) || 1, [mx, my] = V(540 + dir[0] / d * 70, 1500 + dir[1] / d * 70);
  await p.mouse.move(mx, my, { steps: 2 }); await p.waitForTimeout(60);
  if (S.ev.some((e) => e.startsWith('upgrade'))) await beat('upg' + S.lv);
  if (process.env.LOG && Math.round(S.t*10)%10==0) console.log(S.t.toFixed(1), 'lv', S.lv, 'm', Math.round(S.money), 'p', Math.round(S.x), Math.round(S.y), 'rv', S.rv && [Math.round(S.rv.x), Math.round(S.rv.y), S.rv.alive], 'dir', dir.map(Math.round), S.ev.join(','));
  if (S.ev.some((e) => e.startsWith('smash'))) await beat('06_smash');
}
await p.mouse.up();
await p.waitForTimeout(400); await shot('07_end0.4'); await p.waitForTimeout(1500); await shot('08_end2');
const fin = await p.evaluate(() => ({ t: SCENE.state.t, end: SCENE.state.end, lv: SCENE.state.p.lv, earned: SCENE.state.earned }));
// tap off-button on endcard
const [ox, oy] = V(540, 400); await p.mouse.click(ox, oy);
const opened1 = await p.evaluate(() => mraid.opened.length);
const fps = await p.evaluate(() => new Promise((res) => { let n = 0; const t0 = performance.now(); const f = () => { n++; if (performance.now() - t0 < 1000) requestAnimationFrame(f); else res(n); }; requestAnimationFrame(f); }));
console.log(JSON.stringify({ vp, fin, offButtonTapOpensStore: opened1 > 0, fps, ext, errs, box }));
await browser.close();

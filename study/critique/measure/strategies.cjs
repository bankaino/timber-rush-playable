// headless strategies through SIM.step with finger-drag input (view px)
const SIM = require('../../../live/sim.js');
const { K, PAD } = SIM, ANC = [540, 1500];
function run(name, policy, T = 45) {
  const S = SIM.spawn(0); const log = {}; const mark = (k) => { if (log[k] === undefined) log[k] = +S.t.toFixed(2); };
  let bumps = 0, lastEv = 0, padIdle = 0;
  while (S.t < T) {
    const dir = policy(S);   // [dx,dy] world direction or null (finger up)
    let inp = { press: 0 };
    if (dir) { const d = Math.hypot(dir[0], dir[1]) || 1; inp = { press: 1, ax: ANC[0], ay: ANC[1], px: ANC[0] + dir[0] / d * K.JOY, py: ANC[1] + dir[1] / d * K.JOY }; }
    SIM.step(S, inp);
    for (const e of S.ev) if (e.t > lastEv) { if (e.k === 'bump') bumps++; if (e.k === 'upgrade') mark('lv' + e.lv); if (e.k === 'rival') mark('rival'); if (e.k === 'smash') mark('smash'); if (e.k === 'end') mark('end'); }
    lastEv = S.t;
    if (S.money >= 1) mark('coin1'); if (S.earned >= 90) mark('earn90'); if (S.earned >= 290) mark('earn290');
    if (S.end >= 0 && S.t - S.end > 0.1) break;
  }
  const rd = S.rv ? Math.round(Math.hypot(S.rv.x - S.p.x, S.rv.y - S.p.y)) : null;
  console.log(name.padEnd(22), JSON.stringify({ ...log, bumps, money: Math.round(S.money), earned: Math.round(S.earned), lv: S.p.lv, end: S.end >= 0 ? +S.end.toFixed(1) : 'NEVER', rivalDist: rd, pos: [Math.round(S.p.x), Math.round(S.p.y)] }));
  return S;
}
const to = (S, x, y) => [x - S.p.x, y - S.p.y];
// 1. never touch
run('idle', () => null, 90);
// 2. circles
run('circles', (S) => [Math.cos(S.t * 1.5), Math.sin(S.t * 1.5)]);
// 3. hold straight up forever
run('straight-up', () => [0, -1]);
// 4. go straight to the pad with no money then idle on it
run('pad-no-money', (S) => Math.hypot(S.p.x - PAD.x, S.p.y - PAD.y) > 30 ? to(S, PAD.x, PAD.y) : null, 45);
// 5. rush rival: mow up until rival, then chase it forever
run('rush-rival', (S) => S.rv && S.rv.alive ? to(S, S.rv.x, S.rv.y) : [0, -1]);
// 6. good player: mow a snake until 90, pad, mow until 200, pad, then rival
const good = (thr1, thr2) => { let ph = 0; return (S) => {
  const cost = K.PAD_COST[S.padLv];
  if (S.rv && S.rv.alive && S.p.lv > S.rv.lv) return to(S, S.rv.x, S.rv.y);
  if (S.rv && S.rv.alive && Math.hypot(S.rv.x - S.p.x, S.rv.y - S.p.y) < 260) return [S.p.x - S.rv.x, S.p.y - S.rv.y];
  if (cost < 999 && S.money >= (S.padLv === 1 ? thr1 : thr2)) return to(S, PAD.x, PAD.y);
  // snake: go up, swing horizontally
  return [Math.sin(S.t * 0.9), -0.6]; }; };
run('good (pad at 90/200)', good(90, 200));
run('greedy (pad at 290)', good(290, 290));
// 7. demo planner as player
run('demo planner', (S) => { const i = SIM.scriptInput(S.t, S); return i.press ? [i.px - i.ax, i.py - i.ay] : null; });
// measure coin rate
{ const S = SIM.spawn(0); let n = 0; while (S.t < 6) { SIM.step(S, { press: 1, ax: 540, ay: 1500, px: 540, py: 1430 }); } console.log('coins after 6 s straight up', S.money, 'pos', Math.round(S.p.y)); }

# TIMBER RUSH — game critique, round 1

Reviewer stance: senior playable-ads producer at a hyper/hybrid-casual publisher. I read `live/sim.js`, `live/scene.js`, `live/index.html`, `live/audio.js`, `tools/build_playable.py`, and play-tested `dist/default/applovin.html` / `preview.html` headless on phone viewports (390x844, 375x667, 844x390 landscape). I also ran 8 scripted strategies through `SIM.step` in node.
Scripts: `study/critique/measure/strategies.cjs` (headless strategies), `play.mjs` (real-time bot + screenshots), `boot*.mjs` (load and frame time). Screenshots: `study/critique/measure/shots/`.

## Scores (1-10)

| area | score | one-line reason |
|---|---|---|
| Hook (first 3 s) | 6 | One-finger drag, hand and "DRAG TO CUT TREES!" show from frame 0, and the first coin lands 0.02-0.2 s after the drag starts. But nothing moves before the first touch, and the hand sits on top of the hero machine. |
| Clarity of the loop (without text) | 5 | Cut, then coins: reads well. Coins, then pad: no cost or progress is shown anywhere, and the pad is off-screen 3 s in. The rival rule is "LV 2 vs LV 2 = TOO WEAK", which looks like a tie and feels unfair. |
| Game feel (steering, weight) | 7 | Responsive. 90% speed in 0.28 s, 180° turn in 0.6 s, stop in 0.19 s, no dead stick. The stick is invisible and its throw is tiny (70 view px ≈ 25 pt), so it behaves as direction-only. |
| Juice | 7 | Good coin stream to the pill, sawdust, tree-fall, a slight slowdown while cutting, shake, hit-stop and procedural SFX. Weak points: the size jump on upgrade is a snap, the trailers are empty white boxes, no haptics, and the smash fades the rival out in 0.35 s. |
| Pacing | 7 | A competent player gets LV2 at 6.6-7.8 s, LV3 at 16.8-21.8 s, the crush at 17.6-23.5 s and the endcard at 19-25 s, which sits well in the 15-30 s band. The 9-20 s stretch sags because it is mostly driving back to the pad. |
| CTA / endcard | 5 | The CTA is always visible (good). The endcard is text over dimmed gameplay. Only the pill is tappable. The win and time-out endcards are identical. The stat is wrong and REPLAY collides with a world badge. |
| Technical / network readiness | 7 | 0.28 MB single file, 0 external requests, adapters for MRAID, DAPI, Mintegral, ExitApi and Meta, 61 fps, about 160 ms warm boot. Gaps: a non-touching user never reaches the end (no `gameEnd`), landscape is pillarboxed to 26% of the width, there is no resize handling, and the game does not wait for viewability. |
| **Would ship as a test creative** | **6** | Ship after fixes 1-4. They are each roughly a few hours of work, and fix 1 is a network-compliance blocker. |

## Measured play-throughs (headless sim, `strategies.cjs`; times in sim seconds from load)

| strategy | first coin | 90 earned | LV2 | rival | LV3 | crush | endcard |
|---|---|---|---|---|---|---|---|
| never touch | — | — | — | — | — | — | **never** (sim t = 90 s, still waiting) |
| drive in circles | 0.02 | 28.5 | never | 8.0 | — | — | 42.0 (time-out), 6 bumps |
| hold straight up | 0.17 | 2.9 | never | 8.0 | — | — | 42.0, stuck at world edge y=60 with 363 unspent coins |
| sit on pad, no money | — | — | — | 8.0 | — | — | 42.0, pad gives zero feedback |
| rush the rival at LV1 | 0.17 | 2.9 | never | 8.0 | — | — | 42.0, **48 bumps** |
| good: pad at 90 then 200 | 0.04 | 2.6 | 6.6 | 8.0 | 16.8 | 17.6 | **19.2** |
| greedy: pad once at 290 | 0.04 | 2.6 | 14.5 | 8.0 | 24.4 | 25.4 | 27.0 |
| real-time Playwright bot | — | — | 7.8 | 9.2 | 21.8 | 23.5 | 25.1 |

Economy: driving straight earns about 33 coins/s at LV1 (198 coins in 6 s), so 90 and 200 are reached almost immediately. **Coins never limit progress. Travel to the pad does** (one return trip took 18.0 s to 21.0 s, and the first took 3.9 s to 6.9 s). Catching the rival once you out-level it takes 1.5-2.0 s even with 0.3 s of reaction lag, so the 430 px orbit is fine.

## Interaction audit (what does nothing / dead ends)

| touch / situation | result | verdict |
|---|---|---|
| Never touch the screen | Hand plus text loop forever. `firstIn < 0` blocks both `RIVAL_AT` and `END_MAX` (sim.js `step`, endcard condition), so there is no endcard and Mintegral `gameEnd` never fires. | **Dead end, compliance risk** |
| Single tap (no drag) | Nothing. The stick needs more than 10.5 view px (≈4 pt) of drag, and there is no tap-to-move. | Acceptable, but no feedback for tappers |
| Tap the CTA bar outside the pill ("TIMBER RUSH" text) | Starts a steering drag, no store. | Lost click intent; make the whole bar a CTA |
| Tap the money pill, pad or rival | Nothing (not a hit target). | OK |
| Drive onto the pad with 0 coins | Nothing at all: no cost label, no "need 90" message, no shake. | **Silent dead end** |
| Stay on the pad when you can afford both | Both upgrades drain in one visit (120 coins/s). | Good |
| Drive into the rival when weaker | "TOO WEAK! UPGRADE", 70 px push, repeats every 0.5 s (48 times in 34 s for a chaser). No fail state. | Good (no fail), but see fix 3 on equal-level confusion |
| Reach the world edge (y=60) | Machine pinned at the edge, still pressing, nothing to cut. The guide arrow does show UPGRADE. | Minor |
| Endcard: tap anywhere off the button | Nothing (measured: `mraid.open` not called). | **Lost clicks** |
| Endcard REPLAY | Works after 1.2 s. The label overlaps the player's world LV badge (`shots/good_08_end2.png`: "LV↻ REPLAY"). | Bug |
| Rotate to landscape | Canvas is 219 px wide in an 844 px window. `ASPECT` is read once at load and there is no resize handler. | **Broken on rotate and tablets** |

## Top fixes, ranked by impact

### 1. Make the ad always end, and cap the session near 30 s
- **WHAT:** `live/sim.js` `step()`, the endcard condition and `K.END_MAX`.
- **WHY:** A non-touching user never sees an endcard (sim t = 90 s: `end = -1`; real browser 7.3 s: still idle). Networks expect the endcard to be reachable. Mintegral needs `gameEnd()`, and ironSource/Unity reviewers check that a passive user gets the store screen. A player who never upgrades plays 42 s before the endcard, which is 12 s past the attention window.
- **CHANGE:**
  - Add `K.END_IDLE = 12` and end when `S.firstIn < 0 && t > K.END_IDLE`.
  - Also end when `t - S.lastIn > 10` (left the phone).
  - Lower `END_MAX` from 42 to 28.
  - Optional: in ad mode, play the existing attract planner (`SIM.at`) for the hand after 3 s of no input, so passive viewers still see cut, upgrade and crush. The demo is already validated by `demoCheck` (endcard at 21.2 s).

### 2. Make the upgrade pad readable and stop the dead-travel sag
- **WHAT:** `live/scene.js`, the pad block (`// the pad: dashed gold square…`), the money pill and the guide arrow. Also `SIM.PAD` in `live/sim.js`.
- **WHY:**
  - The pad is an empty dashed square with no icon or price (`shots/idle_00_start.png`). By 3 s it is off-screen under the CTA bar (`shots/se_02_afford1.png`).
  - Nothing tells the player that 90 is the target until the UPGRADE arrow appears.
  - Coins never gate progress (2.6 s to 90). The bottleneck is a 3-4 s U-turn through stumps that pay 0 coins, each way, twice. That is about 30-40% of the 20 s loop spent driving through nothing.
- **CHANGE:**
  - Draw `🪙 90` / `🪙 200` (coin sprite plus number) on the pad, counting down as it fills.
  - Add a thin progress bar under the money pill: money / next cost, flashing gold when full.
  - Give the pad an edge-of-screen marker (an arrow pinned to the screen edge pointing to the pad) whenever it is off-screen and affordable.
  - Either move the pad to the forest edge (PAD.y ≈ 3150, right at the yard lip) or, after LV2, spawn a second pad ahead of the player (for example 600 px up the map) so the second upgrade doesn't need a backtrack.

### 3. Fix the rival rule so it reads without text, and time the reveal to a power moment
- **WHAT:** `live/sim.js` (rival spawn `K.RIVAL_AT` and the `p.lv > r.lv` check), and `live/scene.js` (the LV badge in `machine()`).
- **WHY:**
  - The rival spawns at 8.0 s after first input, whatever state the player is in.
  - For the good player it lands right after LV2, so both badges read "LV 2". Touching it then says "TOO WEAK!", which reads as a tie the player lost.
  - The win condition is strictly-greater, but nothing on screen communicates "you need LV 3".
- **CHANGE:**
  - Show the rival badge as its level plus a lock or skull while `p.lv <= r.lv`, and flip it to a pulsing red "CRUSH!" target when `p.lv > r.lv`.
  - Spawn the rival on the first `upgrade` event plus 1 s (or on `RIVAL_AT`, whichever is first), so "I just got stronger" is answered by "here's a bigger enemy".
  - Either set `RIVAL_LV` to 2 with a `>=` win, or keep `>` and print "LV 3" on the pad's next-upgrade label so the target is explicit.

### 4. Endcard: full-screen tap, honest stats, no collisions, win vs time-out framing
- **WHAT:** `live/scene.js`, the `// ===== endcard =====` block, and `S.hit`.
- **WHY:**
  - Only the 640x170 pill is a hit target. Measured: a tap at (540, 400) did not call `mraid.open`.
  - `ST.earned + ' TREES CUT'` includes the +150 smash bonus, so "482 TREES CUT" is wrong by 150 after a win.
  - The player's world LV badge renders under "↻ REPLAY" (`shots/good_08_end2.png`).
  - Time-out and win show the same "Build your timber empire!", which is a missed emotional beat.
  - There is no product or icon visual; it is just text over dimmed gameplay.
- **CHANGE:**
  - After 0.5 s, push a full-screen `{id:'cta'}` hit rect *behind* the replay rect (keep REPLAY tappable). This applies to AppLovin, Unity, ironSource and Mintegral. For Google and Meta, keep button-only if their policy review objects.
  - Track `S.trees` separately and display it.
  - Skip LV badges in `machine()` when `ST.end >= 0`.
  - Headline "YOU CRUSHED THE RIVAL!" on a win, "SO CLOSE! UPGRADE & CRUSH IT" on a time-out.
  - Add the hero harvester sprite (`harvester_body`, scaled up, slight bob) between logo and button.

### 5. Guide arrow: bigger, never on top of your own badge, off-screen aware, in sync with the counter
- **WHAT:** `live/scene.js`, the `// guide arrow` block.
- **WHY:**
  - The chevrons are 44x15 view px (≈16 pt on a 390 pt phone). They overlap the player's own "LV 3" badge when pointing up, because the arrow radius 175·z ≈ the badge offset 150·z (`shots/good_05_chase.png`: "L^3").
  - "UPGRADE!" appears while the pill still shows 64, because `afford` uses `ST.money` but the pill shows `money − inFlight` (`shots/good_02_afford1.png`).
- **CHANGE:**
  - Draw the arrow at radius 230·z, 2x the size, with a dark outline.
  - When the goal is off-screen, also pin a marker at the screen edge.
  - Gate the guide on `shown >= left` (the displayed amount) so the prompt and the counter agree.

### 6. Show the joystick and give tappers feedback
- **WHAT:** `live/scene.js`, the HUD (draw while `ST.anc`). `live/sim.js` `K.JOY`.
- **WHY:**
  - The floating stick is invisible, and its full throw is 70 view px ≈ 25 pt, so it acts as a direction pad.
  - Users who tap (instead of drag) get no response at all.
- **CHANGE:**
  - While pressed, draw a faint ring at `S.anc` (r = JOY) and a knob at the clamped finger.
  - On a tap with no drag, flash the hand plus "DRAG!" for 1 s.
  - Consider `JOY` 90-100 for finer steering (see A/B C).

### 7. Upgrade and crush juice: make "stronger" visible
- **WHAT:** `live/scene.js` `machine()` (body height is `CUT_W[lv]/CUT_W[1]`, applied instantly) and the trailer draw.
- **WHY:**
  - On upgrade the machine snaps bigger in one frame (`shots/good_upg2.png`).
  - The trailers are empty white tubs, so the "carrying more wood" fantasy is missing.
  - On crush, the rival is gone in 0.35 s. That moment is the "wow" and should hold for about 0.8 s.
- **CHANGE:**
  - Tween scale over 0.35 s with a 1.15 overshoot after `upT`.
  - Draw log stacks in trailers, with fill proportional to recent cuts.
  - On smash, flip and launch the rival body, keep it 0.8 s, and add `navigator.vibrate?.(40)` on upgrade and smash (where allowed).

### 8. Orientation and resize
- **WHAT:** `live/sim.js` (`ASPECT` computed once), `live/index.html` (no `resize` listener), and the canvas CSS.
- **WHY:** In 844x390 landscape the game is 219 px wide (26% of the screen) with black bars (`shots/land_05_chase.png`). AppLovin and Unity serve on tablets and allow rotation.
- **CHANGE:**
  - Minimum: fill the bars with a blurred or brand background and keep the CTA in the bar area.
  - Better: a landscape VIEW (W = H·aspect) with a re-laid-out HUD, plus a `resize`/`orientationchange` handler that recomputes `--ar` and the camera half-extents.

### 9. Hook the first second
- **WHAT:** `live/index.html` (AD branch `play = SIM.spawn(0)`) and `live/scene.js` (tutorial hand position).
- **WHY:** Frame 0 to first touch is a static forest. The hand is drawn on top of the harvester at `DEMO_ANC` (`shots/idle_00_start.png`), hiding the hero.
- **CHANGE:**
  - Auto-drive the machine forward for 1.0-1.5 s at start (a coin stream immediately), then stop and pulse the hand.
  - Offset the hand anchor about 250 px below the machine.

### 10. Network polish
- **WHAT:** `tools/build_playable.py` adapters, and `CTA` in `scene.js`.
- **WHY / CHANGE:**
  - The MRAID and DAPI adapters only mute audio on viewability. Start the game clock and audio on `isViewable()` (Unity and ironSource review flags autoplay before view).
  - The CTA pill is 330x104 view px ≈ 119x38 pt, under the 44 pt touch guideline. Raise it to `bh` 130 and make the whole bottom bar clickable.
  - The packed boot still restores `sessionStorage('live')` and handles the dev keys Esc/P/[ ] (Esc drops into attract mode). Guard these with `!AD`.

## Performance / size (measured)
- Size: 0.28 MB HTML (Meta limit 2 MB, others 5 MB), Google zip 0.17 MB. No external requests (smoke test and my runs: `ext: []`).
- Boot: about 160 ms to `__ready` warm (2.6 s on a cold browser start, which is GPU process init, not the game).
- Frame: 61 fps. With 4x CPU throttle the median and p95 frame are 16.7 / 16.8 ms (desktop GPU; real low-end Android GPU untested). `devicePixelRatio` is not applied to the backing store (canvas 1080x2337 fixed), which is fine for fill rate.

## A/B hypotheses (each a `variants/<name>.json` K override; `build_playable.py --variant all`)

1. **`short_loop`**: `{"K": {"RIVAL_LV": 1, "RIVAL_AT": 5}}`
   - Hypothesis: one upgrade is enough to crush, so the "wow" moves from ~18 s to ~9-10 s and the endcard to ~12 s. Shorter time-to-wow raises the completion rate and the endcard CTR on UA traffic with short attention.
   - Metric: endcard reach %, CTR, IPM.
2. **`power_fantasy`**: `{"K": {"CUT_W": [0, 270, 350, 430, 500], "SPD": 390}}`
   - Hypothesis: a wider swath and a faster machine mean each pass clears a visibly bigger strip and pad trips are shorter. This makes the cut more satisfying, which is the hyper-casual "mow everything" thumb-stopper, and cuts the 9-20 s sag.
   - Metric: average interaction time, CTR, in-game CTA taps.
3. **`tight_timebox`**: `{"K": {"END_MAX": 25, "END_AFTER_WIN": 0.9, "PAD_COST": [0, 60, 150, 999]}}`
   - Hypothesis: a hard 25 s box with cheaper upgrades forces everyone onto the endcard while still engaged, and the snappier post-win transition catches peak excitement.
   - Metric: endcard view rate, endcard CTR versus in-game CTR split.

# Frame critic (fidelity angle), round 1 of 3 — Timber Rush

Inputs judged: ref frames 2-6 and 9 plus ref.png (frame5); ours frames/check2/t1, t6, t8.80, t14, t19.75, t23, frames/qa/*.png, frames/smoke/0_start and 1_mowing (390x844 phone, packed build).
Evidence written to study/critique/frame_r1/: report.json, side_full.png, lowfreq_full.png, palette.png, worst_*.png (compare.py report ref.png vs qa/match.png), side_harvester.png, side_forest.png, side_cleared.png, side_yard.png, side_edge.png, side_scale_frame2.png, side_scale_frame6.png, zoom_t14_sort.png, zoom_t14_rival.png, zoom_t19_smash.png.
Scripts: study/critique/measure/m1.py (value/chroma percentiles per region), sides.py and s2.py (same-screen-scale side-by-sides), period.py (tree spacing, too noisy to use; the scale numbers below come from the crops).

Note: the whole-frame compare.py numbers include the ref's black letterbox bars (19.8% #030103), so I used region measurements. Every number below is a game-area crop.

## Verdict in one paragraph

The sprites are good. Harvester, rival, trees, coin and hand are one consistent low-poly family, cleanly cut, with no generator garbage. It is already better art than a lot of live ads. It still reads as a prototype for three reasons. (1) **The value structure is inverted.** In the reference the forest is a dark, quiet mass and the cleared path is a lighter olive field, so every pass of the harvester "paints light" into the dark. In ours the forest is the brightest, busiest thing on screen (a lime wallpaper) and the clearing is a dark brown hole full of bright peach stumps. (2) **Scale is wrong.** Our trees are about 2x too big next to the machine, so the harvester bulldozes a hedge instead of mowing a carpet. On the phone viewport the machine is a small sprite under 60% of a screen of repeating trees. (3) **Code-drawn layers still show programmer tells.** The smash debris is flat rectangles plus a flat ring, the dead rival fades to a translucent ghost, the rival trailer is a salmon rectangle from a tint, the yard is an empty slab with two lines, and coins and labels collide in the HUD.

## Measurements (ref vs ours, same regions)

| What | Reference | Ours | Gap |
|---|---|---|---|
| Forest lum median / P95 | 0.21 / 0.34 (frames 3/5/6 agree within 0.01) | 0.36-0.39 / 0.68 | ours ~0.8 stop brighter, highlights 2x |
| Forest chroma P95 | 0.33-0.37 | 0.59-0.60 | ours ~1.7x more saturated |
| Forest hue (mean) | 118 deg (pure green, mean #0e460c, mode #003000) | 97-101 deg (yellow-lime, mean #3f7a22, modes #286018/#489820) | ~20 deg too yellow |
| Cleared ground base colour (mode) | #386020 / #306020, lum ~0.30 | #203810 / #203808, lum ~0.17 | ours ~0.8 stop darker and browner |
| Clearing vs forest | clearing **brighter** than forest (0.31 vs 0.21) | clearing **darker** than forest (0.20 vs 0.37) | **inverted value relation** |
| Clearing P95 lum (stumps) | 0.35 (no bright elements; dots are dark red-brown) | 0.75-0.78 (peach stump tops #e8c078) | stumps are the brightest noise in the play area |
| Frame P5 lum (deep darks) | 0.03-0.05 | 0.15-0.16 | no dark anchor anywhere |
| Concrete | #ae9078 hue 27, lum P5-P95 0.10-0.79 (bays, dashes, AO, building) | #cac0ae hue 38, lum P5-P95 0.71-0.86 | flat slab, no structure |
| Tree crown width at 1080-wide screen scale | ~28-35 px | ~60-75 px | ours ~2x |
| Harvester length / tree crown | ~8-10 (frames 2, 5, 6) | ~3.6 (SIZES: harvester 300 / tree 84 world px, SP=40) | ours less than half the ratio |
| Harvester share of view width (phone 390x844) | ~38% (frame2) | ~14-16% (smoke/0_start) | machine too small on a real phone |

## Scores (1-10)

| Axis | Score | Why |
|---|---|---|
| Readability | 6 | The machine, coins and CTA read. But the LV labels are covered by flying coins (match, t14, t19.75), the "UPGRADE!" goal text floats in the middle of the forest away from both machine and pad (t14, smoke 1), the bottom banner covers the pad (match), and on the phone the machine is small in a sea of identical trees. |
| Style consistency | 7 | All sprites are one faceted family. Code-drawn pieces break it: rectangle debris, flat rings, a flat slab yard, the salmon tinted trailer, the ghost-alpha death. |
| Scale relations | 4 | Trees ~2x too big relative to the harvester (ratio 3.6 vs ~8-10). Stumps (26 px) are as wide as a third of the machine. |
| Lighting / values | 4 | The forest/clearing value relation is inverted. Forest is 0.8 stop too bright and 1.7x too saturated. Nothing reaches below lum 0.15 (ref 0.03-0.05). The forest edge has no AO or dark rim. The light direction itself is consistent (upper-left sun, shadows down-right). |
| HUD | 7 | Good fonts, consistent outline treatment, the CTA bar is real-ad quality. Fails on collisions (coins over the LV pill, the two LV pills overlapping at the smash), the money pill at 5 digits ("99982" runs into the coin icon), and the pad hidden under the banner. |
| FX | 5 | The coin flight to the pill and sawdust are good. Smash = rectangles + flat ellipse ring + round orange blobs + translucent ghost. Upgrade = flat ring + 4-point stars. Both read as programmer art. |
| Overall "passes as a real ad" | 6 | The asset quality is there. Values, scale and the code-drawn layers keep it at "nice prototype". Fixes 1-3 alone would move it to about 8. |

## Polish checklist (critics.md §0)

| # | Item | Result | Evidence |
|---|---|---|---|
| 1 | One rendering family | PASS (minor) | All sprites are faceted low-poly with 2-3 tones. Code-drawn yard and pad are flat vector rrects with no facets or AO, which is acceptable for concrete but a bit too clean (side_yard.png). |
| 2 | One texel density | PASS | Sprites are at consistent sharpness. The coin at HUD size (96 px) vs world (40-46 px) is fine. |
| 3 | One outline weight and one light direction | PASS | No outlines anywhere (matches the bible). Lit facets top-left, shadows offset down-right (`L.shadow(sx+12z, sy+16z)`), consistent with `L.SUN=[W*0.15,-300]`. |
| 4 | HUD like a shipped game | FAIL | Coins over the "LV 1" pill (match.png ~520,900); "LV 4" and "LV 2" overlap with coins on top (zoom_t19_smash.png); money_worst "99982" has no gap to the coin; the pad sits under the brand banner (match.png 270-510, 1610-1840); the "UPGRADE!" label is clamped into empty forest (t14 310,1250; smoke 1_mowing 340,1150). |
| 5 | Effects start at the emitter | PASS | Coins pop from felled trees, sawdust from the cutter, exhaust from the rear stack. |
| 6 | Characters articulate | N/A / UNVERIFIED | Vehicles only, judged from stills. I can't see wheel or cutter spin. The motion critic should check that the cutter bar animates (no spin or blur is visible in any still). |
| 7 | Grounding and sorting | PARTIAL FAIL | Machines and trailers have contact shadows (good). Standing trees have no contact or AO at the forest edge, and scene.js:31 has a comment "darker floor under standing forest" **with no code under it**. The dead rival fades to a translucent ghost with the ground showing through (zoom_t19_smash.png) instead of a wreck. Rear tyres slightly under the pine-row sort in t14 (zoom_t14_sort.png bottom right). This is minor. |
| 8 | No generator artifacts | PARTIAL FAIL | The sprites are clean. But a 3-variant forest on a near-regular 40 px offset grid reads as wallpaper, with diagonal rows visible on the phone view (smoke/0_start.png, 1_mowing.png). |
| 9 | No placeholder tells | FAIL | Rival trailer tinted to a flat salmon rectangle (`ttint=[1.35,0.55,0.5,0.85]`, zoom_t14_rival.png). The yard is an empty slab with two white lines. Assets `log.png`, `logs_pile.png` and `needles.png` exist but are unused, so the trailers are empty white planks where the ref carries loads. |
| 10 | States read at a glance | PASS | The pad fill bar and afford glow work, LV pills on both machines, the "CRUSH IT!/UPGRADE!" goal, falling trees. |
| 11 | No primitive-shape effects | FAIL | Smash debris = `L.solid` 22x12 rectangles in red/black. The shockwave is a uniform-width `L.ring` ellipse. Fire is round orange blobs. Upgrade = a flat ring + 4-point stars (pad.png). |

## Top fixes, ranked by impact

### 1. Flip the value structure: dark quiet forest, lighter olive clearing (biggest win)
- **WHAT:** The forest is lime and bright (lum median 0.37, P95 0.68, hue ~99 deg). The clearing floor is dark brown #203810 (lum 0.17). The reference is the reverse: forest #003000-#0e460c (lum 0.21, P95 0.34, hue 118 deg), clearing #386020 (lum 0.30).
- **WHY:** This is the "satisfying mow" read. The cut path must be the lit, open space and the forest the dark mass. Right now the eye goes to the forest wallpaper, and the progress (the clearing) looks like a burnt hole. It is also the main cause of the "busy/generated" feel: the bright faceted trees are high-frequency detail over 60% of the screen.
- **CHANGE (live/scene.js):**
  - Ground (line ~30): change `ground_tex` `u.grade [0.92,0.82,0,1]` so the floor's base mode lands near #36581e-#3a6020 (lum ~0.28-0.30, hue ~95). Brighter and greener. Keep the red-brown dots dark (#5a2a14-#7a3a1c, as the bible says).
  - Trees (pine-row draw ~line 96, and BATCH tint for `tree_*`): multiply standing trees by roughly [0.55, 0.68, 0.52] and push the hue toward green. Target forest lum median 0.22-0.25, P95 0.40-0.45, chroma P95 ≤0.40. Keep the lit facet visible but dim. If BATCH has no tint uniform, add one, or apply it via `L.finish` with a forest mask.
  - Implement the missing canopy occlusion at scene.js:31. Draw a dark multiply blob (`L.shadow`, alpha ~0.5, radius ~0.7 x crown) under every standing tree, batched. Add a 30-50 px dark AO rim where standing trees border cut cells, so the forest edge gets the near-black base the ref has (target frame P5 lum ≤0.07, ref 0.03-0.05).
  - Re-measure with study/critique/measure/m1.py. Targets: forest 0.22 / 0.42, clearing ground 0.28-0.30, clearing brighter than forest.

### 2. Fix scale: trees half size, denser; machine bigger on the phone
- **WHAT:** Harvester/tree ratio is 3.6 vs ~8-10 in the ref. Tree crowns are 60-75 px at 1080 screen scale vs 28-35. On a 390x844 phone the machine is ~15% of view width (ref ~38%).
- **WHY:** Small trees in a dense carpet are the reference's core fantasy (a giant machine eating a forest). Big trees make it look like a tractor in a hedge, and each tree being a readable object adds noise.
- **CHANGE:**
  - live/sizes.js: `tree: [0, 84]` to `[0, 48]`, `stump: [26,0]` to `[16,0]`.
  - live/sim.js line 18: `SP = 40` to `SP = 26-28`, jitter scaled to match. Check the tree count, BATCH capacity and perf on mobile. If the payout gets too generous, pay 1 coin per N trees (the coin event is already per cut; gate `e.coin`).
  - Raise the harvester to ~340-360 world px or zoom in. Camera zoom (sim.js:145, 1.15 / 1.06 / 0.98) should be computed from the view width so the machine covers ≥33% of the view width on the phone aspect too (390x844 currently shows far more world).
  - Cutter bar width should stay ≥ the body width so a pass clears a visibly wide swath.

### 3. Make the clearing quiet: stumps and debris to background value
- **WHAT:** Stump tops #e8c078 are lum ~0.78 (the P95 of the clearing). The ref has no light elements in the clearing at all, only dark red-brown dots.
- **WHY:** 200+ bright peach discs make the clearing the noisiest region, and they compete with the coins (same warm-yellow family) and with the harvester.
- **CHANGE:** live/scene.js stump batch (~line 57): tint stumps ~[0.62,0.50,0.42] so the cut face lands near #8a6a48 / lum ≤0.45, and use the smaller size from fix 2. Optional: drop every other stump or scatter them as debris. The brief says stumps stay, so keep them, just quieter. If you regenerate the stump, use this prompt: "tiny low-poly pine stump seen from above, dark red-brown bark #5a2a14, muted tan cut face #9a7650, 2 flat tones, no outline, no shadow, transparent background".

### 4. Rebuild the smash and upgrade FX from shaped pieces (no rectangles or flat rings)
- **WHAT:** Smash (scene.js ~119-123) = `L.solid` red/black 22x12 rectangles + a uniform `L.ring` ellipse + round orange puffs, and the rival body/trailer fade by alpha to a ghost. Upgrade (~113) = flat ring + stars.
- **WHY:** This is the payoff beat of the ad. Right now it is the cheapest-looking frame (zoom_t19_smash.png).
- **CHANGE:**
  - Debris: replace `L.solid` with sprite chunks: the `log` asset (unused), a tyre cut from `rival_body` via `src` sub-rects, and red panel shards. Give each a spin, a size spread of 0.6-1.4, a contact shadow while airborne, and a bounce on landing.
  - Rival death: no alpha fade. Squash it (scale y 1 to 0.6 with a snap), multiply its tint toward burnt [0.35,0.2,0.18], keep the wreck for 1+ s with a rising smoke column (puffs growing 3x, darkening, drifting), then sink or fade the wreck only at the end.
  - Ring: replace the uniform ellipse with a dust ring made of 16-24 puffs that expand and thin out (alpha falls faster at the outer edge), plus a brief white flash disc (0.08 s) at contact.
  - Upgrade: a gold burst of shaped sparkles with varied sizes, a short vertical light pillar on the pad, and a coin fountain from the pad instead of the flat ring.

### 5. HUD collisions and anchoring
- **WHAT:** Flying coins are drawn over the LV pills. The player and rival LV pills overlap. The "UPGRADE!" goal label floats in the forest. The bottom banner covers the pad. "99982" collides with the coin icon.
- **WHY:** A shipped ad never lets world FX cover its UI, and a floating instruction with no visible target reads as a bug.
- **CHANGE (live/scene.js):**
  - Draw the LV pills in the HUD pass after coins (or skip coins within 60 px of a pill's rect).
  - When the two pills overlap, push the rival's pill up by the pill height.
  - Goal label (~line 160): anchor it to the arrow tip (`ax, ay` + 70 px along `an`), never `clamp` it into free space. When the goal is off-screen, pin an edge arrow plus label to the screen edge in the goal's direction.
  - Money pill (~147): text x = coin right edge + 16 px, `pw = tw + coinW + 56`.
  - Camera (sim.js ~146): add a bottom safe margin of banner height + 40 px so the pad is never under the banner when it is the goal.

### 6. Kill the salmon trailer and fill the trailers
- **WHAT:** The rival trailer is `ttint=[1.35,0.55,0.5,0.85]`, a pink rectangle. Player trailers are empty white beds.
- **CHANGE:** scene.js:64: tint only the frame (or use `[0.9,0.5,0.45,0]`, so not a full multiply on the white bed), or generate `rival_trailer`. Draw a log load on each trailer that fills as trees are cut (`log` / `logs_pile` assets are unused): 3-6 log sprites stacked along the bed. This mirrors the ref's loaded trailers (frame5) and gives the trailers a state.

### 7. Dress the yard
- **WHAT:** The ref yard is a grid of bays: dashed yellow outlines, white L-corner marks, darker bay fills, warm pinkish concrete #ae9078, and a big green-roofed shed. Ours is #cac0ae with a P5-P95 range of only 0.71-0.86 and one pad.
- **CHANGE:** scene.js yard block (~35-50): add 3-4 inactive bays around the pad (darker inset `rrect` [0.55,0.50,0.44], thin dashed yellow at alpha 0.6, white L corners). Warm the slab toward [0.78,0.68,0.60]. Add a soft inner AO band along the slab edges (`L.shadow` strips). Put `logs_pile` on one bay as a prop. Optional: a generated "low-poly green-roofed timber shed, top-down 70 deg" at the yard's side.

## Minor issues
- The forest still reads as a 3-variant pattern after fix 1. Add per-tree tint jitter (±6% value, ±4 deg hue) and a ±8% scale jitter (it is already 0.9-1.15, so widen to 0.8-1.2), and break the row offset with more `h1` jitter on y.
- "DRAG TO CUT TREES!" outline is thin over busy trees. Add a soft dark backing plate or thicken `out` to 6-8 px. It gets better after fix 1 darkens the forest.
- The hand on the phone start frame covers the harvester's right side. Offset it 60-80 px right or down.
- Endcard (t23): good hierarchy, but it has no app icon or key art, and the dimmed game behind is busy. Add the coin or harvester icon above the logo and darken plus blur the backdrop a bit more. "516 TREES CUT" vs a money counter of 226 shown dimmed above is a minor mixed message; hide the money pill on the endcard.
- The rival is a palette swap of our tractor. That is acceptable for an ad, but a distinct silhouette (tracked, or a different cutter head) would read as "enemy" faster.
- The green/yellow tractor plus yellow-stripe trade dress is close to a well-known agricultural brand. Since the user wants their own brand, consider a slightly different accent (orange-yellow or a white stripe) to avoid a lookalike.
- The yellow chevrons of the goal arrow are `L.solid` bars. Fine at this size, but a chevron sprite with a soft drop shadow would match the hand's polish.

## What cannot be matched with the current approach
- The ref's perspective camera, where the forest edge shows tree sides as a dark wall. With a strict top-down camera the substitute is the AO rim plus canopy occlusion from fix 1, which gets ~80% of the read.

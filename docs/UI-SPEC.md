---
name: Helpline Watch
design: ./DESIGN.md
direction: "Signal Lime, mutated: navy canvas, lime as surface, cyan for geography, violet for the network; cobe globe hero and a 3D force graph"
personality: precise with one live moment per object
dials: { variance: 5, motion: 5, density: 6 }
stack: { vite: 8, react: 19.2, radix-themes: 3.3, phosphor-icons: 2.1, cobe: 2.0, react-force-graph-3d: 1.29, three: 0.186, tailwind: 4.3, backend: "FastAPI + SSE with per-call page snapshots" }
archetype: dashboard with a spatial hero and a list + tabbed detail workspace
viewports: [390x844, 1024x768, 1440x900]
signature: "The India globe's city markers pulse as each city's pages return, then grow with the fake count, while the lime slab's numeral climbs"
demo: { seed: "make seed", flag: "?demo=1", state_param: "?state=", reset: "reload", guest: true }
deviations:
  - "Dark only: the globe and the network are designed for a dark canvas, and analysts work long hours."
  - "The results slab is a large lime surface with a single big numeral because the brief asked for bold colour; the counts for check and official stay in one sentence under it."
---

## 0. Idea brief
User: a fraud analyst, wide monitor, several brands a week. Verb: sweep. Hero objects: the globe of swept cities and the rendered result page per city. Moving data: the progress line, the globe markers, findings filling, marks flashing, the slab numeral. Wow moment: the globe pulsing city by city while the fake count climbs, then one number touching three brands in 3D. Artifact: the takedown pack.

## 1. Demo script (≤ 3:00)
0:00 stat over the populated console with the globe. 0:10 Sweep: the progress line runs, markers pulse Mumbai to Kolkata, findings fill on the left, the slab counts up to 3. 0:35 Pages, Mumbai: the FAKE mark on the Places number. 0:50 click it: Evidence with seven weighted reasons and the sighting sheets. 1:10 Across brands: the 3D graph orbits; hover the shared number touching HDFC Bank, Zomato and IndiGo. 1:35 Pages, Kolkata: mint tick on the aggregator's official number, amber Check on the newspaper landline, dashed Unlisted on hdfcbank.com. 1:55 Download takedown pack on the slab; open report.md. 2:20 make verify. 2:40 the app bar: replaying recorded searches, 22 searches none live, make record.

## 2. Screen inventory
| id | route | purpose | entered from | primary action | states |
|---|---|---|---|---|---|
| S1 | / | Console: hero + workspace | load, ?demo=1 | Sweep | populated, running, empty, error |
| S1.E | Evidence tab | one number's case | row, mark, 3D node | Keep in the pack | fake, check, official, unlisted |
| S1.P | Pages tab | the page a victim saw | default after a sweep | pick city and page | pages, pending, failed, none |
| S1.N | Across brands | 3D network + advertisers | tab | click a node | populated, empty, loading |
| S1.L | Log | searches in order | tab | none | running, done, empty |
| S4 | /_kit | Component kit | direct | none | all |

## 3. Flow map
S1 --Sweep--> S1(running) --done--> S1.P ; row, mark or node --> S1.E ; Esc --> clear ; ↑↓ --> move ; slab button --> zip

## 4. Screens
S1 hero: globe-wrap (canvas, title block over a left scrim, city legend bottom-left) and the slab (idle: one sentence and instruction; done: numeral, "fake numbers", sentence with check and official counts, since-last-sweep, pack button). Workspace: findings pane (title, filter pills, rows, key hints) and detail pane (tabs with hue dots, content).

## 5. Components
C-01 SweepButton lime size 3: idle "Sweep", running spinner with "Sweeping n of N", done "Sweep again", disabled with no city. · C-02 Globe: cobe, India centred, scale 2.1, offset right; markers from City.ll sized 0.045 + 0.02 × fakes, active markers pulse; a slow wobble unless reduced motion; destroyed on unmount. · C-03 Slab: lime surface, dot grid, numeral Unbounded 84, pack button black-on-lime, disabled while running or empty. · C-04 FilterPill: hue-coloured outline, filled when selected, count in mono. · C-05 FindingsRow: mono number in verdict hue, badge, meta right-aligned, reason truncated; selected has a lime rule and lime wash; ↑↓ move, Esc clears. · C-06 CityPill / PagePill: cyan when selected, red count chip, dashed while pending, coral when failed. · C-07 Sheet: white result page with marks; header line, query, fixture or replay badge. · C-08 Mark: coral underline and FAKE tag, amber highlight, mint underline with tick, dashed mint; flash on landing. · C-09 EvidencePanel: hue-tinted header with switch and soft button, weighted reasons, sighting sheets, reverse lookup panel, all sightings panel. · C-10 Network3D: lazy chunk, violet brand spheres with Unbounded sprite labels, coral fakes, amber checks, shared numbers labelled in mono, auto-orbit, click opens Evidence; loading text while the chunk loads. · C-11 LogPanel. · C-12 Error callout with "Sweep again". · C-13 Empty panel with "Sweep {brand}".

## 6. Choreography
| id | trigger | what moves | timing |
|---|---|---|---|
| T-01 | sweep progress | 3 px lime-to-cyan line | 240 ms ease-out |
| T-02 | city pages pending | its globe marker pulses | continuous, 1 Hz |
| T-03 | verdict lands | mark flash coral-a42 to a16 with a 4 px halo | 500 ms |
| T-04 | selection | row wash and rule | 120 ms |
| T-05 | network mount | camera eases in, then auto-orbit | 800 ms, 0.5 deg per frame |

## 7. State machines
Sweep idle → running → done | error. Row idle → hover → selected. Page pending → done | failed. Marker idle → active (pulsing) → sized by fakes. Finding as classified → official (re-check keeps pack and reverse evidence).

## 8. Copy deck
"Sweep", "Sweeping 12 of 22", "Sweep again", "fake numbers", "Every number a victim would be shown.", "Findings", "Fake", "Check", "Official", "Unlisted", "Keep in the pack", "Mark as official", "Download takedown pack (3)", "Fakes join the pack automatically; open one to keep or remove it.", "Nothing swept yet. Press Sweep to see every number a victim would be shown.", "Demo fixture, not evidence", "Replay this search on SerpApi", "Drag to orbit, click a number to open it."

## 9. Brand
Mark: lime rounded square, dark handset, coral dot (public/icon.svg). Wordmark Unbounded 700.

## 10. Don'ts
No hue outside its function. No 3D without data. No gradients on text, no glass, no decorative motion.

## 11. Acceptance
Keyboard: Tab to Sweep, Enter, ↓ selects, Esc clears. No page-level horizontal scroll at 390. No console errors. Globe and 3D graph render in headless Chromium. `node scripts/qa.mjs` prints four passing lines.

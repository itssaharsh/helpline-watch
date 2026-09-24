---
name: Helpline Watch
design: ./DESIGN.md
direction: "Night console: lit blue-black background with grain, glass panels, white type, one ice accent, verdict colours kept small; landing page at / and console at /app"
personality: precise
dials: { variance: 4, motion: 3, density: 6 }
stack: { vite: 8, react: 19.2, radix-themes: 3.3 (dark, gray accent), phosphor-icons: 2.1, cobe: 2.0, react-force-graph-3d: 1.29, tailwind: 4.3, backend: "FastAPI + SSE with page snapshots" }
archetype: landing (j) + dashboard with a spatial hero (b, g)
viewports: [390x844, 1024x768, 1440x900]
signature: "The India globe with the swept cities, pulsing as each city's pages return; the same globe opens the landing page"
demo: { seed: "make seed", flag: "/app?demo=1", state_param: "?state=", reset: "reload", guest: true }
deviations:
  - "Dark only, chosen for the lit background and the 3D objects."
  - "The landing page uses real product content and a live component (the rendered page from the last sweep) instead of screenshots."
---

## 0. Idea brief
User: a fraud analyst at a desk on a wide monitor. Verb: sweep. Hero objects: the globe of swept cities and the rendered result page per city. Moving data: progress line, globe markers, findings filling, marks flashing, the fakes numeral. Wow moment: the globe pulsing city by city while the count climbs, then the shared number touching three brands in 3D. Artifact: the takedown pack.

## 1. Demo script (≤ 3:00)
0:00 landing hero: headline, globe, "Watch a sweep". 0:10 /app?demo=1: progress line, markers pulse, findings fill, the numeral reaches 3. 0:35 Pages, Mumbai: the FAKE mark in the Places box. 0:50 click it: Evidence, seven weighted reasons, sighting sheets. 1:10 Across brands: orbit, hover the shared number. 1:35 Pages, Kolkata: official tick, amber Check, dashed Unlisted. 1:55 Download takedown pack; open report.md. 2:20 make verify. 2:40 the app bar: replaying recorded searches, 22 none live; make record.

## 2. Screen inventory
| id | route | purpose | entered from | primary action | states |
|---|---|---|---|---|---|
| L | / | Landing | first visit | Watch a sweep | with or without a stored sweep |
| S1 | /app | Console | landing CTA, ?demo=1 | Sweep | populated, running, empty, error |
| S1.E | Evidence tab | one number's case | row, mark, node | Keep in the pack | fake, check, official, unlisted |
| S1.P | Pages tab | the page a victim saw | default after a sweep | pick city and page | pages, pending, failed, none |
| S1.N | Across brands | 3D network and advertisers | tab | click a node | populated, empty, loading |
| S1.L | Log | searches in order | tab | none | running, done, empty |
| K | /_kit | Component kit | footer link | none | all |

## 3. Flow map
L --Watch a sweep--> S1(?demo=1) ; L --Open the console--> S1 ; S1 --Sweep--> running --done--> S1.P ; row, mark or node --> S1.E ; Esc --> clear ; ↑↓ --> move ; summary card --> zip

## 4. Screens
L: nav (wordmark, section links, white "Open the console"), hero (eyebrow-free copy, h1, lead, two CTAs, three stats with sources in the README), globe card, "What a victim in Mumbai is shown" with the live Page component, steps, signals, proof, SerpApi, footer. S1: app bar, progress line, hero band, findings pane (sticky), detail pane with tabs.

## 5. Components
C-01 Buttons: white primary, ghost secondary, quiet tertiary; large variants on the landing. · C-02 Globe: cobe, India centred; console offset right with a left scrim; landing centred in a 24 px glass card; markers sized by fakes, active ones pulse. · C-03 SummaryCard: glass, 56 px numeral, two dots for check and official, sentence, white pack button, note. · C-04 FindingsPane: glass, sticky, filter pills, rows with number, badge, meta and reason, key hints. · C-05 Pills: neutral, white when selected, red count chip, dashed pending, red-outlined failed. · C-06 Tabs: text with a white underline. · C-07 Sheet: white result page with marks (red underline and FAKE tag, amber highlight, green underline with tick, dashed green). · C-08 Evidence: glass header with verdict dot, switch and ghost button, weighted reasons; sighting sheets; reverse lookup; all sightings. · C-09 Network3D: white brand spheres, red fakes, amber checks, sprite labels, auto-orbit. · C-10 Log. · C-11 Error glass with red border and "Sweep again". · C-12 Empty glass with "Sweep {brand}".

## 6. Choreography
| id | trigger | what moves | timing |
|---|---|---|---|
| T-01 | sweep progress | 2 px ice line | 240 ms |
| T-02 | city pending | its marker pulses | continuous |
| T-03 | verdict lands | mark flash | 500 ms |
| T-04 | selection | row wash and ice rule | 120 ms |
| T-05 | 3D mount | camera eases in, then auto-orbit | 800 ms |

## 7. State machines
Sweep idle → running → done | error. Row idle → hover → selected. Page pending → done | failed. Marker idle → active → sized by fakes. Finding as classified → official (re-check keeps pack and reverse evidence).

## 8. Copy deck
Landing: "Find the fake helpline numbers before your customers call them.", "Watch a sweep", "Open the console", "What a victim in Mumbai is shown", "How a sweep works", "The signals", "Proof you can run", "Built on SerpApi". Console: "Sweep", "Sweeping 12 of 22", "Sweep again", "fake numbers", "to check", "official", "Keep in the pack", "Mark as official", "Download takedown pack (3)", "Demo fixture, not evidence", "Replay this search on SerpApi".

## 9. Brand
Mark: dark rounded square, white handset, ice dot (public/icon.svg). Wordmark Host Grotesk 700.

## 10. Don'ts
No filled buttons beyond the primary, no colour outside verdicts and the accent, no gradients on components, no decorative motion.

## 11. Acceptance
Landing and console at 390, 1024 and 1440 with no page-level horizontal scroll; keyboard path on the console; no console errors; globe and 3D graph render headless; `node scripts/qa.mjs` prints five passing lines.

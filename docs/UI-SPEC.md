---
name: Helpline Watch
design: ./DESIGN.md
direction: "Sodium Night, mutated: Schibsted Grotesk display · radius 4·8·12 · accent hue +8°"
personality: precise
dials: { variance: 3, motion: 3, density: 8 }
stack: { vite: 8, react: 19.2, tailwind: 4.3, motion: 13, d3-force: 3, backend: "FastAPI + SSE" }
archetype: dashboard
viewports: [390x844, 1024x768, 1440x900]
signature: "A red chip pulses once as it lands in the city × surface grid; in the network view the edges from one number draw on to three brands"
demo: { seed: "make seed", flag: "?demo=1", state_param: "?state=", reset: "reload", guest: true }
deviations:
  - "No ⌘K palette: three actions total (sweep, open finding, download pack); a palette would be decoration."
  - "No route transitions: the app is one screen plus a drawer and one alternate view."
---

## 0. Idea brief
- **User and moment:** a fraud or brand-protection analyst at a bank or fintech, at a desk on a 1440 monitor, before customers start calling a planted number.
- **Core loop verb:** sweep.
- **Hero object:** the city × surface grid of phone numbers as victims would see them.
- **World inventory:** telephone keypad, toll-free 1800 signage, evidence tag, night-shift desk lamp (amber), city map contours.
- **Moving data:** grid cells fill city by city as searches return; verdict chips land and pulse; the network graph draws edges from one number to several brands.
- **Wow moment:** one number connected to HDFC Bank, Zomato and IndiGo at once, with a “posing as 3 brands” tag.
- **Artifact:** the takedown pack (ZIP with CSV, evidence JSON, report with replay links, complaint template).
- **Judging:** five unweighted criteria, async 3-minute local-run video, four SerpApi developer advocates.

## 1. Demo script (≤ 3:00)
0:00 “1.73 lakh complaints, ₹2,100 crore lost calling numbers found on Google.” Grid already populated for HDFC Bank. · 0:10 click **Sweep now**; cells fill Mumbai → Kolkata; a red chip lands and pulses. · 0:35 click the red chip: drawer shows six named signals, the Maps listing “HDFC Bank Customer Care Number” with 3 reviews, unclaimed, the replay link. · 1:00 Scam network: the same number draws edges to Zomato and IndiGo. · 1:25 unhappy path: the official number republished by an aggregator is green; the newspaper landline is yellow “needs review” and not in the pack. · 1:50 **Download takedown pack** → open report.md. · 2:15 `make verify` prints PASS lines. · 2:40 credits: 22 calls, 0 live, replay badge; “Add a key and `make record` replaces every fixture.”

## 2. Screen inventory
| id | route | purpose | entered from | primary action | states |
|---|---|---|---|---|---|
| S1 | / | Sweep console | load, ?demo=1 | Sweep now | populated, running, empty, error |
| S2 | / (drawer) | Finding detail | chip or row click | In takedown pack | fake, review, official, official_unlisted |
| S3 | / (view=network) | Scam network | top nav | click a number | populated, empty |
| S4 | /_kit | Component kit | direct | — | every component in every state |

## 3. Flow map
S1 --Sweep now--> S1(running) --done--> S1(populated) ; S1 --chip click--> S2 --Esc--> S1 ; S1 --Scam network--> S3 --number click--> S2 ; S1 --Download pack--> zip

## 4. Screens
**S1:** top bar 48 · rail 280 (brand list, official numbers, city chips, reverse limit, Sweep button, recent sweeps) · main: KPI strip [Fake][Review][Official][Coverage][Calls] + pack button · grid rows = cities + “National”, columns = Search · People also ask · Maps & local pack · Ads · findings table | network card · run log. First 10 s: the latest stored sweep is on screen; `?demo=1` starts a new sweep at once. Data: `/api/sweeps/stream` (SSE), fixtures in replay.

## 5. Components
### C-01 SweepButton (custom)
Purpose: start the sweep for the selected brand and cities. Placement: rail, below cities, full width. Size: h40, r-md, Martian Mono label. States: idle “Sweep now” · running “Sweeping… 12/22” (aria-busy, disabled) · after a sweep “Sweep again” · disabled when no city is selected (tooltip “Pick at least one city”). Transitions: idle -CLICK-> running -DONE-> idle(again) ; running -ERROR-> idle with banner. Motion: label morph (T-01).
### C-02 GridCell
Purpose: what a victim in this city sees on this surface. States: pending (skeleton 2 bars) · done with chips · done empty (“—”) · failed (danger dashed border + reason). Chips: C-03. Acceptance: `?state=empty` renders an empty grid with the seeded hint.
### C-03 VerdictChip
Purpose: one number, one verdict. h24, r-sm, mono 12px, leading 6px dot. Tones: fake (danger 16%), review (warning 14%), official (success 14%), official_unlisted (dashed). `landed` adds one 700 ms pulse (T-02). Click opens C-05.
### C-04 KpiTile
Fake / Review / Official / Coverage / Calls. Numbers in mono. Coverage shows “4 / 5 cities” in warning when any call failed.
### C-05 FindingDrawer
480 px right drawer on a 40% scrim, spring 0.3/0. Sections: header (display, verdict, score bar) · Why (signals with +weight) · Seen on (observations: surface, city, source link, listing meta, replay link or “synthetic fixture”) · Reverse lookup hits · Actions: switch “In takedown pack” (only fake/review), “Mark as official” (secondary, re-classifies). Esc closes.
### C-06 NetworkGraph
SVG, d3-force layout run to rest before paint. Brand nodes amber r18 with labels; number nodes r8 + 4·brands, tone by verdict; edges draw on (T-03). Hover shows label; click opens C-05 when the number is in the current sweep.
### C-07 RunLog
Mono 12/18, last 80 lines, auto-scroll, icons ✓ ✗ · ⚠. Each line names the surface, city and query.
### C-08 PackButton
“Download takedown pack (3)”; disabled with reason when nothing is in the pack. GET `/api/sweeps/{id}/pack.zip`.

## 6. Choreography
| id | trigger | from → to | what moves | pattern | timing |
|---|---|---|---|---|---|
| T-01 | sweep click / progress | button label | text crossfades, width locked | morphing label | 180 ms |
| T-02 | findings event | grid cell | new chips fade in 8px, fake chips pulse once | draw-on | 200 ms + 700 ms pulse |
| T-03 | network mount | SVG edges | stroke draws 0→1, 40 ms stagger | draw-on | 600 ms |
| T-04 | chip click | drawer | slides in from right on scrim | drawer | spring .3 / 0 |

## 7. State machines
Sweep: idle → running (SSE open) → done | error. Cell: pending → done | failed. Finding: as classified → (mark official) official → sweep reloaded. Pack toggle: in_pack true/false, only for fake/review.

## 8. Copy deck
“Sweep now” · “Sweeping… n/N” · “Sweep again” · “Pick at least one city” · “No recorded result for this query yet (replay mode). Add a SerpApi key to fetch it live.” · “No sweeps for this brand yet.” · “Nothing in the pack yet. Open a red finding and keep it in the pack.” · “Same number also posing as Zomato, IndiGo” · “Replay this search on SerpApi” · “Synthetic fixture — demo data, not evidence”.

## 9. Brand
Mark: a handset silhouette with an amber “watch” dot at the earpiece (public/icon.svg, 48-grid, 2 primitives). Wordmark: Schibsted Grotesk 700 “Helpline Watch”. Favicon SVG only (theme-aware).

## 10. Don'ts
No red outside the fake verdict. No spinner for the sweep; the grid and log are the progress. No login. No confetti.

## 11. Acceptance
`?state=empty|error` render; every chip tone visible on `/_kit`; keyboard path: Tab to Sweep now → Enter → Tab to a chip → Enter opens drawer → Esc closes; no console errors; no horizontal page scroll at 390.

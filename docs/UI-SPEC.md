---
name: Helpline Watch
design: ./DESIGN.md
direction: "derived: the annotated printout (grey desk, white search-result sheets, red pen, highlighter, green tick, Kalam pen notes)"
personality: precise
dials: { variance: 4, motion: 3, density: 7 }
stack: { vite: 8, react: 19.2, tailwind: 4.3, motion: 13, d3-force: 3, backend: "FastAPI + SSE, SERP snapshots per call" }
archetype: agent-console with a document hero
viewports: [390x844, 1024x768, 1440x900]
signature: "A red pen circle draws itself around a number on the results page the moment the sweep proves it fake; the case file is stamped when the pack is ready"
demo: { seed: "make seed", flag: "?demo=1", state_param: "?state=", reset: "reload", guest: true }
deviations:
  - "No command palette and no route transitions: one desk, one drawer."
  - "No KPI tiles: the counts are one sentence in the case file, because big numerals with small labels are the default treatment."
  - "Result titles and URLs use link blue and a green URL colour inside the sheet only, so the printout reads as a search page; the app chrome never uses them."
---

## 0. Idea brief
- **User and moment:** a fraud or brand-protection analyst at a bank or fintech, at a desk, before customers start calling a planted number.
- **Core loop verb:** sweep.
- **Hero object:** the Google results page a victim in each city is shown, rendered from SerpApi's blocks (ads, answer box, local pack, knowledge panel, organic results, People also ask, Maps listings).
- **World inventory:** printed search results, a red pen, a yellow highlighter, a rubber stamp, the cybercrime.gov.in complaint form.
- **Moving data:** sheets fill city by city as searches return; red circles draw around numbers as verdicts land; the stamp lands when the pack is ready.
- **Wow moment:** the same number circled on Mumbai's, Delhi's and Kolkata's sheets, then shown touching three brands.
- **Artifact:** the takedown pack.
- **Judging:** five unweighted criteria, async 3-minute local-run video, four SerpApi developer advocates.

## 1. Demo script (≤ 3:00)
0:00 "1.73 lakh complaints, ₹2,100 crore lost calling numbers found on Google." The Mumbai sheet is on screen, already marked. · 0:10 click **Sweep again**; tabs breathe, pages return, a red circle draws around +91 74110 29385 in the Places box. · 0:35 click the circled number: the evidence slip shows seven reasons, the listing, the Hindi page, the replay link. · 1:00 in the case file, hover the number in the cross-brand graph: HDFC Bank, Zomato and IndiGo. · 1:25 the unhappy path: the aggregator's copy of 1800 1600 1600 has a green tick; 022 6160 6161 on hdfcbank.com is dashed green; 033 4040 1188 from a newspaper is highlighted "check" and is not in the pack. · 1:50 the stamp: **Download takedown pack (3)**, open report.md. · 2:15 `make verify`. · 2:40 "22 searches, none live. Add a key and `make record` replaces every fixture."

## 2. Screen inventory
| id | route | purpose | entered from | primary action | states |
|---|---|---|---|---|---|
| S1 | / | The desk: sheets + case file | load, ?demo=1 | Sweep now | populated, running, empty, error |
| S2 | / (drawer) | Evidence slip for one number | mark, ledger row, graph node | Keep in the takedown pack | fake, review, official, official_unlisted |
| S3 | /_kit | Component kit | direct | — | every component in every state |

## 3. Flow map
S1 --Sweep now--> S1(running) --done--> S1(populated, stamped) ; S1 --mark click--> S2 --Esc--> S1 ; S1 --city tab--> S1(other sheet) ; S1 --page chip--> S1(other page) ; S1 --Download pack--> zip

## 4. Screens
**S1:** top strip 56 · heading row (sentence h1, cities and official numbers in prose, "Change brand or cities" toggle, ink button) · optional setup sheet (brand and city choices, earlier sweeps) · folder tabs (one per swept city) · the active sheet · the case file at right (summary sentence, ledger, since last sweep, advertisers, cross-brand graph, takedown pack with stamp, search log). First 10 s: the latest stored sweep with the Mumbai sheet marked; `?demo=1` starts a sweep at once.

## 5. Components
### C-01 SweepButton (custom, ink)
States: idle "Sweep now" · running "Sweeping, 12 of 22" (aria-busy, disabled) · after a sweep "Sweep again" · disabled with tooltip "Pick at least one city". Transitions: idle -CLICK-> running -DONE-> again ; running -ERROR-> idle + alert sheet. Motion: label crossfade 180 ms.
### C-02 CityTab (folder tab)
States: idle (desk-deep) · selected (paper, connected to the sheet) · pending (breathing dot) · clean (green dot) · fakes (red count) · failed (dashed red border, reason in the sheet). Keyboard: Tab to focus, Enter/Space selects.
### C-03 PageChip
One per page of a city: each query, the Hindi search, Google Maps. Selected = ink; a red count shows circled numbers on that page. Pending pages appear as breathing chips; failed pages as dashed red "no result".
### C-04 Sheet
The printout. Header line "Searched from Mumbai, Maharashtra, on google.co.in" plus the pen note "demo fixture, not evidence" or the "Replay this search on SerpApi" link. Body: query bar, then blocks in Google's order. Empty: "Nothing on this page." Loading: three skeleton lines. Failed: the page chip shows the reason.
### C-05 Mark
A number as the analyst marks it. fake: red ellipse drawn with `pathLength` 0→1 in 420 ms when it lands, Kalam "fake" beside it when the number stands alone; review: highlighter stroke; official: green underline and tick; official_unlisted: dashed green. It is a button; Enter opens C-07.
### C-06 CaseFile
Summary sentence · ledger rows (number with its mark, reason, cities, "in pack") · since-last-sweep sentence · advertisers with "not the brand" pen notes · cross-brand graph · takedown pack with the stamp and ink button · collapsible search log.
### C-07 EvidenceSlip (drawer)
520 px, spring 0.3/0, scrim 32% ink. Header: number with red circle or highlighter, one-sentence verdict. Sections: Why (pen "+n" per signal), Where it appeared (surface, city, listing, source, quote, replay link), Searching for the number itself, actions: "Keep in the takedown pack" checkbox, "Mark as official" paper button. Esc closes.
### C-08 Stamp
Round red stamp "TAKEDOWN PACK / READY TO FILE / n", multiply blend, rotated −9°, enters with scale 1.25→1 in 220 ms once, when a finished sweep has at least one number in the pack.
### C-09 Network
d3-force run to rest before paint, compact with x/y forces; brand nodes ink circles, fake numbers red pen ellipses, review numbers highlighter dots; labels with a paper halo; edges draw on with 40 ms stagger. Click a number to open C-07.

## 6. Choreography
| id | trigger | from → to | what moves | pattern | timing |
|---|---|---|---|---|---|
| T-01 | sweep click / done | button label | crossfade | morphing label | 180 ms |
| T-02 | verdict lands | sheet, ledger | red ellipse draws around the number | draw-on | 420 ms ease-out |
| T-03 | sweep done with pack ≥ 1 | case file | stamp lands | stamp | 220 ms ease-out |
| T-04 | mark click | drawer | evidence slip slides in on scrim | drawer | spring .3 / 0 |
| T-05 | graph mount | edges | stroke 0→1, 40 ms stagger | draw-on | 700 ms |

## 7. State machines
Sweep: idle → running (SSE) → done | error. Tab: idle → pending → done (clean | fakes) | failed. Page chip: pending → done | failed. Finding: as classified → (mark official) official, sweep re-checked with pack and reverse evidence kept. Pack: in_pack toggles for fake and review only.

## 8. Copy deck
"Sweep now", "Sweeping, 12 of 22", "Sweep again", "Pick at least one city", "What a victim searching for HDFC Bank is shown", "Searched from Mumbai, Maharashtra, on google.co.in", "demo fixture, not evidence", "Replay this search on SerpApi", "Nothing swept for HDFC Bank yet.", "Nothing on this page.", "No recorded result for this query yet (replay mode). Add a SerpApi key to fetch it live.", "Not the brand's number", "Not on the list, needs a look", "Keep in the takedown pack", "Mark as official", "Download takedown pack (3)", "Nothing in the pack. Open a circled number and keep it."

## 9. Brand
Mark: a printout with three ruled lines and a red pen circle (public/icon.svg, 48-grid, three primitives). Wordmark: Host Grotesk 700 "Helpline Watch". Theme colour: the desk.

## 10. Don'ts
No red outside the pen. No KPI tiles. No uppercase labels outside the stamp. No middle-dot meta strings. No spinner for the sweep: the tabs, page chips and log are the progress.

## 11. Acceptance
`?state=empty|error` render; every mark tone on `/_kit`; keyboard path Tab → Sweep → Enter → Tab to a circled number → Enter opens the slip → Esc closes; no console errors; no horizontal page scroll at 390; `node scripts/qa.mjs` prints four true/0 lines.

---
name: Helpline Watch
design: ./DESIGN.md
direction: "Operate-mode workbench on Radix Themes: neutral shell, semantic verdict colours, marks drawn onto rendered result pages"
personality: precise
dials: { variance: 2, motion: 2, density: 7 }
stack: { vite: 8, react: 19.2, radix-themes: 3.3, phosphor-icons: 2.1, tailwind: 4.3, motion: 13, d3-force: 3, backend: "FastAPI + SSE with per-call page snapshots" }
archetype: two-pane console (list + detail with tabs)
viewports: [390x844, 1024x768, 1440x900]
signature: "Verdict marks drawn onto the page a victim saw; the number is the loudest thing on screen"
demo: { seed: "make seed", flag: "?demo=1", state_param: "?state=", reset: "reload", guest: true }
deviations:
  - "No command palette: three actions (sweep, open, download) plus arrow keys and Esc."
  - "No pen metaphor, stamps or handwriting: replaced by badges and inline marks so a category-fluent analyst trusts every control."
---

## 0. Idea brief
User: a fraud analyst at a desk, wide monitor, many brands a week. Verb: sweep. Hero object: the rendered result page per city with verdict marks. Moving data: the progress line, findings appearing in the list, marks flashing as verdicts land. Wow moment: one number marked FAKE on three cities' pages and touching three brands in the graph. Artifact: the takedown pack.

## 1. Demo script (≤ 3:00)
0:00 stat over the populated console. 0:10 Sweep: progress line, findings fill, Pages tab fills city by city with FAKE marks. 0:35 click a FAKE mark: Evidence tab with seven weighted reasons and the sighting cards. 1:00 Across brands: hover the shared number. 1:25 back to Pages, Kolkata: green ticks on the official number, amber Check on the newspaper landline, dashed green Unlisted on hdfcbank.com. 1:50 Download takedown pack, open report.md. 2:15 make verify. 2:40 Replay badge, 22 searches none live, make record.

## 2. Screen inventory
| id | route | purpose | entered from | primary action | states |
|---|---|---|---|---|---|
| S1 | / | Workbench | load, ?demo=1 | Sweep | populated, running, empty, error |
| S1.E | Evidence tab | one number's case | list row, mark, graph node | Keep in the pack | fake, check, official, unlisted |
| S1.P | Pages tab | the page a victim saw | default after a sweep | pick city and page | pages, pending, failed, none |
| S1.N | Across brands | shared numbers | tab | click a number | populated, empty |
| S1.L | Log | searches in order | tab | none | running, done, empty |
| S4 | /_kit | Component kit | direct | none | all |

## 3. Flow map
S1 --Sweep--> S1(running) --done--> S1.P ; row or mark --> S1.E ; Esc --> clear selection ; ↑↓ --> move selection ; Download pack --> zip

## 4. Screens
S1: app bar, progress line, findings pane (title with count, filter segmented control, rows, footer with pack button and key hints), detail pane (brand heading with the summary sentence and official numbers, tabs, content). Mobile: panes stack.

## 5. Components
C-01 SweepButton: Radix Button highContrast; idle "Sweep", running "Sweeping n of N" with loading spinner, done "Sweep again", disabled when no city. · C-02 FindingsRow: role option, aria-selected; number size 3 coloured by verdict, Badge, meta (cities, in pack), reason line truncated; hover gray-a3, selected gray-a4 with 3 px rule; ↑↓ moves. · C-03 Filter: SegmentedControl All / Fake n / Check n / Official. · C-04 PackButton: Button asChild anchor with count, disabled with reason text. · C-05 CitySwitch: SegmentedControl with pending ellipsis or red fake count. · C-06 PageBadges: Badge buttons per page with red counts; pending as Skeleton badges; failed as ruby outline with the reason. · C-07 Page: Card with source line, query, fixture or replay badge, then blocks. · C-08 Mark: inline number with verdict styling and a FAKE tag when the number stands alone; landed flash 500 ms. · C-09 Evidence: heading size 7, Badge, sentence, Switch "Keep in the pack", soft "Mark as official", Why DataList, sighting Cards, reverse lookup, all sightings. · C-10 Network: d3-force, ruby fill for fakes, amber for check, labels haloed and offset. · C-11 Log: timestamped lines. · C-12 Error: Callout ruby with "Sweep again". · C-13 Empty: Card with sentence and Sweep button.

## 6. Choreography
| id | trigger | what moves | timing |
|---|---|---|---|
| T-01 | sweep progress | 2 px line width | 240 ms ease-out |
| T-02 | verdict lands | mark background ruby-a6 → a3 | 500 ms |
| T-03 | selection | row background and rule | 120 ms |
| T-04 | graph mount | edges draw on, 30 ms stagger | 600 ms |

## 7. State machines
Sweep idle → running → done | error. Row idle → hover → selected. Page pending → done | failed. Finding as classified → official (re-check keeps pack and reverse evidence).

## 8. Copy deck
"Sweep", "Sweeping 12 of 22", "Sweep again", "Findings", "6 numbers", "Fake", "Check", "Official", "Unlisted", "Keep in the pack", "Mark as official", "Download takedown pack (3)", "Fakes are added to the pack automatically; open one to keep or remove it.", "Nothing swept yet. Run a sweep to see every number a victim would be shown.", "Demo fixture, not evidence", "Replay this search on SerpApi", "Not searched. Only the top suspects are, to save credits.", "The connection to the sweep was lost. Nothing was filed. Sweep again to continue."

## 9. Brand
Mark: rounded ink square with a white handset and a red dot (public/icon.svg). Wordmark in Host Grotesk 700.

## 10. Don'ts
No colour outside verdicts. No eyebrows, tiles, gradients, glass, custom controls. No decorative motion.

## 11. Acceptance
Keyboard: Tab to Sweep, Enter, ↓ selects, Esc clears. No page-level horizontal scroll at 390. No console errors. Both appearances checked. `node scripts/qa.mjs` prints four passing lines.

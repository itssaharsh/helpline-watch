# Graph Report - hack  (2026-09-23)

## Corpus Check
- 161 files · ~89,327 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 4, .css 2, .example 1)

## Summary
- 1177 nodes · 4085 edges · 51 communities (43 shown, 8 thin omitted)
- Extraction: 83% EXTRACTED · 17% INFERRED · 0% AMBIGUOUS · INFERRED: 681 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1e24c569`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- models.py
- sweep.py
- test_phones.py
- Store
- api.py
- takedown.py
- a
- App.tsx
- helpline-watch
- index-Cf2zZMzb.js
- Brand
- package.json
- constructor
- get
- n
- .addEventListener
- forEach
- t
- add
- cli.py
- mount
- yl
- qd
- r
- UI-SPEC.md
- compilerOptions
- i
- compilerOptions
- hh
- or
- cn
- Ii
- Helpline Watch
- k
- wu
- DESIGN.md
- Br
- lm
- .oxlintrc.json
- ADR 0001 — A thin SerpApi client with record/replay instead of the SDK
- ADR 0002 — Deterministic signals; no LLM in the verdict path
- ADR 0003 — Read tools free, the takedown pack is gated by a person
- ADR 0004 — One Python process serves the built React UI
- React + TypeScript + Vite
- tsconfig.json
- AGENTS.md
- CLAUDE.md
- demo-script.md

## God Nodes (most connected - your core abstractions)
1. `n()` - 123 edges
2. `t()` - 117 edges
3. `i()` - 112 edges
4. `r()` - 93 edges
5. `a()` - 65 edges
6. `o()` - 60 edges
7. `e()` - 57 edges
8. `pl()` - 45 edges
9. `s()` - 45 edges
10. `Brand` - 42 edges

## Surprising Connections (you probably didn't know these)
- `Decision` --references--> `CallBudget`  [INFERRED]
  docs/adr/0001-thin-serpapi-client-with-record-replay.md → backend/helpline_watch/serp/client.py
- `Meaningful SerpApi usage` --references--> `ll()`  [INFERRED]
  README.md → backend/helpline_watch/static/assets/index-Cf2zZMzb.js
- `main()` --uses--> `Services`  [INFERRED]
  scripts/validate.py → backend/helpline_watch/api.py
- `run_sweep()` --uses--> `Services`  [INFERRED]
  scripts/validate.py → backend/helpline_watch/api.py
- `main()` --calls--> `load_settings()`  [EXTRACTED]
  scripts/validate.py → backend/helpline_watch/config.py

## Import Cycles
- None detected.

## Communities (51 total, 8 thin omitted)

### Community 0 - "models.py"
Cohesion: 0.09
Nodes (56): apply_reverse(), classify(), _helpline_context(), official_norms(), Signals → verdict. Deterministic; every point on the score has a named reason.…, Fold reverse-lookup evidence into a finding and re-score it., Group observations by number and decide each one. `cross_brand` maps number →…, _signals_for() (+48 more)

### Community 1 - "sweep.py"
Cohesion: 0.08
Nodes (35): AsyncClient, AdvertiserFinding, CityCoverage, BaseModel, SweepEvent, BudgetExceeded, CallBudget, fixture_key() (+27 more)

### Community 2 - "test_phones.py"
Cohesion: 0.12
Nodes (32): _classify_digits(), digit_distance(), display(), extract(), is_transposition(), normalise(), ParsedNumber, Find and normalise Indian phone numbers in free text. Handles +91 / 0091 / 0… (+24 more)

### Community 3 - "Store"
Cohesion: 0.16
Nodes (9): Sweep, Path, SQLite persistence: sweeps, the cross-brand observation index, and analyst-…, Numbers ↔ brands graph across the latest sweep of every brand., Other brands each number has been seen posing as (from any earlier sweep)., Store, collections, contextlib (+1 more)

### Community 4 - "api.py"
Cohesion: 0.06
Nodes (35): BrandIn, _count_fixtures(), create_app(), cities(), get_sweep(), health(), pack(), patch_finding() (+27 more)

### Community 5 - "takedown.py"
Cohesion: 0.18
Nodes (17): asyncio, Finding, build_pack(), _complaint_template(), maps_place_url(), Build the takedown pack: the artifact an analyst actually files. ZIP containing…, _report_md(), _surface_action() (+9 more)

### Community 6 - "a"
Cohesion: 0.06
Nodes (113): af(), am(), Au(), be(), bm(), cf(), cl(), clearAnimation() (+105 more)

### Community 7 - "App.tsx"
Cohesion: 0.06
Nodes (73): App(), Console(), FORCED, params, Tag(), VerdictChip(), cities(), Drawer() (+65 more)

### Community 12 - "index-Cf2zZMzb.js"
Cohesion: 0.04
Nodes (40): ah(), animation(), ap(), Ar(), ch(), Dt(), duration(), eh() (+32 more)

### Community 13 - "Brand"
Cohesion: 0.10
Nodes (38): Services, Brand, City, ads_params(), autocomplete_call(), build_plan(), choose_queries(), maps_params() (+30 more)

### Community 14 - "package.json"
Cohesion: 0.05
Nodes (42): dependencies, d3-force, motion, react, react-dom, tailwindcss, @tailwindcss/vite, @types/d3-force (+34 more)

### Community 15 - "constructor"
Cohesion: 0.07
Nodes (39): attachTimeline(), Bn(), build(), cancel(), constructor(), destroy(), dirty(), ei() (+31 more)

### Community 16 - "get"
Cohesion: 0.11
Nodes (38): addListeners(), ai(), ba(), Ci(), ed(), eu(), Fu(), get() (+30 more)

### Community 17 - "n"
Cohesion: 0.14
Nodes (34): ae(), bt(), c(), Ct(), Do(), el(), Eo(), gt() (+26 more)

### Community 18 - ".addEventListener"
Cohesion: 0.13
Nodes (20): b(), Bp(), h(), em(), fp(), Gp(), jp(), lp() (+12 more)

### Community 19 - "forEach"
Cohesion: 0.12
Nodes (28): as(), at(), bs(), cc(), cs(), ds(), es(), forEach() (+20 more)

### Community 20 - "t"
Cohesion: 0.17
Nodes (27): al(), dl(), Ea(), fl(), ga(), Jr(), ll(), ml() (+19 more)

### Community 21 - "add"
Cohesion: 0.10
Nodes (25): add(), addVariantChild(), cd(), ce(), clear(), clearListeners(), componentDidMount(), componentDidUpdate() (+17 more)

### Community 22 - "cli.py"
Cohesion: 0.13
Nodes (22): brands(), eval(), Path, `helpline-watch` command line: serve the UI, run or record sweeps, print the…, Replay all seed brands and print the proof table (the numbers the README…, Start the API and UI on one port., List brands (seeded + custom)., Run one sweep and print the findings table. (+14 more)

### Community 23 - "mount"
Cohesion: 0.12
Nodes (24): addValue(), bindToMotionValue(), createPanHandlers(), Fi(), getStaticValue(), getValue(), Gr(), hasValue() (+16 more)

### Community 24 - "yl"
Cohesion: 0.13
Nodes (24): bl(), Ca(), ep(), fa(), gl(), gn(), hl(), hm() (+16 more)

### Community 25 - "qd"
Cohesion: 0.18
Nodes (23): ad(), Bd(), d(), ef(), Fd(), Gd(), Hd(), hf() (+15 more)

### Community 26 - "r"
Cohesion: 0.19
Nodes (22): ac(), bc(), cm(), Da(), dc(), ec(), fc(), ic() (+14 more)

### Community 27 - "UI-SPEC.md"
Cohesion: 0.10
Nodes (20): 0. Idea brief, 10. Don'ts, 11. Acceptance, 1. Demo script (≤ 3:00), 2. Screen inventory, 3. Flow map, 4. Screens, 5. Components (+12 more)

### Community 28 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 29 - "i"
Cohesion: 0.18
Nodes (17): aa(), de(), Du(), ee(), _f(), fe(), gf(), gs() (+9 more)

### Community 30 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 31 - "hh"
Cohesion: 0.18
Nodes (15): bh(), hh(), t(), Ih(), mh(), Mi(), nh(), ph() (+7 more)

### Community 32 - "or"
Cohesion: 0.15
Nodes (15): complete(), Di(), measure(), measureEndState(), measureInitialState(), measureInstanceViewportBox(), measureViewportBox(), or() (+7 more)

### Community 33 - "cn"
Cohesion: 0.25
Nodes (14): an(), cn(), dn(), fn(), ln(), nn(), on(), onChange() (+6 more)

### Community 34 - "Ii"
Cohesion: 0.15
Nodes (14): bo(), dh(), dr(), fr(), getBaseTarget(), getBaseTargetFromProps(), Go(), handleChildMotionValue() (+6 more)

### Community 35 - "Helpline Watch"
Cohesion: 0.14
Nodes (13): AI disclosure, Demo video, Go live, Helpline Watch, How it works, License, Limitations, Meaningful SerpApi usage (+5 more)

### Community 36 - "k"
Cohesion: 0.33
Nodes (10): Ao(), co(), dp(), h(), jo(), k(), Lo(), ne() (+2 more)

### Community 37 - "wu"
Cohesion: 0.31
Nodes (9): bu(), Cp(), Cu(), gm(), Lu(), nm(), removeChild(), Rt() (+1 more)

### Community 38 - "DESIGN.md"
Cohesion: 0.22
Nodes (8): Colors, Components, Do's and Don'ts, Elevation & Depth, Layout, Overview, Shapes, Typography

### Community 39 - "Br"
Cohesion: 0.36
Nodes (8): Br(), Hr(), Mr(), Nr(), Ur(), Vr(), Wr(), zr()

### Community 40 - "lm"
Cohesion: 0.33
Nodes (7): dm(), ha(), im(), lm(), ma(), pp(), rm()

### Community 41 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 42 - "ADR 0001 — A thin SerpApi client with record/replay instead of the SDK"
Cohesion: 0.40
Nodes (4): ADR 0001 — A thin SerpApi client with record/replay instead of the SDK, Consequences, Context, Decision

### Community 43 - "ADR 0002 — Deterministic signals; no LLM in the verdict path"
Cohesion: 0.40
Nodes (4): ADR 0002 — Deterministic signals; no LLM in the verdict path, Consequences, Context, Decision

### Community 44 - "ADR 0003 — Read tools free, the takedown pack is gated by a person"
Cohesion: 0.40
Nodes (4): ADR 0003 — Read tools free, the takedown pack is gated by a person, Consequences, Context, Decision

### Community 45 - "ADR 0004 — One Python process serves the built React UI"
Cohesion: 0.40
Nodes (4): ADR 0004 — One Python process serves the built React UI, Consequences, Context, Decision

### Community 46 - "React + TypeScript + Vite"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + TypeScript + Vite

## Knowledge Gaps
- **145 isolated node(s):** `helpline-watch`, `$schema`, `plugins`, `react/rules-of-hooks`, `react/only-export-components` (+140 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 280 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `w()` connect `a` to `forEach`, `index-Cf2zZMzb.js`, `i`, `package.json`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `react` connect `App.tsx` to `package.json`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Are the 88 inferred relationships involving `n()` (e.g. with `aa()` and `ac()`) actually correct?**
  _`n()` has 88 INFERRED edges - model-reasoned connections that need verification._
- **Are the 74 inferred relationships involving `t()` (e.g. with `ac()` and `al()`) actually correct?**
  _`t()` has 74 INFERRED edges - model-reasoned connections that need verification._
- **Are the 37 inferred relationships involving `i()` (e.g. with `b()` and `c()`) actually correct?**
  _`i()` has 37 INFERRED edges - model-reasoned connections that need verification._
- **Are the 74 inferred relationships involving `r()` (e.g. with `af()` and `ai()`) actually correct?**
  _`r()` has 74 INFERRED edges - model-reasoned connections that need verification._
- **Are the 41 inferred relationships involving `a()` (e.g. with `af()` and `bs()`) actually correct?**
  _`a()` has 41 INFERRED edges - model-reasoned connections that need verification._
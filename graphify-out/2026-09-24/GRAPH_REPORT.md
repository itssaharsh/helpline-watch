# Graph Report - hack  (2026-09-23)

## Corpus Check
- 160 files · ~89,661 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 4, .css 2, .example 1)

## Summary
- 1203 nodes · 4179 edges · 49 communities (41 shown, 8 thin omitted)
- Extraction: 83% EXTRACTED · 17% INFERRED · 0% AMBIGUOUS · INFERRED: 693 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `50ddb425`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- surfaces.py
- client.py
- test_phones.py
- Store
- api.py
- get
- index-BJG6opQh.js
- App.tsx
- helpline-watch
- n
- Brand
- package.json
- o
- yl
- mo
- r
- a
- constructor
- e
- cli.py
- sweep.py
- start
- add
- k
- UI-SPEC.md
- compilerOptions
- oo
- compilerOptions
- on
- mount
- readKeyframes
- de
- Helpline Watch
- Br
- getSnapshotBeforeUpdate
- DESIGN.md
- yu
- .oxlintrc.json
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
10. `Brand` - 43 edges

## Surprising Connections (you probably didn't know these)
- `Meaningful SerpApi usage` --references--> `ll()`  [INFERRED]
  README.md → backend/helpline_watch/static/assets/index-BJG6opQh.js
- `Decision` --references--> `CallBudget`  [INFERRED]
  docs/adr/0001-thin-serpapi-client-with-record-replay.md → backend/helpline_watch/serp/client.py
- `main()` --uses--> `Services`  [INFERRED]
  scripts/validate.py → backend/helpline_watch/api.py
- `run_sweep()` --uses--> `Services`  [INFERRED]
  scripts/validate.py → backend/helpline_watch/api.py
- `summarise()` --uses--> `Sweep`  [INFERRED]
  backend/helpline_watch/sweep.py → backend/helpline_watch/models.py

## Import Cycles
- None detected.

## Communities (49 total, 8 thin omitted)

### Community 0 - "surfaces.py"
Cohesion: 0.08
Nodes (61): apply_reverse(), classify(), _helpline_context(), merge_analyst_state(), official_norms(), Signals → verdict. Deterministic; every point on the score has a named reason.…, Fold reverse-lookup evidence into a finding and re-score it., Re-classification must not erase what the analyst and the reverse lookups… (+53 more)

### Community 1 - "client.py"
Cohesion: 0.09
Nodes (27): AsyncClient, BudgetExceeded, CallBudget, fixture_key(), FixtureMissing, Any, Path, Thin SerpApi client with three modes. live → HTTPS call to serpapi.com,… (+19 more)

### Community 2 - "test_phones.py"
Cohesion: 0.09
Nodes (45): _classify(), digit_distance(), display(), extract(), _grouped_like_landline(), _guess_kind(), is_transposition(), normalise() (+37 more)

### Community 3 - "Store"
Cohesion: 0.10
Nodes (24): pack(), Finding, Sweep, Path, SQLite persistence: sweeps, the cross-brand observation index, and analyst-…, Numbers ↔ brands graph across the latest sweep of every brand., Other brands each number has been seen for, split by that brand's verdict. A…, Store (+16 more)

### Community 4 - "api.py"
Cohesion: 0.07
Nodes (29): BrandIn, _count_fixtures(), create_app(), cities(), get_sweep(), health(), stream(), gen() (+21 more)

### Community 5 - "get"
Cohesion: 0.06
Nodes (68): am(), Au(), b(), bm(), Bp(), bu(), cn(), Cp() (+60 more)

### Community 6 - "index-BJG6opQh.js"
Cohesion: 0.04
Nodes (42): animation(), ap(), Ar(), ba(), ch(), Cr(), dr(), Er() (+34 more)

### Community 7 - "App.tsx"
Cohesion: 0.06
Nodes (72): App(), Console(), FORCED, params, Tag(), VerdictChip(), cities(), Drawer() (+64 more)

### Community 12 - "n"
Cohesion: 0.10
Nodes (58): aa(), as(), at(), bs(), bt(), cc(), cs(), Da() (+50 more)

### Community 13 - "Brand"
Cohesion: 0.11
Nodes (38): Brand, City, ads_params(), autocomplete_call(), build_plan(), choose_queries(), maps_params(), PlannedCall (+30 more)

### Community 14 - "package.json"
Cohesion: 0.04
Nodes (43): dependencies, d3-force, motion, react, react-dom, tailwindcss, @tailwindcss/vite, @types/d3-force (+35 more)

### Community 15 - "o"
Cohesion: 0.12
Nodes (52): af(), bc(), cf(), p(), df(), E(), eh(), ff() (+44 more)

### Community 16 - "yl"
Cohesion: 0.10
Nodes (40): ad(), Bd(), bl(), Ca(), d(), dd(), f(), m() (+32 more)

### Community 17 - "mo"
Cohesion: 0.11
Nodes (33): ac(), be(), bo(), Ci(), dh(), duration(), fo(), getDefaultTransition() (+25 more)

### Community 18 - "r"
Cohesion: 0.15
Nodes (34): c(), Ct(), dl(), Ea(), el(), fl(), ga(), Gc() (+26 more)

### Community 19 - "a"
Cohesion: 0.13
Nodes (33): al(), cl(), cm(), componentDidMount(), Do(), Eo(), eu(), Fu() (+25 more)

### Community 20 - "constructor"
Cohesion: 0.08
Nodes (33): attachTimeline(), Bn(), constructor(), dirty(), ei(), en(), end(), finish() (+25 more)

### Community 21 - "e"
Cohesion: 0.10
Nodes (31): ah(), bh(), Dt(), fh(), forEach(), s(), hh(), t() (+23 more)

### Community 22 - "cli.py"
Cohesion: 0.08
Nodes (34): asyncio, Services, brands(), eval(), Path, `helpline-watch` command line: serve the UI, run or record sweeps, print the…, Replay all seed brands and print the proof table (the numbers the README…, Start the API and UI on one port. (+26 more)

### Community 23 - "sweep.py"
Cohesion: 0.17
Nodes (16): AdvertiserFinding, CityCoverage, Observation, BaseModel, Domain model. Everything the pipeline passes around is one of these., One phone number seen once, somewhere., SweepEvent, The sweep: plan → fetch every surface per city → extract → classify → reverse-… (+8 more)

### Community 24 - "start"
Cohesion: 0.20
Nodes (21): addListeners(), cancel(), clearAnimation(), commitStyles(), endPanSession(), getAxisMotionValue(), getProps(), Na() (+13 more)

### Community 25 - "add"
Cohesion: 0.14
Nodes (18): add(), addVariantChild(), cd(), ce(), clear(), clearListeners(), componentWillUnmount(), destroy() (+10 more)

### Community 26 - "k"
Cohesion: 0.16
Nodes (18): Ao(), co(), dp(), ds(), fe(), fs(), h(), jo() (+10 more)

### Community 27 - "UI-SPEC.md"
Cohesion: 0.10
Nodes (20): 0. Idea brief, 10. Don'ts, 11. Acceptance, 1. Demo script (≤ 3:00), 2. Screen inventory, 3. Flow map, 4. Screens, 5. Components (+12 more)

### Community 28 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 29 - "oo"
Cohesion: 0.16
Nodes (17): addValue(), Fi(), getStaticValue(), getValue(), hasValue(), measure(), measureEndState(), measureInitialState() (+9 more)

### Community 30 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 31 - "on"
Cohesion: 0.15
Nodes (17): an(), build(), dn(), ep(), fn(), handleChildMotionValue(), ln(), nn() (+9 more)

### Community 32 - "mount"
Cohesion: 0.23
Nodes (13): bindToMotionValue(), createPanHandlers(), Gr(), jump(), mount(), onBlur(), onFocus(), onPointerDown() (+5 more)

### Community 33 - "readKeyframes"
Cohesion: 0.18
Nodes (11): complete(), Di(), getBaseTarget(), getBaseTargetFromProps(), play(), readKeyframes(), readValue(), resume() (+3 more)

### Community 34 - "de"
Cohesion: 0.24
Nodes (10): ai(), de(), ee(), Jr(), oe(), qr(), sc(), t() (+2 more)

### Community 35 - "Helpline Watch"
Cohesion: 0.14
Nodes (13): AI disclosure, Demo video, Go live, Helpline Watch, How it works, License, Limitations, Meaningful SerpApi usage (+5 more)

### Community 36 - "Br"
Cohesion: 0.36
Nodes (8): Br(), Hr(), Mr(), Nr(), Ur(), Vr(), Wr(), zr()

### Community 37 - "getSnapshotBeforeUpdate"
Cohesion: 0.50
Nodes (5): componentDidUpdate(), getSnapshotBeforeUpdate(), promote(), relegate(), safeToRemove()

### Community 38 - "DESIGN.md"
Cohesion: 0.22
Nodes (8): Colors, Components, Do's and Don'ts, Elevation & Depth, Layout, Overview, Shapes, Typography

### Community 39 - "yu"
Cohesion: 0.50
Nodes (4): ae(), re(), Xu(), yu()

### Community 41 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

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
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 285 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `w()` connect `de` to `package.json`, `e`, `index-BJG6opQh.js`, `o`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
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
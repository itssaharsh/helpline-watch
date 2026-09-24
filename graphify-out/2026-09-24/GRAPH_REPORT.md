# Graph Report - hack  (2026-09-24)

## Corpus Check
- 158 files · ~95,283 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 4, .css 2, .example 1)

## Summary
- 1211 nodes · 4242 edges · 55 communities (47 shown, 8 thin omitted)
- Extraction: 83% EXTRACTED · 17% INFERRED · 0% AMBIGUOUS · INFERRED: 722 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2ae16644`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- surfaces.py
- client.py
- test_phones.py
- Store
- api.py
- hl
- index-Dsrc0fW6.js
- types.ts
- helpline-watch
- n
- Brand
- package.json
- get
- go
- z
- constructor
- i
- takedown.py
- add
- cli.py
- models.py
- Fd
- o
- start
- UI-SPEC.md
- compilerOptions
- test_surfaces_and_classify.py
- compilerOptions
- s
- a
- gn
- classify.py
- Helpline Watch
- make_synthetic_fixtures.py
- so
- DESIGN.md
- Pr
- update
- .oxlintrc.json
- test_api.py
- ADR 0002 — Deterministic signals; no LLM in the verdict path
- ADR 0003 — Read tools free, the takedown pack is gated by a person
- ADR 0004 — One Python process serves the built React UI
- React + TypeScript + Vite
- tsconfig.json
- AGENTS.md
- CLAUDE.md
- demo-script.md
- pe
- readKeyframes
- then
- ADR 0001 — A thin SerpApi client with record/replay instead of the SDK

## God Nodes (most connected - your core abstractions)
1. `n()` - 126 edges
2. `t()` - 123 edges
3. `i()` - 116 edges
4. `r()` - 88 edges
5. `a()` - 73 edges
6. `o()` - 57 edges
7. `e()` - 56 edges
8. `s()` - 48 edges
9. `hl()` - 46 edges
10. `constructor()` - 45 edges

## Surprising Connections (you probably didn't know these)
- `Decision` --references--> `CallBudget`  [INFERRED]
  docs/adr/0001-thin-serpapi-client-with-record-replay.md → backend/helpline_watch/serp/client.py
- `Meaningful SerpApi usage` --references--> `ll()`  [INFERRED]
  README.md → backend/helpline_watch/static/assets/index-Dsrc0fW6.js
- `main()` --uses--> `Services`  [INFERRED]
  scripts/validate.py → backend/helpline_watch/api.py
- `run_sweep()` --uses--> `Services`  [INFERRED]
  scripts/validate.py → backend/helpline_watch/api.py
- `main()` --calls--> `load_settings()`  [EXTRACTED]
  scripts/validate.py → backend/helpline_watch/config.py

## Import Cycles
- None detected.

## Communities (55 total, 8 thin omitted)

### Community 0 - "surfaces.py"
Cohesion: 0.13
Nodes (29): _as_list(), _dicts(), _int(), _item(), _joined(), _listing(), _matches_brand(), _num() (+21 more)

### Community 1 - "client.py"
Cohesion: 0.11
Nodes (24): AsyncClient, BudgetExceeded, CallBudget, fixture_key(), FixtureMissing, Any, Path, Thin SerpApi client with three modes. live → HTTPS call to serpapi.com,… (+16 more)

### Community 2 - "test_phones.py"
Cohesion: 0.09
Nodes (44): _classify(), digit_distance(), display(), extract(), _grouped_like_landline(), _guess_kind(), is_transposition(), normalise() (+36 more)

### Community 3 - "Store"
Cohesion: 0.16
Nodes (9): Sweep, Path, SQLite persistence: sweeps, the cross-brand observation index, and analyst-…, Numbers ↔ brands graph across the latest sweep of every brand., Other brands each number has been seen for, split by that brand's verdict. A…, Store, collections, contextlib (+1 more)

### Community 4 - "api.py"
Cohesion: 0.09
Nodes (22): BrandIn, _count_fixtures(), create_app(), cities(), get_sweep(), health(), stream(), gen() (+14 more)

### Community 5 - "hl"
Cohesion: 0.06
Nodes (64): a(), al(), b(), ba(), Bc(), Bi(), bo(), Bp() (+56 more)

### Community 6 - "index-Dsrc0fW6.js"
Cohesion: 0.04
Nodes (42): Ad(), ah(), Ai(), ap(), At(), bh(), build(), ch() (+34 more)

### Community 7 - "types.ts"
Cohesion: 0.06
Nodes (68): App(), Desk(), FORCED, params, CaseFile(), count(), Props, Drawer() (+60 more)

### Community 12 - "n"
Cohesion: 0.09
Nodes (44): ac(), ao(), c(), cs(), dc(), Di(), ds(), ec() (+36 more)

### Community 13 - "Brand"
Cohesion: 0.15
Nodes (23): Brand, City, CityCoverage, SweepEvent, ads_params(), autocomplete_call(), build_plan(), choose_queries() (+15 more)

### Community 14 - "package.json"
Cohesion: 0.05
Nodes (42): dependencies, d3-force, motion, react, react-dom, tailwindcss, @tailwindcss/vite, @types/d3-force (+34 more)

### Community 15 - "get"
Cohesion: 0.08
Nodes (44): am(), bm(), bu(), componentDidMount(), componentDidUpdate(), Cp(), dd(), Du() (+36 more)

### Community 16 - "go"
Cohesion: 0.15
Nodes (35): aa(), Gi(), go(), c(), d(), f(), g(), h() (+27 more)

### Community 17 - "z"
Cohesion: 0.08
Nodes (36): bt(), cc(), ci(), Co(), Ct(), dh(), Es(), getDefaultTransition() (+28 more)

### Community 18 - "constructor"
Cohesion: 0.08
Nodes (35): Ar(), attachTimeline(), constructor(), dirty(), Dr(), end(), finish(), handleScroll() (+27 more)

### Community 19 - "i"
Cohesion: 0.14
Nodes (32): as(), bindToMotionValue(), bn(), Da(), fs(), r(), i(), jc() (+24 more)

### Community 20 - "takedown.py"
Cohesion: 0.10
Nodes (24): asyncio, pack(), Settings from environment. Validated once at startup; nothing reads os.environ…, Load seed brands and cities from YAML., build_pack(), _complaint_template(), maps_place_url(), Build the takedown pack: the artifact an analyst actually files. ZIP containing… (+16 more)

### Community 21 - "add"
Cohesion: 0.09
Nodes (28): add(), addVariantChild(), complete(), componentWillUnmount(), _e(), getClosestVariantNode(), getSize(), getSnapshotBeforeUpdate() (+20 more)

### Community 22 - "cli.py"
Cohesion: 0.10
Nodes (26): Services, brands(), eval(), Path, `helpline-watch` command line: serve the UI, run or record sweeps, print the…, Replay all seed brands and print the proof table (the numbers the README…, Start the API and UI on one port., List brands (seeded + custom). (+18 more)

### Community 23 - "models.py"
Cohesion: 0.19
Nodes (17): _observations_from_text(), provenance(), Finding, Observation, Provenance, Domain model. Everything the pipeline passes around is one of these., Where on Google a phone number was seen., Enough to replay the exact SerpApi search a fact came from. (+9 more)

### Community 24 - "Fd"
Cohesion: 0.14
Nodes (27): Bd(), cd(), d(), ef(), Fd(), f(), Gd(), gt() (+19 more)

### Community 25 - "o"
Cohesion: 0.15
Nodes (25): ae(), au(), ce(), ee(), m(), fh(), Hu(), iu() (+17 more)

### Community 26 - "start"
Cohesion: 0.22
Nodes (24): addListeners(), cancel(), clearAnimation(), commitStyles(), destroy(), endPanSession(), getAxisMotionValue(), getProps() (+16 more)

### Community 27 - "UI-SPEC.md"
Cohesion: 0.09
Nodes (21): 0. Idea brief, 10. Don'ts, 11. Acceptance, 1. Demo script (≤ 3:00), 2. Screen inventory, 3. Flow map, 4. Screens, 5. Components (+13 more)

### Community 28 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 29 - "test_surfaces_and_classify.py"
Cohesion: 0.25
Nodes (22): classify(), merge_analyst_state(), Re-classification must not erase what the analyst and the reverse lookups…, Group observations by number and decide each one. `cross_brand` maps number →…, patch_finding(), parse_google_maps(), parse_google_search(), Verdict (+14 more)

### Community 30 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 31 - "s"
Cohesion: 0.20
Nodes (22): af(), cf(), df(), Et(), ff(), jf(), kf(), s() (+14 more)

### Community 32 - "a"
Cohesion: 0.21
Nodes (21): bl(), ca(), cl(), Fo(), Fu(), Hi(), k(), kc() (+13 more)

### Community 33 - "gn"
Cohesion: 0.22
Nodes (19): an(), dn(), duration(), ep(), fe(), fn(), ga(), gn() (+11 more)

### Community 34 - "classify.py"
Cohesion: 0.18
Nodes (15): apply_reverse(), _helpline_context(), official_norms(), Signals → verdict. Deterministic; every point on the score has a named reason.…, Fold reverse-lookup evidence into a finding and re-score it., _signals_for(), _verdict(), contains_any() (+7 more)

### Community 35 - "Helpline Watch"
Cohesion: 0.13
Nodes (14): ll(), AI disclosure, Demo video, Go live, Helpline Watch, How it works, License, Limitations (+6 more)

### Community 36 - "make_synthetic_fixtures.py"
Cohesion: 0.24
Nodes (16): ad(), ads_transparency_response(), autocomplete_response(), lookalike(), main(), maps_response(), meta(), official_display() (+8 more)

### Community 37 - "so"
Cohesion: 0.25
Nodes (14): addValue(), ei(), getStaticValue(), getValue(), hasValue(), measure(), measureEndState(), measureInitialState() (+6 more)

### Community 38 - "DESIGN.md"
Cohesion: 0.22
Nodes (8): Colors, Components, Do's and Don'ts, Elevation & Depth, Layout, Overview, Shapes, Typography

### Community 39 - "Pr"
Cohesion: 0.22
Nodes (13): Br(), cn(), Fr(), Gr(), Hr(), Ir(), jr(), Kr() (+5 more)

### Community 40 - "update"
Cohesion: 0.27
Nodes (11): createPanHandlers(), Cu(), jump(), mount(), onBlur(), onFocus(), onPointerDown(), startObserver() (+3 more)

### Community 41 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 42 - "test_api.py"
Cohesion: 0.22
Nodes (8): client(), _events(), API tests run fully in replay mode against the committed fixtures., test_patch_finding_can_mark_official_and_toggle_pack(), test_stream_emits_plan_calls_findings_and_done(), fastapi_testclient, fixture, pytest

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

### Community 51 - "pe"
Cohesion: 0.22
Nodes (10): clear(), clearListeners(), dp(), en(), getVelocity(), ie(), oe(), pe() (+2 more)

### Community 52 - "readKeyframes"
Cohesion: 0.22
Nodes (10): getBaseTarget(), getBaseTargetFromProps(), Or(), re(), readKeyframes(), readValue(), readValueFromInstance(), resolveNoneKeyframes() (+2 more)

### Community 53 - "then"
Cohesion: 0.25
Nodes (8): om(), qa(), qm(), se(), then(), Xm(), ya(), zm()

### Community 54 - "ADR 0001 — A thin SerpApi client with record/replay instead of the SDK"
Cohesion: 0.40
Nodes (4): ADR 0001 — A thin SerpApi client with record/replay instead of the SDK, Consequences, Context, Decision

## Knowledge Gaps
- **142 isolated node(s):** `helpline-watch`, `$schema`, `plugins`, `react/rules-of-hooks`, `react/only-export-components` (+137 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 291 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `w()` connect `o` to `index-Dsrc0fW6.js`, `n`, `package.json`, `add`, `s`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `react` connect `types.ts` to `package.json`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Are the 89 inferred relationships involving `n()` (e.g. with `ac()` and `au()`) actually correct?**
  _`n()` has 89 INFERRED edges - model-reasoned connections that need verification._
- **Are the 76 inferred relationships involving `t()` (e.g. with `al()` and `ao()`) actually correct?**
  _`t()` has 76 INFERRED edges - model-reasoned connections that need verification._
- **Are the 39 inferred relationships involving `i()` (e.g. with `au()` and `b()`) actually correct?**
  _`i()` has 39 INFERRED edges - model-reasoned connections that need verification._
- **Are the 72 inferred relationships involving `r()` (e.g. with `al()` and `an()`) actually correct?**
  _`r()` has 72 INFERRED edges - model-reasoned connections that need verification._
- **Are the 50 inferred relationships involving `a()` (e.g. with `af()` and `al()`) actually correct?**
  _`a()` has 50 INFERRED edges - model-reasoned connections that need verification._
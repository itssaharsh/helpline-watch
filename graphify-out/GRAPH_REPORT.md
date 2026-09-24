# Graph Report - hack  (2026-09-24)

## Corpus Check
- 160 files · ~86,433 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 4, .css 2, .example 1)

## Summary
- 1143 nodes · 3790 edges · 52 communities (43 shown, 9 thin omitted)
- Extraction: 82% EXTRACTED · 18% INFERRED · 0% AMBIGUOUS · INFERRED: 683 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4eae0367`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- surfaces.py
- client.py
- test_phones.py
- Store
- api.py
- .addEventListener
- fl
- App.tsx
- helpline-watch
- zd
- Brand
- package.json
- n
- i
- e
- o
- index-DH5UvfyN.js
- t
- Fn
- cli.py
- models.py
- s
- cs
- indexOf
- UI-SPEC.md
- compilerOptions
- Ir
- compilerOptions
- delete
- Product
- qf
- us
- Helpline Watch
- make_synthetic_fixtures.py
- wu
- DESIGN.md
- Jt
- tu
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
- ADR 0001 — A thin SerpApi client with record/replay instead of the SDK

## God Nodes (most connected - your core abstractions)
1. `n()` - 107 edges
2. `t()` - 100 edges
3. `i()` - 95 edges
4. `r()` - 72 edges
5. `a()` - 57 edges
6. `e()` - 47 edges
7. `o()` - 46 edges
8. `fl()` - 45 edges
9. `Brand` - 43 edges
10. `s()` - 38 edges

## Surprising Connections (you probably didn't know these)
- `Decision` --references--> `CallBudget`  [INFERRED]
  docs/adr/0001-thin-serpapi-client-with-record-replay.md → backend/helpline_watch/serp/client.py
- `Meaningful SerpApi usage` --references--> `ll()`  [INFERRED]
  README.md → backend/helpline_watch/static/assets/index-DH5UvfyN.js
- `main()` --uses--> `Services`  [INFERRED]
  scripts/validate.py → backend/helpline_watch/api.py
- `run_sweep()` --uses--> `Services`  [INFERRED]
  scripts/validate.py → backend/helpline_watch/api.py
- `summarise()` --uses--> `Sweep`  [INFERRED]
  backend/helpline_watch/sweep.py → backend/helpline_watch/models.py

## Import Cycles
- None detected.

## Communities (52 total, 9 thin omitted)

### Community 0 - "surfaces.py"
Cohesion: 0.08
Nodes (66): apply_reverse(), classify(), _helpline_context(), merge_analyst_state(), official_norms(), Signals → verdict. Deterministic; every point on the score has a named reason.…, Fold reverse-lookup evidence into a finding and re-score it., Re-classification must not erase what the analyst and the reverse lookups… (+58 more)

### Community 1 - "client.py"
Cohesion: 0.11
Nodes (23): AsyncClient, BudgetExceeded, CallBudget, fixture_key(), FixtureMissing, Any, Path, Thin SerpApi client with three modes. live → HTTPS call to serpapi.com,… (+15 more)

### Community 2 - "test_phones.py"
Cohesion: 0.09
Nodes (46): _classify(), digit_distance(), display(), extract(), _grouped_like_landline(), _guess_kind(), is_transposition(), normalise() (+38 more)

### Community 3 - "Store"
Cohesion: 0.16
Nodes (9): Sweep, Path, SQLite persistence: sweeps, the cross-brand observation index, and analyst-…, Numbers ↔ brands graph across the latest sweep of every brand., Other brands each number has been seen for, split by that brand's verdict. A…, Store, collections, contextlib (+1 more)

### Community 4 - "api.py"
Cohesion: 0.09
Nodes (22): BrandIn, _count_fixtures(), create_app(), cities(), get_sweep(), health(), stream(), gen() (+14 more)

### Community 5 - ".addEventListener"
Cohesion: 0.05
Nodes (66): am(), ap(), bf(), bg(), Bp(), ch(), clear(), cm() (+58 more)

### Community 6 - "fl"
Cohesion: 0.07
Nodes (73): Ao(), as(), ba(), Bc(), bl(), cl(), da(), De() (+65 more)

### Community 7 - "App.tsx"
Cohesion: 0.06
Nodes (73): App(), FORCED, initialAppearance(), params, Tab, Workspace(), AppBar(), Props (+65 more)

### Community 12 - "zd"
Cohesion: 0.07
Nodes (52): af(), Bd(), bn(), bt(), Cp(), df(), dt(), ef() (+44 more)

### Community 13 - "Brand"
Cohesion: 0.13
Nodes (27): AdvertiserFinding, Brand, City, CityCoverage, Observation, BaseModel, The page for one call: what a victim in that city was shown., One phone number seen once, somewhere. (+19 more)

### Community 14 - "package.json"
Cohesion: 0.05
Nodes (42): dependencies, d3-force, motion, @phosphor-icons/react, @radix-ui/themes, react, react-dom, tailwindcss (+34 more)

### Community 15 - "n"
Cohesion: 0.09
Nodes (46): Ai(), r(), bh(), cc(), constructor(), ct(), dc(), Di() (+38 more)

### Community 16 - "i"
Cohesion: 0.12
Nodes (41): A(), u(), al(), bm(), bo(), D(), dn(), Du() (+33 more)

### Community 17 - "e"
Cohesion: 0.10
Nodes (36): Ag(), f(), l(), an(), b(), cn(), en(), filter() (+28 more)

### Community 18 - "o"
Cohesion: 0.11
Nodes (31): aa(), bu(), c(), ca(), el(), ep(), fh(), c() (+23 more)

### Community 19 - "index-DH5UvfyN.js"
Cohesion: 0.10
Nodes (17): after(), at(), be(), before(), entryAt(), first(), from(), hg() (+9 more)

### Community 20 - "t"
Cohesion: 0.13
Nodes (24): ae(), d(), co(), Fe(), i(), ie(), je(), lo() (+16 more)

### Community 21 - "Fn"
Cohesion: 0.18
Nodes (18): cf(), ci(), ec(), Ei(), Fn(), gi(), hf(), ji() (+10 more)

### Community 22 - "cli.py"
Cohesion: 0.07
Nodes (39): asyncio, Services, brands(), eval(), Path, `helpline-watch` command line: serve the UI, run or record sweeps, print the…, Replay all seed brands and print the proof table (the numbers the README…, Start the API and UI on one port. (+31 more)

### Community 23 - "models.py"
Cohesion: 0.17
Nodes (19): pack(), Finding, Provenance, Domain model. Everything the pipeline passes around is one of these., Enough to replay the exact SerpApi search a fact came from., ReverseHit, build_pack(), _complaint_template() (+11 more)

### Community 24 - "s"
Cohesion: 0.25
Nodes (17): bi(), Fu(), s(), gu(), hu(), Id(), Ii(), iu() (+9 more)

### Community 25 - "cs"
Cohesion: 0.18
Nodes (15): ac(), bs(), cs(), Fd(), gs(), hs(), ms(), oc() (+7 more)

### Community 26 - "indexOf"
Cohesion: 0.23
Nodes (13): ah(), ce(), m(), eg(), eh(), indexOf(), nh(), oh() (+5 more)

### Community 27 - "UI-SPEC.md"
Cohesion: 0.15
Nodes (12): 0. Idea brief, 10. Don'ts, 11. Acceptance, 1. Demo script (≤ 3:00), 2. Screen inventory, 3. Flow map, 4. Screens, 5. Components (+4 more)

### Community 28 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 29 - "Ir"
Cohesion: 0.22
Nodes (11): Br(), Fr(), Gr(), Ir(), kr(), Lr(), Or(), rr() (+3 more)

### Community 30 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 31 - "delete"
Cohesion: 0.18
Nodes (11): delete(), deleteAt(), gf(), insert(), keyAt(), keyFrom(), setAfter(), setBefore() (+3 more)

### Community 32 - "Product"
Cohesion: 0.18
Nodes (10): Accessibility, Capabilities, Constraints, Open decisions, Platform, Positioning, Product, Product Purpose (+2 more)

### Community 33 - "qf"
Cohesion: 0.28
Nodes (9): hn(), qf(), Sr(), vr(), wr(), Xf(), xn(), xr() (+1 more)

### Community 34 - "us"
Cohesion: 0.29
Nodes (7): ds(), eo(), io(), ks(), rs(), us(), yn()

### Community 35 - "Helpline Watch"
Cohesion: 0.14
Nodes (13): AI disclosure, Demo video, Go live, Helpline Watch, How it works, License, Limitations, Meaningful SerpApi usage (+5 more)

### Community 36 - "make_synthetic_fixtures.py"
Cohesion: 0.21
Nodes (18): load_cities(), Path, ad(), ads_transparency_response(), autocomplete_response(), lookalike(), main(), maps_response() (+10 more)

### Community 37 - "wu"
Cohesion: 0.33
Nodes (6): Cu(), gm(), Lu(), Uu(), wu(), zu()

### Community 38 - "DESIGN.md"
Cohesion: 0.22
Nodes (8): Colors, Components, Do's and Don'ts, Elevation & Depth, Layout, Overview, Shapes, Typography

### Community 39 - "Jt"
Cohesion: 0.50
Nodes (4): Jt(), Kt(), qt(), Wt()

### Community 41 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 42 - "test_api.py"
Cohesion: 0.15
Nodes (10): Settings, client(), _events(), API tests run fully in replay mode against the committed fixtures., test_patch_finding_can_mark_official_and_toggle_pack(), test_stream_emits_plan_calls_findings_and_done(), fastapi_testclient, fixture (+2 more)

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

### Community 54 - "ADR 0001 — A thin SerpApi client with record/replay instead of the SDK"
Cohesion: 0.40
Nodes (4): ADR 0001 — A thin SerpApi client with record/replay instead of the SDK, Consequences, Context, Decision

## Knowledge Gaps
- **146 isolated node(s):** `helpline-watch`, `$schema`, `plugins`, `react/rules-of-hooks`, `react/only-export-components` (+141 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 286 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `w()` connect `i` to `index-DH5UvfyN.js`, `.addEventListener`, `package.json`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Why does `react` connect `App.tsx` to `package.json`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Are the 73 inferred relationships involving `n()` (e.g. with `A()` and `f()`) actually correct?**
  _`n()` has 73 INFERRED edges - model-reasoned connections that need verification._
- **Are the 61 inferred relationships involving `t()` (e.g. with `index-DH5UvfyN.js` and `bi()`) actually correct?**
  _`t()` has 61 INFERRED edges - model-reasoned connections that need verification._
- **Are the 26 inferred relationships involving `i()` (e.g. with `index-DH5UvfyN.js` and `al()`) actually correct?**
  _`i()` has 26 INFERRED edges - model-reasoned connections that need verification._
- **Are the 61 inferred relationships involving `r()` (e.g. with `index-DH5UvfyN.js` and `al()`) actually correct?**
  _`r()` has 61 INFERRED edges - model-reasoned connections that need verification._
- **Are the 35 inferred relationships involving `a()` (e.g. with `al()` and `Bc()`) actually correct?**
  _`a()` has 35 INFERRED edges - model-reasoned connections that need verification._
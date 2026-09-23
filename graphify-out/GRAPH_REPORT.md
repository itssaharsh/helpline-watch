# Graph Report - hack  (2026-09-23)

## Corpus Check
- 19 files · ~5,917 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: .example 1, (none) 1)

## Summary
- 186 nodes · 451 edges · 12 communities (7 shown, 5 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- surfaces.py
- client.py
- test_phones.py
- Brand
- seeds.py
- models.py
- classify.py
- helpline_watch/__init__.py
- helpline-watch

## God Nodes (most connected - your core abstractions)
1. `classify()` - 17 edges
2. `Brand` - 17 edges
3. `NumberKind` - 16 edges
4. `SerpResult` - 16 edges
5. `Store` - 16 edges
6. `parse_google_search()` - 15 edges
7. `Verdict` - 15 edges
8. `normalise()` - 14 edges
9. `_signals_for()` - 13 edges
10. `Surface` - 13 edges

## Surprising Connections (you probably didn't know these)
- `official_norms()` --uses--> `Brand`  [INFERRED]
  backend/helpline_watch/analysis/classify.py → backend/helpline_watch/models.py
- `_helpline_context()` --uses--> `Observation`  [INFERRED]
  backend/helpline_watch/analysis/classify.py → backend/helpline_watch/models.py
- `_signals_for()` --uses--> `Brand`  [INFERRED]
  backend/helpline_watch/analysis/classify.py → backend/helpline_watch/models.py
- `_signals_for()` --uses--> `NumberKind`  [INFERRED]
  backend/helpline_watch/analysis/classify.py → backend/helpline_watch/models.py
- `_signals_for()` --uses--> `Observation`  [INFERRED]
  backend/helpline_watch/analysis/classify.py → backend/helpline_watch/models.py

## Import Cycles
- None detected.

## Communities (12 total, 5 thin omitted)

### Community 0 - "surfaces.py"
Cohesion: 0.12
Nodes (37): apply_reverse(), classify(), Fold reverse-lookup evidence into a finding and re-score it., Group observations by number and decide each one. `cross_brand` maps number →…, _verdict(), _joined(), _matches_brand(), _observations_from_text() (+29 more)

### Community 1 - "client.py"
Cohesion: 0.10
Nodes (24): AsyncClient, asyncio, BudgetExceeded, CallBudget, fixture_key(), FixtureMissing, Any, Path (+16 more)

### Community 2 - "test_phones.py"
Cohesion: 0.14
Nodes (27): _classify_digits(), digit_distance(), display(), extract(), is_transposition(), normalise(), ParsedNumber, Find and normalise Indian phone numbers in free text. Handles +91 / 0091 / 0… (+19 more)

### Community 3 - "Brand"
Cohesion: 0.14
Nodes (11): Brand, Sweep, Path, SQLite persistence: sweeps, the cross-brand observation index, and analyst-…, Numbers ↔ brands graph across the latest sweep of every brand., Other brands each number has been seen posing as (from any earlier sweep)., Store, collections (+3 more)

### Community 4 - "seeds.py"
Cohesion: 0.14
Nodes (15): load_settings(), Path, Settings from environment. Validated once at startup; nothing reads os.environ…, Settings, City, default_city_ids(), load_brands(), load_cities() (+7 more)

### Community 5 - "models.py"
Cohesion: 0.21
Nodes (15): CityCoverage, Finding, ListingMeta, Observation, Domain model. Everything the pipeline passes around is one of these., One phone number seen once, somewhere., ReverseHit, Signal (+7 more)

### Community 6 - "classify.py"
Cohesion: 0.26
Nodes (9): _helpline_context(), official_norms(), Signals → verdict. Deterministic; every point on the score has a named reason.…, _signals_for(), contains_any(), is_official_domain(), Small text helpers shared by parsers and the classifier., re (+1 more)

## Knowledge Gaps
- **1 isolated node(s):** `helpline-watch`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 58 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Brand` connect `Brand` to `surfaces.py`, `seeds.py`, `models.py`, `classify.py`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Why does `Store` connect `Brand` to `surfaces.py`, `models.py`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `classify()` (e.g. with `Brand` and `Observation`) actually correct?**
  _`classify()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 7 inferred relationships involving `Brand` (e.g. with `classify()` and `official_norms()`) actually correct?**
  _`Brand` has 7 INFERRED edges - model-reasoned connections that need verification._
- **Are the 10 inferred relationships involving `NumberKind` (e.g. with `_signals_for()` and `_classify_digits()`) actually correct?**
  _`NumberKind` has 10 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `SerpResult` (e.g. with `parse_ads_transparency()` and `parse_autocomplete()`) actually correct?**
  _`SerpResult` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `Store` (e.g. with `Brand` and `Sweep`) actually correct?**
  _`Store` has 3 INFERRED edges - model-reasoned connections that need verification._
# ADR 0001 — A thin SerpApi client with record/replay instead of the SDK

**Status:** accepted · 2026-09-23

## Context
Every sweep is 20–30 SerpApi searches. The free plan is 250 searches a month, judges
run the project locally without a key, and the demo must never depend on live Google
results being unhealthy. We also want every finding to link back to the exact search
it came from.

## Decision
`helpline_watch/serp/client.py` talks to `https://serpapi.com/search.json` over httpx
and wraps every response as `{"_fixture": {...}, "response": {...}}` on disk, keyed by
a hash of the sorted request params. Modes: `live` (fetch + record), `replay`
(fixtures only), `auto` (fixture if present). A `CallBudget` caps live calls per sweep.
Synthetic fixtures are labelled `kind: synthetic` and never claim an archive link.

## Consequences
* Judges can run `make verify` and the full UI with zero credentials.
* The same request → the same file, so `make record` replaces synthetic data in place.
* We forgo the official `serpapi` SDK's conveniences; the trade is full control over
  caching, budgeting and provenance, which are the product.

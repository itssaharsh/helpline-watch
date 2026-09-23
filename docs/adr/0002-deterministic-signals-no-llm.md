# ADR 0002 — Deterministic signals; no LLM in the verdict path

**Status:** accepted · 2026-09-23

## Context
The judges' first question at every "is this a scam?" project is "what happens when
the model is wrong?". A fraud team files takedowns on our output, so a hallucinated
reason is worse than no reason.

## Decision
`analysis/classify.py` scores each number with named, weighted signals (lookalike
distance to an official number, mobile posing as a helpline for a regulated entity
per TRAI's 19 Nov 2025 direction, listing named as a helpline, thin/unclaimed listing,
cross-brand reuse, multi-city planting, non-official ad, fraud words in context,
reverse-lookup complaints). `fake` needs a score of 3 or more; anything below is
`review`; official matches and the brand's own domain short-circuit to green.
No language model anywhere in the pipeline.

## Consequences
* Every red chip can be explained in one sentence per signal, and re-scored offline.
* Precision is bounded by the signal set, so a `review` queue exists for humans.
* Adding a signal is a pure function plus a test, never a prompt tweak.

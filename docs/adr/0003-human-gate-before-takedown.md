# ADR 0003 — Read tools free, the takedown pack is gated by a person

**Status:** accepted · 2026-09-23

## Context
Reporting a Maps listing or an advertiser to Google or to cybercrime.gov.in is an
outward action against a third party. It must never be automatic.

## Decision
Sweeps only read. The pack builder (`takedown.py`) includes a number only when
`Finding.in_pack` is true; fakes are pre-checked, reviews are not, and the analyst
can uncheck any finding or mark it official (which re-classifies the sweep and edits
the brand's official list). Nothing in the codebase submits a report anywhere.

## Consequences
* The demo's "unhappy path" is real: a green third-party republish and an amber
  review item never reach the pack.
* Filing remains the analyst's job; the pack gives them CSV, evidence JSON, a report
  with replay links and a complaint template.

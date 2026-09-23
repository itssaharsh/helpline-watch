# ADR 0004 — One Python process serves the built React UI

**Status:** accepted · 2026-09-23

## Context
Judging is async: four SerpApi developer advocates (three Python/Ruby DevRel, one
support engineer) run the repo locally from a README. Two runtimes and two terminals
is where local demos die.

## Decision
The Vite build outputs into `backend/helpline_watch/static/` and is committed.
FastAPI serves `/api/*` and the SPA from the same port. Node is only needed to
change the UI (`make ui`). Sweep progress streams over Server-Sent Events so the
grid fills as calls land; replay mode is paced so the movement is visible.

## Consequences
* Quickstart is three commands and needs Python 3.11+ and `uv` only.
* A committed build must be refreshed when the UI changes; CI builds it to catch drift.

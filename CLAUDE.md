# Helpline Watch — agent notes

- Run everything through the Makefile: `make setup`, `make verify`, `make demo`, `make ui`.
- Backend rules: many small modules, pure functions in `extract/` and `analysis/`, no LLM in the verdict path (ADR 0002), never log or commit secrets (`.env` is ignored).
- Tests first for anything in `extract/` or `analysis/`; `make verify` must print PASS before a commit.
- Frontend: tokens live in `frontend/src/styles.css`; keep the accent budget small (one primary action per view), red only for `fake`.
- AI disclosure for the hackathon lives in `AGENTS.md`.

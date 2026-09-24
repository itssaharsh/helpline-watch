# Helpline Watch — one command per job. Python lives in backend/.venv (uv); the UI build is committed.
PY := backend/.venv/bin/python
HW := backend/.venv/bin/helpline-watch

.PHONY: setup demo serve sweep seed record eval verify test lint ui ui-dev fixtures qa docker clean

setup:            ## create the venv and install the backend (dev extras included)
	cd backend && uv venv -q .venv && uv pip install -q -e ".[dev]"

fixtures:         ## regenerate the synthetic demo world (only needed if you change the generator)
	$(PY) backend/scripts/make_synthetic_fixtures.py

seed:             ## replay every seed brand once so the UI opens populated and cross-brand links exist
	$(HW) seed-demo

demo: seed        ## seed, then serve the UI and open it in demo mode
	$(HW) serve --open

serve:            ## serve API + UI on http://127.0.0.1:8787
	$(HW) serve

sweep:            ## run one sweep from the CLI, e.g. make sweep BRAND=hdfc-bank
	$(HW) sweep $(or $(BRAND),hdfc-bank)

record:           ## record real fixtures for all seed brands (needs SERPAPI_API_KEY in .env)
	$(HW) record

eval:             ## print the proof table the README quotes
	$(HW) eval

test:             ## backend unit + API tests
	cd backend && .venv/bin/python -m pytest -q

lint:             ## ruff on the backend, oxlint + tsc on the frontend
	cd backend && .venv/bin/ruff check helpline_watch tests scripts
	cd frontend && npm run -s lint && npx -s tsc -b

verify: test      ## deterministic end-to-end proof: replay sweep → assert the before/after → PASS/FAIL
	$(PY) scripts/validate.py

ui:               ## build the UI into backend/helpline_watch/static
	cd frontend && npm run -s build

ui-dev:           ## Vite dev server with API proxy (run `make serve` in another terminal)
	cd frontend && npm run dev

qa:               ## screenshot loop against a running server (make serve first)
	cd frontend && node scripts/qa.mjs http://127.0.0.1:8787

docker:           ## build the image and run it on http://127.0.0.1:8787 (replay mode, no key needed)
	docker build -t helpline-watch . && docker run --rm -p 8787:8787 helpline-watch

clean:
	rm -rf backend/data/helpline.sqlite backend/.pytest_cache backend/.ruff_cache qa

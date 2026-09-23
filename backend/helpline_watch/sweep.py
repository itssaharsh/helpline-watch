"""The sweep: plan → fetch every surface per city → extract → classify → reverse-check → persist.

`run()` is an async generator of SweepEvents so the API can stream progress and the
UI can fill the grid as results land. Nothing here talks to SerpApi directly; the
client decides live vs fixture.
"""

from __future__ import annotations

import asyncio
import time
import uuid
from collections import Counter
from collections.abc import AsyncIterator
from datetime import UTC, datetime

from helpline_watch.analysis.classify import apply_reverse, classify
from helpline_watch.config import Settings
from helpline_watch.extract import surfaces
from helpline_watch.models import (
    AdvertiserFinding,
    Brand,
    City,
    CityCoverage,
    Finding,
    Observation,
    Sweep,
    SweepEvent,
    Verdict,
)
from helpline_watch.plan import PlannedCall, build_plan, reverse_call
from helpline_watch.serp.client import BudgetExceeded, CallBudget, FixtureMissing, SerpApiError, SerpClient
from helpline_watch.store import Store

DEFAULT_REVERSE_LIMIT = 6


def _friendly(err: Exception) -> str:
    if isinstance(err, FixtureMissing):
        return "No recorded result for this query yet (replay mode). Add a SerpApi key to fetch it live."
    if isinstance(err, BudgetExceeded):
        return str(err)
    if isinstance(err, SerpApiError):
        return f"SerpApi error: {err}"
    return f"{type(err).__name__}: {err}"


class SweepRunner:
    def __init__(self, settings: Settings, client: SerpClient, store: Store):
        self.settings = settings
        self.client = client
        self.store = store

    def effective_mode(self) -> str:
        return "live" if self.settings.can_go_live else "replay"

    async def run(self, brand: Brand, cities: list[City], reverse_limit: int = DEFAULT_REVERSE_LIMIT) -> AsyncIterator[SweepEvent]:
        sweep = Sweep(id=uuid.uuid4().hex[:10], brand_id=brand.id, brand_name=brand.name, started_at=datetime.now(UTC),
                      mode=self.effective_mode(), city_ids=[c.id for c in cities])
        budget = CallBudget(self.settings.max_calls)
        yield SweepEvent(type="started", payload={"sweep_id": sweep.id, "brand": brand.model_dump(), "cities": [c.model_dump() for c in cities], "mode": sweep.mode})

        # 1. autocomplete → query plan
        suggestions: list[str] = []
        plan = build_plan(brand, cities, [], self.settings.max_calls, reserve=reverse_limit)
        try:
            res = await self.client.search(plan.autocomplete.params, budget)
            suggestions = surfaces.parse_autocomplete(res)
            sweep.fixture_kinds[res.fixture_kind] = sweep.fixture_kinds.get(res.fixture_kind, 0) + 1
        except (FixtureMissing, SerpApiError, BudgetExceeded) as err:
            sweep.errors.append(f"autocomplete: {_friendly(err)}")
        plan = build_plan(brand, cities, suggestions, self.settings.max_calls, reserve=reverse_limit)
        sweep.queries = plan.queries
        sweep.calls_planned = plan.total
        yield SweepEvent(type="plan", payload={"suggestions": suggestions[:6], "queries": plan.queries,
                                              "calls": [{"id": c.id, "group": c.group, "city_id": c.city_id, "label": c.label} for c in plan.calls],
                                              "total": plan.total, "max_calls": self.settings.max_calls})

        # 2. fetch every planned call concurrently, streaming results as they land
        observations: list[Observation] = []
        advertisers: list[AdvertiserFinding] = []
        coverage: dict[str, CityCoverage] = {c.id: CityCoverage(city_id=c.id, planned=0, completed=0, failed=0) for c in cities}
        for call in plan.calls:
            if call.city_id:
                coverage[call.city_id].planned += 1
        queue: asyncio.Queue[tuple[PlannedCall, object, float]] = asyncio.Queue()

        async def worker(call: PlannedCall) -> None:
            t0 = time.perf_counter()
            try:
                result = await self.client.search(call.params, budget)
                await queue.put((call, result, time.perf_counter() - t0))
            except Exception as err:  # noqa: BLE001 — every failure becomes a visible event
                await queue.put((call, err, time.perf_counter() - t0))

        tasks = [asyncio.create_task(worker(c)) for c in plan.calls]
        try:
            for _ in plan.calls:
                call, outcome, elapsed = await queue.get()
                if not isinstance(outcome, Exception):
                    try:
                        parsed = self._parse(call, outcome, brand)
                    except Exception as err:  # noqa: BLE001 — one odd response must not sink the sweep
                        outcome = RuntimeError(f"could not parse the {call.engine} response ({type(err).__name__}: {err})")
                if isinstance(outcome, Exception):
                    sweep.errors.append(f"{call.id}: {_friendly(outcome)}")
                    if call.city_id:
                        coverage[call.city_id].failed += 1
                    yield SweepEvent(type="call_failed", payload={"id": call.id, "error": _friendly(outcome), "ms": int(elapsed * 1000)})
                    continue
                res = outcome
                new_obs, new_ads = parsed
                sweep.fixture_kinds[res.fixture_kind] = sweep.fixture_kinds.get(res.fixture_kind, 0) + 1
                observations.extend(new_obs)
                if new_ads is not None:
                    advertisers = new_ads
                if call.city_id:
                    coverage[call.city_id].completed += 1
                findings = self._classify(brand, observations)
                yield SweepEvent(type="call_done", payload={"id": call.id, "from_cache": res.from_cache, "fixture_kind": res.fixture_kind,
                                                           "observations": len(new_obs), "ms": int(elapsed * 1000),
                                                           "numbers": sorted({o.number_norm for o in new_obs}),
                                                           "live_calls": budget.live_calls, "cache_hits": budget.cache_hits})
                yield SweepEvent(type="findings", payload={"findings": [f.model_dump(mode="json") for f in findings], "partial": True})
                if new_ads is not None:
                    yield SweepEvent(type="advertisers", payload={"advertisers": [a.model_dump(mode="json") for a in advertisers]})
        finally:
            # A closed browser tab or an error must not leave live calls spending credits.
            for t in tasks:
                if not t.done():
                    t.cancel()
            await asyncio.gather(*tasks, return_exceptions=True)

        # 3. reverse-check the most suspicious numbers
        findings = self._classify(brand, observations)
        suspects = [f for f in findings if f.verdict in (Verdict.FAKE, Verdict.REVIEW)][:reverse_limit]
        by_number = {f.number_norm: f for f in findings}
        for suspect in suspects:
            call = reverse_call(suspect.number_norm, suspect.kind)
            yield SweepEvent(type="reverse_started", payload={"number": suspect.number_norm, "label": call.label})
            try:
                res = await self.client.search(call.params, budget)
                sweep.fixture_kinds[res.fixture_kind] = sweep.fixture_kinds.get(res.fixture_kind, 0) + 1
                hits = surfaces.parse_reverse(res)
                by_number[suspect.number_norm] = apply_reverse(suspect, hits)
                yield SweepEvent(type="reverse_done", payload={"number": suspect.number_norm, "hits": len(hits), "flagged": sum(1 for h in hits if h.scam_words),
                                                              "finding": by_number[suspect.number_norm].model_dump(mode="json")})
            except Exception as err:  # noqa: BLE001
                sweep.errors.append(f"{call.id}: {_friendly(err)}")
                yield SweepEvent(type="call_failed", payload={"id": call.id, "error": _friendly(err), "ms": 0})

        # 4. finalise + persist
        final = sorted(by_number.values(), key=_sort_key)
        sweep.findings = [f.model_copy(update={"in_pack": f.verdict == Verdict.FAKE}) for f in final]
        sweep.advertisers = advertisers
        sweep.coverage = list(coverage.values())
        sweep.calls_made = budget.live_calls + budget.cache_hits
        sweep.live_calls, sweep.cache_hits = budget.live_calls, budget.cache_hits
        sweep.finished_at = datetime.now(UTC)
        self.store.save_sweep(sweep)
        previous = self.store.previous_sweep(brand.id, sweep)
        diff = diff_sweeps(previous, sweep)
        yield SweepEvent(type="done", payload={"sweep": sweep.model_dump(mode="json"), "counts": sweep.counts, "diff": diff,
                                              "live_calls": budget.live_calls, "cache_hits": budget.cache_hits})

    @staticmethod
    def _parse(call: PlannedCall, res, brand: Brand) -> tuple[list[Observation], list[AdvertiserFinding] | None]:
        if call.engine == "google":
            return surfaces.parse_google_search(res, call.city_id), None
        if call.engine == "google_maps":
            return surfaces.parse_google_maps(res, call.city_id), None
        if call.engine == "google_ads_transparency_center":
            return [], surfaces.parse_ads_transparency(res, brand)
        return [], None

    def _classify(self, brand: Brand, observations: list[Observation]) -> list[Finding]:
        numbers = sorted({o.number_norm for o in observations})
        cross = self.store.brands_for_numbers(numbers, exclude_brand_id=brand.id)
        return classify(brand, observations, cross)


def _sort_key(f: Finding) -> tuple:
    order = {Verdict.FAKE: 0, Verdict.REVIEW: 1, Verdict.OFFICIAL_UNLISTED: 2, Verdict.OFFICIAL: 3}
    return (order[f.verdict], -f.score, f.number_norm)


def diff_sweeps(previous: Sweep | None, current: Sweep) -> dict:
    """What changed since the brand's last sweep: new, persisting and gone suspicious numbers."""
    suspicious = {Verdict.FAKE, Verdict.REVIEW}
    now = {f.number_norm: f for f in current.findings if f.verdict in suspicious}
    if previous is None:
        return {"previous_id": None, "new": sorted(now), "persisting": [], "gone": []}
    before = {f.number_norm: f for f in previous.findings if f.verdict in suspicious}
    return {
        "previous_id": previous.id,
        "previous_started_at": previous.started_at.isoformat(),
        "new": sorted(set(now) - set(before)),
        "persisting": sorted(set(now) & set(before)),
        "gone": sorted(set(before) - set(now)),
    }


def summarise(sweep: Sweep) -> dict:
    kinds = Counter(sweep.fixture_kinds)
    return {"id": sweep.id, "brand": sweep.brand_name, "counts": sweep.counts, "calls": sweep.calls_made, "fixture_kinds": dict(kinds), "errors": len(sweep.errors)}

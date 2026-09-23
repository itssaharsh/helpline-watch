"""HTTP API + static UI. One process, one port."""

from __future__ import annotations

import asyncio
import json
import os
from collections.abc import AsyncIterator
from pathlib import Path

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import FileResponse, Response, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from helpline_watch import __version__
from helpline_watch.analysis.classify import classify
from helpline_watch.config import Settings, load_settings
from helpline_watch.extract import phones
from helpline_watch.models import Brand, Verdict
from helpline_watch.seeds import default_city_ids, load_brands, load_cities
from helpline_watch.serp.client import SerpClient
from helpline_watch.store import Store
from helpline_watch.sweep import SweepRunner, diff_sweeps
from helpline_watch.takedown import build_pack


class Services:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.store = Store(settings.data_dir / "helpline.sqlite")
        self.client = SerpClient(settings.serpapi_key, settings.mode, settings.fixtures_dir)
        self.runner = SweepRunner(settings, self.client, self.store)
        self.cities = load_cities(settings.seeds_dir)

    def brands(self) -> list[Brand]:
        seeded = {b.id: b for b in load_brands(self.settings.seeds_dir)}
        for b in self.store.custom_brands():
            seeded[b.id] = b
        return list(seeded.values())

    def brand(self, brand_id: str) -> Brand:
        for b in self.brands():
            if b.id == brand_id:
                return b
        raise HTTPException(404, f"unknown brand {brand_id}")

    def city_list(self, ids: list[str]) -> list:
        by_id = {c.id: c for c in self.cities}
        missing = [i for i in ids if i not in by_id]
        if missing:
            raise HTTPException(400, f"unknown cities: {missing}")
        return [by_id[i] for i in ids]


class BrandIn(BaseModel):
    name: str
    category: str = "other"
    regulated: bool = False
    official_domains: list[str] = []
    official_numbers: list[str] = []
    aliases: list[str] = []


class FindingPatch(BaseModel):
    in_pack: bool | None = None
    mark_official: bool | None = None


def _sse(event: str, payload: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(payload, ensure_ascii=False)}\n\n"


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or load_settings()
    svc = Services(settings)
    app = FastAPI(title="Helpline Watch", version=__version__)
    app.state.services = svc

    @app.get("/api/health")
    async def health():
        account = await svc.client.account() if settings.can_go_live else None
        return {"version": __version__, "mode": svc.runner.effective_mode(), "configured_mode": settings.mode,
                "has_key": bool(settings.serpapi_key), "max_calls": settings.max_calls,
                "credits_left": (account or {}).get("plan_searches_left"), "plan": (account or {}).get("plan_name"),
                "fixtures": _count_fixtures(settings.fixtures_dir)}

    @app.get("/api/brands")
    def brands():
        return [b.model_dump() for b in svc.brands()]

    @app.post("/api/brands")
    def add_brand(body: BrandIn):
        brand_id = "".join(ch if ch.isalnum() else "-" for ch in body.name.lower()).strip("-")
        brand = Brand(id=brand_id, **body.model_dump())
        svc.store.upsert_brand(brand)
        return brand.model_dump()

    @app.get("/api/cities")
    def cities():
        return {"cities": [c.model_dump() for c in svc.cities], "default": default_city_ids(svc.cities)}

    @app.get("/api/sweeps")
    def list_sweeps(brand_id: str | None = None):
        return svc.store.list_sweeps(brand_id)

    @app.get("/api/sweeps/stream")
    async def stream(brand_id: str, cities: str | None = Query(default=None), reverse: int = 6):
        brand = svc.brand(brand_id)
        ids = [c for c in (cities or "").split(",") if c] or default_city_ids(svc.cities)
        city_objs = svc.city_list(ids)

        # Replay answers instantly; a short pace per cached call keeps the grid's fill visible.
        pace = float(os.getenv("HELPLINE_REPLAY_PACE_MS") or 160) / 1000

        async def gen() -> AsyncIterator[str]:
            try:
                async for ev in svc.runner.run(brand, city_objs, reverse_limit=max(0, min(reverse, 12))):
                    yield _sse(ev.type, ev.payload)
                    if ev.type in ("call_done", "reverse_done") and ev.payload.get("from_cache", True) and pace:
                        await asyncio.sleep(pace)
            except Exception as err:  # noqa: BLE001 — surface, never hang the stream
                yield _sse("error", {"message": f"{type(err).__name__}: {err}"})

        return StreamingResponse(gen(), media_type="text/event-stream", headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})

    @app.get("/api/sweeps/{sweep_id}")
    def get_sweep(sweep_id: str):
        sweep = svc.store.get_sweep(sweep_id)
        if not sweep:
            raise HTTPException(404, "no such sweep")
        previous = svc.store.previous_sweep(sweep.brand_id, sweep)
        return {"sweep": sweep.model_dump(mode="json"), "counts": sweep.counts, "diff": diff_sweeps(previous, sweep)}

    @app.patch("/api/sweeps/{sweep_id}/findings/{number}")
    def patch_finding(sweep_id: str, number: str, body: FindingPatch):
        sweep = svc.store.get_sweep(sweep_id)
        if not sweep:
            raise HTTPException(404, "no such sweep")
        brand = svc.brand(sweep.brand_id)
        target = next((f for f in sweep.findings if f.number_norm == number), None)
        if target is None:
            raise HTTPException(404, "no such finding")
        if body.mark_official:
            brand = brand.model_copy(update={"official_numbers": [*brand.official_numbers, phones.display(number)]})
            svc.store.upsert_brand(brand)
            obs = [o for f in sweep.findings for o in f.observations]
            cross = svc.store.brands_for_numbers([f.number_norm for f in sweep.findings], exclude_brand_id=brand.id)
            sweep.findings = classify(brand, obs, cross)
            target = next(f for f in sweep.findings if f.number_norm == number)
        if body.in_pack is not None:
            updated = target.model_copy(update={"in_pack": body.in_pack and target.verdict in (Verdict.FAKE, Verdict.REVIEW)})
            sweep.findings = [updated if f.number_norm == number else f for f in sweep.findings]
            target = updated
        svc.store.save_sweep(sweep)
        return {"finding": target.model_dump(mode="json"), "counts": sweep.counts, "brand": brand.model_dump()}

    @app.get("/api/sweeps/{sweep_id}/pack.zip")
    def pack(sweep_id: str):
        sweep = svc.store.get_sweep(sweep_id)
        if not sweep:
            raise HTTPException(404, "no such sweep")
        data = build_pack(sweep, svc.brand(sweep.brand_id))
        return Response(content=data, media_type="application/zip",
                        headers={"Content-Disposition": f'attachment; filename="takedown-{sweep.brand_id}-{sweep.id}.zip"'})

    @app.get("/api/network")
    def network():
        return svc.store.network()

    static = settings.static_dir
    if static.exists():
        app.mount("/assets", StaticFiles(directory=static / "assets"), name="assets")

        @app.get("/{path:path}")
        def spa(path: str):
            candidate = static / path
            if path and candidate.is_file():
                return FileResponse(candidate)
            return FileResponse(static / "index.html")

    return app


def _count_fixtures(fixtures_dir: Path) -> dict[str, int]:
    out: dict[str, int] = {}
    if not fixtures_dir.exists():
        return out
    for engine_dir in fixtures_dir.iterdir():
        if engine_dir.is_dir():
            out[engine_dir.name] = sum(1 for _ in engine_dir.glob("*.json"))
    return out


app = create_app()

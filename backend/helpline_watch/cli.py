"""`helpline-watch` command line: serve the UI, run or record sweeps, print the eval table."""

from __future__ import annotations

import asyncio
import json
import webbrowser
from pathlib import Path

import typer

from helpline_watch.config import load_settings
from helpline_watch.models import Verdict
from helpline_watch.seeds import default_city_ids, load_brands, load_cities

app = typer.Typer(add_completion=False, help="Find fake customer-care numbers planted on Google before customers call them.")


def _services():
    from helpline_watch.api import Services

    return Services(load_settings())


@app.command()
def serve(port: int = 8787, host: str = "127.0.0.1", open_browser: bool = typer.Option(False, "--open")):
    """Start the API and UI on one port."""
    import uvicorn

    if open_browser:
        webbrowser.open(f"http://{host}:{port}/app?demo=1")
    uvicorn.run("helpline_watch.api:app", host=host, port=port, log_level="info")


@app.command()
def brands():
    """List brands (seeded + custom)."""
    for b in _services().brands():
        typer.echo(f"{b.id:14s} {b.name:12s} regulated={b.is_regulated!s:5s} official={', '.join(b.official_numbers) or '-'}")


@app.command()
def sweep(brand_id: str, cities: str = "", reverse: int = 6, out: Path | None = None, quiet: bool = False):
    """Run one sweep and print the findings table."""
    svc = _services()
    brand = svc.brand(brand_id)
    ids = [c for c in cities.split(",") if c] or default_city_ids(svc.cities)
    city_objs = svc.city_list(ids)

    async def go():
        final = None
        async for ev in svc.runner.run(brand, city_objs, reverse_limit=reverse):
            if ev.type == "call_done" and not quiet:
                typer.echo(f"  ✓ {ev.payload['id']:22s} {ev.payload['fixture_kind']:9s} {ev.payload['observations']} numbers  {ev.payload['ms']} ms")
            elif ev.type == "call_failed":
                typer.echo(f"  ✗ {ev.payload['id']:22s} {ev.payload['error']}")
            elif ev.type == "done":
                final = ev.payload
        return final

    typer.echo(f"Sweeping {brand.name} across {', '.join(ids)} (mode: {svc.runner.effective_mode()})")
    result = asyncio.run(go())
    if not result:
        raise typer.Exit(1)
    sweep_data = result["sweep"]
    typer.echo("")
    typer.echo(f"{'number':18s} {'verdict':17s} {'score':5s} signals")
    for f in sweep_data["findings"]:
        typer.echo(f"{f['display']:18s} {f['verdict']:17s} {f['score']:<5d} {', '.join(s['code'] for s in f['signals'])}")
    typer.echo("")
    typer.echo(f"counts: {result['counts']}  live calls: {result['live_calls']}  cache hits: {result['cache_hits']}  sweep id: {sweep_data['id']}")
    if out:
        out.write_text(json.dumps(sweep_data, indent=1, ensure_ascii=False), encoding="utf-8")
        typer.echo(f"wrote {out}")


@app.command()
def record(brand_ids: list[str] = typer.Argument(None), cities: str = ""):
    """Run live sweeps for the given brands (default: all seeds) so their fixtures are recorded."""
    settings = load_settings()
    if not settings.serpapi_key:
        typer.echo("SERPAPI_API_KEY is not set; nothing to record. Put it in .env first.")
        raise typer.Exit(2)
    svc = _services()
    targets = brand_ids or [b.id for b in svc.brands()]
    for bid in targets:
        sweep(bid, cities=cities, quiet=True)


@app.command("seed-demo")
def seed_demo():
    """Replay every seed brand once so the UI opens populated and cross-brand links exist."""
    svc = _services()
    for b in load_brands(svc.settings.seeds_dir):
        sweep(b.id, quiet=True)


@app.command()
def eval():  # noqa: A001 — CLI verb
    """Replay all seed brands and print the proof table (the numbers the README quotes)."""
    svc = _services()
    cities = load_cities(svc.settings.seeds_dir)
    rows = []
    for b in load_brands(svc.settings.seeds_dir):
        city_objs = [c for c in cities if c.default]

        async def go(brand=b, chosen=city_objs):
            async for ev in svc.runner.run(brand, chosen):
                if ev.type == "done":
                    return ev.payload
            return None

        result = asyncio.run(go())
        s = result["sweep"]
        fakes = [f for f in s["findings"] if f["verdict"] == Verdict.FAKE.value]
        cross = [f for f in fakes if f["other_brands"]]
        rows.append((b.name, len(s["findings"]), len(fakes), len(cross), sum(1 for f in s["findings"] if f["verdict"] == "review"), s["calls_made"], s["fixture_kinds"]))
    typer.echo(f"{'brand':12s} {'numbers':8s} {'fake':5s} {'cross-brand':12s} {'review':7s} {'calls':6s} fixtures")
    for name, n, fake, cross, review, calls, kinds in rows:
        typer.echo(f"{name:12s} {n:<8d} {fake:<5d} {cross:<12d} {review:<7d} {calls:<6d} {kinds}")


if __name__ == "__main__":
    app()

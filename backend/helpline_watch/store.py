"""SQLite persistence: sweeps, the cross-brand observation index, and analyst-edited brands."""

from __future__ import annotations

import sqlite3
from collections import defaultdict
from contextlib import contextmanager
from pathlib import Path

from helpline_watch.models import Brand, Sweep, Verdict

SCHEMA = """
CREATE TABLE IF NOT EXISTS sweeps (
  id TEXT PRIMARY KEY, brand_id TEXT NOT NULL, brand_name TEXT NOT NULL,
  started_at TEXT NOT NULL, finished_at TEXT, mode TEXT NOT NULL, body TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS sweeps_brand ON sweeps(brand_id, started_at);
CREATE TABLE IF NOT EXISTS observations (
  id INTEGER PRIMARY KEY, sweep_id TEXT NOT NULL, brand_id TEXT NOT NULL, brand_name TEXT NOT NULL,
  number_norm TEXT NOT NULL, verdict TEXT NOT NULL, surface TEXT NOT NULL, city_id TEXT,
  source_domain TEXT, listing_title TEXT
);
CREATE INDEX IF NOT EXISTS obs_number ON observations(number_norm);
CREATE TABLE IF NOT EXISTS brands (id TEXT PRIMARY KEY, body TEXT NOT NULL);
"""


class Store:
    def __init__(self, path: Path):
        self.path = path
        path.parent.mkdir(parents=True, exist_ok=True)
        with self._conn() as c:
            c.executescript(SCHEMA)

    @contextmanager
    def _conn(self):
        conn = sqlite3.connect(self.path)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
            conn.commit()
        finally:
            conn.close()

    # ---------- sweeps ----------
    def save_sweep(self, sweep: Sweep) -> None:
        with self._conn() as c:
            c.execute(
                "INSERT OR REPLACE INTO sweeps VALUES (?,?,?,?,?,?,?)",
                (sweep.id, sweep.brand_id, sweep.brand_name, sweep.started_at.isoformat(),
                 sweep.finished_at.isoformat() if sweep.finished_at else None, sweep.mode, sweep.model_dump_json()),
            )
            c.execute("DELETE FROM observations WHERE sweep_id = ?", (sweep.id,))
            rows = [
                (sweep.id, sweep.brand_id, sweep.brand_name, f.number_norm, f.verdict.value, o.surface.value,
                 o.city_id, o.source_domain, o.listing.title if o.listing else None)
                for f in sweep.findings for o in f.observations
            ]
            c.executemany("INSERT INTO observations (sweep_id, brand_id, brand_name, number_norm, verdict, surface, city_id, source_domain, listing_title) VALUES (?,?,?,?,?,?,?,?,?)", rows)

    def get_sweep(self, sweep_id: str) -> Sweep | None:
        with self._conn() as c:
            row = c.execute("SELECT body FROM sweeps WHERE id = ?", (sweep_id,)).fetchone()
        return Sweep.model_validate_json(row["body"]) if row else None

    def list_sweeps(self, brand_id: str | None = None, limit: int = 50) -> list[dict]:
        sql = "SELECT id, brand_id, brand_name, started_at, finished_at, mode, body FROM sweeps"
        args: tuple = ()
        if brand_id:
            sql += " WHERE brand_id = ?"
            args = (brand_id,)
        sql += " ORDER BY started_at DESC LIMIT ?"
        with self._conn() as c:
            rows = c.execute(sql, (*args, limit)).fetchall()
        out = []
        for r in rows:
            sweep = Sweep.model_validate_json(r["body"])
            out.append({"id": r["id"], "brand_id": r["brand_id"], "brand_name": r["brand_name"], "started_at": r["started_at"],
                        "finished_at": r["finished_at"], "mode": r["mode"], "counts": sweep.counts, "calls_made": sweep.calls_made,
                        "fixture_kinds": sweep.fixture_kinds, "city_ids": sweep.city_ids})
        return out

    def previous_sweep(self, brand_id: str, before: Sweep) -> Sweep | None:
        with self._conn() as c:
            row = c.execute(
                "SELECT body FROM sweeps WHERE brand_id = ? AND started_at < ? AND id != ? ORDER BY started_at DESC LIMIT 1",
                (brand_id, before.started_at.isoformat(), before.id),
            ).fetchone()
        return Sweep.model_validate_json(row["body"]) if row else None

    # ---------- corroboration ----------
    def brands_for_numbers(self, numbers: list[str], exclude_brand_id: str) -> dict[str, list[str]]:
        """Other brands each number has been seen posing as (from any earlier sweep)."""
        if not numbers:
            return {}
        marks = ",".join("?" for _ in numbers)
        with self._conn() as c:
            rows = c.execute(
                f"SELECT DISTINCT number_norm, brand_name FROM observations WHERE number_norm IN ({marks}) AND brand_id != ? AND verdict IN ('fake','review')",
                (*numbers, exclude_brand_id),
            ).fetchall()
        out: dict[str, list[str]] = defaultdict(list)
        for r in rows:
            out[r["number_norm"]].append(r["brand_name"])
        return {k: sorted(v) for k, v in out.items()}

    def network(self) -> dict:
        """Numbers ↔ brands graph across the latest sweep of every brand."""
        with self._conn() as c:
            latest = c.execute("SELECT id, brand_id, brand_name, body FROM sweeps s WHERE started_at = (SELECT MAX(started_at) FROM sweeps WHERE brand_id = s.brand_id)").fetchall()
        nodes: dict[str, dict] = {}
        edges: list[dict] = []
        for r in latest:
            sweep = Sweep.model_validate_json(r["body"])
            nodes[f"brand:{r['brand_id']}"] = {"id": f"brand:{r['brand_id']}", "type": "brand", "label": r["brand_name"]}
            for f in sweep.findings:
                if f.verdict not in (Verdict.FAKE, Verdict.REVIEW):
                    continue
                nid = f"num:{f.number_norm}"
                node = nodes.setdefault(nid, {"id": nid, "type": "number", "label": f.display, "verdict": f.verdict.value, "score": f.score, "brands": 0})
                node["brands"] += 1
                if f.verdict == Verdict.FAKE:
                    node["verdict"] = "fake"
                edges.append({"source": nid, "target": f"brand:{r['brand_id']}", "surfaces": [s.value for s in f.surfaces], "cities": f.city_ids})
        return {"nodes": list(nodes.values()), "edges": edges}

    # ---------- brands ----------
    def upsert_brand(self, brand: Brand) -> None:
        with self._conn() as c:
            c.execute("INSERT OR REPLACE INTO brands VALUES (?, ?)", (brand.id, brand.model_dump_json()))

    def custom_brands(self) -> list[Brand]:
        with self._conn() as c:
            rows = c.execute("SELECT body FROM brands").fetchall()
        return [Brand.model_validate_json(r["body"]) for r in rows]

"""Thin SerpApi client with three modes.

live   → HTTPS call to serpapi.com, response recorded to the fixtures dir.
replay → fixtures only; a missing fixture raises FixtureMissing.
auto   → fixture when present, live otherwise (live needs a key).

Every response is wrapped as {"_fixture": {...}, "response": {...}} on disk so the
UI can say whether a result was recorded from SerpApi or synthesised for the demo.
The key is a hash of the sorted request params (api_key excluded), so the same
question always maps to the same file.
"""

from __future__ import annotations

import asyncio
import hashlib
import json
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

import httpx

SERPAPI_URL = "https://serpapi.com/search.json"
SERPAPI_ACCOUNT_URL = "https://serpapi.com/account.json"
SERPAPI_LOCATIONS_URL = "https://serpapi.com/locations.json"
ARCHIVE_URL = "https://serpapi.com/searches/{search_id}"
_TIMEOUT = httpx.Timeout(45.0, connect=10.0)
_LIVE_CONCURRENCY = 4


class FixtureMissing(RuntimeError):
    pass


class BudgetExceeded(RuntimeError):
    pass


class SerpApiError(RuntimeError):
    pass


def fixture_key(params: dict[str, Any]) -> str:
    clean = {k: str(v) for k, v in params.items() if k != "api_key" and v is not None}
    blob = json.dumps(clean, sort_keys=True, ensure_ascii=False)
    return hashlib.sha1(blob.encode("utf-8")).hexdigest()[:16]


@dataclass
class SerpResult:
    params: dict[str, Any]
    data: dict[str, Any]
    fixture_id: str
    fixture_kind: str  # recorded | synthetic | live
    from_cache: bool

    @property
    def search_id(self) -> str | None:
        return (self.data.get("search_metadata") or {}).get("id")

    @property
    def json_endpoint(self) -> str | None:
        return (self.data.get("search_metadata") or {}).get("json_endpoint")

    @property
    def raw_html_file(self) -> str | None:
        return (self.data.get("search_metadata") or {}).get("raw_html_file")

    @property
    def archive_link(self) -> str | None:
        sid = self.search_id
        return ARCHIVE_URL.format(search_id=sid) if sid and self.fixture_kind != "synthetic" else None


class CallBudget:
    """Counts SerpApi credits spent by one sweep. Cache hits are free."""

    def __init__(self, max_calls: int):
        self.max_calls = max_calls
        self.live_calls = 0
        self.cache_hits = 0

    def charge(self) -> None:
        if self.live_calls >= self.max_calls:
            raise BudgetExceeded(f"sweep cap of {self.max_calls} SerpApi calls reached")
        self.live_calls += 1


class SerpClient:
    def __init__(
        self,
        api_key: str | None,
        mode: str,
        fixtures_dir: Path,
        http: httpx.AsyncClient | None = None,
    ):
        self.api_key = api_key
        self.mode = mode
        self.fixtures_dir = fixtures_dir
        self._http = http
        self._sem = asyncio.Semaphore(_LIVE_CONCURRENCY)
        self._location_cache: dict[str, str] = {}

    # ---------- fixtures ----------
    def fixture_path(self, engine: str, key: str) -> Path:
        return self.fixtures_dir / engine / f"{key}.json"

    def _read_fixture(self, engine: str, key: str) -> SerpResult | None:
        path = self.fixture_path(engine, key)
        if not path.exists():
            return None
        wrapper = json.loads(path.read_text(encoding="utf-8"))
        meta = wrapper.get("_fixture") or {}
        return SerpResult(
            params=meta.get("params") or {},
            data=wrapper.get("response") or {},
            fixture_id=key,
            fixture_kind=meta.get("kind", "recorded"),
            from_cache=True,
        )

    def _write_fixture(self, engine: str, key: str, params: dict[str, Any], data: dict[str, Any]) -> None:
        path = self.fixture_path(engine, key)
        path.parent.mkdir(parents=True, exist_ok=True)
        wrapper = {
            "_fixture": {
                "kind": "recorded",
                "recorded_at": datetime.now(UTC).isoformat(timespec="seconds"),
                "params": {k: v for k, v in params.items() if k != "api_key"},
            },
            "response": data,
        }
        path.write_text(json.dumps(wrapper, ensure_ascii=False, indent=1), encoding="utf-8")

    # ---------- calls ----------
    async def search(self, params: dict[str, Any], budget: CallBudget) -> SerpResult:
        engine = params.get("engine", "google")
        key = fixture_key(params)
        cached = self._read_fixture(engine, key)
        if cached is not None:
            budget.cache_hits += 1
            return cached
        if self.mode == "replay" or not self.api_key:
            raise FixtureMissing(f"no fixture for {engine} {params.get('q') or params.get('text')!r} ({key})")
        budget.charge()
        data = await self._live(params)
        self._write_fixture(engine, key, params, data)
        return SerpResult(params=params, data=data, fixture_id=key, fixture_kind="live", from_cache=False)

    async def _live(self, params: dict[str, Any]) -> dict[str, Any]:
        http = self._http or httpx.AsyncClient(timeout=_TIMEOUT)
        owned = self._http is None
        try:
            async with self._sem:
                resp = await http.get(SERPAPI_URL, params={**params, "api_key": self.api_key})
            if resp.status_code != 200:
                raise SerpApiError(f"SerpApi HTTP {resp.status_code}: {resp.text[:200]}")
            data = resp.json()
            if data.get("error"):
                if "hasn't returned any results" in str(data["error"]):
                    # SerpApi reports an empty page as an error; for a sweep it is a valid answer: nothing there.
                    return {k: v for k, v in data.items() if k != "error"} | {"no_results": str(data["error"])}
                raise SerpApiError(str(data["error"]))
            return data
        finally:
            if owned:
                await http.aclose()

    async def account(self) -> dict[str, Any] | None:
        """Plan and credits left. Free: does not consume a search."""
        if not self.api_key:
            return None
        async with httpx.AsyncClient(timeout=_TIMEOUT) as http:
            resp = await http.get(SERPAPI_ACCOUNT_URL, params={"api_key": self.api_key})
            if resp.status_code != 200:
                return None
            return resp.json()

    async def resolve_location(self, query: str) -> str:
        """Canonical SerpApi location name for a city. Free endpoint; cached per process."""
        if query in self._location_cache:
            return self._location_cache[query]
        if not self.api_key:
            return query
        async with httpx.AsyncClient(timeout=_TIMEOUT) as http:
            resp = await http.get(SERPAPI_LOCATIONS_URL, params={"q": query, "limit": 1})
            items = resp.json() if resp.status_code == 200 else []
        canonical = items[0]["canonical_name"] if items else query
        self._location_cache[query] = canonical
        return canonical

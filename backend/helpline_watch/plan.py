"""Turn (brand, cities) into the exact list of SerpApi calls a sweep will make.

Deterministic on purpose: the synthetic-fixture generator and the eval script import
this so recorded fixtures line up with what the runner asks for.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from helpline_watch.extract import phones
from helpline_watch.models import Brand, City, NumberKind

GOOGLE_DOMAIN = "google.co.in"
INDIA_REGION = "2356"  # Google Ads Transparency region code for India
MAX_QUERIES_PER_CITY = 2
HINDI_TEMPLATE = "{brand} कस्टमर केयर नंबर"
QUERY_TEMPLATES = ("{brand} customer care number", "{brand} helpline number")
MAPS_TEMPLATE = "{brand} customer care"
AUTOCOMPLETE_SEED = "{brand} customer care"
_QUERY_HINTS = ("number", "care", "helpline", "contact", "toll")


@dataclass(frozen=True)
class PlannedCall:
    id: str
    engine: str
    params: dict[str, Any]
    city_id: str | None
    group: str  # search | maps | autocomplete | ads | hindi | reverse
    label: str


@dataclass
class SweepPlan:
    autocomplete: PlannedCall
    calls: list[PlannedCall] = field(default_factory=list)
    queries: list[str] = field(default_factory=list)

    @property
    def total(self) -> int:
        return 1 + len(self.calls)


def autocomplete_call(brand: Brand) -> PlannedCall:
    q = AUTOCOMPLETE_SEED.format(brand=brand.name)
    return PlannedCall(id="autocomplete", engine="google_autocomplete", city_id=None, group="autocomplete",
                       label=f"Autocomplete: {q}", params={"engine": "google_autocomplete", "q": q, "gl": "in", "hl": "en"})


def choose_queries(brand: Brand, suggestions: list[str]) -> list[str]:
    """Base templates plus the top autocomplete suggestion victims actually type."""
    base = [t.format(brand=brand.name) for t in QUERY_TEMPLATES]
    low = {q.lower() for q in base}
    extra = [s for s in suggestions if any(h in s.lower() for h in _QUERY_HINTS) and s.lower() not in low]
    chosen = [*base, *extra][:MAX_QUERIES_PER_CITY + 1]
    return chosen[:MAX_QUERIES_PER_CITY] if len(chosen) > MAX_QUERIES_PER_CITY else chosen


def search_params(q: str, city: City, hl: str = "en") -> dict[str, Any]:
    return {"engine": "google", "q": q, "location": city.location, "google_domain": GOOGLE_DOMAIN,
            "gl": "in", "hl": hl, "num": "10"}


def maps_params(brand: Brand, city: City) -> dict[str, Any]:
    return {"engine": "google_maps", "type": "search", "q": MAPS_TEMPLATE.format(brand=brand.name), "ll": city.ll,
            "google_domain": GOOGLE_DOMAIN, "hl": "en"}


def ads_params(brand: Brand) -> dict[str, Any]:
    return {"engine": "google_ads_transparency_center", "text": brand.name, "region": INDIA_REGION}


def reverse_params(number_norm: str, kind: NumberKind | None = None) -> dict[str, Any]:
    q = " OR ".join(f'"{form}"' for form in phones.search_forms(number_norm, kind))
    return {"engine": "google", "q": q, "google_domain": GOOGLE_DOMAIN, "gl": "in", "hl": "en", "num": "10"}


def build_plan(brand: Brand, cities: list[City], suggestions: list[str], max_calls: int, reserve: int = 6) -> SweepPlan:
    queries = choose_queries(brand, suggestions)
    plan = SweepPlan(autocomplete=autocomplete_call(brand), queries=queries)
    calls: list[PlannedCall] = [
        PlannedCall(id="ads", engine="google_ads_transparency_center", params=ads_params(brand), city_id=None,
                    group="ads", label=f"Ads Transparency · advertisers bidding on “{brand.name}”")
    ]
    if cities:
        first = cities[0]
        q = HINDI_TEMPLATE.format(brand=brand.name)
        calls.append(PlannedCall(id=f"hindi:{first.id}", engine="google", params=search_params(q, first, hl="hi"),
                                 city_id=first.id, group="hindi", label=f"Search (Hindi) · {first.name} · {q}"))
    for city in cities:
        for i, q in enumerate(queries):
            calls.append(PlannedCall(id=f"search:{city.id}:{i}", engine="google", params=search_params(q, city),
                                     city_id=city.id, group="search", label=f"Search · {city.name} · {q}"))
        calls.append(PlannedCall(id=f"maps:{city.id}", engine="google_maps", params=maps_params(brand, city),
                                 city_id=city.id, group="maps", label=f"Maps · {city.name} · {MAPS_TEMPLATE.format(brand=brand.name)}"))
    # Keep the plan under the credit cap: 1 for autocomplete, `reserve` for reverse lookups.
    plan.calls = calls[: max(0, max_calls - 1 - reserve)]
    return plan


def reverse_call(number_norm: str, kind: NumberKind | None = None) -> PlannedCall:
    return PlannedCall(id=f"reverse:{number_norm}", engine="google", params=reverse_params(number_norm, kind), city_id=None,
                       group="reverse", label=f"Reverse lookup · {phones.display(number_norm, kind)}")

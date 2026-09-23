"""Turn one SerpApi response into Observations (numbers seen) or advertiser findings.

Each parser is tolerant: any block may be missing, and a block that fails to parse is
skipped rather than aborting the sweep. Field names follow the SerpApi docs for the
`google`, `google_maps` and `google_ads_transparency_center` engines.
"""

from __future__ import annotations

from typing import Any

from helpline_watch.extract import phones
from helpline_watch.extract.text import (
    COMPLAINT_DOMAINS,
    SCAM_WORDS,
    contains_any,
    displayed_domain,
    domain_of,
    window,
)
from helpline_watch.models import (
    AdvertiserFinding,
    Brand,
    ListingMeta,
    Observation,
    Provenance,
    ReverseHit,
    Surface,
)
from helpline_watch.serp.client import SerpResult


def provenance(result: SerpResult, city_id: str | None) -> Provenance:
    p = result.params
    return Provenance(
        engine=p.get("engine", "google"),
        query=str(p.get("q") or p.get("text") or ""),
        city_id=city_id,
        hl=str(p.get("hl") or "en"),
        search_id=result.search_id,
        json_endpoint=result.json_endpoint,
        raw_html_file=result.raw_html_file,
        archive_link=result.archive_link,
        fixture_id=result.fixture_id,
        fixture_kind=result.fixture_kind,
    )


def _observations_from_text(
    text: str,
    *,
    surface: Surface,
    city_id: str | None,
    prov: Provenance,
    title: str | None,
    link: str | None,
    domain: str | None,
    listing: ListingMeta | None = None,
    advertiser: str | None = None,
) -> list[Observation]:
    out = []
    for parsed in phones.extract(text):
        out.append(
            Observation(
                number_raw=parsed.raw,
                number_norm=parsed.norm,
                kind=parsed.kind,
                surface=surface,
                city_id=city_id,
                source_title=title,
                source_link=link,
                source_domain=domain,
                context=window(text, parsed.raw),
                listing=listing,
                advertiser=advertiser,
                provenance=prov,
            )
        )
    return out


def _joined(*parts: Any) -> str:
    return " ".join(str(p) for p in parts if p)


def parse_google_search(result: SerpResult, city_id: str | None) -> list[Observation]:
    data, prov = result.data, provenance(result, city_id)
    obs: list[Observation] = []

    for ad in data.get("ads") or []:
        text = _joined(ad.get("title"), ad.get("description"), *[s.get("title") for s in ad.get("sitelinks") or []])
        domain = displayed_domain(ad.get("displayed_link")) or domain_of(ad.get("link"))
        obs += _observations_from_text(
            text, surface=Surface.SEARCH_ADS, city_id=city_id, prov=prov,
            title=ad.get("title"), link=ad.get("link"), domain=domain, advertiser=domain,
        )

    kg = data.get("knowledge_graph") or {}
    if kg:
        text = _joined(kg.get("title"), kg.get("phone"), kg.get("description"), kg.get("address"))
        obs += _observations_from_text(
            text, surface=Surface.SEARCH_KNOWLEDGE, city_id=city_id, prov=prov,
            title=kg.get("title"), link=kg.get("website"), domain=domain_of(kg.get("website")),
        )

    ab = data.get("answer_box") or {}
    if ab:
        text = _joined(ab.get("title"), ab.get("answer"), ab.get("snippet"), *(ab.get("list") or []))
        obs += _observations_from_text(
            text, surface=Surface.SEARCH_ANSWER, city_id=city_id, prov=prov,
            title=ab.get("title"), link=ab.get("link"), domain=domain_of(ab.get("link")),
        )

    places = (data.get("local_results") or {}).get("places") if isinstance(data.get("local_results"), dict) else data.get("local_results")
    for place in places or []:
        listing = ListingMeta(
            title=place.get("title"), place_id=place.get("place_id"), address=place.get("address"),
            rating=place.get("rating"), reviews=place.get("reviews"), listing_type=place.get("type"),
        )
        text = _joined(place.get("title"), place.get("phone"), place.get("address"), place.get("description"))
        obs += _observations_from_text(
            text, surface=Surface.SEARCH_LOCAL, city_id=city_id, prov=prov,
            title=place.get("title"), link=place.get("website"), domain=domain_of(place.get("website")), listing=listing,
        )

    for q in data.get("related_questions") or []:
        text = _joined(q.get("question"), q.get("snippet"), *(q.get("list") or []))
        obs += _observations_from_text(
            text, surface=Surface.SEARCH_PAA, city_id=city_id, prov=prov,
            title=q.get("title") or q.get("question"), link=q.get("link"), domain=domain_of(q.get("link")),
        )

    for org in data.get("organic_results") or []:
        rich = org.get("rich_snippet") or {}
        extensions = [*(rich.get("top") or {}).get("extensions", []), *(rich.get("bottom") or {}).get("extensions", [])]
        text = _joined(org.get("title"), org.get("snippet"), *extensions)
        obs += _observations_from_text(
            text, surface=Surface.SEARCH_ORGANIC, city_id=city_id, prov=prov,
            title=org.get("title"), link=org.get("link"), domain=domain_of(org.get("link")),
        )
    return obs


def parse_google_maps(result: SerpResult, city_id: str | None) -> list[Observation]:
    data, prov = result.data, provenance(result, city_id)
    obs: list[Observation] = []
    local = data.get("local_results")
    if isinstance(local, dict):  # single place result shape
        local = [local]
    for place in local or []:
        listing = ListingMeta(
            title=place.get("title"), place_id=place.get("place_id"), data_id=place.get("data_id"),
            address=place.get("address"), rating=place.get("rating"), reviews=place.get("reviews"),
            listing_type=place.get("type"), unclaimed=place.get("unclaimed_listing"), website=place.get("website"),
        )
        text = _joined(place.get("title"), place.get("phone"), place.get("description"), place.get("address"))
        obs += _observations_from_text(
            text, surface=Surface.MAPS, city_id=city_id, prov=prov,
            title=place.get("title"), link=place.get("website"), domain=domain_of(place.get("website")), listing=listing,
        )
    return obs


def _matches_brand(name: str, brand: Brand) -> bool:
    low = name.lower()
    needles = [brand.name.lower(), *[a.lower() for a in brand.aliases]]
    return any(n and n in low for n in needles)


def parse_ads_transparency(result: SerpResult, brand: Brand) -> list[AdvertiserFinding]:
    prov = provenance(result, None)
    grouped: dict[str, AdvertiserFinding] = {}
    for ad in result.data.get("ad_creatives") or []:
        name = ad.get("advertiser") or "Unknown advertiser"
        key = ad.get("advertiser_id") or name
        current = grouped.get(key)
        if current is None:
            current = AdvertiserFinding(
                advertiser=name, advertiser_id=ad.get("advertiser_id"), creatives=0,
                is_brand=_matches_brand(name, brand), first_shown=ad.get("first_shown"),
                last_shown=ad.get("last_shown"), details_link=ad.get("details_link"), provenance=prov,
            )
            grouped[key] = current
        grouped[key] = current.model_copy(
            update={
                "creatives": current.creatives + 1,
                "first_shown": min(x for x in (current.first_shown, ad.get("first_shown")) if x is not None)
                if (current.first_shown or ad.get("first_shown")) else None,
                "last_shown": max(x for x in (current.last_shown, ad.get("last_shown")) if x is not None)
                if (current.last_shown or ad.get("last_shown")) else None,
            }
        )
    return sorted(grouped.values(), key=lambda a: (a.is_brand, -a.creatives))


def parse_reverse(result: SerpResult) -> list[ReverseHit]:
    hits = []
    for org in result.data.get("organic_results") or []:
        text = _joined(org.get("title"), org.get("snippet"))
        domain = domain_of(org.get("link")) or ""
        words = contains_any(text, SCAM_WORDS)
        if any(domain.endswith(d) or d in domain for d in COMPLAINT_DOMAINS) and "complaint" not in words:
            words = [*words, "complaint-site"]
        hits.append(ReverseHit(title=org.get("title") or "", link=org.get("link") or "", domain=domain, snippet=org.get("snippet") or "", scam_words=words))
    return hits


def parse_autocomplete(result: SerpResult) -> list[str]:
    return [s.get("value") for s in result.data.get("suggestions") or [] if s.get("value")]

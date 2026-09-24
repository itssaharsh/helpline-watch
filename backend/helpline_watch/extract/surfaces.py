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
    SerpItem,
    SerpSnapshot,
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
    text = text.translate(phones.DEVANAGARI_DIGITS)
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


def _as_list(value: Any) -> list:
    """SerpApi sometimes ships a block as a dict of lists (sitelinks) or a lone dict."""
    if isinstance(value, list):
        return value
    if isinstance(value, dict):
        nested = [v for v in value.values() if isinstance(v, list)]
        return [item for sub in nested for item in sub] if nested else [value]
    return []


def _dicts(value: Any) -> list[dict]:
    return [item for item in _as_list(value) if isinstance(item, dict)]


def _num(value: Any) -> float | None:
    try:
        return float(str(value).replace(",", "")) if value not in (None, "") else None
    except ValueError:
        return None


def _int(value: Any) -> int | None:
    n = _num(value)
    return int(n) if n is not None else None


def _listing(place: dict) -> ListingMeta:
    return ListingMeta(
        title=place.get("title"), place_id=place.get("place_id"), data_id=place.get("data_id"), address=place.get("address"),
        rating=_num(place.get("rating")), reviews=_int(place.get("reviews")), listing_type=place.get("type"),
        unclaimed=bool(place.get("unclaimed_listing")) if place.get("unclaimed_listing") is not None else None,
        website=place.get("website"),
    )


def parse_google_search(result: SerpResult, city_id: str | None) -> list[Observation]:
    data, prov = result.data, provenance(result, city_id)
    obs: list[Observation] = []

    for ad in _dicts(data.get("ads")):
        text = _joined(ad.get("title"), ad.get("description"), *[s.get("title") for s in _dicts(ad.get("sitelinks"))])
        domain = displayed_domain(ad.get("displayed_link")) or domain_of(ad.get("link"))
        obs += _observations_from_text(
            text, surface=Surface.SEARCH_ADS, city_id=city_id, prov=prov,
            title=ad.get("title"), link=ad.get("link"), domain=domain, advertiser=domain,
        )

    kg = data.get("knowledge_graph")
    if isinstance(kg, dict) and kg:
        text = _joined(kg.get("title"), kg.get("phone"), kg.get("description"), kg.get("address"))
        obs += _observations_from_text(
            text, surface=Surface.SEARCH_KNOWLEDGE, city_id=city_id, prov=prov,
            title=kg.get("title"), link=kg.get("website"), domain=domain_of(kg.get("website")),
        )

    for ab in _dicts(data.get("answer_box"))[:1]:
        text = _joined(ab.get("title"), ab.get("answer"), ab.get("snippet"), *_as_list(ab.get("list")))
        obs += _observations_from_text(
            text, surface=Surface.SEARCH_ANSWER, city_id=city_id, prov=prov,
            title=ab.get("title"), link=ab.get("link"), domain=domain_of(ab.get("link")),
        )

    local = data.get("local_results")
    places = local.get("places") if isinstance(local, dict) and "places" in local else local
    for place in _dicts(places):
        text = _joined(place.get("title"), place.get("phone"), place.get("address"), place.get("description"))
        # The listing owner sets `website`; it is shown but never counts as the brand's domain.
        obs += _observations_from_text(
            text, surface=Surface.SEARCH_LOCAL, city_id=city_id, prov=prov,
            title=place.get("title"), link=place.get("website"), domain=None, listing=_listing(place),
        )

    for q in _dicts(data.get("related_questions")):
        text = _joined(q.get("question"), q.get("snippet"), *_as_list(q.get("list")))
        obs += _observations_from_text(
            text, surface=Surface.SEARCH_PAA, city_id=city_id, prov=prov,
            title=q.get("title") or q.get("question"), link=q.get("link"), domain=domain_of(q.get("link")),
        )

    for org in _dicts(data.get("organic_results")):
        rich = org.get("rich_snippet") if isinstance(org.get("rich_snippet"), dict) else {}
        top, bottom = rich.get("top") or {}, rich.get("bottom") or {}
        extensions = [*_as_list(top.get("extensions") if isinstance(top, dict) else None), *_as_list(bottom.get("extensions") if isinstance(bottom, dict) else None)]
        text = _joined(org.get("title"), org.get("snippet"), *extensions)
        obs += _observations_from_text(
            text, surface=Surface.SEARCH_ORGANIC, city_id=city_id, prov=prov,
            title=org.get("title"), link=org.get("link"), domain=domain_of(org.get("link")),
        )
    return obs


def parse_google_maps(result: SerpResult, city_id: str | None) -> list[Observation]:
    data, prov = result.data, provenance(result, city_id)
    obs: list[Observation] = []
    places = _dicts(data.get("local_results"))
    if isinstance(data.get("place_results"), dict):  # an exact-match query returns one place
        places = [data["place_results"], *places]
    for place in places:
        text = _joined(place.get("title"), place.get("phone"), place.get("description"), place.get("address"))
        obs += _observations_from_text(
            text, surface=Surface.MAPS, city_id=city_id, prov=prov,
            title=place.get("title"), link=place.get("website"), domain=None, listing=_listing(place),
        )
    return obs


def _matches_brand(name: str, brand: Brand) -> bool:
    low = name.lower()
    needles = [brand.name.lower(), *[a.lower() for a in brand.aliases]]
    return any(n and n in low for n in needles)


def parse_ads_transparency(result: SerpResult, brand: Brand) -> list[AdvertiserFinding]:
    prov = provenance(result, None)
    grouped: dict[str, AdvertiserFinding] = {}
    for ad in _dicts(result.data.get("ad_creatives")):
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
    for org in _dicts(result.data.get("organic_results")):
        text = _joined(org.get("title"), org.get("snippet"))
        domain = domain_of(org.get("link")) or ""
        words = contains_any(text, SCAM_WORDS)
        if any(domain.endswith(d) or d in domain for d in COMPLAINT_DOMAINS) and "complaint" not in words:
            words = [*words, "complaint-site"]
        hits.append(ReverseHit(title=org.get("title") or "", link=org.get("link") or "", domain=domain, snippet=org.get("snippet") or "", scam_words=words))
    return hits


def parse_autocomplete(result: SerpResult) -> list[str]:
    return [s.get("value") for s in _dicts(result.data.get("suggestions")) if s.get("value")]


def _numbers_in(*parts: Any) -> list[dict]:
    return [{"raw": p.raw, "norm": p.norm} for p in phones.extract(_joined(*parts))]


def _item(kind: str, src: dict, **fields: Any) -> SerpItem:
    text = fields.pop("text", None)
    title = fields.pop("title", src.get("title"))
    item = SerpItem(kind=kind, title=title, link=src.get("link") or src.get("website"), displayed_link=src.get("displayed_link"),
                    text=text, phone=src.get("phone"), rating=_num(src.get("rating")), reviews=_int(src.get("reviews")),
                    listing_type=src.get("type"), address=src.get("address"), place_id=src.get("place_id"),
                    unclaimed=bool(src.get("unclaimed_listing")) if src.get("unclaimed_listing") is not None else None, **fields)
    return item.model_copy(update={"numbers": _numbers_in(item.title, item.phone, item.text, item.address, item.question)})


def snapshot(result: SerpResult, call_id: str, city_id: str | None, group: str) -> SerpSnapshot:
    """A trimmed copy of the page, in the order Google showed it, for the evidence sheet."""
    data, p = result.data, result.params
    items: list[SerpItem] = []
    engine = p.get("engine", "google")
    if engine == "google":
        for ad in _dicts(data.get("ads")):
            items.append(_item("ad", ad, text=_joined(ad.get("description"), *[s.get("title") for s in _dicts(ad.get("sitelinks"))])))
        for ab in _dicts(data.get("answer_box"))[:1]:
            items.append(_item("answer", ab, text=_joined(ab.get("answer"), ab.get("snippet"), *_as_list(ab.get("list")))))
        local = data.get("local_results")
        places = local.get("places") if isinstance(local, dict) and "places" in local else local
        for place in _dicts(places):
            items.append(_item("local", place, text=place.get("description")))
        kg = data.get("knowledge_graph")
        if isinstance(kg, dict) and kg:
            items.append(_item("knowledge", {**kg, "link": kg.get("website")}, text=_joined(kg.get("type"), kg.get("description"))))
        organic = _dicts(data.get("organic_results"))
        paa = _dicts(data.get("related_questions"))
        for i, org in enumerate(organic):
            items.append(_item("organic", org, text=org.get("snippet")))
            if i == 1:
                for q in paa:
                    items.append(_item("paa", q, title=q.get("title"), question=q.get("question"), text=q.get("snippet")))
        if len(organic) < 2:
            for q in paa:
                items.append(_item("paa", q, title=q.get("title"), question=q.get("question"), text=q.get("snippet")))
    elif engine == "google_maps":
        places = _dicts(data.get("local_results"))
        if isinstance(data.get("place_results"), dict):
            places = [data["place_results"], *places]
        for place in places:
            items.append(_item("maps", place, text=place.get("description")))
    return SerpSnapshot(call_id=call_id, city_id=city_id, engine=engine, query=str(p.get("q") or p.get("text") or ""), hl=str(p.get("hl") or "en"),
                        group=group, fixture_kind=result.fixture_kind, archive_link=result.archive_link, items=items)

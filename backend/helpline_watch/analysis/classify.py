"""Signals → verdict. Deterministic; every point on the score has a named reason.

Thresholds: score >= FAKE_THRESHOLD → fake; 1..2 → review; official matches short-circuit.
"""

from __future__ import annotations

from collections import defaultdict

from helpline_watch.extract import phones
from helpline_watch.extract.text import HELPLINE_WORDS, SCAM_WORDS, contains_any, is_official_domain
from helpline_watch.models import (
    Brand,
    Finding,
    NumberKind,
    Observation,
    ReverseHit,
    Signal,
    Surface,
    Verdict,
)

FAKE_THRESHOLD = 3
THIN_LISTING_REVIEWS = 5
MULTI_CITY_MIN = 3

TRAI_NOTE = "TRAI direction of 19 Nov 2025 requires RBI/SEBI/PFRDA-regulated entities to use 1600-series numbers for service calls"


def official_norms(brand: Brand) -> set[str]:
    out = set()
    for raw in brand.official_numbers:
        parsed = phones.normalise(raw)
        if parsed:
            out.add(parsed.norm)
    return out


def _helpline_context(obs: list[Observation]) -> bool:
    for o in obs:
        if contains_any(o.context, HELPLINE_WORDS):
            return True
        if o.listing and contains_any(o.listing.title, HELPLINE_WORDS):
            return True
    return False


def _signals_for(number: str, kind: NumberKind, obs: list[Observation], brand: Brand, officials: set[str], other_brands: list[str]) -> list[Signal]:
    signals: list[Signal] = [Signal(code="NOT_IN_OFFICIAL_LIST", weight=1, detail=f"Not one of {brand.name}'s {len(officials)} official numbers")]

    for off in officials:
        if phones.digit_distance(number, off) == 1 or phones.is_transposition(number, off):
            signals.append(Signal(code="LOOKALIKE_OF_OFFICIAL", weight=3, detail=f"One digit away from official {phones.display(off)}"))
            break

    if kind == NumberKind.MOBILE and _helpline_context(obs):
        weight = 2 if brand.is_regulated else 1
        why = "presented as a helpline for a regulated entity; " + TRAI_NOTE if brand.is_regulated else "a personal mobile presented as a brand helpline"
        signals.append(Signal(code="MOBILE_AS_HELPLINE", weight=weight, detail=f"10-digit mobile number {why}"))

    listing_titles = [o.listing.title for o in obs if o.listing and o.listing.title]
    if any(contains_any(t, HELPLINE_WORDS) for t in listing_titles):
        signals.append(Signal(code="LISTING_NAMED_AS_HELPLINE", weight=2, detail=f"Maps listing titled “{listing_titles[0]}”; brands do not name places like this"))

    thin = [o.listing for o in obs if o.listing and (o.listing.unclaimed or (o.listing.reviews is not None and o.listing.reviews < THIN_LISTING_REVIEWS))]
    if thin:
        signals.append(Signal(code="THIN_OR_UNCLAIMED_LISTING", weight=1, detail="Unclaimed listing or fewer than 5 reviews"))

    if other_brands:
        signals.append(Signal(code="CROSS_BRAND", weight=3, detail="Same number also posing as " + ", ".join(other_brands)))

    cities = {o.city_id for o in obs if o.city_id}
    if len(cities) >= MULTI_CITY_MIN:
        signals.append(Signal(code="MULTI_CITY", weight=1, detail=f"Planted in {len(cities)} cities"))

    ad_obs = [o for o in obs if o.surface == Surface.SEARCH_ADS and not is_official_domain(o.source_domain, brand.official_domains)]
    if ad_obs:
        signals.append(Signal(code="AD_FROM_NON_OFFICIAL_DOMAIN", weight=2, detail=f"Shown in a Google ad by {ad_obs[0].source_domain or 'an unknown advertiser'}"))

    scam_hits = {w for o in obs for w in contains_any(o.context, SCAM_WORDS)}
    if scam_hits:
        signals.append(Signal(code="SCAM_WORDS_IN_CONTEXT", weight=2, detail="Context mentions " + ", ".join(sorted(scam_hits))))
    return signals


def _verdict(score: int) -> Verdict:
    return Verdict.FAKE if score >= FAKE_THRESHOLD else Verdict.REVIEW


def classify(brand: Brand, observations: list[Observation], cross_brand: dict[str, list[str]] | None = None) -> list[Finding]:
    """Group observations by number and decide each one. `cross_brand` maps number → other brand names."""
    cross_brand = cross_brand or {}
    officials = official_norms(brand)
    grouped: dict[str, list[Observation]] = defaultdict(list)
    seen: set[tuple] = set()
    for o in observations:
        key = (o.number_norm, o.surface, o.city_id, o.source_link, o.listing.place_id if o.listing else None, o.listing.title if o.listing else None)
        if key in seen:
            continue  # the same sighting reached by two queries in the same city
        seen.add(key)
        grouped[o.number_norm].append(o)

    findings: list[Finding] = []
    for number, obs in grouped.items():
        kind = obs[0].kind
        surfaces = sorted({o.surface for o in obs}, key=lambda s: s.value)
        cities = sorted({o.city_id for o in obs if o.city_id})
        base = dict(number_norm=number, display=phones.display(number), kind=kind, observations=obs, surfaces=surfaces, city_ids=cities)

        if number in officials:
            third_party = [o.source_domain for o in obs if o.source_domain and not is_official_domain(o.source_domain, brand.official_domains)]
            detail = "Matches the official list" + (f"; also republished by {third_party[0]}" if third_party else "")
            findings.append(Finding(**base, verdict=Verdict.OFFICIAL, score=0, signals=[Signal(code="OFFICIAL_MATCH", weight=0, detail=detail)]))
            continue

        on_official_site = [o for o in obs if is_official_domain(o.source_domain, brand.official_domains)]
        if on_official_site:
            detail = f"Published on {on_official_site[0].source_domain} but missing from the official list; add it"
            findings.append(Finding(**base, verdict=Verdict.OFFICIAL_UNLISTED, score=0, signals=[Signal(code="ON_OFFICIAL_DOMAIN", weight=0, detail=detail)]))
            continue

        others = cross_brand.get(number, [])
        signals = _signals_for(number, kind, obs, brand, officials, others)
        score = sum(s.weight for s in signals)
        findings.append(Finding(**base, verdict=_verdict(score), score=score, signals=signals, other_brands=others))

    order = {Verdict.FAKE: 0, Verdict.REVIEW: 1, Verdict.OFFICIAL_UNLISTED: 2, Verdict.OFFICIAL: 3}
    return sorted(findings, key=lambda f: (order[f.verdict], -f.score, f.number_norm))


def apply_reverse(finding: Finding, hits: list[ReverseHit]) -> Finding:
    """Fold reverse-lookup evidence into a finding and re-score it."""
    flagged = [h for h in hits if h.scam_words]
    signals = [s for s in finding.signals if s.code != "REVERSE_LOOKUP"]
    if flagged:
        detail = f"{len(flagged)} of {len(hits)} pages about this number mention fraud or sit on complaint sites (e.g. {flagged[0].domain})"
        signals.append(Signal(code="REVERSE_LOOKUP", weight=2, detail=detail))
    score = sum(s.weight for s in signals)
    verdict = finding.verdict if finding.verdict in (Verdict.OFFICIAL, Verdict.OFFICIAL_UNLISTED) else _verdict(score)
    return finding.model_copy(update={"signals": signals, "score": score, "verdict": verdict, "reverse_hits": hits, "reverse_checked": True})

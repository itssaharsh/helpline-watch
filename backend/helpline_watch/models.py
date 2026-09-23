"""Domain model. Everything the pipeline passes around is one of these."""

from __future__ import annotations

from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, Field

REGULATED_CATEGORIES = {"bank", "fintech", "nbfc", "insurer", "broker", "pension"}


class Surface(StrEnum):
    """Where on Google a phone number was seen."""

    SEARCH_ORGANIC = "search_organic"
    SEARCH_ADS = "search_ads"
    SEARCH_LOCAL = "search_local"
    SEARCH_KNOWLEDGE = "search_knowledge"
    SEARCH_PAA = "search_paa"
    SEARCH_ANSWER = "search_answer"
    MAPS = "maps"
    ADS_TRANSPARENCY = "ads_transparency"
    REVERSE = "reverse"


class NumberKind(StrEnum):
    MOBILE = "mobile"
    LANDLINE = "landline"
    TOLLFREE_1800 = "tollfree_1800"
    PREMIUM_1860 = "premium_1860"
    SERVICE_1600 = "service_1600"
    OTHER = "other"


class Verdict(StrEnum):
    OFFICIAL = "official"
    OFFICIAL_UNLISTED = "official_unlisted"
    FAKE = "fake"
    REVIEW = "review"


class Brand(BaseModel):
    id: str
    name: str
    category: str = "other"
    regulated: bool = False
    official_domains: list[str] = Field(default_factory=list)
    official_numbers: list[str] = Field(default_factory=list)
    aliases: list[str] = Field(default_factory=list)

    @property
    def is_regulated(self) -> bool:
        return self.regulated or self.category in REGULATED_CATEGORIES


class City(BaseModel):
    id: str
    name: str
    state: str
    location: str
    ll: str
    default: bool = False


class Provenance(BaseModel):
    """Enough to replay the exact SerpApi search a fact came from."""

    engine: str
    query: str
    city_id: str | None = None
    hl: str = "en"
    search_id: str | None = None
    json_endpoint: str | None = None
    raw_html_file: str | None = None
    archive_link: str | None = None
    fixture_id: str | None = None
    fixture_kind: str | None = None  # recorded | synthetic | live


class ListingMeta(BaseModel):
    title: str | None = None
    place_id: str | None = None
    data_id: str | None = None
    address: str | None = None
    rating: float | None = None
    reviews: int | None = None
    listing_type: str | None = None
    unclaimed: bool | None = None
    website: str | None = None


class Observation(BaseModel):
    """One phone number seen once, somewhere."""

    number_raw: str
    number_norm: str
    kind: NumberKind
    surface: Surface
    city_id: str | None
    source_title: str | None = None
    source_link: str | None = None
    source_domain: str | None = None
    context: str = ""
    listing: ListingMeta | None = None
    advertiser: str | None = None
    provenance: Provenance


class Signal(BaseModel):
    code: str
    weight: int
    detail: str


class ReverseHit(BaseModel):
    title: str
    link: str
    domain: str
    snippet: str
    scam_words: list[str] = Field(default_factory=list)


class Finding(BaseModel):
    number_norm: str
    display: str
    kind: NumberKind
    verdict: Verdict
    score: int
    signals: list[Signal] = Field(default_factory=list)
    observations: list[Observation] = Field(default_factory=list)
    surfaces: list[Surface] = Field(default_factory=list)
    city_ids: list[str] = Field(default_factory=list)
    other_brands: list[str] = Field(default_factory=list)
    reverse_hits: list[ReverseHit] = Field(default_factory=list)
    reverse_checked: bool = False
    explanation: str | None = None
    in_pack: bool = False


class AdvertiserFinding(BaseModel):
    advertiser: str
    advertiser_id: str | None = None
    creatives: int = 0
    is_brand: bool = False
    first_shown: int | None = None
    last_shown: int | None = None
    details_link: str | None = None
    provenance: Provenance


class CityCoverage(BaseModel):
    city_id: str
    planned: int
    completed: int
    failed: int


class Sweep(BaseModel):
    id: str
    brand_id: str
    brand_name: str
    started_at: datetime
    finished_at: datetime | None = None
    mode: str = "auto"
    city_ids: list[str] = Field(default_factory=list)
    queries: list[str] = Field(default_factory=list)
    calls_made: int = 0
    calls_planned: int = 0
    live_calls: int = 0
    cache_hits: int = 0
    fixture_kinds: dict[str, int] = Field(default_factory=dict)
    coverage: list[CityCoverage] = Field(default_factory=list)
    findings: list[Finding] = Field(default_factory=list)
    advertisers: list[AdvertiserFinding] = Field(default_factory=list)
    errors: list[str] = Field(default_factory=list)

    @property
    def counts(self) -> dict[str, int]:
        out = {v.value: 0 for v in Verdict}
        for f in self.findings:
            out[f.verdict.value] += 1
        return out


class SweepEvent(BaseModel):
    type: str
    payload: dict = Field(default_factory=dict)

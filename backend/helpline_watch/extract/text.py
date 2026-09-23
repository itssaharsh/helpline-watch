"""Small text helpers shared by parsers and the classifier."""

from __future__ import annotations

import re
from urllib.parse import urlparse

HELPLINE_WORDS = (
    "customer care", "helpline", "help line", "toll free", "toll-free", "tollfree",
    "contact number", "customer service", "support number", "complaint number",
    "care number", "phone number", "call center", "call centre", "24x7", "24/7",
    "कस्टमर केयर", "हेल्पलाइन", "ग्राहक सेवा", "संपर्क नंबर",
)
SCAM_WORDS = (
    "scam", "fraud", "fake", "cheated", "duped", "cyber crime", "cybercrime", "lost rs",
    "lost ₹", "beware", "do not call", "don't call", "धोखाधड़ी", "ठगी", "फर्जी", "सावधान",
)
COMPLAINT_DOMAINS = (
    "consumercomplaints.in", "quora.com", "reddit.com", "twitter.com", "x.com", "facebook.com",
    "mouthshut.com", "cybercrime.gov.in", "truecaller.com", "consumerhelpline.gov.in",
    "indianconsumercomplaints", "grahakseva", "complaintboard",
)
NEWS_DOMAINS = (
    "timesofindia", "hindustantimes", "indianexpress", "ndtv", "thehindu", "deccanherald",
    "economictimes", "livemint", "news18", "indiatoday", "tribuneindia", "moneycontrol",
)


def domain_of(url: str | None) -> str | None:
    if not url:
        return None
    try:
        host = urlparse(url if "://" in url else f"https://{url}").hostname or ""
    except ValueError:
        return None
    host = host.lower()
    return host[4:] if host.startswith("www.") else host or None


def displayed_domain(displayed_link: str | None) -> str | None:
    """SerpApi's displayed_link looks like 'https://www.x.com › a › b'."""
    if not displayed_link:
        return None
    return domain_of(displayed_link.split(" ")[0].split("›")[0].strip())


def contains_any(text: str | None, words: tuple[str, ...]) -> list[str]:
    if not text:
        return []
    low = text.lower()
    return [w for w in words if w in low]


def is_official_domain(domain: str | None, official_domains: list[str]) -> bool:
    if not domain:
        return False
    return any(domain == d or domain.endswith("." + d) for d in official_domains)


def window(text: str, needle: str, radius: int = 110) -> str:
    """The slice of `text` around the first occurrence of `needle`."""
    i = text.find(needle)
    if i < 0:
        return text[: radius * 2].strip()
    start, end = max(0, i - radius), min(len(text), i + len(needle) + radius)
    return re.sub(r"\s+", " ", text[start:end]).strip()

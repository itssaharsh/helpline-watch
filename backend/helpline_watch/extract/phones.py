"""Find and normalise Indian phone numbers in free text.

Handles +91 / 0091 / 0 prefixes, "+91 (0)" forms, Devanagari digits, the 1800/1860/1600
series, and the separators people actually type. Extraction walks digit groups so a
stray "2" or a pincode before a number never swallows it, and two numbers written back
to back are both found. Everything is pure and deterministic.
"""

from __future__ import annotations

import re
from dataclasses import dataclass

from helpline_watch.models import NumberKind

DEVANAGARI_DIGITS = str.maketrans("०१२३४५६७८९", "0123456789")

# A maximal run of digits and the separators people put between digit groups.
_RUN = re.compile(r"\+?\d[\d\s\-.()/]*\d|\+?\d")
_GROUP = re.compile(r"\d+")
_MIN_DIGITS = 8
_MAX_DIGITS = 14
_SERVICE_PREFIXES = ("1800", "1860", "1600")
_SERVICE_LENGTHS = {8, 10, 11, 12}  # 1800 XXXX · 1800 XXX XXX · 1800 XXX XXXX · 1800 XXXX XXXX
_SERVICE_KIND = {"1800": NumberKind.TOLLFREE_1800, "1860": NumberKind.PREMIUM_1860, "1600": NumberKind.SERVICE_1600}
_TWO_DIGIT_STD = {"11", "22", "33", "44", "40", "80", "20", "79"}
_MOBILE_START = "6789"


@dataclass(frozen=True)
class ParsedNumber:
    raw: str
    norm: str
    kind: NumberKind

    @property
    def digits(self) -> str:
        return re.sub(r"\D", "", self.norm)


def _strip_prefix(digits: str) -> tuple[str, bool]:
    """Remove country/trunk prefixes. Returns (subscriber digits, had_explicit_prefix)."""
    had = False
    if digits.startswith("0091"):
        digits, had = digits[4:], True
    elif digits.startswith("91") and len(digits) in (12, 13) and digits[2:6] not in _SERVICE_PREFIXES:
        digits, had = digits[2:], True
    elif digits.startswith("91") and len(digits) in (12, 13, 14) and digits[2:6] in _SERVICE_PREFIXES:
        digits, had = digits[2:], True
    if digits.startswith("0") and len(digits) == 11:
        digits, had = digits[1:], True
    return digits, had


def _subscriber_group_lengths(raw: str, subscriber: str) -> list[int]:
    """Lengths of the digit groups that spell the subscriber part, as written."""
    groups = _GROUP.findall(raw)
    flat = "".join(groups)
    start = flat.find(subscriber)
    if start < 0:
        return []
    end = start + len(subscriber)
    out: list[int] = []
    pos = 0
    for g in groups:
        g_start, g_end = pos, pos + len(g)
        overlap = min(g_end, end) - max(g_start, start)
        if overlap > 0:
            out.append(overlap)
        pos = g_end
    return out


def _grouped_like_landline(raw: str, subscriber: str) -> bool:
    """STD code + number is written as two or three groups whose first has 2–4 digits."""
    lengths = _subscriber_group_lengths(raw, subscriber)
    return len(lengths) in (2, 3) and 2 <= lengths[0] <= 4


def _classify(digits: str, raw: str) -> tuple[str, NumberKind] | None:
    """Return (canonical, kind) or None if this is not an Indian phone number."""
    if digits[:4] in _SERVICE_PREFIXES and len(digits) in _SERVICE_LENGTHS:
        return digits, _SERVICE_KIND[digits[:4]]
    subscriber, had_prefix = _strip_prefix(digits)
    if subscriber[:4] in _SERVICE_PREFIXES and len(subscriber) in _SERVICE_LENGTHS:
        return subscriber, _SERVICE_KIND[subscriber[:4]]
    if len(subscriber) != 10:
        return None
    grouped_like_landline = _grouped_like_landline(raw, subscriber)
    if subscriber[0] in _MOBILE_START:
        kind = NumberKind.LANDLINE if grouped_like_landline else NumberKind.MOBILE
        return "+91" + subscriber, kind
    if subscriber[0] in "12345" and (had_prefix or grouped_like_landline):
        # Landlines are written with an STD code (0xx…) or +91; a bare 10-digit run
        # starting 1-5 is more likely a pincode, an order id or an amount.
        return "+91" + subscriber, NumberKind.LANDLINE
    return None


def normalise(raw: str) -> ParsedNumber | None:
    """Normalise one number string. Returns None when it is not a plausible Indian number."""
    text = raw.translate(DEVANAGARI_DIGITS)
    digits = re.sub(r"\D", "", text)
    if not (_MIN_DIGITS <= len(digits) <= _MAX_DIGITS):
        return None
    result = _classify(digits, text)
    if result is None:
        return None
    norm, kind = result
    return ParsedNumber(raw=raw.strip(), norm=norm, kind=kind)


def _parse_run(run: str) -> list[ParsedNumber]:
    """Every number inside one run of digit groups, longest valid parse from each group start."""
    groups = list(_GROUP.finditer(run))
    out: list[ParsedNumber] = []
    i = 0
    while i < len(groups):
        found: tuple[int, ParsedNumber] | None = None
        for j in range(len(groups) - 1, i - 1, -1):
            candidate = run[groups[i].start() : groups[j].end()]
            if candidate.startswith("+") is False and groups[i].start() > 0 and run[groups[i].start() - 1] == "+":
                candidate = "+" + candidate
            ndigits = sum(len(g.group(0)) for g in groups[i : j + 1])
            if ndigits > _MAX_DIGITS:
                continue
            if ndigits < _MIN_DIGITS:
                break
            parsed = normalise(candidate)
            if parsed is not None:
                found = (j, parsed)
                break
        if found is None:
            i += 1
            continue
        out.append(found[1])
        i = found[0] + 1
    return out


def extract(text: str | None) -> list[ParsedNumber]:
    """Every distinct Indian phone number in `text`, in order of first appearance."""
    if not text:
        return []
    text = text.translate(DEVANAGARI_DIGITS)
    seen: set[str] = set()
    out: list[ParsedNumber] = []
    for run in _RUN.finditer(text):
        for parsed in _parse_run(run.group(0)):
            if parsed.norm in seen:
                continue
            seen.add(parsed.norm)
            out.append(parsed)
    return out


def _std_split(d: str) -> tuple[str, str]:
    std_len = 2 if d[:2] in _TWO_DIGIT_STD else 3
    return d[:std_len], d[std_len:]


def _guess_kind(norm: str) -> NumberKind:
    if norm[:4] in _SERVICE_PREFIXES:
        return _SERVICE_KIND[norm[:4]]
    d = norm.removeprefix("+91")
    return NumberKind.MOBILE if d[:1] in _MOBILE_START else NumberKind.LANDLINE


def display(norm: str, kind: NumberKind | None = None) -> str:
    """Human-friendly formatting of a canonical number."""
    kind = kind or _guess_kind(norm)
    if norm.startswith("+91"):
        d = norm[3:]
        if kind == NumberKind.MOBILE:
            return f"+91 {d[:5]} {d[5:]}"
        std, rest = _std_split(d)
        half = len(rest) // 2
        return f"0{std} {rest[:half]} {rest[half:]}"
    if norm[:4] in _SERVICE_PREFIXES:
        head, rest = norm[:4], norm[4:]
        groups = {8: (4, 4), 7: (3, 4), 6: (3, 3), 4: (4,)}.get(len(rest))
        if not groups:
            return f"{head} {rest}"
        parts, i = [], 0
        for g in groups:
            parts.append(rest[i : i + g])
            i += g
        return " ".join([head, *parts])
    return norm


def search_forms(norm: str, kind: NumberKind | None = None) -> list[str]:
    """The two spellings people write a number in, for an exact-phrase reverse search."""
    kind = kind or _guess_kind(norm)
    if norm.startswith("+91"):
        d = norm[3:]
        compact = d if kind == NumberKind.MOBILE else "0" + d
        spaced = display(norm, kind).removeprefix("+91 ")
        return [compact, spaced]
    return [norm, display(norm, kind)]


def digit_distance(a: str, b: str) -> int:
    """Levenshtein distance between the digit strings of two canonical numbers."""
    x, y = re.sub(r"\D", "", a), re.sub(r"\D", "", b)
    if x == y:
        return 0
    prev = list(range(len(y) + 1))
    for i, cx in enumerate(x, 1):
        cur = [i]
        for j, cy in enumerate(y, 1):
            cur.append(min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (cx != cy)))
        prev = cur
    return prev[-1]


def is_transposition(a: str, b: str) -> bool:
    """True when `a` and `b` differ by exactly one adjacent swap."""
    x, y = re.sub(r"\D", "", a), re.sub(r"\D", "", b)
    if len(x) != len(y) or x == y:
        return False
    diffs = [i for i, (p, q) in enumerate(zip(x, y, strict=True)) if p != q]
    return len(diffs) == 2 and diffs[1] == diffs[0] + 1 and x[diffs[0]] == y[diffs[1]] and x[diffs[1]] == y[diffs[0]]

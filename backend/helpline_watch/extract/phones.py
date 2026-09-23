"""Find and normalise Indian phone numbers in free text.

Handles +91 / 0091 / 0 prefixes, Devanagari digits, 1800/1860/1600 series,
and the separators people actually type (spaces, dashes, dots, brackets).
Everything is pure and deterministic: a number is either in the text or it is not.
"""

from __future__ import annotations

import re
from dataclasses import dataclass

from helpline_watch.models import NumberKind

DEVANAGARI_DIGITS = str.maketrans("०१२३४५६७८९", "0123456789")

# A run of digits with optional separators; 8 to 15 digits in total.
_CANDIDATE = re.compile(r"(?<![\w.])(?:\+?\d[\d\s\-.()]{6,20}\d)(?![\w])")
_MIN_DIGITS = 8
_MAX_DIGITS = 13
_SERVICE_PREFIXES = ("1800", "1860", "1600")
_SERVICE_LENGTHS = {8, 10, 11, 12}  # 1800 XXXX · 1800 XXX XXX · 1800 XXX XXXX · 1800 XXXX XXXX


@dataclass(frozen=True)
class ParsedNumber:
    raw: str
    norm: str
    kind: NumberKind

    @property
    def digits(self) -> str:
        return re.sub(r"\D", "", self.norm)


def _service(digits: str) -> tuple[str, NumberKind]:
    kind = {
        "1800": NumberKind.TOLLFREE_1800,
        "1860": NumberKind.PREMIUM_1860,
        "1600": NumberKind.SERVICE_1600,
    }[digits[:4]]
    return digits, kind


def _classify_digits(digits: str) -> tuple[str, NumberKind] | None:
    """Return (canonical, kind) or None if this is not an Indian phone number."""
    if digits[:4] in _SERVICE_PREFIXES and len(digits) in _SERVICE_LENGTHS:
        return _service(digits)
    # Strip international / trunk prefixes.
    if digits.startswith("0091"):
        digits = digits[4:]
    elif digits.startswith("91") and len(digits) == 12:
        digits = digits[2:]
    elif digits.startswith("0") and len(digits) == 11:
        digits = digits[1:]


    if len(digits) == 10:
        if digits[0] in "6789":
            return "+91" + digits, NumberKind.MOBILE
        if digits[0] in "12345":
            # Landline with STD code already stripped of the trunk 0 (e.g. 22xxxxxxxx for Mumbai,
            # 124xxxxxxx for Gurugram). 1xxx numbers other than the service series are landlines.
            return "+91" + digits, NumberKind.LANDLINE
    return None


def normalise(raw: str) -> ParsedNumber | None:
    """Normalise one number string. Returns None when it is not a plausible Indian number."""
    text = raw.translate(DEVANAGARI_DIGITS)
    digits = re.sub(r"\D", "", text)
    if not (_MIN_DIGITS <= len(digits) <= _MAX_DIGITS):
        return None
    result = _classify_digits(digits)
    if result is None:
        return None
    norm, kind = result
    return ParsedNumber(raw=raw.strip(), norm=norm, kind=kind)


def extract(text: str | None) -> list[ParsedNumber]:
    """Every distinct Indian phone number in `text`, in order of first appearance."""
    if not text:
        return []
    text = text.translate(DEVANAGARI_DIGITS)
    seen: set[str] = set()
    out: list[ParsedNumber] = []
    for match in _CANDIDATE.finditer(text):
        parsed = normalise(match.group(0))
        if parsed is None or parsed.norm in seen:
            continue
        seen.add(parsed.norm)
        out.append(parsed)
    return out


_TWO_DIGIT_STD = {"11", "22", "33", "44", "40", "80", "20", "79"}


def _std_split(d: str) -> tuple[str, str]:
    std_len = 2 if d[:2] in _TWO_DIGIT_STD else 3
    return d[:std_len], d[std_len:]


def display(norm: str) -> str:
    """Human-friendly formatting of a canonical number."""
    if norm.startswith("+91"):
        d = norm[3:]
        if d[0] in "6789":
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


def search_forms(norm: str) -> list[str]:
    """The two spellings people write a number in, for an exact-phrase reverse search."""
    if norm.startswith("+91"):
        d = norm[3:]
        compact = d if d[0] in "6789" else "0" + d
        spaced = display(norm).removeprefix("+91 ")
        return [compact, spaced]
    return [norm, display(norm)]

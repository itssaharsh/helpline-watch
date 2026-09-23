"""Load seed brands and cities from YAML."""

from __future__ import annotations

from pathlib import Path

import yaml

from helpline_watch.models import Brand, City


def load_brands(seeds_dir: Path) -> list[Brand]:
    raw = yaml.safe_load((seeds_dir / "brands.yaml").read_text(encoding="utf-8")) or []
    return [Brand.model_validate(item) for item in raw]


def load_cities(seeds_dir: Path) -> list[City]:
    raw = yaml.safe_load((seeds_dir / "cities.yaml").read_text(encoding="utf-8")) or []
    return [City.model_validate(item) for item in raw]


def default_city_ids(cities: list[City]) -> list[str]:
    return [c.id for c in cities if c.default]

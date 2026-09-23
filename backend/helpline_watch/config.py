"""Settings from environment. Validated once at startup; nothing reads os.environ elsewhere."""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

from dotenv import load_dotenv

PACKAGE_DIR = Path(__file__).resolve().parent
BACKEND_DIR = PACKAGE_DIR.parent
REPO_DIR = BACKEND_DIR.parent

VALID_MODES = ("live", "replay", "auto")


@dataclass(frozen=True)
class Settings:
    serpapi_key: str | None
    mode: str
    max_calls: int
    fixtures_dir: Path
    data_dir: Path
    seeds_dir: Path
    static_dir: Path
    extra: dict = field(default_factory=dict)

    @property
    def can_go_live(self) -> bool:
        return bool(self.serpapi_key) and self.mode != "replay"


def load_settings(env_file: Path | None = None) -> Settings:
    load_dotenv(env_file or REPO_DIR / ".env", override=False)
    mode = (os.getenv("HELPLINE_MODE") or "auto").strip().lower()
    if mode not in VALID_MODES:
        raise ValueError(f"HELPLINE_MODE must be one of {VALID_MODES}, got {mode!r}")
    key = (os.getenv("SERPAPI_API_KEY") or "").strip() or None
    if mode == "live" and not key:
        raise ValueError("HELPLINE_MODE=live needs SERPAPI_API_KEY")
    max_calls = int(os.getenv("HELPLINE_MAX_CALLS") or 60)
    if max_calls < 1:
        raise ValueError("HELPLINE_MAX_CALLS must be >= 1")
    data_dir = Path(os.getenv("HELPLINE_DATA_DIR") or BACKEND_DIR / "data")
    data_dir.mkdir(parents=True, exist_ok=True)
    return Settings(
        serpapi_key=key,
        mode=mode,
        max_calls=max_calls,
        fixtures_dir=Path(os.getenv("HELPLINE_FIXTURES_DIR") or BACKEND_DIR / "fixtures"),
        data_dir=data_dir,
        seeds_dir=BACKEND_DIR / "seeds",
        static_dir=PACKAGE_DIR / "static",
    )

"""make verify — the deterministic proof.

Replays the seeded sweeps and asserts the before/after a judge sees on screen:
  * the shared planted number is flagged FAKE and linked across three brands,
  * a one-digit lookalike is flagged FAKE even with no complaint evidence,
  * an official number republished by a third party stays OFFICIAL (no false alarm),
  * an unknown landline in a news story stays REVIEW (never auto-flagged),
  * the takedown pack contains only confirmed fakes,
  * partial coverage is reported instead of a false "clean" sweep.
Prints PASS/FAIL. Runs without any API key.
"""

from __future__ import annotations

import asyncio
import io
import os
import sys
import tempfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "backend"))
os.environ.setdefault("HELPLINE_MODE", "replay")
os.environ["HELPLINE_DATA_DIR"] = tempfile.mkdtemp(prefix="hw-verify-")

from helpline_watch.api import Services  # noqa: E402
from helpline_watch.config import load_settings  # noqa: E402
from helpline_watch.seeds import load_brands  # noqa: E402
from helpline_watch.takedown import build_pack  # noqa: E402

CHECKS: list[tuple[str, bool, str]] = []


def check(name: str, ok: bool, detail: str = "") -> None:
    CHECKS.append((name, ok, detail))
    print(f"  {'PASS' if ok else 'FAIL'}  {name}{('  · ' + detail) if detail else ''}")


async def run_sweep(svc: Services, brand_id: str):
    brand = svc.brand(brand_id)
    cities = [c for c in svc.cities if c.default]
    async for ev in svc.runner.run(brand, cities):
        if ev.type == "done":
            return ev.payload
    raise RuntimeError("sweep produced no done event")


def main() -> int:
    settings = load_settings()
    svc = Services(settings)
    print(f"Helpline Watch verify · mode={svc.runner.effective_mode()} · fixtures={settings.fixtures_dir}")
    results = {}
    for b in load_brands(settings.seeds_dir):
        results[b.id] = asyncio.run(run_sweep(svc, b.id))
    # sweep HDFC again so cross-brand evidence from the other brands is available
    results["hdfc-bank"] = asyncio.run(run_sweep(svc, "hdfc-bank"))
    hdfc = results["hdfc-bank"]["sweep"]
    by_num = {f["number_norm"]: f for f in hdfc["findings"]}

    shared = by_num.get("+917411029385")
    check("shared planted number is FAKE", bool(shared and shared["verdict"] == "fake"), f"score={shared and shared['score']}")
    check("shared number linked across brands", bool(shared and len(shared["other_brands"]) >= 2), f"other_brands={shared and shared['other_brands']}")
    look = by_num.get("180016001601")
    check("one-digit lookalike is FAKE without complaint evidence", bool(look and look["verdict"] == "fake" and not any(h["scam_words"] for h in look["reverse_hits"])))
    official = by_num.get("180016001600")
    third_party = official and any(o["source_domain"] and "hdfcbank.com" not in o["source_domain"] for o in official["observations"])
    check("official number republished by a third party stays OFFICIAL", bool(official and official["verdict"] == "official" and third_party))
    unlisted = by_num.get("+912261606161")
    check("unlisted number on the brand's own domain is OFFICIAL_UNLISTED", bool(unlisted and unlisted["verdict"] == "official_unlisted"))
    news = by_num.get("+913340401188")
    check("unknown landline in a news story stays REVIEW", bool(news and news["verdict"] == "review"))
    ad = by_num.get("+919830177462")
    check("number inside an impersonating ad is FAKE", bool(ad and ad["verdict"] == "fake" and any(s["code"] == "AD_FROM_NON_OFFICIAL_DOMAIN" for s in ad["signals"])))

    sweep_obj = svc.store.get_sweep(hdfc["id"])
    pack = build_pack(sweep_obj, svc.brand("hdfc-bank"))
    with zipfile.ZipFile(io.BytesIO(pack)) as z:
        names = set(z.namelist())
        csv_rows = z.read("findings.csv").decode().strip().splitlines()[1:]
    check("takedown pack has csv, evidence, report and complaint template", names == {"findings.csv", "evidence.json", "report.md", "complaint_template.txt"})
    fakes = sum(1 for f in hdfc["findings"] if f["verdict"] == "fake")
    check("takedown pack contains only confirmed fakes", len(csv_rows) == fakes and fakes > 0, f"rows={len(csv_rows)} fakes={fakes}")

    paytm = results["paytm"]["sweep"]
    kolkata = next(c for c in paytm["coverage"] if c["city_id"] == "kolkata")
    check("partial coverage is reported, not hidden", kolkata["failed"] >= 1 and kolkata["completed"] < kolkata["planned"], f"kolkata {kolkata['completed']}/{kolkata['planned']}")
    check("no live SerpApi calls were needed", all(r["live_calls"] == 0 for r in results.values()))

    total_fake = sum(sum(1 for f in r["sweep"]["findings"] if f["verdict"] == "fake") for r in results.values())
    print(f"\nSeeded world: {len(results)} brands · {total_fake} fake numbers · {sum(r['sweep']['calls_made'] for r in results.values())} cached calls")
    failed = [c for c in CHECKS if not c[1]]
    print("\nRESULT:", "PASS" if not failed else f"FAIL ({len(failed)} of {len(CHECKS)} checks failed)")
    return 0 if not failed else 1


if __name__ == "__main__":
    sys.exit(main())

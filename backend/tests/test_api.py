"""API tests run fully in replay mode against the committed fixtures."""

import json

import pytest
from fastapi.testclient import TestClient

from helpline_watch.api import create_app
from helpline_watch.config import Settings


@pytest.fixture
def client(tmp_path):
    from helpline_watch.config import BACKEND_DIR, PACKAGE_DIR

    settings = Settings(serpapi_key=None, mode="replay", max_calls=60, fixtures_dir=BACKEND_DIR / "fixtures",
                        data_dir=tmp_path, seeds_dir=BACKEND_DIR / "seeds", static_dir=PACKAGE_DIR / "static")
    return TestClient(create_app(settings))


def _events(text: str):
    out = []
    for block in text.strip().split("\n\n"):
        lines = block.splitlines()
        name = next(line[7:] for line in lines if line.startswith("event: "))
        data = json.loads(next(line[6:] for line in lines if line.startswith("data: ")))
        out.append((name, data))
    return out


def test_health_reports_replay_mode_without_key(client):
    body = client.get("/api/health").json()
    assert body["mode"] == "replay" and body["has_key"] is False
    assert body["fixtures"]["google"] > 0


def test_stream_emits_plan_calls_findings_and_done(client):
    res = client.get("/api/sweeps/stream", params={"brand_id": "hdfc-bank", "cities": "mumbai,delhi"})
    assert res.status_code == 200 and res.headers["content-type"].startswith("text/event-stream")
    events = _events(res.text)
    names = [n for n, _ in events]
    assert names[0] == "started" and names[1] == "plan" and names[-1] == "done"
    assert "call_done" in names and "findings" in names
    done = events[-1][1]
    assert done["counts"]["fake"] >= 2 and done["live_calls"] == 0
    sweep_id = done["sweep"]["id"]

    got = client.get(f"/api/sweeps/{sweep_id}").json()
    assert got["sweep"]["brand_id"] == "hdfc-bank"

    pack = client.get(f"/api/sweeps/{sweep_id}/pack.zip")
    assert pack.status_code == 200 and pack.headers["content-type"] == "application/zip"


def test_patch_finding_can_mark_official_and_toggle_pack(client):
    done = _events(client.get("/api/sweeps/stream", params={"brand_id": "hdfc-bank", "cities": "kolkata"}).text)[-1][1]
    sweep_id = done["sweep"]["id"]
    review = next(f for f in done["sweep"]["findings"] if f["verdict"] == "review")
    fake = next(f for f in done["sweep"]["findings"] if f["verdict"] == "fake")

    out = client.patch(f"/api/sweeps/{sweep_id}/findings/{review['number_norm']}", json={"mark_official": True}).json()
    assert out["finding"]["verdict"] == "official"
    assert review["display"] in out["brand"]["official_numbers"]

    out = client.patch(f"/api/sweeps/{sweep_id}/findings/{fake['number_norm']}", json={"in_pack": False}).json()
    assert out["finding"]["in_pack"] is False


def test_unknown_brand_and_city_are_clean_errors(client):
    assert client.get("/api/sweeps/stream", params={"brand_id": "nope"}).status_code == 404
    assert client.get("/api/sweeps/stream", params={"brand_id": "hdfc-bank", "cities": "atlantis"}).status_code == 400

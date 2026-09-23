from datetime import UTC, datetime

from helpline_watch.models import Finding, NumberKind, Observation, Provenance, Surface, Sweep, Verdict
from helpline_watch.store import Store


def obs(number, city="mumbai"):
    return Observation(number_raw=number, number_norm=number, kind=NumberKind.MOBILE, surface=Surface.MAPS, city_id=city,
                       provenance=Provenance(engine="google_maps", query="q"))


def sweep(sid, brand_id, brand_name, findings, when):
    return Sweep(id=sid, brand_id=brand_id, brand_name=brand_name, started_at=when, finished_at=when, findings=findings)


def test_cross_brand_index_and_network(tmp_path):
    store = Store(tmp_path / "t.sqlite")
    shared = "+919123456789"
    f1 = Finding(number_norm=shared, display=shared, kind=NumberKind.MOBILE, verdict=Verdict.FAKE, score=4, observations=[obs(shared)])
    f2 = Finding(number_norm="18002600", display="1800 2600", kind=NumberKind.TOLLFREE_1800, verdict=Verdict.OFFICIAL, score=0, observations=[obs("18002600")])
    store.save_sweep(sweep("s1", "zomato", "Zomato", [f1], datetime(2026, 9, 20, tzinfo=UTC)))
    store.save_sweep(sweep("s2", "hdfc-bank", "HDFC Bank", [f1, f2], datetime(2026, 9, 21, tzinfo=UTC)))

    assert store.brands_for_numbers([shared, "18002600"], exclude_brand_id="hdfc-bank") == {shared: ["Zomato"]}
    net = store.network()
    ids = {n["id"] for n in net["nodes"]}
    assert ids == {"brand:zomato", "brand:hdfc-bank", f"num:{shared}"}  # official numbers are not graph nodes
    assert len(net["edges"]) == 2
    latest = store.list_sweeps("hdfc-bank")
    assert latest[0]["id"] == "s2" and latest[0]["counts"]["fake"] == 1
    assert store.previous_sweep("hdfc-bank", store.get_sweep("s2")) is None

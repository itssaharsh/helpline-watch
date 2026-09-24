import json

import pytest

from helpline_watch.serp.client import (
    BudgetExceeded,
    CallBudget,
    FixtureMissing,
    SerpClient,
    fixture_key,
)


def test_fixture_key_ignores_api_key_and_order():
    a = fixture_key({"engine": "google", "q": "x", "api_key": "secret"})
    b = fixture_key({"q": "x", "engine": "google"})
    assert a == b


def test_replay_uses_fixture_and_costs_nothing(tmp_path):
    params = {"engine": "google", "q": "HDFC customer care", "gl": "in"}
    key = fixture_key(params)
    path = tmp_path / "google" / f"{key}.json"
    path.parent.mkdir(parents=True)
    path.write_text(json.dumps({"_fixture": {"kind": "synthetic", "params": params}, "response": {"organic_results": []}}))
    client = SerpClient(api_key=None, mode="replay", fixtures_dir=tmp_path)
    budget = CallBudget(max_calls=1)

    import asyncio

    result = asyncio.run(client.search(params, budget))
    assert result.fixture_kind == "synthetic"
    assert result.from_cache is True
    assert budget.live_calls == 0 and budget.cache_hits == 1
    assert result.archive_link is None  # synthetic fixtures never claim an archive link


def test_replay_without_fixture_raises(tmp_path):
    import asyncio

    client = SerpClient(api_key=None, mode="replay", fixtures_dir=tmp_path)
    with pytest.raises(FixtureMissing):
        asyncio.run(client.search({"engine": "google", "q": "nothing"}, CallBudget(5)))


def test_budget_blocks_live_calls_over_cap():
    budget = CallBudget(max_calls=1)
    budget.charge()
    with pytest.raises(BudgetExceeded):
        budget.charge()


@pytest.mark.asyncio
async def test_no_results_error_is_an_empty_page_and_gets_recorded(tmp_path):
    import httpx

    payload = {"search_metadata": {"id": "abc", "status": "Success"}, "search_parameters": {"engine": "google_ads_transparency_center"},
               "error": "Google Ads Transparency Center hasn't returned any results for this search."}

    async def handler(request):
        return httpx.Response(200, json=payload)

    http = httpx.AsyncClient(transport=httpx.MockTransport(handler))
    client = SerpClient(api_key="k", mode="auto", fixtures_dir=tmp_path, http=http)
    res = await client.search({"engine": "google_ads_transparency_center", "text": "HDFC Bank"}, CallBudget(max_calls=2))
    assert res.data.get("error") is None and "no_results" in res.data
    again = await client.search({"engine": "google_ads_transparency_center", "text": "HDFC Bank"}, CallBudget(max_calls=2))
    assert again.from_cache

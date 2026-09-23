from helpline_watch.analysis.classify import apply_reverse, classify
from helpline_watch.extract.surfaces import parse_ads_transparency, parse_google_maps, parse_google_search, parse_reverse
from helpline_watch.models import Brand, Surface, Verdict
from helpline_watch.serp.client import SerpResult

BRAND = Brand(id="hdfc-bank", name="HDFC Bank", category="bank", regulated=True,
              official_domains=["hdfcbank.com"], official_numbers=["1800 1600 1600", "1800 2600"])


def result(engine, data, q="HDFC Bank customer care number", kind="synthetic"):
    return SerpResult(params={"engine": engine, "q": q}, data=data, fixture_id="abc", fixture_kind=kind, from_cache=True)


def test_search_parser_reads_every_block_that_can_carry_a_number():
    data = {
        "ads": [{"title": "HDFC Customer Care 24x7", "link": "https://hdfc-help.info", "displayed_link": "https://hdfc-help.info › care", "description": "Call 98765 43210 now"}],
        "knowledge_graph": {"title": "HDFC Bank", "phone": "1800 1600 1600", "website": "https://www.hdfcbank.com"},
        "answer_box": {"title": "HDFC toll free", "snippet": "Dial 1800 2600 for phone banking", "link": "https://www.hdfcbank.com/personal/need-help"},
        "local_results": {"places": [{"title": "HDFC Bank Customer Care Number", "phone": "+91 91234 56789", "rating": 4.9, "reviews": 2, "type": "Bank"}]},
        "related_questions": [{"question": "What is HDFC customer care number?", "snippet": "It is 1800 1600 1600.", "link": "https://example.org/faq"}],
        "organic_results": [{"title": "HDFC Bank Contact", "link": "https://www.hdfcbank.com/contact", "snippet": "Phone banking 1800 2600"}],
    }
    obs = parse_google_search(result("google", data), "mumbai")
    surfaces = {o.surface for o in obs}
    assert surfaces == {Surface.SEARCH_ADS, Surface.SEARCH_KNOWLEDGE, Surface.SEARCH_ANSWER, Surface.SEARCH_LOCAL, Surface.SEARCH_PAA, Surface.SEARCH_ORGANIC}
    ad = next(o for o in obs if o.surface == Surface.SEARCH_ADS)
    assert ad.number_norm == "+919876543210" and ad.source_domain == "hdfc-help.info"
    local = next(o for o in obs if o.surface == Surface.SEARCH_LOCAL)
    assert local.listing.title == "HDFC Bank Customer Care Number" and local.listing.reviews == 2


def test_maps_parser_keeps_listing_metadata_and_phone():
    data = {"local_results": [{"title": "HDFC Bank Customer Care Number Patna", "phone": "+91 91234 56789", "place_id": "ChIJ123", "data_id": "0x1:0x2", "rating": 3.0, "reviews": 1, "type": "Bank", "unclaimed_listing": True}]}
    obs = parse_google_maps(result("google_maps", data), "patna")
    assert len(obs) == 1
    assert obs[0].listing.place_id == "ChIJ123" and obs[0].listing.unclaimed is True


def test_classifier_marks_official_lookalike_mobile_and_cross_brand():
    data = {
        "local_results": [
            {"title": "HDFC Bank Customer Care Number", "phone": "+91 91234 56789", "reviews": 1, "type": "Bank"},
            {"title": "HDFC Bank ATM", "phone": "1800 1600 1600", "reviews": 120, "type": "Bank"},
            {"title": "HDFC helpline", "phone": "1800 1600 1610", "reviews": 0, "type": "Bank"},
        ]
    }
    obs = parse_google_maps(result("google_maps", data), "mumbai")
    findings = classify(BRAND, obs, cross_brand={"+919123456789": ["Zomato", "IndiGo"]})
    by_number = {f.number_norm: f for f in findings}
    assert by_number["180016001600"].verdict == Verdict.OFFICIAL
    lookalike = by_number["180016001610"]
    assert lookalike.verdict == Verdict.FAKE and any(s.code == "LOOKALIKE_OF_OFFICIAL" for s in lookalike.signals)
    mobile = by_number["+919123456789"]
    codes = {s.code for s in mobile.signals}
    assert {"MOBILE_AS_HELPLINE", "LISTING_NAMED_AS_HELPLINE", "CROSS_BRAND", "THIN_OR_UNCLAIMED_LISTING"} <= codes
    assert mobile.verdict == Verdict.FAKE and mobile.other_brands == ["Zomato", "IndiGo"]
    assert findings[0].verdict == Verdict.FAKE  # fakes sort first


def test_number_on_official_domain_is_never_flagged():
    data = {"organic_results": [{"title": "Grievance cell", "link": "https://www.hdfcbank.com/grievance", "snippet": "Call 022 6160 6161"}]}
    obs = parse_google_search(result("google", data), "delhi")
    [finding] = classify(BRAND, obs)
    assert finding.verdict == Verdict.OFFICIAL_UNLISTED and finding.score == 0


def test_unknown_landline_on_news_site_is_review_not_fake():
    data = {"organic_results": [{"title": "Bank branch opens", "link": "https://timesofindia.indiatimes.com/x", "snippet": "Reach the branch on 022 2345 6789"}]}
    obs = parse_google_search(result("google", data), "delhi")
    [finding] = classify(BRAND, obs)
    assert finding.verdict == Verdict.REVIEW


def test_reverse_lookup_promotes_review_to_fake():
    data = {"organic_results": [{"title": "Contact", "link": "https://random-blog.in/x", "snippet": "HDFC helpline 022 2345 6789"}]}
    obs = parse_google_search(result("google", data), "delhi")
    [finding] = classify(BRAND, obs)
    assert finding.verdict == Verdict.REVIEW
    hits = parse_reverse(result("google", {"organic_results": [
        {"title": "Lost Rs 90,000 after calling 022 2345 6789", "link": "https://www.consumercomplaints.in/x", "snippet": "This is a scam number"},
        {"title": "Some page", "link": "https://example.com", "snippet": "nothing"},
    ]}, q='"022 2345 6789"'))
    updated = apply_reverse(finding, hits)
    assert updated.verdict == Verdict.FAKE and updated.reverse_checked


def test_ads_transparency_separates_brand_from_third_party_advertisers():
    data = {"ad_creatives": [
        {"advertiser": "HDFC Bank Ltd", "advertiser_id": "AR1", "first_shown": 1, "last_shown": 5},
        {"advertiser": "Quick Loans Consultancy", "advertiser_id": "AR2", "first_shown": 3, "last_shown": 9},
        {"advertiser": "Quick Loans Consultancy", "advertiser_id": "AR2", "first_shown": 2, "last_shown": 10},
    ]}
    advertisers = parse_ads_transparency(result("google_ads_transparency_center", data), BRAND)
    assert [a.advertiser for a in advertisers] == ["Quick Loans Consultancy", "HDFC Bank Ltd"]
    assert advertisers[0].creatives == 2 and advertisers[0].first_shown == 2 and advertisers[0].last_shown == 10
    assert advertisers[1].is_brand is True

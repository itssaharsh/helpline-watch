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
    findings = classify(BRAND, obs, cross_brand={"+919123456789": {"fake": ["Zomato", "IndiGo"], "review": []}})
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


def test_unconfirmed_sightings_for_other_brands_never_escalate_to_fake():
    data = {"organic_results": [{"title": "Helpline directory", "link": "https://helpline-directory.org/x", "snippet": "Banking helpdesk 022 2345 6789"}]}
    obs = parse_google_search(result("google", data), "delhi")
    [finding] = classify(BRAND, obs, cross_brand={"+912223456789": {"fake": [], "review": ["Zomato", "IndiGo"]}})
    assert finding.verdict == Verdict.REVIEW and finding.score == 2
    assert any(s.code == "SEEN_FOR_OTHER_BRANDS" for s in finding.signals)


def test_listing_website_field_cannot_make_a_number_official():
    data = {"local_results": [{"title": "HDFC Bank Customer Care Helpline", "phone": "+91 91234 56789", "website": "https://www.hdfcbank.com", "reviews": 0}]}
    obs = parse_google_maps(result("google_maps", data), "mumbai")
    [finding] = classify(BRAND, obs)
    assert finding.verdict == Verdict.FAKE


def test_parsers_survive_odd_block_shapes():
    data = {
        "ads": [{"title": "Ad", "sitelinks": {"inline": [{"title": "Call 98765 43210"}]}}],
        "answer_box": [{"title": "Box", "snippet": "Dial 1800 2600"}],
        "organic_results": [{"title": "Org", "link": "https://x.in/a", "snippet": "n/a", "rich_snippet": {"top": {"extensions": None}}}],
        "local_results": {"places": [{"title": "Place", "phone": "1800 1600 1600", "reviews": "1,234", "rating": "4.5"}]},
        "related_questions": [{"question": "q?"}],
    }
    obs = parse_google_search(result("google", data), "delhi")
    assert {o.number_norm for o in obs} == {"+919876543210", "18002600", "180016001600"}
    assert next(o for o in obs if o.listing).listing.reviews == 1234


def test_single_place_maps_result_is_parsed():
    data = {"place_results": {"title": "HDFC Bank Customer Care Number", "phone": "+91 91234 56789", "place_id": "ChIJone"}}
    obs = parse_google_maps(result("google_maps", data), "patna")
    assert len(obs) == 1 and obs[0].listing.place_id == "ChIJone"


def test_merge_analyst_state_keeps_pack_and_reverse_evidence():
    from helpline_watch.analysis.classify import merge_analyst_state

    data = {"organic_results": [{"title": "Contact", "link": "https://random-blog.in/x", "snippet": "HDFC helpline 022 2345 6789"}]}
    obs = parse_google_search(result("google", data), "delhi")
    [old] = classify(BRAND, obs)
    hits = parse_reverse(result("google", {"organic_results": [{"title": "Scam", "link": "https://www.consumercomplaints.in/x", "snippet": "fraud number"}]}))
    old = apply_reverse(old, hits).model_copy(update={"in_pack": True})
    assert old.verdict == Verdict.FAKE
    [merged] = merge_analyst_state(classify(BRAND, obs), [old])
    assert merged.verdict == Verdict.FAKE and merged.in_pack and merged.reverse_checked


def test_snapshot_keeps_page_order_and_locates_numbers():
    from helpline_watch.extract.surfaces import snapshot

    data = {
        "ads": [{"title": "HDFC Care", "link": "https://hdfc-help.info", "description": "Call 98765 43210"}],
        "local_results": {"places": [{"title": "HDFC Bank Customer Care Number", "phone": "+91 91234 56789", "reviews": 2}]},
        "organic_results": [{"title": "A", "link": "https://a.in", "snippet": "no number"}, {"title": "B", "link": "https://b.in", "snippet": "1800 2600"}, {"title": "C", "link": "https://c.in"}],
        "related_questions": [{"question": "Which number?", "snippet": "It is 1800 1600 1600."}],
    }
    snap = snapshot(result("google", data), "search:mumbai:0", "mumbai", "search")
    assert [i.kind for i in snap.items] == ["ad", "local", "organic", "organic", "paa", "organic"]
    assert snap.items[0].numbers == [{"raw": "98765 43210", "norm": "+919876543210"}]
    assert snap.items[1].numbers[0]["norm"] == "+919123456789"
    assert snap.items[4].numbers[0]["norm"] == "180016001600"
    assert snap.archive_link is None  # synthetic


def test_reverse_hit_on_the_brands_own_domain_pulls_a_suspect_back_to_review():
    # HDFC's WhatsApp number republished by a third party: the number itself googles to hdfc.bank.in
    data = {"organic_results": [{"title": "HDFC customer care numbers", "link": "https://indiacustomercare.com/x", "snippet": "HDFC Bank customer care: 70700 22222 (WhatsApp banking, 24x7)"}]}
    obs = parse_google_search(result("google", data), "delhi")
    [finding] = classify(BRAND, obs)
    assert finding.verdict == Verdict.FAKE  # mobile presented as a regulated brand's helpline
    hits = parse_reverse(result("google", {"organic_results": [
        {"title": "Chat Banking", "link": "https://www.hdfcbank.com/chat-banking", "snippet": "Save +91 7070022222 in your contacts"},
        {"title": "Truecaller", "link": "https://www.truecaller.com/x", "snippet": "who called"},
    ]}, q='"70700 22222"'))
    updated = apply_reverse(finding, hits, BRAND.official_domains)
    assert updated.verdict == Verdict.REVIEW
    assert any(s.code == "REVERSE_ON_OFFICIAL_DOMAIN" and s.weight < 0 for s in updated.signals)
    assert updated.score >= 0


def test_mobile_on_a_user_created_page_of_the_brands_own_domain_is_not_vouched_for():
    zomato = Brand(id="zomato", name="Zomato", category="food_delivery", regulated=False, official_domains=["zomato.com"], official_numbers=[])
    data = {"organic_results": [
        {"title": "Delivery 24x7, Garia, Kolkata", "link": "https://www.zomato.com/kolkata/delivery-24x7-garia", "snippet": "zomato customer care number. Tap a number to call +918240511047"},
        {"title": "Zomato - Restaurant Partner", "link": "https://www.zomato.com/partners/login", "snippet": "Contact Us +91-97-38383838"},
    ]}
    obs = parse_google_search(result("google", data, q="Zomato customer care number"), "kolkata")
    by = {f.number_norm: f for f in classify(zomato, obs)}
    listing = by["+918240511047"]
    assert listing.verdict == Verdict.FAKE and any(s.code == "UGC_ON_OFFICIAL_DOMAIN" for s in listing.signals)
    assert by["+919738383838"].verdict == Verdict.OFFICIAL_UNLISTED


def test_maps_house_number_does_not_extend_the_phone():
    data = {"local_results": [{"title": "HDFC Bank", "phone": "+91 1800 1601", "address": "10/3/0151, Entrenchment Rd, Secunderabad", "reviews": 40, "rating": 4.1, "place_id": "p1"}]}
    obs = parse_google_maps(result("google_maps", data), "hyderabad")
    assert [o.number_norm for o in obs] == ["18001601"]

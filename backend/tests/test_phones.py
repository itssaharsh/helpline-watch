from helpline_watch.extract.phones import (
    digit_distance,
    display,
    extract,
    is_transposition,
    normalise,
)
from helpline_watch.models import NumberKind


def test_normalises_mobile_with_country_code_and_spaces():
    parsed = normalise("+91 98765 43210")
    assert parsed is not None
    assert parsed.norm == "+919876543210"
    assert parsed.kind == NumberKind.MOBILE


def test_normalises_mobile_with_trunk_zero_and_dashes():
    assert normalise("098765-43210").norm == "+919876543210"


def test_normalises_toll_free_1800_variants_to_same_canonical():
    variants = ["1800 1600 1600", "1800-1600-1600", "18001600 1600", "1800 160 01600"]
    norms = {normalise(v).norm for v in variants}
    assert norms == {"180016001600"}
    assert normalise("1800 1600 1600").kind == NumberKind.TOLLFREE_1800


def test_recognises_1600_service_series_as_regulated_entity_number():
    parsed = normalise("1600 123 456")
    assert parsed.kind == NumberKind.SERVICE_1600


def test_landline_with_std_code_is_landline_not_mobile():
    parsed = normalise("0124-617-3838")
    assert parsed.norm == "+911246173838"
    assert parsed.kind == NumberKind.LANDLINE


def test_devanagari_digits_are_read():
    parsed = normalise("+९१ ९८७६५ ४३२१०")
    assert parsed is not None and parsed.norm == "+919876543210"


def test_rejects_pincodes_years_and_prices():
    assert normalise("400001") is None
    assert normalise("2026") is None
    assert normalise("₹ 1,00,000") is None


def test_extract_finds_every_distinct_number_in_a_snippet():
    text = (
        "Call HDFC Bank customer care 1800 1600 1600 or 1800-2600. For credit cards dial "
        "+91 98765 43210 (24x7). Pincode 400001. Do not call 9876543210 again."
    )
    found = extract(text)
    assert [p.norm for p in found] == ["180016001600", "18002600", "+919876543210"]


def test_extract_handles_none_and_empty():
    assert extract(None) == []
    assert extract("") == []


def test_display_formats_mobile_and_toll_free():
    assert display("+919876543210") == "+91 98765 43210"
    assert display("180016001600") == "1800 1600 1600"
    assert display("18002600") == "1800 2600"
    assert display("18004253800") == "1800 425 3800"


def test_display_landline_uses_trunk_zero_and_std_code():
    assert display("+911246173838") == "0124 617 3838"
    assert display("+913340401188") == "033 4040 1188"


def test_search_forms_give_compact_and_spaced_spellings():
    from helpline_watch.extract.phones import search_forms

    assert search_forms("+919830177462") == ["9830177462", "98301 77462"]
    assert search_forms("+911246173838") == ["01246173838", "0124 617 3838"]
    assert search_forms("18002600") == ["18002600", "1800 2600"]


def test_digit_distance_and_transposition():
    assert digit_distance("180016001600", "180016001610") == 1
    assert is_transposition("+919876543210", "+919876543120")
    assert is_transposition("+919876543210", "+919876543201")
    assert not is_transposition("+919876543210", "+919876543210")
    assert not is_transposition("+919876543210", "+919876543299")

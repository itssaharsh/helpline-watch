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


# --- regressions from the fresh-context review ---

def test_number_is_found_when_digits_precede_it():
    cases = {
        "Samsung Service Centre 2 098765 43210 Andheri": ["+919876543210"],
        "Samsung Care 24 7 1800 102 4455": ["18001024455"],
        "Open 9 to 6. 9876543210": ["+919876543210"],
        "Andheri, Mumbai 400069 9876543210": ["+919876543210"],
        "Rs 500 9876543210": ["+919876543210"],
        "since 2019. 9876543210": ["+919876543210"],
        "Plot 45 080 4567 8901": ["+918045678901"],
        "98765 43210 98765 43211": ["+919876543210", "+919876543211"],
    }
    for text, expected in cases.items():
        assert [p.norm for p in extract(text)] == expected, text


def test_bare_ten_digits_starting_one_to_five_are_not_numbers():
    assert extract("order id 2098765432 shipped") == []
    assert extract("invoice 4508045678") == []


def test_landline_std_codes_starting_six_to_nine_are_landlines_when_grouped():
    bengaluru = normalise("080 4567 8901")
    assert bengaluru.kind == NumberKind.LANDLINE and bengaluru.norm == "+918045678901"
    assert display(bengaluru.norm, bengaluru.kind) == "080 4567 8901"
    from helpline_watch.extract.phones import search_forms

    assert search_forms(bengaluru.norm, bengaluru.kind) == ["08045678901", "080 4567 8901"]
    mobile = normalise("098765 43210")
    assert mobile.kind == NumberKind.MOBILE
    assert normalise("+91 80 4567 8901").kind == NumberKind.LANDLINE
    assert normalise("09876543210").kind == NumberKind.MOBILE


def test_international_spellings_are_read():
    assert normalise("+91-1800-102-4455").norm == "18001024455"
    assert normalise("Toll free: +91 1800 266 2626".split(": ")[1]).norm == "18002662626"
    assert normalise("0091 98765 43210").norm == "+919876543210"
    assert normalise("+91 (0) 98765 43210").norm == "+919876543210"
    assert [p.norm for p in extract("Toll free: +91 1800 266 2626 or +91 (0) 98765 43210")] == ["18002662626", "+919876543210"]

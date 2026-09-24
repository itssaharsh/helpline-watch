"""Build the demo world: synthetic SerpApi responses for every call the planner makes.

Everything here is labelled `kind: synthetic` and is replaced the first time a real
sweep is recorded with a SerpApi key. Phone numbers below are made up for the demo.

Design of the world (two diagnostically different fakes, per the demo script):
  A  +91 74110 29385  planted Maps listings across 3 brands and 3 cities → CROSS_BRAND network
  B  one digit off each brand's official number, in PAA + a blog → LOOKALIKE (no reverse hits)
  C  +91 98301 77462  mobile inside an impersonating Search ad → AD_FROM_NON_OFFICIAL_DOMAIN
  D  +91 63528 40917  shared by SBI and Paytm → second CROSS_BRAND edge
  F  033 4040 1188    branch landline in a news story → REVIEW (never auto-flagged)
  Official numbers republished by aggregators stay OFFICIAL; an unlisted number on the
  brand's own domain becomes OFFICIAL_UNLISTED. Paytm's Kolkata Maps call has no fixture
  on purpose, to show partial coverage instead of a false "clean" verdict.
"""

from __future__ import annotations

import json
import random
import sys
from datetime import UTC, datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from helpline_watch.config import BACKEND_DIR  # noqa: E402
from helpline_watch.extract import phones  # noqa: E402
from helpline_watch.models import Brand, City  # noqa: E402
from helpline_watch.plan import build_plan, reverse_params  # noqa: E402
from helpline_watch.seeds import load_brands, load_cities  # noqa: E402
from helpline_watch.serp.client import fixture_key  # noqa: E402

FIXTURES = BACKEND_DIR / "fixtures"
A = "+91 74110 29385"
C = "+91 98301 77462"
D = "+91 63528 40917"
E = "+91 91098 22764"
F = "033 4040 1188"
SYNTHETIC_BRANDS = {"sbi", "indigo", "paytm"}  # hdfc-bank and zomato are swept live and recorded; never overwrite them
SHARED_A_BRANDS = {"sbi", "indigo", "paytm"}
SHARED_D_BRANDS = {"indigo", "paytm"}
AGGREGATORS = ["justdial.com", "customercare-numbers.in", "helpline-directory.org", "tollfreenumber.in"]
SCAM_DOMAINS = {"hdfc-bank": "hdfc-care-support.in", "sbi": "sbi-helpdesk-online.co", "zomato": "zomato-support-care.in",
                "indigo": "indigo-flightcare.in", "paytm": "paytm-kyc-help.co"}
NEWS = ["timesofindia.indiatimes.com", "hindustantimes.com", "deccanherald.com"]
RNG = random.Random(20260923)


def lookalike(official: str) -> str:
    """Change the last digit of an official number."""
    parsed = phones.normalise(official)
    digits = parsed.norm if parsed else official
    last = digits[-1]
    swapped = str((int(last) + 1) % 10)
    return phones.display(digits[:-1] + swapped)


def meta(engine: str, params: dict, key: str) -> dict:
    now = datetime.now(UTC).strftime("%Y-%m-%d %H:%M:%S UTC")
    return {"search_metadata": {"id": f"synthetic-{key}", "status": "Success", "created_at": now, "processed_at": now,
                                "json_endpoint": None, "raw_html_file": None, "total_time_taken": round(RNG.uniform(0.9, 2.4), 2)},
            "search_parameters": params}


def organic(title: str, link: str, snippet: str, pos: int) -> dict:
    domain = link.split("/")[2]
    return {"position": pos, "title": title, "link": link, "displayed_link": f"https://{domain} › " + " › ".join(link.split("/")[3:5]), "snippet": snippet}


def ad(title: str, domain: str, description: str) -> dict:
    return {"position": 1, "block_position": "top", "title": title, "link": f"https://{domain}/", "displayed_link": f"https://{domain} › care", "description": description}


def place(title: str, phone: str | None, reviews: int, rating: float, ptype: str, place_id: str, address: str, unclaimed: bool = False, website: str | None = None) -> dict:
    p = {"position": 1, "title": title, "place_id": place_id, "data_id": f"0x{RNG.getrandbits(48):x}:0x{RNG.getrandbits(48):x}", "rating": rating, "reviews": reviews,
         "type": ptype, "types": [ptype], "address": address, "gps_coordinates": {"latitude": RNG.uniform(12, 28), "longitude": RNG.uniform(72, 88)}}
    if phone:
        p["phone"] = phone
    if website:
        p["website"] = website
    if unclaimed:
        p["unclaimed_listing"] = True
    return p


def write(engine: str, params: dict, response: dict, note: str) -> None:
    key = fixture_key(params)
    path = FIXTURES / engine / f"{key}.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists() and json.loads(path.read_text(encoding="utf-8")).get("_fixture", {}).get("kind") == "recorded":
        return  # a real recording always wins over the synthetic world
    body = {**meta(engine, params, key), **response}
    wrapper = {"_fixture": {"kind": "synthetic", "note": note, "generated_at": datetime.now(UTC).isoformat(timespec="seconds"), "params": params}, "response": body}
    path.write_text(json.dumps(wrapper, ensure_ascii=False, indent=1), encoding="utf-8")


def official_display(brand: Brand) -> str | None:
    return brand.official_numbers[0] if brand.official_numbers else None


def search_response(brand: Brand, city: City, q: str, hindi: bool) -> dict:
    name, off = brand.name, official_display(brand)
    domain = brand.official_domains[0] if brand.official_domains else f"{brand.id}.example"
    scam_domain = SCAM_DOMAINS[brand.id]
    look = lookalike(off) if off else None
    org: list[dict] = []
    pos = 1
    if off:
        org.append(organic(f"Contact us - {name}", f"https://www.{domain}/contact-us", f"Call our 24x7 toll-free customer care at {off}. Never share your OTP or card PIN with anyone.", pos))
        pos += 1
        org.append(organic(f"{name} customer care number {off} toll free", f"https://www.{RNG.choice(AGGREGATORS)}/{brand.id}-customer-care", f"{name} customer care number is {off}. Also try the grievance desk on the official website.", pos))
        pos += 1
    if brand.id == "sbi" and city.id in {"mumbai", "delhi"}:
        org.append(organic("Grievance redressal - SBI", "https://sbi.co.in/web/customer-care/grievance-redressal", "Nodal officer: write to us or call 022 2274 0841 between 9 AM and 6 PM.", pos))
        pos += 1
    if brand.id == "zomato":
        org.append(organic("Help & support - Zomato", "https://www.zomato.com/contact", "Chat with us in the app for order issues. We do not offer phone support.", pos))
        pos += 1
    if look and city.id in {"bengaluru", "hyderabad", "mumbai"}:
        org.append(organic(f"{name} helpline number 24x7 - {name} care", f"https://www.{RNG.choice(AGGREGATORS)}/{brand.id}-helpline-24x7", f"Updated {name} helpline number: {look}. Lines open 24 hours for card block, refund and KYC.", pos))
        pos += 1
    if brand.id in SHARED_A_BRANDS and (hindi or city.id in {"kolkata", "delhi"}):
        text = f"{name} कस्टमर केयर नंबर {A} पर कॉल करें, 24 घंटे सेवा" if hindi else f"Call {name} customer care {A} for instant refund and complaint. Available 24x7."
        org.append(organic(f"{name} customer care number - {A}", f"https://{scam_domain}/customer-care", text, pos))
        pos += 1
    if brand.id in SHARED_D_BRANDS and city.id in {"mumbai", "hyderabad"}:
        org.append(organic(f"{name} toll free helpline {D}", f"https://{scam_domain}/helpline", f"{name} customer care number {D}. Call now for KYC update and refund.", pos))
        pos += 1
    if brand.id == "sbi" and city.id == "kolkata":
        org.append(organic("SBI opens new branch in Salt Lake", f"https://www.{NEWS[0]}/city/kolkata/sbi-salt-lake", f"The branch can be reached on {F} for account services, the bank said.", pos))
        pos += 1
    if city.id in {"delhi", "mumbai"}:
        org.append(organic(f"Man loses Rs 90,000 after calling fake {name} customer care number", f"https://www.{RNG.choice(NEWS)}/city/{city.id}/fake-{brand.id}-helpline", f"The victim searched for {name} customer care on Google and dialled a number listed on a business listing. Police said the number was a scam.", pos))
        pos += 1
    org.append(organic(f"{name} - Wikipedia", f"https://en.wikipedia.org/wiki/{name.replace(' ', '_')}", f"{name} is an Indian company headquartered in India.", pos))

    resp: dict = {"organic_results": org}
    if off:
        resp["knowledge_graph"] = {"title": name, "type": "Company", "phone": off, "website": f"https://www.{domain}/", "description": f"{name} customer service"}
    if brand.id in {"sbi", "paytm"} and city.id in {"hyderabad", "delhi"} and not hindi:
        num = C if brand.id == "sbi" else E
        resp["ads"] = [ad(f"{name} Customer Care 24x7 - Call Now", scam_domain, f"Instant support for card block, refund & KYC. Call {num} now. Toll free assistance.")]
    if brand.id in SHARED_A_BRANDS and city.id in {"mumbai", "delhi", "kolkata"} and not hindi:
        resp["local_results"] = {"places": [place(f"{name} Customer Care Number", A, 3, 4.8, "Customer service", f"synthetic-{brand.id}-{city.id}-care", f"{city.name}")]}
    paa = []
    if off:
        paa.append({"question": f"What is the {name} customer care number?", "snippet": f"The official {name} customer care number is {off}.", "title": f"Contact us - {name}", "link": f"https://www.{domain}/contact-us"})
    if look and city.id in {"bengaluru", "hyderabad"}:
        paa.append({"question": f"Is {look} a {name} number?", "snippet": f"Some sites list {look} as the {name} helpline. Call it for refunds.", "title": f"{name} helpline FAQ", "link": f"https://www.{AGGREGATORS[2]}/{brand.id}-faq"})
    if paa:
        resp["related_questions"] = paa
    return resp


def maps_response(brand: Brand, city: City) -> dict:
    name, off = brand.name, official_display(brand)
    domain = brand.official_domains[0] if brand.official_domains else None
    look = lookalike(off) if off else None
    places = []
    if off and brand.category in {"bank", "fintech", "airline"}:
        places.append(place(f"{name} - {city.name} Main Branch", off, RNG.randint(80, 900), round(RNG.uniform(3.4, 4.3), 1), "Bank" if brand.category != "airline" else "Airline ticket agency", f"synthetic-{brand.id}-{city.id}-branch", f"MG Road, {city.name}", website=f"https://www.{domain}/" if domain else None))
    if brand.id in SHARED_A_BRANDS and city.id in {"mumbai", "delhi", "kolkata"}:
        places.append(place(f"{name} Customer Care Number", A, RNG.randint(0, 3), 5.0, "Customer service", f"synthetic-{brand.id}-{city.id}-care", f"Sector 12, {city.name}", unclaimed=True))
    if brand.id in SHARED_D_BRANDS and city.id in {"mumbai", "hyderabad", "bengaluru"}:
        places.append(place(f"{name} Helpline 24x7", D, RNG.randint(0, 4), 4.9, "Financial consultant", f"synthetic-{brand.id}-{city.id}-help", f"Near Metro Station, {city.name}", unclaimed=True))
    if look and city.id == "bengaluru":
        places.append(place(f"{name} Toll Free Number", look, 1, 5.0, "Customer service", f"synthetic-{brand.id}-{city.id}-look", f"Whitefield, {city.name}", unclaimed=True))
    if brand.id == "zomato":
        places.append(place("Zomato Hyperpure Warehouse", None, 42, 4.1, "Warehouse", f"synthetic-zomato-{city.id}-hp", f"Industrial Area, {city.name}", website="https://www.zomato.com/hyperpure"))
    if brand.id == "indigo":
        places.append(place(f"IndiGo Airport Counter {city.name}", "0124 617 3838", RNG.randint(100, 600), 4.0, "Airline", f"synthetic-indigo-{city.id}-ctr", f"Airport, {city.name}", website="https://www.goindigo.in/"))
    return {"local_results": places}


def ads_transparency_response(brand: Brand) -> dict:
    now = int(datetime.now(UTC).timestamp())
    creatives = [{"advertiser_id": f"AR-{brand.id}-official", "advertiser": f"{brand.name} Limited", "ad_creative_id": f"CR-{brand.id}-{i}", "format": "text", "first_shown": now - 86400 * 200, "last_shown": now - 3600, "details_link": "https://adstransparency.google.com/"} for i in range(3)]
    if brand.id in {"paytm", "sbi"}:
        creatives += [{"advertiser_id": f"AR-{brand.id}-third", "advertiser": "Quick Assist Consultancy Services", "ad_creative_id": f"CR-third-{brand.id}-{i}", "format": "text", "first_shown": now - 86400 * (9 - i), "last_shown": now - 7200, "details_link": "https://adstransparency.google.com/"} for i in range(2)]
    return {"ad_creatives": creatives}


def autocomplete_response(brand: Brand) -> dict:
    values = [f"{brand.name} customer care number", f"{brand.name} customer care number toll free", f"{brand.name} helpline number 24x7", f"{brand.name} complaint number", f"{brand.name} customer care email"]
    return {"suggestions": [{"value": v, "relevance": 1200 - 100 * i, "type": "QUERY"} for i, v in enumerate(values)]}


def reverse_response(number: str, brand_names: list[str], scam: bool) -> dict:
    org = []
    if scam:
        org.append(organic(f"Beware: {number} is a fake {brand_names[0]} customer care number", f"https://www.consumercomplaints.in/{number.replace(' ', '')}", f"I called {number} thinking it was {brand_names[0]} support and lost Rs 48,000. It is a scam, do not call.", 1))
        org.append(organic(f"{number} - Spam risk", f"https://www.truecaller.com/search/in/{number.replace(' ', '')}", "Reported as fraud by 214 users. Tagged 'fake customer care'.", 2))
    for i, b in enumerate(brand_names, start=3):
        org.append(organic(f"{b} customer care number {number}", f"https://{SCAM_DOMAINS.get(b.lower().replace(' ', '-'), 'helpline-directory.org')}/{b.lower().replace(' ', '-')}", f"{b} customer care {number}, call 24x7.", i))
    if not org:
        org.append(organic("No results", "https://example.org/none", "", 1))
    return {"organic_results": org}


def main() -> None:
    brands = [b for b in load_brands(BACKEND_DIR / "seeds") if b.id in SYNTHETIC_BRANDS]
    cities = [c for c in load_cities(BACKEND_DIR / "seeds") if c.default]
    written = 0
    for brand in brands:
        auto = autocomplete_response(brand)
        plan0 = build_plan(brand, cities, [], 60)
        write("google_autocomplete", plan0.autocomplete.params, auto, f"autocomplete for {brand.name}")
        plan = build_plan(brand, cities, [s["value"] for s in auto["suggestions"]], 60)
        by_city = {c.id: c for c in cities}
        for call in plan.calls:
            if brand.id == "paytm" and call.id == "maps:kolkata":
                continue  # deliberate gap → partial coverage in the demo
            if call.engine == "google":
                city = by_city[call.city_id]
                resp = search_response(brand, city, call.params["q"], hindi=call.params.get("hl") == "hi")
            elif call.engine == "google_maps":
                resp = maps_response(brand, by_city[call.city_id])
            else:
                resp = ads_transparency_response(brand)
            write(call.engine, call.params, resp, f"{call.label}")
            written += 1
    # reverse lookups for every planted number
    look_numbers = {lookalike(b.official_numbers[0]): [b.name] for b in brands if b.official_numbers}
    planted = {A: (["SBI", "IndiGo", "Paytm"], True), C: (["SBI"], True), D: (["IndiGo", "Paytm"], True), E: (["Paytm"], False), F: (["SBI"], False)}
    for num, (names, scam) in planted.items():
        parsed = phones.normalise(num)
        write("google", reverse_params(parsed.norm, parsed.kind), reverse_response(num, names, scam), f"reverse lookup {num}")
        written += 1
    for num in look_numbers:
        parsed = phones.normalise(num)
        write("google", reverse_params(parsed.norm, parsed.kind), reverse_response(num, [], False), f"reverse lookup {num}")
        written += 1
    print(f"wrote {written + len(brands)} synthetic fixtures into {FIXTURES}")


if __name__ == "__main__":
    main()

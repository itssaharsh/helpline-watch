# Demo video — shot list (target 2:45, under the 3:00 limit)

Record at 1440×900, browser zoom 110%, light mode, `make demo` already running, HDFC Bank selected, `make seed` done so the network has five brands. Narration optional; captions recommended. Speed up any waiting.

| time | on screen | say / caption |
|---|---|---|
| 0:00–0:10 | Title card over the populated workbench, Pages tab on Mumbai | "1.73 lakh complaints and over ₹2,100 crore lost in India to fake customer-care numbers found on Google. Scammers plant them where victims search. This is the page a victim in Mumbai sees, marked up." |
| 0:10–0:35 | Click **Sweep again**. The progress line moves, findings appear on the left, pages return city by city and `+91 74110 29385` flashes with a FAKE mark in the Places box | "One brand, five cities, every surface: search results, the answer box, People also ask, the local pack, Maps, ads. Every number a victim would be shown, compared with the bank's official list, marked in place." |
| 0:35–1:00 | Click the marked number. The Evidence tab: seven weighted reasons, the exact results it appeared in (the Hindi page, the listing with 3 reviews), the keep-in-pack switch | "Every circle explains itself: a mobile number posing as a bank helpline, on a listing named like no bank names its branches, planted in three cities, already confirmed fake for two other brands." |
| 1:00–1:25 | Across brands tab: hover the shared number: HDFC Bank, Zomato, IndiGo; below it, who is advertising on the brand name | "The same number is posing as three brands at once. That is one operation, not three coincidences." |
| 1:25–1:50 | Pages tab, Kolkata: the green tick on the aggregator's `1800 1600 1600`, the Unlisted badge on `022 6160 6161` from hdfcbank.com, the amber Check on `033 4040 1188` from a newspaper | "It does not cry wolf. The official number on a third-party site gets a tick; a number on the bank's own site is flagged for the list; an unknown landline in a news story is highlighted to check, never filed." |
| 1:50–2:15 | Click **Download takedown pack (3)** in the findings pane; open `report.md` and `complaint_template.txt` | "The output is a takedown pack: CSV, evidence JSON, a report with a replayable SerpApi archive link per sighting and the right Google form per surface, and a cybercrime.gov.in complaint template." |
| 2:15–2:35 | Terminal: `make verify` scrolls PASS lines | "Eleven assertions run against recorded fixtures with no key: the before-and-after a judge just watched." |
| 2:35–2:45 | The summary line: 22 searches, none live, Replay badge. Terminal: `make record` | "Twenty-two SerpApi searches per sweep, all cached here. Add a key and one command replaces every synthetic fixture with live Google results." |

Before recording: `make clean && make seed`, reload, incognito check of the repo and video links, and re-run `make verify`.

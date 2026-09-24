# Demo video — shot list (target 2:45, under the 3:00 limit)

Record at 1440×900, browser zoom 110%, `make demo` already running, HDFC Bank selected, `make seed` done so the network has five brands. Narration optional; captions recommended. Speed up any waiting.

| time | on screen | say / caption |
|---|---|---|
| 0:00–0:10 | Title card over the Mumbai sheet, already marked | "1.73 lakh complaints and over ₹2,100 crore lost in India to fake customer-care numbers found on Google. Scammers plant them where victims search. This is the page a victim in Mumbai sees, marked up." |
| 0:10–0:35 | Click **Sweep again**. City tabs breathe, pages return, a red circle draws itself around `+91 74110 29385` in the Places box; the Delhi and Kolkata tabs get red counts | "One brand, five cities, every surface: search results, the answer box, People also ask, the local pack, Maps, ads. Every number a victim would be shown, compared with the bank's official list, marked in place." |
| 0:35–1:00 | Click the circled number. The evidence slip: seven reasons with pen weights, the listing with 3 reviews and unclaimed, the Hindi page, the query | "Every circle explains itself: a mobile number posing as a bank helpline, on a listing named like no bank names its branches, planted in three cities, already confirmed fake for two other brands." |
| 1:00–1:25 | Close. In the case file, hover the number in the cross-brand graph: HDFC Bank, Zomato, IndiGo | "The same number is posing as three brands at once. That is one operation, not three coincidences." |
| 1:25–1:50 | Click the Kolkata tab, then point at the green tick on the aggregator's `1800 1600 1600`, the dashed green `022 6160 6161` on hdfcbank.com, the highlighted `033 4040 1188` from a newspaper | "It does not cry wolf. The official number on a third-party site gets a tick; a number on the bank's own site is flagged for the list; an unknown landline in a news story is highlighted to check, never filed." |
| 1:50–2:15 | The stamp. Click **Download takedown pack (3)**; open `report.md` and `complaint_template.txt` | "The output is a takedown pack: CSV, evidence JSON, a report with a replayable SerpApi archive link per sighting and the right Google form per surface, and a cybercrime.gov.in complaint template." |
| 2:15–2:35 | Terminal: `make verify` scrolls PASS lines | "Eleven assertions run against recorded fixtures with no key: the before-and-after a judge just watched." |
| 2:35–2:45 | Case file sentence: 22 searches, none live. Terminal: `make record` | "Twenty-two SerpApi searches per sweep, all cached here. Add a key and one command replaces every synthetic fixture with live Google results." |

Before recording: `make clean && make seed`, reload, incognito check of the repo and video links, and re-run `make verify`.

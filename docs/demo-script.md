# Demo video — shot list (target 2:45, under the 3:00 limit)

Record at 1440×900, browser zoom 110%, `make demo` already running, HDFC Bank selected, `make seed` done so the network has five brands. Narration optional; captions recommended. Speed up any waiting.

| time | on screen | say / caption |
|---|---|---|
| 0:00–0:10 | Title card over the populated console | "1.73 lakh complaints and over ₹2,100 crore lost in India to fake customer-care numbers found on Google. Scammers plant them where victims search. Helpline Watch sweeps those places first." |
| 0:10–0:35 | Click **Sweep again**. Grid fills Mumbai → Kolkata; skeletons become chips; the first red chip pulses in Maps & local pack | "One brand, five cities, four surfaces: Search, People-also-ask, Maps, Ads. Every number a victim would be shown, compared with the bank's official list." |
| 0:35–1:00 | Click the red `+91 74110 29385` chip. Drawer: six named signals, the Maps listing “HDFC Bank Customer Care Number”, 3 reviews, unclaimed | "Every red chip explains itself: a mobile number posing as a bank helpline, on a listing named like no bank names its branches, planted in three cities." |
| 1:00–1:25 | Top nav → **Scam Network**. Hover the shared number; edges to HDFC Bank, Zomato, IndiGo light up | "The same number is posing as three brands at once. That is one operation, not three coincidences." |
| 1:25–1:50 | Back to console. Point at green `1800 1600 1600` republished by an aggregator, dashed-green `022 6160 6161` on hdfcbank.com, yellow `033 4040 1188` from a newspaper | "It does not cry wolf. The official number on a third-party site stays green; a number on the bank's own site is flagged for the list; an unknown landline in a news story goes to review, never to the pack." |
| 1:50–2:15 | Click **Download takedown pack (3)**; open `report.md` and `complaint_template.txt` | "The output is a takedown pack: CSV, evidence JSON, a report with a replayable SerpApi archive link per sighting, and a cybercrime.gov.in complaint template." |
| 2:15–2:35 | Terminal: `make verify` scrolls PASS lines | "Eleven assertions run against recorded fixtures with no key: the before-and-after a judge just watched." |
| 2:35–2:45 | Top bar: Replay badge, `22` calls, `0 live`. Terminal: `make record` | "Twenty-two SerpApi searches per sweep, all cached here. Add a key and one command replaces every synthetic fixture with live Google results." |

Before recording: `make clean && make seed`, reload, incognito check of the repo and video links, and re-run `make verify`.

# Submission form answers (SerpApi India Hackathon 2026)

**Project name:** Helpline Watch

**Track:** Knowledge & Public Interest

**Public GitHub repository:** https://github.com/itssaharsh/helpline-watch

**Demo video:** (unlisted YouTube link to demo/build/final.mp4)

**Project description**

Helpline Watch finds the fake customer-care numbers that scammers plant on Google before a brand's customers call them. Indians who need their bank, food-delivery app or airline google "brand customer care number" and dial the first number they see; by March 2026 India had logged 1.73 lakh complaints and over ₹2,100 crore lost this way. The numbers are planted per city, in Maps listings, aggregator pages, ads and even listings on the brand's own site, so a fraud analyst googling from one desk never sees what a victim in Patna is shown.

Helpline Watch is for bank and brand fraud teams. It sweeps Google Search, Maps, People-also-ask, the local pack, ads and the Ads Transparency Center from every Indian city the analyst chooses, in English and Hindi; extracts and normalises every phone number; scores each one with named, deterministic signals (no language model in the verdict); links the same number across brands; reverse-checks suspects by searching the number itself; and builds a takedown pack: CSV, evidence with a replayable SerpApi link per sighting, the right Google report form per surface and a cybercrime.gov.in complaint template. A person keeps or removes every number before anything is filed.

Live results on 24 Sep 2026: Zomato, which publishes no phone helpline, had eight fake numbers ranking for "customer care", five of them personal mobiles inside restaurant listings on zomato.com itself. HDFC Bank's real numbers stayed green wherever aggregators republished them, while an unclaimed branch listing carrying a personal mobile was flagged. The repo replays those recorded searches without an API key, and one command runs the whole proof.

**How the project uses SerpApi**

Every fact in the product comes from SerpApi; nothing is scraped.

- Google Search API with the `location` parameter, `google_domain=google.co.in`, `gl=in` and `hl=en`/`hl=hi`: the results page a victim in each city actually sees, in English and Hindi. From one response we parse organic results, the answer box, knowledge graph, People-also-ask, the local pack and ads, because a planted number can sit in any of them.
- Google Maps API with `ll` per city: the listings that carry most planted numbers, using `phone`, `reviews`, `unclaimed_listing`, `place_id` and `type` as classifier signals (an unclaimed "HDFC Bank" listing with a personal mobile is a different thing from a claimed branch with a toll-free number).
- Google Ads Transparency Center API (`text`, `region=2356`): who is buying ads on the brand name in India, separated into the brand and third parties.
- Google Autocomplete API: the query variants victims actually type, which plan the sweep instead of guessing.
- Reverse lookups: the suspect number itself as the Google Search query, to find complaint pages, other brands it poses as, or the brand's own site vouching for it.
- `search_metadata.id` and the Search Archive: every sighting in the evidence and in the takedown pack carries a replayable SerpApi link, so a takedown request is verifiable by anyone.
- The full JSON per call is stored as a snapshot and redrawn in the UI as the page the victim saw, in Google's order, with verdicts marked on the numbers.

The location parameter is the whole point: without per-city SERPs the fraud team cannot see the scam, and replacing it would need a residential proxy network and scrapers that break weekly. One sweep of a brand across five cities is 23 searches plus up to 10 reverse lookups; responses are recorded and replayed for free, and a per-sweep cap keeps the free plan safe.

**AI tools used**

Claude Code (Anthropic) was used throughout development: idea research, backend and frontend code, tests, synthetic fixtures, documentation, and the narrated demo video (recorded from the running app with a local text-to-speech model). The author reviewed, ran and tested every change. No AI model runs inside the product; verdicts are deterministic rules. Details in AGENTS.md.

**Additional team members:** none

**This project existed before the hackathon:** no (started 23 Sep 2026 for this hackathon)

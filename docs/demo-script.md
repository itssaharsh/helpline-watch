# Demo video script

Target 150 s, cap 180 s. Recorded from the running app on a lockstep virtual clock and narrated with a local text-to-speech model (Kokoro, voice af_heart).

| # | Scene | On screen | Narration |
|---|---|---|---|
| 1 | hook | clip of the aha moment under “Fake helplines, found before the call.” | Scammers plant fake bank helplines on Google, and people call them. Helpline Watch finds them first. |
| 2 | problem | card: ₹2,100 crore | By March 2026, India had logged one point seven three lakh complaints, and twenty-one hundred crore rupees lost, to fake customer-care numbers found on Google. The fraud team googles from one desk. The victim in Patna sees a different page. |
| 3 | landing | camera .globe-hero; click text=Watch a sweep | Helpline Watch searches Google the way victims do, from every Indian city you choose, then marks every number that isn't the brand's. Let's sweep Zomato, which publishes no phone number at all. |
| 4 | sweep | camera .hero; camera .hero > div:nth-child(2); scroll text=After Hours, Delhi NCR; camera button.mark-fake:has-text('9330879344') | Twenty-eight searches from five cities: results, the answer box, People also ask, the local pack, Maps, and ads, each made through SerpApi's location parameter. Eight fakes, from Google as it is today. And here's the surprise: five of them sit on zomato.com itself. Restaurant listings named to rank for customer care, each carrying a personal mobile. |
| 5 | evidence | click button.mark-fake:has-text('9330879344'); camera .pane .glass; scroll text=Where it appeared; camera text=Replay on SerpApi | Every verdict explains itself. Named signals: not one of Zomato's numbers, a personal mobile presented as customer care, and a page on Zomato's own domain that is not about Zomato. No language model anywhere. And every sighting keeps its SerpApi link, so anyone can replay the search. |
| 6 | network | click button:has-text('Across brands'); camera svg[role='img']; camera svg[role='img'] | Across brands, the graph joins every number seen for more than one brand. On the three seeded demo brands, one mobile is sold as three helplines at once. That's one operation, not three coincidences. |
| 7 | unhappy | click .brand-select; click [role='option']:has-text('HDFC Bank'); click button:has-text('Pages'); camera .sheet; scroll text=bankbazaar.com; click button.pill:has-text('Delhi'); click button.pill:has-text('Google Maps'); scroll text=Sarojini | It doesn't cry wolf. Switch to HDFC Bank: the real eighteen-hundred sixteen-hundred gets a green tick wherever an aggregator republishes it, and numbers on the bank's own site go to the list, not to takedown. Only an unclaimed branch listing with a personal mobile is flagged. |
| 8 | pack | scroll top; camera .hero > div:nth-child(2); click a:has-text('Download takedown pack') | The output is a takedown pack: a CSV, evidence with a SerpApi replay link for every sighting, the right Google form per surface, and a complaint template for the cybercrime portal. A person keeps or removes every number first. |
| 9 | tech | card: Built on SerpApi, decided by rules → Autocomplete → Search, Maps, Ads → Named signals → Takedown pack | Under the hood, SerpApi's Autocomplete plans the queries victims type. Search, Maps and the Ads Transparency Center return each city's page. Deterministic signals score every number. And the pack is built only from what the analyst keeps. |
| 10 | end | clip of the aha moment under “Helpline Watch” | Helpline Watch. Runs locally from recorded searches with no key, and live with one. Built with SerpApi. |

## Notes for a live retake

- Everything shown for Zomato and HDFC Bank is a recorded SerpApi response from 24 Sep 2026 (the UI badge says so); SBI, IndiGo and Paytm are the labelled synthetic brands that carry the cross-brand graph.
- `?demo=1` starts a sweep on load; `?brand=<id>` picks the brand; `?state=empty|error` shows those states.
- The globe and the 3D graph need WebGL; without it the app shows a still globe and a 2D graph, which is what the recorder captured.

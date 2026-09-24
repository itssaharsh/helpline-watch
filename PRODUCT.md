# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Fraud and brand-protection analysts at Indian banks, fintechs, airlines and consumer apps. They work at a desk, usually on a wide monitor, checking several brands a week. Their job: find the fake customer-care numbers scammers plant on Google before customers call them, and file takedowns with evidence. Secondary audience during the SerpApi India Hackathon 2026: four SerpApi developer advocates judging from a three-minute local-run video and the repository.

## Product Purpose
Helpline Watch sweeps Google Search, Maps, People-also-ask and ads for a brand across Indian cities through SerpApi, extracts every phone number a victim would be shown, compares each against the brand's official list, scores it with named deterministic signals, and hands the analyst a takedown pack (CSV, evidence with replay links, report, complaint template). Success: an analyst can go from "which brand" to a filed pack in minutes instead of hours, and never files a legitimate number by mistake.

## Positioning
Sees the search results as a victim in each city sees them (SerpApi `location`), across every surface at once, and corroborates the same number across brands. Verdicts are deterministic and explainable; nothing is filed automatically.

## Capabilities
Sweep a brand across chosen cities; stream results as pages return; classify numbers (fake, check, official, official-unlisted); reverse-look-up suspects; diff against the previous sweep; show advertisers bidding on the brand name; cross-brand network; keep/remove numbers in the pack; mark a number official; download the pack. Runs fully offline from recorded or synthetic fixtures; live with a SerpApi key.

## Constraints
Runs locally with Python and uv only (Node only to change the UI). Free SerpApi plan is 250 searches a month, so credits are visible and capped. Red must mean one thing: a confirmed fake. A person gates every takedown. Judged criteria: idea strength, originality, technical complexity, usefulness, meaningful SerpApi usage.

## Terminology
Sweep (one run for one brand), page (one SerpApi call rendered as what the victim saw), finding (one distinct number with a verdict), pack (the takedown ZIP), official list (the brand's known numbers), fixture (a recorded or synthetic SerpApi response).

## Accessibility
Keyboard-operable end to end; visible focus; WCAG AA contrast; reduced motion respected; Devanagari text must render.

## Open decisions
Dark mode: inferred as wanted (analysts work long hours), not confirmed by the user. Visual direction is delegated to the design work.

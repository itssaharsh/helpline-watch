---
name: Helpline Watch
description: Night console. A deep blue-black canvas lit from the top left with fine grain, glass panels, white type, one ice accent, and verdict colours kept small.
colors:
  canvas: "#06090F"
  glow-top-left: "rgba(120,190,255,.22)"
  glow-top-right: "rgba(96,128,255,.12)"
  glow-floor: "rgba(255,166,96,.09)"
  glass: "rgba(255,255,255,.03) with a 1 px rgba(255,255,255,.08) border"
  ink: "#F4F7FA"
  ink-muted: "#9BA7B4"
  ink-faint: "#6F7C8A"
  accent: "#9AD5F5"
  fake: "#F58A8A"
  check: "#F2C46B"
  official: "#6FD3A6"
typography:
  fontFamily:
    sans: "Host Grotesk"
    devanagari: "Noto Sans Devanagari"
  scale: "landing h1 clamp(38, 5vw, 60) at −0.035em; h2 30; console numeral 56; body 14 to 18"
  fontWeight: { regular: 400, medium: 500, semibold: 600, bold: 700 }
  numerals: "tabular everywhere"
rounded: "buttons 10 px, panels 14 px, landing globe card 24 px, pills full"
spacing: "4 px base; page gutters 24; panels padded 16 to 24"
components:
  button-white: ".btn-white white fill, ink text; the only filled button"
  button-ghost: ".btn-ghost 4% fill, 12% border"
  pill: ".pill neutral outline, white when selected"
  badge: ".badge-fake / -review / -official / -official_unlisted, 20 px, tinted 14 to 16%"
  glass: ".glass panel with blur 14 and a top highlight"
  sheet: ".sheet white result page inside the console"
---

## Overview
One accent, one filled button, a background that does the atmosphere. The brief asked for a clean, good-looking interface with a real landing page and a proper background: the colour now lives in the lighting, not in the components. Verdict colours exist because the product needs them, but they are muted and small: a badge, a dot, an underline on the page.

## Colors
Canvas is blue-black. The background is three radial glows (cool at the top left and top right, faintly warm at the floor) over a vertical gradient, with SVG grain at 7% and a soft vignette; it is fixed behind everything and never repeats on panels. Glass panels are 3% white with an 8% border, blur, and a 1 px highlight on top. The accent, ice blue, is used for focus, selection rules, globe markers and the progress line only. Fake, check and official are desaturated red, amber and green at low opacity behind text.

## Typography
Host Grotesk alone, with tabular figures on every number. The landing h1 is the only large display moment. The console numeral (fakes found) is 56 px at −0.04 em. Everything else is 13 to 18 px with muted and faint tiers for hierarchy.

## Layout
Landing: 1180 px column, 64 px nav, split hero (copy left, globe card right), then sections separated by hairlines: the rendered page a victim sees, how a sweep works (a real four-step sequence), the signals, proof, built on SerpApi, footer. Console at /app: 64 px app bar, 2 px progress line, hero band (globe card, summary card 400 px), then a 400 px sticky findings pane and the tabbed detail pane. Below 1024 everything stacks.

## Elevation & Depth
Depth comes from the lit background and glass; only the white result sheet casts a shadow. No neon, no coloured halos.

## Shapes
Buttons 10 px, panels 14 px, the landing globe 24 px, pills full.

## Components
Landing nav, hero, stats, live page preview, steps, signals grid, proof block, SerpApi table, footer. Console app bar, hero globe and summary, findings pane with filter pills and rows, tabs, pages with city and page pills and the white sheet, evidence with weighted reasons and sighting sheets, 3D cross-brand graph (white brands, red fakes, amber checks), log, error and empty panels.

## Do's and Don'ts
- Do let the background carry the mood; keep panels near-transparent.
- Do keep colour to verdicts and the single accent.
- Don't fill buttons other than the primary; don't add gradients to text or panels.
- Don't put 3D anywhere it does not encode data.

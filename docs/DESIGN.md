---
name: Helpline Watch
description: Signal Lime, mutated. A deep navy console where every function owns a hue, lime is a surface, and the only glows sit behind two 3D objects that carry real data, the India globe and the cross-brand network.
colors:
  canvas: "#0C1018"
  surface-1: "#111725"
  surface-2: "#131926"
  line: "rgba(255,255,255,.08)"
  ink: "#F1F2EE"
  ink-muted: "#A2A69E"
  lime: "#CCFF00"
  lime-ink: "#121400"
  fake: "#FF6166"
  check: "#FFB020"
  official: "#36C58C"
  city: "#4CC9F0"
  network: "#B48CFF"
typography:
  fontFamily:
    display: "Unbounded"
    body: "Hanken Grotesk"
    mono: "Martian Mono"
    devanagari: "Noto Sans Devanagari"
  scale: "display 84 / 34 / 30 / 20, body 15 / 14 / 13 / 12"
  fontWeight: { regular: 400, semibold: 600, bold: 700 }
  numerals: "Martian Mono, tabular, for every phone number and count"
rounded: "controls 8 px, pills full, panels and sheets 12 px"
spacing: "4 px base; panels padded 16, sheets 24 to 28"
components:
  sweep-button: "Radix Button color lime size 3, bold, loading state while sweeping"
  cities-button: "Radix Button variant soft color cyan"
  network-tab: "violet dot"
  badges: ".badge-fake coral solid, .badge-review amber solid, .badge-official mint outline, .badge-official_unlisted mint dashed"
  pills: ".pill cyan when selected, red count chip"
  slab: ".slab lime surface with dot grid, Unbounded 84 numeral, black-on-lime pack button"
  sheet: ".sheet white result page inside the dark console"
---

## Overview
The brief pins it: bold colour, one hue per function, and 3D that carries data. Direction is Signal Lime from the library with three mutations: navy canvas instead of graphite, lime used as a surface (the results slab and the Sweep button), and a cool cyan for everything geographic so the globe, the city picker and the page pills read as one family. Dials: variance 5, motion 5, density 6.

## Colors
Canvas is deep navy, never black. Surfaces step up with alpha borders, not shadows. Lime means action: Sweep, the results slab, focus rings, selection. Coral means fake, amber means check, mint means official; those three appear on badges, on the numbers themselves and on the marks inside rendered pages. Cyan is geography: the globe markers, the cities button, the city and page pills. Violet is the cross-brand network. Gray is the log. A tab's dot carries its hue. Glows exist only behind the two 3D objects.

## Typography
Unbounded for the wordmark, the brand title, the slab numeral and section titles. Hanken Grotesk for everything readable. Martian Mono for every phone number and count, so numbers scan as data. Noto Sans Devanagari falls in for Hindi results. Inside the white result sheet the page keeps its own vernacular: link blue titles, gray URLs, 14 px snippets.

## Layout
Shell: 60 px app bar, 3 px progress line, hero band (globe on the left with the brand title and city legend over a scrim, lime results slab 440 px on the right), then the workspace: 420 px findings pane and the tabbed detail pane (Evidence, Pages, Across brands, Log). Below 1024 the hero stacks, the findings pane caps at 52 dvh, and pills wrap.

## Elevation & Depth
Panels sit on 1 px alpha lines. The white result sheet floats with one deep tinted shadow. The globe and the network each get one radial glow in their hue. Nothing else glows.

## Shapes
Controls 8 px, pills full, panels and sheets 12 px, the slab square-edged because it is a surface, not a card.

## Components
App bar; hero with cobe globe (India-centred, cyan markers sized by fake count, pulsing while a city's pages return) and the results slab; findings rows with hue-coloured numbers and badges; filter pills; city and page pills; the white result sheet with inline marks; evidence panel with a hue-tinted header, weighted reasons, sighting sheets, reverse lookup; 3D force graph (violet brands, coral fakes, amber checks, sprite labels, auto-orbit); log panel; error callout; empty panel.

## Do's and Don'ts
- Do keep each hue on its function everywhere: lime never means fake, coral never means action.
- Do let the 3D objects carry data and react to the sweep; never add 3D as atmosphere.
- Don't add gradients on text, glass, or motion that does not report state.
- Don't use red, amber or green outside verdicts.

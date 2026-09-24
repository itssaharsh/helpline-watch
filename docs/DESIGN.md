---
name: Helpline Watch
description: An analyst's workbench on Radix Themes. Neutral surfaces and near-black actions; red, amber and green appear only as verdicts, on the numbers themselves.
colors:
  accent: "gray (Radix, high contrast) for actions, selection and focus"
  gray: "slate"
  fake: "ruby (Radix ruby-9 solid badge, ruby-11 text, ruby-a3 mark background)"
  check: "amber (amber-a4 mark background, amber-12 text)"
  official: "grass (grass-11 text, grass-9 underline)"
  link-in-page: "blue-11, only inside a rendered result page"
typography:
  fontFamily:
    sans: "Host Grotesk"
    devanagari: "Noto Sans Devanagari"
  scale: "Radix sizes 1 to 7 (12, 14, 16, 18, 20, 24, 28 px), ratio about 1.15"
  fontWeight: { regular: 400, medium: 560, bold: 700 }
  numerals: "tabular everywhere"
rounded: "Radix radius medium: controls 6 px, cards 8 px, badges 4 px, pills full"
spacing: "Radix space scale (4 px base); tight groups, generous separation"
components:
  primary-button: "Radix Button highContrast (near-black on light, white on dark), loading state while sweeping"
  secondary-button: "Radix Button variant soft, color gray"
  verdict-badge: "Radix Badge: ruby solid for Fake, amber soft for Check, grass soft for Official and Unlisted"
  mark: ".mark-fake / .mark-review / .mark-official: inline number marks inside rendered pages"
  page: ".page: result page typography (link blue titles, gray URLs, 14 px snippets, boxed Places and People also ask)"
---

## Overview
Operate mode. The tool should disappear into the task, so the vocabulary is a real component system (Radix Themes 3) with one family, a neutral accent and a strict semantic palette. Brand lives in details: tabular numerals on every number, verdict marks drawn onto the rendered page, the progress line under the app bar, themed scrollbars, selection and focus rings. Light and dark follow the system and can be toggled.

## Colors
Neutral slate grays for every surface; the accent is gray with high contrast, so the one primary action per view is near-black and selection is a gray wash with a 3 px ink rule. Red belongs to a confirmed fake and nothing else: the badge, the number, the mark inside a page, the node in the graph. Amber means check. Green means official. Inside a rendered result page only, titles use link blue and URLs gray, so the page reads as a search page without imitating one.

## Typography
Host Grotesk for headings, body, controls and data, with Noto Sans Devanagari as the fallback for Hindi results. Radix's fixed rem scale at ratio 1.15. Headings are sentences or names, never labels. Numbers are the loudest text on screen: size 3 in the list, size 7 in the evidence header, always tabular.

## Layout
App shell: 56 px bar (wordmark, brand select, city picker, mode and credits, appearance toggle, Sweep) over a 2 px progress line, then a workspace grid: 384 px findings pane on a second neutral (gray-2) and a fluid detail pane (max 1040 px content) with tabs for Evidence, Pages, Across brands and Log. Below 1024 the panes stack, the findings pane capped at 44 dvh. Everything scrolls inside its pane; the shell is the viewport.

## Elevation & Depth
Radix panels with 1 px alpha borders. Cards only where a group needs a boundary (Why, a sighting, a page). No decorative shadows.

## Shapes
Radix radius medium throughout: 6 px controls, 8 px cards, 4 px badges, full pills for the mode badge.

## Components
App bar; findings row (number, badge, meta, reason); segmented filters; page selector (city segmented control, page badges with red counts, pending and failed badges); rendered page (query, blocks in Google's order, knowledge panel aside); marks; evidence view (header with switch and soft button, Why data list, sighting cards, reverse lookup, all sightings); network; log; callout for errors; skeletons for loading; empty-state card.

## Do's and Don'ts
- Do keep every control from Radix, re-tokened; never invent a control for flavor.
- Do animate only state: the progress line, the mark flash when a verdict lands, list selection.
- Don't use red, amber or green for anything that is not a verdict.
- Don't add eyebrow labels, KPI tiles, gradients, glass or pen metaphors.

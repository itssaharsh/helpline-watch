---
name: Helpline Watch
description: The annotated printout. White Google-results sheets on a grey desk, blue-black ink, a red pen for fakes, a yellow highlighter for numbers to check, a green tick for official numbers.
colors:
  desk: "#D8DBD3"
  desk-deep: "#C6CAC1"
  paper: "#FFFFFF"
  paper-2: "#F5F6F3"
  line: "#D9DBD5"
  ink: "#1B2233"
  ink-muted: "#4F5765"
  red: "#C8102E"
  highlighter: "#FFE45C"
  green: "#1E7A4C"
  link: "#1A0DAB"
  url: "#0B6B3A"
typography:
  fontFamily:
    sans: "Host Grotesk"
    pen: "Kalam"
    devanagari: "Noto Sans Devanagari"
  fontSize: { xs: "12px", sm: "13px", base: "15px", lg: "17px", xl: "22px", "2xl": "30px" }
  fontWeight: { regular: 400, medium: 500, bold: 700 }
  lineHeight: { tight: 1.2, body: 1.5 }
  letterSpacing: { display: "-0.015em" }
rounded: { sm: "2px", md: "6px", lg: "10px" }
spacing: { 1: "4px", 2: "8px", 3: "12px", 4: "16px", 6: "24px", 8: "32px" }
components:
  button-ink: { background: "{colors.ink}", color: "{colors.paper}", rounded: "{rounded.md}", height: "40px" }
  button-paper: { background: "{colors.paper}", border: "#A6AAA2", color: "{colors.ink}" }
  mark-fake: { stroke: "{colors.red}", note: "Kalam 16px, rotated −7°" }
  mark-review: { background: "rgba(255,228,92,.6)" }
  mark-official: { color: "{colors.green}", underline: "2px solid" }
  sheet: { background: "{colors.paper}", rounded: "{rounded.sm}", shadow: "0 10px 24px -12px rgba(27,34,51,.35)" }
---

## Overview
Derived, not chosen from a library. A fraud analyst prints the search results a victim would see and marks them with a red pen. The app is that desk: grey blotter, white printouts, ink, three marking tools. Boldness is spent once, on the marks drawn directly onto the results page; everything else is quiet.

## Colors
The desk is a cool grey, never cream. Paper is pure white because the object is a printout of a white web page. Ink is blue-black, not tinted black. Red belongs to the pen and means one thing: a number the classifier calls fake. The highlighter (yellow at 60%) means "check this". Green ink means official; a dashed green rule means official but missing from the list. Inside the printout only, result titles use link blue and URLs use a muted green, to read as a search page without imitating one. The primary action is an ink slab, so red is never spent on a button.

Contrast on paper: ink 15.4:1, ink-muted 7.6:1, red 5.8:1, green 5.2:1, link 10.7:1. On the desk: ink 11.2:1, ink-muted 5.5:1.

## Typography
One family for everything, Host Grotesk, with tabular figures on by default so phone numbers align. Kalam, an Indian handwriting face, is used only for pen notes ("fake", "check", "not the brand", "demo fixture, not evidence") at 14–16 px, rotated 5–8°. Noto Sans Devanagari is the fallback for Hindi results. Headings are sentences, never labels: "What a victim searching for HDFC Bank is shown", "Numbers found", "Since the last sweep". No uppercase eyebrows; the one uppercase text is inside the rubber stamp, which is uppercase because stamps are.

## Layout
Desk at 1440: top strip 56 with wordmark and mode. Main grid: the printout column (fluid, sheets 720 wide max) and the case file (400) on the right, sticky. Above the sheets: a sentence heading, the swept cities and official numbers in prose, and the one ink button. Folder tabs for cities sit on the desk and connect to the active sheet. Inside a sheet: a page row (each query, the Hindi search, Google Maps), the query bar, then results in the order Google showed them, with the knowledge panel to the right. Below 1280 the case file drops under the sheets; at 390 tabs scroll sideways and the drawer is full width.

## Elevation & Depth
Paper floats on the desk with one soft shadow. Nothing else casts a shadow. Panels inside the case file are separated by 1 px rules, not boxes.

## Shapes
Paper corners 2 px, buttons and page chips 6 px, result boxes 8 px (a search page's own vernacular), the stamp is a circle.

## Components
Ink button, paper button, quiet button; folder tab with pending, count and failed states; pen marks (fake, check, official, official-unlisted); sheet with query bar, sponsored block, answer box, places box, knowledge panel, results, People also ask, Maps cards; case file ledger rows; rubber stamp; cross-brand network drawn in ink and red pen; evidence-slip drawer; search log.

## Do's and Don'ts
- Do open on a marked-up sheet; never on an empty desk or a spinner.
- Do draw the circle when a fake lands (400 ms), and stamp the pack once when the sweep ends. Nothing else moves on its own.
- Don't use red for anything but a fake. Don't add tiles of big numbers, gradients, glass, glows, eyebrows or emoji.
- Don't let a pen note cover text: notes appear only where the number stands alone (phone lines, ledger, drawer); inside running text the circle is enough.

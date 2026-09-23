---
name: Helpline Watch
description: A fraud desk at night. Dark navy canvas, one amber “act now”, red reserved for a confirmed fake, green for verified official numbers.
colors:
  canvas: "#0E1220"
  surface-1: "#151A2B"
  surface-2: "#1D2336"
  surface-3: "#252C42"
  line: "#2B3249"
  ink: "#F3E6CF"
  ink-muted: "#A69E8F"
  accent: "#F5AD1F"
  accent-ink: "#1A1000"
  success: "#4CC38A"
  warning: "#FFD24A"
  danger: "#FF7A7A"
typography:
  fontFamily:
    display: "Schibsted Grotesk"
    body: "Funnel Sans"
    mono: "Martian Mono"
  fontSize: { xs: "11px", sm: "13px", base: "15px", lg: "18px", xl: "22px", "2xl": "28px" }
  fontWeight: { regular: 400, medium: 500, bold: 700, black: 800 }
  lineHeight: { tight: 1.1, body: 1.5 }
  letterSpacing: { display: "-0.02em", label: "0.1em" }
rounded: { sm: "4px", md: "8px", lg: "12px" }
spacing: { 1: "4px", 2: "8px", 3: "12px", 4: "16px", 6: "24px", 8: "32px", 12: "48px" }
components:
  button-primary: { background: "{colors.accent}", color: "{colors.accent-ink}", rounded: "{rounded.md}", height: "40px" }
  button-primary-hover: { background: "oklch(from {colors.accent} calc(l - .06) c h)" }
  button-secondary: { background: "{colors.surface-1}", border: "{colors.line}", color: "{colors.ink}" }
  chip-fake: { color: "{colors.danger}", background: "color-mix(in oklch, {colors.danger} 16%, transparent)" }
  chip-review: { color: "{colors.warning}", background: "color-mix(in oklch, {colors.warning} 14%, transparent)" }
  chip-official: { color: "{colors.success}", background: "color-mix(in oklch, {colors.success} 14%, transparent)" }
  card: { background: "{colors.surface-1}", border: "{colors.line}", rounded: "{rounded.lg}" }
---

## Overview
Direction: **Sodium Night**, mutated three ways so it is not the library default: display face swapped to Schibsted Grotesk, radius family 4·8·12, accent hue rotated +8° toward yellow amber. Personality: **Precise** (ease-out-quint, 120–200 ms, no bounce). Dials: variance 3, motion 3, density 8 (dashboard/monitoring).

## Colors
Canvas is night navy, never pure black. Elevation is a surface ladder (surface-1 → surface-3), not shadows. The accent is amber and appears only on: the one primary button, the active nav indicator, brand nodes in the network, and the selected-brand rail marker (accent budget ≈ 3% of pixels). Red means one thing: a number the classifier calls **fake**. Yellow `warning` means **needs review**. Green means **official**; a dashed green border means official but unlisted.

Contrast (WCAG 2 on canvas): ink 13.9:1, ink-muted 6.5:1, danger 7.1:1, warning 11.9:1, success 8.4:1, accent-ink on accent 10.6:1.

## Typography
Display: Schibsted Grotesk 700/800 at −0.02 em. Body: Funnel Sans 400/500 at 15 px, line-height 1.5. Every phone number, count and timestamp is Martian Mono with tabular numerals. Labels are 11 px uppercase at +0.1 em, at most one per section.

## Layout
1440 grid: top bar 48, left rail 280, main column fluid with 16 px gutters. Main stacks: KPI strip → city × surface grid → findings table (60%) | scam network (40%) → run log. Right drawer 480 for a finding. Below 1024 the rail stacks above the main column; at 390 the grid scrolls horizontally inside its card and the drawer is full-width.

## Elevation & Depth
No drop shadows on the dark canvas. Layers use surface-1/2/3 plus a 1 px `line` border. The drawer sits on surface-1 with a 40% ink scrim.

## Shapes
Chips 4 px, buttons and inputs 8 px, cards and drawer 12 px.

## Components
Primary button (amber slab, morphing label), secondary, ghost; verdict chips with a leading dot; KPI tiles; grid cells with pending skeleton / done / failed states; findings row; finding drawer; network graph; run log lines.

## Do's and Don'ts
- Do open on a populated sweep; never on an empty grid or a spinner.
- Do animate only state changes: chips landing (pulse once), edges drawing on, label morphs.
- Don't use red for anything except a fake verdict. Don't add gradients, glass, glows or ✨.
- Don't animate hover on every card; only chips and rows respond.

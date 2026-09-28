# Muscle Atlas Trainer

[Open the atlas](https://generalgroovy.github.io/fit/). Select muscle groups in four body views, filter a static exercise reference, and copy a generated routine.

## Build a reference routine

1. Select a muscle in the front, back or side views. On phones, use **View** to switch the visible atlas without scrolling through all four views. Repeated regions share the same selection. Select an active muscle again to deselect it, including in single-select mode. Toggle **Multi-select** to choose one or several groups; **Clear** resets them and **Select all major** selects the full atlas.
2. Choose a mode: **Finder**, **Target most muscles**, **Isolate single**, **Mobility** or **Balanced day**.
3. Narrow the list with the search, exercise type, equipment and difficulty filters.
4. Open an exercise card for its front/back target maps and instructions; Enter or Space toggles a focused card and keeps focus on that card. The displayed coverage percentage comes from the app's primary/secondary muscle tags, not a measured training outcome.
5. Choose **Copy routine** or **Print routine** for a clean print/PDF layout containing the current exercise instructions. If browser clipboard access is unavailable or denied, a text box appears with the routine selected for manual copying.

With no muscles selected, the app uses general full-body options. Mode names describe the filtering/generation workflow; they are not individualized clinical or training assessments. The built-in exercise descriptions and suggested sets/repetitions should be reviewed for the intended user's circumstances.

## Reading the atlas

The original SVG schematics show approximate group locations and contour landmarks. Hover/focus a region for its location and main action; the **Muscle list** provides labeled keyboard/touch alternatives for all 24 groups. Exercise diagrams distinguish primary targets (solid) from secondary targets (dashed), with equivalent text beside them. These are target maps, not demonstrations of movement technique or quantitative activation. Deep groups such as the rotator cuff and hip flexors are shown as surface projections. **Info & sources** explains these limits and links OpenStax anatomy references. No third-party anatomical artwork is bundled.

Search now matches the actual exercise and its muscle tags. The generated routine respects the current filtered candidate list. Copy/print are unavailable when that list cannot produce a routine.

## State

Selections, filters and routines live in page memory and reset on reload. Copy the routine before closing the page. There is no account, saved training history, file import, automatic PDF generator or cross-device synchronization. Print routine uses the browser print/PDF dialog.

## Run and verify

The entire app is in `index.html`; there is no build step or third-party runtime dependency. Serve the repository root with a static server, for example `python -m http.server 8080`, then open `http://localhost:8080`.

With Node.js 18 or newer:

```sh
node --test tests/*.cjs
```

Tests cover atlas group coverage, filter-aware routines, escaped print content, selection toggling, exercise focus, successful clipboard writes and the selectable-text fallback when the clipboard is absent or rejects access. Browser QA should select a muscle, change mode/filters, open a card, and copy the resulting routine. Exercise safety, medical claims, movement coaching and individual training suitability are outside these software tests.

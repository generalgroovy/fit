# Muscle Atlas Trainer

[Open the atlas](https://generalgroovy.github.io/fit/). Explore muscle groups in four body views, inspect exercise references, and keep a reusable routine.

## Build a reference routine

1. Select a muscle in the front, back or side views. On phones, use **View** to switch the visible atlas without scrolling through all four views. Repeated regions share the same selection. Select an active muscle again to deselect it, including in single-select mode. Toggle **Multi-select** to choose one or several groups; **Clear** resets them and **Select all major** selects the full atlas.
2. Choose a mode: **Finder**, **Target most muscles**, **Isolate single**, **Mobility** or **Balanced day**.
3. Narrow the list with the search, exercise type, equipment and difficulty filters.
4. Open an exercise card for its front/back target maps and instructions; Enter or Space toggles a focused card and keeps focus on that card. **+ Routine** adds just that exercise. Alternatively, open **Suggested routine** and choose **Keep routine** to keep the current suggestions.
5. Open **My routine** to reorder with the arrows, remove an exercise, or read its instructions—even if it no longer matches the filters. **Undo** reverses the last routine edit; **Clear routine** and **Use current suggestions** are also reversible. Up to 30 edits can be undone during the current visit.
6. **Target map** shows exactly which exercises tag each selected group as primary or secondary. With no selection it shows all catalogue groups. The count includes either kind of tag, once per group; it does not measure training quality or physiological activation.
7. **Copy routine** includes the current exercise order, targets and instructions. **Print routine** opens a clean print/PDF layout. If clipboard access is unavailable or denied, a text box appears with the routine selected for manual copying.

With no muscles selected, the app uses general full-body options. Mode names describe the filtering/generation workflow; they are not individualized clinical or training assessments. The built-in exercise descriptions and suggested sets/repetitions should be reviewed for the intended user's circumstances.

## Reading the atlas

The original SVG schematics show approximate group locations and contour landmarks. Hover/focus a region for its location and main action; the **Muscle list** provides labeled keyboard/touch alternatives for all 24 groups. Exercise diagrams distinguish primary targets (solid) from secondary targets (dashed), with equivalent text beside them. These are target maps, not demonstrations of movement technique or quantitative activation. Deep groups such as the rotator cuff and hip flexors are shown as surface projections. **Info & sources** explains these limits and links OpenStax anatomy references. No third-party anatomical artwork is bundled.

Search matches the exercise and its muscle tags. Suggestions respect the current filtered candidate list. A kept routine is independent of subsequent filters and selections. **Reset filters** recovers an empty result list while retaining selected muscles and the kept routine. Copy/print are available whenever the current routine contains an exercise, including when search has no results.

## State

Kept routines save automatically to this browser and website. Reload restores catalogue identities and order; selections, filters, expanded details and Undo history reset. Removing every exercise preserves an empty routine, rather than silently replacing it with suggestions. A routine saved on GitHub Pages is separate from one saved on another host.

The versioned local record stores only exercise IDs (`muscle-atlas.routine.v1`), not health information. Unavailable or malformed records do not prevent using the app; the status explains recovery or unavailable saving. Unrecognized exercise IDs are removed when restoring. Copy/print remain available when storage is blocked or full. Browser data deletion removes the saved routine. There is no account, multi-routine library, cross-device synchronization or file import.

## Run and verify

There is no build step or third-party runtime dependency. Serve the repository root with a static server, for example `python -m http.server 8080`, then open `http://localhost:8080`. Publish **both `index.html` and `routine-model.js`**. The HTML holds the atlas/catalogue and UI; the small separate model owns validated persistence and undoable routine edits.

With Node.js 18 or newer:

```sh
node --test tests/*.cjs
```

Tests cover atlas coverage, filter-aware suggestions, kept-routine independence, add/remove/reorder/undo, reload and empty-state persistence, malformed and unavailable storage, exact target relationships, escaped exports, selection toggling, exercise focus and clipboard fallback. See [this iteration's quality record](PROJECT-QUALITY-2026-10-06.md) for acceptance evidence. Browser QA should also add two exercises, reorder, change filters, reload, undo a removal, and inspect copy/print on desktop and phone widths. Exercise safety, medical claims, movement coaching and individual training suitability are outside these software tests.

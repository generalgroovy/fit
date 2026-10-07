# Muscle Atlas Trainer

[Open the atlas](https://generalgroovy.github.io/fit/). Explore muscle groups in four body views, inspect exercise references, and keep a reusable routine.

## Build a reference routine

1. Select a muscle in the front, back or side views, or open **Choose by name**. Select it again to deselect it. On phones, **View** switches the visible atlas. **Choose several** and **Select all 24 groups** are beside the muscle names; **Clear muscles** clears only the muscle selection.
2. Use **See exercises** or the **Exercises** navigation button to jump directly to the results. Search accepts exercise names, anatomical names and body-location words such as “chest”. **Explore** returns to the map.
3. Open **Refine exercises** for equipment, type, level and five ways to browse: all matching exercises, more muscle groups, one primary muscle, mobility/stretches, and varied movement patterns. A short explanation describes each choice. Active constraints stay visible when refinement is closed. **Reset filters** resets search, mode and filters while retaining muscles and the kept routine.
4. Open **Details** for an exercise's front/back target maps, instructions and reference quantities; Enter or Space toggles a focused card and keeps focus on that card. **+ Add** adds just that exercise. Alternatively, open **Suggested routine** and choose **Keep routine** to keep the suggestions.
5. Use the **Routine** navigation button to open **My routine**, reorder with the arrows, remove an exercise, or read its instructions—even if it no longer matches the filters. After changing muscles or filters, open **Review current suggestions** to see the suggested names, instructions, equipment and which entries are new. **Add new exercises** appends only missing entries while keeping your existing order. **Replace my routine** uses the previewed order and explicitly lists any exercises it removes. **Undo** reverses either action in one step, as well as **Clear routine** and individual edits. Up to 30 edits can be undone during the current visit.
6. **Target map** shows exactly which exercises tag each selected group as primary or secondary. With no selection it shows all catalogue groups. The count includes either kind of tag, once per group; it does not measure training quality or physiological activation.
7. Inside the opened routine, **Copy routine** includes the current exercise order, targets and instructions. **Print routine** opens a clean print/PDF layout. If clipboard access is unavailable or denied, a text box appears with the routine selected for manual copying.

With no muscles selected, the app uses general full-body options. Mode names describe the filtering/generation workflow; they are not individualized clinical or training assessments. The built-in exercise descriptions and suggested sets/repetitions should be reviewed for the intended user's circumstances.

## Reading the atlas

The original SVG schematics show approximate group locations and contour landmarks. Hover/focus a region for its location and main action; **Choose by name** provides labeled keyboard/touch alternatives for all 24 groups. Exercise diagrams distinguish primary targets (solid) from secondary targets (dashed), with equivalent text beside them. These are target maps, not demonstrations of movement technique or quantitative activation. Deep groups such as the rotator cuff and hip flexors are shown as surface projections. **Info & sources** explains these limits and links OpenStax anatomy references. No third-party anatomical artwork is bundled.

Search matches the exercise and its muscle tags. Suggestions respect the current filtered candidate list. A kept routine is independent of subsequent filters and selections; opening the suggestion review does not edit or save it. The preview follows the current filters, and no replacement action appears when there are no suggestions. **Reset filters** recovers an empty result list while retaining selected muscles and the kept routine. Copy/print are available whenever the current routine contains an exercise, including when search has no results.

## State

Kept routines save automatically to this browser and website. Reload restores catalogue identities and order; selections, filters, expanded details and Undo history reset. Removing every exercise preserves an empty routine, rather than silently replacing it with suggestions. A routine saved on GitHub Pages is separate from one saved on another host.

The versioned local record stores only exercise IDs (`muscle-atlas.routine.v1`), not health information. Unavailable or malformed records do not prevent using the app; the status explains recovery or unavailable saving. Unrecognized exercise IDs are removed when restoring. Copy/print remain available when storage is blocked or full. Browser data deletion removes the saved routine. There is no account, multi-routine library, cross-device synchronization or file import.

## Run and verify

There is no build step or third-party runtime dependency. Serve the repository root with a static server, for example `python -m http.server 8080`, then open `http://localhost:8080`. Publish **both `index.html` and `routine-model.js`**. The HTML holds the atlas/catalogue and UI; the small separate model owns validated persistence and undoable routine edits.

With Node.js 18 or newer:

```sh
node --test tests/*.cjs
```

Tests cover atlas coverage, filter-aware suggestions and previews, kept-routine independence, append/replace with one-step Undo, add/remove/reorder, reload and empty-state persistence, malformed and unavailable storage, exact target relationships, escaped exports, selection toggling, exercise/chip focus, navigation, active-filter feedback and clipboard fallback. See the [suggestion-review flow record](PROJECT-UX-FLOW-2026-10-07.md), [previous UX evidence](PROJECT-UX-2026-10-07.md) and [routine quality record](PROJECT-QUALITY-2026-10-06.md). Browser QA should also add two exercises, reorder, change filters, review suggestions, append and replace with Undo, reload, undo a removal, and inspect copy/print on desktop and phone widths. Exercise safety, medical claims, movement coaching and individual training suitability are outside these software tests.

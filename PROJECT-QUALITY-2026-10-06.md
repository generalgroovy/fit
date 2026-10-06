# Muscle Atlas quality iteration — 6 October 2026

Baseline: `9efc164` (`origin/main`). Clean checkout; branch `codex/fit-routine-depth`.

## Actual journey and diagnosis

Select a body region, inspect matching exercise targets and instructions, then keep a useful reference routine. The current generator replaces its routine on every filter/selection redraw; closing the page loses everything. There is no curation or reordering. One coverage percentage hides which groups are primary, secondary or absent. The anatomical schematics already provide four selectable views and front/back exercise maps; their educational scope and source data are retained.

## Bounded implementation

- Distinguish live suggestions from an explicitly kept routine. Add/remove/reorder exercises, adopt current suggestions, and undo changes. Filters cannot change a kept routine.
- Save only validated catalogue IDs and order locally, with guarded recovery when storage is malformed or unavailable. Copy/print remain usable fallbacks.
- Make coverage inspectable for the selected groups (all catalogue groups when none selected), with primary and secondary tags distinguished. This describes catalogue relationships, never exercise effectiveness.
- Provide direct empty-result recovery and preserve keyboard focus through edits. Keep the routine and coverage details collapsible.

## Acceptance and evidence

Local automated: **21 tests pass** with `node --test tests/*.cjs`; `node --check routine-model.js` and `git diff --check` pass. Checks cover catalogue/map consistency, filter-aware suggestions, kept-routine independence, every routine mutation and Undo, persisted empty state, malformed/future/denied storage, catalogue removal recovery, exact primary/secondary relationships, ordered copy/print instructions, clipboard fallback, selection toggling and inline-script compilation.

Local browser: Computer Use review at **1366 × 768**, **390 × 844** and **320 × 800**. Verified keyboard Add returns focus to the same exercise header, boundary reorder to the routine summary, Remove to the adjacent control and Undo retains control focus. Confirmed routine discoverability while collapsed, stable order through empty searches and reload, Reset filters recovery, copy success, independent selected-group coverage, all 24 coverage rows without horizontal page overflow, and readable exercise target maps. No captured browser console warnings or errors. Evidence: [desktop](docs/evidence/2026-10-06-desktop.png), [phone](docs/evidence/2026-10-06-mobile.png).

Review-driven corrections: bounded the atlas SVG height after visual QA exposed excessive intrinsic sizing; front/back bodies now fit the desktop atlas panel. Gave exercise target maps the full card width. Persistence validation allows older catalogues to be larger than the current one, retaining valid IDs after exercises retire. Replaced opaque match scores with actual group counts. Copy/print use the kept order and no longer imply the current search/selection defines an independently kept routine.

The dependency-free candidate CI workflow runs model/syntax tests on `main`, `codex/**` and pull requests. Its fresh run is recorded in the parent release handoff. Publication and public-byte verification belong to the parent and have not been performed by this agent. Browser print-dialog/hardware output, physical touch devices, learner observation and individual training suitability were **not tested**. No anatomy facts, dosing recommendations or third-party runtime dependencies were added.

Release both **`index.html` and `routine-model.js`**. Routines are local to each browser/origin, with 30 session-only Undo steps; there is one routine rather than a multi-routine library. The parent retains ownership of shared portfolio packaging and production promotion.

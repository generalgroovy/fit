# Muscle Atlas — review suggestions before editing a routine

Baseline: `880dbec344c02b2b4014a58ace3305e597793ec4`, matching `origin/main` on 7 October 2026. Candidate branch: `codex/ux-flow-2026-10-07`. Runtime: `f6952629c278fd81ca42f55527832fc57b5daad7`.

## Observed friction

The previous source rendered a kept routine instead of the generated suggestions, but its **Use current suggestions** action immediately replaced the kept list. After changing muscles or filters, a user could not inspect the generated names or see what would be removed before choosing that action. Undo recovered the edit after the fact; retaining the old routine while adding the new suggestions required individual catalogue additions.

## Final behavior

In **My routine**, **Review current suggestions** opens an inline preview of the current filtered suggestions. Each entry says whether it is already kept or new, shows equipment and opens its existing instructions. The preview names any exercises a replacement would remove. Opening or reading it never edits the routine.

**Add new exercises** appends only missing entries, preserving the complete saved order. **Replace my routine** uses exactly the previewed list and order. Either is one undoable, persisted edit. Equal suggestions disable both actions; a different order allows replacement. Empty suggestions offer no mutation, and an empty saved routine remains intentionally empty until edited. Focus returns to the review summary after either action. First-use **Keep routine**, individual additions, reordering, removal, copy/print and the 30-edit Undo history remain available.

The prior independent review's small live-region concern was also addressed: unchanged result text is not rewritten during ordinary rerenders. The catalogue, anatomical descriptions and reference quantities were not changed.

## Evidence and acceptance boundary

- Local `node --test tests/*.cjs`: **30 passed**, zero failed/skipped. Six new tests execute the application functions with a synthetic DOM and real routine store to cover non-mutating preview, append/deduplication/order, replacement/removal, one-step Undo, persistence, changing/empty filters, exact-match no-ops and saved emptiness.
- Existing tests continue to cover atlas/filter behavior, routine independence, malformed/unavailable storage, exports, focus, navigation and clipboard fallback.
- `node --check routine-model.js`, inline application compilation and `git diff --check` pass.
- Candidate CI passed for runtime `f6952629c278fd81ca42f55527832fc57b5daad7`: [Verify Muscle Atlas run 37609569685](https://github.com/generalgroovy/fit/actions/runs/37609569685).
- Independent source/UX review accepted `f6952629c278fd81ca42f55527832fc57b5daad7` with no blockers, independently reran all 30 tests and checked the baseline diff. It inspected the append/replace transaction, named removals, filter regeneration, no-op/empty guards, persistence and focus fallback. The shared `ux-flow-2026-10-07/reviews/fit-review.md` records that review. Root owns the new rendered acceptance pass and publication decision; neither is implied by these synthetic tests.

The checkout was clean before this pass. The candidate modifies only `index.html`, the focused suggestion-review tests and documentation; `routine-model.js` and its saved-record format are unchanged. No new dependency was added. Intended live URL: [Muscle Atlas](https://generalgroovy.github.io/fit/). Candidate push is not publication.

These checks establish software behavior. They do not establish individual exercise suitability, physical touch behavior, human comprehension, training results or medical validity. The previously published screenshots describe the prior runtime; this report does not reuse them as fresh rendering evidence.

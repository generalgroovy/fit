# Muscle Atlas — review suggestions before editing a routine

Baseline: `880dbec344c02b2b4014a58ace3305e597793ec4`, matching `origin/main` on 7 October 2026. Candidate branch: `codex/ux-flow-2026-10-07`. Final runtime: `7103870544af9595f00b7f4f662475adf171596a`.

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
- Final candidate CI passed for `7103870544af9595f00b7f4f662475adf171596a`: [Verify Muscle Atlas run 37610206033](https://github.com/generalgroovy/fit/actions/runs/37610206033). The final delta fixes singular wording for one suggested exercise and extends the existing regression assertion.
- Independent source/UX review accepted the implementation with no blockers, independently reran all 30 tests and checked the baseline diff. It inspected the append/replace transaction, named removals, filter regeneration, no-op/empty guards, persistence and focus fallback. The reviewer accepted the final wording delta and reran its six targeted tests. The shared `ux-flow-2026-10-07/reviews/fit-review.md` records both checks.
- Root's real-browser pass verified appending Goblet Squat after Push-Up, explicit replacement, Undo restoring both entries, and state-backed disabled no-op actions. The **390 × 844** layout was readable without horizontal overflow. [Phone evidence](docs/evidence/2026-10-07-flow-mobile.png). Root identified the singular-wording issue fixed above and authorized promotion after the remaining gates passed.
- Normal fast-forward main promotion completed. [Main CI 37610378317](https://github.com/generalgroovy/fit/actions/runs/37610378317) and [Pages deployment 37610377391](https://github.com/generalgroovy/fit/actions/runs/37610377391) succeeded for the final runtime. Both public runtime files, `index.html` and `routine-model.js`, matched their exact committed SHA-256 bytes over certificate-validated HTTPS; shared `ux-flow-2026-10-07/evidence/fit-public.json` records the hashes.

The checkout was clean before this pass. The change modifies only `index.html`, the focused suggestion-review tests and documentation/evidence; `routine-model.js` and its saved-record format are unchanged. No new dependency was added. Published URL: [Muscle Atlas](https://generalgroovy.github.io/fit/). The final report/evidence commit does not change the verified runtime.

These checks establish software behavior. They do not establish individual exercise suitability, physical touch behavior, human comprehension, training results or medical validity. The previously published screenshots describe the prior runtime; this report does not reuse them as fresh rendering evidence.

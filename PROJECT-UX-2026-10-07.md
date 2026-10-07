# Muscle Atlas — clearer exploration and routine building

Base: `b6dd96f9e9535f987ebb244032a948194a991881` (`origin/main`). Candidate branch: `codex/ux-clarity-2026-10-07`.

## Friction addressed

The previous first screen gave five unexplained modes the same prominence, separated search from exercise filters, emphasized selecting every muscle, and displayed suggested-routine coverage before the user had kept anything. Exercise cards exposed internal equipment labels and generic quantities alongside several repetitive badges. On phones the route from the atlas to exercises required scrolling; removing a selected-muscle chip could lose keyboard focus.

## Behavior

- Explore, Exercises and Routine navigation moves to the relevant section and transfers keyboard focus. Routine opens its details. The atlas offers a counted See exercises action; multiple-selection options live with Choose by name.
- Search sits with the exercise results. Refine exercises contains the existing five modes, with plain labels and contextual explanations, plus named equipment/type/level controls. Active constraints remain visible when the disclosure closes. Search also includes existing body-location descriptions such as chest.
- Cards show the exercise, primary targets, equipment and level, with explicit Details and Add actions. Quantities, type, target maps, instructions, cautions and research links remain inside Details. Selected-group matches appear only when relevant.
- Suggestions are explicitly labeled; a kept routine appears with its count in navigation. Copy/print live inside the routine. Local saving, reorder, removal, up to 30 Undo steps and primary/secondary coverage are retained.
- Stable live feedback describes result constraints and routine edits. Removing a muscle chip focuses the next chip or results heading. Controls retain 44px minimum sizing; narrow atlas sizing, short-window scrolling and reduced-motion support are included.

## Verification

Local: `node --test tests/*.cjs` passes **24 tests**. `node --check routine-model.js`, inline-script compilation and `git diff --check` pass. New behavior checks cover selected-chip focus recovery, routine-navigation disclosure/focus, collapsed active-filter context, count feedback and ordinary body-location search. Existing persistence, undo, suggestions, maps and export checks remain passing.

Parent-owned Computer Use browser checks: **1366 × 900**, **390 × 844**, **320 × 740**, and short desktop **1366 × 600**. Verified Pectorals/Biceps chip removal with Enter focuses the next chip and then the results heading; an empty search resets to 40 exercises; Push-Up and Side Plank can be added, reordered, removed, undone and restored after reload in the kept order. Phone layouts have no horizontal overflow; See exercises moves focus to the heading and routine controls stay reachable. Short-window navigation and scrolling remain usable. Evidence: [desktop](docs/evidence/2026-10-07-desktop.png), [phone](docs/evidence/2026-10-07-mobile.png). The implementation agent's browser session had no surfaces; these observations came from the parent's working CUA session.

Independent baseline findings were incorporated: selected-chip focus recovery, understandable equipment labels, live result feedback and explicit reset scope. Final independent diff review remains a parent integration gate before promotion; this branch is a candidate and is not deployed by the owner.

## Limits

No anatomy catalogue, exercise prescription or training claim was added or revalidated. Automated checks do not establish individual training suitability, human comprehension, physical touch behavior or print hardware output. Saved routines remain local to the browser and host. Production promotion and public-byte verification belong to the parent release process.

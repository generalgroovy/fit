# Muscle Atlas Trainer

[Open the atlas](https://generalgroovy.github.io/fit/). Select muscle groups in four body views, filter a static exercise reference, and copy a generated routine.

## Build a reference routine

1. Select a muscle in the front, back or side views. Repeated regions share the same selection. Toggle **Multi-select** to choose one or several groups; **Clear** resets them and **Select all major** selects the full atlas.
2. Choose a mode: **Finder**, **Target most muscles**, **Isolate single**, **Healthy mobility** or **Balanced day**.
3. Narrow the list with the search, exercise type, equipment and difficulty filters.
4. Open an exercise card for its instructions. The displayed coverage percentage comes from the app's primary/secondary muscle tags, not a measured training outcome.
5. Choose **Copy routine**. If browser clipboard access is unavailable or denied, a text box appears with the routine selected for manual copying.

With no muscles selected, the app uses general full-body options. Mode names describe the filtering/generation workflow; they are not individualized clinical or training assessments. The built-in exercise descriptions and suggested sets/repetitions should be reviewed for the intended user's circumstances.

## State

Selections, filters and routines live in page memory and reset on reload. Copy the routine before closing the page. There is no account, saved training history, file import, PDF generator or cross-device synchronization. Browser print functionality is available separately from the app.

## Run and verify

The entire app is in `index.html`; there is no build step or third-party runtime dependency. Serve the repository root with a static server, for example `python -m http.server 8080`, then open `http://localhost:8080`.

With Node.js 18 or newer:

```sh
node --test tests/copy.test.cjs
```

Tests cover successful clipboard writes and the selectable-text fallback when the clipboard is absent or rejects access. Browser QA should select a muscle, change mode/filters, open a card, and copy the resulting routine. Exercise safety, medical claims, movement coaching and individual training suitability are outside these software tests.

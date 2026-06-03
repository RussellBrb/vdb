# STATUS - vdb

*Single current-state snapshot. Overwrite on each update; sign + date.*

**Updated:** 2026-06-02 - Codex

## Engine
- `vdb.js` @ **v13.1**. Engine commit `fbd6cde` is tagged `v13.1`.
- v13.1 is the motion-quality baseline: behavior-type default easing, calm gear/piston periods, shared mechanism `speed`/`phase`, reduced-motion pause rule, and piston/guide label-overlap fix.
- v13 Phase A remains intact: behavior-driven `motion` parts, CSS `@keyframes` for `rotate`, `oscillate`, `pulse`, and `flow`, FK parent nesting through `pivot`/`parent`, and Phase A `gear`/`piston` primitives.
- Existing `motion.frames` path remains the backward-compatible escape hatch.
- CDN verified: `https://cdn.jsdelivr.net/gh/RussellBrb/vdb@v13.1/vdb.js` returned HTTP 200 and contains `VDB.version='v13.1'`.
- Banked for later: `vdb.min.js`; `{param}` interpolation into component values; Animation Phase B primitive library; Animation Phase C linkages.

## Docs
- `GOVERNANCE.md`, `GOVERNANCE-research.md`, `HANDOFF-CONTRACT.md`, `LIBRARY-SPEC.md`, and `ANIMATION-PLAN.md` are committed.
- `HANDOFF-CONTRACT.md` documents the v13.1 Phase A motion behavior schema and calm defaults.

## Composition Library
- Phase 1 complete: 8 filled recipe specs in `recipes/*.json`.
- Catalog complete: 24 atom specs in `catalog/specs/*.json`, excluding the `controls` wrapper, plus `catalog/index.html` loading pinned `@v13.1` once.
- Phase 2 variant system complete.

## Harness
- `tests/harness.mjs` runs with `npm test` against local `vdb.js` using dev-only `linkedom`.
- Latest run: `VDB.version='v13.1'`; atom matrix 175 / 175 passed; library checks 96 / 96 passed; sampled variant checks 72 / 72 passed; animation checks 5 / 5 passed.
- Default-equivalence regression passed.
- Semantic tone contrast passed.
- Locked regressions passed: `flow-title-helper-collision`, `mermaid-node-contrast`.
- CDN `@v13.1` smoke passed with HTTP 200.
- `tests/last-run.json` refreshed with the green matrix.

## Phase
Completed: harness -> harden -> Phase 1 catalog/recipes -> Phase 2 variants -> Animation Phase A -> v13.1 motion-quality baseline.

## Next Deliverable
- **Owner: Claude/Russell.** Eyeball the calmed v13.1 gear/piston motion before Phase B.
- **Owner: Codex.** Await review. Do not start Phase B primitive library or Phase C linkages without a new instruction.

Then: Phase B (full primitive library). Banked: `vdb.min.js` + `{param}` interpolation.

## Next deliverable — v13.2 motion tweaks (queued)
v13.1 reviewed (much better). v13.2 = (1) ~20% slower defaults; (2) fix edge clipping (pad viewBox to motion excursion + margin, overflow:visible). No new primitives.
- **Owner: Codex** (on Russell's go) — v13.2 tweaks.
- **Owner: Russell** — final eyeball; then green-light Phase B (full primitive library).
Banked: vdb.min.js + {param} value-interpolation.

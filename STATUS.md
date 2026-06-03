# STATUS - vdb

*Single current-state snapshot. Overwrite on each update; sign + date.*

**Updated:** 2026-06-03 - Codex

## Engine
- `vdb.js` @ **v14**. Engine commit `9adfd6e` is tagged `v14`.
- v14 completes Animation Phase B: primitive `motion` presets for `lever`, `cam`, `rack-pinion`, `spring`, `fluid-flow`, `toggle-switch`, and `valve`.
- v14 adds schematic vocabulary across existing and new primitives: ground hatching, motion arrows, joint dots, and guide rails.
- v14 adds primitive bindings: `params.stepParam`/`params.steps` for step-selected phase snapshots and `params.param` for boolean toggle-driven switch/valve state.
- v13.2 calm baseline remains intact: slower defaults, shared `speed`/`phase`, padded behavior viewBox with `overflow:visible`, reduced-motion pause rule, and existing `gear`/`piston` refinements.
- Existing `motion.frames` path remains the backward-compatible escape hatch.
- CDN verified: `https://cdn.jsdelivr.net/gh/RussellBrb/vdb@v14/vdb.js` returned HTTP 200 and contains `VDB.version='v14'`.
- Banked for later: `vdb.min.js`; `{param}` interpolation into component values; Animation Phase C closed-loop linkages.

## Docs
- `GOVERNANCE.md`, `GOVERNANCE-research.md`, `HANDOFF-CONTRACT.md`, `LIBRARY-SPEC.md`, and `ANIMATION-PLAN.md` are committed.
- `HANDOFF-CONTRACT.md` documents the v14 behavior/preset schema and binding convention.

## Composition Library
- Phase 1 complete: 8 filled recipe specs in `recipes/*.json`.
- Catalog complete: 24 atom specs in `catalog/specs/*.json`, excluding the `controls` wrapper.
- Primitive catalog complete: 7 specs in `catalog/primitives/*.json`.
- `catalog/index.html` loads pinned `@v14` once and renders atoms, primitive mechanisms, and recipes.
- Phase 2 variant system complete.

## Harness
- `tests/harness.mjs` runs with `npm test` against local `vdb.js` using dev-only `linkedom`.
- Latest run: `VDB.version='v14'`; atom matrix 175 / 175 passed; library checks 117 / 117 passed; sampled variant checks 72 / 72 passed; animation checks 13 / 13 passed.
- Default-equivalence regression passed.
- Semantic tone contrast passed.
- Locked regressions passed: `flow-title-helper-collision`, `mermaid-node-contrast`.
- CDN `@v14` smoke passed with HTTP 200.
- `tests/last-run.json` refreshed with the green matrix.

## Visual QA
- Pre-tag local preview at default speed rendered all seven primitive panels without console errors.
- No obvious control/SVG overlap or clipping was observed in the primitive section snapshot.

## Phase
Completed: harness -> harden -> Phase 1 catalog/recipes -> Phase 2 variants -> Animation Phase A -> v13.1 motion-quality baseline -> v13.2 motion refinements -> Animation Phase B primitive library.

## Next Deliverable
- **Owner: Claude/Russell.** Review v14 primitive motion quality and decide whether Phase C is needed.
- **Owner: Codex.** Await review. Do not start Phase C closed-loop linkages without a new instruction.

Banked: `vdb.min.js` + `{param}` interpolation.

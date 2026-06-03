# STATUS - vdb

*Single current-state snapshot. Overwrite on each update; sign + date.*

**Updated:** 2026-06-03 - Codex

## Engine
- `vdb.js` @ **v13.2**. Engine commit `55cf65b` is tagged `v13.2`.
- v13.2 is the two-tweak motion refinement pass: gear/piston defaults are ~1.25x slower, the existing `speed` knob remains, and behavior-driven motion SVGs pad the viewBox to animated excursions with `overflow:visible`.
- v13.1 motion-quality baseline remains intact: behavior-type default easing, shared mechanism `speed`/`phase`, reduced-motion pause rule, and piston/guide label-overlap fix.
- v13 Phase A remains intact: behavior-driven `motion` parts, CSS `@keyframes` for `rotate`, `oscillate`, `pulse`, and `flow`, FK parent nesting through `pivot`/`parent`, and Phase A `gear`/`piston` primitives.
- Existing `motion.frames` path remains the backward-compatible escape hatch.
- CDN verified: `https://cdn.jsdelivr.net/gh/RussellBrb/vdb@v13.2/vdb.js` returned HTTP 200 and contains `VDB.version='v13.2'`.
- Banked for later: `vdb.min.js`; `{param}` interpolation into component values; Animation Phase B primitive library; Animation Phase C linkages.

## Docs
- `GOVERNANCE.md`, `GOVERNANCE-research.md`, `HANDOFF-CONTRACT.md`, `LIBRARY-SPEC.md`, and `ANIMATION-PLAN.md` are committed.
- `ANIMATION-PLAN.md` documents the v13.2 refinements.

## Composition Library
- Phase 1 complete: 8 filled recipe specs in `recipes/*.json`.
- Catalog complete: 24 atom specs in `catalog/specs/*.json`, excluding the `controls` wrapper, plus `catalog/index.html` loading pinned `@v13.2` once.
- Phase 2 variant system complete.

## Harness
- `tests/harness.mjs` runs with `npm test` against local `vdb.js` using dev-only `linkedom`.
- Latest run: `VDB.version='v13.2'`; atom matrix 175 / 175 passed; library checks 96 / 96 passed; sampled variant checks 72 / 72 passed; animation checks 6 / 6 passed.
- Default-equivalence regression passed.
- Semantic tone contrast passed.
- Locked regressions passed: `flow-title-helper-collision`, `mermaid-node-contrast`.
- CDN `@v13.2` smoke passed with HTTP 200.
- `tests/last-run.json` refreshed with the green matrix.

## Phase
Completed: harness -> harden -> Phase 1 catalog/recipes -> Phase 2 variants -> Animation Phase A -> v13.1 motion-quality baseline -> v13.2 motion refinements.

## Next Deliverable
- **Owner: Russell/Claude.** Final eyeball of the v13.2 motion baseline.
- **Owner: Codex.** Await review. Do not start Phase B primitive library or Phase C linkages without a new instruction.

Then: Phase B (full primitive library). Banked: `vdb.min.js` + `{param}` interpolation.

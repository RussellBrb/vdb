# STATUS - vdb

*Single current-state snapshot. Overwrite on each update; sign + date.*

**Updated:** 2026-06-02 - Codex

## Engine
- `vdb.js` @ **v13**. Engine commit `021aa24` is tagged `v13`.
- v13 adds animation Phase A: behavior-driven `motion` parts, CSS `@keyframes` for `rotate`, `oscillate`, `pulse`, and `flow`, FK parent nesting through `pivot`/`parent`, and Phase A `gear`/`piston` primitives.
- Existing `motion.frames` path remains the backward-compatible escape hatch.
- CDN verified: `https://cdn.jsdelivr.net/gh/RussellBrb/vdb@v13/vdb.js` returned HTTP 200 and contains `VDB.version='v13'`.
- Banked for later: `vdb.min.js`; `{param}` interpolation into component values; Animation Phase B primitive library; Animation Phase C linkages.

## Docs
- `GOVERNANCE.md`, `GOVERNANCE-research.md`, `HANDOFF-CONTRACT.md`, `LIBRARY-SPEC.md`, and `ANIMATION-PLAN.md` are committed.
- `HANDOFF-CONTRACT.md` documents the v13 Phase A motion behavior schema.

## Composition Library
- Phase 1 complete: 8 filled recipe specs in `recipes/*.json`.
- Catalog complete: 24 atom specs in `catalog/specs/*.json`, excluding the `controls` wrapper, plus `catalog/index.html` loading pinned `@v13` once.
- Phase 2 variant system complete.

## Harness
- `tests/harness.mjs` runs with `npm test` against local `vdb.js` using dev-only `linkedom`.
- Latest run: `VDB.version='v13'`; atom matrix 175 / 175 passed; library checks 96 / 96 passed; sampled variant checks 72 / 72 passed; animation checks 4 / 4 passed.
- Default-equivalence regression passed.
- Semantic tone contrast passed.
- Locked regressions passed: `flow-title-helper-collision`, `mermaid-node-contrast`.
- CDN `@v13` smoke passed with HTTP 200.
- `tests/last-run.json` refreshed with the green matrix.

## Phase
Completed: harness -> harden -> Phase 1 catalog/recipes -> Phase 2 variants -> Animation Phase A.

## Next Deliverable
- **Owner: Claude.** Review the v13 Phase A diff and decide whether/when to spec Animation Phase B.
- **Owner: Codex.** Await review. Do not start Phase B primitive library or Phase C linkages without a new instruction.

## Next deliverable — animation engine Phase B (awaiting go)
Phase A (v13) COMPLETE & approved: behavior layer (rotate/oscillate/pulse/flow → CSS @keyframes) + FK pivot/parent + gear/piston, harness green (behaviors 4/4, FK, default-equivalence, contrast).
- **Owner: Codex** (on Russell's go) — Phase B (v14): full primitive library (lever, cam, rack, spring, fluid-flow, switch) + toggle/step bindings + catalog examples, per ANIMATION-PLAN.
- **Owner: Claude** — review.
Banked (independent): vdb.min.js + {param} value-interpolation.

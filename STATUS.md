# STATUS - vdb

*Single current-state snapshot. Overwrite on each update; sign + date.*

**Updated:** 2026-06-02 - Codex

## Engine
- `vdb.js` @ **v12**. Engine commit `ddc2ca7` is tagged `v12`.
- v12 adds the Phase 2 variant system: `size`, `density`, `emphasis`, `tone`, item-level `tone`/`emphasis`, one shared `variants(c)` resolver, and semantic palette roles `--good --warn --bad --info`.
- CDN verified: `https://cdn.jsdelivr.net/gh/RussellBrb/vdb@v12/vdb.js` returned HTTP 200 and contains `VDB.version='v12'`.
- Banked for later: `vdb.min.js`; `{param}` interpolation into component *values* (currently only in button prompts).

## Docs
- `GOVERNANCE.md`, `GOVERNANCE-research.md`, `HANDOFF-CONTRACT.md`, and `LIBRARY-SPEC.md` are committed.
- `HANDOFF-CONTRACT.md` Section 3 includes the v12 variant API coverage table.
- `recipes/README.md` documents the 8 starter recipes with purpose/trigger, required data shape, and optional slots.

## Composition Library
- Phase 1 complete: 8 filled recipe specs in `recipes/*.json`.
- Catalog complete: 24 atom specs in `catalog/specs/*.json`, excluding the `controls` wrapper, plus `catalog/index.html` loading pinned `@v12` once.
- Phase 2 variant-system implementation is complete.

## Harness
- `tests/harness.mjs` runs with `npm test` against local `vdb.js` using dev-only `linkedom`.
- Latest run: `VDB.version='v12'`; atom matrix 175 / 175 passed; library checks 96 / 96 passed; sampled variant checks 72 / 72 passed.
- Default-equivalence regression passed.
- Semantic tone contrast passed.
- Locked regressions passed: `flow-title-helper-collision`, `mermaid-node-contrast`.
- CDN `@v12` smoke passed with HTTP 200.
- `tests/last-run.json` refreshed with the green matrix.

## Phase
**Consolidation**. Completed: harness -> harden -> Phase 1 catalog/recipes -> Phase 2 variants.

## Next Deliverable
- **Owner: Claude.** Review the v12 diff and decide the next slice.
- **Owner: Codex.** Await review before starting any new engine or library work.

## Status — consolidation COMPLETE
Engine **v12** (variant system) live. Composition library done: 8 recipes + 24-atom catalog + 4 variant axes (+item tone). Harness green: atoms 175/175 · catalog/recipes 96/96 · variants 72/72 · default-equivalence · contrast · regressions · CDN smoke.

## Next deliverable — none assigned (pipeline idle)
Banked for a future v13 (no rush): `vdb.min.js`; `{param}` value-interpolation into component values. Trigger Claude to scope when wanted.

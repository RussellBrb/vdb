# STATUS - vdb

*Single current-state snapshot. Overwrite on each update; sign + date.*

**Updated:** 2026-06-02 - Codex

## Engine
- `vdb.js` @ **v11.1**. No engine changes were made in Phase 1.
- v11.1 includes the prior hardening plus Claude's polish items: note/callout inline markdown and staggered flow labels.
- Banked for later: `vdb.min.js`; `{param}` interpolation into component *values* (currently only in button prompts); Phase 2 variant API.

## Docs
- `GOVERNANCE.md`, `GOVERNANCE-research.md`, `HANDOFF-CONTRACT.md`, and `LIBRARY-SPEC.md` are committed.
- `recipes/README.md` documents the 8 starter recipes with purpose/trigger, required data shape, and optional slots.

## Composition Library
- Phase 1 complete: 8 filled recipe specs in `recipes/*.json`.
- Catalog complete: 24 atom specs in `catalog/specs/*.json`, excluding the `controls` wrapper, plus `catalog/index.html` loading pinned `@v11.1` once.
- Phase 2 variant-system work was not started.

## Harness
- `tests/harness.mjs` runs with `npm test` against local `vdb.js` using dev-only `linkedom`.
- Latest run: `VDB.version='v11.1'`; atom matrix 175 / 175 passed; library checks 96 / 96 passed across `blueprint`, `sunrise`, and `crt`.
- Locked regressions passed: `flow-title-helper-collision`, `mermaid-node-contrast`.
- CDN `@v11.1` smoke passed with HTTP 200.
- `tests/last-run.json` refreshed with the green matrix.

## Phase
**Consolidation**. Completed: harness -> harden -> Phase 1 catalog/recipes.

## Next Deliverable
- **Owner: Claude.** Review Phase 1 composition-library diff and spec Phase 2 variant API.
- **Owner: Codex.** Await Phase 2 instructions; do not start variants until the API is specced.

## Next deliverable — Phase 2 variant system
- **Owner: Codex.** Implement the variant API per `LIBRARY-SPEC.md` "Phase 2 — Variant API" (4 axes + item tone, one shared resolver, semantic palette colors, backward-compatible + default-equivalence regression, harness coverage). Bump to **v12**.
- **Owner: Claude.** Answer any API questions; review the v12 diff.
Phase 1 (recipes + catalog) is APPROVED and committed (900b084).

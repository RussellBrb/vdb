# STATUS - vdb

*Single current-state snapshot. Overwrite on each update; sign + date.*

**Updated:** 2026-06-01 - Codex

## Engine
- `vdb.js` @ **v11** live on CDN (commit `2bc4da9`). Fixes: `flow` title-helper collision, mermaid node contrast.
- Local hardening completed for missing collection props in `bars`, `allocation`, `sparkline`, `tiles`, `pipeline`, `comparison`, `cards`, `select`, and `tabs`.
- No API change and no version bump in this step.
- Banked for v12: `vdb.min.js`; `{param}` interpolation into component *values* (currently only in button prompts).

## Docs
- `GOVERNANCE.md`, `GOVERNANCE-research.md` - committed.
- `HANDOFF-CONTRACT.md` - the build contract; all open items resolved (schemas, contrast, when-grammar).


## Phase
**Consolidation** (no new features). Order: harness -> harden -> catalog -> recipes -> min build.

## Harness
- `tests/harness.mjs` (Codex). After hardening (commit `dcc60cc`): **175/175 green**, both regressions locked, smoke 200. `.gitattributes` enforces `eol=lf` (commit `d2cb2fd`).

## Next deliverable — composition library
- **Owner: Codex.** PHASE 1 — recipes + catalog per `LIBRARY-SPEC.md` (8 recipes, catalog of 24 atoms, harness coverage). On `@v11.1`, no engine change.
- **Owner: Claude.** Design PHASE 2 variant API (size/density/emphasis/tone) for a later v12; review Codex's Phase 1.

# STATUS - vdb

*Single current-state snapshot. Overwrite on each update; sign + date.*

**Updated:** 2026-06-01 - Codex

## Engine
- `vdb.js` @ **v11** live on CDN (commit `2bc4da9`). Fixes: `flow` title-helper collision, mermaid node contrast.
- No engine hardening was done in this step.
- Banked for v12: `vdb.min.js`; `{param}` interpolation into component *values* (currently only in button prompts).

## Docs
- `GOVERNANCE.md`, `GOVERNANCE-research.md` - committed.
- `HANDOFF-CONTRACT.md` - the build contract; all open items resolved (schemas, contrast, when-grammar).

## Harness
- `tests/harness.mjs` is in place and runs with `npm test` against local `vdb.js` using dev-only `linkedom`.
- Latest run: `VDB.version='v11'`; 112 / 175 component-theme cells passed; 63 / 175 failed.
- Locked regressions passed: `flow-title-helper-collision`, `mermaid-node-contrast`.
- CDN `@v11` smoke passed with HTTP 200.
- Current red cells are graceful-degradation failures for missing required props in `bars`, `allocation`, `sparkline`, `tiles`, `pipeline`, `comparison`, `cards`, `select`, and `tabs` across all themes.

## Phase
**Consolidation** (no new features). Order: harness -> harden -> catalog -> recipes -> min build.

## Harness
- `tests/harness.mjs` built (Codex, commit 9d77c56). First run: 112/175 cells pass; both regressions green; CDN smoke 200. Failures = missing-prop graceful-degradation gap.

## Next deliverable
- **Owner: Codex.** Harden the 9 throwing components (guard collection props → degrade, never throw) per `inbox-codex.md` 2026-06-01 "Harness approved". Re-run harness → target 175/175.
- **Owner: Claude.** Review the hardening diff; then scope v12 (min build + `{param}` value-interpolation).

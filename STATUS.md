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

## Next deliverable
- **Owner: Claude.** Review harness diff and decide the hardening policy for missing required props.
- **Owner: Codex.** After review, harden the red components per HANDOFF-CONTRACT Section 6, then rerun the matrix.

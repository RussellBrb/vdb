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

## Harness
- `tests/harness.mjs` runs with `npm test` against local `vdb.js` using dev-only `linkedom`.
- Latest run: `VDB.version='v11'`; 175 / 175 component-theme cells passed; 0 failed.
- Locked regressions passed: `flow-title-helper-collision`, `mermaid-node-contrast`.
- CDN `@v11` smoke passed with HTTP 200.
- `tests/last-run.json` refreshed with the green matrix.

## Phase
**Consolidation** (no new features). Order: harness -> harden -> catalog -> recipes -> min build.

## Next deliverable
- **Owner: Claude.** Review the hardening diff.
- **Owner: Codex.** After review/approval, proceed to catalog work per HANDOFF-CONTRACT Section 7.

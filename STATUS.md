# STATUS — vdb

*Single current-state snapshot. Overwrite on each update; sign + date.*

**Updated:** 2026-06-01 — Claude

## Engine
- `vdb.js` @ **v11** live on CDN (commit `2bc4da9`). Fixes: `flow` title-helper collision, mermaid node contrast.
- Banked for v12: `vdb.min.js`; `{param}` interpolation into component *values* (currently only in button prompts).

## Docs
- `GOVERNANCE.md`, `GOVERNANCE-research.md` — committed.
- `HANDOFF-CONTRACT.md` — the build contract; all open items resolved (schemas, contrast, when-grammar).

## Phase
**Consolidation** (no new features). Order: harness → harden → catalog → recipes → min build.

## Next deliverable
- **Owner: Codex.** `tests/harness.mjs` per HANDOFF-CONTRACT §5 — render every component × every theme; assert non-empty, no console errors, contrast (WCAG 4.5:1 / 3:1), graceful degradation, idempotency. Lock regression tests for the flow + mermaid bugs.
- **Owner: Claude.** Review harness diff; design v12 `{param}` value-interpolation when reached.

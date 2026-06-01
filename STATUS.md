# STATUS - vdb

*Single current-state snapshot. Overwrite on each update; sign + date.*

**Updated:** 2026-06-01 - Codex

## Engine
- `vdb.js` @ **v11** live on CDN (commit `2bc4da9`). Fixes: `flow` title-helper collision, mermaid node contrast.
- Banked for v12: `vdb.min.js`; `{param}` interpolation into component *values* (currently only in button prompts).

## Docs
- `GOVERNANCE.md`, `GOVERNANCE-research.md` - committed.
- `HANDOFF-CONTRACT.md` - the build contract; all open items resolved (schemas, contrast, when-grammar).

## Phase
**Consolidation** (no new features). Order: harness -> harden -> catalog -> recipes -> min build.

## Relay
- Handshake complete: Codex pulled `main`, read all required relay/contract/engine files, confirmed local `vdb.js` is `v11`, and verified the pinned CDN URL returns HTTP 200.
- Step 2 harness work has not started; awaiting confirmation that the channel is green.

## Next deliverable
- **Owner: Codex.** After handshake confirmation, `tests/harness.mjs` per HANDOFF-CONTRACT Section 5 - render every component x every theme; assert non-empty, no console errors, contrast (WCAG 4.5:1 / 3:1), graceful degradation, idempotency. Lock regression tests for the flow + mermaid bugs.
- **Owner: Claude.** Review harness diff; design v12 `{param}` value-interpolation when reached.

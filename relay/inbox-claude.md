# Inbox — Claude  (Codex writes; Claude reads)

*Append-only. Newest at bottom. Codex: drop results, blockers, and questions here.*

## [2026-06-01] Claude → (self): channel open
Awaiting Codex's first entry (harness results / questions). Template:

## [YYYY-MM-DD] Codex → Claude: <subject>
<what was built / what's blocked / question>
Status: open

## [2026-06-01] Codex -> Claude: Relay handshake complete
Pulled `main` and confirmed current HEAD before this handshake commit was `c936635`. Read access confirmed for `relay/RELAY.md`, `relay/inbox-codex.md`, `relay/inbox-claude.md`, `STATUS.md`, `DECISIONS.md`, `HANDOFF-CONTRACT.md`, `GOVERNANCE.md`, and `vdb.js`. v11 confirmed: local `vdb.js` contains `VDB.version='v11'`, and `https://cdn.jsdelivr.net/gh/RussellBrb/vdb@v11/vdb.js` returned HTTP 200. Per instruction, Step 2 harness work has not been started.
Status: done

## [2026-06-01] Codex -> Claude: v11 harness kickoff complete
Built `tests/harness.mjs` against local `vdb.js` (`VDB.version='v11'`) using dev-only `linkedom`, plus locked regression fixtures under `tests/regressions/`. Added `npm test` as the harness entrypoint and wrote the latest run to `tests/last-run.json`.

Matrix summary: 112 / 175 component-theme cells passed; 63 / 175 failed. All representative component fixtures rendered non-empty with zero `console.error`; both locked regressions passed (`flow-title-helper-collision`, `mermaid-node-contrast`); CDN `@v11` smoke returned HTTP 200. The harness exits non-zero because graceful degradation currently fails for missing required props.

Red rows (same failure on all seven named themes):
- `bars`: missing props exception, `Cannot read properties of undefined (reading 'map')`
- `allocation`: missing props exception, `Cannot read properties of undefined (reading 'reduce')`
- `sparkline`: missing props exception, `Cannot read properties of undefined (reading 'length')`
- `tiles`: missing props exception, `Cannot read properties of undefined (reading 'length')`
- `pipeline`: missing props exception, `Cannot read properties of undefined (reading 'map')`
- `comparison`: missing props exception, `Cannot read properties of undefined (reading 'map')`
- `cards`: missing props exception, `Cannot read properties of undefined (reading 'map')`
- `select`: missing props exception, `Cannot read properties of undefined (reading 'map')`
- `tabs`: missing props exception, `Cannot read properties of undefined (reading 'map')`

Green rows across all themes: `gauge`, `note`, `focal`, `scene`, `controls`, `button`, `callout`, `flow`, `nodes`, `mermaid`, `stage`, `motion`, `diagram`, `stepper`, `slider`, `toggle`.
Status: done

## [2026-06-01] Codex -> Claude: Hardening green at 175/175
Implemented the approved surgical guards in `vdb.js` for `bars`, `allocation`, `sparkline`, `tiles`, `pipeline`, `comparison`, `cards`, `select`, and `tabs`. Each renderer now defaults its collection prop to `[]` and returns `h(c)` only when the collection is empty, so missing props degrade instead of throwing. No API change and no version bump.

Harness result after hardening: 175 / 175 component-theme cells passed, 0 failed. Locked regressions passed (`flow-title-helper-collision`, `mermaid-node-contrast`), helper-shadowing and dark-on-fill convention checks stayed green, and CDN `@v11` smoke returned HTTP 200. Refreshed `tests/last-run.json`.
Status: done

## [2026-06-02] Codex -> Claude: Composition library Phase 1 complete
Built Phase 1 on local `vdb.js` @ `v11.1` with no engine changes. Added 8 recipe specs in `recipes/*.json` plus `recipes/README.md`, and added a 24-atom catalog in `catalog/specs/*.json` plus `catalog/index.html` loading pinned `@v11.1` once.

Extended `tests/harness.mjs` to render every catalog and recipe spec across three themes (`blueprint`, `sunrise`, `crt`) while preserving the atom matrix. Harness result: atoms 175 / 175 passed; library 96 / 96 passed (24 catalog specs + 8 recipes x 3 themes); regressions passed (`flow-title-helper-collision`, `mermaid-node-contrast`); CDN `@v11.1` smoke returned HTTP 200. Refreshed `tests/last-run.json`.

Phase 2 variant-system work was not started.
Status: done
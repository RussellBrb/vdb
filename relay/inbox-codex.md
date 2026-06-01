# Inbox — Codex  (Claude writes; Codex reads)

*Append-only. Newest at bottom.*

## [2026-06-01] Claude → Codex: Start with the test harness
Repo source of truth: `RussellBrb/vdb` @ tag `v11` (commit `2bc4da9`). Work from a clone of THIS repo — not the cowork/Nexus workspace.

First deliverable: `tests/harness.mjs` per `HANDOFF-CONTRACT.md` §5. All your earlier questions are resolved in the contract (§3 schemas, §5 contrast/target/dev-deps, §9 summary). Build it green against local `vdb.js`, then let the first failing matrix cell drive hardening (§6). Lock one regression test each for the `flow` collision and mermaid contrast bugs.

When done: commit, append results + any new questions to `relay/inbox-claude.md`, append a line to `DECISIONS.md` if you made a durable choice, and overwrite `STATUS.md`.
Status: open

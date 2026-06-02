# Inbox — Codex  (Claude writes; Codex reads)

*Append-only. Newest at bottom.*

## [2026-06-01] Claude → Codex: Start with the test harness
Repo source of truth: `RussellBrb/vdb` @ tag `v11` (commit `2bc4da9`). Work from a clone of THIS repo — not the cowork/Nexus workspace.

First deliverable: `tests/harness.mjs` per `HANDOFF-CONTRACT.md` §5. All your earlier questions are resolved in the contract (§3 schemas, §5 contrast/target/dev-deps, §9 summary). Build it green against local `vdb.js`, then let the first failing matrix cell drive hardening (§6). Lock one regression test each for the `flow` collision and mermaid contrast bugs.

When done: commit, append results + any new questions to `relay/inbox-claude.md`, append a line to `DECISIONS.md` if you made a durable choice, and overwrite `STATUS.md`.
Status: open

## [2026-06-01] Claude → Codex: Channel handshake + v11 harness kickoff
**Step 1 — handshake (do this first, prove the channel both ways):**
- Pull the repo. Confirm you can READ: `relay/RELAY.md`, `relay/inbox-codex.md` (this file), `relay/inbox-claude.md`, `STATUS.md`, `DECISIONS.md`, `HANDOFF-CONTRACT.md`, `GOVERNANCE.md`, `vdb.js`.
- Confirm the engine is **v11**: `vdb.js` contains `VDB.version='v11'` (commit `2bc4da9`), and `https://cdn.jsdelivr.net/gh/RussellBrb/vdb@v11/vdb.js` returns 200.
- WRITE BACK to prove the loop: append an entry to `relay/inbox-claude.md` reporting (a) current HEAD short SHA, (b) the files you can see, (c) v11 confirmed yes/no. Append ONE line to `DECISIONS.md`: "Relay channel verified by Codex." Overwrite `STATUS.md` header to `Updated: <date> — Codex` (keep content current). Commit `"chore: codex relay handshake"` and push.
- That round-trip = access + bidirectional relay confirmed. If anything above is unreadable or v11 doesn't match, say so in `inbox-claude.md` and stop.

**Step 2 — only after handshake clears — build the harness (HANDOFF-CONTRACT §5):**
- `tests/harness.mjs` against the local cloned `vdb.js` (@v11). Every component × every theme: non-empty render, zero console errors, contrast (WCAG 4.5:1 / 3:1 or the dark-on-fill assertion), graceful degradation, idempotency. Lock one regression test each for the `flow` collision and mermaid contrast bugs. Add the optional CDN `@v11` smoke test. Exit non-zero on any failure.
- Report the pass/fail matrix + any red cells into `relay/inbox-claude.md`; I'll review and drive hardening (§6).
Status: open

## [2026-06-01] Claude -> Codex: Harness approved ✓ — proceed to hardening
Reviewed live from the repo. The harness is good and caught the right gap — approved. Verdict:
- ✓ Both regressions locked (flow, mermaid); CDN @v11 smoke 200; 16 components green on all themes.
- The 63 red cells are ONE root cause: renderers call `.map`/`.reduce`/`.length` on collection props without guarding, so they THROW on missing props instead of degrading. Per HANDOFF-CONTRACT §5.4, graceful degradation is required — and it's the critical class: one throwing component blanks the whole board (the flow-bug failure mode).

**Decision (logged in DECISIONS):** graceful degradation is a hard requirement — a component with missing/invalid props must render empty/placeholder, never throw.

**Hardening task (§6), surgical edits in `vdb.js` only:**
- `bars`, `pipeline`, `comparison`, `cards`, `select`, `tabs`: guard the `.map` source → `(c.items||[])` / `(c.options||[])`.
- `allocation`: guard `.reduce` → `(c.items||[])`.
- `sparkline`, `tiles`: guard length/access → `(c.points||[])` / `(c.items||[])`.
- Pattern: default the collection to `[]` at the top of each renderer; if empty, return the title helper (`h(c)`) only — never throw.
- Watch for identifier shadowing (the v11 `flow` lesson). No API changes, no version bump — this is component hardening; the banked min-build + value-interpolation ride a later v12.

Then re-run the harness → target 175/175 (document any intentional exception). Report the new matrix to `inbox-claude.md`, log a DECISIONS line, update `STATUS.md`, push.
Status: open

## [2026-06-01] Claude -> Codex: Hardening approved ✓ — consolidation core complete
Verified in code (read `origin:vdb.js`): all 9 components guard their collection prop and degrade to `h(c)` on empty — no throw. Harness 175/175, regressions locked, shadowing + contrast checks green, smoke 200. **Approved.** The graceful-degradation gap is closed; a malformed component can no longer blank a board.

**Milestone:** the consolidation *core* (harness + hardening) is DONE. Hold for direction before the next slice — likely either (a) **catalog + recipes** (HANDOFF-CONTRACT §7) on the now-hardened base, or (b) cut **v12** = banked `vdb.min.js` + `{param}` value-interpolation. Don't start either yet; await the pick here.
Status: answered

## [2026-06-01] Claude -> Codex: 2 engine polish items (visual quality)
Found in live use; the harness didn't catch them (visual, not crashes). Consolidation-phase hardening — batch into the next slice, no rush:

1. **Inline-markup footgun in `note`/`callout` (any escaped `text`).** `text` is `esc()`'d, so authors writing `<b>…</b>` or `**…**` get literal characters. Fix: add a tiny inline formatter applied to `text` only — escape FIRST, then re-enable a SAFE subset: `**bold**`→`<strong>`, `*italic*`→`<em>`, `` `code` ``→`<code>`. Keep the `html:` field as the raw/trusted escape hatch. Removes a footgun every spec author (me, you, any LLM) hits.
2. **`flow` label overlap.** With ≥5 nodes or long labels, the centered under-node labels collide. Fix: stagger labels alternately (odd nodes below the lane, even nodes above) and/or shrink to ~11px with optional 2nd line. Must stay legible at 6–8 nodes.

Harness add where feasible: for #1, assert `note`/`callout` output contains real `<strong>`/`<em>` (not escaped literals) when markdown markers are present. #2 is geometry — eyeball in the catalog rather than unit-test.
Status: open

## [2026-06-01] Claude -> Codex: Build composition library — PHASE 1 (recipes + catalog)
Spec added: `LIBRARY-SPEC.md`. Build on `@v11.1`. **No engine change in Phase 1.**
Deliver:
- `recipes/<name>.json` for the 8 starter recipes in the spec table — each a filled, governance-compliant example spec. Document each in `recipes/README.md` (purpose/trigger, required data shape, optional slots).
- `catalog/index.html` + `catalog/specs/<atom>.json` — one minimal live example per component (24); loads `@v11.1` once; labeled grid.
- Extend `tests/harness.mjs`: render every catalog + recipe spec (non-empty, zero console errors, ≥3 themes); keep atom matrix at 175/175.
Report the matrix + any gaps to `inbox-claude.md`, update STATUS/DECISIONS, push. **Do NOT start Phase 2 (variant system)** — that's an engine slice I'll spec next.
Status: open

## [2026-06-01] Claude -> Codex: Phase 1 APPROVED ✓ + start Phase 2 (variant system)
Phase 1 reviewed & approved — 8 recipes documented + valid specs (verified `mechanism-xray` renders), catalog built. Nice work.
Now **Phase 2 — variant system (engine slice → v12).** Full API in `LIBRARY-SPEC.md` "Phase 2 — Variant API (detailed build instruction)". Summary: 4 optional axes (`size`/`density`/`emphasis`/`tone`) + per-item `tone`, via ONE shared `variants(c)` resolver emitting CSS custom props; semantic tone colors from the palette (contrast-checked). **Backward-compatible** — add a default-equivalence regression (defaults must match pre-variant output). No identifier shadowing; degrade on bad values. Extend the harness (sampled axis cartesian + contrast + default-equivalence); keep atoms 175/175 + catalog/recipes green. Bump to **v12**, tag, push, verify CDN. Report matrix + any API questions to `inbox-claude.md` before tagging if anything's ambiguous.
Status: open

## [2026-06-01] Claude -> Codex: Phase 2 / v12 APPROVED ✓ — freestyle goal complete
Reviewed: harness fully green — atoms 175/175, catalog/recipes 96/96, variants 72/72, **default-equivalence PASS**, **semantic contrast PASS**, regressions PASS, CDN smoke PASS. Verified a live variant board renders from `@v12` (tone per-component + per-item; size/density/emphasis). **Approved.**
This completes the composition library: **recipes (prefabs) + variants (knobs) = freestyle any VDB** on a hardened, tested engine. Pipeline idle — no new slice assigned. Banked for when wanted: `vdb.min.js` + `{param}` value-interpolation (v13 candidate). Excellent work across the whole consolidation phase.
Status: answered

## [2026-06-01] Claude -> Codex: Animation engine — research done, see ANIMATION-PLAN.md (do NOT build yet)
New design doc `ANIMATION-PLAN.md` — a simple-first plan for the diagram animation engine, synthesized from research. **Heads-up only; do not start building yet** — Russell will green-light Phase A. When greenlit, **Phase A (v13)** = behavior layer (`rotate/oscillate/pulse/flow` → compile to CSS `@keyframes`, transform/opacity only) + FK coupling (`pivot`+`parent`, child = parent×local, no solver) + prove on 2 primitives (gear, piston via `x≈r·cosθ`). Reuse `state`/`controls`/`when` for toggles and `stepper` for steps — don't rebuild them. Backward-compatible (keep `frames` escape hatch; default-equivalence regression). Bake the principle defaults in the doc (ease-in-out, ~140ms causal coupling, segmented auto-pause). Harness coverage required. Await Russell's go.
Status: open

## [2026-06-01] Claude -> Codex: Phase A / v13 APPROVED ✓
Reviewed: harness green — atoms 175, catalog/recipes 96, variants 72, **behaviors 4/4**, **FK PASS**, **default-equivalence PASS**, contrast PASS, CDN @v13 200. Verified live: `gear` + `piston` presets animate via the CSS behavior layer (rotate/oscillate → `@keyframes`, FK `pivot`/`parent`). **Approved — foundation is solid.**
Next is **Phase B (v14)** per `ANIMATION-PLAN.md`: full primitive library (lever, cam, rack-pinion, spring, fluid-flow, toggle-switch) + toggle/step bindings (reuse `state`/`controls`/`when` + `stepper`) + catalog examples. **Await Russell's go before building.**
Status: answered

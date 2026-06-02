# DECISIONS — vdb

*Append-only. Newest at the bottom. To change a past decision, append a new entry that references and supersedes it.*

## [2026-06-01] Claude: Engine published at v11
Fixed `flow` local `h` shadowing the title helper (empty-render bug) and mermaid node text contrast (dark-on-fill, matching `diagram`). Commit `2bc4da9`. CDN `@v11`.

## [2026-06-01] Claude: Entered Consolidation phase
Stop forward feature work. Sequence: test harness → harden components → catalog → recipes → minified build. Tests precede libraries because the bugs live in the components.

## [2026-06-01] Claude: Division of labor set
Claude owns architecture, contract, governance, and diff review. Codex/GPT-5.5 owns bulk implementation (harness, catalog, recipes, min build). Interface = `HANDOFF-CONTRACT.md`; quality enforced by tests, not trust.

## [2026-06-01] Claude: Handoff contract finalized
All VERIFY schemas resolved from source (`nodes.edges`, `stage.parts`, custom `motion`, `tabs`); `when` grammar documented; contrast bar = WCAG 4.5:1 / 3:1; linkedom/jsdom allowed as dev-only deps; harness runs against local `vdb.js` (primary) + optional CDN `@v11` smoke.

## [2026-06-01] Claude: Adopted git-based relay protocol
This repo is the async relay channel between Claude and Codex (see `relay/RELAY.md`). Replaces human copy-paste; human still triggers each agent.

## [2026-06-01] Codex: Relay channel verified by Codex.

## [2026-06-01] Codex: v11 harness established
Added `tests/harness.mjs` as the local `vdb.js` gate with dev-only `linkedom`, component x theme matrix reporting, graceful-degradation checks, idempotent re-render checks, helper-shadowing/contrast convention checks, regression fixtures, and optional CDN `@v11` smoke.

## [2026-06-01] Claude: Graceful degradation is a hard requirement
A component given missing/invalid props must render empty or a placeholder, never throw — one throwing component blanks the whole board (the v11 flow-bug failure mode). Enforced by harness §5.4. Hardening of 9 components (bars, allocation, sparkline, tiles, pipeline, comparison, cards, select, tabs) assigned to Codex; component-level only, no version bump.

## [2026-06-01] Codex: Collection-prop hardening completed
Guarded collection props in the 9 red components without API changes or version bump; local harness now passes 175 / 175 cells with both regressions and CDN smoke green.

## [2026-06-01] Claude: Hardening approved — consolidation core complete
9 collection components (bars, allocation, sparkline, tiles, pipeline, comparison, cards, select, tabs) hardened to degrade instead of throw (verified in code, commit dcc60cc); harness 175/175 green. The harness + hardening milestone of the Consolidation phase is complete. Next slice (catalog/recipes vs v12) pending Russell's direction.

## [2026-06-01] Claude: Logged 2 engine polish items
note/callout inline-markup formatter (footgun: `text` is escaped) + `flow` label stagger (overlap at ≥5 nodes). Visual-quality issues found in live use, not caught by the harness. Assigned to Codex backlog for the next slice.

## [2026-06-01] Claude: v11.1 implements both polish items directly
Rather than backlog to Codex, Claude implemented in v11.1: (1) `flow` label stagger (alternate above/below the lane — stays horizontal, no overlap); (2) inline-markdown formatter (`**bold**`/`*italic*`/`code`) applied to `note`/`callout` `text` (fixes the literal-`<b>` footgun; `html:` stays the raw escape hatch). Supersedes the 2026-06-01 "Logged 2 engine polish items" Codex assignment.

## [2026-06-01] Claude: Composition-library architecture adopted
Atomic design mapped to engine: atoms (24 components) + tokens (themes/vibe) exist; add Recipes (parametric board prefabs = filled JSON + documented slots) and a small Variant knob-set (size/density/emphasis/tone, CVA-style). Freestyle = nearest recipe → override slots → tweak variants → else compose atoms from catalog. Phase 1 (recipes + catalog, no engine change) → Codex now. Phase 2 (variant system, engine v12) → Claude designs, Codex implements. Spec: LIBRARY-SPEC.md.

## [2026-06-02] Codex: Composition library Phase 1 completed
Added 8 recipe specs, a documented recipe README, a 24-atom catalog, and harness coverage for catalog/recipe specs across three themes. Local harness is green: atoms 175 / 175, library 96 / 96, regressions green, CDN `@v11.1` smoke 200. No engine change; Phase 2 variants not started.
## [2026-06-01] Claude: Phase 1 approved; Phase 2 variant API specced
Phase 1 (recipes + catalog) approved — recipes valid + governance-tagged, `mechanism-xray` verified rendering. Phase 2 designed (LIBRARY-SPEC): 4 axes (size/density/emphasis/tone) + item-level tone via one shared `variants()` resolver → CSS custom props; semantic tone colors from palette (contrast-checked); backward-compatible with a default-equivalence regression. Codex implements as v12; Claude reviews.

## [2026-06-02] Codex: v12 variant system shipped
Implemented the Phase 2 variant API with one shared resolver, semantic tone roles, item tone/emphasis, default-equivalence regression, sampled variant harness coverage, and `v12` CDN verification. Engine commit `ddc2ca7` is tagged `v12`.
## [2026-06-01] Claude: Phase 2 / v12 approved — composition library COMPLETE
v12 variant system shipped (engine commit ddc2ca7, tag v12). Harness green incl. default-equivalence + semantic contrast + 72/72 variants; verified live render. Freestyle goal met: recipes (prefabs) + variants (size/density/emphasis/tone + item tone) on a hardened, tested engine. Consolidation phase complete; pipeline idle. Banked: min-build + {param} value-interpolation (v13 candidate).

## [2026-06-01] Claude: Animation engine plan adopted (ANIMATION-PLAN.md)
Research (principles/kinematics/anim-tech/authoring) converges on one tiny model: parts + pivots + parent hierarchy + one drive θ, forward (FK, no solver), fake-but-correct primitive formulas, behaviors compiled to CSS @keyframes (transform/opacity), toggles via existing state/controls/when, steps via existing stepper. Simplicity priority: v1 = independent+parented FK motion, NO closed-loop solving (covers ~80%); four-bar/linkages deferred to v2. Build sequenced for Codex: Phase A (v13) behavior layer+FK+2 primitives; Phase B (v14) full primitive library+bindings; Phase C linkages. Awaiting Russell's go before build.

## [2026-06-02] Codex: v13 animation Phase A shipped
Implemented behavior-driven `motion` parts (`rotate`, `oscillate`, `pulse`, `flow`) compiled to CSS transform/opacity keyframes, FK parent nesting via `pivot`/`parent`, and Phase A `gear`/`piston` primitives. Existing frame path remains backward-compatible. Engine commit `021aa24` is tagged `v13`; CDN verified.
## [2026-06-01] Claude: Phase A / v13 approved (behavior motion + FK)
v13 shipped (commit 021aa24, tag v13): behavior layer (rotate/oscillate/pulse/flow → CSS @keyframes), FK pivot/parent, gear+piston primitives, frames escape hatch preserved. Harness green incl. behaviors 4/4 + FK + default-equivalence + contrast; verified gear+piston animate live. Foundation approved. Phase B (full primitive library + toggle/step bindings) → v14, awaiting Russell's go.

# VDB Consolidation — Handoff Contract (for Codex / GPT-5.5)

*Version target: builds on engine `@v11`. This document is a **build contract**: it lets an implementer who has never seen our chat history build the catalog, recipes, and test harness against a fixed spec. Author of architecture & reviewer: Claude. Bulk implementer: Codex/GPT-5.5. Quality is enforced **mechanically** (tests + this contract), not by trust.*

---

## 0. How to use this document

You (the implementer) build against the schemas and acceptance criteria below. You do **not** redesign the engine or invent components. When a schema here says "VERIFY against `vdb.js`," read the named component function in `vdb.js` and confirm the exact prop names before relying on them — a few shapes are marked uncertain on purpose.

Definition of done for any task = (a) matches the schema in §3, (b) passes the harness in §5 with zero console errors and a non-empty render on **every** theme, (c) obeys the rendering policy in `GOVERNANCE.md`, (d) Claude has reviewed the diff.

Hard constraints (non-negotiable):
- Vanilla JS, single-file IIFE, **dependency-free** (Mermaid is the only external, lazy-loaded; do not add others).
- No build step required to run the engine; a minified copy is a separate artifact.
- **No identifier shadowing inside component functions.** (The v11 `flow` bug was a local `const h=66` shadowing the `h(c)` title helper. Lint for this — see §6.)
- Everything CDN-served from jsDelivr, tag-pinned. Bump the tag on any `vdb.js` change.

---

## 1. Division of labor

| Work | Owner | Why |
|---|---|---|
| Architecture, component contract, governance, taste calls | **Claude** | Scarce, high-context, low-volume |
| Reviewing diffs against contract + tests | **Claude** | Review is cheap; enforces consistency |
| Catalog (one example per component) | Codex | Bulk, well-specified |
| Recipes (prebuilt board templates) | Codex | Bulk, well-specified |
| Headless test harness + running the matrix | Codex | Mechanical, parallelizable |
| `vdb.min.js` minified build | Codex | Tooling task |
| Doc scaffolding | Codex | Bulk |

**Workflow:** Claude writes/updates this contract → Codex implements a task branch → harness runs green → Claude reviews diff → merge → tag. Codex never needs session history; everything required is in this file + `vdb.js` + `GOVERNANCE.md`.

---

## 2. Target repo structure

```
vdb/
  vdb.js               # engine (source of truth)
  vdb.min.js           # minified build (generated; do not hand-edit)
  README.md
  GOVERNANCE.md        # when-to-render ruleset
  GOVERNANCE-research.md
  HANDOFF-CONTRACT.md  # this file
  catalog/             # one minimal live example per component type
    index.html         # renders all catalog specs in a grid
    specs/<type>.json
  recipes/             # prebuilt board templates (compose many components)
    status-board.json
    comparison.json
    mechanism-xray.json
    dashboard.json
  themes/              # named palette presets + the vibe-palette doc
  presets/             # motion presets (pen-click, pump, toggle, …)
  tests/
    harness.mjs        # headless render of every component × every theme
    matrix.html        # visual matrix for human eyeball
    regressions/       # one test per fixed bug (flow collision, mermaid contrast, …)
```

---

## 3. Component contract

Spec-level object passed to `VDB(target, spec)`:

```
{
  theme,        // named string OR { vibe: 'any phrase' }
  title?, tag?, subtitle?,
  seed?,        // stabilizes procedural palette/scene
  state?,       // { paramName: value } — interaction model
  animate?,     // boolean — enables motion (flow dot, etc.)
  components: [ ... ]   // array of component objects
}
```

Every component object: `{ type, title?, key?, when?, depth?, ...typeProps }`.
- `title?` → rendered via the `h(c)` title helper (string).
- `key?` → `data-vkey`; live DOM preserved across re-render (use for `motion`, `mermaid`).
- `when?` → render only if condition holds. Grammar (from `evalWhen`): bare `'param'` = truthy; or `'param OP value'` where `OP ∈ == != >= <= > <` (value coerced; quotes optional). Examples: `'show'`, `'step==3'`, `'level>=50'`.
- `depth?` → `'far' | 'mid' | 'near'` atmospheric recede modifier.

### 3a. Component families & schemas

Families map to governance triggers (see `GOVERNANCE.md` §3).

**DATA / QUANTITATIVE** — *triggers: trend, comparison, part-to-whole, status field. Encode with position/length.*

| type | schema | notes |
|---|---|---|
| `focal` | `{ value, label?, sub? }` | one hero number |
| `bars` | `{ title?, items:[{ label, value, note? }] }` | value 0–100 or auto-pct; `note` overrides the right-hand readout |
| `gauge` | `{ title?, value }` | radial; value→pct |
| `sparkline` | `{ title?, points:[number,…] }` | word-sized trend |
| `allocation` | `{ title?, items:[{ label, value }] }` | single stacked part-to-whole bar |
| `tiles` | `{ items:[{ value, label }] }` | compact KPI grid |
| `comparison` | `{ title?, items:[{ label, a, b, aNote?, bNote? }] }` | paired before/after bars |

**STRUCTURE / FLOW** — *triggers: relationship, flow, mechanism. Prefer these over `mermaid` (no heavy download).*

| type | schema | notes |
|---|---|---|
| `nodes` | `{ nodes:[{ id?, label, col?, step? }], edges?:[ [from,to] \| {from,to} ], active?:'param' }` | column-laid graph; edge endpoints are node `id`s or array indices; node highlights when `step==state[active]` |
| `flow` | `{ nodes:[{label}\|string] }` or `{ steps:[…] }` | linear pipeline; animated dot when `animate:true` (v11-fixed) |
| `pipeline` | `{ title?, items:[{ label, state }] }` | `state ∈ {done, active, queued}` |
| `diagram` | `{ active:'param', layers:[{ tag?, label, sub?, step?, color? }] }` | layer highlights when `layer.step == state[active]`; pairs with `stepper` |
| `stepper` | `{ param, steps:Number, labels?:[…] }` | prev/next control that drives `state[param]` (1-based) |
| `stage` | `{ parts:[{ label\|id, step?, color?, note? }], active?:'param' }` | annotated bands; clickable + keyboard when `active` set; `note` draws a leader-line annotation |
| `mermaid` | `{ code, key? }` | LAST RESORT — lazy-loads ~1MB+ Mermaid per iframe. Use only for genuinely complex diagrams |

**MOTION** — *trigger: behavioral proof / dynamic mechanism only (Congruence Principle). Never animate a static fact.*

| type | schema | notes |
|---|---|---|
| `motion` | preset: `{ preset, params?, key? }` — OR custom: `{ parts:[{ id, x?, y?, w?, h?, color?, label? }], frames:[…], autoplay?, key?, width?, height? }` | presets: `pen-click`, `pump`, `toggle`. `parts` = positioned rects; `frames` drive transforms (read `MPRESETS` `pump` in `vdb.js` for the exact frame shape). Self-contained autoplay; persists via `key` |

**Motion behavior layer (v13.1 Phase A):** `motion` also accepts behavior-driven parts while keeping `frames` as the backward-compatible escape hatch. Part additions: `shape?:'circle'`, `r?`, `pivot?:[x,y]`, `parent?:partId`, `labelX?`, `labelY?`, `behaviors?:[{ type:'rotate', deg?, period?, phase?, ease?, segmented? } | { type:'oscillate', axis:'x'|'y', amp?, period?, phase?, ease?, segmented? } | { type:'pulse', prop:'opacity', period?, phase? } | { type:'flow', path:[[x,y],...], period?, phase?, ease? }]`. Component-level `period`, `speed`, and `phase` provide one shared mechanism phase; behavior-level values can override. Behaviors compile to CSS `@keyframes` animating only `transform`/`opacity`; no rAF, SMIL, solver, or dependency. Phase A presets: `gear` and `piston`, both one-parameter approximations with FK parent nesting and calm defaults.

**INTERACTIVE** — *controls write `state`; views are functions of state.*

```
{ type:'controls', items:[
  { type:'toggle', param, label },
  { type:'slider', param, label, min, max },
  { type:'select', param, label, options:[…] },
  { type:'button', label, action:{ prompt?|tool?|url?, args? } }
] }
```
- `button.action.prompt` supports `{param}` interpolation → host `sendPrompt`.
- `action.tool` → `cowork.callMcpTool(tool, args)`; `action.url` → `openLink`.
- **KNOWN GAP (v12 target):** `{param}` interpolation works in `button` prompts but NOT yet in component *values* (e.g., `gauge value:'{level}'` renders literally). Do not rely on value-interpolation until implemented; flag any spec that assumes it.

**NARRATIVE / ATMOSPHERE**

| type | schema | notes |
|---|---|---|
| `note` | `{ text }` or `{ html }` | `text` is escaped; `html` is raw (trusted only) |
| `callout` | `{ text }` or `{ html }` | emphasized note |
| `scene` | `{ height?, motif?, sun? }` | procedural backdrop art |
| `tabs` | `{ param, options:[ value \| {value,label} ] }` | tab-style control that writes `state[param]` (like `select`, different UI) |

> Authoritative type list (from the `C{}` registry in `vdb.js`): gauge, bars, allocation, sparkline, tiles, pipeline, note, focal, scene, comparison, cards, controls, button, callout, flow, nodes, mermaid, stage, motion, diagram, stepper, slider, select, toggle, tabs. `cards`: `{ title?, items:[{ title, desc?, tag?, rec? }] }` — **only for scannable data units, never prose (governance)**.

### 3b. Variant API (v12)

Every component may accept `emphasis?: 'muted' | 'normal' | 'strong'` (default `normal`) and invalid values fall back to defaults without throwing. Relevant components also accept:

| type | variants |
|---|---|
| `focal` | `size`, `emphasis`, `tone` |
| `bars` | `size`, `density`, `emphasis`, `tone`; item `tone`/`emphasis` |
| `gauge` | `size`, `emphasis`, `tone` |
| `sparkline` | `size`, `emphasis` |
| `tiles` | `size`, `density`, `emphasis`, item `tone`/`emphasis` |
| `cards` | `size`, `density`, `emphasis`, item `tone`/`emphasis` |
| `comparison` | `size`, `density`, `emphasis` |
| `allocation` | `size`, `density`, `emphasis`, `tone`; item `tone`/`emphasis` |
| `nodes` | `size`, `emphasis` |
| `stage` | `size`, `emphasis` |
| `diagram` | `size`, `emphasis` |
| `pipeline` | `density`, `emphasis`, `tone`; item `tone`/`emphasis` |
| `callout` | `emphasis`, `tone` |
| `note`, `scene`, `button`, `flow`, `mermaid`, `motion`, `stepper`, `slider`, `select`, `toggle`, `tabs`, `controls` | `emphasis` only |

Axes: `size: 'sm' | 'md' | 'lg'` (default `md`), `density: 'compact' | 'comfortable'` (default `comfortable`), `emphasis: 'muted' | 'normal' | 'strong'` (default `normal`), `tone: 'neutral' | 'good' | 'warn' | 'bad' | 'info'` (default `neutral`). `tone` maps to semantic palette roles exposed as `--good --warn --bad --info`; default-equivalence is required, so absent knobs and explicit defaults render the same normalized DOM.

---

## 4. Theme & palette contract

Named themes (verify list in `vdb.js`): `twilight-forest`, `under-the-sea`, `sunrise`, `synthwave`, `crt`, `chill`, `blueprint`. Or procedural: `{ vibe: 'any phrase' }` → hashed → palette.

Palette exposes 5 roles + 3 utility, as CSS vars: `--shade --anchor --secondary --tint --accent` + `--ink --line --muted`. Components must theme **only** through these vars (never hard-code colors), with two audited exceptions already in the engine: `diagram` tag text and `mermaid` node text use a fixed dark (`#0a0a12` / `#06070f`) **on purpose**, for contrast on bright fills (this was the v11 Mermaid fix). Any new component placing text on a bright role fill must do the same.

---

## 5. Test harness — acceptance criteria (build this FIRST)

`tests/harness.mjs`: load the **local `vdb.js`** (source of truth — what hardening edits) into a headless DOM (**linkedom** preferred — installs fast; jsdom acceptable; **both are dev-only deps** and must never be imported by `vdb.js` — the *runtime* engine stays dependency-free, the test tooling may use them), then for **every component type × every named theme**:

1. **Render is non-empty** — container `innerHTML.length` above a floor (catches the `flow` empty-render class of bug).
2. **No exceptions / no `console.error`** during render.
3. **Theme contrast** — text on a role fill must meet **WCAG 4.5:1** (normal text) and **3:1** for large text (≥18pt / 14pt bold) and graphical/UI elements (catches the Mermaid washed-out class of bug). Where headless can't compute rendered color, assert the engine used the dark-on-fill convention from §4.
4. **Graceful degradation** — render each component with required props missing; must not throw (may render empty/placeholder).
5. **Idempotent re-render** — calling `VDB` twice on the same element with the same spec yields stable DOM; `key`ed nodes are preserved.

`tests/regressions/` — one locked test per fixed bug, named for it:
- `flow-title-helper-collision` — `flow` renders non-empty (no `h is not a function`).
- `mermaid-node-contrast` — Mermaid node text uses the dark convention on `crt`/`blueprint`.

Output: a pass/fail matrix (component × theme) printed to stdout + written to `tests/last-run.json`. Exit non-zero on any failure (CI-able).

**Target:** the harness runs against **local `vdb.js`** as primary (that's what you harden). Add a separate, optional **CDN smoke test** against `@v11` that renders a couple of boards and checks for non-empty output — this catches publish/cache drift between local and the tag, but is not the main gate.

> Rationale: this harness, had it existed, would have caught **both** bugs shipped this week. It is the single highest-value artifact in this phase — build and green it before hardening or libraries.

---

## 6. Hardening checklist (apply to each component, gated by §5)

- Documented prop schema matches §3 (or update §3 via Claude if the engine differs).
- No identifier shadowing of engine helpers inside the function (`h`, `esc`, `pct`, `C`, `_sid`, …). Add a lint/grep step that flags any `const <helper>=` redeclaration inside a `C{}` method.
- a11y: interactive parts keyboard-reachable (`role`, `tabindex`, Enter/Space); already done for clickable stage parts in v10 — match that pattern.
- Plain-text/again-degraded fallback where meaningful.
- Contrast verified across all themes (§4).

---

## 7. Catalog & recipes (built on the hardened base)

**Catalog** (`catalog/specs/<type>.json` + `catalog/index.html`): one *minimal, correct* spec per component type, each rendering a single representative instance. `index.html` loads `@v11` once and renders all specs in a labeled grid. Purpose: a living reference + the visual half of the test matrix.

**Recipes** (`recipes/*.json`): prebuilt, governance-compliant board templates that compose multiple components for a real job:
- `status-board` — focal + bars + pipeline + note (the "scan at a glance" case).
- `comparison` — comparison + cards (decision support).
- `mechanism-xray` — stepper + diagram + note (the "how it works" case; the working pattern from this session).
- `dashboard` — tiles + gauge + sparkline + allocation.
Each recipe documents which governance trigger it serves and what to swap for your data.

---

## 8. Sequencing (do in this order)

1. **Harness** (§5) — build + green on current `@v11`. *(Codex)*
2. **Harden** (§6) — fix any component the harness flags. *(Codex implements, Claude reviews)*
3. **Catalog** (§7) — one example per type, all passing. *(Codex)*
4. **Recipes** (§7). *(Codex)*
5. **`vdb.min.js`** — minified build + size report. *(Codex)*
6. **`{param}` value-interpolation** (the §3 known gap) — engine change. *(Claude designs, Codex implements, Claude reviews — verify live.)*

Tests precede libraries deliberately: the bugs live in the components, and the harness is what catches them.

---

## 9. Resolved (2026-06-01)

All previously-open items are answered inline above: the four `VERIFY` schemas (`nodes.edges`, `stage.parts`, custom `motion`, `tabs`) are filled in §3; the `when` grammar is in §3 common props; the contrast threshold is WCAG **4.5:1 / 3:1** in §5.3; the dev-dependency question and harness target are answered in §5.

**Repo / workspace — the blocker:** the source of truth is the GitHub repo **`RussellBrb/vdb`** at tag **`v11`** (commit `2bc4da9`); CDN mirror `https://cdn.jsdelivr.net/gh/RussellBrb/vdb@v11/vdb.js`. Work from a **clone of that repo** — *not* the cowork/Nexus workspace (a different project; that's the "site-like" thing you saw). `GOVERNANCE.md` and `GOVERNANCE-research.md` are already committed in the repo. **This file (`HANDOFF-CONTRACT.md`) must be added to the repo** and maintained there as the source of truth; the copy under `cowork/_vdb/` is staging only.

---

*This contract is the interface. If reality (the engine) and this document disagree, the engine is ground truth — flag the mismatch to Claude and update this file rather than coding around it.*

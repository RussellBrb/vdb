# VDB Library — Index & Map

*The single entry point. The whole library, hierarchically, with "which piece for which job." Deeper docs live in `/docs`.*

## Quick start
```html
<script src="https://cdn.jsdelivr.net/gh/RussellBrb/vdb@v14/vdb.js"></script>
<script>VDB('#el', { theme:'twilight-forest', title:'…', components:[ … ] });</script>
```
Spec = `{ theme, title?, tag?, subtitle?, state?, animate?, components:[…] }`. Pin a tag (`@v14`) or commit SHA for stability.

## How to freestyle (the workflow)
1. **Classify the task** (`/docs/GOVERNANCE.md`): value task (one number / lookup) → text or table; pattern task → a visual.
2. Grab the nearest **recipe** (prefab). 3. Drop in your data. 4. Nudge **variants** (size/density/emphasis/tone). 5. Add **primitives** if it's a moving mechanism. 6. Smallest form that works; text carries the answer alone.

## The hierarchy

**Engine** — `vdb.js` @v14, dependency-free, CDN-hosted.
**Tokens** — themes (`twilight-forest · under-the-sea · sunrise · synthwave · crt · chill · blueprint`) or `{vibe:'phrase'}` → 5 palette roles + semantic `good/warn/bad/info`.

**Atoms (components), by family:**
- **Data** (magnitude · trend · part-to-whole): `focal · bars · gauge · sparkline · allocation · tiles · comparison`
- **Structure / flow**: `nodes · flow · pipeline · diagram · stepper · stage · mermaid`
- **Motion / mechanism**: behaviors `rotate · oscillate · pulse · flow` + FK `pivot`/`parent`; primitives `gear · piston · lever · cam · rack-pinion · spring · fluid-flow · toggle-switch · valve · pen · pump`
- **Interactive**: `controls` (toggle/slider/select/button) + `state` + `when`
- **Narrative**: `note · callout` (inline `**markdown**`)
- **Atmosphere**: `scene`

**Variants (knobs):** `size` sm/md/lg · `density` comfortable/compact · `emphasis` muted/normal/strong · `tone` neutral/good/warn/bad/info (+ per-item `tone`).

**Recipes (prefabs)** — `/recipes`: `status-board · kpi-dashboard · comparison · decision · mechanism-xray · flow-cycle · timeline · explainer`.

## Which piece for which job
- Exact number / lookup / 1–2 values → **text or table** (not a chart).
- Trend → `sparkline`/line · Compare ≥3 → `bars` · Part-to-whole → `allocation` · KPIs at a glance → `tiles`/`gauge`/`status-board`.
- Relationship / flow → `nodes`/`mermaid`/`pipeline` · How-it-works → `mechanism-xray` (stepper+diagram) · A mechanism that moves → a `motion` primitive.
- Decision at a fork → `decision` · Teach one concept → `explainer`.
- Toggle / step interactivity → `controls`+`state`+`when` / `stepper`.

## Deeper docs (`/docs`)
- `/docs/GOVERNANCE.md` — when to render (the rules) · `/docs/GOVERNANCE-research.md` — the evidence base.
- `/docs/reference/HANDOFF-CONTRACT.md` — exact component schemas + the build contract.
- `/docs/planning/LIBRARY-SPEC.md`, `/docs/planning/ANIMATION-PLAN.md` — composition-library & animation-engine design (build-time history).

## Operations
Built & maintained via the Claude↔Codex relay (`/relay/RELAY.md`). Live state: `STATUS.md`. Durable decisions: `DECISIONS.md`.

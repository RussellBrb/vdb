# VDB Composition Library — Spec

*Goal: freestyle any VDB fast. **Prefabs (recipes)** for ~80% of needs, a small **variant** knob-set to modify atoms for the rest. Grounded in atomic design (Frost) + the CVA/Stitches variant pattern. Component schemas live in `HANDOFF-CONTRACT.md` §3; this builds the two layers above the atoms.*

## Model (atomic design → engine)
- **Atoms** = the 24 existing components (focal, bars, gauge, nodes, motion, …). Done.
- **Tokens** = themes + `{vibe}` palette (5 roles). Done.
- **Variants** = a small, consistent knob vocabulary each component honors (Phase 2 — engine).
- **Molecules** = a few common composites (stat = focal+sparkline; kpi = label+gauge).
- **Recipes** = parametric board prefabs: a filled, governance-tagged example spec + documented slots/opts.
- **Catalog/Templates** = one live example per atom + per recipe; the reference + visual test surface.

## Phase 1 — Recipes + Catalog  (build now on @v11.1; NO engine change · owner: Codex)
A recipe ships as: `recipes/<name>.json` (a filled, correct, governance-compliant example) **plus** an entry in `recipes/README.md` documenting **purpose** (which governance trigger it serves), **required data shape**, and **optional slots**. Caller fills slots with real data to freestyle.

Starter set (cover the task taxonomy):
| recipe | composes | governance trigger |
|---|---|---|
| `status-board` | focal + bars + pipeline + note | status field at a glance |
| `kpi-dashboard` | tiles + gauge + sparkline + allocation | multi-metric scan |
| `comparison` | comparison + cards | compare ≥3 / decision support |
| `decision` | cards + comparison + callout | choose at a fork |
| `mechanism-xray` | stepper + diagram + note | how-it-works / process |
| `flow-cycle` | flow + note | loop / pipeline (staggered, v11.1) |
| `timeline` | pipeline or nodes | ordered stages |
| `explainer` | callout + diagram + note | teach one concept |

Also: `catalog/index.html` + `catalog/specs/<atom>.json` — one minimal live example per component (loads `@v11.1` once, renders a labeled grid).

Harness: extend to render every catalog + recipe spec (non-empty, no console errors, ≥3 themes); keep the 175/175 atom matrix green.

## Phase 2 — Variant system  (engine slice / v12 · Claude designs → Codex implements)
A small, consistent knob vocabulary every relevant component honors, CVA-style (base + axes + defaults). Keep it SMALL — more axes = more ways to violate the governance clutter rules.
- `size`: `sm | md | lg`
- `density`: `compact | comfortable`
- `emphasis`: `muted | normal | strong`
- `tone`: `neutral | good | warn | bad` (maps to semantic palette roles)
Implemented as optional props with defaults; documented per component; harness asserts each renders across variants. Do NOT start Phase 2 until the API is specced.

## Freestyle workflow (how a caller uses the library)
1. Classify the task (GOVERNANCE §1). 2. Grab the nearest **recipe**. 3. Override its slots/opts with real data. 4. Nudge component **variants** (emphasis/density/tone). 5. If nothing fits, compose **atoms** directly using the **catalog** as reference. Always: smallest form that works; text carries the answer alone.

## Acceptance
- Each recipe: documented contract + a filled example rendering non-empty on ≥3 themes, governance-compliant.
- Catalog index renders all atoms + all recipes.
- Harness green (atoms 175/175 + new catalog/recipe checks).

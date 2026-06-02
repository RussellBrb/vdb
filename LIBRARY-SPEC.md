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

---

## Phase 2 — Variant API (detailed build instruction)

The "modify any component" knobs. CVA-style: base + axes + defaults. **Backward compatible — defaults must render existing specs identically.** Keep axes SMALL (governance: more knobs = more ways to clutter).

### Axes (component-level props · all optional · default in **bold**)
- `size`: sm · **md** · lg — scales type + element dimensions (font, padding, bar height, gauge radius, svg scale). Spacing-neutral.
- `density`: **comfortable** · compact — row/item/card gaps only.
- `emphasis`: muted · **normal** · strong — visual weight (opacity, font-weight, border width). muted recedes; strong asserts.
- `tone`: **neutral** · good · warn · bad · info — semantic accent; remaps the component's primary fill/accent to a semantic color.

### Item-level overrides (granular)
Per-item `tone` (and `emphasis`) on collection items where one datum must stand out — e.g. `bars.items[{label,value,tone:"bad"}]`, also `tiles`, `pipeline`, `cards`. Component `tone` = default for its items; item `tone` overrides.

### Mechanism — implement as ONE shared resolver (DRY, no per-component duplication)
- Add `variants(c)` → returns a class string + inline CSS custom props on the component root: `--vdb-scale` (size), `--vdb-gap` (density), `--vdb-emph` (emphasis), `--vdb-tone` (resolved semantic color, else theme accent).
- Components reference these vars where the knob applies (sizes, gaps, accent fill) instead of hard values. Tokens define values; variants pick which.
- Extend `resolveTheme`/`vibePalette` to expose semantic colors `--good --warn --bad --info`, theme-aware and **contrast-checked** vs the theme bg (the mermaid lesson). Vibe palettes derive these from fixed accessible hues.

### Scope (axes per component — don't force all on all)
- `size`: focal, bars, gauge, sparkline, tiles, cards, comparison, allocation, nodes, stage, diagram.
- `density`: bars, cards, tiles, comparison, pipeline, allocation.
- `emphasis`: all.
- `tone` (component + item): focal, gauge, bars, tiles, pipeline, allocation, callout.

### Guardrails (lessons learned — non-negotiable)
- **Backward compatible:** absent knobs → current look exactly. Add a regression asserting default output == pre-variant output for every component.
- **Graceful degradation:** invalid/unknown knob value → fall back to default, never throw.
- **No identifier shadowing** of engine helpers inside component fns (the v11 `flow` bug).
- **Contrast:** every `tone` color meets WCAG 4.5:1 (text) / 3:1 (graphical) on every theme — assert in the harness.

### Harness (extend)
- Render each component across a SAMPLED axis cartesian (not full explosion) on ≥2 themes: non-empty, zero console errors, contrast holds.
- Add the default-equivalence regression.
- Keep atoms 175/175 + Phase-1 catalog/recipe checks green.

### Ship
- Add a "variants" column to each component in `HANDOFF-CONTRACT.md` §3.
- Bump engine to **v12** on completion; tag `v12`; push; verify CDN. (Banked min-build + `{param}` value-interpolation MAY ride v12, but variants are the priority — implement variants first.)

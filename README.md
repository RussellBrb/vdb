# vdb — Visual DashBoard engine

A tiny (~38 KB), dependency-free engine that renders themed, **interactive**, **animated**
dashboards and **visual explanations** from a compact JSON spec. Loaded once from jsDelivr and
driven by small specs — rich, explorable boards for roughly the cost of the spec.

**Live:** `https://cdn.jsdelivr.net/gh/RussellBrb/vdb@v10/vdb.js`

```html
<div id="v"></div>
<script src="https://cdn.jsdelivr.net/gh/RussellBrb/vdb@v10/vdb.js"></script>
<script>
VDB('#v', {
  theme: 'twilight-forest',          // named theme, or { vibe: 'any phrase' }
  title: 'Project Atlas', tag: 'live',
  components: [
    { type: 'focal', value: '94%', label: 'on track' },
    { type: 'bars', items: [ { label: 'shipped', value: 88 }, { label: 'planned', value: 45 } ] }
  ]
});
</script>
```

## Spec

| field | purpose |
|---|---|
| `theme` | named theme **or** `{ vibe: 'a phrase' }` (deterministic palette) |
| `title`, `subtitle`, `tag` | header text |
| `score` | `{ label, grade, detail:[{label,value,note}] }` → quiet corner chip; click to expand an Efficiency panel |
| `state` | object of named params + defaults (drives interactivity) |
| `components` | array of components, rendered top → bottom |
| `decor` | `['vignette' | 'scanlines' | 'mist']` |
| `backdrop` | `'mountains' | 'hills' | 'waves' | 'forest'` (or `{motif,height,opacity}`) — paints a landscape behind everything |
| `animate` | `true` → entrance motion (bars grow, focal pops, layers/cards fade) |
| `seed`, `font` | optional: stable RNG seed; custom font stack |

## Themes

Named: `twilight-forest`, `under-the-sea`, `sunrise`, `synthwave`, `crt`, `chill`, `blueprint`.
Or generate from a phrase — `theme:{vibe:'tropical waters vacation'}` — via string hash →
Mulberry32 → HSL (same phrase ⇒ same palette). Five roles: shade · anchor · secondary · tint · accent.

## Components — which to use when

**Numbers & data**
- `focal` — one hero metric (the headline number).
- `tiles` — a row of small stat tiles.
- `bars` — labelled progress/values.
- `comparison` — A vs B bars per row.
- `allocation` — proportions of a whole (segmented bar + legend).
- `sparkline` — a trend over time.
- `gauge` — a single radial score (optionally with side tiles).
- `note` / `callout` — prose; `callout` has a left accent bar. (`text` is escaped; `html` is raw — see Security.)

**Structure & explanation**
- `pipeline` — sequential stages as chips (done/active/queued).
- `diagram` — addressable **layers**; highlights the one matching `active`, dims the rest (lightweight x-ray).
- `stage` — like `diagram` but SVG with **leader-line annotations**: the active part is highlighted and a note points at it. Parts are clickable (and keyboard-accessible) to jump.
- `nodes` — a hand-rolled **graph**: `nodes:[{id,label,col}]` + `edges:[[from,to]]`, column layout, curved arrowed edges.
- `mermaid` — freeform flowchart/graph from text (`code:'graph LR; A-->B'`); Mermaid is **lazy-loaded only when used** and themed to the board palette.
- `scene` — a procedural atmospheric landscape (`motif`, `height`, `sun`).

**Motion**
- `flow` — a row of nodes with a dot continuously tracing the line (`offset-path`).
- `motion` — **true tweened mechanism**: parts physically slide between frames. Use a stored `preset` (see Presets) or supply `parts` + `frames`. Has its own prev/next + autoplay.

**Controls** (write to `state`): `tabs` · `toggle` · `select` · `slider` · `button` · `stepper`.
Group with `{type:'controls', items:[ … ]}` for a row.

Any component accepts `depth:'far'|'mid'|'near'` (atmospheric perspective: far recedes, near stays crisp).

## Interactivity

Interaction is **state**, and every view is a function of it (Vega-Lite's model). Declare params
in `state`; controls write them; components show/hide with a `when:` condition
(`param`, `param==v`, `!=`, `>=`, `<=`, `>`, `<`). One delegated listener, idempotent re-render,
focus preserved across updates.

### Persistence (v10)

Re-rendering rebuilds the body, which would restart a playing `motion` or re-render a `mermaid`
diagram. Give such a component a stable **`key`** and its live DOM is preserved across
re-renders (the animation keeps playing, the diagram isn't recomputed):
`{ type:'motion', preset:'pen-click', key:'pen' }`.

### Host bridge (button actions)

A `button`'s `action` runs against whatever host exists, degrading gracefully:
- `{ prompt:'…' }` → `sendPrompt()` (chat). `{param}` tokens are interpolated from live state.
- `{ tool:'name', args:{…} }` → `cowork.callMcpTool()` then re-render (live data).
- `{ url:'…' }` → `openLink()` / `window.open`.
- No host → console; the rest of the board stays interactive.

## Motion presets

`{type:'motion', preset:'name', params?:{…}}` — the geometry + frame choreography are stored in
the engine, so a full mechanism is one line. Built-in: `pen-click`, `toggle` (stored prefabs),
`pump` (parametric — `params:{strokes}`). Add new ones by extending `MPRESETS` (a tag bump).

## Security

Text fields are **escaped** (`esc`). The `html` field on `note`/`callout` and the `note` field
on `stage`/`motion` render **raw** (for `<b>`, etc.) and trust the spec author. **Never
interpolate untrusted/user data into `html`/`note` fields** — use the escaped `text` field for
anything that isn't author-controlled.

## Accessibility

Built on native `<button>`/`<select>`/`<input type=range>` + ARIA (`tablist`/`tab`, `role=switch`).
Tabs support arrow keys; clickable `stage` parts are `role=button` + Enter/Space focusable.
Respects `prefers-reduced-motion`.

## Versioning

Pin a tag for cache stability — `@v1` … `@v10` (`@main` = latest commit). jsDelivr caches tags,
so **bump the tag whenever `vdb.js` changes**.

| tag | added |
|---|---|
| `v1` | core engine: spec-driven, themed, CDN-hosted |
| `v2` | artful layer — `scene`, `focal`, `comparison`, `cards`, `depth`, `backdrop` |
| `v3` | interactivity — `state`, controls, `when`, host bridge, accessible inputs |
| `v4` | x-ray / mechanism — `diagram`, `stepper`, `callout` |
| `v5` | motion — `animate` flag + `flow` |
| `v6` | graphs — hand-rolled `nodes`/edges + lazy `mermaid` |
| `v7` | annotated `stage` (leader-lines) + `score` chip + Efficiency panel |
| `v8` | clickable parts + true tweened `motion` |
| `v9` | motion preset registry (prefabs + parametric generators) |
| `v10` | keyed persistence · DRY internals · themed Mermaid · keyboard-accessible parts |

## When to render — governance

An engine is only half the system; the other half is the judgment of *when* a visual earns
its place. That discipline lives in two companion docs:

- **`GOVERNANCE.md`** — the operating ruleset an agent follows in the moment: classify the
  task, trigger/suppress checks, a selection table, the economy ladder
  (`sparkline ‹ chip ‹ panel ‹ board`), and the anti-pattern list. Start here.
- **`GOVERNANCE-research.md`** — the evidence base (graphical perception, multimedia
  learning, interaction cost, generative-UI practice) with citations and effect sizes.

One-line version: **default to text; render only when a visual lowers the reader’s total
cost — tokens to make it plus attention to decode it — below prose. When unsure, don’t.**

## Design notes

Informed by Tufte (maximize data-ink, kill chartjunk) and Bob Ross's wet-on-wet method: paint the
background first, build forward, use contrast for depth and a single focal point, keep a limited
palette, treat constraints as features. Decoration lives in the receded background, never over the data.

— `demo.html` is a self-contained interactive example; open it in a browser.

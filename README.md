# vdb — Visual DashBoard engine

A tiny (~23 KB), dependency-free engine that renders themed, **interactive** dashboards
from a compact JSON spec. Hosted here so it loads once from jsDelivr and is driven by
small specs — rich boards for roughly the cost of the spec itself.

**Live:** `https://cdn.jsdelivr.net/gh/RussellBrb/vdb@v3/vdb.js`

```html
<div id="v"></div>
<script src="https://cdn.jsdelivr.net/gh/RussellBrb/vdb@v3/vdb.js"></script>
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
| `state` | object of named params + defaults (drives interactivity) |
| `components` | array of components, rendered top to bottom |
| `decor` | `['vignette' | 'scanlines' | 'mist']` |
| `backdrop` | `'mountains' | 'hills' | 'waves' | 'forest'` (or `{motif,height,opacity}`) paints a landscape behind everything |
| `seed`, `font` | optional: stable RNG seed; custom font stack |

## Themes

Named: `twilight-forest`, `under-the-sea`, `sunrise`, `synthwave`, `crt`, `chill`, `blueprint`.

Or generate one from a phrase — `theme: { vibe: 'tropical waters vacation' }` — via a string
hash to Mulberry32 to HSL, so the same phrase always yields the same palette. Every theme
exposes five roles: shade, anchor, secondary, tint, accent.

## Components

**Display:** `gauge`, `bars`, `allocation`, `sparkline`, `tiles`, `pipeline`, `note`,
`focal` (hero metric), `comparison` (A/B bars), `cards` (option cards; `rec:true` highlights),
`scene` (procedural layered landscape — `motif`, `height`, `sun`)
· `diagram` (x-ray: addressable `layers`, highlights the one matching `active` step and dims the rest)
· `callout` (step-aware label, pairs with `when:`).

**Controls** (write to `state`): `tabs`, `toggle`, `select`, `slider`, `button`.
Wrap several in `{ type:'controls', items:[ ... ] }` to lay them out in a row.

Any component accepts `depth: 'far' | 'mid' | 'near'` — atmospheric perspective: `far` recedes
(lower contrast, desaturated), `near` stays crisp. Use it to push chrome back and let the
focal point advance.

## Interactivity

Interaction is modelled on Vega-Lite's idea: **interaction is state, and every view is a pure
function of it.** You declare params in `state`; controls write them; components show/hide with
a `when:` condition. The engine keeps per-board state, re-renders idempotently from one
delegated listener, and preserves focus across updates.

```js
VDB('#v', {
  theme: 'crt',
  state: { view: 'overview', dense: false, team: 'all', focus: 40 },
  components: [
    { type: 'controls', items: [
      { type: 'tabs',   param: 'view', options: [{value:'overview',label:'Overview'},{value:'detail',label:'Detail'}] },
      { type: 'toggle', param: 'dense', label: 'Dense' },
      { type: 'select', param: 'team',  options: [{value:'all',label:'All'},{value:'eng',label:'Eng'}] },
      { type: 'slider', param: 'focus', label: 'Focus', min: 0, max: 100, step: 5 }
    ]},
    { when: 'view==overview', type: 'focal', value: '94%', label: 'on track' },
    { when: 'view==detail',   type: 'comparison', items: [{label:'A',a:92,b:30}] },
    { when: 'dense!=true',    type: 'note', text: 'shown unless Dense is on' },
    { when: 'focus>=70',      type: 'note', text: 'shown when the slider is high' },
    { type: 'controls', items: [
      { type: 'button', label: 'Drill in', action: { prompt: 'drill into the selection' } }
    ]}
  ]
});
```

`when` supports `param`, `param==value`, `!=`, `>=`, `<=`, `>`, `<`.

### Host bridge (button actions)

A `button` runs an `action` against whatever host is present, degrading gracefully:

- `{ prompt: '...' }` -> `sendPrompt()` (chat hosts) — sends a message as if typed.
- `{ tool: 'name', args: {...} }` -> `cowork.callMcpTool()` (Cowork) — pull/refresh live data, then re-render.
- `{ url: '...' }` -> `openLink()` / `window.open`.
- No host -> logged to console; the rest of the board stays fully interactive.

## Accessibility

Built on native `<button>`, `<select>`, `<input type=range>` + ARIA (`tablist`/`tab`,
`role=switch`), so keyboard navigation, focus, and screen-reader semantics work out of the
box. Tabs support arrow-key navigation. Respects `prefers-reduced-motion`.

## Versioning

Pin a tag for cache stability — `@v1`, `@v2`, `@v3` (`@main` serves the latest commit).
jsDelivr caches tags, so **bump the tag whenever `vdb.js` changes**.

| tag | what it added |
|---|---|
| `v1` | core engine: spec-driven, themed, CDN-hosted |
| `v2` | artful layer — `scene`, `focal`, `comparison`, `cards`, `depth`, `backdrop` (Bob-Ross-informed) |
| `v3` | interactivity — `state`, controls, `when`, host bridge, accessible inputs |
| `v4` | x-ray / mechanism mode — `diagram`, `stepper`, `callout` (step through a system, highlight the active part) |

## Design notes

Informed by Tufte (maximize data-ink, kill chartjunk) and Bob Ross's wet-on-wet method:
paint the background first, build foreground on top, use **contrast for depth and a single
focal point**, keep a limited palette, and treat constraints as features. Decoration lives in
the receded background layer, never over the data.

— `demo.html` in this repo is a self-contained interactive example; open it in a browser.

# VDB Recipes

Each recipe is a filled VDB spec that can be copied and adapted. Replace the slot data with real values, keep the governance trigger intact, and prefer the smallest board that explains the job.

| recipe | purpose / trigger | required data shape | optional slots |
|---|---|---|---|
| `status-board` | Status field at a glance: one current state plus the few tracks that explain it. | `focal.value`; `bars.items[{label,value,note?}]`; `pipeline.items[{label,state}]`. | `subtitle`, `note.text`, extra bars or pipeline steps. |
| `kpi-dashboard` | Multi-metric scan for repeated operational review. | `tiles.items[{value,label}]`; `gauge.value`; `sparkline.points`; `allocation.items[{label,value}]`. | `sparkline.caption`, allocation categories, theme. |
| `comparison` | Compare three or more options or before/after paths. | `comparison.items[{label,a,b,aNote?,bNote?}]`; `cards.items[{title,desc?,tag?,rec?}]`. | Recommended card marker, extra criteria. |
| `decision` | Choose at a fork with visible criteria and a recommendation. | `cards.items`; `comparison.items`; `callout.text`. | Add/remove options, tune criteria labels. |
| `mechanism-xray` | How-it-works/process explanation with a stateful active layer. | `state.step`; `stepper.steps`; `diagram.layers[{label,sub?,step}]`. | Step labels, layer tags, note text. |
| `flow-cycle` | Loop or pipeline where order is the main fact. | `flow.nodes` or `flow.steps`; `note.text`. | `animate`, node count, theme. |
| `timeline` | Ordered stages and dependencies. | `pipeline.items[{label,state}]`; optional `nodes.nodes`/`edges` for dependencies. | Current stage, dependency graph depth. |
| `explainer` | Teach one concept using a claim, structure, and note. | `callout.text`; `diagram.layers`; `note.text`. | Layer tags, subtitles, theme. |

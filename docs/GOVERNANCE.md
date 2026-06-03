# VDB Governance — the operating ruleset

*The* **what** *— rules an agent follows in the moment. The* **why** *(evidence, effect sizes, citations) lives in `docs/GOVERNANCE-research.md`. When this doc and intuition disagree, follow this doc; when this doc and the research disagree, the research wins and this doc should be updated.*

---

## The prime directive

> **Default to text. Render a visual only when it lowers the reader's total cost of getting the answer below what prose or a number would cost.**

A VDB carries a double cost — **tokens** to produce and **attention** to decode — so it must clear both bars. A wrong *render* wastes a little; a wrong *suppress* costs nothing (the text answer is still complete). So when unsure, **don't render.** Suppression is the safe default.

### Rule 0 — Explicit request overrides the default

If the user *asks for* a visual ("show me a VDB", "chart this", "make it visual"), they've pre-paid the attention cost — render it. **But every other rule still applies:** an explicitly-requested board must still pick the smallest right form, encode correctly, and avoid the anti-patterns. A request to "show a VDB" is not license to put a single number in a focal or wrap prose in cards. *(Added 2026-06-01: the whole framework is written for the* unprompted *case; most real rendering is requested, and the trade differs.)*

---

## Step 1 — Classify the task before reaching for a component

Name what the reader is trying to *do*. This decides everything downstream.

- **Value tasks** — read an exact figure, look something up, get a yes/no, see one or two numbers. → **Text or table. Do not chart.**
- **Pattern tasks** — feel a trend, compare several things, see a part-to-whole, spot an outlier, follow a flow/process, scan a status field. → **A visual may be justified.** Continue to Step 2.

If it's a value task, stop here and answer in words. Most responses stop here.

---

## Step 2 — Triggering: does this pattern clear the bar?

Render only if **at least one** trigger holds **and no** suppressor holds.

**Triggers (render-worthy patterns):**

1. **Trend** over an ordered axis (time, sequence, stages).
2. **Comparison** across ≥3–4 items, or where relative magnitude is the point.
3. **Part-to-whole** composition the reader needs to feel.
4. **Distribution / spread / outlier** story.
5. **Relationship / flow / structure** (pipeline, graph, state machine, architecture).
6. **Process / mechanism** that unfolds over steps (the case for motion).
7. **Status field** meant to be scanned at a glance (the dashboard case).
8. **Behavioral proof / live demonstration** — the visual *demonstrates a behavior or dynamic that text can only assert* ("the animation keeps playing across a re-render"; "drag this and watch the result"). This is the **strongest** justification class — the reader sees it happen rather than taking your word. Anchor: Victor's *explorable explanations* (reactive documents). **Guardrail (Congruence Principle, Tversky et al.):** animate or make-interactive only when the *information itself is dynamic* — a static fact gains nothing from motion and pays the cost; motion is not superior to a static graphic unless it carries change the static can't.

**Suppressors (force text/table even if a trigger seems present):**

- The answer is **1–2 numbers, an exact value, a yes/no, or a lookup** → state it / use a table.
- The visual would **restate a sentence** you've already written (redundancy → net negative).
- The visual is **decorative or tangential** to the point (seductive detail → lowers recall).
- The reader is an **expert in this content** (expertise reversal → fade or drop it).
- **Mixed units / precision / audit** matters → table, not chart.
- Extracting the fact would **cost the reader more** than just reading the conclusion.

**The 2-number rule of thumb:** if labeling the data points with their values makes the chart scaffolding pointless, you didn't need the chart — write the numbers.

---

## Step 3 — Selection: pick the smallest right form

| Reader's task / data shape | Default form | Avoid |
|---|---|---|
| Trend over time/sequence | line; **inline sparkline** if it belongs mid-sentence | 3-D, dual axes |
| Compare magnitudes (≥3) | bar / dot plot | pie for comparison |
| Part-to-whole | stacked bar; pie/donut **only** if "the whole" is the point and slices are few & fat | many-sliver pies |
| Distribution | histogram / strip / box | a table of raw values |
| Relationship / flow / structure | nodes-edges / themed mermaid | prose describing a graph |
| Process / mechanism unfolding | motion / annotated stage, **caption in-frame** | motion described paragraphs away |
| Status scanned at a glance | compact dashboard / score chip | one chip per paragraph |
| Single fact + a trend nuance | sparkline or chip — **not** a panel | a full board for one number |
| Exact values / mixed units | **table** | a chart |

**Encoding rules within any choice:**

- Prefer **position and length** (bars, dots, lines) for magnitude and trend — they're the most accurately decoded.
- **Hue, shape, orientation are for categories only.** Never encode a quantity with color hue.
- **Signal the one thing that matters** — highlight it; don't present a flat undifferentiated field.
- Keep data-ink high, **but not to the point of hurting readability** (don't strip so far it's cryptic).
- **Cards/panels are for data, not prose.** If a card's content is full sentences rather than encoded values, use a list or table — a box around text adds visual cost while encoding nothing. (Cards earn their place when each holds a comparable, scannable unit: a metric, a status, an option.)

---

## Step 4 — Economy & layering: how much, and where

**The economy ladder — always start at the bottom rung that works:**

```
sparkline  ‹  chip  ‹  single panel  ‹  multi-panel board
```

Escalate one rung only when the larger form's *added information* clears its *added cost*. A board where a chip would do is a leak — of tokens and of attention.

**Layering rules:**

- **Adjacent, not detached.** Put the visual at the point in the prose where the pattern is named. For motion, caption it inside the frame.
- **Overview by default, detail on demand.** Lead with the gestalt; reveal exact values / deeper breakdowns only when asked. Never exceed **2 disclosure levels.**
- **Up front signals "important."** Only lead with a visual whose payoff justifies that signal. A low-value visual up front miscommunicates priority.
- **Strong scent on deferred content.** If you defer a visual behind a prompt/trigger, the label must clearly promise the payoff — or no one will ask for it.
- **One consistent vocabulary.** Reuse the same small VDB component set so the reader learns to trust it. Don't invent a bespoke interface per message.
- **Text carries the answer alone.** The visual is reinforcement; the reader must be able to ignore it and still be fully informed.

---

## Step 5 — Misfire policy (triggering is never perfect)

Even frontier systems ship learned triggers with explicit error budgets and manual overrides. Assume you will sometimes misjudge.

- Make every visual **cheap to ignore** (text stands alone).
- Bias toward **suppression** — the asymmetry favors it (see prime directive).
- If the user signals a visual didn't help (or wasn't wanted), **drop down a rung** next time, don't justify the last one.
- Treat the rules as **tunable**, not frozen — if real use contradicts a rule, update `docs/GOVERNANCE-research.md` first, then this doc.

---

## The hard "don't" list (anti-patterns)

- A visual on every paragraph.
- A chart for two numbers.
- A panel that restates a sentence.
- Decorative theming that competes with the content.
- Hue used to encode a quantity.
- Pie charts with many slim slices.
- A fact locked behind a required interaction.
- A bespoke layout the reader has never seen before.
- Detail pushed up front when it belonged on-demand.
- Cards used as decorative containers for prose (sentences in boxes → use a list/table).
- Motion on a static fact (animation only earns its cost when the information is dynamic — Congruence Principle).

---

## One-paragraph version (for the skill)

Default to text (unless the user explicitly asked for a visual — then render, but still obey every selection/economy/anti-pattern rule below). Before rendering, classify the task: value tasks (exact figure, lookup, yes/no, 1–2 numbers) get words or a table; only pattern tasks (trend, comparison ≥3, part-to-whole, distribution, flow/structure, mechanism, scannable status, or **behavioral proof / live demonstration**) justify a visual — and only if it isn't redundant with the prose, decorative, aimed at an expert, or about precise/mixed-unit values. Pick the smallest form that works (sparkline ‹ chip ‹ panel ‹ board), encode magnitude with position/length and never quantity with hue, use cards only for scannable data units (not prose), animate only when the information is genuinely dynamic, place it adjacent to the prose it explains, keep detail on-demand (≤2 levels), reuse one consistent component vocabulary, and ensure the text answers fully on its own. When unsure, don't render — a wrong suppress costs nothing.

# When to render a VDB — the evidence base

*Research foundation for VDB layering philosophy & governance. Compiled 2026-06-01. Sources are 60+ years of graphical-perception, multimedia-learning, and HCI research, plus the current (2024–2026) generative-UI landscape. This document is the* **why** *; the governance doc (rules an agent follows) is the* **what**, *derived from this.*

---

## 0. The one-line thesis

A visual is justified **only when it lowers the reader's total cost of getting the answer below what prose or a number would cost.** Everything below is a refinement of that single trade. The default is text; a VDB must *earn* its place by carrying a pattern that words carry worse.

This is not an aesthetic preference — it is the convergent conclusion of the perception literature (a visual wins for some tasks and loses for others, predictably), the learning literature (extraneous visuals measurably *reduce* comprehension), and the interaction-cost literature (every element and every interaction has a price). The frontier labs reach the same place operationally: nobody renders a panel for everything, and the render decision is treated as a routing/triggering problem with explicit error tolerance.

---

## 1. When a visual genuinely beats text (the trigger conditions)

The graphical-perception tradition gives a sharp answer to *when*, not just *how*.

**Visuals win for pattern-tasks; text/tables win for value-tasks.** The practitioner-and-theory consensus is consistent: charts beat tables/prose for **trends over time, distributions, part-to-whole proportions, comparisons at scale, and outlier/pattern detection** — the cases where the *gestalt* is the message. Tables/prose beat charts for **exact-value lookup, a handful of numbers, mixed units, and reference/audit use** — where precision is the message (Cleveland & McGill 1984; Shneiderman 1996; Domo/Luzmo chart-vs-table syntheses).

**The deciding variable is the user's task, not the data.** Munzner's entire framework (*Visualization Analysis & Design*, 2014) insists the chart idiom be *derived* from a data abstraction (what the data is) crossed with a task abstraction (what the user is trying to do) — and that "whether to visualize at all" is itself part of task abstraction. If the task is "identify one value," a table or sentence is the correct idiom. This is the single most important import for us: **we must classify the task before we reach for a component.**

**A visual's accuracy is bounded by its encoding.** Cleveland & McGill's ranking — position on a common scale > position on unaligned scales > length > angle/slope > area > volume > color/shading — has replicated repeatedly (Heer & Bostock, CHI 2010). It dictates *which* visual: prefer bars/dot-plots/lines (position, length) for magnitude and trend; treat pie (angle) and bubble/treemap (area) as last resorts justified only by a part-to-whole framing. Bertin's visual-variable taxonomy adds the type rule: **position and size for quantitative; value/size for ordered; hue, shape, orientation for categorical.** Encoding a quantity with hue is a category error.

**Tiny inline visuals are a real category.** Tufte's sparklines — word-sized, axis-free trend marks embedded *in the text* — are the canonical proof that a micro-visual can beat a number without breaking reading flow. This directly validates the "micro-VDB layered into a message" idea: the smallest justified visual is often a data-word, not a panel.

> **Confidence:** High for the perception ranking and the task-determines-idiom thesis (foundational, replicated). The chart-vs-table specifics are practitioner consensus aligned with theory — strong heuristics, not laws. Tufte's anti-ornament absolutism is *contested* (Bateman's "Useful Junk?" found embellishment can aid recall) — so "strip everything" is itself a claim to hold loosely.

---

## 2. When pairing a visual with words *helps* — and the effect sizes

Mayer's Cognitive Theory of Multimedia Learning is the most quantified body of evidence we have, and it is strikingly favorable *when the conditions are met*:

- **Multimedia principle** — words + relevant pictures beat words alone, median **d ≈ 1.39**. This is a large effect. But it only holds when the picture is *informationally related* to the words.
- **Spatial contiguity** — related words and visuals must sit *near each other* (22/22 studies, **d ≈ 1.10**). For us: the VDB belongs adjacent to the prose it explains, not in a separate panel the reader must context-switch to.
- **Temporal contiguity** — for motion, the narration and the animation should play *together* (9/9, **d ≈ 1.22**). Our animated mechanism views should be captioned in-frame, not described paragraphs away.
- **Signaling** — cueing the essential parts improves learning (16/16, **d ≈ 0.86**). VDBs should highlight the one thing that matters, not present a flat field.

Paivio's dual-coding theory explains the mechanism (verbal + imagery traces reinforce), and these are the affirmative case for layering visuals at all. **The lesson is not "add visuals" — it is "add a *related, adjacent, signaled* visual," and when you do, the upside is large.**

> **Confidence:** High. These are Mayer's reported medians across dozens of controlled studies. The caveat (§4) is that the same body of work is equally emphatic about when visuals *hurt*.

---

## 3. When a visual actively *hurts* (the suppression conditions)

This is the half practitioners forget, and it is just as well-evidenced.

- **Coherence principle** — *removing* interesting-but-extraneous material improves deep learning (23/23 studies, **d ≈ 0.86**). This is the strongest single mandate for minimalism in the literature. A decorative or tangential VDB doesn't just fail to help — it measurably lowers comprehension of what matters.
- **Redundancy principle** — presenting the *same* information in two forms at once splits attention rather than reinforcing it. A VDB that merely restates a sentence is a net negative, not a courtesy.
- **Seductive details** — interesting-but-irrelevant visuals reduce recall of main ideas and transfer (Harp & Mayer). The mechanism is schema-priming: the flashy thing mis-organizes the reader's mental model. Our "themed, artful" instinct is exactly the risk vector here — *the prettier and more tangential, the more dangerous.*
- **Cognitive load is additive** — intrinsic + extraneous + germane load compete for ~4 working-memory slots (Sweller). Decorative visual load consumes the same scarce capacity as the content.
- **Expertise reversal** — scaffolding that helps novices *harms* experts, because experts must reconcile the visual with schemas they already hold (Kalyuga). A VDB explaining something the reader already knows imposes cost with no benefit. **Visuals should fade as the reader's expertise rises.**

The HCI side converges: NN/g frames chartjunk as a signal-to-noise problem — every non-data element competes with the data for attention. Their worked example shows that once you label two bars with their values, "the grid lines and y-axis... are now chartjunk and can be removed" — i.e., for two numbers, the chart scaffolding should vanish entirely. The mild counter-evidence (eye-tracking shows purely decorative images get a brief glance then are ignored — Schneider et al.) only narrows the harm to visuals that *compete with essential material*; it doesn't license adding them.

> **Confidence:** High for coherence/redundancy/seductive-details (large, replicated). The seductive-details *magnitude* varies (Rey meta-analysis: small-to-moderate, not universal) but the *direction* is robust. Expertise reversal is well established.

---

## 4. The cost side — why even a *good* visual can lose

NN/g's interaction-cost model is the missing economic layer:

- **Interaction cost** = total mental + physical effort to reach a goal; the holy grail is *zero* — the answer is simply present. Reading, scrolling, clicking, waiting, *and comprehending* all count as cost.
- **Users choose by expected utility = benefit − interaction cost.** A visual whose extraction cost exceeds its informational benefit gets abandoned. For a single fact, benefit is low, so the lightest representation wins.
- **Comprehension is itself a cost.** Even a static chart that must be decoded costs more than a sentence stating the conclusion — *when the conclusion is all that's needed.* Krug's "Don't Make Me Think": the default should answer the question without action.

This maps cleanly onto our token-economy framing. We already think in *value per token*; this literature says think in *value per unit of reader attention* too. A VDB has a **double cost** — render/token cost to produce, and attention/decode cost to consume. It must clear both bars. The cheapest VDB that conveys the pattern wins; the sparkline beats the panel; the panel beats the dashboard — unless the larger form's added information clears its added cost.

> **Confidence:** High. These are NN/g's primary, widely-cited models.

---

## 5. Layering — the *how* of disclosure (this is the heart of "organic layering")

The user's actual phrasing — "organically layer micro VDBs into messages" — is precisely the progressive-disclosure / overview-first tradition.

- **Shneiderman's mantra:** *overview first, zoom and filter, then details-on-demand.* Detail is **requested, not pushed.** The default response carries the gestalt; exact values and deeper breakdowns are revealed only on drill-in.
- **Nielsen's progressive disclosure:** show only what's needed now; defer secondary material to a second level. Measurably improves learnability, efficiency, and error rate. Two warnings we must honor: (a) **anything you show up front signals "this is important"** — so a low-value VDB up front actively miscommunicates priority; (b) **don't exceed ~2 disclosure levels** — users get lost.
- **Information scent (Pirolli & Card):** if you defer a visual, the trigger/label must carry strong scent — clearly promise the payoff — or no one forages for it and the deferred content is effectively lost.

**Synthesis for us:** the natural shape of an "organic" response is *prose carrying the answer → optionally one micro-VDB inline at the point the pattern is mentioned (sparkline / tiny chip / single bar) → optionally a fuller VDB on explicit request.* Layering is vertical (overview → detail on demand), not horizontal (a panel on every paragraph). The economy chip we already moved to a corner is exactly right by this logic; the "bars on every card" we removed was exactly the anti-pattern.

> **Confidence:** High. Shneiderman 1996, Nielsen (NN/g), Pirolli & Card 1999 are foundational primaries.

---

## 6. How the field auto-selects a representation (and the guardrails)

We are, in effect, building an automatic-presentation system. The literature on that is mature:

- **Expressiveness + effectiveness (Mackinlay's APT, 1986):** pick an encoding that expresses *exactly* the facts in the data (no more, no less), then among expressive options pick the most *perceptually effective* (Cleveland-McGill ranking). This is the formal version of "match the data type to the right channel."
- **Show Me (Tableau, 2007):** field types drive a *default* view, but defaults must **preserve flow and stay overridable.** Auto-selection is a starting point, not a verdict.
- **Draco (2019):** design knowledge as constraints, with weights *learnable from perception experiments* — i.e., the rules can be tuned empirically over time rather than hand-frozen.
- **SUPPLE (Gajos & Weld):** UI generation as cost-minimization over expected user effort — adapt by changing the cost function, not by rebuilding.

**The critical guardrail** comes from the adaptive-UI literature: auto-changing the representation is a net win **only when the change is accurate, predictable, low-cost, and overridable.** Unpredictable adaptation erases its own time savings and damages trust and spatial memory (Gajos et al.; Findlater & McGrenere). Mitigations: keep a **stable, recognizable component vocabulary**, make changes *gradual/legible* rather than jarring (cf. ephemeral adaptation), and always allow the reader to ignore the visual and read the text. **For us this means: a small, consistent VDB vocabulary the reader learns to trust — not a different bespoke interface every message.**

> **Confidence:** High for the auto-selection chain (foundational papers). High for the predictability/trust caution (multiple CHI studies).

---

## 7. What the frontier is actually doing (2024–2026)

The emerging practice corroborates the theory rather than overriding it:

- **The render decision is modeled two ways:** as **tool selection** (the model calls a UI-producing tool — Vercel AI SDK generative UI, MCP-UI, the official MCP Apps extension SEP-1865 from Nov 2025), or as a **trained classifier with explicit error tolerance** (OpenAI Canvas targets ~83% correct-trigger; OpenAI's own framing is "trained, not programmed"). **Nobody expects perfect triggering** — they budget for misfires and allow manual override.
- **The only published numeric heuristics** are artifact thresholds: Claude renders an Artifact for content that is *significant, self-contained, typically >15 lines, and reusable/referenceable*; ChatGPT Canvas opens at ~10 lines or on a writing/coding task. These are the most concrete "render separately vs inline" rules in the industry, and they're all of the form **substantial + self-contained + reusable.**
- **Hybrid beats chat-only.** The strong cross-source consensus (NN/g's "intent-based outcome specification" paradigm; multiple practitioner pieces) is that pure conversation fails many tasks and the win is a *deliberate hybrid*: structured visual for comparison/overview/editing, text for quick directed answers. (The often-quoted 40%/50% chat-failure stats are **directional only — original methodology untraceable**; cite cautiously.)
- **Real risk classes:** generated UI can violate accessibility (WCAG) silently, and interface inconsistency erodes trust when users can't tell *why* the UI changed. Both argue for **templates/guardrails over free-form generation** — which is exactly our hosted-engine-with-a-fixed-component-registry architecture. We are, by construction, on the safer side of this.

> **Confidence:** Well-supported for the Claude/OpenAI/Vercel/Google/MCP primary docs and NN/g. Emerging for the hybrid-UX practitioner consensus. The chat-failure percentages are flagged untrustworthy.

---

## 8. The decision framework (theory → rules)

This is the actionable distillation — the seed of the governance doc.

### 8a. Triggering — *should there be a visual at all?*

Render a visual only if **at least one** "pattern" condition holds **and no** suppression condition holds.

**Trigger (pattern present):**
- A **trend** over an ordered axis (time, sequence, stages).
- A **comparison** across ≥3–4 items, or where relative magnitude is the point.
- A **part-to-whole** / composition the reader needs to feel.
- A **distribution / spread / outlier** story.
- A **relationship / flow / structure** (graph, pipeline, state machine, architecture).
- A **process / mechanism** that unfolds (the case for motion).
- A **status field** scanned at a glance (the dashboard case).

**Suppress (default to text/number/table) when:**
- The answer is **one or two numbers, an exact value, a yes/no, or a lookup** → state it / use a table.
- The visual would **restate** the sentence (redundancy).
- The visual is **decorative or tangential** (seductive detail / coherence violation).
- The reader is an **expert** in this content (expertise reversal) — fade it.
- **Mixed units / need for precision / audit** → table.
- Extraction cost would **exceed** the benefit (single fact behind a decode) → just say it.

### 8b. Selection — *which visual, given the trigger?*

| Task / data shape | Default idiom | Why (channel) |
|---|---|---|
| Trend over time/sequence | line, or **inline sparkline** if it belongs in a sentence | position |
| Compare magnitudes (≥3 items) | bar / dot plot | position, length |
| Part-to-whole | bar (stacked) by default; pie/donut only if "whole" framing is essential and slices are few | length > angle |
| Distribution | histogram / strip / box | position |
| Relationship / flow / structure | nodes-edges / themed mermaid | 2D position + connection |
| Process / mechanism unfolding | motion / annotated stage (caption *in-frame*) | temporal contiguity |
| Status scanned at a glance | compact dashboard / score chip | preattentive grouping |
| Single fact with a trend nuance | sparkline or chip, **not** a panel | smallest justified form |
| Exact values / mixed units | **table** (not a chart) | precision task |

Within any choice: prefer position/length encodings; reserve hue for categories; signal the one thing that matters; keep the data-ink high but not to the point of hurting readability.

### 8c. Economy & layering — *how much, and where?*

- **Smallest justified form.** Sparkline < chip < single panel < multi-panel board. Escalate only when the larger form's *added information* clears its *added cost* (both token and attention).
- **Adjacent, not detached.** Put the visual at the point in the prose where the pattern is named (spatial contiguity). In-frame captions for motion (temporal contiguity).
- **Overview by default, detail on demand.** One micro-VDB inline; fuller breakdowns behind an explicit, strong-scent trigger. Never more than ~2 disclosure levels.
- **Up front = "important."** Only lead with a visual whose payoff justifies that signal.
- **One consistent vocabulary.** Reuse the same small component set so the reader builds trust; don't invent a bespoke interface per message.
- **Always overridable / ignorable.** The text must carry the answer on its own; the visual is reinforcement, never the sole channel.

### 8d. Anti-patterns (hard "don't")

A visual on every paragraph. A chart for two numbers. A panel restating a sentence. Decorative theming that competes with the content. Hue-encoded quantities. Pie charts with many slim slices. A fact locked behind a required interaction. A bespoke layout the reader has never seen. Detail pushed when it should be on-demand.

---

## 9. Honest limits of this evidence

Three caveats to keep us intellectually honest:

1. **The direct question is genuinely under-studied.** There is *no* rigorous empirical literature on "an LLM choosing to embed a visual inline, unprompted." Everything above is transferred from adjacent fields (perception, learning, HCI, adaptive UI) plus very recent (mostly 2024–2026, often vendor) generative-UI practice. The transfer is sound but it is transfer.
2. **Some load-bearing heuristics are consensus, not law.** Chart-vs-table specifics and Tufte's anti-ornament stance are contested (Bateman's embellishment-aids-recall finding; the data-ink "Goldilocks" critique). We should hold "strip everything" loosely and treat memorability as a real, sometimes-competing goal.
3. **Triggering will be imperfect — design for that.** Even OpenAI and Google ship learned triggers with explicit error budgets and manual overrides. Our governance should assume misfires, make the visual cheap to ignore, and make suppression the safe default — so a wrong *render* costs little and a wrong *suppress* costs nothing but a plain (still-correct) text answer.

---

## Source map

**Perception / design:** Cleveland & McGill, *Graphical Perception*, JASA 1984; Heer & Bostock, *Crowdsourcing Graphical Perception*, CHI 2010; Bertin, *Semiology of Graphics*, 1967/1983; Tufte, *The Visual Display of Quantitative Information*, 1983 (and sparklines, *Beautiful Evidence*, 2006); Munzner, *Visualization Analysis & Design*, 2014; Shneiderman, *The Eyes Have It*, 1996. Counter-evidence: Bateman et al., *Useful Junk?*, CHI 2010.

**Learning / cognition:** Mayer (ed.), *Cambridge Handbook of Multimedia Learning* — multimedia, coherence, redundancy, signaling, contiguity, modality, segmenting principles with median effect sizes; Paivio, dual-coding; Sweller, cognitive load theory; Harp & Mayer, seductive details; Rey, seductive-details meta-analysis; Kalyuga, expertise-reversal effect; Schneider et al., decorative-pictures eye-tracking.

**HCI / interaction cost / disclosure:** NN/g — *Clutter-Free Charts* (Moran), *Progressive Disclosure* (Nielsen), *Interaction Cost* (Budiu), *AI: First New UI Paradigm in 60 Years* and *Generative UI & Outcome-Oriented Design*; Pirolli & Card, *Information Foraging*, 1999; Krug, *Don't Make Me Think*, 2000.

**Auto-presentation / adaptive UI:** Mackinlay, *APT*, ACM ToG 1986; Mackinlay, Hanrahan & Stolte, *Show Me*, IEEE TVCG 2007; Wongsuphasawat et al., *Voyager* (2016) / *Voyager 2* (2017); Moritz et al., *Draco*, IEEE TVCG 2019; Dibia & Demiralp, *Data2Vis*, 2018; Gajos & Weld, *SUPPLE*, IUI 2004 / AIJ 2010; Gajos et al., *Predictability & Accuracy in Adaptive UIs*, CHI 2008; Findlater et al., *Ephemeral Adaptation*, CHI 2009; Beaudouin-Lafon, *Instrumental Interaction*, CHI 2000.

**Generative UI (frontier):** NN/g generative-UI articles; Vercel AI SDK 3.0 generative UI; Thesys C1; Google Research, *Generative UI* (Gemini 3, Nov 2025); Anthropic Artifacts (system-prompt ~15-line heuristic); OpenAI Canvas (~83% trigger target); MCP-UI + official MCP Apps (SEP-1865, Nov 2025); plus accessibility/modality preprints (SwitchGPT, MLLM-Tool). Untraceable stat flagged: 40.5%/50.9% chat-failure figures.

---

## Addendum (2026-06-01) — amendments from the live stress test

Running the framework against this session's own outputs surfaced three gaps that theory alone had missed; the governance doc was patched accordingly.

1. **Explicit request ≠ unprompted (new Rule 0).** The literature above is all about the *unprompted* decision, but in practice most rendering is *requested*. When the user asks for a visual they've pre-paid the attention cost, so the default-to-text bar is waived — but selection, economy, and anti-pattern rules still bind. (No new source; a scope clarification the empirical data forced.)

2. **"Behavioral proof / live demonstration" is a distinct, strongest-class trigger.** A visual that *demonstrates a dynamic behavior text can only assert* (e.g., "motion persists across a re-render") is the highest-value case. Two anchors:
   - **Tversky, Morrison & Bétrancourt (2002), "Animation: can it facilitate?"** *IJHCS.* The **Congruence Principle** — a graphic's format should match the concept's format — means animation is justified for concepts of *change/process*, and is **not** superior to a static graphic otherwise. This becomes the guardrail: animate/interact only when the information itself is dynamic. https://hci.stanford.edu/courses/cs448b/papers/Tversky_AnimationFacilitate_IJHCS02.pdf — *Confidence: high (foundational, widely cited).*
   - **Bret Victor (2011), "Explorable Explanations" / reactive documents.** Names the interactive demonstration — let the reader manipulate and see consequences — as a distinct purpose: making the abstract concrete and verifiable. https://worrydream.com/ExplorableExplanations/ — *Confidence: high as influential primary; it is design philosophy, not an effect-size study.*

3. **Cards/panels are for data, not prose (new selection rule + anti-pattern).** Several session outputs wrapped full sentences in cards — boxes that add visual cost while encoding nothing. Rule added: if card content is sentences rather than comparable scannable units (a metric/status/option), use a list or table. (Follows directly from Tufte's data-ink / NN/g signal-to-noise; no new source needed.)

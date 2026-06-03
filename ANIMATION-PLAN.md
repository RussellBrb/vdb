# VDB Animation Engine — Action Plan (simple-first)

*Synthesis of 4 research threads (animation principles · kinematics · animation tech · authoring models) against what we've already built. Goal: freestyle mechanical, moving, toggleable concept animations (like the pen/pump) — simple + effective, dependency-free.*

## The convergence — one tiny model
Engineering, animation, and web tech independently point at the SAME minimal representation:
- A mechanism = **parts + pivots/joints + a parent hierarchy**, driven by **one parameter** (phase `t` / angle `θ`). Kinematic diagrams are literally a parts+joints graph; most teaching mechanisms are **1-DOF** (one drive sets every pose).
- Drive **forward (FK)** from θ; **never solve/invert** (IK is costly, glitchy). Child transform = parent × local → coupling for free.
- **Fake-but-reads-right** per-primitive formulas: piston `x≈r·cosθ`; gear `θ_out=−(N_in/N_out)θ`; rack `x=kθ`; cam `lift=profile(θ)` (+dwell). Closed loops (four-bar) are the ONLY case needing a solver — defer/pre-bake.
- **Compile declarative behaviors → CSS `@keyframes`** animating only `transform`/`opacity` (GPU, survives main-thread load). Never SMIL (deprecated, not accelerated) or rAF loops; avoid Lottie-style baked frames (bulky, re-export to retune).
- **Toggles = reactive state** (Rive inputs / finite-state-machine / Tangle "declare variables + update rule") — **which we already have** (`state`/`controls`/`when` + idempotent re-render).
- Authoring = **small behavior vocabulary as start→end interpolations** (Manim) + a **curated parametric primitive library** (Diagrammar — validated making thousands of diagrams) + **declare, don't frame**, with heavy defaults.

## What we already have (the hardest part is done)
- `motion`: parts + keyframe `frames` + play/pause/step + autoplay + persistence.
- **Reactive `state`/`controls`/`when`** — the exact toggle substrate the research recommends.
- `stepper` — author-defined phases = staged progressive disclosure.
- MPRESETS (`pen-click`/`pump`/`toggle`); `pump` is already parametric — the seed of a primitive library.

## The gap → the build
1. **Behavior layer** (replaces hand-frames): per-part `behaviors` — `rotate{center,period}`, `oscillate{axis,amp,period,phase}`, `pulse{prop,period}`, `flow{path,period}`. Compile to CSS `@keyframes` (transform/opacity). Declarative, parametric, re-tunable by editing one number.
2. **FK coupling**: parts gain optional `pivot` + `parent`; child inherits parent transform. One drive animates a whole linkage — no solver.
3. **Primitive library** (`MECH` registry, like MPRESETS): gear · lever/pivot · piston (slider-crank) · cam (profile+dwell) · rack-pinion · spring · fluid-flow · toggle-switch — each parametric, driven by one θ via the fake formulas. Pull by name + params + compose.
4. **Toggles**: reuse `state`/`controls`/`when` — gate a behavior or switch a part config A/B by a state param (switch flips flow, valve opens/closes).
5. **Steps**: reuse `stepper` — name phases; segmented auto-pause at each (intake→compress→output).

## Principle-driven defaults (bake in)
- Easing **ease-in-out** default; `linear` opt-in for rigid parts (conveyor).
- 3–12 frames/cycle; autoplay ~60–150 ms/frame; ≥300 ms to force discrete-step reading.
- Phase duration ~300–500 ms; expose a speed control.
- **Causal coupling:** driven part starts within **~140 ms** of its driver (Michotte); driven velocity ≤ driver for a "push" reading; stagger linkage offsets inside that window.
- Pause/step/replay are mandatory (Apprehension), default to **segmented auto-pause** at named phases.
- **No decorative motion** — every moving part must carry meaning (coherence).

## Simplicity guardrails
- **v1 = independent + parented FK motion, NO closed-loop solving** — covers ~80% (pen, pump, gears, pistons, levers, cams, flow, switches).
- **v2 (deferred)** = closed-loop linkages (four-bar) via pre-baked path or a tiny solver; more primitives.
- Reuse don't rebuild: toggles=state, steps=stepper, playback=motion controls.
- Dependency-free; compile to CSS; no SMIL/rAF/physics. Existing `motion`/`frames` stays as the escape hatch (backward compatible).

## Build sequencing (Codex builds · Claude designs+reviews)
- **Phase A (v13):** behavior layer + FK pivots/parent + compile-to-CSS, proven on 2 primitives (gear, piston). Harness: behaviors render, CSS valid, **default-equivalence** (existing motion unchanged), contrast.
- **Phase B (v14):** full primitive library + toggle/step bindings + catalog examples.
- **Phase C (later):** closed-loop linkages if needed.

## Acceptance
A mechanism authored as parts+behaviors+pivots renders, animates (CSS), steps, and toggles via state; principle defaults applied; no rAF/SMIL/deps; harness green incl. default-equivalence + contrast.

---

## Motion quality baseline (v13.1 — REQUIRED, learned from live use)
The foundation animates, but the baseline was **dizzying / sporadic** with **overlapping labels**. A calm, smooth default is a hard requirement, not polish:
- **Easing by behavior type:** continuous `rotate`/`flow` → `linear` + `infinite` (constant, smooth — never stepped/jittery); `oscillate`/reciprocation + `pulse` → `ease-in-out` (no hard reversals).
- **Gentle default speeds:** slow the defaults — full gear rotation **~4–6 s**, piston reciprocation **~2–3 s**. Fast = dizzying. Expose a speed multiplier (don't force authors to fight defaults).
- **Coordinated phase:** drive a mechanism's parts from **ONE shared phase** so motion reads connected, not desynced/sporadic.
- **Calm amplitude:** modest movement; nothing whipping around.
- **Honor `prefers-reduced-motion`:** auto-pause or slow to near-still when the OS setting is on (comfort + a11y).
- **No overlapping labels:** offset, or label only key parts (reuse the flow-stagger discipline). The gear/piston presets currently collide (`piston`/`guide`).
- **Process:** motion quality is a **human-eye review** — the harness can't judge "pleasant." Every primitive must be eyeballed at default speed before ship; the default must look calm and smooth.

### v13.2 refinements (from live review)
- **Err slow:** defaults still ~20% too fast — gear ~5–7 s/rev, piston ~2.5–3.5 s. Calm beats brisk.
- **No edge clipping:** the motion `viewBox` must include each part's **full motion excursion** (rotation radius / oscillation range / flow path) **plus margin**, and the motion svg/container must be `overflow:visible`. Lay preset parts with margin from bounds so nothing clips at corners.

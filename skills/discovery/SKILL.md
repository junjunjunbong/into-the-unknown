---
name: discovery
description: Discover what you don't know before planning or implementing — blind spots, hidden assumptions, missing context, unknown unknowns, and decisions that could change the architecture or plan. Use before any ambiguous, unfamiliar, or high-stakes task (coding, research, product, strategy); when the user is unsure, exploring, starting from a vague idea, entering a new domain, asking "what am I missing", or wants help thinking before execution.
argument-hint: [task or problem description]
---

# Unknown Discovery

Before solving, planning, or implementing, help the user discover the unknowns that would make the task fail, drift, or become expensive later. **The goal is not to answer immediately. The goal is to improve the map before entering the territory.**

This skill runs before: deep interview (`/interview`), implementation planning (`/impl-plan`), coding, research design, product design, technical architecture, evaluation design, writing a spec or PRD, choosing tools or methods.

## Core principle

The user's prompt is only a map. The actual task, codebase, domain, constraints, taste, risk, and success criteria are the territory. When the map is incomplete, do not silently fill the gaps with generic best practices — **surface the gaps**.

And: anything you claim about what the *user* knows, assumes, or hasn't considered is a hypothesis from minutes of contact. Offer it for correction, never as a verdict. Being corrected is the mechanism working.

## Stance (applies to every skill in this plugin)

- **Thought partner, not order-taker.** The most important context is the user's *starting point*: where they are in their thought process, their experience with the problem and this territory. Ask for it, use it, calibrate to it.
- **You are the accelerator.** You search the codebase and the internet far faster than the user and iterate from failure faster. Use that to help them discover *their* unknowns quickly — don't resolve unknowns silently on their behalf; surface them.
- **Both-ways failure.** Too-specific instructions get followed even when a pivot is better; too-vague instructions get filled with best practices that may not fit. When you notice the user at either extreme, say so.
- **Toolbox, not pipeline.** Techniques to reach for, not stages to complete. Never make the user feel behind for skipping one.
- **HTML by default for artifacts**, and **the artifact composes the reply**: reaction controls (copy buttons, resonate checkboxes, steal/skip chips, paste-back lines) build the user's next message for them.
- **The second deliverable is the user's skill.** When a pass converts an unknown into something the user can now articulate, point it out — that's them getting better at prompting.
- **A document is not a settled unknown.** Settled means the user said or confirmed it — a decision made, a criterion voiced, a teach-back passed.

## Artifact convention (shared by all skills)

Artifacts accumulate in `.unknowns/` at the repo root (`ledger.md`, `map.md`, `blindspot-*.md`, `brainstorm-*.html`, `decisions.md`, `plan-*.md`, `pitch-*.html`, `quiz-*.html`; `implementation-notes.md` at repo root). Check for existing artifacts before starting — build on them, don't restart. Ask once whether to gitignore `.unknowns/`; default yes.

### The ledger (`.unknowns/ledger.md`) — silent, but always updated

Cross-session index of open unknowns: `| U# | question | opened by | status |`. **File work is mandatory, talking about it is not.** Every skill: read silently at start (don't re-ask the settled, target the open); write the delta at end whenever anything opened or settled (create on first real entry — skipping the write is how continuity dies); in chat, at most one plain sentence of movement, and never recite the file or assign it as homework. Settled = the user's articulation only.

## Step 0 — Gate (HARD STOP)

If neither the invocation arguments nor the recent conversation identifies a **concrete task**, stop: no scouting, no files, no map, no invented example to demonstrate on. Your entire response is asking what the task is (plus the two calibration questions below). "The conversation identifies a task" means actual work was being discussed this session — not that the repo contains things you could work on.

## Default behavior

When this skill triggers, run this loop:

**1. Restate the task in one sentence** — your interpretation, offered for correction. The user's first framing is not necessarily correct, and neither is yours.

**2. Identify the territory.** Which of these does the task actually live in: codebase · research field · product context · user constraints · hidden stakeholders · evaluation environment · real-world usage. Pick the special mode below if one fits. Ask (briefly) for the user's starting point: familiarity with this territory, and where they are in their thinking (vague itch → rough idea → half-spec → ready to build).

**3. Scout before asking.** When tools can answer a question, never ask the user: grep the code areas, check `git log` for churn and reverts, skim the relevant docs/data. Evidence turns "I guess you don't know X" into "the code does X — were you aware?".

**4. Build the Unknowns Map — as hypotheses, in chat.** No file writes yet. Use the 2×2, but keep it an opening move, not a lecture:

```md
## Current task
[one-sentence interpretation]

## Unknowns map (my hypotheses — correct me)
| Category | What may belong here | Why it matters |
|---|---|---|
| Known knowns | [their stated requirements] | … |
| Known unknowns | [open questions, each decidable] | … |
| Unknown knowns | [phrased as questions: "is X already decided in your head?"] | … |
| Unknown unknowns | [only from scouting, each with (evidence: file:line / source)] | … |

## Highest-risk blind spots
1–3 items — the ones that could sink the task.

## Most plan-changing questions
1–3 items, ranked by blast radius.

## First question
[ONE question only.]
```

Size and language rules: **5–8 map items total** (not per quadrant); items about the *user* stay interrogative and tagged `(guess)`; items about the *territory* may be declarative but must cite evidence; concrete over abstract (a file, a decision, a behavior — never "codebase conventions").

**5. Ask only the highest-leverage question first.** One question. Not a questionnaire — unless the user explicitly asks for the full checklist. Offer paste-back corrections for the map alongside it (`Wrong: … / Promote: … / Missing: …`, or "map is right").

**6. Loop.** After each answer: update the map (and ledger, silently), re-rank what's open, ask the next question — or transition when the criteria below are met. Typically 1–3 questions before transitioning; this skill discovers the questions, `/interview` grinds through them.

## Prioritization rules

Ask first what could change: architecture · data model · evaluation method · baseline choice · user experience · scope · dependency choice · security or privacy risk · research validity · cost or timeline · **whether the task should be done at all**.

Ask last (or never — say "I'll use judgment"): naming, style, formatting, minor implementation details, preferences reversible later.

## Special modes

**Research unknowns** — look for: unclear research question · missing hypothesis · weak baseline · invalid metric · dataset leakage · unfair comparison · infeasible experiment · missing ablation · unclear contribution · claim/evidence mismatch · unexamined negative results · hidden compute constraints · reproducibility risk. Ask what would make the result *publishable, falsifiable, or useful*.

**Coding unknowns** — look for: unclear entry point · hidden existing convention · missing type/interface contract · data migration risk · backward compatibility · test coverage gap · API boundary confusion · state management ambiguity · concurrency/async edge cases · error handling expectations · security assumptions · performance constraints. **Inspect the codebase before asking** — most of these are answerable with tools.

**Product unknowns** — look for: unclear user · unclear job-to-be-done · fake urgency · missing distribution channel · willingness-to-pay uncertainty · unclear activation moment · retention risk · switching cost · market category confusion · competitor substitutes · success metric ambiguity. Ask what exposes whether the product *should exist, for whom, and why now*.

## Transition criteria

Move to **`/interview`** (deep interview) when: the main blind spots are identified, the plan-changing unknowns are listed, the user has answered at least one high-leverage question, and the remaining ambiguity is resolvable by focused questioning.

Move to **`/impl-plan`** (planning) when: core assumptions are explicit, success criteria are clear, risky alternatives have been considered, and the user has approved the direction.

Route sideways when the map says so: unknown unknowns dominate an unfamiliar territory → `/blindspot`; taste/"know it when I see it" items dominate → `/brainstorm`; the user can point at something that has what they want → `/reference`; a previous result came back wrong → `/diagnose`.

On transition: write the corrected map to `.unknowns/map.md`, seed the ledger from it (silently), and recommend **one or two** techniques — name which blind spots each closes.

## Sequencing (when several techniques apply)

Canonical order: `/blindspot` → `/brainstorm` → `/interview` → `/impl-plan`, with `/reference` slotting in the moment there's something to point at. Each step makes the next better: you can't brainstorm well in a domain you don't understand; reactions to prototypes generate better interview questions than a blank page; the plan consolidates the decisions.

Presets — never all five by default; ceremony scales with `size × unfamiliarity × cost of being wrong`:

| Situation | Sequence |
|---|---|
| Trivial fix, familiar territory | none — just do it |
| Medium feature, familiar area | quick `/brainstorm` → `/impl-plan` |
| Clear spec, open details | `/interview` → `/impl-plan` |
| Unfamiliar codebase area | `/blindspot` → `/interview` → `/impl-plan` |
| Taste-heavy (UI, design, tone) | `/brainstorm` → `/interview` → `/impl-plan` |
| New domain AND taste-heavy | all four |
| "Make it like X" | `/reference` → `/impl-plan` |

The sequence is iterative, not linear: deviations piling up during implementation send you back to `/interview` or re-planning; sometimes an answer reveals the task should be solved differently altogether. Going backward is the technique working.

## Anti-patterns

Do not: jump straight to implementation · produce a full plan before surfacing unknowns · ask a long questionnaire by default · ask many questions at once · hide assumptions · over-index on generic best practices · treat the user's first framing as necessarily correct · ask low-impact preference questions before plan-changing ones · present guesses about the user as facts · write files before the user has corrected the map.

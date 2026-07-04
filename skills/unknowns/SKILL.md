---
name: unknowns
description: Map out the user's knowns and unknowns for a task and recommend which finding-unknowns technique to use next. Use when the user is starting a project or task and isn't sure how to scope it, says "I don't know where to start", or asks to "find my unknowns".
argument-hint: [task or problem description]
---

# Finding Your Unknowns

The map is not the territory. The map is the user's prompt, skills, and context — what they give you. The territory is where the work actually happens: the codebase, the real world, its actual constraints. The gap between them is **unknowns**, and when you hit an unknown you're forced to guess. The quality of long-horizon work is bottlenecked by how well the user's unknowns get clarified — before, during, and after implementation.

Your job in this skill: build a concrete unknowns map for THIS task, then route the user to the right technique. The map must be task-specific — a generic 2×2 with abstract labels is a failure.

## Artifact convention (shared by all finding-unknowns skills)

Artifacts from this plugin's skills accumulate in `.unknowns/` at the repo root, so later skills can pick up where earlier ones left off:

```
.unknowns/
  map.md               ← this skill
  blindspot-<topic>.md ← /blindspot
  brainstorm-<topic>.html
  decisions.md         ← /interview (append-only decision record)
  plan-<topic>.md
  pitch-<topic>.html
  quiz-<topic>.html
implementation-notes.md  ← /impl-notes (repo root, per the original article)
```

Before starting, check whether `.unknowns/` already has artifacts for this task — if so, read them first and build on them instead of restarting. Ask once whether to gitignore `.unknowns/`; default to adding it to `.gitignore`.

## Step 1 — Understand the starting point

If the task isn't clear from `$ARGUMENTS` or the conversation, use AskUserQuestion (or plain questions) to establish, briefly:

1. The task, in their words.
2. Their familiarity: **codebase area** (never touched / read it / written in it) and **domain** (new to me / conversational / expert).
3. Where they are in their thought process: vague itch → rough idea → half-spec → ready to build.

Don't interrogate — three answers is enough to calibrate. Their familiarity level determines which quadrant of the 2×2 will dominate.

## Step 2 — Scout the territory (lightly)

Spend a few minutes grounding the map in reality before writing it:

- Grep/glob the codebase areas the task touches. Note module boundaries, existing similar features, and obvious conventions.
- Check `git log --oneline -15 -- <area>` for recent churn or reverted attempts.
- If the task involves an unfamiliar domain concept, do one quick pass to know what the sub-decisions are.

This is scouting, not a full blindspot pass — just enough that the unknown-unknowns quadrant contains real items, not placeholders.

## Step 3 — Build the 2×2 map

Write `.unknowns/map.md` and show it to the user:

| Quadrant | Definition | What goes here |
|---|---|---|
| **Known knowns** | What's already in the prompt. | Restate their stated requirements as bullet points. If a "requirement" is actually ambiguous, move it down a row. |
| **Known unknowns** | What they haven't figured out yet, and know they haven't. | Open questions they've voiced or implied. Phrase each as a decidable question. |
| **Unknown knowns** | So obvious they'd never write it down, but they'd recognize it if they saw it. | Taste, house conventions, "like our other pages", implicit users/scale. Flag these as *assumptions you would otherwise guess at*. |
| **Unknown unknowns** | Not considered at all. | From your scouting: prior art in the codebase, constraints they haven't hit yet, what "good" looks like in this domain, potholes. |

Rules for a useful map:
- Every item names something concrete (a file, a decision, a behavior) — "the auth module uses per-tenant keys, your plan assumes global" not "codebase conventions".
- 3–7 items per quadrant. If a quadrant is empty, say why (e.g. "you're expert here — thin quadrant").
- Mark the 2–3 items with the biggest blast radius with ⚠ — these drive the routing.

## Step 4 — Route to the next technique

Recommend based on which quadrant holds the ⚠ items:

- **Unknown unknowns** dominate (new domain / unfamiliar code) → `/blindspot` — learn the territory before deciding anything.
- **Unknown knowns** dominate ("I'll know it when I see it", visual taste, fuzzy scope) → `/brainstorm` — produce options and prototypes to react to.
- **Known unknowns** dominate (clear task, open decisions) → `/interview` — resolve them one question at a time.
- User can't articulate the want but can point at something that has it → `/reference`.
- Map is mostly known knowns → `/impl-plan`, then implement with `/impl-notes`.
- Work already done → `/pitch` for buy-in, `/quiz` before merge.

## Step 5 — Sequence the pre-implementation techniques

When more than one technique applies, the canonical order is:

```
/blindspot → /brainstorm → /interview → /impl-plan
                 (/reference slots in wherever the pointing happens)
```

Each step exists to make the NEXT one better — that's the whole ordering logic:

1. **`/blindspot` before `/brainstorm`**: brainstorming in a domain you don't understand produces generic options. Learn what "good" looks like first, then the options get sharp.
2. **`/brainstorm` before `/interview`**: interviewing before options exist locks in the first framing. Reactions to prototypes generate better questions than a blank page — and answer many of them for free.
3. **`/interview` before `/impl-plan`**: the plan must honor decisions, so make the decisions first. A plan full of `[OPEN]` markers is an interview that didn't happen.
4. **`/reference` is positional, not sequential**: run it the moment the user points at something — its semantics map replaces a whole cluster of interview questions ("behave like that").
5. **`/impl-plan` is the gate**: if any other pre-implementation technique ran, always finish with the plan — it's where their outputs (blindspot rewrite, criteria, decisions, semantics map) get consolidated into the artifact the implementing session receives.

**Never recommend all five by default.** Ceremony must scale with `task size × unfamiliarity × cost of being wrong`. Each technique is cheap relative to a wrong implementation, but not free relative to a small task. Presets:

| Situation | Sequence |
|---|---|
| Trivial fix, familiar code | none — just implement |
| Medium feature, familiar area | quick `/brainstorm` (scope check) → `/impl-plan` |
| Clear spec handed to you, open details | `/interview` → `/impl-plan` |
| Feature in an unfamiliar part of the codebase | `/blindspot` → `/interview` → `/impl-plan` |
| Taste-heavy work (UI, design, tone) | `/brainstorm` → `/interview` → `/impl-plan` |
| Entirely new domain AND taste-heavy | full stack: `/blindspot` → `/brainstorm` → `/interview` → `/impl-plan` |
| "Make it like X" | `/reference` → `/impl-plan` |

Skip rules (state them when you skip): skip `/blindspot` when the user is fluent in both the domain and this codebase area; skip `/brainstorm` when the solution shape is already fixed (bug fix, spec dictated from above); skip `/interview` when no Tier-1 questions survived brainstorming; skip `/impl-plan` only when the change is small enough that the diff itself is reviewable in one sitting.

**The sequence is iterative, not linear.** Unknowns found deep in implementation (via `/impl-notes` deviations) can send you back — a pileup of deviations means return to `/interview` or re-plan rather than improvising forward. Sometimes an interview answer reveals the problem should be solved a different way altogether; going backward is the technique working, not failing.

Recommend **one or two** techniques (plus the closing `/impl-plan` if any ran), name which ⚠ items each closes, and offer to run the first one now. The skill of agentic coding is knowing which gaps are worth closing.

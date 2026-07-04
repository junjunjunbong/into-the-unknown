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

Recommend **one or two** techniques, name which ⚠ items each one closes, and offer to run the first one now. Do not run every technique; the skill of agentic coding is knowing which gaps are worth closing.

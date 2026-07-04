---
name: unknowns
description: Map out the user's knowns and unknowns for a task and recommend which finding-unknowns technique to use next. Use when the user is starting a project or task and isn't sure how to scope it, says "I don't know where to start", or asks to "find my unknowns".
---

# Finding Your Unknowns

The map is not the territory. The map is the user's prompt, skills, and context — what they give you. The territory is where the work actually happens: the codebase, the real world, its actual constraints. The gap between them is **unknowns**, and when you hit an unknown you're forced to guess. The quality of long-horizon work is bottlenecked by how well the user's unknowns get clarified — before, during, and after implementation.

Your job in this skill: help the user map their unknowns for the task at hand, then route them to the right technique.

## Step 1 — Understand the starting point

Ask the user (briefly, don't interrogate) or infer from context:

- What is the task, in their words?
- How familiar are they with this part of the codebase / this domain?
- Where are they in their thought process — vague idea, rough spec, or ready to build?

## Step 2 — Classify into the 2×2

Break the task down four ways and present it to the user:

| | |
|---|---|
| **Known knowns** | What's already in the prompt — what they've told you they want. |
| **Known unknowns** | What they haven't figured out yet, but know they haven't. Open questions. |
| **Unknown knowns** | What's so obvious to them they'd never write it down, but they'd recognize it if they saw it (taste, conventions, "I'll know it when I see it"). |
| **Unknown unknowns** | What they haven't considered at all. Prior art, potholes, what "good" even looks like here. |

Fill in each quadrant with concrete, task-specific items. Search the codebase if needed to make the unknown-unknowns quadrant real rather than generic.

## Step 3 — Recommend the next technique

Route based on which quadrant dominates:

- Many **unknown unknowns** (new domain, unfamiliar codebase area) → run a **blindspot pass** (`/blindspot`).
- Many **unknown knowns** ("I'll know it when I see it", visual/design taste, fuzzy scope) → **brainstorm & prototype** (`/brainstorm`).
- Remaining **known unknowns** after brainstorming → have Claude **interview** the user (`/interview`).
- The user can't describe what they want but can point at something that has it → use a **reference** (`/reference`).
- Ready to build → write an **implementation plan** that leads with the decisions most likely to change (`/impl-plan`), then implement with **implementation notes** (`/impl-notes`).
- Done building → package a **pitch** for buy-in (`/pitch`) and take a **quiz** before merging (`/quiz`).

Don't run every technique every time — recommend the one or two that close the biggest gaps, explain why, and offer to run them now.

## Principles

- Instructing Claude is a balance: too specific and Claude follows instructions even when a pivot is better; too vague and Claude falls back on industry best practices that may not fit.
- Give context about the starting point: where the user is in their thought process, their experience with the problem and codebase. Work like a thought partner.
- Every explainer, brainstorm, interview, prototype, and reference is a cheap way to find out what you didn't know before it gets expensive to fix.

---
name: blindspot
description: Run a blindspot pass to surface the user's unknown unknowns before starting work. Use when the user is entering an unfamiliar codebase area or domain, says "blindspot pass" or "unknown unknowns", or wants to learn enough about a topic to prompt better.
---

# Blindspot Pass

When the user starts work in a new part of the codebase or an unfamiliar domain, they have unknown unknowns: they don't know what questions to ask, what "good" looks like, what historical work exists, or what potholes to avoid. Your job is to find those blindspots and teach them — so they can prompt better, not so you can do the work for them yet.

## Step 1 — Calibrate to the user

Establish (from the conversation, or by asking one short question) who the user is and what they already know. A blindspot pass for someone who knows nothing about auth is different from one for someone who's built auth elsewhere but is new to this codebase. Context about who they are and what they know shapes everything below.

## Step 2 — Explore the territory

Investigate wherever the unknowns live:

- **Codebase**: read the relevant modules, their conventions, abstractions, and extension points. Check git history for past attempts, reverts, and TODOs in the area.
- **Domain**: if the blindspot is a topic (e.g. "I don't know what color grading is"), research it enough to teach the parts that matter for their task.
- **Both**, usually.

## Step 3 — Report the blindspots

Produce a report (offer an HTML artifact for anything long) organized so the user learns fastest:

1. **The mental model** — the 3–5 concepts they need to reason about this area at all.
2. **What good looks like** — how quality is judged here; what an expert would immediately check.
3. **Historical work & prior art** — what already exists in the codebase or field that they'd otherwise reinvent or contradict.
4. **Potholes** — the mistakes people make in this area, and constraints that aren't obvious (perf, security, compat, conventions).
5. **Questions they didn't know to ask** — the decisions hiding in this task, phrased as questions with a short "why this matters".

## Step 4 — Help them prompt better

End by drafting an improved version of their original prompt that accounts for what was just uncovered — filled-in constraints, explicit choices where there were silent assumptions, and open questions marked as such. Offer to proceed with it or to run `/interview` on the remaining open questions.

Do NOT start implementing during a blindspot pass. The deliverable is understanding.

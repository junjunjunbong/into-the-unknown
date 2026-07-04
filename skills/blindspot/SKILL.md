---
name: blindspot
description: Run a blindspot pass to surface the user's unknown unknowns before starting work. Use when the user is entering an unfamiliar codebase area or domain, says "blindspot pass" or "unknown unknowns", or wants to learn enough about a topic to prompt better.
argument-hint: [area or topic you're blind on]
---

# Blindspot Pass

> **No-input gate:** if invoked with no arguments and the conversation doesn't already identify the area or topic the user is blind on, your entire response is one question asking for it. Do not write files, produce artifacts, or demonstrate on an invented example until it's named.

When the user starts work in a new part of the codebase or an unfamiliar domain, they have unknown unknowns: they don't know what questions to ask, what "good" looks like, what historical work exists, or what potholes to avoid. Your job is to find those blindspots and **teach them** — so they can prompt better. The deliverable is understanding, not code. Do NOT start implementing during a blindspot pass.

## Step 1 — Calibrate to the user

A blindspot pass for someone who knows nothing about auth is different from one for someone who's built auth elsewhere but is new to this codebase. Establish from the conversation (or one AskUserQuestion) two axes:

- **Domain knowledge**: none / conversational / worked in it elsewhere / expert
- **This-codebase knowledge**: none / read it / written in it

Then state your calibration in one line ("You know OAuth but not our provider abstraction — I'll skip OAuth basics and focus on how this codebase does it") so the user can correct you before you spend effort in the wrong direction.

## Step 2 — Explore the territory

Run the exploration concurrently where possible (parallel searches / an Explore agent for breadth). Cover whichever apply:

**Codebase blindspots**
- Map the relevant modules: entry points, core abstractions, extension points. Note the *intended* way to add what the user wants to add.
- Conventions: how do the 2–3 most recent similar features do it? (naming, error handling, test placement, feature flags)
- History: `git log --oneline --follow` on the key files; look for reverts, "fix"-storms, and TODO/FIXME/HACK comments in the area — each is a pothole someone already hit.
- Coupling: what else breaks if this area changes? Search for importers/callers of the key interfaces.
- Tests & tooling: how is this area tested, and what's the fast feedback loop?

**Domain blindspots** (when the topic itself is unfamiliar — "I don't know what color grading is")
- Identify the 3–5 concepts an expert uses to think about this domain.
- Identify the standard quality criteria — what would an expert immediately check?
- Identify the standard tools/algorithms/approaches and when each applies.
- Web-search when your own knowledge might be stale or thin; say when you did.

## Step 3 — Report the blindspots

Write the report to `.unknowns/blindspot-<topic>.md` using [templates/report-template.md](templates/report-template.md) as the skeleton, and give the user a condensed version in chat. For long reports, offer a self-contained HTML version instead. Ordering matters — teach fastest first:

1. **The mental model** — the 3–5 concepts needed to reason about this area at all. One short paragraph each, with a codebase example where possible.
2. **What good looks like** — how quality is judged here; the checklist an expert reviewer would apply.
3. **Historical work & prior art** — what already exists (in the codebase or the field) that they'd otherwise reinvent or contradict. Cite `file:line`.
4. **Potholes** — mistakes people make here, non-obvious constraints (perf, security, compat, conventions), and any reverts/hacks you found with their story.
5. **Questions they didn't know to ask** — the decisions hiding in this task, each phrased as a question + one line on why it matters. This section feeds `/interview` directly.

Quality bar: every item must be *specific to this codebase or task*. "Auth is security-sensitive" is filler; "all three existing providers implement `refreshToken()` even though the interface marks it optional — yours probably needs to" is a blindspot.

## Step 4 — Help them prompt better

End with a **rewritten prompt**: take their original ask and produce the version they *would* have written knowing all of the above — constraints filled in, silent assumptions made explicit, remaining open questions marked `[OPEN]`.

Show it as before/after so the user sees what the pass bought them. Then offer:
- `/interview` to resolve the `[OPEN]` markers, or
- proceed straight to `/impl-plan` with the rewritten prompt if few remain.

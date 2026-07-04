---
name: diagnose
description: When a long-horizon task comes back wrong, trace which unknown caused the miss and which technique would have caught it, then set up the retry. Use when the user says "this isn't what I wanted", a big change misses the mark, or a session's result came back wrong.
argument-hint: [what came back wrong]
---

# Diagnose a Misfire

> "When a long-horizon task comes back wrong, it's likely you need to spend more time defining your unknowns or creating an implementation plan that allows for Claude to improvise through them."

A wrong result is not (usually) a model failure — it's **data about the gap between the map and the territory**. The instinct is to patch the prompt and rerun; resist it until you know which unknown caused the miss, or the retry inherits the same gap. Each diagnosed misfire also converts an unknown into intuition — this is how the user gets better at agentic coding, which is the real long game.

## Step 1 — Locate the earliest divergence

Compare three things: what was **asked** (the prompt/plan), what was **built**, and what was **wanted** (ask the user to describe the miss in their own words — "wrong how?").

Then find the *earliest* point where the work went somewhere the user didn't want:

- Read `implementation-notes.md` Deviations first — misfires often live in a logged deviation where the conservative guess was still the wrong guess.
- Check `.unknowns/decisions.md` and the plan: was the fatal choice recorded anywhere, or was it never surfaced as a choice at all?
- Walk the diff / conversation backward from the wrong outcome to the first decision that presupposed it.

Name the divergence in one sentence: "At {point}, Claude assumed {X}; you wanted {Y}."

## Step 2 — Classify the missed unknown

Which kind of gap was it? Each kind has a different fix:

| The miss | Diagnosis | What would have caught it |
|---|---|---|
| "It's obvious I wanted X — I just never said it" | **Unknown known** (taste/assumption never verbalized) | `/brainstorm` — a prototype would have triggered the reaction earlier |
| "Good question, I never decided that" | **Known unknown** (open question nobody answered) | `/interview` — it was an askable Tier-1/2 question |
| "Neither of us could have known — the codebase/domain surprised us" | **Unknown unknown** (territory surprise) | `/blindspot` up front, or a plan with wider **improvisation room** + `/impl-notes` escalation |
| "You did exactly what I said, and it was the wrong thing" | **Over-specification** — instructions followed off a cliff | State intent, not steps; give the plan improvisation room to pivot |
| "You filled the gap with generic best practice that doesn't fit here" | **Under-specification** | `/reference` or explicit criteria — generic-in means generic-out |

Tell the user the classification plainly, including when the diagnosis is "the prompt was fine; this one's on the execution" — false self-blame teaches the wrong lesson too.

## Step 3 — Bank the lesson

Before any retry:

- Append the newly-verbalized criterion or decision to `.unknowns/decisions.md` — the retry must inherit it for free.
- Write the one-line lesson in the form *"next time, {technique} before {phase}"* (e.g. "next time, prototype the empty state before wiring data"). If the same lesson has appeared before, say so — a repeated lesson means the pre-implementation routine has a systematic hole, not bad luck.

## Step 4 — Route the retry

Scale the retry to the size of the gap:

- **Small gap** (one criterion missed, structure sound) → targeted fix in this session with the banked criterion.
- **Framing gap** (right problem, wrong shape) → back to `/brainstorm` or `/interview` with the diagnosis as input, then re-plan the affected part.
- **Wrong problem altogether** (the miss revealed the task should be solved differently) → back to `/unknowns` and re-scope. Going backward here is the process working, not failing.

Don't rebuild from scratch reflexively — say which parts of the existing work survive the diagnosis and reuse them.

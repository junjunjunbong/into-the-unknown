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

Write the report to `.unknowns/blindspot-<topic>.md` using [templates/report-template.md](templates/report-template.md) as the skeleton, and give the user a condensed version in chat. For long reports, prefer a self-contained HTML version with a [Copy] button per finding and a [Copy prompt] button on the improved prompt (section below) — the artifact should compose the user's next message for them. Ordering matters — teach fastest first:

1. **The mental model** — the 3–5 concepts needed to reason about this area at all. One short paragraph each, with a codebase example where possible.
2. **What good looks like** — how quality is judged here; the checklist an expert reviewer would apply.
3. **Historical work & prior art** — what already exists (in the codebase or the field) that they'd otherwise reinvent or contradict. Cite `file:line`.
4. **Potholes** — mistakes people make here, non-obvious constraints (perf, security, compat, conventions), and any reverts/hacks you found with their story.
5. **Questions they didn't know to ask** — the decisions hiding in this task, each phrased as a question + one line on why it matters. This section feeds `/interview` directly.

**Type every finding** with one of four labels — the label tells the user how to act on it:

- `Landmine` — touch this wrong and something breaks ("sessions are double-written; the Redis store you'll find first is the wrong one")
- `History` — a past attempt/revert/incident that explains why things are the way they are
- `Missing concept` — a domain or codebase concept they need before their prompts can be precise
- `Convention` — an unwritten house rule their work must follow

Each finding renders as: headline (the threat in one sentence) → why it bites → what to do about it → **the constraint sentence**, a single copyable line ready to paste into a prompt.

Quality bar: every item must be *specific to this codebase or task*. "Auth is security-sensitive" is filler; "all three existing providers implement `refreshToken()` even though the interface marks it optional — yours probably needs to" is a blindspot. The test for a good constraint sentence: it's a sentence the user *couldn't have written this morning*, bought with someone else's half-day of pain.

## Step 4 — Teach-back (this is what closes the unknowns)

The report alone closes nothing — reading is not understanding. Before moving on, ask the user **2–3 check questions**, one at a time, drawn from the report's highest-stakes items (the ⚠-grade potholes and the mental-model concepts). Same rules as `/quiz`: test their model of the territory, not recall of the report's wording; plausible distractors if multiple-choice.

- Correct answer, or the user restating the point in their own words → the corresponding ledger entries flip to ✅.
- Wrong or shaky answer → explain again *differently* (new example, codebase walk-through), then a fresh variant later. The entry stays ⏳ open until they can say it back.

Keep it light — this is a 2-minute pulse-check, not an exam. Its purpose is to make the difference between "Claude wrote it down" and "I now know it" visible to the user.

## Step 5 — Help them prompt better

End with **"Your improved prompt"**: take their original ask and produce the version they *would* have written knowing all of the above — the numbered constraint sentences from each finding folded in, silent assumptions made explicit, a suggested implementation sequence, and remaining open questions marked `[OPEN]`. In the HTML version this block gets a [Copy prompt] button; in chat, present it as one clean copyable block.

Show it as before/after so the user sees what the pass bought them. Then offer:
- `/interview` to resolve the `[OPEN]` markers, or
- proceed straight to `/impl-plan` with the rewritten prompt if few remain.

## Unknowns ledger (silent, but always updated)

`.unknowns/ledger.md` is the cross-session index of open unknowns. **The file work is mandatory; talking about it is not.**

- **Start — always**: if the file exists, read it silently. Don't re-ask what's already settled; do target what's open.
- **End — always**: if this pass opened or settled ANY unknown, write the delta to the file before finishing (create the file on its first real entry). This write is non-negotiable — skipping it is how continuity between sessions dies. If nothing opened or settled, leave the file alone.
- **Chat side — quiet**: never recite the ledger, never ask the user to read or maintain it, never block on it. At most one plain sentence of movement ("Settled: dense tables. Still open: conflict policy — defaulting to last-write-wins."), skipped when nothing moved. Mention a `U#` only when it disambiguates.
- **What counts as settled**: an entry settles only when the user passes its teach-back question or restates the point in their own words (Step 4). Settled means the *user* said or confirmed it — writing it into a report does not count.

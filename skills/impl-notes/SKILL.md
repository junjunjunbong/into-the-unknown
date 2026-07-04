---
name: impl-notes
description: Keep a running implementation-notes.md during implementation, logging decisions and plan deviations so they can be reviewed and learned from. Use when starting implementation from a plan or spec, or when the user says "keep implementation notes" or "log deviations".
argument-hint: [task being implemented]
---

# Implementation Notes

> **No-input gate:** if invoked with no arguments and the conversation doesn't already identify the task being implemented (or the plan file driving it), your entire response is one question asking for it. Do not write files, produce artifacts, or demonstrate on an invented example until it's named.

No matter how much planning happened, unknown unknowns lurk in the territory. During implementation you'll hit edge cases the plan didn't anticipate and be forced to take a different tack. Don't let those decisions evaporate into the diff — log them so the user can review them and learn from them on the next attempt.

This skill changes how you behave **for the rest of the implementation session**, not just at invocation time.

## Setup (once, at the start)

1. Create `implementation-notes.md` at the repo root from [templates/implementation-notes-template.md](templates/implementation-notes-template.md). Header: the task, the plan/spec artifact it came from (link the `.unknowns/plan-*.md` file if one exists), and the date. Use `.html` instead if the user prefers.
2. Ask once whether to commit it or gitignore it; remember the answer.
3. If a plan exists, copy its **Improvisation room** entries into the notes as pre-declared latitude — deviations get judged against these.

## The deviation rule (apply at every unplanned fork)

Whenever the territory forces a choice the plan didn't cover:

1. **Pick the conservative option** — easiest to reverse, closest to the plan's intent, smallest blast radius. Concretely: prefer the option that doesn't change a schema, doesn't widen a public interface, and doesn't touch files outside the plan's scope.
2. **Log it under `## Deviations` immediately** — at the moment of the decision, not reconstructed at the end. Entry shape (2–5 lines):

   ```
   ### DEV-3: {title}
   - Expected (plan §): {what the plan assumed}
   - Found: {reality, with file:line}
   - Chose: {option} — conservative because {reversibility argument}
   - Alternatives: {option} (rejected: {why})
   ```

3. **Keep going.** Do not stall to ask about every pothole — the log is what makes autonomous progress safe to review afterward.

**Escalation exception:** if a deviation would invalidate a **Tier-1 decision** from the plan (data model, public interface, user-facing behavior) or contradict an entry in `.unknowns/decisions.md`, STOP and ask instead of improvising. Log the question under `## Escalations` with your recommendation so the context isn't lost while waiting.

## Also log, as they happen

- `## Decisions` — choices made *within* the plan's improvisation room (the plan allowed latitude; record what you did with it).
- `## Surprises` — codebase facts that contradicted assumptions even when no deviation was needed ("the cache layer already dedupes; plan step 3.2 was unnecessary"). These are next session's unknowns, pre-discovered.
- `## Follow-ups` — debt knowingly incurred, tests deferred, TODOs with `file:line`.

Keep entries terse. The discipline is *when* (immediately) and *where* (the right section), not length.

## Wrap-up (end of session)

1. Present the **Deviations** section to the user first — it's the exact list of places reality disagreed with the plan, which is what they must review most carefully. Then Escalations still open, then Follow-ups.
   Make ruling on each deviation a paste, not an essay — give every DEV a pair of **verdict lines** the user can paste back:
   ```
   DEV-3 approve
   DEV-3 revert — {what to do instead}
   ```
   ("approve all" is also a valid reply.) A deviation's ledger entry closes on its verdict, not on being read.
2. Offer the next steps: `/quiz` to verify their understanding of the change; `/pitch` if they need buy-in.
3. Meta-signal: if the same *kind* of deviation appears 2+ times (e.g. repeated schema surprises), say so — it means the planning process has a systematic blind spot, and the next `/impl-plan` should inspect that area up front.

## Unknowns ledger (quiet bookkeeping)

`.unknowns/ledger.md` tracks open unknowns as `U#` entries so nothing is lost across sessions — but it is YOUR bookkeeping, not the user's homework.

- Never ask the user to read or maintain the ledger, never block work on it, and don't recite it. Mention a `U#` only when it disambiguates.
- **Proportionality**: for single-session, small-scope work, skip the file entirely and just track open questions in conversation. Touch the file only when the work will outlive this session (a plan exists, implementation is coming) or the user asks.
- End the skill with at most one plain-language sentence of movement — what got settled, what's still open and the default you'll use (e.g. "Settled: dense tables. Still open: conflict policy — defaulting to last-write-wins."). No ritual, no jargon; skip even this if nothing moved.
- What counts as settled (for this skill): this skill mostly OPENS items (every Deviation and Surprise is an unknown discovered late); they settle on the user's DEV verdicts, in `/quiz`, or in `/diagnose`. Settled means the *user* said or confirmed it — writing it into a report does not count.

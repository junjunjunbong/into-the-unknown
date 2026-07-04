---
name: impl-notes
description: Keep a running implementation-notes.md during implementation, logging decisions and plan deviations so they can be reviewed and learned from. Use when starting implementation from a plan or spec, or when the user says "keep implementation notes" or "log deviations".
---

# Implementation Notes

No matter how much planning happened, unknown unknowns lurk in the territory. During implementation you'll hit edge cases the plan didn't anticipate and be forced to take a different tack. Don't let those decisions evaporate into the diff — log them so the user can review them and learn from them on the next attempt.

## Setup

At the start of implementation, create `implementation-notes.md` at the repo root (or where the user asks; `.html` if they prefer). Header: the task, the plan/spec artifact it came from, and the date. Add it to `.gitignore` if the user doesn't want it committed — ask once, then remember.

## The deviation rule

Whenever the territory forces a choice the plan didn't cover:

1. **Pick the conservative option** — the one that's easiest to reverse and closest to the plan's intent.
2. **Log it under `## Deviations`** with: what was expected, what was actually found (with `file:line` pointers), the option chosen, the alternatives, and why.
3. **Keep going.** Do not stall implementation to ask about every pothole — the log is the mechanism that makes autonomous progress safe.

Exception: if a deviation would invalidate a Tier-1 decision from the plan (data model, public interface, user-facing behavior), stop and ask instead of improvising.

## Also log

- `## Decisions` — choices made within the plan's improvisation room (the plan allowed latitude; record what you did with it).
- `## Surprises` — things about the codebase that contradicted assumptions, even if no deviation was needed. These are next session's unknowns, pre-discovered.
- `## Follow-ups` — debt knowingly incurred, tests deferred, TODOs with locations.

Keep entries short — two to five lines each, written at the moment of the decision, not reconstructed at the end.

## Wrap-up

When implementation finishes, summarize the Deviations section to the user first — it's the list of places where reality disagreed with the plan, which is exactly what they need to review most carefully. Offer `/quiz` to verify their understanding of the change, and `/pitch` if they need buy-in. The notes file also feeds the next planning session: recurring deviations mean the planning process has a systematic blind spot.

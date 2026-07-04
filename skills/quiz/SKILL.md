---
name: quiz
description: Generate a report on a completed change plus a quiz the user must pass before merging, to verify they actually understand what happened. Use after a long working session or big change, before merge/PR approval, or when the user says "quiz me on this change".
---

# Change Report & Quiz

After a long session, Claude may have accomplished more than the user realizes. Reading diffs gives only a light understanding, because much of the behavior depends on existing code paths the diff doesn't show. The quiz closes that gap: the user merges only after passing.

## Step 1 — Establish what changed

Determine the scope: the session's work, a branch diff (`git diff main...`), or a range the user names. Read not just the diff but the code paths it plugs into — the quiz's value is exactly the behavior that ISN'T visible in the diff.

## Step 2 — Produce the report

Default to a self-contained HTML report (markdown for small changes). It must give the user enough context to pass the quiz honestly:

1. **Context** — what problem this change solves and how the affected area worked before.
2. **Intuition** — the mental model of the new behavior: how data flows now, what triggers what.
3. **What was done** — the changes grouped by intent (not by file), each with pointers to the code.
4. **Interactions with existing code** — where the change relies on or alters existing paths; the non-obvious couplings.
5. **What to watch** — edge cases handled, edge cases deliberately not handled, anything from implementation-notes Deviations.

## Step 3 — The quiz

At the bottom of the report (or via AskUserQuestion, one at a time, if the user prefers): **5–8 questions** that test understanding of behavior, not memory of the diff.

Good questions:
- "A request comes in with X while Y — what happens now, and what happened before this change?"
- "Which existing callers are affected by the change to `foo()`?"
- "What breaks if the migration runs but the deploy is rolled back?"

Avoid trivia (file names, line counts, function names). Every question should trace to something that could bite in production or review.

## Step 4 — Grade honestly

Check the user's answers against the code, not against the report. For each wrong or shaky answer, explain the correct behavior with code pointers, then ask a fresh variant of that question later. The bar: **the user merges only after a perfect pass.** If they can't pass, that's signal — offer to walk through the weak area, and note it as a candidate for simplification (code the author can't explain is code reviewers can't review).

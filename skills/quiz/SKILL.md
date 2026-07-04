---
name: quiz
description: Generate a report on a completed change plus a quiz the user must pass before merging, to verify they actually understand what happened. Use after a long working session or big change, before merge/PR approval, or when the user says "quiz me on this change".
argument-hint: [branch/range/scope of the change]
---

# Change Report & Quiz

After a long session, Claude may have accomplished more than the user realizes. Reading diffs gives only a light understanding, because much of the behavior depends on existing code paths the diff doesn't show. The quiz closes that gap: **the user merges only after a perfect pass.**

## Step 1 — Establish what changed

Determine the scope: the session's work, a branch diff (`git diff main...HEAD` + `git log main..HEAD --oneline`), or a range the user names. Then read **beyond the diff**:

- For every changed function/interface, find its callers — the quiz's best questions live where old code now calls new behavior.
- Read `implementation-notes.md` if present: Deviations are guaranteed quiz material, because they're exactly what the user's mental model (the plan) doesn't contain.
- Note behavior that changed *implicitly*: defaults, ordering, error types, performance characteristics.

## Step 2 — Produce the report

Write to `.unknowns/quiz-<topic>.html` from [templates/quiz-template.html](templates/quiz-template.html) — a self-contained interactive page (report on top, quiz with grading at the bottom). Use markdown + AskUserQuestion instead for small changes or on the user's preference.

The report must give the user enough to pass honestly — it's study material, not a summary:

1. **Context** — what problem this solves; how the affected area worked *before*.
2. **Intuition** — the mental model of the new behavior: what triggers what, how data flows now. A small diagram (inline SVG) if flow changed.
3. **What was done** — grouped by *intent*, not by file; each group with `file:line` pointers.
4. **Interactions with existing code** — where the change relies on or alters existing paths; the non-obvious couplings. This is the section the diff can't show and the quiz will probe.
5. **What to watch** — edge cases handled, edge cases deliberately NOT handled, Deviations from implementation-notes.

## Step 3 — Write the quiz (5–8 questions)

Test **behavior, not memory of the diff**. Every question must trace to something that could bite in production or review.

Good question shapes:
- *Behavior under input*: "A request arrives with X while Y is in flight — what happens now, and what happened before this change?"
- *Blast radius*: "Which existing callers are affected by the change to `foo()`?"
- *Failure/rollback*: "The migration runs but the deploy rolls back — what breaks?"
- *Deviation probe*: one question per significant Deviation ("why does the retry use polling instead of the webhook the plan called for?")
- *Boundary*: "What happens at zero items / duplicate key / expired token?"

Banned: trivia (file names, line counts, function names), questions answerable by pattern-matching the report's headings, gotchas about wording.

Format: multiple choice (4 options) with **plausible distractors** — each wrong option should be what someone with a *slightly* wrong mental model would believe. 1–2 free-text questions are fine for the most important behaviors.

## Step 4 — Grade honestly

- Check answers **against the code**, not against the report — if the report and code disagree, the code wins and the report gets fixed.
- For each wrong or shaky answer: explain the correct behavior with `file:line` pointers, then later ask a *fresh variant* of that question (different scenario, same concept). Don't re-ask verbatim — recognition isn't understanding.
- The bar is a **perfect pass before merge**. On a fail, offer a walkthrough of the weak area, then re-quiz the missed concepts.
- Meta-signal: if the user can't pass after a walkthrough, say so plainly — code the author can't explain is code reviewers can't review. Offer to simplify that area before merging.

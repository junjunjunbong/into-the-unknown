---
name: interview
description: Interview the user one question at a time to resolve ambiguities before implementation, prioritizing questions whose answers would change the architecture. Use when the user says "interview me", when a spec has open questions, or before implementing anything with unresolved ambiguity.
---

# Interview

After brainstorming, unknowns usually remain. Instead of guessing at them during implementation, interview the user now — ambiguity resolved in conversation is far cheaper than ambiguity discovered in a diff.

## How to run the interview

1. **Study the task first.** Read the spec/prompt and the relevant code before asking anything. Every question must be grounded in a real fork in the road you found — never ask something you could answer yourself from the codebase.

2. **One question at a time.** Use the AskUserQuestion tool if available (with concrete options plus trade-offs); otherwise ask in plain text. Never dump a questionnaire.

3. **Prioritize by blast radius.** Ask first the questions whose answers would **change the architecture** — data model shape, source of truth, sync vs async, multi-tenancy, API contracts. Then user-facing behavior and edge-case policy. Cosmetic and easily-reversible choices last, or not at all — say you'll use your judgment on those.

4. **Make each question cheap to answer.** Offer 2–4 concrete options with one-line trade-offs and a recommendation. "Which of these three?" beats "what do you want?".

5. **Follow the thread.** If an answer reveals a new fork, pursue it before moving on. If an answer invalidates earlier assumptions — including the premise of the task itself — say so immediately; sometimes the interview reveals the problem should be solved a different way altogether.

6. **Know when to stop.** Stop when remaining questions wouldn't change what you'd build first. Typically 3–8 questions. Respect "just decide" — record your choice and the reason.

## Deliverable

End with a **decision record**: each question, the chosen answer, and its consequence for the implementation. Fold it into the spec or hand it to `/impl-plan`. The user should be able to start a fresh session with just this artifact and lose nothing.

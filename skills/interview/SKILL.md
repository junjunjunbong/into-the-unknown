---
name: interview
description: Interview the user one question at a time to resolve ambiguities before implementation, prioritizing questions whose answers would change the architecture. Use when the user says "interview me", when a spec has open questions, or before implementing anything with unresolved ambiguity.
argument-hint: [spec/topic to interview about]
---

# Interview

> **No-input gate:** if invoked with no arguments and the conversation doesn't already identify the spec, task, or topic to interview about, your entire response is one question asking for it. Do not write files, produce artifacts, or demonstrate on an invented example until it's named.

After brainstorming, unknowns usually remain. Instead of guessing at them during implementation, interview the user now — ambiguity resolved in conversation is far cheaper than ambiguity discovered in a diff.

## Step 0 — Study before asking

Read the spec/prompt, anything in `.unknowns/` (map, blindspot report, brainstorm criteria), and the relevant code **before the first question**. Every question must be grounded in a real fork in the road you found. Two hard rules:

- Never ask something the codebase can answer ("do you use Postgres?" — go look).
- Never ask something already answered in `.unknowns/decisions.md` or the conversation.

Build a private list of candidate forks, then sort by blast radius (below) and start asking.

## Question priority: sort by blast radius

**Tier 1 — answers that change the architecture** (always ask these first):
- Data model shape: what's an entity vs a field, what's the source of truth, what gets denormalized
- Contract surface: API shapes, event schemas, anything other code will depend on
- Sync vs async, consistency requirements, multi-tenancy/scoping
- Build-on vs replace: extend the existing module or start a new one

**Tier 2 — user-visible behavior and policy:**
- Sad paths: what does the user see on failure/empty/conflict
- Edge-case policy: limits, ordering, duplicates, timezones, permissions
- Rollout: feature flag? migration of existing data?

**Tier 3 — reversible/cosmetic** (usually don't ask): naming, styling, file layout. Say "I'll use my judgment on naming and layout" instead of asking.

## How to ask

1. **One question at a time.** Use AskUserQuestion when available; plain text otherwise. Never dump a questionnaire.
2. **Make it cheap to answer**: 2–4 concrete options, each with a one-line trade-off, and mark your recommended option. "Which of these three?" beats "what do you want?".
3. **Show the stakes** in the question itself: "If A, we add a `status` column; if B, we need a new table + backfill."
4. **Follow the thread.** If an answer opens a new Tier-1 fork, pursue it before moving on. If an answer invalidates the premise of the task, say so immediately — sometimes the interview reveals the problem should be solved a different way altogether. That's a success, not a derail.
5. **Respect "just decide."** Record your choice AND the reason in the decision record, marked `(delegated)`.

## Stop condition

Stop when the remaining questions wouldn't change what you'd build first — typically 3–8 questions. Announce it: "Remaining unknowns are all Tier 3 or discoverable during implementation; stopping here."

## Deliverable — the decision record

Append every resolved question to `.unknowns/decisions.md` using [templates/decision-record-template.md](templates/decision-record-template.md): the question, the chosen answer, the rejected options, and the consequence for implementation.

The bar: **a fresh session given only this file (plus the spec) should lose nothing from this conversation.** End by offering `/impl-plan`, which consumes the decision record directly.

## Unknowns ledger (quiet bookkeeping)

`.unknowns/ledger.md` tracks open unknowns as `U#` entries so nothing is lost across sessions — but it is YOUR bookkeeping, not the user's homework.

- Never ask the user to read or maintain the ledger, never block work on it, and don't recite it. Mention a `U#` only when it disambiguates.
- **Proportionality**: for single-session, small-scope work, skip the file entirely and just track open questions in conversation. Touch the file only when the work will outlive this session (a plan exists, implementation is coming) or the user asks.
- End the skill with at most one plain-language sentence of movement — what got settled, what's still open and the default you'll use (e.g. "Settled: dense tables. Still open: conflict policy — defaulting to last-write-wins."). No ritual, no jargon; skip even this if nothing moved.
- What counts as settled (for this skill): an entry settles when the user makes the decision, or explicitly delegates it (record `(delegated)` — still their call, so it settles). Settled means the *user* said or confirmed it — writing it into a report does not count.

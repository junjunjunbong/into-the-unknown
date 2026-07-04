---
name: impl-plan
description: Write an implementation plan that leads with the decisions the user is most likely to change — data models, type interfaces, UX flows — and buries mechanical work at the bottom. Use when the user is ready to implement and wants a reviewable plan, or says "implementation plan".
argument-hint: [feature or task to plan]
---

# Implementation Plan (Decisions First)

> **No-input gate:** if invoked with no arguments and the conversation doesn't already identify the feature or task to plan, your entire response is one question asking for it. Do not write files, produce artifacts, or demonstrate on an invented example until it's named.

A plan's job is to surface the things the user might actually need to alter — not to prove you can enumerate steps. Order the plan by **likelihood the user will want to change it**, not by execution order. The user should be able to review Tier 1, skim Tier 2, and ignore Tier 3 entirely.

## Step 0 — Gather inputs

Read, in order: `.unknowns/decisions.md` (interview answers + brainstorm criteria), `.unknowns/blindspot-*.md`, `.unknowns/map.md`, and the relevant code. The plan must honor every recorded decision — if the code forces you to contradict one, that's a question for the user, not a silent override. If `.unknowns/` is empty and the task is ambiguous, offer `/interview` first; don't pad the plan with guesses.

## The three tiers

Write to `.unknowns/plan-<topic>.md` using [templates/plan-template.md](templates/plan-template.md). For big plans, offer a self-contained HTML version — decisions as scannable cards up top, mechanical detail collapsed at the bottom.

### Tier 1 — Decisions the user will most likely tweak (lead with these)

- **Data model changes**: new tables/collections/fields, migrations, ownership, what's denormalized. Show the actual DDL/schema diff.
- **Type interfaces & API contracts**: the signatures other code will depend on. Show the **actual proposed code** — real type definitions, real endpoint shapes — not prose describing them. A user can veto `expiresAt: Date | null`; they can't veto "appropriate expiry handling".
- **Anything user-facing**: flows, copy, empty/error/loading states, what happens on the sad path.

For each decision: the proposal, **the strongest alternative you rejected, and one line on why** — plus a **"Pick the alternative if…"** line stating the concrete condition under which the user should override you ("pick live joins if annotation edits must be visible in under a second"). A user can only veto a decision they can see, and they can only veto it *cheaply* if you've told them what would justify the veto. In the HTML version, alternatives sit behind a "View alternative" toggle so the happy path stays scannable.

**Make overriding effortless**: under each Tier-1 decision (and at the bottom of the plan), provide a short **copyable override line** the user can paste back verbatim — e.g. `Override 1.2: use live joins instead of snapshots; accept the read-path cost.` The plan should compose the user's revision message for them; they should never have to draft feedback prose.

### Tier 2 — Behavioral choices with medium blast radius

Edge-case policy, failure handling, performance trade-offs, feature-flag/rollout strategy, test strategy. State each as *decision + default*: "On conflict: last-write-wins (default) — flag if you want merge."

### Tier 3 — Mechanical work (bury at the bottom)

Refactors, wiring, file-by-file changes, in execution order with rough sizes. Terse — it exists so the total scope is visible, not for line-by-line review. Tell the user so: "Tier 3 is listed for scope; I don't need review on it."

## Two sections that make the plan survive contact with reality

- **Open unknowns**: anything the plan couldn't settle, each with your planned default if the user doesn't answer. Several of these → offer `/interview` before implementing.
- **Improvisation room**: where you expect the territory might disagree with the map — uninspected code paths, third-party behavior, data you haven't sampled — and the rule for each ("if the webhook payload lacks X, fall back to polling and log it"). This section is what `/impl-notes` deviations get logged against, so be honest about what you haven't verified.

## Review loop

1. Present Tier 1 in chat (not just the file) and ask for vetoes/tweaks decision-by-decision.
2. Fold in changes; append newly-made decisions to `.unknowns/decisions.md`.
3. On approval, recommend implementing in a **fresh session**: pass the plan file + decision record + any prototype into the prompt, with `/impl-notes` active from the first edit. Planning context is spent context — the implementing session should start clean with only the artifacts.

## Unknowns ledger

All skills in this plugin track unknowns as numbered `U#` entries in `.unknowns/ledger.md` (see `/unknowns` for the format).

- **Start**: read the ledger (create it if missing) and name which open entries this pass targets.
- **End — closing ritual, never skip**: report the delta in chat: `Closed: U2 (how) · Opened: U9 · Still open: U3 (default: …)`, then update the file.
- **Closing rule for this skill**: this skill closes nothing — it consolidates. List every still-open entry under 'Open unknowns' with its planned default; a plan hiding open entries is lying about its confidence. Writing something into a report or plan does NOT close an entry — only the user's own articulation or confirmation does.

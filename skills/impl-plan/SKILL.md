---
name: impl-plan
description: Write an implementation plan that leads with the decisions the user is most likely to change — data models, type interfaces, UX flows — and buries mechanical work at the bottom. Use when the user is ready to implement and wants a reviewable plan, or says "implementation plan".
---

# Implementation Plan (Decisions First)

A plan's job is to surface the things the user might actually need to alter — not to prove you can enumerate steps. Order the plan by **likelihood the user will want to change it**, not by execution order.

## Structure the plan in three tiers

### Tier 1 — Decisions the user will most likely tweak (lead with these)

- **Data model changes**: new tables/collections/fields, migrations, ownership, what's denormalized.
- **Type interfaces & API contracts**: the signatures other code will depend on. Show the actual proposed types/schemas, not descriptions of them.
- **Anything user-facing**: UX flows, copy, empty/error/loading states, what happens on the sad path.

For each, show the concrete proposal AND name the alternative you rejected with one line on why — the user can only veto a decision they can see.

### Tier 2 — Behavioral choices with medium blast radius

Edge-case policy, failure handling, performance trade-offs, feature-flag/rollout strategy. State each as a decision with a default.

### Tier 3 — Mechanical work (bury at the bottom)

Refactors, wiring, test scaffolding, file-by-file changes. Keep it terse — the user trusts you on this part; it exists so the scope is visible, not for line-by-line review.

## Also include

- **Open unknowns**: anything the plan couldn't settle, marked explicitly with your planned default if the user doesn't answer. Offer `/interview` if there are several.
- **Improvisation room**: where the plan expects the territory might disagree (uninspected code paths, third-party behavior) and what the agent should do when it does — this is what implementation-notes deviations will be logged against.

## Format

For plans of any real size, offer a self-contained HTML artifact — decisions as scannable cards up top, mechanical detail collapsed at the bottom. Small plans can stay as markdown in chat.

## After review

Once the user approves, recommend implementing in a **fresh session**, passing the plan (plus any spec/prototype artifacts) into the prompt, with `/impl-notes` active to log deviations.

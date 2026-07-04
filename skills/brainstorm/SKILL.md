---
name: brainstorm
description: Brainstorm approaches and build throwaway prototypes so the user can react to options instead of specifying upfront. Use when the user says "brainstorm", wants multiple design directions or approaches to compare, or only knows what they want when they see it.
---

# Brainstorms & Prototypes

Use this when the user is working in an area with lots of **unknown knowns** — criteria they can only define when they see them. Finding these out during implementation is expensive: small changes in a feature or spec cause drastically different implementations, and reverting is hard. Finding them out on a throwaway prototype is cheap.

This is also the right way to start almost any coding session: an exploration/brainstorm phase that sets the project's scope with intent — neither too narrow nor too wide.

## Mode A — Brainstorm approaches

For problem-shaped requests ("users churn after onboarding", "this page is slow"):

1. Search the codebase (and the web if useful) to ground the brainstorm in the territory, not generic best practices.
2. Generate a wide slate of interventions or approaches — aim for ~5–10, ordered **from cheapest to most ambitious**. Include at least one option the user probably hasn't considered; you often know more about the average topic than they do, and can surface high-value approaches they'd miss.
3. For each: one-paragraph sketch, rough cost, what it depends on, and what new unknowns it introduces.
4. Ask the user which ones resonate. Do not pick for them — the point is their reaction.

## Mode B — Prototype to react to

For look-and-feel or shape-of-the-thing requests (dashboards, toolbars, flows, visual design):

1. Build **disposable** prototypes with fake data — a single self-contained HTML file is almost always the best medium. No backend wiring, no state management, no touching the real app.
2. When the user has no articulated taste yet, produce **3–5 wildly different directions** on one page, not variations on one theme. The spread is what teaches them what they want.
3. Label each direction and ask the user to react: what pulls them in, what repels them, which elements to steal across directions.
4. Iterate on the winning direction with their reactions folded in.

## Rules

- Prototypes are throwaway. Put them in a scratch location (e.g. `prototypes/` or a temp dir), never wired into the real app.
- Capture every reaction as an explicit criterion — the user just converted an unknown known into a known known; write it down so it survives into the spec.
- When brainstorming is done, summarize the chosen direction plus the newly-articulated criteria, and offer to continue with `/interview` (remaining ambiguities) or `/impl-plan` (ready to build).

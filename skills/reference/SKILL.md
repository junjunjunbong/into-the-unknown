---
name: reference
description: Study a reference implementation (a folder, library, or component the user points at) and reimplement its semantics in the user's stack. Use when the user says "like this library/component", points at code in another language, or can't describe what they want but can point at something that has it.
---

# Work From a Reference

Sometimes the user can't describe what they want in detail — they lack the vocabulary, or describing it would take longer than pointing. The best reference is **source code**: it carries the markup, structure, edge-case handling, and semantics that a screenshot or description loses. A reference in a different language is fine; semantics translate.

## Step 1 — Pin down the reference and the ask

Identify exactly:

- **The reference**: a vendored folder, a dependency in `node_modules`/registry cache, a repo URL, a file, or a component on a website (read its underlying code — fetch the page/source, not just how it looks).
- **What to look for in it**: which behavior, structure, or quality the user wants extracted. If they just said "like this", ask one question: "what specifically about it?" (the API shape? the retry semantics? the layout system? the feel?)

## Step 2 — Read the reference properly

Read the actual implementation, not just its README:

- Trace the behavior the user pointed at down to where it's actually decided (the state machine, the math, the CSS that makes it feel right).
- Note edge cases and invariants the reference handles that a naive reimplementation would miss — these are exactly the unknowns the user couldn't articulate.
- Note what does NOT need to be carried over (its config surface, its dependencies, its unrelated features).

## Step 3 — Translate, don't transplant

Reimplement **the same semantics** in the user's stack and idiom:

- Match the surrounding codebase's conventions, naming, and error handling — the reference dictates behavior, the host codebase dictates style.
- Do not copy code verbatim across license boundaries; reimplement the behavior. Flag the reference's license if the user seems to be heading toward wholesale copying.
- Where the reference's choices don't fit the host (different runtime, different constraints), adapt and record the deviation.

## Deliverable

The implementation, plus a short **semantics map**: which behaviors were carried over from the reference (with pointers to where each lives in the reference source), and which were deliberately adapted or dropped and why.

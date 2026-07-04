---
name: reference
description: Study a reference implementation (a folder, library, or component the user points at) and reimplement its semantics in the user's stack. Use when the user says "like this library/component", points at code in another language, or can't describe what they want but can point at something that has it.
argument-hint: [path/URL to reference] [what to extract from it]
---

# Work From a Reference

> **No-input gate:** if invoked with no arguments and the conversation doesn't already identify the reference to study and what to extract from it, your entire response is one question asking for it. Do not write files, produce artifacts, or demonstrate on an invented example until it's named.

Sometimes the user can't describe what they want in detail — they lack the vocabulary, or describing it would take longer than pointing. The best reference is **source code**: it carries the structure, edge-case handling, and semantics that a screenshot or description loses. A reference in a different language is fine; semantics translate.

## Step 1 — Pin down the reference and the ask

Two things must be explicit before reading anything:

**The reference.** Resolve it to actual source you can read:
- **Local folder / vendored code** → read it directly.
- **Installed dependency** → find it in `node_modules/`, the venv's `site-packages/`, `~/.cargo/registry/`, etc. Read the shipped source, not the docs.
- **Repo URL** → shallow-clone to the scratchpad (`git clone --depth 1`), or fetch the specific files raw.
- **A component on a website** → read the underlying code, not the screenshot: fetch the page, pull the relevant markup/CSS/JS (pretty-print bundles if needed). The richness is in how it's actually built.
- **Docs/diagrams/pictures** → acceptable, but say that code would be a better reference and ask if any exists.

**What to look for in it.** If the user just said "like this", ask exactly one question: *"What specifically about it — the API shape? the retry semantics? the layout and feel? the state machine?"* Everything else in the reference is noise to be ignored.

## Step 2 — Read the reference properly

Read the implementation, not its README:

- **Trace the pointed-at behavior to where it's actually decided** — the state machine, the math, the CSS that makes it feel right. Note exact semantics: ordering, timing, rounding, defaults, thresholds.
- **Collect the edge cases and invariants** the reference handles that a naive reimplementation would miss (retries on which errors? what happens at zero/overflow/unmount?). These are precisely the unknowns the user couldn't articulate — surfacing them is the point of this skill.
- **Read its tests** if present — tests are the reference author's own list of edge cases.
- **Mark what NOT to carry over**: its config surface, dependency choices, unrelated features, its style.

## Step 3 — Translate, don't transplant

Reimplement **the same semantics** in the user's stack and idiom:

- The reference dictates *behavior*; the host codebase dictates *style* — naming, error handling, test placement must match the surrounding code, not the reference.
- **License check before writing**: identify the reference's license. Reimplementing behavior in your own code is fine; copying code verbatim across license boundaries is not — flag it if the user seems headed there, and never copy from AGPL/proprietary sources into the host.
- Where the reference's choices don't fit the host (different runtime, concurrency model, constraints), adapt deliberately and record the deviation — don't silently drop the behavior.
- Port the reference's edge-case tests too: same inputs, expected same behavior. That's the proof the semantics survived translation.

## Deliverable — the semantics map

Alongside the implementation, produce a short table (in the PR description or `.unknowns/decisions.md`):

| Behavior | In the reference | In ours | Status |
|---|---|---|---|
| {e.g. backoff curve} | `{ref file:line}` | `{our file:line}` | carried over |
| {e.g. jitter} | `{ref file:line}` | — | **dropped**: {why} |
| {e.g. retry trigger} | `{ref file:line}` | `{our file:line}` | **adapted**: {why} |

Every `dropped`/`adapted` row is a decision the user should get to veto — call those out explicitly.

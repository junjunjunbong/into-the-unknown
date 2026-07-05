---
name: brainstorm
description: Brainstorm approaches and build throwaway prototypes so the user can react to options instead of specifying upfront. Use when the user says "brainstorm", wants multiple design directions or approaches to compare, or only knows what they want when they see it.
argument-hint: [problem or thing to prototype]
---

# Brainstorms & Prototypes

> **No-input gate:** if invoked with no arguments and the conversation doesn't already identify the problem to brainstorm or the thing to prototype, your entire response is one question asking for it. Do not write files, produce artifacts, or demonstrate on an invented example until it's named.

Use this when the user is working in an area with lots of **unknown knowns** — criteria they can only define when they see them. Finding these out during implementation is expensive: small changes in a feature or spec cause drastically different implementations, and reverting is hard. Finding them out on a throwaway prototype is cheap.

This is also the right way to start almost any coding session: an exploration/brainstorm phase that sets the project's scope with intent — neither too narrow nor too wide. The assistant often finds high-value approaches the user would have missed, and the user catches when the assistant misses the forest for the trees.

Pick the mode by the shape of the request; use both when a problem needs approaches AND one approach needs a visual.

## Mode A — Brainstorm approaches

For problem-shaped requests ("users churn after onboarding", "this page is slow"):

1. **Ground it first.** Search the codebase (and the web if useful) so options come from the territory, not generic best practice. An option that names real files beats one that names patterns.
2. **Generate a wide slate** — 5–10 options, ordered **cheapest → most ambitious**. Deliberately include:
   - at least one "do less" option (config change, copy change, delete something),
   - at least one option from an adjacent frame the user probably hasn't considered (you know more about the average topic than they do),
   - at least one ambitious option that assumes the problem should be solved differently altogether.
3. **Present each option** in a fixed shape so they're comparable:
   - one-paragraph sketch of the change
   - cost tag: **S** (ship this afternoon) / **M** (medium lift) / **L** (long-term project) / **XL** (quarter-long bet), plus what it touches (`files/areas`)
   - a context snippet: what the codebase actually shows at that spot — this is what separates grounded discovery from generic advice
   - what it depends on or risks, and **what new unknowns it introduces**
4. **Ask which ones resonate.** For a big slate, render an HTML page where each option carries a "**this resonates**" checkbox and the page composes the reply from the checked ones ("check what resonates — your reply builds here") with a [Copy reply] button. In chat, number the options and ask the user to pick, combine, or veto. Do not pick for them; the reaction IS the data. It's fine to mark one ⭐ recommended with a one-line reason.

## Mode B — Prototype to react to

For look-and-feel or shape-of-the-thing requests (dashboards, toolbars, flows, visual design):

1. **Build disposable prototypes with fake data.** A single self-contained HTML file is almost always the right medium — no backend wiring, no state, no touching the real app. Start from [templates/directions-template.html](templates/directions-template.html). Save to `.unknowns/brainstorm-<topic>.html` and open/send it to the user.
2. **When the user has no articulated taste yet, make 3–5 wildly different directions** on one page — not variations on one theme. Force divergence by varying real axes: information density, layout paradigm (cards vs table vs canvas), navigation model, tone (clinical vs playful), what's emphasized first. Name each direction memorably ("Dense cockpit", "One big number") so reactions are easy to voice.
3. **Use realistic fake data.** "Revenue $48,230 · churn 3.2%" teaches; "Lorem ipsum · 123" doesn't. Edge cases in the fake data (long names, empty states, huge numbers) surface layout unknowns for free.
4. **Let the page collect the reactions.** Under each direction, list its notable details as tap-able **steal / skip chips** ("steal · the 4-stat metric strip", "skip · full dark chrome"). Selections aggregate into a composed reply at the bottom with a [Copy reply] button — the user taps what they feel and pastes one message back, instead of hand-writing feedback they may lack the vocabulary for. Reacting is easier than imagining. Then iterate on the winner with the stolen elements folded in — usually 1–2 rounds is enough.

## Capture the criteria (the actual point)

Every reaction converts an unknown known into a known known. **Write each one down as an explicit criterion** the moment it's voiced ("dense tables over cards", "no red except errors", "cheapest option first, ambitious one later as phase 2"). Keep a running `## Criteria` list and append it to `.unknowns/decisions.md`.

## Rules

- Prototypes are throwaway. They live in `.unknowns/`, never wired into the real app. Resist upgrading a prototype into the implementation — the value was the reaction.
- Don't polish. A prototype at 80% fidelity in one round beats 99% in three; the missing 20% is often what prompts the most useful reactions.
- When done, summarize: chosen direction/options + the criteria list, and route onward — `/interview` if ambiguities remain, `/impl-plan` if ready to build.

## Unknowns ledger (silent, but always updated)

`.unknowns/ledger.md` is the cross-session index of open unknowns. **The file work is mandatory; talking about it is not.**

- **Start — always**: if the file exists, read it silently. Don't re-ask what's already settled; do target what's open.
- **End — always**: if this pass opened or settled ANY unknown, write the delta to the file before finishing (create the file on its first real entry). This write is non-negotiable — skipping it is how continuity between sessions dies. If nothing opened or settled, leave the file alone.
- **Chat side — quiet**: keep ledger details out of chat, keep file upkeep agent-owned, and never block on it. At most one plain sentence of movement ("Settled: dense tables. Still open: conflict policy — defaulting to last-write-wins."), skipped when nothing moved. Mention a `U#` only when it disambiguates.
- **What counts as settled**: an entry settles only when the user's reaction is voiced and captured as an explicit criterion in `decisions.md`. Settled means the *user* said or confirmed it — writing it into a report does not count.

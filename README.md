# finding-unknowns

A Claude Code plugin for discovering your **unknowns** — before, during, and after implementation.

Based on [*A Field Guide to Fable: Finding Your Unknowns*](https://x.com/trq212/article/2073100352921215386) by [Thariq (@trq212)](https://x.com/trq212) of the Claude Code team.

> The map is not the territory. The map is your prompts, skills, and context — what you give Claude. The territory is where the work actually happens: the codebase, the real world, its constraints. The gap between them is your **unknowns**, and with models as capable as Claude Fable 5, the quality of the work is bottlenecked by your ability to clarify them.

This plugin turns each technique from the article into a skill / slash command.

## Installation

```
/plugin marketplace add junwon/finding-unknowns
/plugin install finding-unknowns@finding-unknowns
```

Or for local development:

```
claude --plugin-dir /path/to/finding-unknowns
```

## The workflow

```
              ┌─ /blindspot ── unknown unknowns: learn the territory
before ───────┼─ /brainstorm ─ unknown knowns: react to options & prototypes
              ├─ /interview ── known unknowns: answer one question at a time
              ├─ /reference ── point at code that already has what you want
              └─ /impl-plan ── plan that leads with decisions you'll tweak

during ────────  /impl-notes ─ log deviations, keep going

              ┌─ /pitch ────── package everything for buy-in
after ────────┼─ /quiz ─────── merge only after you pass
              └─ /diagnose ─── came back wrong? find the unknown that caused it
```

Start with `/unknowns` if you're not sure which technique you need — it maps your task into the knowns/unknowns 2×2 and routes you.

## In what order? Do I need all five?

No — running all five pre-implementation techniques by default is over-ceremony. Scale to `task size × unfamiliarity × cost of being wrong`. When several apply, the canonical order is **blindspot → brainstorm → interview → impl-plan** (with `/reference` slotting in whenever you have something to point at), because each step makes the next one better: you can't brainstorm well in a domain you don't understand, reactions to prototypes generate better interview questions than a blank page, and the plan exists to consolidate the decisions you just made.

| Situation | Sequence |
|---|---|
| Trivial fix, familiar code | none — just implement |
| Medium feature, familiar area | quick `/brainstorm` → `/impl-plan` |
| Clear spec, open details | `/interview` → `/impl-plan` |
| Unfamiliar part of the codebase | `/blindspot` → `/interview` → `/impl-plan` |
| Taste-heavy (UI, design, tone) | `/brainstorm` → `/interview` → `/impl-plan` |
| New domain AND taste-heavy | `/blindspot` → `/brainstorm` → `/interview` → `/impl-plan` |
| "Make it like X" | `/reference` → `/impl-plan` |

If any pre-implementation technique ran, always close with `/impl-plan` — it consolidates their outputs into the artifact the implementing session receives. And the sequence is iterative, not linear: a pileup of deviations in `implementation-notes.md` means go back to `/interview` or re-plan, not improvise forward.

## How the skills chain together

The skills share an artifact directory, `.unknowns/` at your repo root (gitignored by default), so each one picks up where the previous left off:

```
.unknowns/
  map.md                  ← /unknowns      knowns/unknowns 2×2 for the task
  blindspot-<topic>.md    ← /blindspot     what you didn't know to ask
  brainstorm-<topic>.html ← /brainstorm    throwaway prototypes to react to
  decisions.md            ← /interview     append-only decision record (+ criteria from reactions)
  plan-<topic>.md         ← /impl-plan     decisions-first implementation plan
  pitch-<topic>.html      ← /pitch         buy-in doc built from notes + plan
  quiz-<topic>.html       ← /quiz          interactive report + quiz
implementation-notes.md   ← /impl-notes    deviations log, at repo root (per the article)
```

`/impl-plan` honors everything in `decisions.md`; `/impl-notes` logs deviations against the plan's "improvisation room"; `/pitch` and `/quiz` are generated from the notes and plan. The intended flow for a big feature: plan in one session, then **implement in a fresh session** passing only the artifacts.

Several skills ship with templates (design-directions HTML skeleton, interactive quiz page with grading, implementation-notes format, decisions-first plan, pitch doc) under each skill's `templates/` directory — Claude fills them in rather than improvising a format each time.

## Skills

| Command | Phase | What it does |
|---|---|---|
| `/unknowns` | anytime | Map your knowns/unknowns (known knowns, known unknowns, unknown knowns, unknown unknowns) and pick the right technique. |
| `/blindspot` | pre | Blindspot pass: surface your unknown unknowns in an unfamiliar codebase area or domain, and teach you enough to prompt better. |
| `/brainstorm` | pre | Brainstorm approaches (cheapest → most ambitious) or build several wildly different throwaway prototypes to react to. |
| `/interview` | pre | Claude interviews you one question at a time, prioritizing questions whose answers would change the architecture. |
| `/reference` | pre | Point Claude at source code that has what you want — even in another language — and it reimplements the semantics in your stack. |
| `/impl-plan` | pre | Implementation plan that leads with data models, type interfaces, and user-facing decisions; mechanical refactoring buried at the bottom. |
| `/impl-notes` | during | Keeps `implementation-notes.md`: on unplanned edge cases, pick the conservative option, log it under Deviations, keep going. |
| `/pitch` | post | Package the prototype, spec, and implementation notes into one explainer doc for buy-in and approvals. |
| `/quiz` | post | A report on the change with context and intuition, plus a quiz at the bottom. Merge only after a perfect pass. |
| `/diagnose` | post | When a long-horizon task comes back wrong: trace the earliest divergence, classify which kind of unknown caused it, bank the lesson, route the retry. |

## The spirit of the thing

A few commitments from the original article that this plugin tries to preserve, beyond the mechanics:

- **It's a field guide, not a pipeline.** These are techniques to reach for when a specific kind of gap appears — not stages to complete. Skipping most of them on most tasks is correct usage.
- **Claude is a thought partner.** The highest-leverage input is your *starting point* — where you are in your thought process, your experience with the problem and codebase. Every skill here starts by calibrating to it.
- **Iterative, not one-shot.** Unknowns show up before, during, and after implementation — and deep in implementation they can legitimately send you back to re-frame the problem. Going backward is the process working.
- **You're supposed to get better.** Reducing and planning for unknowns *is* the skill of agentic coding, and it's trainable. The best agentic coders know what they want in detail but still assume unknowns. Each brainstorm reaction you verbalize and each misfire you diagnose is that skill compounding — the plugin treats your improvement as a deliverable alongside the code.
- **A wrong result is a signal, not a verdict.** When a long-horizon task comes back wrong, you likely needed to spend more time defining your unknowns, or a plan that let Claude improvise through them. That's what `/diagnose` operationalizes.

Instructing Claude is a delicate balance: too specific, and it follows your instructions even when a pivot is better; too vague, and it fills the gaps with industry best practices that may not fit your task. Every explainer, brainstorm, interview, prototype, and reference is a cheap way to find out what you didn't know — before it gets expensive to fix.

All credit for the ideas goes to Thariq's original article. This plugin is just those patterns, packaged.

## License

MIT

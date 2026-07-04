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
after ────────┴─ /quiz ─────── merge only after you pass
```

Start with `/unknowns` if you're not sure which technique you need — it maps your task into the knowns/unknowns 2×2 and routes you.

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

## Why

Instructing Claude is a delicate balance: too specific, and it follows your instructions even when a pivot is better; too vague, and it fills the gaps with industry best practices that may not fit your task. Every explainer, brainstorm, interview, prototype, and reference is a cheap way to find out what you didn't know — before it gets expensive to fix.

All credit for the ideas goes to Thariq's original article. This plugin is just those patterns, packaged.

## License

MIT

# into-the-unknown

**A Claude Code plugin that helps you discover what you don't know — before it gets expensive to fix.**

Ten skills packaging the techniques from [*A Field Guide to Fable: Finding Your Unknowns*](https://x.com/trq212/article/2073100352921215386) by [Thariq (@trq212)](https://x.com/trq212) of the Claude Code team.

> The map is not the territory. The map is your prompts and context; the territory is the codebase and its real constraints. The gap between them is your **unknowns** — and with today's models, the quality of the work is bottlenecked by your ability to clarify them.

🇰🇷 [한국어 README](README.ko.md)

## Install

### Claude Code

```
/plugin marketplace add junjunjunbong/into-the-unknown
/plugin install into-the-unknown@into-the-unknown
```

Try a local checkout in Claude Code:

```
claude --plugin-dir /path/to/into-the-unknown
```

### Codex

```
codex plugin marketplace add junjunjunbong/into-the-unknown
codex plugin add into-the-unknown@into-the-unknown
```

Try a local checkout in Codex:

```
codex plugin marketplace add /path/to/into-the-unknown
codex plugin add into-the-unknown@into-the-unknown
```

## Quick start

Two commands cover 80% of usage:

```
/unknowns  add CSV export to the reports page
```
→ maps what you know / don't know about the task and tells you which (if any) technique is worth running before you build.

```
/diagnose  the dashboard came back nothing like I imagined
```
→ when a result misses the mark: traces which unknown caused it, banks the lesson, and sets up the retry so it doesn't happen again.

## Cheat sheet

Match the sentence in your head to a command:

| You're thinking… | Run | Example |
|---|---|---|
| "I don't know where to start" | `/unknowns` | `/unknowns migrate our cron jobs to queues` |
| "I've never touched this part of the codebase / domain" | `/blindspot` | `/blindspot the billing module — never worked in it` |
| "I'll know what I want when I see it" | `/brainstorm` | `/brainstorm 4 wildly different directions for the settings page` |
| "There are decisions I haven't made yet" | `/interview` | `/interview me about the notifications spec` |
| "Make it work like that thing over there" | `/reference` | `/reference vendor/rate-limiter — same backoff semantics in our TS client` |
| "I'm ready to build — plan it" | `/impl-plan` | `/impl-plan bulk CSV import per the decisions so far` |
| "Implement it" (in a fresh session, with the plan) | `/impl-notes` | `implement .unknowns/plan-csv-import.md with /impl-notes active` |
| "I need buy-in / approval on this" | `/pitch` | `/pitch this change for the team channel` |
| "Did I actually understand what just got built?" | `/quiz` | `/quiz me on this branch before I merge` |
| "That's… not what I wanted" | `/diagnose` | `/diagnose the export format is wrong` |

## The loop in practice

For a real feature, the flow looks like this:

1. **Scope** — `/unknowns` (or jump straight to a technique if you already know your gap).
2. **Close the gaps that matter** — usually one or two of `/blindspot`, `/brainstorm`, `/interview`, `/reference`. Never all of them by default.
3. **Plan** — `/impl-plan` consolidates everything into a decisions-first plan you review in 5 minutes (Tier 1 only — the mechanical stuff is buried at the bottom on purpose).
4. **Implement in a fresh session** — pass the plan file in, with `/impl-notes` logging any deviation from it.
5. **Verify & ship** — `/quiz` before merge (perfect pass required), `/pitch` if you need approvals.
6. **When it misses** — `/diagnose`, bank the lesson, retry with it inherited.

Small tasks skip straight from step 1 to "just implement". That's correct usage, not cheating.

### Which pre-implementation techniques, in what order?

Canonical order when several apply: **blindspot → brainstorm → interview → impl-plan** (`/reference` slots in whenever you have something to point at). Each step makes the next better: you can't brainstorm well in a domain you don't understand, and reactions to prototypes generate better interview questions than a blank page.

| Situation | Sequence |
|---|---|
| Trivial fix, familiar code | none — just implement |
| Medium feature, familiar area | quick `/brainstorm` → `/impl-plan` |
| Clear spec, open details | `/interview` → `/impl-plan` |
| Unfamiliar part of the codebase | `/blindspot` → `/interview` → `/impl-plan` |
| Taste-heavy (UI, design, tone) | `/brainstorm` → `/interview` → `/impl-plan` |
| New domain AND taste-heavy | all four |
| "Make it like X" | `/reference` → `/impl-plan` |

## How the skills chain together

Skills share an artifact directory, `.unknowns/` at your repo root (gitignored by default), so each picks up where the last left off — and so you can implement in a **fresh session** without losing anything:

```
.unknowns/
  ledger.md               ← ALL skills     numbered U# entries, open → closed
  map.md                  ← /unknowns      the knowns/unknowns 2×2
  blindspot-<topic>.md    ← /blindspot     what you didn't know to ask
  brainstorm-<topic>.html ← /brainstorm    throwaway prototypes to react to
  decisions.md            ← /interview     append-only decision record + taste criteria
  plan-<topic>.md         ← /impl-plan     decisions-first plan (honors decisions.md)
  pitch-<topic>.html      ← /pitch         buy-in doc built from notes + plan
  quiz-<topic>.html       ← /quiz          interactive report + self-grading quiz
implementation-notes.md   ← /impl-notes    deviations log (repo root, per the article)
```

Skills ship with templates (design-directions page, interactive quiz with grading, implementation-notes format, decisions-first plan, pitch doc) so Claude fills in a proven format instead of improvising one each time.

### The ledger: watching your unknowns actually close

The plugin's progress bar is `.unknowns/ledger.md`: every unknown becomes a numbered entry (`U1`, `U2`, …) with a lifecycle, and **every skill ends with a closing ritual** in chat — `Closed: U2 (criterion voiced) · Opened: U9 · Still open: U3 (default: last-write-wins)`.

The closing rule is strict on purpose: an entry closes only on *your* articulation — a decision you made, a criterion you voiced, a teach-back you passed (`/blindspot` quizzes you on its own report before moving on). Claude writing the answer into a document does not count; that only moves the unknown from your head into a file. The felt sense of "my unknowns are getting filled" is exactly entries flipping to ✅ because you can now say things you couldn't say before.

## The spirit of the thing

Commitments from the original article that the skills are built around:

- **Field guide, not pipeline.** Techniques to reach for when a specific gap appears — skipping most of them on most tasks is correct.
- **Thought partner.** Every skill starts by calibrating to your starting point: where you are in your thinking, what you know about the problem and codebase.
- **Iterative.** Unknowns surface before, during, and after implementation. Going backward (re-framing after a deviation pileup) is the process working.
- **You're supposed to get better.** Reducing unknowns *is* the skill of agentic coding. Every verbalized reaction and diagnosed misfire compounds it — the plugin treats your improvement as a deliverable alongside the code.
- **A wrong result is a signal.** It usually means unknowns were under-defined, or the plan left no room to improvise. `/diagnose` operationalizes exactly that.

## Credits & license

All credit for the ideas goes to [Thariq's original article](https://x.com/trq212/article/2073100352921215386) — this plugin is those patterns, packaged. MIT licensed.

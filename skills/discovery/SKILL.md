---
name: discovery
description: Evidence-based discovery of unknown unknowns before planning or implementing — the agent scouts the repo/docs/logs FIRST, then asks only what evidence cannot answer. Use before any ambiguous, unfamiliar, or high-stakes task (coding, research, product, strategy); when the user gives a vague-but-concrete goal ("raise the score", "make it faster"), is unsure, exploring, entering a new domain, or asks "what am I missing".
argument-hint: [task or goal]
---

# Unknown Discovery

Before solving, planning, or implementing, discover the unknowns that would make the task fail, drift, or become expensive later. **The goal is not to answer immediately. The goal is to improve the map before entering the territory.**

This is NOT an interview skill. `/interview` reduces ambiguity by asking; discovery finds **unknown unknowns by scouting** — repo, docs, logs, history — and asks the user only what evidence cannot answer. If you are asking more than you are reading, you are doing it wrong.

## Core principle

The user's prompt is only a map. The territory is the codebase, domain, constraints, taste, risk, and success criteria. When the map is incomplete, do not silently fill gaps with generic best practices, and do not bounce the gaps back at the user as questions — **go look at the territory first**. Evidence turns "I guess you don't know X" into "the log says X — were you aware?"

Anything you claim about what the *user* knows is a hypothesis from minutes of contact: offer it for correction, never as a verdict.

## Stance (applies to every skill in this plugin)

- **Thought partner, not order-taker.** Calibrate to the user's starting point — but infer it from context and evidence before asking about it.
- **You are the accelerator.** You read code, logs, and docs far faster than the user. That asymmetry is the whole reason discovery works: spend your speed on scouting, spend the user's attention only on judgment calls.
- **Both-ways failure.** Too-specific instructions get followed off a cliff; too-vague ones get filled with best practices that may not fit. Say so when you see either.
- **Toolbox, not pipeline.** Never make the user feel behind for skipping a technique.
- **HTML by default for artifacts**, and **the artifact composes the reply** (copy buttons, resonate checkboxes, steal/skip chips, paste-back lines).
- **The second deliverable is the user's skill.** When a pass converts an unknown into something the user can now articulate, point it out.
- **A document is not a settled unknown.** Settled means the user said or confirmed it.

## Artifact convention (shared by all skills)

Artifacts accumulate in `.unknowns/` at the repo root (`ledger.md`, `map.md`, `blindspot-*.md`, `brainstorm-*.html`, `decisions.md`, `plan-*.md`, `pitch-*.html`, `quiz-*.html`; `implementation-notes.md` at repo root). Build on existing artifacts, don't restart. Ask once whether to gitignore `.unknowns/`; default yes.

### The ledger (`.unknowns/ledger.md`) — silent, but always updated

Cross-session index of open unknowns: `| U# | question | opened by | status |`. **File work is mandatory, talking about it is not.** Read silently at start; write the delta whenever anything opened or settled (create on first real entry); in chat at most one plain sentence of movement; never recite it or assign it as homework. Settled = the user's articulation only.

## The protocol — four phases, hard gates

You are always in exactly one phase. Announce transitions in one short line ("Scouting done — here's what I found"). Interruptions never change the phase by themselves (see Interruption rules).

| Phase | You MAY | You MAY NOT | Exit gate |
|---|---|---|---|
| **P0 GATE** | check task exists | scout, write, ask calibration batteries | a concrete task or goal is named |
| **P1 SCOUT** | run tools: read repo/docs/logs/history | **ask the user ANY question**; show partial dumps | evidence collected (internal digest) |
| **P2 REPORT** | present ONE compact scout report (evidence → ranked blind-spot hypotheses → ≤1 question) | show the raw 2×2 table; dump digest and map as two separate walls; write files | user reacted (or said "looks right") |
| **P3 PROBE** | ask **one decision per turn**, evidence-attached | batch questions; ask anything scoutable | plan-changing unknowns settled OR budget (3, incl. the report's question) spent |
| **P4 HANDOFF** | write map.md, seed ledger, route | keep asking | — |

P1→P2 happens **in the same turn** — that's intended; scouting silently and then reporting is one motion. The hard stop is AFTER the report: nothing else happens until the user reacts.

### P0 — Gate

If neither the arguments nor the recent conversation names a concrete task or goal: stop. No scouting, no files, no invented example. Ask what the task is — that single question is your entire response.

**A vague goal + a concrete territory PASSES the gate.** "점수올리기 / raise the score" in a repo with a scoreboard is a valid task: the *territory* disambiguates it, not the user. Do not ask "what do you mean by raise the score?" — go find out what the score is, where it's computed, and what has moved it. Reply-with-questions is only correct when there is genuinely nothing to scout.

### P1 — SCOUT (질문 금지 — zero questions before the report)

**Hard rule: the first visible output of discovery is evidence, never a question.** If you catch yourself drafting a question during SCOUT, that question is a scouting target: write it down and go find the answer with tools. Only questions that survive scouting reach P3.

Scout checklist for a repo/code task (adapt per territory; 5–15 tool calls, minutes not hours):

1. **Intent trail** — the project's own journal: README, STATE/STATUS docs, ROADMAP/TODO, EXPERIMENT_LOG, SCOREBOARD, CHANGELOG. These say what the project thinks it's doing and what the current numbers are.
2. **Recency** — `git log --oneline -20`; recently touched files; reverts and fix-storms; uncommitted changes (`git status`).
3. **Goal instrumentation** — where is the goal metric computed and what feeds it? For "raise the score": find the scorer, the eval harness, the current number, the best-ever number, and the gap.
4. **Attempt history** — what's been tried and what happened: experiment logs, regressions, abandoned branches, comments like "tried X, made it worse".
5. **Hotspots & constraints** — churn/size hotspots in the relevant paths; TODO/FIXME/HACK; budgets declared in configs/CI (time limits, submission rules, compute caps).

Territory variants — use the matching lens list as the checklist:
- **Research**: paper/notes, metric definitions, dataset cards, experiment configs, baseline table → unclear research question · missing hypothesis · weak baseline · invalid metric · dataset leakage · unfair comparison · infeasible experiment · missing ablation · claim/evidence mismatch · unexamined negative results · compute constraints · reproducibility risk.
- **Coding**: → unclear entry point · hidden convention · missing type/interface contract · migration risk · backward compatibility · test coverage gap · API boundary confusion · state management ambiguity · concurrency/async edges · error handling expectations · security assumptions · performance constraints.
- **Product**: analytics, user feedback, tickets, funnels → unclear user · unclear job-to-be-done · fake urgency · missing distribution · willingness-to-pay · activation moment · retention risk · switching cost · category confusion · substitutes · success metric ambiguity.

**Exit: the digest stays internal** — it's your working notes (every finding with a citation: `file:line`, commit, log line), not a deliverable. It feeds the report.

### P2 — REPORT (one compact deliverable, then stop)

Everything the user sees from discovery's opening move is this single report — evidence first, interpretation second, at most one ask. No files yet.

```md
## Scout report: {task, one-sentence interpretation — correct me}

**What I found**            (≤6 lines, every line cited)
- {finding} — `{file:line / commit / log}`

**Where the blind spots probably are**   (3–5, ranked by impact on the goal)
1. ⚠ {blind spot} — (evidence: `…`)
2. {blind spot} — (guess)

**Only you can answer**     (0–2 items, interrogative, tagged (guess))
- {is X already decided in your head?}

**First question** — [ONE, evidence-attached — only if one passes the P3 tests;
otherwise: "No question needed — recommending {route} because {blind spot}."]

Corrections: `Wrong: …` / `Promote: …` / `Missing: …` — or "looks right".
```

Rules: 5–8 substantive items total across the report; territory claims cite evidence, user claims stay interrogative + `(guess)`; an evidence-free "blind spot" is either a tagged guess or a new scouting target — go scout instead of listing it. **The 2×2 is your internal lens, not the output**: classify silently to check you covered all four kinds of unknowns, and write the full quadrant map only to `.unknowns/map.md` at handoff. Then stop and wait for the reaction.

### P3 — PROBE (one decision per turn, evidence attached, budget 3)

Only now do questions reach the user, and only questions that pass all three tests:

1. **Scoutability test**: could 10 more minutes of scouting answer this? → then scout, don't ask. Asking the user what the repo already knows is the cardinal failure of this skill.
2. **Blast-radius test**: would the answer change the plan (architecture, data model, metric, baseline, scope, UX, dependency, security, cost, timeline, whether to do it at all)? Naming/style/reversible details never get asked — say "I'll use judgment on those".
3. **Ownership test**: is this genuinely the user's call (taste, intent, risk appetite, priorities) rather than a fact?

Format: **one decision per turn**. A single question may carry 2–4 options with one-line trade-offs and a recommendation — that's still one decision. Two questions in one message is a protocol violation. Attach the evidence that raised it: "EXPERIMENT_LOG L34: train40 regressed 0.3 after the June change — accepted deliberately, or is reverting on the table?" — never the cold "train40 or submission-safe?".

Budget: **3 questions** by default. Spending the budget means transition, not more questions. After each answer: update map and ledger silently, re-rank, ask the next or exit.

### P4 — HANDOFF

Write the corrected map to `.unknowns/map.md`, seed the ledger silently, then route with a recommendation naming which blind spot each technique closes:

- → `/interview` when the remaining ambiguity is resolvable by focused questioning (blind spots identified, plan-changing unknowns listed, ≥1 high-leverage question answered).
- → `/impl-plan` when core assumptions are explicit, success criteria clear, risky alternatives considered, direction approved.
- Sideways: unfamiliar territory dominates → `/blindspot`; taste/"know it when I see it" → `/brainstorm`; "like that thing" → `/reference`; a previous result came back wrong → `/diagnose`.

Canonical sequencing when several apply: `/blindspot` → `/brainstorm` → `/interview` → `/impl-plan` (`/reference` slots in anytime; never all five by default — ceremony scales with size × unfamiliarity × cost of being wrong). Presets: trivial+familiar → just do it · medium+familiar → quick `/brainstorm` → `/impl-plan` · clear spec → `/interview` → `/impl-plan` · unfamiliar area → `/blindspot` → `/interview` → `/impl-plan` · taste-heavy → `/brainstorm` → `/interview` → `/impl-plan` · "like X" → `/reference` → `/impl-plan`. Iterative, not linear: deviation pileups during implementation legitimately send you back.

## Interruption rules (how the loop survives the user)

Classify every user message mid-protocol and respond accordingly — the phase does not change unless a rule says so:

- **Answer / new information** → absorb into the map, update the ledger silently, continue in the current phase.
- **Meta-feedback** ("왜 질문해?", "말이 어렵다", "this is confusing") → respond in ≤2 plain sentences: which phase you're in, why, what's left ("Scouting — two checklist items left, then I'll show you what I found"). Then RESUME the phase exactly where it stood. Do NOT apologize-and-abandon, do NOT drift into general conversation, do NOT start explaining a plan. If the complaint is about wording, simplify the wording — not the protocol.
- **Redirect** ("그냥 해줘", "skip this") → exit explicitly and cheaply: one line naming what discovery is being skipped and the single biggest risk that carries, then comply. Never argue for the protocol twice.
- **New task** → close out the current one (write map.md if anything was learned), restart at P0 for the new task.

When resuming after any interruption, say where you are: "(back to scouting — checking the eval harness next)".

## Worked contrast (the failure this protocol prevents)

User in the OGC2026 repo says: **"점수올리기"** (raise the score).

- ❌ Old behavior: immediately ask "train40 60s로 갈까요, submission-safe로 갈까요?" — a cold A/B the user can't ground, no evidence, questionnaire feel.
- ✅ Protocol: P0 passes (concrete territory). P1, silently: read STATE/SCOREBOARD/EXPERIMENT_LOG, `git log -20`, find the scorer and current-vs-best gap, list what's been tried and what regressed. P2, one report: findings with citations → 3 ranked blind spots ("submission pipeline caps runtime at 60s — SCOREBOARD L12 shows your best local run exceeds it; is that why train40 was abandoned? (guess)") → ONE evidence-attached question. Stop. P3 with the remaining budget. P4: route (likely `/impl-plan` on the chosen direction, or `/brainstorm` across the 3 candidates).

## Anti-patterns

Do not: ask anything before the scout report exists · ask what the repo/logs can answer · batch questions or stack decisions in one turn · produce a plan before surfacing unknowns · hide assumptions · fill gaps with generic best practices · treat the user's first framing (or your restatement) as necessarily correct · ask preference questions before plan-changing ones · present guesses about the user as facts · write files before the user has corrected the map · abandon the protocol because the user pushed back on it.

---
name: unknowns
description: Map out the user's knowns and unknowns for a task and recommend which into-the-unknown technique to use next. Use when the user is starting a project or task and isn't sure how to scope it, says "I don't know where to start", or asks to "find my unknowns".
argument-hint: [task or problem description]
---

# Finding Your Unknowns

The map is not the territory. The map is the user's prompt, skills, and context — what they give you. The territory is where the work actually happens: the codebase, the real world, its actual constraints. The gap between them is **unknowns**, and when you hit an unknown you're forced to guess. The quality of long-horizon work is bottlenecked by how well the user's unknowns get clarified — before, during, and after implementation.

Your job in this skill: build a concrete unknowns map for THIS task, then route the user to the right technique. The map must be task-specific — a generic 2×2 with abstract labels is a failure.

## Stance (applies to every skill in this plugin)

- **Thought partner, not order-taker.** The most important context is the user's *starting point*: where they are in their thought process, their experience with the problem and this codebase. Ask for it, use it, and calibrate everything to it.
- **You are the accelerator.** You can search the codebase and the internet far faster than the user, you know more about the average topic, and you iterate from failure faster. Use that to help them discover *their* unknowns quickly — don't just resolve unknowns silently on their behalf; surface them.
- **Both-ways failure.** Too-specific instructions get followed even when a pivot is better; too-vague instructions get filled with industry best practices that may not fit. When you notice the user at either extreme, say so.
- **Toolbox, not pipeline.** These are techniques to reach for, not stages to complete. Never make the user feel behind for skipping one; the `.unknowns/` artifacts are connective tissue for when techniques compound, not a checklist.
- **HTML by default for artifacts.** For anything meant to be *reacted to* — prototypes, plans, reports, quizzes — a self-contained HTML page beats markdown at representing it.
- **The artifact composes the reply.** Reacting is easier than imagining — and easier than typing. Every artifact must carry reaction controls that build the user's next message for them: copy buttons on each finding and on the consolidated improved prompt, "this resonates" checkboxes that aggregate into a reply, steal/skip chips per design detail, copyable override templates per plan decision. The user taps what they feel and pastes back one composed reply; they should never have to hand-write a response to an artifact.
- **The second deliverable is the user's skill.** Reducing and planning for unknowns IS the skill of agentic coding, and it improves by working with Claude. When a pass converts an unknown into something the user can now articulate, point it out — that's them getting better at prompting, which outlasts this task.
- **A document is not a closed unknown.** An unknown lives in the user's head; writing the answer into a report only moves it into a file. It counts as CLOSED only when the user has articulated or confirmed the answer in their own words. Every skill tracks this in the ledger (below) and ends by reporting the delta — that visible open→closed movement is what "my unknowns are getting filled" feels like.

## Artifact convention (shared by all into-the-unknown skills)

Artifacts from this plugin's skills accumulate in `.unknowns/` at the repo root, so later skills can pick up where earlier ones left off:

```
.unknowns/
  ledger.md            ← ALL skills (the spine — see below)
  map.md               ← this skill
  blindspot-<topic>.md ← /blindspot
  brainstorm-<topic>.html
  decisions.md         ← /interview (append-only decision record)
  plan-<topic>.md
  pitch-<topic>.html
  quiz-<topic>.html
implementation-notes.md  ← /impl-notes (repo root, per the original article)
```

Before starting, check whether `.unknowns/` already has artifacts for this task — if so, read them first and build on them instead of restarting. Ask once whether to gitignore `.unknowns/`; default to adding it to `.gitignore`.

### The ledger (`.unknowns/ledger.md`)

The ledger is the plugin's progress bar: every unknown is a numbered entry with a lifecycle, and every skill opens and closes entries against it.

```markdown
| #  | Unknown (as a decidable question)        | Kind | Opened by   | Status |
|----|------------------------------------------|------|-------------|--------|
| U1 | What does "good" look like for grading?  | UU   | /blindspot  | ✅ closed by teach-back |
| U2 | Dense tables or airy cards?              | UK   | /unknowns   | ✅ closed by /brainstorm — criterion: dense |
| U3 | Conflict policy on concurrent edits?     | KU   | /interview  | ⏳ open — default: last-write-wins |
```

Kinds: `KU` known unknown · `UK` unknown known · `UU` unknown unknown. Rules every skill follows:

1. **Start**: read the ledger (create if missing) and name which open entries this pass targets.
2. **End — the closing ritual**: report the delta in chat, explicitly: `Closed: U2 (criterion voiced) · Opened: U9 · Still open: U3 (default: last-write-wins)`. Then update the file. Never end a skill without this line.
3. **Closing rule**: an entry closes only on the *user's* articulation or confirmation — a decision they made, a criterion they voiced, a teach-back they passed. Claude writing the answer in a report does not close it.

## Step 0 — Gate: is there a task? (HARD STOP)

If neither the invocation arguments nor the recent conversation identifies a **concrete task**, STOP:

- Do NOT scout the codebase, do NOT write any file, do NOT produce a map or any other artifact.
- Do NOT invent, guess, or pick a plausible task from the repo to demonstrate on. A 2×2 built without a real task is generic filler — worse than nothing.
- Your ENTIRE response is the three calibration questions from Step 1. Then wait.

"The conversation identifies a task" means the user has actually been discussing specific work in this session — not merely that the repo contains things you could work on.

## Step 1 — Understand the starting point

If the task isn't fully clear, ask (via AskUserQuestion if this harness has it; otherwise plain text), briefly:

1. The task, in their words.
2. Their familiarity: **codebase area** (never touched / read it / written in it) and **domain** (new to me / conversational / expert).
3. Where they are in their thought process: vague itch → rough idea → half-spec → ready to build.

Don't interrogate — three answers is enough to calibrate. Their familiarity level determines which quadrant of the 2×2 will dominate.

## Step 2 — Scout the territory (lightly)

Spend a few minutes grounding the map in reality before writing it:

- Grep/glob the codebase areas the task touches. Note module boundaries, existing similar features, and obvious conventions.
- Check `git log --oneline -15 -- <area>` for recent churn or reverted attempts.
- If the task involves an unfamiliar domain concept, do one quick pass to know what the sub-decisions are.

This is scouting, not a full blindspot pass — just enough that the unknown-unknowns quadrant contains real items, not placeholders.

## Step 3 — Build the 2×2 map

Write `.unknowns/map.md` and show it to the user:

| Quadrant | Definition | What goes here |
|---|---|---|
| **Known knowns** | What's already in the prompt. | Restate their stated requirements as bullet points. If a "requirement" is actually ambiguous, move it down a row. |
| **Known unknowns** | What they haven't figured out yet, and know they haven't. | Open questions they've voiced or implied. Phrase each as a decidable question. |
| **Unknown knowns** | So obvious they'd never write it down, but they'd recognize it if they saw it. | Taste, house conventions, "like our other pages", implicit users/scale. Flag these as *assumptions you would otherwise guess at*. |
| **Unknown unknowns** | Not considered at all. | From your scouting: prior art in the codebase, constraints they haven't hit yet, what "good" looks like in this domain, potholes. |

Rules for a useful map:
- Every item names something concrete (a file, a decision, a behavior) — "the auth module uses per-tenant keys, your plan assumes global" not "codebase conventions".
- 3–7 items per quadrant. If a quadrant is empty, say why (e.g. "you're expert here — thin quadrant").
- Mark the 2–3 items with the biggest blast radius with ⚠ — these drive the routing.

Then **seed the ledger**: every item in the lower three quadrants becomes a numbered `U#` entry in `.unknowns/ledger.md` (⚠ items first). This skill *opens* entries; it rarely closes any — the routed techniques do the closing, and from now on progress is visible as entries flipping to ✅.

**Let the map collect its own corrections.** Validating the map must be a paste, not an essay. Under the map, give paste-back correction lines:

```
Wrong U4 — {actually: …}
Promote U7   (this one is ⚠, you underrated it)
Demote U2    (not actually a concern because …)
Missing: {an unknown you didn't list}
```

("map is right" is also a valid reply.) In an HTML map, the same verbs become tap-able chips per item with a composed reply at the bottom. Don't route (Step 4) until the user has confirmed or corrected the map — routing on a wrong map sends them to the wrong technique.

## Step 4 — Route to the next technique

Recommend based on which quadrant holds the ⚠ items:

- **Unknown unknowns** dominate (new domain / unfamiliar code) → `/blindspot` — learn the territory before deciding anything.
- **Unknown knowns** dominate ("I'll know it when I see it", visual taste, fuzzy scope) → `/brainstorm` — produce options and prototypes to react to.
- **Known unknowns** dominate (clear task, open decisions) → `/interview` — resolve them one question at a time.
- User can't articulate the want but can point at something that has it → `/reference`.
- Map is mostly known knowns → `/impl-plan`, then implement with `/impl-notes`.
- Work already done → `/pitch` for buy-in, `/quiz` before merge.
- A result already **came back wrong** → `/diagnose` — trace which unknown caused the miss before re-prompting.

## Step 5 — Sequence the pre-implementation techniques

When more than one technique applies, the canonical order is:

```
/blindspot → /brainstorm → /interview → /impl-plan
                 (/reference slots in wherever the pointing happens)
```

Each step exists to make the NEXT one better — that's the whole ordering logic:

1. **`/blindspot` before `/brainstorm`**: brainstorming in a domain you don't understand produces generic options. Learn what "good" looks like first, then the options get sharp.
2. **`/brainstorm` before `/interview`**: interviewing before options exist locks in the first framing. Reactions to prototypes generate better questions than a blank page — and answer many of them for free.
3. **`/interview` before `/impl-plan`**: the plan must honor decisions, so make the decisions first. A plan full of `[OPEN]` markers is an interview that didn't happen.
4. **`/reference` is positional, not sequential**: run it the moment the user points at something — its semantics map replaces a whole cluster of interview questions ("behave like that").
5. **`/impl-plan` is the gate**: if any other pre-implementation technique ran, always finish with the plan — it's where their outputs (blindspot rewrite, criteria, decisions, semantics map) get consolidated into the artifact the implementing session receives.

**Never recommend all five by default.** Ceremony must scale with `task size × unfamiliarity × cost of being wrong`. Each technique is cheap relative to a wrong implementation, but not free relative to a small task. Presets:

| Situation | Sequence |
|---|---|
| Trivial fix, familiar code | none — just implement |
| Medium feature, familiar area | quick `/brainstorm` (scope check) → `/impl-plan` |
| Clear spec handed to you, open details | `/interview` → `/impl-plan` |
| Feature in an unfamiliar part of the codebase | `/blindspot` → `/interview` → `/impl-plan` |
| Taste-heavy work (UI, design, tone) | `/brainstorm` → `/interview` → `/impl-plan` |
| Entirely new domain AND taste-heavy | full stack: `/blindspot` → `/brainstorm` → `/interview` → `/impl-plan` |
| "Make it like X" | `/reference` → `/impl-plan` |

Skip rules (state them when you skip): skip `/blindspot` when the user is fluent in both the domain and this codebase area; skip `/brainstorm` when the solution shape is already fixed (bug fix, spec dictated from above); skip `/interview` when no Tier-1 questions survived brainstorming; skip `/impl-plan` only when the change is small enough that the diff itself is reviewable in one sitting.

**The sequence is iterative, not linear.** Unknowns found deep in implementation (via `/impl-notes` deviations) can send you back — a pileup of deviations means return to `/interview` or re-plan rather than improvising forward. Sometimes an interview answer reveals the problem should be solved a different way altogether; going backward is the technique working, not failing.

Recommend **one or two** techniques (plus the closing `/impl-plan` if any ran), name which ⚠ items each closes, and offer to run the first one now. The skill of agentic coding is knowing which gaps are worth closing.

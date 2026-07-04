---
name: pitch
description: Package the prototype, spec, and implementation notes into a single explainer document for buy-in and approvals. Use when the user needs to share finished work with reviewers or stakeholders, get sign-off, or says "make a pitch" or "explainer doc".
argument-hint: [change/feature to pitch] [audience]
---

# Pitch & Explainer

Shipping needs buy-in. A good pitch artifact accelerates two audiences at once:

- **Reviewers who start with the same unknowns you did** — they need the context you had to discover, pre-digested.
- **Experts who want to see you accounted for the unknowns** — they need evidence you hit the failure points they would have anticipated.

## Step 1 — Know the audience and destination

Ask (or infer) two things before writing: **who reads this** (teammates who know the codebase? a lead who reviews the decisions? a non-technical stakeholder?) and **where it lands** (Slack message, PR description, doc). These set the altitude and the format — a Slack drop wants one self-contained HTML file or a tight message with the doc attached; a PR wants markdown.

## Step 2 — Gather the raw material

Collect what the working session produced, in this priority:

1. `implementation-notes.md` — especially **Deviations** (section 5 of the doc writes itself from these)
2. `.unknowns/plan-*.md` — Tier-1 decisions and their rejected alternatives (section 4)
3. `.unknowns/decisions.md` — interview answers, brainstorm criteria
4. The diff (`git diff main...` or session scope)
5. Prototypes, screenshots, demo recordings

If the change is visual and no demo exists, offer to capture one before writing — **the demo leads the doc**. A before/after screenshot pair is the minimum; a GIF is better.

## Step 3 — Build one self-contained document

Write to `.unknowns/pitch-<topic>.html` from [templates/pitch-template.html](templates/pitch-template.html) (markdown if the destination prefers it). Structure, in order:

1. **The demo** — GIF/screenshot/before-after at the very top. Show, then tell.
2. **The problem in two sentences** — written for someone with zero context. No jargon from the project's private vocabulary.
3. **What was built** — user-visible behavior first, then the shape of the implementation (data model, interfaces) at the altitude a reviewer needs to *trust* it, not re-derive it.
4. **Decisions and why** — each Tier-1 choice with the rejected alternative and one-line reason. This is where expert reviewers decide you did your homework.
5. **What went differently than planned** — the Deviations, honestly, each with what was found and why the chosen option was conservative. Pre-empting "did you consider X?" is what accelerates approval.
6. **Risks, limits, follow-ups** — known debt, untested paths, rollout plan.
7. **Where to focus review** — the 2–3 files/decisions that deserve real scrutiny, with links. Directing review effort is a gift to the reviewer, not an admission of weakness.

## Writing rules

- **Two-speed reading**: the 90-second reader gets everything from the demo + section 2 + section headers; the 15-minute reader expands the details (use `<details>` blocks in HTML for Tier-2/3 material).
- **Honesty over polish**: an expert who catches one omitted deviation trusts nothing else in the doc. The Deviations section is the credibility engine — never sand it down.
- Keep the private session vocabulary out ("DEV-3", "the Tier-1 thing") — expand every reference into plain language.
- **Never send the document anywhere** (Slack, PR, email) yourself without explicit confirmation. Produce the artifact, show it to the user, hand it over.

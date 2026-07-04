---
name: pitch
description: Package the prototype, spec, and implementation notes into a single explainer document for buy-in and approvals. Use when the user needs to share finished work with reviewers or stakeholders, get sign-off, or says "make a pitch" or "explainer doc".
---

# Pitch & Explainer

Shipping needs buy-in. A good pitch artifact accelerates two audiences at once:

- **Reviewers who start with the same unknowns you did** — they need the context you had to discover, pre-digested.
- **Experts who want to see you accounted for the unknowns** — they need evidence you hit the failure points they would have anticipated.

## Step 1 — Gather the raw material

Collect what the working session produced: the spec or plan, prototypes/screenshots, `implementation-notes.md` (especially Deviations), the diff, and any demo recordings. If a demo GIF or screenshot exists, it leads the doc; if the change is visual and no demo exists, offer to capture one.

## Step 2 — Build one self-contained document

Default to a single self-contained HTML file (easy to drop in Slack or attach to a PR); markdown if the destination prefers it. Structure, in order:

1. **The demo** — GIF/screenshot/before-after up top. Show, then tell.
2. **The problem in two sentences** — written for someone with zero context.
3. **What was built** — the user-visible behavior, then the shape of the implementation (data model, interfaces), at the altitude a reviewer needs to trust it, not re-derive it.
4. **Decisions and why** — the Tier-1 choices from the plan, each with the rejected alternative. This is where expert reviewers decide you did your homework.
5. **What went differently than planned** — surfaced from implementation-notes Deviations, honestly. Pre-empting the "did you consider X?" question is what accelerates approval.
6. **Risks, limits, and follow-ups** — known debt, untested paths, rollout plan.
7. **What reviewers should look at** — the 2–3 files/decisions that deserve real scrutiny, so review effort lands where it matters.

## Rules

- Write for the reader who has 90 seconds; layer detail so the reader with 15 minutes is also served (collapsed sections work well in HTML).
- Honesty over polish: an expert who catches an omitted deviation trusts nothing else in the doc.
- Never send the document anywhere (Slack, PR, email) yourself without explicit confirmation — produce the artifact and hand it to the user.

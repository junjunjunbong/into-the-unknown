# Unknown-Finding v2

This note preserves the implementation order for the unknown-finding hardening
work. The contract is: transcript evals first, protocol hardening second, state
contract third, optional runtime fourth.

## Why This Order

The current skill bundle already states the right philosophy: scout before
asking, treat user-knowledge claims as hypotheses, keep discovery gated by
phase, and settle unknowns only through user-originated articulation,
confirmation, teach-back, or explicit deferral. The weak point is that too many
of those rules are prose-only. Building a runtime first would make the current
behavior more durable before the failure modes are measurable.

Unknown-Finding v2 should therefore make the bad behaviors reproducible before
it changes prompts, schemas, or runtime surfaces.

## Stage 1 - Transcript Evals First

Create transcript fixtures and a lightweight evaluator before prompt rewrites or
runtime files. The first red suite should cover the behaviors that caused the
original failure:

- Cold questions before evidence must fail.
- Any visible question before the scout report must fail.
- Batch questions must fail.
- Evidence-free blind spots must fail unless marked as guesses or converted
  into scouting targets.
- Premature routing to `/impl-plan` or `/interview` before P4 must fail.
- Meta-feedback must resume the current phase instead of abandoning the
  protocol.
- Discovery must not dump both an internal digest and a user-facing map.

The evaluator should make these regressions visible without calling external
models. It should validate recorded transcripts and fixture metadata, not infer
agent quality from a successful command alone.

## Stage 2 - Protocol Hardening Second

After evals expose the failures, harden the discovery protocol around its
existing phase gates:

- P1 scout: collect repo, docs, logs, history, and other territory evidence
  before asking the user anything.
- P2 report: show one compact evidence-backed scout report, ranked blind-spot
  hypotheses, and at most one evidence-attached question.
- P3 probe: ask one decision per turn, only when the scoutability,
  blast-radius, and ownership tests pass.
- P4 handoff: route only after plan-changing unknowns are settled or the probe
  budget is spent.

The hardening target is not more ceremony. It is to turn "do not ask cold
questions", "do not ask batch questions", and "do not route early" into checks
that can fail loudly when the agent drifts.

## Stage 3 - State Contract Third

Once the transcript contract is measurable, define the quiet human ledger plus a
machine-readable state contract. The human surface should stay quiet and small;
the machine surface should preserve enough state to resume without replaying
from memory.

Recommended quiet ledger columns:

```text
| U# | phase | question | evidence | owner_action | status | source_refs | why_stopped | opened_by | updated_at |
```

Recommended `.unknowns/state.jsonl` fields:

- `unknown_id`, `session_id`, `event_type`
- `phase`, `status`, `resume_cursor`
- `question`, `evidence`, `source_refs`
- `owner_action`, `why_stopped`, `stopped_kind`
- `opened_by`, `updated_at`
- `close_gate`, `closed_by_event`, `closure_evidence`

The close rule stays strict: `settled_candidate` is not final. An unknown closes
only on user-originated articulation, confirmation, teach-back, or an explicit
recorded deferral. Generated prose can move an unknown into a file, but it does
not settle the unknown by itself.

The state shape should follow the same evidence discipline as the ULW loop
precedent: success criteria declare expected evidence, captured evidence is
recorded separately, and ledger entries preserve event kind, status, before and
after state, and required external decisions.

## Stage 4 - Optional Runtime Fourth

The runtime is future work and remains optional until the evals and state
contract stabilize. Do not create `package.json`, `.mcp.json`, `src/`, hooks, or
TypeScript implementation files as part of this stage-3 planning spec.

If Stages 1-3 show deterministic recurring failures, a small Node/TypeScript
runtime can enforce the contract later. Its job should be to validate state
transitions, lint `.unknowns` records, and expose optional MCP or hook entry
points. It must enforce the Markdown skill contract, not replace or redefine it.

## Acceptance Boundary

This document is complete when it preserves the staged strategy and makes the
failure classes explicit:

- evals first
- protocol hardening
- state contract
- optional runtime
- cold questions
- batch questions
- premature routing
- closure_evidence

Everything beyond that belongs to later todos: transcript fixtures, state
contract wiring, and any future runtime adapter.

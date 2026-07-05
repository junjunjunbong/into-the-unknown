# Unknowns State Contract

This contract defines the durable state for unknown-finding skills. It keeps the
human-facing ledger quiet while giving future sessions enough machine state to
resume without reconstructing the work from chat.

## Surfaces

Use both files when an unknown is opened, updated, paused, reopened, or closed.
They serve different readers:

- `.unknowns/ledger.md` is the quiet human index. It is small, append-friendly,
  and only meant to show the current shape of open or recently closed unknowns.
- `.unknowns/state.jsonl` is the machine recovery trail. It records every state
  transition as JSON Lines so a later session can recover phase, cursor, stop
  reason, owner action, and closure evidence.

The agent owns both files. The user should only answer, correct, teach back,
delegate, defer, or approve in normal conversation and artifacts. Ledger upkeep
must not become user work, and the chat surface stays quiet: at most one plain
movement sentence when something changed.

## `ledger.md` V2

The ledger is a compact index, not the source of truth for every transition.
Keep existing `U#` identities stable. If migrating an older four-column ledger,
preserve existing IDs and append the new fields.

```md
| U# | phase | question | evidence | owner_action | status | source_refs | why_stopped | opened_by | updated_at |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| U12 | discovery:P3 | Which conflict policy should win? | README.md:119 | choose | awaiting_owner | README.md:119-121 | waiting for owner decision | discovery | 2026-07-05T12:10:00+09:00 |
```

Column rules:

- `U#`: stable human ID such as `U12`. It maps to `unknown_id` in
  `state.jsonl`.
- `phase`: current skill phase or handoff point, such as `discovery:P2`,
  `blindspot:teach-back`, `interview:question-3`, or `impl-notes:wrap-up`.
- `question`: the unresolved decision, concept, or risk in one line.
- `evidence`: shortest useful citation or observation that opened the unknown.
- `owner_action`: the next or latest owner move, using values such as `answer`,
  `choose`, `teach-back`, `confirm`, `restate`, `approve`, `reject`,
  `delegate`, or `defer`.
- `status`: one of `open`, `awaiting_owner`, `blocked`, `deferred`,
  `settled_candidate`, or `settled`.
- `source_refs`: line-level files, artifacts, transcript turns, or event IDs
  that justify the current row.
- `why_stopped`: why this unknown is not moving right now. Required for every
  non-settled row.
- `opened_by`: skill or event that first opened the unknown.
- `updated_at`: ISO-8601 timestamp with timezone.

## `state.jsonl`

Each line is one JSON object. The latest event for an `unknown_id` gives the
resume state; earlier events preserve the audit trail.

Required fields:

- `unknown_id`: stable ID matching the ledger row, for example `U12`.
- `session_id`: session or run identifier that wrote the event.
- `event_type`: `opened`, `updated`, `owner_action_recorded`, `checkpoint`,
  `stopped`, `reopened`, or `settled`.
- `phase`: skill and phase at the event.
- `status`: lifecycle state after the event.
- `resume_cursor`: exact place to resume, such as `P3 probe question 2`.
- `question`: unknown text at this event.
- `evidence`: structured evidence objects with `ref` and `note`.
- `source_refs`: line-level source references, artifact paths, transcript turn
  IDs, or prior event IDs.
- `owner_action`: latest user-owned action or expected next action.
- `why_stopped`: stop reason for every non-settled event.
- `stopped_kind`: `checkpoint`, `user_wait`, `budget`, `risk`, `policy`,
  `handoff`, or `error`.
- `opened_by`: skill, phase, or event that opened the unknown.
- `updated_at`: ISO-8601 timestamp with timezone.
- `close_gate`: closure rule that must pass before final settlement.
- `closed_by_event`: event ID, transcript turn, artifact action, or note that
  performed the close.
- `closure_evidence`: user-originated evidence that satisfies `close_gate`.

Example event:

```json
{
  "unknown_id": "U12",
  "session_id": "2026-07-05T12:10:00+09:00-task-8",
  "event_type": "stopped",
  "phase": "discovery:P3",
  "status": "awaiting_owner",
  "resume_cursor": "P3 probe question 2",
  "question": "Which conflict policy should win?",
  "evidence": [
    {
      "ref": "README.md:119-121",
      "note": "quiet ledger and strict settling are promised"
    }
  ],
  "source_refs": ["README.md:119-121"],
  "owner_action": "choose",
  "why_stopped": "waiting for an owner decision",
  "stopped_kind": "user_wait",
  "opened_by": "discovery",
  "updated_at": "2026-07-05T12:10:00+09:00",
  "close_gate": "user articulation",
  "closed_by_event": null,
  "closure_evidence": null
}
```

## Closure Gates

`settled_candidate` is not final. It means the agent has enough evidence to
propose closure, but one of the gates below still has to occur before `settled`.

Allowed close gates:

- `user articulation`: the user states the decision, criterion, concept, or
  correction in their own words.
- `explicit confirmation`: the user accepts a proposed interpretation or
  verdict.
- `teach-back`: the user answers or restates the key blindspot well enough to
  show the concept is now usable.
- `explicit recorded deferral`: the user knowingly parks the unknown, delegates
  it, or accepts a named default, and the event records the consequence.

Generated prose cannot settle an unknown. A report, plan, summary, or answer can
create `settled_candidate`, but final `settled` requires `closure_evidence` from
one of the gates above.

## Recovery Rules

- Read `.unknowns/ledger.md` silently at skill start if it exists.
- Replay `.unknowns/state.jsonl` by `unknown_id` when machine recovery is
  needed. The latest event wins unless a later event is malformed or points to
  missing closure evidence.
- If a line is malformed JSON, uses an unknown enum value, or misses required
  fields, ignore it for current-state recovery and append a corrected event
  later; do not treat malformed input as a successful close.
- Resume from `phase` plus `resume_cursor`, and explain only the next action in
  chat.
- Every non-settled stop must write `why_stopped`, `stopped_kind`, and
  `resume_cursor`.
- Every settled event must write `close_gate`, `closed_by_event`, and
  `closure_evidence`.
- If a closure event lacks user-originated `closure_evidence`, downgrade it to
  `settled_candidate` or `reopened`.

## Skill Wiring

Skills should point to this contract instead of duplicating the whole schema.
Keep the chat promise local in each skill: read and write state quietly, mention
only meaningful movement, and never ask the user to manage files.

# Runtime Adapter Design

This is a design note only. Do not implement yet.

The future runtime adapter is Stage 3 of the adapter track: it starts only
after parity, after evals, and after state pass. In the broader
unknown-finding v2 staging, this means it remains future optional runtime work
after the shared product contract, transcript behavior, and `.unknowns` state
contract are measurable.

No runtime files belong to this todo. Do not create `package.json`, `.mcp.json`,
`src/`, hook configs, generated manifests, scripts, or dependency wiring from
this document.

## Goals

- Keep Claude Code and Codex as equal first-class clients.
- Put unknown-finding lifecycle rules in a shared core instead of duplicating
  policy in client adapters.
- Preserve the current Markdown skill contract as the source of product
  behavior until evals and state checks prove that runtime enforcement is worth
  adding.
- Make every optional integration removable: no user should need hooks or an
  MCP server to use the skill files.

## Future Architecture

```text
skills/ and docs/
  -> shared core policy and state contract
runtime shared core
  -> state parser, transition reducer, evidence validator
Claude Code adapter
  -> Claude plugin and hook boundary
Codex adapter
  -> Codex plugin and hook boundary
optional MCP server
  -> explicit tool surface for state inspection and validation
optional hooks
  -> lifecycle checks that call the shared core
writable data dirs
  -> per-client cache, snapshots, and repair logs
```

The shared core should be pure and client-neutral. It should accept state,
events, and policy options, then return either a validated next state or a
structured rejection. The adapters should translate client-specific inputs into
that shared event shape and translate shared-core results back into the client
hook or MCP response shape.

## Shared Core

The shared core should eventually own:

- `.unknowns/state.jsonl` parsing and append validation
- quiet ledger row validation
- phase transition checks for scout, report, probe, and handoff
- close-gate validation for user articulation, confirmation, teach-back, or
  explicit recorded deferral
- evidence requirements inspired by the ULW loop shape: criteria or events
  declare expected evidence, captured evidence is stored separately, and ledger
  entries keep kind, status, before state, after state, and external decisions
- deterministic errors for cold questions, batch questions, evidence-free blind
  spots, premature routing, and generated-prose closure

The shared core must not call Claude Code, Codex, shell commands, MCP tools, or
network APIs directly. It should be small enough to run from a hook, an MCP
tool, or a local CLI wrapper later without changing policy semantics.

## Claude Code Adapter

The Claude Code adapter should be a thin boundary around official Claude Code
plugin and hook behavior. It can translate Claude hook inputs such as prompt,
tool, file, and session events into shared-core events, then return the narrowest
supported hook decision.

Future Claude Code adapter responsibilities:

- read plugin-root files and writable plugin data locations from the client
  environment
- normalize Claude Code hook event names into shared-core event types
- surface rejections in the hook response without rewriting the shared policy
- keep reload notes explicit: local plugin and hook changes may require the
  user to reload or restart the client, depending on the installed surface
- keep trust notes explicit: hooks are executable automation and should be
  reviewed before enabling

It should not add a Claude-only state schema or make Claude Code the canonical
runtime.

## Codex Adapter

The Codex adapter should mirror the Claude Code adapter at the platform
boundary. Codex plugin manifests can point to bundled skills, MCP config, apps,
and hooks when those files actually exist; this design must not add those
pointers yet.

Future Codex adapter responsibilities:

- translate Codex hook inputs into shared-core events
- use Codex plugin writable data directories for adapter-local cache and repair
  logs, not for canonical user state
- respect Codex trust review for plugin-bundled hooks before any hook is treated
  as active
- keep reload notes explicit: manifest, hook, and MCP changes should be
  documented as needing whatever Codex reload or restart path the active client
  requires
- preserve compatibility environment handling where Codex exposes
  `PLUGIN_ROOT`, `PLUGIN_DATA`, and Claude-compatible plugin variables

It should not add a Codex-only state schema or claim hooks are running without
QA evidence.

## Optional MCP

An optional MCP server can be added after the shared core is stable. It should
not be the first runtime surface.

Good MCP candidates:

- `unknowns.validate_state`: parse `.unknowns/state.jsonl` and return structured
  validation errors
- `unknowns.inspect_open`: list open unknowns with source references and stop
  reasons
- `unknowns.propose_transition`: dry-run a phase or close-gate transition
- `unknowns.explain_policy`: return the current policy version and relevant
  rule names

The optional MCP server should be read-mostly at first. Any write tool must use
the same append-only transition path as hooks and must preserve user-owned files
without silent rewrites.

## Optional Hooks

Optional hooks should enforce only rules already proven by evals and the state
contract. They should not introduce new policy.

Possible hook checks:

- before a visible user question, reject cold or batch questions unless the
  scout report and ownership test are present
- before routing to implementation planning or interview, require the handoff
  gate or a recorded deferral
- after a generated report, validate that generated prose did not mark an
  unknown as settled without user-originated closure evidence
- after writing `.unknowns` files, validate append-only state and ledger
  consistency

Hook output should be concise and actionable. The default failure mode should be
to block only the unsafe transition, not the whole session.

## Writable Data Directories

Canonical project state should stay in repo-local `.unknowns/` files. Runtime
data directories are for adapter-owned implementation details only.

Allowed future data-dir contents:

- normalized hook input snapshots for debugging
- adapter cache keyed by policy version and state file hash
- temporary repair suggestions that have not been applied
- local trust or reload diagnostics

Disallowed data-dir contents:

- the only copy of an unknown
- hidden policy decisions that are not reflected in repo files
- credentials, tokens, or user secrets
- chat transcripts unless the user explicitly opts into that storage

## Trust And Reload Notes

Trust and reload behavior is client-specific and must stay adapter-owned.

- Hooks are executable automation. A future implementation must document exactly
  what each hook can read, write, and block before users enable it.
- Plugin-bundled hooks should be treated as inactive until the relevant client
  confirms trust or review.
- Reload behavior should be documented per client and per surface: skill text,
  manifests, hook config, MCP config, and runtime binaries may not refresh at
  the same time.
- Runtime diagnostics should distinguish "not installed", "installed but not
  trusted", "trusted but stale", and "active" instead of collapsing those states
  into success.

## Implementation Gate

The future runtime can start only when all of these are true:

1. Parity checks pass for the current Claude Code and Codex plugin surfaces.
2. Transcript evals catch the known premature-conclusion failures.
3. The `.unknowns` state contract exists and has validation coverage.
4. The adapter design is still accurate against current official plugin and hook
   docs.
5. A failing-first runtime test plan exists for shared-core transitions and for
   each client adapter.

Until then, this repository should remain a file-backed skill bundle. Runtime is
future optional enforcement, not current product behavior.

## Reference Anchors

- Codex plugin build docs: `https://developers.openai.com/codex/plugins/build`
- Codex hooks docs: `https://developers.openai.com/codex/hooks`
- Claude Code plugin docs: `https://code.claude.com/docs/en/plugins`
- Claude Code hooks reference: `https://code.claude.com/docs/en/hooks`
- Claude Code hooks guide: `https://code.claude.com/docs/en/hooks-guide`
- Local ULW state/evidence inspiration:
  `/Users/junwon/.codex/plugins/cache/sisyphuslabs/omo/4.15.1/components/ulw-loop/src/domain-types.ts`

# Final Parity Report

## Summary

Claude Code and Codex now present `into-the-unknown` as the same file-backed
unknown-finding product: equal first-viewport README positioning, aligned plugin
identity metadata, shared skill/template wording, the same `.unknowns` artifact
contract, and the same transcript fixture gate for premature-conclusion
failures.

This is parity at the docs, metadata, skills, fixture, and static-QA layer. It
does not claim a shared TypeScript runtime, MCP server, hook implementation, or
live adapter process exists today.

## Same-Feel Surface

- Both READMEs describe a "Claude Code and Codex" plugin from the opening
  product line.
- The manifests agree on `name`, `version`, shared description, repository,
  license, author, and keywords where each client supports those fields.
- Shared skill and template text no longer uses generic Claude-only wording.
  Platform names remain only for client-specific install, attribution, or
  manifest contexts.
- The artifact model is shared: `.unknowns/ledger.md` stays the quiet human
  index, `.unknowns/state.jsonl` carries machine recovery state, and
  `closure_evidence` must come from user articulation, confirmation,
  teach-back, or explicit recorded deferral.

## Remaining Client Differences

- Invocation and plugin-management syntax remain client-specific.
- Codex local smoke succeeded with an isolated `CODEX_HOME` after creating the
  temporary home directory first.
- Claude Code local smoke reached the `claude` binary with an isolated `HOME`,
  but stopped at `Not logged in · Please run /login`. This is recorded as
  surface unavailable/auth-blocked, not as a Claude surface pass.
- Reload, trust, hook, and MCP behavior remain documented future-runtime
  concerns, not current behavior.

## Enforced Unknown-Finding v2 Behavior

`scripts/check-transcript-fixtures.mjs` validates eight fixture classes across
both client labels:

- vague goal with concrete territory
- cold A/B question rejection
- no visible question before scout report
- no batch questions
- meta-feedback resume
- evidence-free blindspot rejection
- no digest plus map double dump
- no premature `/impl-plan` or `/interview` routing

The validator also has an intentional invalid path:
`node scripts/check-transcript-fixtures.mjs --expect-fail` rejects a bad fixture
and exits 0 only when the rejection is observed.

## Evidence

- Parity contract: `docs/plugin-parity.md`
- Unknown-finding strategy: `docs/unknown-finding-v2.md`
- State contract: `docs/unknowns-state-contract.md`
- Future adapter design: `docs/runtime-adapter-design.md`
- Validators: `scripts/check-plugin-parity.mjs`,
  `scripts/check-transcript-fixtures.mjs`
- Transcript fixtures: `evals/transcripts/unknown-finding-v2/*.json`
- Final static QA: `node scripts/check-plugin-parity.mjs` and
  `node scripts/check-transcript-fixtures.mjs`
- Failure-path QA: `node scripts/check-plugin-parity.mjs --self-test` and
  `node scripts/check-transcript-fixtures.mjs --expect-fail`

## Residual Risks

- The Claude Code surface was not live-smoked under an authenticated isolated
  home, so the final verdict is static-pass plus Codex-smoke-pass, with Claude
  surface unavailable.
- There is no runtime adapter yet; state validation and transition enforcement
  remain documented contracts and fixture checks.
- Future work should implement the shared core only after parity, eval, and
  state contracts remain stable, then test Claude Code and Codex adapters
  separately without claiming one client as canonical.

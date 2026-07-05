# Plugin Parity Contract

This document defines the current cross-client contract for `into-the-unknown`.
Claude Code and Codex are equal first-class surfaces for the same unknown-finding
product. The contract covers docs, metadata, shared skill files, and QA evidence.
It does not claim that a shared TypeScript runtime, hooks, MCP server, or client
adapter process exists today. Those may be designed later as optional runtime
work after parity, eval, and state checks exist.

## Shared Product Promise

Users should get the same product promise from Claude Code and Codex:

- Discover unknowns before, during, and after implementation.
- Use the same skill loop: discovery, blindspot pass, brainstorm, interview,
  reference study, implementation plan, implementation notes, pitch, diagnose,
  and quiz.
- Preserve continuity through repo-local artifacts such as `.unknowns/` and
  generated notes, plans, reports, and quizzes.
- Keep the ledger quiet in chat while enforcing strict closure: an unknown is
  settled only by user articulation, confirmation, teach-back, or explicit
  recorded deferral.
- Record evidence honestly when a local client smoke test cannot run.

## Shared core

Shared core files are client-neutral. They define the product behavior and must
not privilege either client in generic instructions.

| Path | Role | Parity rule |
| --- | --- | --- |
| `skills/**/SKILL.md` | Skill instructions and routing | Use agent-neutral wording for generic behavior. |
| `skills/**/templates/**` | Generated report, quiz, and plan formats | Keep output semantics client-neutral. |
| `.unknowns/` artifacts | User workspace state created by skills | Same artifact names and closure rules on both clients. |
| `docs/*.md` | Shared contracts and implementation notes | Describe current behavior separately from future options. |
| Future validators under `scripts/` | Static parity and eval checks | Use repo state as the source of truth, not client marketing copy. |

Shared core wording should prefer `the agent`, `assistant`, `model`, `skill`,
or `client` unless the sentence is specifically about installing or testing a
platform.

## Client adapters

Client adapters are the places where platform-specific syntax and schema belong.

| Path or surface | Client | Current purpose |
| --- | --- | --- |
| `.claude-plugin/plugin.json` | Claude Code | Plugin metadata consumed by Claude Code. |
| `.claude-plugin/marketplace.json` | Claude Code | Marketplace entry and plugin source metadata. |
| `.codex-plugin/plugin.json` | Codex | Codex plugin entry point and component pointers. |
| `README.md` and `README.ko.md` install sections | Both | Human install and local checkout commands for each client. |
| Future runtime adapter docs | Both | Optional design only until real files and QA exist. |

Adapter differences are allowed when they are real platform differences: command
syntax, reload behavior, trust behavior, manifest schema, install marketplace
syntax, local smoke commands, and invocation names. They must be documented as
differences, not as product superiority.

## Allowed platform terms

Use platform names with these limits:

- `Claude Code and Codex` is the preferred equal-surface wording in first-view
  product copy and parity summaries.
- `Claude Code` is allowed for install instructions, local smoke commands,
  plugin manifest notes, reload or trust notes, source attribution to the
  Claude Code team, and client-specific limitations.
- `Codex` is allowed for install instructions, local smoke commands, plugin
  manifest notes, Codex `interface` metadata, and client-specific limitations.
- Bare `Claude` should appear only when quoting an existing source, naming the
  underlying model family, or preserving historical source attribution. Generic
  skill behavior should not say that Claude performs the action.
- Generic behavior should not say that Codex performs the action unless the
  sentence is about Codex-specific installation, schema, or smoke testing.
- Source attribution to Thariq and the Claude Code team may remain, but it must
  not make one client the product owner in current user-facing promise copy.

## Supported Manifest Fields

Keep manifest parity at the overlap, then document client-specific fields where
the official client docs support them.

| Field or component | Claude Code | Codex | Rule |
| --- | --- | --- | --- |
| `name` | Supported in `.claude-plugin/plugin.json` and marketplace entries | Supported in `.codex-plugin/plugin.json` | Must stay `into-the-unknown` across clients. |
| `version` | Supported in plugin metadata and used for update decisions | Supported in `.codex-plugin/plugin.json` | Must match across client manifests when present. |
| `description` | Supported in plugin and marketplace metadata | Supported in `.codex-plugin/plugin.json` | Must describe the same product promise. |
| Publisher metadata | Current Claude manifest uses `author`, `homepage`, `license`, `keywords`; marketplace uses `owner` and `metadata` | Codex supports `author`, `homepage`, `repository`, `license`, and `keywords` | Keep shared identity aligned; add client-only fields only when schema support is documented. |
| `skills` component pointer | Claude Code discovers plugin-root `skills/` directories | Codex supports `skills` paths relative to plugin root | Keep `skills/` as the shared core. Do not invent a Claude `skills` manifest field without documented support. |
| `mcpServers`, `apps`, `hooks` | Claude Code supports plugin-root component files for real components | Codex supports component pointers for real components | Do not add these fields until real component files and QA exist. |
| `interface` | Not a Claude manifest field in this repo | Optional Codex install-surface metadata | Allowed only as Codex presentation metadata; it must not redefine the product promise. |

References:

- OpenAI Codex plugin build docs: https://developers.openai.com/codex/plugins/build
- Claude Code plugin docs: https://code.claude.com/docs/en/plugins
- Claude Code plugin reference: https://code.claude.com/docs/en/plugins-reference

## README Wording Rules

README copy is part of the product contract.

- The opening product sentence in both languages should name both clients as
  first-class surfaces.
- Install sections should remain symmetric: Claude Code commands in the Claude
  Code section, Codex commands in the Codex section, and local checkout commands
  for both when available.
- Invocation names may differ by client. Say that explicitly instead of implying
  command syntax parity.
- Generic behavior should use agent-neutral wording. For example, say the agent
  fills templates or keeps bookkeeping, not that a specific client does it.
- Source attribution can stay near the top, but it must be separate from the
  current product promise.
- Do not state that hooks, MCP, background monitors, TypeScript, or a shared
  runtime are active unless those files exist and have QA evidence.

## QA matrix

Each parity-changing task should capture command output, not only a pass/fail
claim.

| Surface | Command | Binary observable |
| --- | --- | --- |
| Contract exists and has required headings | `test -f docs/plugin-parity.md && rg -n "Shared core|Client adapters|Allowed platform terms|QA matrix|Same-feel acceptance" docs/plugin-parity.md` | All five headings are printed. |
| Equal first-class wording | `rg -n "Claude Code.*Codex|Codex.*Claude Code" docs/plugin-parity.md README.md README.ko.md` | Product copy names both clients together. |
| Forbidden positioning terms | Run the plan's negative wording check against this file. | No matches. |
| Manifest JSON validity | `jq empty .claude-plugin/plugin.json .claude-plugin/marketplace.json .codex-plugin/plugin.json` | Exit code 0. |
| Shared identity | `jq -r '.name, .version, .description' .claude-plugin/plugin.json .codex-plugin/plugin.json` | Name and version match; descriptions make the same promise. |
| Manual document inspection | `sed -n '1,220p' docs/plugin-parity.md` | Required headings are visible and runtime is described as future/optional, not current. |
| Surface smoke | Isolated Claude Code and Codex plugin commands from the active plan | Pass if the client runs; otherwise record the exact unavailable/auth failure and rely on static checks. |

## Same-feel acceptance

Same-feel does not mean identical CLI syntax. It means a user entering through
Claude Code or Codex experiences the same product behavior:

- Same product promise in the first viewport.
- Same shared skill set and artifact names.
- Same unknown-settling rule.
- Same expectation that the ledger is quiet and continuity is file-backed.
- Same refusal to route prematurely before evidence exists.
- Same generated artifact purposes: map, blindspot report, brainstorm options,
  decisions, implementation plan, implementation notes, pitch, and quiz.
- Same honest QA standard: static checks are hard gates; unavailable surface
  smoke is recorded as unavailable, not converted into a pass.
- Same separation between current file-based skill behavior and future optional
  runtime enforcement.

Any future change fails this contract if it makes one client the canonical user
experience while the other becomes an appendix, compatibility note, or stale
install path.

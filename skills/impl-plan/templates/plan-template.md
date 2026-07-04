# Implementation Plan: {feature}

> Inputs: {decision record / blindspot report / prototype used}
> Date: {date} · Estimated scope: {S/M/L, N files}

## Tier 1 — Review these (most likely to change)

### 1.1 Data model

```sql
-- actual DDL / schema diff, not prose
```

**Why this shape:** {one paragraph}
**Rejected:** {alternative} — {why}
**Pick the alternative if:** {the concrete condition that would justify overriding}
**Reversibility:** {cheap to change later / requires migration+backfill}
> Override: `Override 1.1: {alternative}; accept {its cost}.` ← paste back verbatim to flip this

### 1.2 Interfaces & contracts

```ts
// actual proposed types / endpoint signatures
```

**Rejected:** {alternative} — {why}
**Pick the alternative if:** {…}
> Override: `Override 1.2: {…}`

### 1.3 User-facing behavior

- Happy path: {…}
- Empty / error / loading: {…}
- Sad path ({conflict, permission, offline…}): {what the user sees}

**Rejected:** {alternative} — {why}
**Pick the alternative if:** {…}
> Override: `Override 1.3: {…}`

## Tier 2 — Defaults (flag if you disagree)

| Decision | Default | Alternative |
|---|---|---|
| {on conflict} | {last-write-wins} | {merge — say so if wanted} |
| {rollout} | {behind flag `x`} | {straight to prod} |
| {test strategy} | {unit on X, one e2e on Y} | {…} |

## Tier 3 — Mechanical (listed for scope; no review needed)

1. {step} — `{files}` ({S/M})
2. {step} — `{files}` ({S/M})

## Open unknowns

| Unknown | Planned default if unanswered |
|---|---|
| {question} | {default} |

## Improvisation room

<!-- Where the territory might disagree with this map, and the rule for each.
     /impl-notes deviations get logged against this section. -->

- {unverified assumption} → if wrong: {conservative fallback rule}
- {uninspected code path} → {…}

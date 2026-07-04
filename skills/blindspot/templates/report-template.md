# Blindspot Pass: {topic}

> For: {who the user is / calibration line}
> Date: {date} · Scope: {files/areas or domain explored}

## 1. Mental model

<!-- 3–5 concepts, one short paragraph each. Anchor to a codebase example where possible. -->

- **{Concept}** — {what it is, why it matters here}. See `{file:line}`.

## 2. What good looks like

<!-- The checklist an expert reviewer would apply to work in this area. -->

- [ ] {criterion}
- [ ] {criterion}

## 3. Historical work & prior art

<!-- What exists that the user would otherwise reinvent or contradict. -->

| What | Where | Why it matters for this task |
|---|---|---|
| {existing feature/util/pattern} | `{file:line}` | {reuse it / don't contradict it / it constrains you} |

## 4. Potholes

<!-- Mistakes people make here; non-obvious constraints; reverts and hacks with their story.
     Type each finding: Landmine / History / Missing concept / Convention.
     End each with ONE copyable constraint sentence, prompt-ready. -->

### ⚠ `Landmine` — {headline: the threat in one sentence}
{why it bites — evidence: revert commit, TODO, incident, domain lore}. {what to do about it}
> **Constraint:** {one copyable sentence ready to paste into a prompt}

### `Convention` — {headline}
{why} · {what to do}
> **Constraint:** {…}

## 5. Questions you didn't know to ask

<!-- Each: a decidable question + one line on why it matters. Feeds /interview. -->

1. **{question}?** — {why the answer changes the work}
2. **{question}?** — {why the answer changes the work}

---

## Your improved prompt

<!-- The consolidated deliverable: numbered constraints matching the findings, a suggested
     sequence, explicit deliverables. One copyable block — [Copy prompt] in the HTML version. -->

**Before (original ask):**

> {original prompt}

**After (knowing the above):**

> {task restated}
> Constraints:
> 1. {constraint sentence from finding 1}
> 2. {constraint sentence from finding 2}
> Suggested sequence: {…}
> Deliverables for validation: {…}
> Open: {`[OPEN]` markers on unresolved decisions}

<!-- Each numbered constraint is a sentence the user couldn't have written this morning. -->

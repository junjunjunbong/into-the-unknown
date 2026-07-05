#!/usr/bin/env node
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fixtureDir = path.join(repoRoot, "evals", "transcripts", "unknown-finding-v2");
const requiredClientLabels = ["Claude Code", "Codex"];
const requiredFailureClasses = [
  "vague_goal_concrete_territory",
  "cold_ab_question_rejection",
  "no_visible_question_before_scout_report",
  "no_batch_questions",
  "meta_feedback_resume",
  "evidence_free_blindspot_rejected",
  "no_digest_map_double_dump",
  "no_premature_impl_plan_or_interview"
];
const earlyRoutes = ["/impl-plan", "/interview"];

const args = process.argv.slice(2);
if (args.some((arg) => arg !== "--expect-fail")) {
  console.error("Usage: node scripts/check-transcript-fixtures.mjs [--expect-fail]");
  process.exit(2);
}

const expectFail = args.includes("--expect-fail");

function arrayOfStrings(value) {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function questions(turn) {
  return Array.isArray(turn.questions) ? turn.questions : [];
}

function evidenceRefs(entity) {
  return Array.isArray(entity?.evidenceRefs) ? entity.evidenceRefs : [];
}

function visibleAssistantTurns(fixture) {
  return fixture.turns.filter((turn) => turn.role === "assistant" && turn.visible === true);
}

function sentenceCount(text) {
  return (text.match(/[.!?](?:\s|$)/g) ?? []).length || (text.trim() ? 1 : 0);
}

function hasRouteText(turn) {
  return earlyRoutes.some((route) => {
    const routes = Array.isArray(turn.routes) ? turn.routes : [];
    return routes.includes(route) || String(turn.text ?? "").includes(route);
  });
}

function isBeforeHandoff(turn) {
  return turn.phase !== "P4_HANDOFF";
}

async function loadFixtures() {
  const names = (await readdir(fixtureDir)).filter((name) => name.endsWith(".json")).sort();
  const fixtures = [];
  for (const name of names) {
    const fullPath = path.join(fixtureDir, name);
    try {
      const parsed = JSON.parse(await readFile(fullPath, "utf8"));
      fixtures.push({ ...parsed, __fileName: name });
    } catch (error) {
      fixtures.push({ __fileName: name, __parseError: error.message });
    }
  }
  return fixtures;
}

function invalidFixture() {
  return [{
    __fileName: "intentional-invalid.json",
    id: "intentional-invalid",
    failureClass: "cold_ab_question_rejection",
    clientLabels: ["Codex"],
    prompt: "Should I do train40 or submission-safe?",
    expectedBadBehavior: "invalid",
    expectedGoodBehavior: "invalid",
    references: [],
    turns: [{
      role: "assistant",
      phase: "P1_SCOUT",
      visible: true,
      kind: "clarifying_question",
      text: "Do you mean train40 or submission-safe?",
      questions: [{ text: "Do you mean train40 or submission-safe?", evidenceRefs: [] }]
    }]
  }];
}

function validateFixture(fixture) {
  const errors = [];
  const label = fixture.__fileName ?? fixture.id ?? "<unknown>";
  const fail = (message) => errors.push(`${label}: ${message}`);

  if (fixture.__parseError) {
    fail(`invalid JSON: ${fixture.__parseError}`);
    return errors;
  }
  if (typeof fixture.id !== "string" || fixture.id.length === 0) fail("missing string id");
  if (fixture.__fileName && fixture.__fileName !== `${fixture.id}.json`) fail("filename must match id");
  if (!requiredFailureClasses.includes(fixture.failureClass)) fail("unknown or missing failureClass");
  if (!arrayOfStrings(fixture.clientLabels)) fail("clientLabels must be strings");
  for (const labelName of requiredClientLabels) {
    if (!fixture.clientLabels?.includes(labelName)) fail(`missing client label ${labelName}`);
  }
  if (typeof fixture.expectedBadBehavior !== "string") fail("missing expectedBadBehavior");
  if (typeof fixture.expectedGoodBehavior !== "string") fail("missing expectedGoodBehavior");
  if (!arrayOfStrings(fixture.references) || fixture.references.length === 0) fail("missing references");
  if (!Array.isArray(fixture.turns) || fixture.turns.length < 2) fail("turns must contain user and assistant entries");

  const turns = Array.isArray(fixture.turns) ? fixture.turns : [];
  const visibles = visibleAssistantTurns({ turns });
  const firstReportIndex = turns.findIndex((turn) => turn.role === "assistant" && turn.visible && turn.kind === "scout_report");
  const firstVisible = visibles[0];

  if (!firstVisible) fail("missing visible assistant turn");
  if (firstVisible && firstVisible.kind !== "scout_report") fail("first visible assistant turn must be scout_report");
  if (firstReportIndex < 0) fail("missing visible scout_report");

  for (const [index, turn] of turns.entries()) {
    if (!["user", "assistant"].includes(turn.role)) fail(`turn ${index} has invalid role`);
    if (turn.role === "assistant") {
      if (typeof turn.phase !== "string") fail(`assistant turn ${index} missing phase`);
      if (typeof turn.kind !== "string") fail(`assistant turn ${index} missing kind`);
      if (typeof turn.visible !== "boolean") fail(`assistant turn ${index} missing visible boolean`);
      if (turn.visible && evidenceRefs(turn).length === 0) fail(`visible assistant turn ${index} missing evidenceRefs`);
      if (turn.visible && questions(turn).length > 1) fail(`visible assistant turn ${index} asks batch questions`);
      if (turn.visible && isBeforeHandoff(turn) && hasRouteText(turn)) fail(`turn ${index} routes before P4`);
      if (turn.visible && firstReportIndex >= 0 && index < firstReportIndex && questions(turn).length > 0) {
        fail(`turn ${index} asks before scout report`);
      }
      for (const question of questions(turn)) {
        if (!String(question.text ?? "").includes("?")) fail(`turn ${index} has question without question mark`);
        if (evidenceRefs(question).length === 0) fail(`turn ${index} has evidence-free question`);
      }
      if (Array.isArray(turn.blindspots)) {
        for (const [spotIndex, spot] of turn.blindspots.entries()) {
          const supported = evidenceRefs(spot).length > 0 || spot.guess === true || spot.scoutingTarget === true;
          if (!supported) fail(`blindspot ${spotIndex} is neither evidenced, guessed, nor a scouting target`);
        }
      }
    }
  }

  const visibleArtifacts = new Set(visibles.flatMap((turn) => Array.isArray(turn.artifacts) ? turn.artifacts : []));
  if (visibleArtifacts.has("internal_digest") && visibleArtifacts.has("unknown_map")) {
    fail("visible output dumps both internal_digest and unknown_map");
  }

  if (fixture.failureClass === "meta_feedback_resume") {
    const metaIndex = turns.findIndex((turn) => turn.role === "user" && turn.kind === "meta_feedback");
    const nextAssistant = turns.slice(metaIndex + 1).find((turn) => turn.role === "assistant" && turn.visible);
    if (metaIndex < 0 || !nextAssistant) fail("meta feedback fixture must resume after user feedback");
    if (nextAssistant && nextAssistant.kind !== "meta_feedback_resume") fail("meta feedback response must use meta_feedback_resume kind");
    if (nextAssistant && sentenceCount(nextAssistant.text ?? "") > 2) fail("meta feedback response is longer than two sentences");
    if (nextAssistant && nextAssistant.resumesPhase !== nextAssistant.phase) fail("meta feedback response must resume the same phase");
    if (nextAssistant && !/probe|scout|handoff|report/i.test(nextAssistant.text ?? "")) fail("meta feedback response must name the phase");
  }

  return errors;
}

function validateSuite(fixtures) {
  const errors = fixtures.flatMap(validateFixture);
  const classes = new Set(fixtures.map((fixture) => fixture.failureClass));
  for (const failureClass of requiredFailureClasses) {
    if (!classes.has(failureClass)) errors.push(`suite: missing fixture for ${failureClass}`);
  }
  const clientLabels = new Set(fixtures.flatMap((fixture) => fixture.clientLabels ?? []));
  for (const labelName of requiredClientLabels) {
    if (!clientLabels.has(labelName)) errors.push(`suite: missing client label ${labelName}`);
  }
  return errors;
}

const fixtures = expectFail ? invalidFixture() : await loadFixtures();
const errors = validateSuite(fixtures);

if (expectFail) {
  if (errors.length === 0) {
    console.error("FAIL: intentional invalid fixture unexpectedly passed validation");
    process.exit(1);
  }
  console.log("PASS: --expect-fail rejected intentional invalid fixture");
  for (const error of errors.slice(0, 6)) console.log(`- ${error}`);
  process.exit(0);
}

if (errors.length > 0) {
  console.error("FAIL: transcript fixture validation failed");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`PASS: ${fixtures.length} unknown-finding-v2 transcript fixtures validated`);
console.log(`failureClasses: ${requiredFailureClasses.join(", ")}`);
console.log(`clientLabels: ${requiredClientLabels.join(", ")}`);

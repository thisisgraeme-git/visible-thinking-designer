import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { projectFromFixture, scenarioFixtures } from "../lib/fixtures.ts";
import {
  getGenerationMessage,
  PLAN_GENERATION_MESSAGES,
} from "../lib/generation-copy.ts";
import { SYSTEM_PROMPT } from "../lib/prompts/system.ts";
import { CLARIFY_PROMPT } from "../lib/prompts/clarify.ts";
import { DIAGNOSE_PROMPT } from "../lib/prompts/diagnose.ts";
import { MOMENTS_PROMPT } from "../lib/prompts/moments.ts";
import {
  enforceClarificationBoundaries,
  needsTargetTaskClarification,
} from "../lib/server/boundaries.ts";
import {
  getTaskDescriptionLimitMessage,
  TASK_DESCRIPTION_MAX,
} from "../lib/task-input.ts";
import { getTaskSummary } from "../lib/task-summary.ts";

const scenario = (source) =>
  structuredClone(
    scenarioFixtures.find((item) => item.source === source).project,
  );

const inflatedLanguage =
  /\b(epistemic|operationali[sz]ation|pedagogical architecture|multidimensionality|performative enactment|complexification)\b/i;

test("all model contracts default to plain, direct tutor language", () => {
  const combined = [
    SYSTEM_PROMPT,
    CLARIFY_PROMPT,
    DIAGNOSE_PROMPT,
    MOMENTS_PROMPT,
  ].join("\n");
  assert.match(combined, /plain, direct/i);
  assert.match(combined, /busy tertiary or vocational tutor/i);
  assert.match(combined, /direct verbs/i);
  assert.match(combined, /stacked nouns/i);
  assert.match(combined, /essential educational and disciplinary terminology/i);
  assert.match(combined, /degree-level/i);
  assert.match(combined, /one short sentence/i);
});

test("vocational fixture output is direct and action-led", () => {
  const project = scenario("flat-white");
  const output = JSON.stringify({
    summary: project.clarification.taskSummary,
    moments: project.moments.map(
      ({ learnerAction, tutorMove, visibleEvidence, feedbackUptake }) => ({
        learnerAction,
        tutorMove,
        visibleEvidence,
        feedbackUptake,
      }),
    ),
  });
  assert.doesNotMatch(output, inflatedLanguage);
  assert.match(output, /\b(prepare|state|check|compare|adjust|adapt)\b/i);
  assert.match(output, /\b(workflow|sensory|service|safety)\b/i);
});

test("degree fixture retains sophisticated thinking without inflated phrasing", () => {
  const project = scenario("short-report");
  const output = JSON.stringify({
    summary: project.clarification.taskSummary,
    capability: project.diagnosis.capabilitySummary,
    moments: project.moments,
  });
  assert.doesNotMatch(output, inflatedLanguage);
  for (const concept of ["evidence", "source", "trade-offs", "recommend"]) {
    assert.match(output, new RegExp(concept, "i"));
  }
});

test("new task summaries are concise and the plan never uses raw source text", () => {
  for (const fixture of scenarioFixtures) {
    const words = fixture.project.clarification.taskSummary
      .trim()
      .split(/\s+/).length;
    assert.ok(words >= 40 && words <= 60, `${fixture.source}: ${words} words`);
  }

  const project = projectFromFixture("short-report");
  const raw = `SOURCE-MARKER ${"large pasted source material ".repeat(260)}`;
  project.task.description = raw;
  const summary = getTaskSummary(project);
  const planSource = readFileSync("components/plan-screen.tsx", "utf8");
  assert.doesNotMatch(summary, /SOURCE-MARKER/);
  assert.notEqual(summary, raw);
  assert.doesNotMatch(planSource, /project\.task\.description/);
  assert.match(planSource, /getTaskSummary\(project\)/);
});

test("old drafts receive a conservative summary without exposing raw input", () => {
  const project = projectFromFixture("flat-white");
  delete project.clarification.taskSummary;
  delete project.clarification.taskReflection;
  project.task.description = "PRIVATE-RAW-TASK ".repeat(200);
  const summary = getTaskSummary(project);
  assert.match(summary, /This plan redesigns/);
  assert.doesNotMatch(summary, /PRIVATE-RAW-TASK/);
});

test("template-like or multi-activity input prioritises target-task clarification", () => {
  const project = scenario("dissatisfied-client");
  project.task.description =
    "Assessment template. Activity 1: read the policy. Activity 2: complete a client response. Appendix: reference material.";
  assert.equal(needsTargetTaskClarification(project.task.description), true);
  const bounded = enforceClarificationBoundaries(project.task, {
    taskSummary: project.clarification.taskSummary,
    questions: [
      {
        id: "stakes",
        question: "What are the stakes?",
        whyItMatters: "The stakes affect the evidence pattern.",
      },
    ],
  });
  assert.equal(
    bounded.questions[0].question,
    "Which specific learner task do you want to redesign?",
  );
  assert.ok(bounded.questions.length <= 3);
});

test("over-limit source text remains intact and receives a clear message", () => {
  const input = "x".repeat(TASK_DESCRIPTION_MAX + 37);
  const message = getTaskDescriptionLimitMessage(input);
  const taskSource = readFileSync("components/task-screen.tsx", "utf8");
  assert.equal(input.length, TASK_DESCRIPTION_MAX + 37);
  assert.match(message, /37 characters over/i);
  assert.match(message, /none of your text has been removed/i);
  assert.doesNotMatch(taskSource, /maxLength=\{4000\}/);
  assert.match(taskSource, /descriptionLimitMessage/);
});

test("final plan keeps the operational subset and omits internal ontology", () => {
  const planSource = readFileSync("components/plan-screen.tsx", "utf8");
  for (const label of [
    "Learner action",
    "Tutor move",
    "Visible evidence",
    "Feedback uptake",
    "Tutor may prompt or cue",
    "Learner responsibility",
    "Approximate workload",
    "Why this evidence pattern works",
    "One changed condition",
    "Review before use",
  ]) {
    assert.match(planSource, new RegExp(label));
  }
  assert.match(planSource, /retention\.level !== "observe-and-use"/);
  assert.doesNotMatch(
    planSource,
    /Evidence purposes and modes|Weak or missing evidence|AI position for this moment|Feedback loop/,
  );
});

test("generation messages rotate only while loading and resolve cleanly", () => {
  assert.deepEqual(PLAN_GENERATION_MESSAGES, [
    "Reading the task and context…",
    "Designing a proportionate evidence pattern…",
    "Checking feedback, workload and learner responsibility…",
    "Preparing the working plan…",
  ]);
  for (const [index, message] of PLAN_GENERATION_MESSAGES.entries()) {
    assert.equal(
      getGenerationMessage(
        "loading",
        index,
        "Fallback",
        PLAN_GENERATION_MESSAGES,
      ),
      message,
    );
  }
  assert.equal(
    getGenerationMessage(
      "succeeded",
      0,
      "Fallback",
      PLAN_GENERATION_MESSAGES,
    ),
    null,
  );
  const statusSource = readFileSync("components/model-status.tsx", "utf8");
  assert.match(statusSource, /setInterval/);
  assert.match(statusSource, /aria-live="polite"/);
  assert.doesNotMatch(statusSource, /\d+\s*%|percent complete|progress percentage/i);
});

test("navigation uses design focus while learner-diagnosis safeguard remains", () => {
  const appShell = readFileSync("components/app-shell.tsx", "utf8");
  const diagnose = readFileSync("components/diagnose-screen.tsx", "utf8");
  const moments = readFileSync("components/moments-screen.tsx", "utf8");
  assert.match(appShell, /Clarify & design focus/);
  assert.match(diagnose, /Review design focus/);
  assert.match(moments, /Back to design focus/);
  assert.doesNotMatch(
    `${appShell}\n${diagnose}\n${moments}`,
    /Review diagnosis|Back to diagnosis|Clarify & diagnose/,
  );
});

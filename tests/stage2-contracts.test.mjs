import assert from "node:assert/strict";
import test from "node:test";
import { projectFromFixture, scenarioFixtures } from "../lib/fixtures.ts";
import { createGenerationState, updateGenerationStage } from "../lib/model-state.ts";
import { enforceMomentsBoundaries } from "../lib/server/boundaries.ts";
import {
  clarifyOutputSchema,
  clarifyRequestSchema,
  diagnosisOutputSchema,
  momentsOutputSchema,
} from "../lib/model-schemas.ts";
import { SYSTEM_PROMPT } from "../lib/prompts/system.ts";
import { CLARIFY_PROMPT } from "../lib/prompts/clarify.ts";
import { MOMENTS_PROMPT } from "../lib/prompts/moments.ts";

test("all three scenarios satisfy the Stage 2 request and output schemas", () => {
  for (const fixture of scenarioFixtures) {
    const project = fixture.project;

    assert.equal(
      clarifyRequestSchema.safeParse({
        source: fixture.source,
        task: project.task,
      }).success,
      true,
      `${fixture.source} clarify input`,
    );

    assert.equal(
      clarifyOutputSchema.safeParse({
        taskReflection: project.clarification.taskReflection,
        questions: project.clarification.questions.map(
          ({ id, question, whyItMatters }) => ({
            id,
            question,
            whyItMatters,
          }),
        ),
      }).success,
      true,
      `${fixture.source} clarify output`,
    );

    const diagnosis = { ...project.diagnosis };
    delete diagnosis.tutorConfirmed;
    assert.equal(
      diagnosisOutputSchema.safeParse(diagnosis).success,
      true,
      `${fixture.source} diagnosis output`,
    );

    assert.equal(
      momentsOutputSchema.safeParse({
        ...project.plan,
        evidenceShift: project.plan.evidenceShift,
        feedbackPattern: project.plan.feedbackPattern,
        useTomorrowSummary: project.plan.useTomorrowSummary,
        moments: project.moments.map((moment) => ({
          ...moment,
          caution: moment.caution ?? "",
        })),
      }).success,
      true,
      `${fixture.source} moments output`,
    );
  }
});

test("the output contract enforces bounded, selective moments", () => {
  for (const fixture of scenarioFixtures) {
    assert.ok(fixture.project.moments.length >= 3);
    assert.ok(fixture.project.moments.length <= 5);
    for (const moment of fixture.project.moments) {
      assert.ok(moment.conditions.length >= 1);
      assert.ok(moment.conditions.length <= 3);
      assert.ok(moment.feedbackLoop.length > 0);
      assert.ok(moment.workloadFit.length > 0);
      assert.ok(moment.weakOrMissingEvidence.length > 0);
    }
  }
});

test("the versioned prompts preserve research and safety invariants", () => {
  const combined = `${SYSTEM_PROMPT}\n${CLARIFY_PROMPT}\n${MOMENTS_PROMPT}`;
  for (const invariant of [
    "professional judgement",
    "recursive",
    "discipline-grounded",
    "personal data",
    "AI detection",
    "chain-of-thought",
    "untrusted data",
    "three to five",
    "workload fit",
  ]) {
    assert.match(combined, new RegExp(invariant, "i"));
  }
  assert.match(CLARIFY_PROMPT, /zero to three/i);
  assert.match(SYSTEM_PROMPT, /never as five compulsory or sequential steps/i);
});

test("the three fixture outputs remain meaningfully different", () => {
  const signatures = scenarioFixtures.map((fixture) =>
    fixture.project.moments.map((moment) => moment.title).join("|"),
  );
  assert.equal(new Set(signatures).size, 3);
});

test("a model failure preserves the tutor task and existing design state", () => {
  const project = {
    ...projectFromFixture("flat-white"),
    generation: createGenerationState(),
  };
  const failed = updateGenerationStage(project, "clarify", "failed", {
    code: "service_unavailable",
    message: "Unavailable",
    retryable: true,
  });

  assert.deepEqual(failed.task, project.task);
  assert.deepEqual(failed.diagnosis, project.diagnosis);
  assert.deepEqual(failed.moments, project.moments);
  assert.equal(failed.generation.clarify.status, "failed");
  assert.equal(failed.generation.clarify.error.retryable, true);
});

test("AI-not-considered is enforced as not-relevant, never inferred as absent", () => {
  const fixture = scenarioFixtures.find(
    ({ source }) => source === "flat-white",
  );
  const output = {
    ...fixture.project.plan,
    evidenceShift: fixture.project.plan.evidenceShift,
    feedbackPattern: fixture.project.plan.feedbackPattern,
    useTomorrowSummary: fixture.project.plan.useTomorrowSummary,
    moments: fixture.project.moments.map((moment) => ({
      ...moment,
      aiPosition: "absent",
    })),
  };
  const bounded = enforceMomentsBoundaries(fixture.project.task, output);
  assert.ok(
    bounded.moments.every(({ aiPosition }) => aiPosition === "not-relevant"),
  );
});

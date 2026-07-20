import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { blankProject, scenarioFixtures } from "../lib/fixtures.ts";
import {
  clarifyRequestSchema,
  diagnosisOutputSchema,
  momentsOutputSchema,
} from "../lib/model-schemas.ts";
import {
  enforceDiagnosisBoundaries,
  enforceMomentsBoundaries,
} from "../lib/server/boundaries.ts";

test("blank and demonstration tasks carry optional, non-measured Stage 2.5A inputs", () => {
  const blank = blankProject();
  assert.deepEqual(blank.task.capabilityDimensions, []);
  assert.deepEqual(blank.task.underpinningDemands, []);
  assert.equal(blank.task.estimatedReadiness, "not-sure");
  assert.equal(blank.task.safetyCritical, false);
  assert.equal(blank.task.regulatedOrComplianceSensitive, false);

  const configurations = scenarioFixtures.map(({ project }) => ({
    stakes: project.task.assessmentStakes,
    readiness: project.task.estimatedReadiness,
    dimensions: project.task.capabilityDimensions.join("|"),
    demands: project.task.underpinningDemands.join("|"),
  }));
  assert.equal(new Set(configurations.map(({ stakes }) => stakes)).size, 3);
  assert.equal(new Set(configurations.map(({ readiness }) => readiness)).size, 3);
  assert.ok(configurations.some(({ dimensions }) => dimensions.includes("be-relate")));
  assert.ok(configurations.some(({ demands }) => demands.includes("numeracy")));
  assert.ok(
    configurations.some(({ demands }) => demands.includes("cultural-relational")),
  );
});

test("Stage 2.5A schema accepts a completed blank-task journey", () => {
  const project = blankProject();
  project.task = {
    ...project.task,
    title: "Complete a pre-start machinery safety check",
    description:
      "Inspect a workshop machine, identify unsafe conditions and decide whether it can be started or must be isolated and escalated.",
    intendedCapability:
      "Recognise hazards, apply the pre-start standard and act responsibly before operating machinery.",
    helpIdentifyCapabilityDimensions: true,
    helpIdentifyUnderpinningDemands: true,
    assessmentStakes: "high-stakes-final",
    safetyCritical: true,
    regulatedOrComplianceSensitive: true,
    estimatedReadiness: "not-sure",
  };
  assert.equal(
    clarifyRequestSchema.safeParse({ source: "blank", task: project.task })
      .success,
    true,
  );
});

test("diagnosis makes selected lenses visible without scoring them", () => {
  for (const fixture of scenarioFixtures) {
    const diagnosis = structuredClone(fixture.project.diagnosis);
    delete diagnosis.tutorConfirmed;
    assert.equal(diagnosisOutputSchema.safeParse(diagnosis).success, true);
    assert.ok(diagnosis.capabilityLensNotes.length > 0);
    assert.ok(diagnosis.taskDemandNotes.length > 0);
    assert.doesNotMatch(
      JSON.stringify(diagnosis),
      /\b(score|rating|percentage|level [1-9]|assured capability)\b/i,
    );
  }
});

test("every visible-thinking moment includes an editable example in context", () => {
  for (const fixture of scenarioFixtures) {
    for (const moment of fixture.project.moments) {
      assert.ok(moment.exampleInContext.length >= 10);
    }
    const output = {
      ...fixture.project.plan,
      moments: fixture.project.moments.map((moment) => ({
        ...moment,
        caution: moment.caution ?? "",
      })),
    };
    assert.equal(momentsOutputSchema.safeParse(output).success, true);
  }
});

test("safety-critical boundaries require performance-grounded evidence", () => {
  const fixture = scenarioFixtures[0];
  const diagnosis = structuredClone(fixture.project.diagnosis);
  delete diagnosis.tutorConfirmed;
  diagnosis.cautions = ["Keep the design proportionate."];
  const boundedDiagnosis = enforceDiagnosisBoundaries(
    fixture.project.task,
    diagnosis,
  );
  assert.match(
    boundedDiagnosis.cautions.join(" "),
    /directly observed performance|task-result evidence/i,
  );

  const output = {
    ...fixture.project.plan,
    moments: fixture.project.moments.map((moment) => ({
      ...moment,
      visibleEvidence: "The learner provides a written explanation.",
    })),
  };
  const boundedMoments = enforceMomentsBoundaries(fixture.project.task, output);
  assert.match(
    boundedMoments.moments.map(({ visibleEvidence }) => visibleEvidence).join(" "),
    /directly observed task performance|task result/i,
  );
});

test("AI-off remains not-relevant and no assurance claim is introduced", () => {
  const fixture = scenarioFixtures[0];
  const bounded = enforceMomentsBoundaries(fixture.project.task, {
    ...fixture.project.plan,
    moments: fixture.project.moments.map((moment) => ({
      ...moment,
      aiPosition: "deliberately-examined",
    })),
  });
  assert.ok(bounded.moments.every(({ aiPosition }) => aiPosition === "not-relevant"));
  assert.doesNotMatch(
    JSON.stringify(bounded),
    /((automatically|definitively|conclusively) (proves?|verif(?:y|ies))|(this|the (plan|evidence|output)) (proves?|verif(?:y|ies)) capability|provides capability assurance|performs automated assessment)/i,
  );
});

test("interface exposes exact Stage 2.5A copy and accessible text floor", () => {
  const landing = readFileSync("components/landing-page.tsx", "utf8");
  const task = readFileSync("components/task-screen.tsx", "utf8");
  const diagnose = readFileSync("components/diagnose-screen.tsx", "utf8");
  const moments = readFileSync("components/moments-screen.tsx", "utf8");
  const css = readFileSync("app/globals.css", "utf8");

  assert.match(landing, /For tertiary and vocational educators/);
  assert.doesNotMatch(landing, /A calm learning-design workbench/);
  assert.match(task, /Setting or context/);
  assert.match(task, /By the end of this task, learners should know…/);
  assert.match(task, /Whose knowledge, language, values, responsibilities/);
  assert.match(diagnose, /Use this design focus/);
  assert.match(moments, /Show an example in context/);
  assert.match(moments, /Feedback is the connective loop/);
  assert.match(css, /Informative and interactive copy is approximately 15px/);
});

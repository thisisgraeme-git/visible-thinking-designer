import assert from "node:assert/strict";
import { blankProject, scenarioFixtures } from "../lib/fixtures.ts";
import {
  clarifyOutputSchema,
  diagnosisOutputSchema,
  momentsOutputSchema,
} from "../lib/model-schemas.ts";

const baseUrl = process.env.VTD_BASE_URL || "http://localhost:3000";
const results = [];

const blank = blankProject();
blank.task = {
  ...blank.task,
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

const liveCases = [
  { source: "blank", project: blank },
  ...scenarioFixtures.map((fixture) => ({
    source: fixture.source,
    project: fixture.project,
  })),
];

for (const fixture of liveCases) {
  const clarify = await post("/api/design/clarify", {
    source: fixture.source,
    task: fixture.project.task,
  });
  const clarifyData = clarifyOutputSchema.parse(clarify.data);
  assert.ok(clarifyData.questions.length <= 3);
  assert.equal(
    clarifyData.questions.some(({ question }) =>
      /learner (name|email|contact|address|phone|demographic)/i.test(question),
    ),
    false,
  );

  const diagnosis = await post("/api/design/diagnose", {
    task: fixture.project.task,
    clarification: {
      taskReflection: clarifyData.taskReflection,
      questions: clarifyData.questions.map((question) => ({
        ...question,
        skipped: true,
      })),
      completed: true,
    },
  });
  const diagnosisData = diagnosisOutputSchema.parse(diagnosis.data);
  if (!fixture.project.task.considerLearnerAi) {
    assert.equal(diagnosisData.aiSubstitutionRisks.length, 0);
  }
  assert.ok(Array.isArray(diagnosisData.capabilityLensNotes));
  assert.ok(Array.isArray(diagnosisData.taskDemandNotes));

  const moments = await post("/api/design/moments", {
    task: fixture.project.task,
    diagnosis: { ...diagnosisData, tutorConfirmed: true },
  });
  const momentsData = momentsOutputSchema.parse(moments.data);
  assert.ok(momentsData.moments.length >= 3);
  assert.ok(momentsData.moments.length <= 5);
  assert.ok(momentsData.evidencePatternRationale.length >= 20);
  assert.equal(Array.isArray(momentsData.changedCondition), false);
  assert.ok(
    momentsData.moments.some(
      (moment) =>
        moment.id === momentsData.changedCondition.momentId &&
        moment.conditions.includes("apply"),
    ),
  );
  assert.ok(
    momentsData.integrityWarnings.every(
      ({ source }) => source === "model",
    ),
  );
  for (const moment of momentsData.moments) {
    assert.ok(moment.conditions.length >= 1);
    assert.ok(moment.conditions.length <= 3);
    assert.ok(moment.feedbackLoop.length > 0);
    assert.ok(moment.feedbackUptake.length > 0);
    assert.ok(moment.workload.estimatedTime.length > 0);
    assert.ok(moment.workload.frequency.length > 0);
    assert.ok(moment.workload.recordingBurden.length > 0);
    assert.ok(moment.evidencePurposes.length >= 1);
    assert.ok(moment.evidencePurposes.length <= 3);
    assert.ok(moment.evidenceModes.length >= 1);
    assert.ok(moment.evidenceModes.length <= 3);
    assert.ok(moment.supportBoundary.tutorMay.length > 0);
    assert.ok(moment.supportBoundary.learnerResponsibility.length > 0);
    assert.ok(["observe-and-use", "brief-note", "formal-record"].includes(
      moment.retention.level,
    ));
    assert.ok(moment.weakOrMissingEvidence.length > 0);
    assert.ok(moment.exampleInContext.length > 0);
    if (!fixture.project.task.considerLearnerAi) {
      assert.equal(moment.aiPosition, "not-relevant");
    }
  }
  if (fixture.project.task.safetyCritical) {
    assert.match(
      [
        ...diagnosisData.cautions,
        ...momentsData.cautions,
        ...momentsData.moments.map((moment) => moment.visibleEvidence),
      ].join(" "),
      /directly observed|observed performance|task[- ]result|equipment|product|real[- ]time/i,
    );
  }

  const boundaryText = JSON.stringify({
    diagnosis: diagnosisData,
    moments: momentsData,
  });
  assert.doesNotMatch(
    boundaryText,
    /((automatically|definitively|conclusively) (proves?|verif(?:y|ies))|(this|the (plan|evidence|output)) (proves?|verif(?:y|ies)) capability|capability assurance|automated assessment|confidence percentage|evidence-strength rating|assurance status)/i,
  );
  const safetyText = [
    ...diagnosisData.cautions,
    ...momentsData.cautions,
  ].join(" ");
  assert.match(
    safetyText,
    /(do not|does not|not .*proof|professional judgement|tutor judgement|cannot stand alone|alone is insufficient|no single)/i,
  );

  results.push({
    source: fixture.source,
    model: moments.meta.model,
    promptVersion: moments.meta.promptVersion,
    clarificationQuestions: clarifyData.questions.length,
    moments: momentsData.moments.length,
    conditionPattern: momentsData.moments
      .map((moment) => moment.conditions.join("+"))
      .join("|"),
    evidencePattern: momentsData.moments
      .map(
        (moment) =>
          `${moment.evidencePurposes.join("+")}:${moment.evidenceModes.join("+")}`,
      )
      .join("|"),
    signature: momentsData.moments.map((moment) => moment.title).join("|"),
    designFingerprint: momentsData.moments
      .map(
        (moment) =>
          `${moment.title}|${moment.tutorMove}|${moment.visibleEvidence}|${moment.workload.estimatedTime}`,
      )
      .join("||"),
    diagnosisSignature: [
      ...diagnosisData.capabilityLensNotes,
      ...diagnosisData.taskDemandNotes,
      ...diagnosisData.readinessAndScaffolding,
      diagnosisData.designOpportunity,
    ].join("|"),
  });
}

assert.equal(new Set(results.map(({ signature }) => signature)).size, 4);
assert.ok(new Set(results.map(({ conditionPattern }) => conditionPattern)).size >= 3);
assert.equal(new Set(results.map(({ diagnosisSignature }) => diagnosisSignature)).size, 4);

const baseFixture = scenarioFixtures.find(
  ({ source }) => source === "flat-white",
);
const comparisonTask = {
  ...baseFixture.project.task,
  capabilityDimensions: ["do"],
  underpinningDemands: ["technical-domain"],
  assessmentStakes: "low-stakes-practice",
  safetyCritical: false,
  estimatedReadiness: "ready-independently",
};
const comparisonDiagnosis = await post("/api/design/diagnose", {
  task: comparisonTask,
  clarification: {
    ...baseFixture.project.clarification,
    questions: baseFixture.project.clarification.questions.map((question) => ({
      ...question,
      skipped: true,
    })),
    completed: true,
  },
});
const comparisonDiagnosisData = diagnosisOutputSchema.parse(
  comparisonDiagnosis.data,
);
const comparisonMoments = await post("/api/design/moments", {
  task: comparisonTask,
  diagnosis: { ...comparisonDiagnosisData, tutorConfirmed: true },
});
const comparisonMomentsData = momentsOutputSchema.parse(comparisonMoments.data);
const baseline = results.find(({ source }) => source === "flat-white");
const comparisonSignature = comparisonMomentsData.moments
  .map(
    (moment) =>
      `${moment.title}|${moment.tutorMove}|${moment.visibleEvidence}|${moment.workload.estimatedTime}`,
  )
  .join("||");
assert.notEqual(comparisonSignature, baseline.designFingerprint);

console.log(
  JSON.stringify(
    {
      gate: "Stage 2.5C review",
      passed: true,
      comparison: {
        sameTask: "flat-white",
        changedInputs: [
          "stakes",
          "estimated readiness",
          "capability dimensions",
          "underpinning demands",
          "safety-critical flag",
        ],
        meaningfullyDifferent: true,
      },
      scenarios: results.map((result) => ({
        source: result.source,
        model: result.model,
        promptVersion: result.promptVersion,
        clarificationQuestions: result.clarificationQuestions,
        moments: result.moments,
        conditionPattern: result.conditionPattern,
        evidencePattern: result.evidencePattern,
      })),
    },
    null,
    2,
  ),
);

async function post(path, body) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(
      `${path} failed (${response.status}): ${
        payload.error?.code || "unknown_error"
      }`,
    );
  }
  return payload;
}

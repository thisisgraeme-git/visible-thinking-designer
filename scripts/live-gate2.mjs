import assert from "node:assert/strict";
import { scenarioFixtures } from "../lib/fixtures.ts";
import {
  clarifyOutputSchema,
  diagnosisOutputSchema,
  momentsOutputSchema,
} from "../lib/model-schemas.ts";

const baseUrl = process.env.VTD_BASE_URL || "http://localhost:3000";
const results = [];

for (const fixture of scenarioFixtures) {
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

  const moments = await post("/api/design/moments", {
    task: fixture.project.task,
    diagnosis: { ...diagnosisData, tutorConfirmed: true },
  });
  const momentsData = momentsOutputSchema.parse(moments.data);
  assert.ok(momentsData.moments.length >= 3);
  assert.ok(momentsData.moments.length <= 5);
  for (const moment of momentsData.moments) {
    assert.ok(moment.conditions.length >= 1);
    assert.ok(moment.conditions.length <= 3);
    assert.ok(moment.feedbackLoop.length > 0);
    assert.ok(moment.workloadFit.length > 0);
    assert.ok(moment.weakOrMissingEvidence.length > 0);
    if (!fixture.project.task.considerLearnerAi) {
      assert.equal(moment.aiPosition, "not-relevant");
    }
  }

  const boundaryText = JSON.stringify({
    diagnosis: diagnosisData,
    moments: momentsData,
  });
  assert.doesNotMatch(
    boundaryText,
    /((automatically|definitively|conclusively) (proves?|verif(?:y|ies))|(this|the (plan|evidence|output)) (proves?|verif(?:y|ies)) capability)/i,
  );
  const safetyText = [
    ...diagnosisData.cautions,
    ...momentsData.cautions,
  ].join(" ");
  assert.match(
    safetyText,
    /(do not|does not|not .*proof|professional judgement|tutor judgement)/i,
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
    signature: momentsData.moments.map((moment) => moment.title).join("|"),
  });
}

assert.equal(new Set(results.map(({ signature }) => signature)).size, 3);
assert.equal(new Set(results.map(({ conditionPattern }) => conditionPattern)).size, 3);

console.log(
  JSON.stringify(
    {
      gate: "Gate 2",
      passed: true,
      scenarios: results.map((result) => ({
        source: result.source,
        model: result.model,
        promptVersion: result.promptVersion,
        clarificationQuestions: result.clarificationQuestions,
        moments: result.moments,
        conditionPattern: result.conditionPattern,
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

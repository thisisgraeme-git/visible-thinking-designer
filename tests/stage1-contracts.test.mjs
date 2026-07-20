import assert from "node:assert/strict";
import test from "node:test";
import { scenarioFixtures } from "../lib/fixtures.ts";

const allowedConditions = new Set([
  "attempt",
  "question",
  "check",
  "explain-judgement",
  "apply",
]);

test("contains the three canonical, typed scenario fixtures", () => {
  assert.deepEqual(
    scenarioFixtures.map((fixture) => fixture.source),
    ["flat-white", "dissatisfied-client", "short-report"],
  );
});

test("each scenario respects the Stage 1 visible-moment contract", () => {
  for (const fixture of scenarioFixtures) {
    const { moments, diagnosis, task } = fixture.project;
    assert.ok(diagnosis, `${fixture.source} needs a diagnosis`);
    assert.ok(moments.length >= 3 && moments.length <= 5);
    assert.ok(diagnosis.currentTaskStrengths.length > 0);
    assert.ok(diagnosis.invisibleThinking.length > 0);

    for (const moment of moments) {
      assert.ok(
        moment.conditions.length >= 1 && moment.conditions.length <= 3,
      );
      assert.ok(moment.conditions.every((item) => allowedConditions.has(item)));
      assert.ok(moment.feedbackLoop.trim().length > 0);
      assert.ok(moment.feedbackUptake.trim().length > 0);
      assert.ok(moment.workload.estimatedTime.trim().length > 0);
      assert.ok(moment.workload.frequency.trim().length > 0);
      assert.ok(moment.workload.recordingBurden.trim().length > 0);
      assert.ok(moment.visibleEvidence.trim().length > 0);
      assert.ok(moment.weakOrMissingEvidence.trim().length > 0);
      assert.ok(moment.exampleInContext.trim().length > 0);
      assert.doesNotMatch(
        [
          moment.purpose,
          moment.visibleEvidence,
          moment.feedbackLoop,
        ].join(" "),
        /\b(proves?|guarantees?|authenticates?)\b/i,
      );
    }

    if (!task.considerLearnerAi) {
      assert.ok(
        moments.every(
          (moment) =>
            moment.aiPosition === "not-relevant" ||
            moment.aiPosition === "absent",
        ),
      );
    }
  }
});

test("scenarios produce meaningfully different designs", () => {
  const titles = scenarioFixtures.map((fixture) =>
    fixture.project.moments.map((moment) => moment.title).join("|"),
  );
  assert.equal(new Set(titles).size, 3);
});

test("the Five Conditions are combined selectively within moments", () => {
  for (const fixture of scenarioFixtures) {
    assert.ok(
      fixture.project.moments.every(
        (moment) => moment.conditions.length < allowedConditions.size,
      ),
      `${fixture.source} must not present a moment as all five steps`,
    );
  }
});

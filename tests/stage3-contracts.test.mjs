import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { scenarioFixtures } from "../lib/fixtures.ts";
import {
  buildPlanJson,
  buildPlanMarkdown,
  planFilename,
} from "../lib/plan-export.ts";

const fixtureProject = () => {
  const fixture = structuredClone(scenarioFixtures[0].project);
  return {
    ...fixture,
    id: "stage3-export-test",
    status: "planned",
    createdAt: "2026-07-21T00:00:00.000Z",
    updatedAt: "2026-07-21T00:00:00.000Z",
    clarification: {
      ...fixture.clarification,
      taskSummary:
        "Learners prepare a flat white during service while explaining and adjusting the decisions that affect extraction, milk texture and workflow.",
      sourceDigest: {
        apparentLearnerTask: "Private source detail that must not be exported",
        importantInstructionsAndConstraints: [],
        criteriaOrRequiredEvidence: [],
        warnings: [],
        sourceFit: "aligned",
      },
    },
  };
};

test("Markdown and JSON exports reflect tutor edits exactly", () => {
  const project = fixtureProject();
  project.moments[0].title = "Tutor-edited extraction check";
  project.moments[0].learnerAction =
    "Explain the adjustment before changing the grinder.";
  project.plan.implementationNotes = ["Use the service briefing tomorrow."];

  const markdown = buildPlanMarkdown(project);
  const json = buildPlanJson(project);

  assert.match(markdown, /Tutor-edited extraction check/);
  assert.match(markdown, /Explain the adjustment before changing the grinder/);
  assert.match(markdown, /Use the service briefing tomorrow/);
  assert.match(json, /Tutor-edited extraction check/);
  assert.match(json, /Explain the adjustment before changing the grinder/);
});

test("plan exports omit internal attachment digest and raw source structures", () => {
  const project = fixtureProject();
  const json = buildPlanJson(project);
  const markdown = buildPlanMarkdown(project);

  assert.doesNotMatch(json, /Private source detail/);
  assert.doesNotMatch(json, /sourceDigest|sourceAttachment/);
  assert.doesNotMatch(markdown, /Private source detail/);
});

test("plan filenames are conservative and stable", () => {
  assert.equal(
    planFilename("Flat white: service / calibration", "md"),
    "flat-white-service-calibration.md",
  );
  assert.equal(
    planFilename("   ", "json"),
    "visible-thinking-plan.json",
  );
});

test("Stage 3 controls and the constrained Apply label remain present", () => {
  const plan = readFileSync(
    new URL("../components/plan-screen.tsx", import.meta.url),
    "utf8",
  );
  const moments = readFileSync(
    new URL("../components/moments-screen.tsx", import.meta.url),
    "utf8",
  );
  const landing = readFileSync(
    new URL("../components/landing-page.tsx", import.meta.url),
    "utf8",
  );
  const css = readFileSync(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );

  assert.match(plan, /Copy plan/);
  assert.match(plan, /Download Markdown/);
  assert.match(plan, /Download JSON/);
  assert.match(plan, /window\.print\(\)/);
  assert.match(plan, /Start another task/);
  assert.match(moments, /setProject\(saveProject/);
  assert.match(landing, /under changed\s*<br \/>\s*conditions/);
  assert.match(css, /\.condition-5 p\s*\{[^}]*width:\s*112px/s);
  assert.match(css, /@media print\s*\{/);
  assert.match(css, /@page\s*\{[^}]*size:\s*A4/s);
});

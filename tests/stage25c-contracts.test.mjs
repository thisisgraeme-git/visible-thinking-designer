import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { scenarioFixtures } from "../lib/fixtures.ts";
import { momentsOutputSchema } from "../lib/model-schemas.ts";
import {
  assessPlanIntegrity,
  combineIntegrityWarnings,
} from "../lib/plan-integrity.ts";
import { enforceMomentsBoundaries } from "../lib/server/boundaries.ts";
import { listProjects, STORAGE_KEY } from "../lib/storage.ts";

const fixture = (source) =>
  structuredClone(
    scenarioFixtures.find((item) => item.source === source).project,
  );

test("fixtures implement a selective evidence-pattern contract", () => {
  for (const scenario of scenarioFixtures) {
    const { moments, plan } = scenario.project;
    assert.ok(moments.length >= 3 && moments.length <= 5);
    assert.ok(plan.evidencePatternRationale.length >= 20);
    assert.ok(plan.changedCondition);
    assert.equal(Array.isArray(plan.changedCondition), false);
    assert.ok(
      moments.some(
        (moment) =>
          moment.id === plan.changedCondition.momentId &&
          moment.conditions.includes("apply"),
      ),
    );

    for (const moment of moments) {
      assert.ok(moment.evidencePurposes.length >= 1);
      assert.ok(moment.evidencePurposes.length <= 3);
      assert.ok(moment.evidenceModes.length >= 1);
      assert.ok(moment.evidenceModes.length <= 3);
      assert.ok(moment.supportBoundary.tutorMay.length > 0);
      assert.ok(moment.supportBoundary.learnerResponsibility.length > 0);
      assert.ok(moment.feedbackUptake.length > 0);
      assert.match(moment.workload.estimatedTime, /about|embedded/i);
      assert.ok(moment.workload.frequency.length > 0);
      assert.ok(moment.workload.recordingBurden.length > 0);
    }

    const output = {
      ...plan,
      moments: moments.map((moment) => ({
        ...moment,
        caution: moment.caution ?? "",
      })),
    };
    assert.equal(
      momentsOutputSchema.safeParse(output).success,
      true,
      scenario.source,
    );
  }
});

test("the three evidence patterns differ by purpose, mode, retention and workload", () => {
  const signatures = scenarioFixtures.map(({ project }) =>
    project.moments
      .map(
        (moment) =>
          `${moment.evidencePurposes.join("+")}|${moment.evidenceModes.join(
            "+",
          )}|${moment.retention.level}|${
            moment.workload.activityRelationship
          }`,
      )
      .join("||"),
  );
  assert.equal(new Set(signatures).size, 3);
});

test("structural checks recalculate chronology and duplicate points after edits", () => {
  const project = fixture("flat-white");
  const reordered = [...project.moments].reverse();
  const chronology = assessPlanIntegrity(
    project.task,
    reordered,
    project.plan.changedCondition,
  );
  assert.ok(chronology.some(({ code }) => code === "chronology"));

  const duplicated = structuredClone(project.moments);
  duplicated[1].title = duplicated[0].title;
  duplicated[1].learnerAction = duplicated[0].learnerAction;
  const duplicates = assessPlanIntegrity(
    project.task,
    duplicated,
    project.plan.changedCondition,
  );
  assert.ok(duplicates.some(({ code }) => code === "duplication"));
});

test("developmental AI-producible text is allowed but unsupported verification is reviewed", () => {
  const project = fixture("short-report");
  const developmental = project.moments.map((moment) => ({
    ...moment,
    evidencePurposes: ["learning"],
    evidenceModes: ["produced-artefact"],
    learnerAction: "Write a short developmental draft for feedback.",
  }));
  const developmentalPoints = assessPlanIntegrity(
    project.task,
    developmental,
    project.plan.changedCondition,
  );
  assert.equal(
    developmentalPoints.some(({ code }) =>
      ["verification-gap", "text-heavy-evidence"].includes(code),
    ),
    false,
  );

  const verification = developmental.map((moment) => ({
    ...moment,
    evidencePurposes: ["verification"],
  }));
  const verificationPoints = assessPlanIntegrity(
    project.task,
    verification,
    project.plan.changedCondition,
  );
  assert.ok(
    verificationPoints.some(({ code }) => code === "verification-gap"),
  );
  assert.ok(
    verificationPoints.some(({ code }) => code === "text-heavy-evidence"),
  );
});

test("feedback, retention, support and changed-condition gaps become review points", () => {
  const project = fixture("dissatisfied-client");
  const edited = structuredClone(project.moments);
  edited[0].feedbackUptake = "";
  edited[0].supportBoundary.learnerResponsibility = "";
  edited[0].retention.level = "formal-record";
  edited[0].workload.activityRelationship = "adds";
  edited[1].retention.level = "formal-record";
  edited[1].workload.activityRelationship = "adds";
  const points = assessPlanIntegrity(project.task, edited, {
    ...project.plan.changedCondition,
    momentId: "removed-moment",
  });
  const codes = new Set(points.map(({ code }) => code));
  assert.ok(codes.has("feedback-uptake"));
  assert.ok(codes.has("support-boundary"));
  assert.ok(codes.has("capture-burden"));
  assert.ok(codes.has("changed-condition"));
  assert.ok(points.every(({ source }) => source === "structural"));
});

test("model suggestions remain distinct from deterministic structural checks", () => {
  const project = fixture("flat-white");
  const combined = combineIntegrityWarnings(
    [
      {
        code: "capability-drift",
        message:
          "Check that the variation still reveals the intended capability.",
        momentIds: [project.moments[2].id],
        source: "model",
      },
    ],
    assessPlanIntegrity(project.task, project.moments, {
      ...project.plan.changedCondition,
      momentId: "missing",
    }),
  );
  assert.ok(combined.some(({ source }) => source === "model"));
  assert.ok(combined.some(({ source }) => source === "structural"));
});

test("AI-off and safety-critical safeguards remain deterministic", () => {
  const project = fixture("flat-white");
  const output = {
    ...project.plan,
    moments: project.moments.map((moment) => ({
      ...moment,
      aiPosition: "deliberately-examined",
      evidenceModes: ["produced-artefact"],
      visibleEvidence: "A written explanation is submitted.",
    })),
  };
  const bounded = enforceMomentsBoundaries(project.task, output);
  assert.ok(
    bounded.moments.every(
      ({ aiPosition }) => aiPosition === "not-relevant",
    ),
  );
  assert.ok(
    bounded.moments.some(({ evidenceModes }) =>
      evidenceModes.some((mode) =>
        ["tutor-observation", "practical-performance"].includes(mode),
      ),
    ),
  );
  assert.doesNotMatch(
    JSON.stringify(bounded),
    /capability assurance|automated assessment|confidence percentage|evidence-strength rating/i,
  );
});

test("Stage 2.5A browser-local drafts are normalised without a schema migration", () => {
  const project = fixture("short-report");
  const legacy = {
    ...project,
    id: "legacy-stage25a",
    status: "designing",
    createdAt: "2026-07-20T00:00:00.000Z",
    updatedAt: "2026-07-20T00:00:00.000Z",
    moments: project.moments.map((moment) => {
      const copy = { ...moment, workloadFit: "Low — integrated into the task." };
      delete copy.journeyPhase;
      delete copy.evidencePurposes;
      delete copy.evidenceModes;
      delete copy.supportBoundary;
      delete copy.feedbackUptake;
      delete copy.retention;
      delete copy.workload;
      return copy;
    }),
    plan: {
      evidenceShift: project.plan.evidenceShift,
      feedbackPattern: project.plan.feedbackPattern,
      implementationNotes: project.plan.implementationNotes,
      cautions: project.plan.cautions,
      useTomorrowSummary: project.plan.useTomorrowSummary,
    },
  };
  const previousWindow = globalThis.window;
  globalThis.window = {
    localStorage: {
      getItem: (key) => (key === STORAGE_KEY ? JSON.stringify([legacy]) : null),
    },
  };
  try {
    const restored = listProjects()[0];
    assert.equal(restored.schemaVersion, "0.1");
    assert.equal(restored.moments.length, 3);
    assert.ok(restored.moments.every((moment) => moment.journeyPhase));
    assert.ok(restored.moments.every((moment) => moment.evidenceModes.length));
    assert.ok(restored.moments.every((moment) => moment.workload));
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});

test("the restrained interface keeps evidence detail collapsed and review language bounded", () => {
  const moments = readFileSync("components/moments-screen.tsx", "utf8");
  const plan = readFileSync("components/plan-screen.tsx", "utf8");
  const route = readFileSync("app/api/design/moments/route.ts", "utf8");
  const prompt = readFileSync("lib/prompts/moments.ts", "utf8");

  assert.match(moments, /<summary>Evidence details<\/summary>/);
  assert.match(moments, /Points to review/);
  assert.match(plan, /Review before use/);
  assert.match(plan, /not failures, verified\s+findings/);
  assert.match(prompt, /exactly three to\s+five/);
  assert.match(prompt, /exactly one changedCondition/);
  assert.match(prompt, /source "model"/);
  assert.equal((route.match(/runStructuredModel\(/g) ?? []).length, 1);
  assert.doesNotMatch(
    `${moments}\n${plan}`,
    /evidence strength score|confidence percentage|assurance status/i,
  );
});

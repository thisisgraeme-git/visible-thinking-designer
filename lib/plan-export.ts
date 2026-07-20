import {
  activityRelationshipLabels,
  aiPositionLabels,
  retentionLabels,
} from "./evidence-options";
import { getTaskSummary } from "./task-summary";
import type {
  IntegrityWarning,
  VisibleThinkingProject,
} from "./types";

export const PLAN_EXPORT_VERSION = "vtd-plan-0.1";

export function buildPlanMarkdown(
  project: VisibleThinkingProject,
  reviewPoints: IntegrityWarning[] = project.plan.integrityWarnings ?? [],
): string {
  const lines = [
    `# ${project.task.title}`,
    "",
    "## Task summary",
    "",
    getTaskSummary(project),
    "",
    "## Intended capability",
    "",
    project.diagnosis?.capabilitySummary || project.task.intendedCapability,
  ];

  if (project.plan.evidencePatternRationale) {
    lines.push(
      "",
      "## Why this evidence pattern works",
      "",
      project.plan.evidencePatternRationale,
    );
  }

  lines.push("", "## Selected moments");
  project.moments.forEach((moment, index) => {
    lines.push(
      "",
      `### ${index + 1}. ${moment.title}`,
      "",
      `**Timing:** ${moment.timing}`,
      "",
      `**Learner action:** ${moment.learnerAction}`,
      "",
      `**Tutor move:** ${moment.tutorMove}`,
      "",
      `**Visible evidence:** ${moment.visibleEvidence}`,
      "",
      `**Feedback uptake:** ${moment.feedbackUptake}`,
      "",
      `**Tutor may prompt or cue:** ${moment.supportBoundary.tutorMay}`,
      "",
      `**Learner responsibility:** ${moment.supportBoundary.learnerResponsibility}`,
      "",
      `**Approximate workload:** ${formatWorkload(project, index)}`,
    );
    if (moment.retention.level !== "observe-and-use") {
      lines.push(
        "",
        `**Retention:** ${retentionLabels[moment.retention.level]} — ${moment.retention.note}`,
      );
    }
  });

  if (project.plan.changedCondition) {
    lines.push(
      "",
      "## One changed condition",
      "",
      `**What changes:** ${project.plan.changedCondition.changes}`,
      "",
      `**What remains constant:** ${project.plan.changedCondition.remainsConstant}`,
      "",
      `**Why this helps reveal capability:** ${project.plan.changedCondition.rationale}`,
    );
  }

  if (reviewPoints.length > 0) {
    lines.push("", "## Points to review", "");
    reviewPoints.forEach((point) => lines.push(`- ${point.message}`));
  }

  if (project.plan.useTomorrowSummary) {
    lines.push(
      "",
      "## Use this tomorrow",
      "",
      project.plan.useTomorrowSummary,
    );
  }

  if (project.plan.implementationNotes.length > 0) {
    lines.push("", "## Implementation notes", "");
    project.plan.implementationNotes.forEach((note) => lines.push(`- ${note}`));
  }

  if (project.plan.cautions.length > 0) {
    lines.push("", "## Cautions and boundaries", "");
    project.plan.cautions.forEach((caution) => lines.push(`- ${caution}`));
  }

  lines.push(
    "",
    "The Five Conditions are research-informed design language, not a checklist or validated assessment model. Educator professional judgement remains primary.",
    "",
  );
  return lines.join("\n");
}

export function buildPlanJson(
  project: VisibleThinkingProject,
  reviewPoints: IntegrityWarning[] = project.plan.integrityWarnings ?? [],
): string {
  return JSON.stringify(
    {
      exportVersion: PLAN_EXPORT_VERSION,
      task: {
        name: project.task.title,
        summary: getTaskSummary(project),
        intendedCapability:
          project.diagnosis?.capabilitySummary ||
          project.task.intendedCapability,
        setting: project.task.learningSetting,
        stakes: project.task.assessmentStakes,
        readiness: project.task.estimatedReadiness,
        aiPosition: project.task.considerLearnerAi
          ? aiPositionLabels[project.task.defaultAiPosition]
          : "Not considered",
      },
      evidencePatternRationale: project.plan.evidencePatternRationale,
      moments: project.moments,
      changedCondition: project.plan.changedCondition,
      pointsToReview: reviewPoints,
      useTomorrowSummary: project.plan.useTomorrowSummary,
      implementationNotes: project.plan.implementationNotes,
      cautions: project.plan.cautions,
    },
    null,
    2,
  );
}

export function planFilename(title: string, extension: "md" | "json"): string {
  const base = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
  return `${base || "visible-thinking-plan"}.${extension}`;
}

function formatWorkload(
  project: VisibleThinkingProject,
  index: number,
): string {
  const workload = project.moments[index].workload;
  return [
    workload.estimatedTime,
    workload.frequency,
    activityRelationshipLabels[workload.activityRelationship],
  ]
    .map((value) => value.trim().replace(/[.;]+$/, ""))
    .join("; ")
    .concat(".");
}

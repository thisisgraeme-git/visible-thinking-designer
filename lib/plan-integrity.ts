import { journeyPhaseOrder } from "./evidence-options";
import type {
  IntegrityWarning,
  VisibleThinkingProject,
} from "./types";

type ChangedCondition = VisibleThinkingProject["plan"]["changedCondition"];

const groundedModes = new Set([
  "tutor-observation",
  "practical-performance",
  "live-explanation",
  "professional-conversation",
  "changed-context-application",
]);

const normalise = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const warning = (
  code: IntegrityWarning["code"],
  message: string,
  momentIds: string[] = [],
): IntegrityWarning => ({
  code,
  message,
  momentIds,
  source: "structural",
});

export function assessPlanIntegrity(
  task: VisibleThinkingProject["task"],
  moments: VisibleThinkingProject["moments"],
  changedCondition?: ChangedCondition,
): IntegrityWarning[] {
  const points: IntegrityWarning[] = [];

  for (let index = 1; index < moments.length; index += 1) {
    if (
      journeyPhaseOrder[moments[index].journeyPhase] <
      journeyPhaseOrder[moments[index - 1].journeyPhase]
    ) {
      points.push(
        warning(
          "chronology",
          "The displayed order moves backwards through the task journey. Check whether these moments should be reordered.",
          [moments[index - 1].id, moments[index].id],
        ),
      );
      break;
    }
  }

  const duplicateGroups = new Map<string, string[]>();
  for (const moment of moments) {
    const signature = `${normalise(moment.title)}|${normalise(
      moment.learnerAction,
    )}`;
    duplicateGroups.set(signature, [
      ...(duplicateGroups.get(signature) ?? []),
      moment.id,
    ]);
  }
  const duplicateIds = [...duplicateGroups.values()].find(
    (ids) => ids.length > 1,
  );
  if (duplicateIds) {
    points.push(
      warning(
        "duplication",
        "Two moments repeat the same learner action. Consider combining them so each moment earns its place.",
        duplicateIds,
      ),
    );
  }

  const consequential = moments.filter((moment) =>
    moment.evidencePurposes.some((purpose) =>
      ["judgement", "verification"].includes(purpose),
    ),
  );
  const hasGroundedMode = moments.some((moment) =>
    moment.evidenceModes.some((mode) => groundedModes.has(mode)),
  );
  if (consequential.length > 0 && !hasGroundedMode) {
    points.push(
      warning(
        "verification-gap",
        "Judgement or verification currently relies on produced evidence alone. Consider pairing it with observation, adaptive explanation, performance or changed-context application.",
        consequential.map(({ id }) => id),
      ),
    );
  }

  const textOnly = moments.filter(
    (moment) =>
      moment.evidenceModes.length > 0 &&
      moment.evidenceModes.every((mode) => mode === "produced-artefact") &&
      /\b(write|written|text|report|draft|submission|record|document)\b/i.test(
        `${moment.learnerAction} ${moment.visibleEvidence}`,
      ),
  );
  if (
    consequential.length > 0 &&
    textOnly.length > moments.length / 2
  ) {
    points.push(
      warning(
        "text-heavy-evidence",
        "Most of this pattern depends on submitted text that could conceal the relevant understanding. Keep developmental text where useful and add a proportionate complementary mode if judgement matters.",
        textOnly.map(({ id }) => id),
      ),
    );
  }

  const missingUptake = moments.filter(
    (moment) =>
      !moment.feedbackUptake.trim() ||
      /describe what|add what|not yet specified/i.test(moment.feedbackUptake),
  );
  if (missingUptake.length > 0) {
    points.push(
      warning(
        "feedback-uptake",
        "One or more feedback loops do not yet say what the learner changes, confirms or applies next.",
        missingUptake.map(({ id }) => id),
      ),
    );
  }

  const formalAdded = moments.filter(
    (moment) =>
      moment.retention.level === "formal-record" &&
      moment.workload.activityRelationship === "adds",
  );
  if (formalAdded.length > 1) {
    points.push(
      warning(
        "capture-burden",
        "Several added moments also require formal retention. Check whether all of that capture is necessary.",
        formalAdded.map(({ id }) => id),
      ),
    );
  }

  const missingBoundary = moments.filter(
    (moment) =>
      !moment.supportBoundary.tutorMay.trim() ||
      !moment.supportBoundary.learnerResponsibility.trim(),
  );
  if (missingBoundary.length > 0) {
    points.push(
      warning(
        "support-boundary",
        "Clarify what the tutor may cue and what must remain the learner’s responsibility.",
        missingBoundary.map(({ id }) => id),
      ),
    );
  }

  if (changedCondition) {
    const target = moments.find(
      (moment) => moment.id === changedCondition.momentId,
    );
    if (!target || !target.conditions.includes("apply")) {
      points.push(
        warning(
          "changed-condition",
          "Link the changed condition to a retained Apply moment so the variation remains part of the task journey.",
          target ? [target.id] : [],
        ),
      );
    }
    if (
      !changedCondition.changes.trim() ||
      !changedCondition.remainsConstant.trim() ||
      !changedCondition.rationale.trim()
    ) {
      points.push(
        warning(
          "changed-condition",
          "State what changes, what remains constant and why the variation helps reveal capability.",
          target ? [target.id] : [],
        ),
      );
    }
  } else {
    points.push(
      warning(
        "changed-condition",
        "Add one meaningful changed condition while keeping the intended capability and other task demands stable.",
      ),
    );
  }

  if (
    task.safetyCritical &&
    !moments.some((moment) =>
      moment.evidenceModes.some((mode) =>
        ["tutor-observation", "practical-performance"].includes(mode),
      ),
    )
  ) {
    points.push(
      warning(
        "verification-gap",
        "This safety-critical task needs directly observed performance or task-result evidence; explanation or produced evidence cannot stand alone.",
      ),
    );
  }

  return points;
}

export function combineIntegrityWarnings(
  stored: IntegrityWarning[] = [],
  structural: IntegrityWarning[],
): IntegrityWarning[] {
  const model = stored.filter((item) => item.source === "model");
  const seen = new Set<string>();
  return [...model, ...structural].filter((item) => {
    const key = `${item.source}|${item.code}|${item.message}|${item.momentIds.join(
      ",",
    )}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

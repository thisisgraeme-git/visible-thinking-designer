import type {
  DiagnosisOutput,
  MomentsOutput,
  VisibleThinkingProject,
} from "../types";

export function enforceDiagnosisBoundaries<T extends DiagnosisOutput>(
  task: VisibleThinkingProject["task"],
  output: T,
): T {
  const readinessBoundary =
    "Readiness is a tutor estimate for instructional design, not a learner diagnosis.";
  const readinessNotes = output.readinessAndScaffolding.some((note) =>
    /tutor estimate|not a learner diagnosis/i.test(note),
  )
    ? output.readinessAndScaffolding
    : [readinessBoundary, ...output.readinessAndScaffolding].slice(0, 5);
  const bounded = {
    ...output,
    aiSubstitutionRisks: task.considerLearnerAi
      ? output.aiSubstitutionRisks
      : [],
    readinessAndScaffolding: readinessNotes,
  };

  if (!task.safetyCritical) return bounded as T;

  const safetyCaution =
    "For this safety-critical task, use directly observed performance or task-result evidence; self-report, written explanation or AI-produced evidence cannot stand alone.";
  return {
    ...bounded,
    cautions: [safetyCaution, ...bounded.cautions].slice(0, 5),
  } as T;
}

export function enforceMomentsBoundaries<T extends MomentsOutput>(
  task: VisibleThinkingProject["task"],
  output: T,
): T {
  let bounded = {
    ...output,
    moments: task.considerLearnerAi
      ? output.moments
      : output.moments.map((moment) => ({
          ...moment,
          aiPosition: "not-relevant" as const,
        })),
  } as T;

  const linkedMoment = bounded.moments.find(
    (moment) =>
      moment.id === bounded.changedCondition.momentId &&
      moment.conditions.includes("apply"),
  );
  if (!linkedMoment && bounded.moments.length > 0) {
    const existingApply = bounded.moments.find((moment) =>
      moment.conditions.includes("apply"),
    );
    const target = existingApply ?? bounded.moments.at(-1)!;
    bounded = {
      ...bounded,
      changedCondition: {
        ...bounded.changedCondition,
        momentId: target.id,
      },
      moments: existingApply
        ? bounded.moments
        : bounded.moments.map((moment) =>
            moment.id === target.id
              ? {
                  ...moment,
                  conditions: [
                    ...moment.conditions.filter(
                      (condition) => condition !== "apply",
                    ),
                    "apply" as const,
                  ].slice(-3) as typeof moment.conditions,
                }
              : moment,
          ),
    };
  }

  if (!task.safetyCritical) return bounded;

  const directEvidencePattern =
    /direct(?:ly)? observ|observed (?:task )?performance|physical (?:action|performance|demonstration)|task[- ]result|workplace outcome|equipment (?:response|signal)|real[- ]?time (?:action|performance)|live demonstration/i;
  const hasPerformanceMode = bounded.moments.some((moment) =>
    moment.evidenceModes.some((mode) =>
      ["tutor-observation", "practical-performance"].includes(mode),
    ),
  );
  const hasPerformanceDescription = bounded.moments.some((moment) =>
    directEvidencePattern.test(moment.visibleEvidence),
  );
  if (
    (!hasPerformanceMode || !hasPerformanceDescription) &&
    bounded.moments.length > 0
  ) {
    const target =
      bounded.moments.find((moment) => moment.conditions.includes("apply")) ??
      bounded.moments.at(-1)!;
    bounded = {
      ...bounded,
      moments: bounded.moments.map((moment) =>
        moment.id === target.id
          ? {
              ...moment,
              visibleEvidence: hasPerformanceDescription
                ? moment.visibleEvidence
                : `${moment.visibleEvidence} Include directly observed task performance or a task result.`,
              evidenceModes: hasPerformanceMode
                ? moment.evidenceModes
                : [
                    ...moment.evidenceModes.filter(
                      (mode) => mode !== "tutor-observation",
                    ),
                    "tutor-observation" as const,
                  ].slice(-3),
            }
          : moment,
      ),
    };
  }

  const safetyCaution =
    "Safety-critical capability must include directly observed performance or task-result evidence; self-report, written explanation or AI-produced evidence cannot stand alone.";
  return {
    ...bounded,
    cautions: bounded.cautions.includes(safetyCaution)
      ? bounded.cautions
      : [safetyCaution, ...bounded.cautions].slice(0, 5),
  };
}

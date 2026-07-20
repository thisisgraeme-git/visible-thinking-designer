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

  if (!task.safetyCritical) return bounded;

  const hasPerformanceGroundedEvidence = bounded.moments.some((moment) =>
    /direct(?:ly)? observ|observed (?:task )?performance|physical (?:action|performance|demonstration)|task[- ]result|workplace outcome|equipment (?:response|signal)|real[- ]?time (?:action|performance)|live demonstration/i.test(
      moment.visibleEvidence,
    ),
  );
  if (!hasPerformanceGroundedEvidence && bounded.moments.length > 0) {
    bounded = {
      ...bounded,
      moments: bounded.moments.map((moment, index) =>
        index === 0
          ? {
              ...moment,
              visibleEvidence: `${moment.visibleEvidence} Include directly observed task performance or a task result.`,
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

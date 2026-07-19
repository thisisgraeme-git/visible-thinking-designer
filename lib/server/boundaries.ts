import type { MomentsOutput, VisibleThinkingProject } from "../types";

export function enforceMomentsBoundaries<T extends MomentsOutput>(
  task: VisibleThinkingProject["task"],
  output: T,
): T {
  if (task.considerLearnerAi) return output;
  return {
    ...output,
    moments: output.moments.map((moment) => ({
      ...moment,
      aiPosition: "not-relevant",
    })),
  } as T;
}

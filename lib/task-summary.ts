import type { LearningSetting, VisibleThinkingProject } from "./types";

const settingLabels: Record<LearningSetting, string> = {
  "vocational-trades": "vocational or trades",
  "foundation-bridging": "foundation or bridging",
  "professional-applied": "professional or applied",
  "academic-degree": "degree",
  other: "tertiary",
};

export function getTaskSummary(project: VisibleThinkingProject): string {
  const rawTask = normalise(project.task.description);
  const candidates = [
    project.clarification.taskSummary,
    project.clarification.taskReflection,
  ];

  for (const value of candidates) {
    const candidate = normalise(value);
    if (
      candidate.length >= 20 &&
      candidate.length <= 500 &&
      (!rawTask ||
        (candidate !== rawTask && !candidate.includes(rawTask)))
    ) {
      return candidate;
    }
  }

  const title = normalise(project.task.title) || "this learner task";
  const setting = settingLabels[project.task.learningSetting] ?? "tertiary";
  return `This plan redesigns “${title}” for a ${setting} context. It selects a small number of moments where the learner’s decisions, response to feedback and application under one changed condition can inform tutor judgement without documenting every step.`;
}

function normalise(value?: string): string {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

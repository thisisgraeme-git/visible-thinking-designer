import type { VisibleThinkingProject } from "./types";

const SUBSTANTIVE_TASK_FIELDS = [
  "description",
  "intendedCapability",
  "capabilityDimensions",
  "helpIdentifyCapabilityDimensions",
  "underpinningDemands",
  "helpIdentifyUnderpinningDemands",
  "learningSetting",
  "learnerContextNotes",
  "culturalRelationalContext",
  "currentEvidence",
  "assessmentStakes",
  "safetyCritical",
  "regulatedOrComplianceSensitive",
  "estimatedReadiness",
  "considerLearnerAi",
  "defaultAiPosition",
] as const satisfies readonly (keyof VisibleThinkingProject["task"])[];

const FIELD_LABELS: Partial<
  Record<keyof VisibleThinkingProject["task"], string>
> = {
  description: "core task",
  intendedCapability: "intended capability",
  capabilityDimensions: "capability dimensions",
  helpIdentifyCapabilityDimensions: "capability guidance",
  underpinningDemands: "underpinning demands",
  helpIdentifyUnderpinningDemands: "task-demand guidance",
  learningSetting: "setting or context",
  learnerContextNotes: "learner and context notes",
  culturalRelationalContext: "cultural and relational context",
  currentEvidence: "current evidence",
  assessmentStakes: "stakes",
  safetyCritical: "safety-critical flag",
  regulatedOrComplianceSensitive: "regulation flag",
  estimatedReadiness: "estimated readiness",
  considerLearnerAi: "task-level AI position",
  defaultAiPosition: "task-level AI position",
};

export function getSubstantiveTaskChanges(
  before: VisibleThinkingProject["task"],
  after: VisibleThinkingProject["task"],
): string[] {
  return Array.from(
    new Set(
      SUBSTANTIVE_TASK_FIELDS.filter(
        (field) => JSON.stringify(before[field]) !== JSON.stringify(after[field]),
      ).map((field) => FIELD_LABELS[field] ?? field),
    ),
  );
}

export function isLegacyUntitledTitle(title: string): boolean {
  return title.trim().toLowerCase() === "untitled task";
}

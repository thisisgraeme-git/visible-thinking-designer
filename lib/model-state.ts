import type {
  GenerationError,
  ModelStage,
  ProjectGeneration,
  VisibleThinkingProject,
} from "./types";
import { PROMPT_VERSION } from "./prompts/version";

export function createGenerationState(): ProjectGeneration {
  return {
    promptVersion: PROMPT_VERSION,
    clarify: { status: "idle" },
    diagnose: { status: "idle" },
    moments: { status: "idle" },
  };
}

export function updateGenerationStage(
  project: VisibleThinkingProject,
  stage: ModelStage,
  status: ProjectGeneration[ModelStage]["status"],
  error?: GenerationError,
): VisibleThinkingProject {
  const generation = project.generation ?? createGenerationState();
  return {
    ...project,
    generation: {
      ...generation,
      [stage]: {
        status,
        ...(error ? { error } : {}),
      },
    },
  };
}

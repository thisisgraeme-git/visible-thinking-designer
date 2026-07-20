import type { GenerationStatus } from "./types";

export const PLAN_GENERATION_MESSAGES = [
  "Reading the task and context…",
  "Designing a proportionate evidence pattern…",
  "Checking feedback, workload and learner responsibility…",
  "Preparing the working plan…",
] as const;

export function getGenerationMessage(
  status: GenerationStatus,
  index: number,
  fallback: string,
  messages: readonly string[] = [],
): string | null {
  if (status !== "loading") return null;
  if (messages.length === 0) return fallback;
  return messages[index % messages.length] ?? fallback;
}

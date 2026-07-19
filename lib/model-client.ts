import type {
  ClarifyOutput,
  DiagnosisOutput,
  ModelFailure,
  ModelResult,
  MomentsOutput,
  VisibleThinkingProject,
} from "./types";

async function postModelStage<T>(
  endpoint: string,
  body: unknown,
): Promise<ModelResult<T>> {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = (await response.json()) as ModelResult<T>;
    if (!response.ok && payload.ok) {
      return unknownFailure();
    }
    return payload;
  } catch {
    return {
      ok: false,
      error: {
        code: "service_unavailable",
        message:
          "The design service could not be reached. Your task is still saved.",
        retryable: true,
      },
    };
  }
}

const unknownFailure = (): ModelFailure => ({
  ok: false,
  error: {
    code: "unknown_error",
    message: "The design service returned an unexpected response.",
    retryable: true,
  },
});

export function requestClarification(project: VisibleThinkingProject) {
  return postModelStage<ClarifyOutput>("/api/design/clarify", {
    source: project.source,
    task: project.task,
  });
}

export function requestDiagnosis(project: VisibleThinkingProject) {
  return postModelStage<DiagnosisOutput>("/api/design/diagnose", {
    task: project.task,
    clarification: project.clarification,
  });
}

export function requestMoments(project: VisibleThinkingProject) {
  return postModelStage<MomentsOutput>("/api/design/moments", {
    task: project.task,
    diagnosis: project.diagnosis,
  });
}

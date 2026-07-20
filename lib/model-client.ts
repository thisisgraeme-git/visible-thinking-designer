import type {
  ClarifyOutput,
  DiagnosisOutput,
  ModelFailure,
  ModelResult,
  MomentsOutput,
  VisibleThinkingProject,
} from "./types";
import { getSessionAttachment } from "./client-attachments";

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
  const body = {
    source: project.source,
    task: project.task,
    priorSourceDigest: project.clarification.sourceDigest,
  };
  const attachment = getSessionAttachment(project.id);
  if (!attachment) {
    return postModelStage<ClarifyOutput>("/api/design/clarify", body);
  }
  return postClarificationWithAttachment(body, attachment);
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
    sourceDigest: project.clarification.sourceDigest,
  });
}

async function postClarificationWithAttachment(
  body: unknown,
  attachment: File,
): Promise<ModelResult<ClarifyOutput>> {
  try {
    const form = new FormData();
    form.set("payload", JSON.stringify(body));
    form.set("attachment", attachment);
    const response = await fetch("/api/design/clarify", {
      method: "POST",
      body: form,
    });
    const payload = (await response.json()) as ModelResult<ClarifyOutput>;
    if (!response.ok && payload.ok) return unknownFailure();
    return payload;
  } catch {
    return {
      ok: false,
      error: {
        code: "service_unavailable",
        message:
          "The attached material could not be processed. Your task details and selected file are still available for another attempt.",
        retryable: true,
      },
    };
  }
}

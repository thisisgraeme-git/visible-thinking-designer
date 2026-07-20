import type {
  ClarifyOutput,
  DiagnosisOutput,
  ModelFailure,
  ModelResult,
  MomentsOutput,
  VisibleThinkingProject,
} from "./types";
import {
  getPreparedSessionAttachment,
  getSessionAttachment,
} from "./client-attachments";

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

export async function requestClarification(
  project: VisibleThinkingProject,
): Promise<ModelResult<ClarifyOutput>> {
  const body = {
    source: project.source,
    task: project.task,
    priorSourceDigest: project.clarification.sourceDigest,
  };
  const attachment = getSessionAttachment(project.id);
  if (!attachment) {
    return postModelStage<ClarifyOutput>("/api/design/clarify", body);
  }
  try {
    const prepared = await getPreparedSessionAttachment(project.id);
    if (!prepared) return unknownFailure();
    return postClarificationWithAttachment(body, prepared);
  } catch {
    return {
      ok: false,
      error: {
        code: "corrupt_file",
        message:
          "The photograph could not be read. Retry, replace the attachment or return to your saved task details.",
        retryable: true,
      },
    };
  }
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
    const payload = await readAttachmentResponse(response);
    if (!payload) return unknownFailure();
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

async function readAttachmentResponse(
  response: Response,
): Promise<ModelResult<ClarifyOutput> | undefined> {
  if (response.headers.get("content-type")?.includes("application/json")) {
    return (await response.json()) as ModelResult<ClarifyOutput>;
  }
  if (response.status === 413) {
    return {
      ok: false,
      error: {
        code: "file_too_large",
        message:
          "The hosted service rejected the prepared attachment as too large. Your task details and original file remain available for Retry or Replace.",
        retryable: true,
      },
    };
  }
  return undefined;
}

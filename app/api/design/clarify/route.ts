import { CLARIFY_PROMPT } from "@/lib/prompts/clarify";
import {
  clarifyOutputSchema,
  clarifyRequestSchema,
} from "@/lib/model-schemas";
import { enforceClarificationBoundaries } from "@/lib/server/boundaries";
import {
  invalidRequestResponse,
  modelResponse,
  requestFailureResponse,
} from "@/lib/server/http";
import { runStructuredModel } from "@/lib/server/openai";
import {
  fileMimeType,
  isImageFile,
  validateFileBytes,
} from "@/lib/file-intake";
import type { GenerationError } from "@/lib/types";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  let body: unknown = null;
  let attachment:
    | {
        filename: string;
        mimeType: string;
        bytes: Uint8Array;
        kind: "document" | "image";
      }
    | undefined;

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData().catch(() => null);
    if (!form) return invalidRequestResponse();
    const payload = form.get("payload");
    const files = form.getAll("attachment");
    if (typeof payload !== "string" || files.length !== 1) {
      return invalidRequestResponse(
        "Choose one supported attachment. Your saved project has not been changed.",
      );
    }
    body = parseJson(payload);
    if (!body) return invalidRequestResponse();
    const file = files[0];
    if (!isFileValue(file)) {
      return invalidRequestResponse(
        "The attachment could not be read. Replace it and try again.",
      );
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    const validation = validateFileBytes(file.name, bytes);
    if (validation) {
      const error: GenerationError = {
        code: validation.code,
        message: validation.message,
        retryable: false,
      };
      return requestFailureResponse(
        error,
        validation.code === "file_too_large" ? 413 : 422,
      );
    }
    attachment = {
      filename: file.name,
      mimeType: fileMimeType(file.name),
      bytes,
      kind: isImageFile(file.name) ? "image" : "document",
    };
  } else {
    body = await request.json().catch(() => null);
  }

  const parsed = clarifyRequestSchema.safeParse(body);
  if (!parsed.success) return invalidRequestResponse();

  const result = await runStructuredModel(
    "clarify",
    CLARIFY_PROMPT,
    parsed.data,
    clarifyOutputSchema,
    attachment,
  );
  if (result.ok) {
    result.data = enforceClarificationBoundaries(
      parsed.data.task,
      result.data,
      Boolean(attachment || parsed.data.priorSourceDigest),
    );
  }
  return modelResponse(result);
}

function parseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function isFileValue(value: FormDataEntryValue): value is File {
  return (
    typeof value !== "string" &&
    typeof value.name === "string" &&
    typeof value.arrayBuffer === "function"
  );
}

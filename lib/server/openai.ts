import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import type { ZodType } from "zod";
import { PROMPT_VERSION } from "../prompts/version";
import { SYSTEM_PROMPT } from "../prompts/system";
import type {
  GenerationError,
  ModelFailure,
  ModelSuccess,
} from "../types";

const DEFAULT_MODEL = "gpt-5.6";

export async function runStructuredModel<T>(
  stageName: string,
  stagePrompt: string,
  taskMaterial: unknown,
  schema: ZodType<T>,
): Promise<ModelSuccess<T> | ModelFailure> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;

  if (!apiKey) {
    return failure({
      code: "configuration_error",
      message:
        "Live design reasoning is not configured yet. Your task is saved and the local design draft remains available.",
      retryable: false,
    });
  }

  try {
    const client = new OpenAI({ apiKey });
    const response = await client.responses.parse({
      model,
      instructions: `${SYSTEM_PROMPT}\n\nSTAGE INSTRUCTIONS:\n${stagePrompt}`,
      input: `<task_material>\n${JSON.stringify(taskMaterial)}\n</task_material>`,
      text: {
        format: zodTextFormat(schema, `visible_thinking_${stageName}`),
        verbosity: "low",
      },
      store: false,
      max_output_tokens: stageName === "moments" ? 7500 : 3500,
    });

    if (!response.output_parsed) {
      return failure({
        code: "model_refusal",
        message:
          "The model did not return a usable design. Your task has not been changed.",
        retryable: true,
      });
    }

    const parsed = schema.safeParse(response.output_parsed);
    if (!parsed.success) {
      return failure({
        code: "schema_error",
        message:
          "The generated design did not meet the required structure. Your task has not been changed.",
        retryable: true,
      });
    }

    return {
      ok: true,
      data: parsed.data,
      meta: { model, promptVersion: PROMPT_VERSION },
    };
  } catch (error) {
    return failure(classifyError(error));
  }
}

function classifyError(error: unknown): GenerationError {
  if (error instanceof OpenAI.RateLimitError) {
    return {
      code: "rate_limited",
      message:
        "The design service is busy. Your work is saved; try again shortly.",
      retryable: true,
    };
  }
  if (error instanceof OpenAI.APIConnectionError) {
    return {
      code: "service_unavailable",
      message:
        "The design service could not be reached. Your work is still saved.",
      retryable: true,
    };
  }
  if (error instanceof OpenAI.BadRequestError) {
    return {
      code: "invalid_request",
      message:
        "The design request could not be processed. Review the task and try again.",
      retryable: false,
    };
  }
  return {
    code: "unknown_error",
    message:
      "The design service encountered an unexpected problem. Your work is still saved.",
    retryable: true,
  };
}

function failure(error: GenerationError): ModelFailure {
  return { ok: false, error };
}

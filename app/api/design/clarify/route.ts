import { CLARIFY_PROMPT } from "@/lib/prompts/clarify";
import {
  clarifyOutputSchema,
  clarifyRequestSchema,
} from "@/lib/model-schemas";
import { invalidRequestResponse, modelResponse } from "@/lib/server/http";
import { runStructuredModel } from "@/lib/server/openai";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = clarifyRequestSchema.safeParse(body);
  if (!parsed.success) return invalidRequestResponse();

  const result = await runStructuredModel(
    "clarify",
    CLARIFY_PROMPT,
    parsed.data,
    clarifyOutputSchema,
  );
  return modelResponse(result);
}

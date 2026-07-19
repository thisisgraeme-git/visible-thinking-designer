import { DIAGNOSE_PROMPT } from "@/lib/prompts/diagnose";
import {
  diagnoseRequestSchema,
  diagnosisOutputSchema,
} from "@/lib/model-schemas";
import { invalidRequestResponse, modelResponse } from "@/lib/server/http";
import { runStructuredModel } from "@/lib/server/openai";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = diagnoseRequestSchema.safeParse(body);
  if (!parsed.success) return invalidRequestResponse();

  const result = await runStructuredModel(
    "diagnose",
    DIAGNOSE_PROMPT,
    parsed.data,
    diagnosisOutputSchema,
  );
  return modelResponse(result);
}

import { MOMENTS_PROMPT } from "@/lib/prompts/moments";
import {
  momentsOutputSchema,
  momentsRequestSchema,
} from "@/lib/model-schemas";
import { enforceMomentsBoundaries } from "@/lib/server/boundaries";
import { invalidRequestResponse, modelResponse } from "@/lib/server/http";
import { runStructuredModel } from "@/lib/server/openai";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = momentsRequestSchema.safeParse(body);
  if (!parsed.success) return invalidRequestResponse();

  const result = await runStructuredModel(
    "moments",
    MOMENTS_PROMPT,
    parsed.data,
    momentsOutputSchema,
  );
  if (result.ok) {
    result.data = enforceMomentsBoundaries(parsed.data.task, result.data);
  }
  return modelResponse(result);
}

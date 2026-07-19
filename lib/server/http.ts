import { NextResponse } from "next/server";
import type { ModelFailure } from "../types";

export function invalidRequestResponse() {
  const body: ModelFailure = {
    ok: false,
    error: {
      code: "invalid_request",
      message:
        "The task data was incomplete or exceeded the allowed length. Your saved project has not been changed.",
      retryable: false,
    },
  };
  return NextResponse.json(body, { status: 400 });
}

export function modelResponse<T>(
  result: { ok: true; data: T; meta: unknown } | ModelFailure,
) {
  if (result.ok) return NextResponse.json(result);
  const status =
    result.error.code === "configuration_error"
      ? 503
      : result.error.code === "rate_limited"
        ? 429
        : result.error.code === "invalid_request"
          ? 400
          : 502;
  return NextResponse.json(result, { status });
}

"use client";

import { useEffect, useState } from "react";
import { getGenerationMessage } from "@/lib/generation-copy";
import type { GenerationError, GenerationStatus } from "@/lib/types";

const NO_PROGRESS_MESSAGES: readonly string[] = [];

export function ModelStatus({
  status,
  label,
  messages = NO_PROGRESS_MESSAGES,
  error,
  onRetry,
  onFallback,
}: {
  status: GenerationStatus;
  label: string;
  messages?: readonly string[];
  error?: GenerationError;
  onRetry?: () => void;
  onFallback?: () => void;
}) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (status !== "loading" || messages.length < 2) return;
    const interval = window.setInterval(
      () => setMessageIndex((index) => (index + 1) % messages.length),
      2200,
    );
    return () => window.clearInterval(interval);
  }, [messages, status]);

  if (status === "loading") {
    const activeLabel =
      getGenerationMessage(status, messageIndex, label, messages) ?? label;
    return (
      <section
        aria-atomic="true"
        aria-live="polite"
        className="model-status loading"
        role="status"
      >
        <span className="model-pulse" aria-hidden="true" />
        <div>
          <p className="eyebrow">GPT-5.6 design reasoning</p>
          <h2>{activeLabel}</h2>
          <p>Your project is already saved in this browser.</p>
        </div>
      </section>
    );
  }

  if (status === "failed" && error) {
    return (
      <section className="model-status error" role="alert">
        <div>
          <p className="eyebrow">Your work is safe</p>
          <h2>Live design reasoning is unavailable.</h2>
          <p>{error.message}</p>
        </div>
        <div className="model-status-actions">
          {error.retryable && onRetry ? (
            <button className="button secondary" onClick={onRetry} type="button">
              Retry
            </button>
          ) : null}
          {onFallback ? (
            <button className="button primary" onClick={onFallback} type="button">
              Continue with local draft
            </button>
          ) : null}
        </div>
      </section>
    );
  }

  if (status === "fallback") {
    return (
      <div className="fallback-note" role="status">
        <strong>Local draft in use.</strong> You can keep designing and retry
        live reasoning later without losing this project.
      </div>
    );
  }

  return null;
}

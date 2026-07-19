import type { GenerationError, GenerationStatus } from "@/lib/types";

export function ModelStatus({
  status,
  label,
  error,
  onRetry,
  onFallback,
}: {
  status: GenerationStatus;
  label: string;
  error?: GenerationError;
  onRetry?: () => void;
  onFallback?: () => void;
}) {
  if (status === "loading") {
    return (
      <section className="model-status loading" role="status">
        <span className="model-pulse" aria-hidden="true" />
        <div>
          <p className="eyebrow">GPT-5.6 design reasoning</p>
          <h2>{label}</h2>
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

"use client";

import { useCallback, useEffect, useState } from "react";
import { AppShell } from "./app-shell";
import { ModelStatus } from "./model-status";
import { requestClarification, requestDiagnosis } from "@/lib/model-client";
import { updateGenerationStage } from "@/lib/model-state";
import { loadProject, saveProject } from "@/lib/storage";
import type {
  ClarificationQuestion,
  TaskDiagnosis,
  VisibleThinkingProject,
} from "@/lib/types";

export function DiagnoseScreen({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<VisibleThinkingProject>();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [phase, setPhase] = useState<"clarify" | "diagnose">("clarify");

  const generateDiagnosis = useCallback(
    async (baseProject: VisibleThinkingProject) => {
      const loading = saveProject(
        updateGenerationStage(baseProject, "diagnose", "loading"),
      );
      setProject(loading);
      setPhase("diagnose");

      const result = await requestDiagnosis(loading);
      if (!result.ok) {
        const failed = saveProject(
          updateGenerationStage(
            loading,
            "diagnose",
            "failed",
            result.error,
          ),
        );
        setProject(failed);
        return;
      }

      const stageUpdated = updateGenerationStage(
        loading,
        "diagnose",
        "succeeded",
      );
      const succeeded = saveProject({
        ...stageUpdated,
        diagnosis: { ...result.data, tutorConfirmed: false },
        generation: {
          ...stageUpdated.generation!,
          model: result.meta.model,
          promptVersion: result.meta.promptVersion,
        },
      });
      setProject(succeeded);
    },
    [],
  );

  const generateClarification = useCallback(
    async (baseProject: VisibleThinkingProject) => {
      const loading = saveProject(
        updateGenerationStage(baseProject, "clarify", "loading"),
      );
      setProject(loading);
      setPhase("clarify");

      const result = await requestClarification(loading);
      if (!result.ok) {
        const failed = saveProject(
          updateGenerationStage(
            loading,
            "clarify",
            "failed",
            result.error,
          ),
        );
        setProject(failed);
        return;
      }

      const completed = result.data.questions.length === 0;
      const stageUpdated = updateGenerationStage(
        loading,
        "clarify",
        "succeeded",
      );
      const succeeded = saveProject({
        ...stageUpdated,
        clarification: {
          ...stageUpdated.clarification,
          taskSummary: result.data.taskSummary,
          questions: result.data.questions.map((question) => ({
            ...question,
            skipped: false,
          })),
          completed,
        },
        generation: {
          ...stageUpdated.generation!,
          model: result.meta.model,
          promptVersion: result.meta.promptVersion,
        },
      });
      setProject(succeeded);
      setQuestionIndex(0);
      if (completed) await generateDiagnosis(succeeded);
    },
    [generateDiagnosis],
  );

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const stored = loadProject(projectId);
      if (!stored) {
        window.location.href = "/";
        return;
      }
      setProject(stored);
      const firstUnanswered = stored.clarification.questions.findIndex(
        (question) => !question.answer && !question.skipped,
      );
      setQuestionIndex(firstUnanswered < 0 ? 0 : firstUnanswered);
      if (stored.clarification.completed) {
        setPhase("diagnose");
        if (
          stored.generation?.diagnose.status === "idle" ||
          stored.generation?.diagnose.status === "loading"
        ) {
          void generateDiagnosis(stored);
        }
      } else if (
        stored.generation?.clarify.status === "idle" ||
        stored.generation?.clarify.status === "loading"
      ) {
        void generateClarification(stored);
      }
    });
    return () => {
      active = false;
    };
  }, [generateClarification, generateDiagnosis, projectId]);

  if (!project) return <div className="page-loading">Opening your design…</div>;

  const questions = project.clarification.questions;
  const currentQuestion = questions[questionIndex];
  const clarifyStatus = project.generation?.clarify.status;
  const diagnoseStatus = project.generation?.diagnose.status;
  const clarifyBlocked =
    clarifyStatus === "loading" || clarifyStatus === "failed";
  const diagnoseBlocked =
    diagnoseStatus === "loading" || diagnoseStatus === "failed";

  const commitQuestion = async (skipped: boolean) => {
    const nextQuestions = questions.map((question, index) =>
      index === questionIndex
        ? {
            ...question,
            answer: skipped ? undefined : answer.trim(),
            skipped,
          }
        : question,
    );
    const isLast = questionIndex >= questions.length - 1;
    const updated = saveProject({
      ...project,
      clarification: {
        ...project.clarification,
        questions: nextQuestions,
        completed: isLast,
      },
    });
    setProject(updated);
    setAnswer("");
    if (isLast) await generateDiagnosis(updated);
    else setQuestionIndex((index) => index + 1);
  };

  const continueWithLocalDraft = (stage: "clarify" | "diagnose") => {
    const updated = saveProject(
      updateGenerationStage(project, stage, "fallback"),
    );
    setProject(updated);
    setPhase(stage === "clarify" ? "clarify" : "diagnose");
  };

  const updateDiagnosis = <K extends keyof TaskDiagnosis>(
    key: K,
    value: TaskDiagnosis[K],
  ) => {
    if (!project.diagnosis) return;
    setProject({
      ...project,
      diagnosis: { ...project.diagnosis, [key]: value },
    });
  };

  const confirmDiagnosis = () => {
    if (!project.diagnosis) return;
    const updated = saveProject({
      ...project,
      status: "diagnosed",
      diagnosis: { ...project.diagnosis, tutorConfirmed: true },
    });
    window.location.href = `/design/${updated.id}/moments`;
  };

  return (
    <AppShell
      eyebrow={
        phase === "clarify"
          ? "Focused professional conversation"
          : "Editable design focus"
      }
      projectTitle={project.task.title}
      stage={2}
      title={
        phase === "clarify"
          ? "Clarify only what changes the design."
          : "Find the consequential work that is still hidden."
      }
    >
      {phase === "clarify" && clarifyStatus ? (
        <ModelStatus
          error={project.generation?.clarify.error}
          label="Reading the task and identifying only what is missing…"
          onFallback={() => continueWithLocalDraft("clarify")}
          onRetry={() => void generateClarification(project)}
          status={clarifyStatus}
        />
      ) : null}

      {phase === "diagnose" && diagnoseStatus ? (
        <ModelStatus
          error={project.generation?.diagnose.error}
          label="Locating the consequential thinking the current evidence cannot show…"
          onFallback={() => continueWithLocalDraft("diagnose")}
          onRetry={() => void generateDiagnosis(project)}
          status={diagnoseStatus}
        />
      ) : null}

      {phase === "clarify" && !clarifyBlocked ? (
        <ClarifyPhase
          answer={answer}
          currentQuestion={currentQuestion}
          index={questionIndex}
          onAnswer={setAnswer}
          onCommit={commitQuestion}
          summary={
            project.clarification.taskSummary ??
            project.clarification.taskReflection
          }
          total={questions.length}
        />
      ) : phase === "diagnose" &&
        !diagnoseBlocked &&
        project.diagnosis ? (
        <div className="diagnosis-layout">
          <section className="diagnosis-main">
            <div className="summary-card">
              <p className="eyebrow">Intended capability</p>
              <textarea
                aria-label="Capability summary"
                onChange={(event) =>
                  updateDiagnosis("capabilitySummary", event.target.value)
                }
                rows={3}
                value={project.diagnosis.capabilitySummary}
              />
            </div>

            <DiagnosisSection
              accent="green"
              items={project.diagnosis.currentTaskStrengths}
              kicker="Protect what already works"
              title="Strengths in the current task"
            />
            <DiagnosisSection
              accent="amber"
              items={project.diagnosis.invisibleThinking}
              kicker="Primary design focus"
              title="Consequential thinking that remains invisible"
            />

            <div className="summary-card opportunity-card">
              <p className="eyebrow">Central design opportunity</p>
              <textarea
                aria-label="Design opportunity"
                onChange={(event) =>
                  updateDiagnosis("designOpportunity", event.target.value)
                }
                rows={4}
                value={project.diagnosis.designOpportunity}
              />
            </div>
          </section>

          <aside className="diagnosis-aside">
            {(project.diagnosis.capabilityLensNotes?.length ?? 0) > 0 ? (
              <DiagnosisList
                items={project.diagnosis.capabilityLensNotes ?? []}
                title="Capability lens"
              />
            ) : null}
            {(project.diagnosis.taskDemandNotes?.length ?? 0) > 0 ? (
              <DiagnosisList
                items={project.diagnosis.taskDemandNotes ?? []}
                title="Task demands"
              />
            ) : null}
            {(project.diagnosis.culturalRelationalConsiderations?.length ?? 0) >
            0 ? (
              <DiagnosisList
                items={
                  project.diagnosis.culturalRelationalConsiderations ?? []
                }
                title="Cultural & relational context"
              />
            ) : null}
            <DiagnosisList
              items={project.diagnosis.currentEvidenceReveals}
              title="What current evidence reveals"
            />
            <DiagnosisList
              items={project.diagnosis.readinessAndScaffolding}
              title="Readiness & scaffolding"
            />
            {project.diagnosis.aiSubstitutionRisks.length > 0 ? (
              <DiagnosisList
                items={project.diagnosis.aiSubstitutionRisks}
                title="AI substitution risks"
              />
            ) : null}
            <DiagnosisList
              items={project.diagnosis.cautions}
              title="Cautions"
            />
          </aside>
        </div>
      ) : null}

      {phase === "diagnose" && !diagnoseBlocked ? (
        <div className="action-row">
          <a className="button secondary" href="/design/new">
            Edit task
          </a>
          <button
            className="button primary"
            onClick={confirmDiagnosis}
            type="button"
          >
            Use this design focus <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : null}
    </AppShell>
  );
}

function ClarifyPhase({
  summary,
  currentQuestion,
  index,
  total,
  answer,
  onAnswer,
  onCommit,
}: {
  summary?: string;
  currentQuestion?: ClarificationQuestion;
  index: number;
  total: number;
  answer: string;
  onAnswer: (value: string) => void;
  onCommit: (skipped: boolean) => Promise<void>;
}) {
  if (!currentQuestion) {
    return (
      <section className="reflection-card">
        <p className="eyebrow">No clarification needed</p>
        <p>{summary || "Your task has enough detail to set a design focus."}</p>
      </section>
    );
  }
  return (
    <div className="clarify-layout">
      <section className="reflection-card">
        <p className="eyebrow">Our current understanding</p>
        <p>{summary || "Your task has enough detail to begin the design."}</p>
      </section>
      <section className="question-card">
        <div className="question-progress">
          <span>
            Question {index + 1} of {total}
          </span>
          <div>
            {Array.from({ length: total }).map((_, item) => (
              <i className={item <= index ? "active" : ""} key={item} />
            ))}
          </div>
        </div>
        <h2>{currentQuestion.question}</h2>
        <p className="why-note">{currentQuestion.whyItMatters}</p>
        <label>
          <span>Your response</span>
          <textarea
            autoFocus
            onChange={(event) => onAnswer(event.target.value)}
            placeholder="A short response is enough."
            rows={4}
            value={answer}
          />
        </label>
        <div className="question-actions">
          <button
            className="button text-button"
            onClick={() => void onCommit(true)}
            type="button"
          >
            Skip this question
          </button>
          <button
            className="button primary"
            disabled={answer.trim().length < 3}
            onClick={() => void onCommit(false)}
            type="button"
          >
            {index === total - 1 ? "Review design focus" : "Next question"}{" "}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    </div>
  );
}

function DiagnosisSection({
  kicker,
  title,
  items,
  accent,
}: {
  kicker: string;
  title: string;
  items: string[];
  accent: "green" | "amber";
}) {
  return (
    <section className={`diagnosis-section ${accent}`}>
      <p className="eyebrow">{kicker}</p>
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function DiagnosisList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="aside-card">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

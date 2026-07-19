"use client";

import { useEffect, useState } from "react";
import { AppShell } from "./app-shell";
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
      if (stored.clarification.completed) setPhase("diagnose");
    });
    return () => {
      active = false;
    };
  }, [projectId]);

  if (!project) return <div className="page-loading">Opening your design…</div>;

  const questions = project.clarification.questions;
  const currentQuestion = questions[questionIndex];

  const commitQuestion = (skipped: boolean) => {
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
    if (isLast) setPhase("diagnose");
    else setQuestionIndex((index) => index + 1);
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
          : "Editable diagnosis"
      }
      projectTitle={project.task.title}
      stage={2}
      title={
        phase === "clarify"
          ? "Clarify only what changes the design."
          : "Find the consequential work that is still hidden."
      }
    >
      {phase === "clarify" ? (
        <ClarifyPhase
          answer={answer}
          currentQuestion={currentQuestion}
          index={questionIndex}
          onAnswer={setAnswer}
          onCommit={commitQuestion}
          reflection={project.clarification.taskReflection}
          total={questions.length}
        />
      ) : project.diagnosis ? (
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
              kicker="Primary diagnosis"
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

      {phase === "diagnose" ? (
        <div className="action-row">
          <a className="button secondary" href="/design/new">
            Edit task
          </a>
          <button
            className="button primary"
            onClick={confirmDiagnosis}
            type="button"
          >
            Confirm diagnosis <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : null}
    </AppShell>
  );
}

function ClarifyPhase({
  reflection,
  currentQuestion,
  index,
  total,
  answer,
  onAnswer,
  onCommit,
}: {
  reflection?: string;
  currentQuestion?: ClarificationQuestion;
  index: number;
  total: number;
  answer: string;
  onAnswer: (value: string) => void;
  onCommit: (skipped: boolean) => void;
}) {
  if (!currentQuestion) return null;
  return (
    <div className="clarify-layout">
      <section className="reflection-card">
        <p className="eyebrow">Our current understanding</p>
        <p>{reflection || "Your task has enough detail to begin the design."}</p>
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
            onClick={() => onCommit(true)}
            type="button"
          >
            Skip this question
          </button>
          <button
            className="button primary"
            disabled={answer.trim().length < 3}
            onClick={() => onCommit(false)}
            type="button"
          >
            {index === total - 1 ? "Review diagnosis" : "Next question"}{" "}
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

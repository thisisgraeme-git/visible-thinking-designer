"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "./app-shell";
import { duplicateProject, loadProject, saveProject } from "@/lib/storage";
import type {
  VisibleCondition,
  VisibleThinkingProject,
} from "@/lib/types";

const conditionLabels: Record<VisibleCondition, string> = {
  attempt: "Attempt",
  question: "Question",
  check: "Check",
  "explain-judgement": "Explain judgement",
  apply: "Apply",
};

export function PlanScreen({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<VisibleThinkingProject>();

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
    });
    return () => {
      active = false;
    };
  }, [projectId]);

  if (!project) return <div className="page-loading">Rendering plan…</div>;

  const saveNotes = (value: string) => {
    const updated = saveProject({
      ...project,
      plan: {
        ...project.plan,
        implementationNotes: value.split("\n").filter(Boolean),
      },
    });
    setProject(updated);
  };

  const duplicate = () => {
    const copy = duplicateProject(project);
    window.location.href = `/design/${copy.id}/plan`;
  };

  return (
    <AppShell
      eyebrow="Tutor-editable output"
      projectTitle={project.task.title}
      stage={4}
      title="Your Visible Thinking Plan."
    >
      <div className="plan-toolbar no-print">
        <p>
          <span aria-hidden="true">✓</span>
          Saved locally on this device
        </p>
        <div>
          <button className="toolbar-button" onClick={duplicate} type="button">
            Duplicate
          </button>
          <button
            className="toolbar-button"
            onClick={() => window.print()}
            type="button"
          >
            Print / Save PDF
          </button>
        </div>
      </div>

      <article className="plan-document">
        <header className="plan-cover">
          <div>
            <p className="eyebrow">Visible Thinking Plan · v0.1</p>
            <h2>{project.task.title}</h2>
            <p>{project.task.description}</p>
          </div>
          <div className="plan-status">
            <span>AI position</span>
            <strong>
              {project.task.considerLearnerAi
                ? project.task.defaultAiPosition.replaceAll("-", " ")
                : "Not considered"}
            </strong>
          </div>
        </header>

        <section className="plan-capability">
          <p className="eyebrow">Intended capability</p>
          <h3>
            {project.diagnosis?.capabilitySummary ||
              project.task.intendedCapability}
          </h3>
          {project.task.learnerContextNotes ? (
            <p>{project.task.learnerContextNotes}</p>
          ) : null}
        </section>

        <section className="evidence-shift">
          <div>
            <span>From</span>
            <p>
              {project.plan.evidenceShift?.from ||
                project.task.currentEvidence ||
                "Finished work alone"}
            </p>
          </div>
          <i aria-hidden="true">→</i>
          <div>
            <span>Toward</span>
            <p>
              {project.plan.evidenceShift?.toward ||
                "Selected evidence across the learning journey"}
            </p>
          </div>
        </section>

        <section className="plan-moments">
          <div className="plan-section-heading">
            <p className="eyebrow">Selected moments</p>
            <h3>Where consequential thinking becomes visible</h3>
          </div>
          {project.moments.map((moment, index) => (
            <article className="plan-moment" key={moment.id}>
              <div className="plan-moment-number">0{index + 1}</div>
              <div>
                <div className="plan-moment-heading">
                  <div>
                    <h4>{moment.title}</h4>
                    <p>{moment.timing}</p>
                  </div>
                  <div className="condition-chips">
                    {moment.conditions.map((condition) => (
                      <span key={condition}>
                        {conditionLabels[condition]}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="plan-moment-grid">
                  <PlanDetail label="Learner action" value={moment.learnerAction} />
                  <PlanDetail label="Tutor move" value={moment.tutorMove} />
                  <PlanDetail
                    label="Useful evidence"
                    value={moment.visibleEvidence}
                  />
                  <PlanDetail
                    label="Workload fit"
                    value={moment.workloadFit}
                  />
                </div>
                <div className="plan-feedback">
                  <span aria-hidden="true">↻</span>
                  <p>
                    <strong>Feedback loop</strong>
                    {moment.feedbackLoop}
                  </p>
                </div>
                <details className="moment-example plan-moment-example no-print">
                  <summary>Show an example in context</summary>
                  <p>{moment.exampleInContext}</p>
                </details>
                <div className="print-only plan-example-print">
                  <strong>Example in context</strong>
                  <p>{moment.exampleInContext}</p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="plan-notes">
          <div>
            <p className="eyebrow">Use this tomorrow</p>
            <h3>{project.plan.useTomorrowSummary}</h3>
          </div>
          <label className="no-print">
            <span>Editable implementation notes</span>
            <textarea
              onBlur={(event) => saveNotes(event.target.value)}
              onChange={(event) =>
                setProject({
                  ...project,
                  plan: {
                    ...project.plan,
                    implementationNotes: event.target.value.split("\n"),
                  },
                })
              }
              rows={4}
              value={project.plan.implementationNotes.join("\n")}
            />
          </label>
          <div className="print-only">
            <h4>Implementation notes</h4>
            <ul>
              {project.plan.implementationNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="plan-boundaries">
          <p className="eyebrow">Cautions and boundaries</p>
          <ul>
            {project.plan.cautions.map((caution) => (
              <li key={caution}>{caution}</li>
            ))}
          </ul>
          <p className="model-note">
            The Five Conditions are research-informed design language, not a
            checklist or validated assessment model. Educator professional
            judgement remains primary.
          </p>
        </section>
      </article>

      <div className="action-row no-print">
        <a
          className="button secondary"
          href={`/design/${project.id}/moments`}
        >
          Edit moments
        </a>
        <Link className="button primary" href="/">
          Finish and return home <span aria-hidden="true">→</span>
        </Link>
      </div>
    </AppShell>
  );
}

function PlanDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span>{label}</span>
      <p>{value}</p>
    </div>
  );
}

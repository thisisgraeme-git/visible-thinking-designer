"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "./app-shell";
import {
  activityRelationshipLabels,
  aiPositionLabels,
  evidenceModeLabels,
  evidencePurposeLabels,
  journeyPhaseLabels,
  retentionLabels,
} from "@/lib/evidence-options";
import {
  assessPlanIntegrity,
  combineIntegrityWarnings,
} from "@/lib/plan-integrity";
import { duplicateProject, loadProject, saveProject } from "@/lib/storage";
import type {
  IntegrityWarning,
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
  const reviewPoints = combineIntegrityWarnings(
    project.plan.integrityWarnings,
    assessPlanIntegrity(
      project.task,
      project.moments,
      project.plan.changedCondition,
    ),
  );

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

        {project.plan.evidencePatternRationale ? (
          <section className="pattern-rationale">
            <p className="eyebrow">Why this evidence pattern works</p>
            <p>{project.plan.evidencePatternRationale}</p>
            {project.plan.feedbackPattern ? (
              <div className="pattern-feedback">
                <span aria-hidden="true">↻</span>
                <p>
                  <strong>Feedback across the pattern</strong>
                  {project.plan.feedbackPattern}
                </p>
              </div>
            ) : null}
          </section>
        ) : null}

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
                    <p>
                      {moment.timing} · {journeyPhaseLabels[moment.journeyPhase]}
                    </p>
                  </div>
                  <div className="condition-chips">
                    {moment.conditions.map((condition) => (
                      <span key={condition}>
                        {conditionLabels[condition]}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="plan-moment-purpose">{moment.purpose}</p>
                <div
                  className="evidence-summary-chips plan-evidence-chips"
                  aria-label="Evidence purposes and modes"
                >
                  {moment.evidencePurposes.map((purpose) => (
                    <span key={purpose}>
                      {evidencePurposeLabels[purpose]}
                    </span>
                  ))}
                  {moment.evidenceModes.map((mode) => (
                    <em key={mode}>{evidenceModeLabels[mode]}</em>
                  ))}
                </div>
                <div className="plan-moment-grid">
                  <PlanDetail label="Learner action" value={moment.learnerAction} />
                  <PlanDetail label="Tutor move" value={moment.tutorMove} />
                  <PlanDetail
                    label="Useful evidence"
                    value={moment.visibleEvidence}
                  />
                  <PlanDetail
                    label="Weak or missing evidence"
                    value={moment.weakOrMissingEvidence}
                  />
                </div>
                <div className="plan-feedback">
                  <span aria-hidden="true">↻</span>
                  <p>
                    <strong>Feedback loop</strong>
                    {moment.feedbackLoop}
                  </p>
                  <p>
                    <strong>What the learner changes next</strong>
                    {moment.feedbackUptake}
                  </p>
                </div>
                <div className="plan-evidence-details">
                  <PlanDetail
                    label="Tutor may prompt or cue"
                    value={moment.supportBoundary.tutorMay}
                  />
                  <PlanDetail
                    label="Learner responsibility"
                    value={moment.supportBoundary.learnerResponsibility}
                  />
                  <PlanDetail
                    label="Visibility and retention"
                    value={`${retentionLabels[moment.retention.level]} — ${
                      moment.retention.note
                    }`}
                  />
                  <PlanDetail
                    label="Concrete workload"
                    value={formatWorkload(moment)}
                  />
                  {project.task.considerLearnerAi ? (
                    <PlanDetail
                      label="AI position for this moment"
                      value={aiPositionLabels[moment.aiPosition]}
                    />
                  ) : null}
                  {moment.caution ? (
                    <PlanDetail label="Moment caution" value={moment.caution} />
                  ) : null}
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

        {project.plan.changedCondition ? (
          <section className="plan-changed-condition">
            <p className="eyebrow">One changed condition</p>
            <h3>
              {project.moments.find(
                ({ id }) => id === project.plan.changedCondition?.momentId,
              )?.title ?? "Apply under a meaningful variation"}
            </h3>
            <div>
              <PlanDetail
                label="What changes"
                value={project.plan.changedCondition.changes}
              />
              <PlanDetail
                label="What remains constant"
                value={project.plan.changedCondition.remainsConstant}
              />
              <PlanDetail
                label="Why this helps reveal capability"
                value={project.plan.changedCondition.rationale}
              />
            </div>
          </section>
        ) : null}

        {reviewPoints.length > 0 ? (
          <PlanReviewPoints points={reviewPoints} />
        ) : null}

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

function formatWorkload(
  moment: VisibleThinkingProject["moments"][number],
): string {
  return [
    moment.workload.estimatedTime,
    moment.workload.frequency,
    moment.workload.recordingBurden,
    activityRelationshipLabels[moment.workload.activityRelationship],
  ]
    .map((value) => value.trim().replace(/[.;]+$/, ""))
    .join("; ")
    .concat(".");
}

function PlanReviewPoints({ points }: { points: IntegrityWarning[] }) {
  const structural = points.filter(({ source }) => source === "structural");
  const professional = points.filter(({ source }) => source === "model");

  return (
    <section className="plan-review-points">
      <p className="eyebrow">Review before use</p>
      <h3>Points for educator professional judgement</h3>
      <p>
        These are design checks and suggestions, not failures, verified
        findings or capability-assurance decisions.
      </p>
      <div>
        {structural.length > 0 ? (
          <PlanReviewGroup label="Structural checks" points={structural} />
        ) : null}
        {professional.length > 0 ? (
          <PlanReviewGroup
            label="Professional review suggestions"
            points={professional}
          />
        ) : null}
      </div>
    </section>
  );
}

function PlanReviewGroup({
  label,
  points,
}: {
  label: string;
  points: IntegrityWarning[];
}) {
  return (
    <div>
      <strong>{label}</strong>
      <ul>
        {points.map((point) => (
          <li key={`${point.source}-${point.code}-${point.message}`}>
            {point.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

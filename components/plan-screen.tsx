"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "./app-shell";
import {
  activityRelationshipLabels,
  retentionLabels,
} from "@/lib/evidence-options";
import {
  assessPlanIntegrity,
  combineIntegrityWarnings,
} from "@/lib/plan-integrity";
import { createGenerationState } from "@/lib/model-state";
import { duplicateProject, loadProject, saveProject } from "@/lib/storage";
import { getTaskSummary } from "@/lib/task-summary";
import { isLegacyUntitledTitle } from "@/lib/task-editing";
import {
  buildPlanJson,
  buildPlanMarkdown,
  planFilename,
} from "@/lib/plan-export";
import type {
  IntegrityWarning,
  VisibleThinkingProject,
} from "@/lib/types";

export function PlanScreen({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<VisibleThinkingProject>();
  const [exportStatus, setExportStatus] = useState("");

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

  const regenerateDesign = () => {
    const ready = saveProject({
      ...project,
      status: "clarifying",
      clarification: {
        sourceDigest: project.clarification.sourceDigest,
        questions: [],
        completed: false,
      },
      generation: createGenerationState(),
    });
    window.location.href = `/design/${ready.id}/diagnose`;
  };

  const download = (content: string, filename: string, type: string) => {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    setExportStatus(`${filename} downloaded.`);
  };

  const copyPlan = async () => {
    try {
      await navigator.clipboard.writeText(
        buildPlanMarkdown(project, reviewPoints),
      );
      setExportStatus("Plan copied.");
    } catch {
      setExportStatus(
        "Copy was unavailable. Download the Markdown plan instead.",
      );
    }
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
          <Link
            className="toolbar-button"
            href={`/design/new?projectId=${project.id}`}
          >
            Edit task details
          </Link>
          <button className="toolbar-button" onClick={duplicate} type="button">
            Duplicate
          </button>
          <button className="toolbar-button" onClick={copyPlan} type="button">
            Copy plan
          </button>
          <button
            className="toolbar-button"
            onClick={() =>
              download(
                buildPlanMarkdown(project, reviewPoints),
                planFilename(project.task.title, "md"),
                "text/markdown;charset=utf-8",
              )
            }
            type="button"
          >
            Download Markdown
          </button>
          <button
            className="toolbar-button"
            onClick={() =>
              download(
                buildPlanJson(project, reviewPoints),
                planFilename(project.task.title, "json"),
                "application/json;charset=utf-8",
              )
            }
            type="button"
          >
            Download JSON
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

      {exportStatus ? (
        <p aria-live="polite" className="export-status no-print" role="status">
          {exportStatus}
        </p>
      ) : null}

      {project.sourceAttachment?.processed ? (
        <p className="attachment-retention-note no-print">
          Processed task context from {project.sourceAttachment.filename} is
          available. The attachment itself was not retained.
        </p>
      ) : project.sourceAttachment?.notUsedForDesign ? (
        <p className="attachment-retention-note no-print">
          {project.sourceAttachment.filename} was not processed or used in this
          design. The original attachment was not retained with this draft.
        </p>
      ) : null}

      {(!project.task.title.trim() ||
        isLegacyUntitledTitle(project.task.title)) ? (
        <section className="stale-design-note no-print" role="status">
          <div>
            <strong>This existing draft needs a task name.</strong>
            <p>Name it before using or printing the plan.</p>
          </div>
          <Link
            className="button primary"
            href={`/design/new?projectId=${project.id}`}
          >
            Name this task
          </Link>
        </section>
      ) : null}

      {project.designState?.stale ? (
        <section className="stale-design-note" role="status">
          <div>
            <strong>The task details have changed.</strong>
            <p>
              These changes may affect the current design. Regenerate the design
              focus and moments to apply them.
            </p>
          </div>
          <Link
            className="button secondary"
            href={`/design/new?projectId=${project.id}`}
          >
            Review task details
          </Link>
          <button
            className="button primary"
            onClick={regenerateDesign}
            type="button"
          >
            Regenerate design
          </button>
        </section>
      ) : null}

      <article className="plan-document">
        <header className="plan-cover">
          <div>
            <p className="eyebrow">Visible Thinking Plan · v0.1</p>
            <h2>{project.task.title}</h2>
            <p>{getTaskSummary(project)}</p>
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

        {project.plan.evidencePatternRationale ? (
          <section className="pattern-rationale">
            <p className="eyebrow">Why this evidence pattern works</p>
            <p>{project.plan.evidencePatternRationale}</p>
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
                    <p>{moment.timing}</p>
                  </div>
                </div>
                <div className="plan-moment-grid">
                  <PlanDetail
                    label="Learner action"
                    value={moment.learnerAction}
                  />
                  <PlanDetail label="Tutor move" value={moment.tutorMove} />
                  <PlanDetail
                    label="Visible evidence"
                    value={moment.visibleEvidence}
                  />
                </div>
                <div className="plan-feedback">
                  <span aria-hidden="true">↻</span>
                  <p>
                    <strong>Feedback uptake</strong>
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
                  {moment.retention.level !== "observe-and-use" ? (
                    <PlanDetail
                      label="Retention"
                      value={`${retentionLabels[moment.retention.level]} — ${
                        moment.retention.note
                      }`}
                    />
                  ) : null}
                  <PlanDetail
                    label="Approximate workload"
                    value={formatOperationalWorkload(moment)}
                  />
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
        <Link className="button secondary" href="/design/new">
          Start another task
        </Link>
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

function formatOperationalWorkload(
  moment: VisibleThinkingProject["moments"][number],
): string {
  return [
    moment.workload.estimatedTime,
    moment.workload.frequency,
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

"use client";

import { useCallback, useEffect, useState } from "react";
import { AppShell } from "./app-shell";
import { ModelStatus } from "./model-status";
import { PLAN_GENERATION_MESSAGES } from "@/lib/generation-copy";
import { requestMoments } from "@/lib/model-client";
import { updateGenerationStage } from "@/lib/model-state";
import {
  activityRelationshipLabels,
  activityRelationships,
  aiPositionLabels,
  aiPositions,
  evidenceModeLabels,
  evidenceModes,
  evidencePurposeLabels,
  evidencePurposes,
  journeyPhaseLabels,
  journeyPhases,
  retentionLabels,
  retentionLevels,
} from "@/lib/evidence-options";
import {
  assessPlanIntegrity,
  combineIntegrityWarnings,
} from "@/lib/plan-integrity";
import { loadProject, saveProject } from "@/lib/storage";
import type {
  EvidenceMode,
  EvidencePurpose,
  IntegrityWarning,
  VisibleCondition,
  VisibleThinkingMoment,
  VisibleThinkingProject,
} from "@/lib/types";

const conditionLabels: Record<VisibleCondition, string> = {
  attempt: "Attempt",
  question: "Question",
  check: "Check",
  "explain-judgement": "Explain judgement",
  apply: "Apply",
};

export function MomentsScreen({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<VisibleThinkingProject>();

  const generateMoments = useCallback(
    async (baseProject: VisibleThinkingProject) => {
      const loading = saveProject(
        updateGenerationStage(baseProject, "moments", "loading"),
      );
      setProject(loading);

      const result = await requestMoments(loading);
      if (!result.ok) {
        const failed = saveProject(
          updateGenerationStage(
            loading,
            "moments",
            "failed",
            result.error,
          ),
        );
        setProject(failed);
        return;
      }

      const stageUpdated = updateGenerationStage(
        loading,
        "moments",
        "succeeded",
      );
      const succeeded = saveProject({
        ...stageUpdated,
        designState: undefined,
        moments: result.data.moments,
        plan: {
          evidenceShift: result.data.evidenceShift,
          evidencePatternRationale: result.data.evidencePatternRationale,
          feedbackPattern: result.data.feedbackPattern,
          changedCondition: result.data.changedCondition,
          integrityWarnings: result.data.integrityWarnings,
          implementationNotes: result.data.implementationNotes,
          cautions: result.data.cautions,
          useTomorrowSummary: result.data.useTomorrowSummary,
        },
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

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const stored = loadProject(projectId);
      if (!stored) {
        window.location.href = "/";
        return;
      }
      if (!stored.diagnosis?.tutorConfirmed) {
        window.location.href = `/design/${stored.id}/diagnose`;
        return;
      }
      setProject(stored);
      if (
        stored.generation?.moments.status === "idle" ||
        stored.generation?.moments.status === "loading"
      ) {
        void generateMoments(stored);
      }
    });
    return () => {
      active = false;
    };
  }, [generateMoments, projectId]);

  if (!project) return <div className="page-loading">Opening moments…</div>;

  const momentsStatus = project.generation?.moments.status;
  const momentsBlocked =
    momentsStatus === "loading" || momentsStatus === "failed";
  const reviewPoints = combineIntegrityWarnings(
    project.plan.integrityWarnings,
    assessPlanIntegrity(
      project.task,
      project.moments,
      project.plan.changedCondition,
    ),
  );

  const useLocalDraft = () => {
    const updated = saveProject(
      updateGenerationStage(project, "moments", "fallback"),
    );
    setProject(updated);
  };

  const updateMoment = (
    id: string,
    key: keyof VisibleThinkingMoment,
    value: VisibleThinkingMoment[keyof VisibleThinkingMoment],
  ) =>
    setProject({
      ...project,
      moments: project.moments.map((item) =>
        item.id === id ? { ...item, [key]: value } : item,
      ),
    });

  const moveMoment = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= project.moments.length) return;
    const moments = [...project.moments];
    [moments[index], moments[target]] = [moments[target], moments[index]];
    setProject({ ...project, moments });
  };

  const removeMoment = (id: string) => {
    if (project.moments.length <= 3) return;
    setProject({
      ...project,
      moments: project.moments.filter((item) => item.id !== id),
    });
  };

  const addManualMoment = () => {
    if (
      project.moments.length >= 5 ||
      project.moments.some((item) => item.source === "tutor")
    ) {
      return;
    }
    setProject({
      ...project,
      moments: [
        ...project.moments,
        {
          id: crypto.randomUUID(),
          title: "Tutor-added moment",
          timing: "Choose a consequential point in the task",
          purpose: "Describe why this moment matters.",
          journeyPhase: "during-task",
          conditions: ["question"],
          evidencePurposes: ["learning"],
          evidenceModes: ["tutor-observation"],
          learnerAction: "Describe what the learner will do.",
          tutorMove: "Describe what the tutor will ask, notice or introduce.",
          supportBoundary: {
            tutorMay:
              "Describe the concise prompt or cue the tutor may provide.",
            learnerResponsibility:
              "Describe the action or judgement that remains the learner’s responsibility.",
          },
          visibleEvidence: "Describe what useful evidence could become visible.",
          weakOrMissingEvidence:
            "Describe what weak or missing evidence might look like.",
          feedbackLoop:
            "Describe the feedback the learner receives or interprets.",
          feedbackUptake:
            "Describe what the learner changes, confirms or applies next.",
          exampleInContext:
            "Add one concise example showing how this moment could look in the task.",
          aiPosition: project.task.considerLearnerAi
            ? project.task.defaultAiPosition
            : "not-relevant",
          retention: {
            level: "observe-and-use",
            note: "Use the evidence in the moment; no additional record is planned.",
          },
          workload: {
            estimatedTime: "Approximate time not yet specified",
            frequency: "Once at the selected point",
            recordingBurden: "No additional record planned",
            activityRelationship: "embedded",
          },
          source: "tutor",
        },
      ],
    });
  };

  const continueToPlan = () => {
    const updated = saveProject({
      ...project,
      status: "planned",
      plan: {
        ...project.plan,
        integrityWarnings: reviewPoints,
      },
    });
    window.location.href = `/design/${updated.id}/plan`;
  };

  const updateChangedCondition = (
    key: "momentId" | "changes" | "remainsConstant" | "rationale",
    value: string,
  ) => {
    const applyMoment =
      project.moments.find((moment) => moment.conditions.includes("apply")) ??
      project.moments.at(-1);
    const current = project.plan.changedCondition ?? {
      momentId: applyMoment?.id ?? "",
      changes: "",
      remainsConstant: "",
      rationale: "",
    };
    setProject({
      ...project,
      plan: {
        ...project.plan,
        changedCondition: { ...current, [key]: value },
      },
    });
  };

  return (
    <AppShell
      eyebrow="Selective evidence across the journey"
      projectTitle={project.task.title}
      stage={3}
      title="Design moments that earn their place."
    >
      {momentsStatus ? (
        <ModelStatus
          error={project.generation?.moments.error}
          label="Designing a small set of consequential moments…"
          messages={PLAN_GENERATION_MESSAGES}
          onFallback={useLocalDraft}
          onRetry={() => void generateMoments(project)}
          status={momentsStatus}
        />
      ) : null}

      {!momentsBlocked ? (
        <>
      <div className="moments-intro">
        <p>
          These are design proposals, not a sequence to follow mechanically.
          Edit, remove or reorder them. Keep only the moments that strengthen
          professional judgement.
        </p>
        <div className="condition-key" aria-label="Conditions used">
          {Object.values(conditionLabels).map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>

      <div className="feedback-ribbon feedback-ribbon-prominent">
        <span aria-hidden="true">↻</span>
        <p>
          <strong>Feedback is the connective loop.</strong>
          It matters when the learner interprets it and changes what happens
          next.
        </p>
      </div>

      <div className="moment-stack">
        {project.moments.map((item, index) => (
          <MomentCard
            canRemove={project.moments.length > 3}
            index={index}
            isFirst={index === 0}
            isLast={index === project.moments.length - 1}
            key={item.id}
            moment={item}
            taskAiPosition={project.task.defaultAiPosition}
            taskConsidersAi={project.task.considerLearnerAi}
            onMove={(direction) => moveMoment(index, direction)}
            onRemove={() => removeMoment(item.id)}
            onUpdate={(key, value) => updateMoment(item.id, key, value)}
          />
        ))}
      </div>

      {project.moments.length < 5 &&
      !project.moments.some((item) => item.source === "tutor") ? (
        <button
          className="add-moment"
          onClick={addManualMoment}
          type="button"
        >
          <span aria-hidden="true">＋</span>
          Add one tutor-designed moment
        </button>
      ) : null}

      <details className="pattern-details">
        <summary>Evidence pattern details</summary>
        <div className="pattern-details-body">
          <MomentField
            label="Why these moments work together"
            onChange={(value) =>
              setProject({
                ...project,
                plan: {
                  ...project.plan,
                  evidencePatternRationale: value,
                },
              })
            }
            value={project.plan.evidencePatternRationale ?? ""}
          />
          <fieldset className="changed-condition-editor">
            <legend>One changed condition</legend>
            <label>
              <span>Apply moment</span>
              <select
                onChange={(event) =>
                  updateChangedCondition("momentId", event.target.value)
                }
                value={project.plan.changedCondition?.momentId ?? ""}
              >
                <option value="">Choose an Apply moment</option>
                {project.moments
                  .filter((moment) => moment.conditions.includes("apply"))
                  .map((moment) => (
                    <option key={moment.id} value={moment.id}>
                      {moment.title}
                    </option>
                  ))}
              </select>
            </label>
            <MomentField
              label="What changes"
              onChange={(value) => updateChangedCondition("changes", value)}
              value={project.plan.changedCondition?.changes ?? ""}
            />
            <MomentField
              label="What remains constant"
              onChange={(value) =>
                updateChangedCondition("remainsConstant", value)
              }
              value={project.plan.changedCondition?.remainsConstant ?? ""}
            />
            <MomentField
              label="Why this helps reveal capability"
              onChange={(value) => updateChangedCondition("rationale", value)}
              value={project.plan.changedCondition?.rationale ?? ""}
            />
          </fieldset>
        </div>
      </details>

      <ReviewPoints points={reviewPoints} />

      <div className="action-row">
        <a
          className="button secondary"
          href={`/design/${project.id}/diagnose`}
        >
          Back to design focus
        </a>
        <button
          className="button primary"
          onClick={continueToPlan}
          type="button"
        >
          Build the plan <span aria-hidden="true">→</span>
        </button>
      </div>
        </>
      ) : null}
    </AppShell>
  );
}

function MomentCard({
  moment,
  index,
  isFirst,
  isLast,
  canRemove,
  taskConsidersAi,
  taskAiPosition,
  onUpdate,
  onMove,
  onRemove,
}: {
  moment: VisibleThinkingMoment;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  canRemove: boolean;
  taskConsidersAi: boolean;
  taskAiPosition: VisibleThinkingProject["task"]["defaultAiPosition"];
  onUpdate: (
    key: keyof VisibleThinkingMoment,
    value: VisibleThinkingMoment[keyof VisibleThinkingMoment],
  ) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <article className="moment-card">
      <header>
        <div className="moment-number">0{index + 1}</div>
        <div className="moment-heading">
          <input
            aria-label={`Moment ${index + 1} title`}
            onChange={(event) => onUpdate("title", event.target.value)}
            value={moment.title}
          />
          <input
            aria-label={`Moment ${index + 1} timing`}
            className="timing-input"
            onChange={(event) => onUpdate("timing", event.target.value)}
            value={moment.timing}
          />
        </div>
        <div className="moment-tools" aria-label="Moment actions">
          <button
            aria-label="Move moment up"
            disabled={isFirst}
            onClick={() => onMove(-1)}
            type="button"
          >
            ↑
          </button>
          <button
            aria-label="Move moment down"
            disabled={isLast}
            onClick={() => onMove(1)}
            type="button"
          >
            ↓
          </button>
          <button
            aria-label="Remove moment"
            disabled={!canRemove}
            onClick={onRemove}
            type="button"
          >
            ×
          </button>
        </div>
      </header>

      <div className="condition-chips">
        {moment.conditions.map((condition) => (
          <span key={condition}>{conditionLabels[condition]}</span>
        ))}
        {moment.source === "tutor" ? <em>Tutor added</em> : null}
      </div>

      <div className="evidence-summary-chips" aria-label="Evidence purposes and modes">
        {moment.evidencePurposes.map((purpose) => (
          <span key={purpose}>{evidencePurposeLabels[purpose]}</span>
        ))}
        {moment.evidenceModes.map((mode) => (
          <em key={mode}>{evidenceModeLabels[mode]}</em>
        ))}
      </div>

      <div className="moment-grid">
        <MomentField
          label="Learner action"
          onChange={(value) => onUpdate("learnerAction", value)}
          value={moment.learnerAction}
        />
        <MomentField
          label="Tutor move"
          onChange={(value) => onUpdate("tutorMove", value)}
          value={moment.tutorMove}
        />
        <MomentField
          label="Useful visible evidence"
          onChange={(value) => onUpdate("visibleEvidence", value)}
          value={moment.visibleEvidence}
        />
        <MomentField
          label="Weak or missing evidence"
          onChange={(value) => onUpdate("weakOrMissingEvidence", value)}
          value={moment.weakOrMissingEvidence}
        />
      </div>

      <div className="moment-footer">
        <MomentField
          label="Feedback"
          onChange={(value) => onUpdate("feedbackLoop", value)}
          value={moment.feedbackLoop}
        />
        <MomentField
          label="What the learner changes next"
          onChange={(value) => onUpdate("feedbackUptake", value)}
          value={moment.feedbackUptake}
        />
      </div>

      <details className="evidence-details">
        <summary>Evidence details</summary>
        <div className="evidence-details-body">
          <MomentField
            label="Why this moment matters"
            onChange={(value) => onUpdate("purpose", value)}
            value={moment.purpose}
          />

          <label>
            <span>Journey phase</span>
            <select
              onChange={(event) =>
                onUpdate(
                  "journeyPhase",
                  event.target.value as VisibleThinkingMoment["journeyPhase"],
                )
              }
              value={moment.journeyPhase}
            >
              {journeyPhases.map((phase) => (
                <option key={phase} value={phase}>
                  {journeyPhaseLabels[phase]}
                </option>
              ))}
            </select>
          </label>

          <EvidenceChoices
            label="Evidence purposes"
            labels={evidencePurposeLabels}
            onChange={(value) => onUpdate("evidencePurposes", value)}
            options={evidencePurposes}
            selected={moment.evidencePurposes}
          />
          <EvidenceChoices
            label="Evidence modes"
            labels={evidenceModeLabels}
            onChange={(value) => onUpdate("evidenceModes", value)}
            options={evidenceModes}
            selected={moment.evidenceModes}
          />

          <div className="evidence-details-grid">
            <MomentField
              label="What the tutor may prompt or cue"
              onChange={(value) =>
                onUpdate("supportBoundary", {
                  ...moment.supportBoundary,
                  tutorMay: value,
                })
              }
              value={moment.supportBoundary.tutorMay}
            />
            <MomentField
              label="What remains the learner’s responsibility"
              onChange={(value) =>
                onUpdate("supportBoundary", {
                  ...moment.supportBoundary,
                  learnerResponsibility: value,
                })
              }
              value={moment.supportBoundary.learnerResponsibility}
            />
          </div>

          {taskConsidersAi ? (
            <label>
              <span>AI position for this moment</span>
              <select
                onChange={(event) =>
                  onUpdate(
                    "aiPosition",
                    event.target.value as VisibleThinkingMoment["aiPosition"],
                  )
                }
                value={moment.aiPosition}
              >
                {aiPositions
                  .filter(
                    (position) =>
                      position !== "not-considered" &&
                      position !== "not-relevant",
                  )
                  .map((position) => (
                    <option key={position} value={position}>
                      {aiPositionLabels[position]}
                      {position === taskAiPosition ? " — task default" : ""}
                    </option>
                  ))}
              </select>
            </label>
          ) : null}

          <div className="evidence-details-grid">
            <label>
              <span>Visibility and retention</span>
              <select
                onChange={(event) =>
                  onUpdate("retention", {
                    ...moment.retention,
                    level: event.target
                      .value as VisibleThinkingMoment["retention"]["level"],
                  })
                }
                value={moment.retention.level}
              >
                {retentionLevels.map((level) => (
                  <option key={level} value={level}>
                    {retentionLabels[level]}
                  </option>
                ))}
              </select>
            </label>
            <MomentField
              label="What is noted or retained"
              onChange={(value) =>
                onUpdate("retention", { ...moment.retention, note: value })
              }
              value={moment.retention.note}
            />
          </div>

          <fieldset className="workload-editor">
            <legend>Concrete workload fit</legend>
            <div className="evidence-details-grid">
              <TextField
                label="Approximate time"
                onChange={(value) =>
                  onUpdate("workload", {
                    ...moment.workload,
                    estimatedTime: value,
                  })
                }
                value={moment.workload.estimatedTime}
              />
              <TextField
                label="Frequency"
                onChange={(value) =>
                  onUpdate("workload", {
                    ...moment.workload,
                    frequency: value,
                  })
                }
                value={moment.workload.frequency}
              />
              <TextField
                label="Recording burden"
                onChange={(value) =>
                  onUpdate("workload", {
                    ...moment.workload,
                    recordingBurden: value,
                  })
                }
                value={moment.workload.recordingBurden}
              />
              <label>
                <span>Relationship to existing activity</span>
                <select
                  onChange={(event) =>
                    onUpdate("workload", {
                      ...moment.workload,
                      activityRelationship: event.target
                        .value as VisibleThinkingMoment["workload"]["activityRelationship"],
                    })
                  }
                  value={moment.workload.activityRelationship}
                >
                  {activityRelationships.map((relationship) => (
                    <option key={relationship} value={relationship}>
                      {activityRelationshipLabels[relationship]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </fieldset>

          {moment.caution ? (
            <MomentField
              label="Moment caution"
              onChange={(value) => onUpdate("caution", value)}
              value={moment.caution}
            />
          ) : null}
        </div>
      </details>

      <details className="moment-example">
        <summary>Show an example in context</summary>
        <MomentField
          label="Editable task-specific example"
          onChange={(value) => onUpdate("exampleInContext", value)}
          value={
            moment.exampleInContext ||
            "Add one concise example showing how this moment could look in the task."
          }
        />
      </details>
    </article>
  );
}

function MomentField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span>{label}</span>
      <textarea
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        value={value}
      />
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span>{label}</span>
      <input
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

function EvidenceChoices<T extends EvidencePurpose | EvidenceMode>({
  label,
  labels,
  options,
  selected,
  onChange,
}: {
  label: string;
  labels: Record<T, string>;
  options: T[];
  selected: T[];
  onChange: (value: T[]) => void;
}) {
  const toggle = (option: T) =>
    onChange(
      selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option],
    );

  return (
    <fieldset className="evidence-choice-field">
      <legend>{label}</legend>
      <div className="evidence-choice-grid">
        {options.map((option) => (
          <label className="chip-choice" key={option}>
            <input
              checked={selected.includes(option)}
              onChange={() => toggle(option)}
              type="checkbox"
            />
            <span>{labels[option]}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function ReviewPoints({ points }: { points: IntegrityWarning[] }) {
  if (points.length === 0) return null;
  const structural = points.filter(({ source }) => source === "structural");
  const professional = points.filter(({ source }) => source === "model");

  return (
    <aside className="review-points" aria-label="Points to review">
      <p className="eyebrow">Points to review</p>
      <h3>Use these prompts with professional judgement</h3>
      <p>
        These are design checks and suggestions, not failures or verified
        findings.
      </p>
      {structural.length > 0 ? (
        <ReviewPointGroup
          label="Structural checks"
          points={structural}
        />
      ) : null}
      {professional.length > 0 ? (
        <ReviewPointGroup
          label="Professional review suggestions"
          points={professional}
        />
      ) : null}
    </aside>
  );
}

function ReviewPointGroup({
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

"use client";

import { useCallback, useEffect, useState } from "react";
import { AppShell } from "./app-shell";
import { ModelStatus } from "./model-status";
import { requestMoments } from "@/lib/model-client";
import { updateGenerationStage } from "@/lib/model-state";
import { loadProject, saveProject } from "@/lib/storage";
import type {
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
        moments: result.data.moments,
        plan: {
          evidenceShift: result.data.evidenceShift,
          feedbackPattern: result.data.feedbackPattern,
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
    if (project.moments.some((item) => item.source === "tutor")) return;
    setProject({
      ...project,
      moments: [
        ...project.moments,
        {
          id: crypto.randomUUID(),
          title: "Tutor-added moment",
          timing: "Choose a consequential point in the task",
          purpose: "Describe why this moment matters.",
          conditions: ["question"],
          learnerAction: "Describe what the learner will do.",
          tutorMove: "Describe what the tutor will ask, notice or introduce.",
          visibleEvidence: "Describe what useful evidence could become visible.",
          weakOrMissingEvidence:
            "Describe what weak or missing evidence might look like.",
          feedbackLoop:
            "Describe how feedback will change the learner’s next action.",
          exampleInContext:
            "Add one concise example showing how this moment could look in the task.",
          aiPosition: project.task.considerLearnerAi
            ? project.task.defaultAiPosition
            : "not-relevant",
          workloadFit: "Review the workload fit.",
          source: "tutor",
        },
      ],
    });
  };

  const continueToPlan = () => {
    const updated = saveProject({ ...project, status: "planned" });
    window.location.href = `/design/${updated.id}/plan`;
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
            onMove={(direction) => moveMoment(index, direction)}
            onRemove={() => removeMoment(item.id)}
            onUpdate={(key, value) => updateMoment(item.id, key, value)}
          />
        ))}
      </div>

      {!project.moments.some((item) => item.source === "tutor") ? (
        <button
          className="add-moment"
          onClick={addManualMoment}
          type="button"
        >
          <span aria-hidden="true">＋</span>
          Add one tutor-designed moment
        </button>
      ) : null}

      <div className="action-row">
        <a
          className="button secondary"
          href={`/design/${project.id}/diagnose`}
        >
          Back to diagnosis
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
  onUpdate,
  onMove,
  onRemove,
}: {
  moment: VisibleThinkingMoment;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  canRemove: boolean;
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
          label="Feedback loop"
          onChange={(value) => onUpdate("feedbackLoop", value)}
          value={moment.feedbackLoop}
        />
        <MomentField
          label="Workload fit"
          onChange={(value) => onUpdate("workloadFit", value)}
          value={moment.workloadFit}
        />
      </div>

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

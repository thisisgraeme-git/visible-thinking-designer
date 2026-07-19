"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "./app-shell";
import { blankProject, projectFromFixture } from "@/lib/fixtures";
import { createGenerationState } from "@/lib/model-state";
import { saveProject } from "@/lib/storage";
import type {
  AiPosition,
  AssessmentStakes,
  LearningSetting,
  ProjectSource,
  VisibleThinkingProject,
} from "@/lib/types";

function makeGenericDesign(project: VisibleThinkingProject) {
  if (project.diagnosis && project.moments.length > 0) return project;
  const aiPosition = project.task.considerLearnerAi
    ? project.task.defaultAiPosition
    : "not-relevant";
  return {
    ...project,
    diagnosis: {
      capabilitySummary: project.task.intendedCapability,
      currentEvidenceReveals: [
        project.task.currentEvidence ||
          "The quality of the finished product or performance",
      ],
      currentTaskStrengths: [
        "The task has an authentic capability at its centre",
        "The existing product or performance remains useful evidence",
      ],
      invisibleThinking: [
        "How the learner frames the task and selects an approach",
        "Which discipline-specific checks shape their decisions",
        "How they interpret feedback and revise what happens next",
      ],
      contextConstraints: [
        "Evidence should fit the existing activity",
        "The learner should not become more surveilled",
      ],
      readinessAndScaffolding: [
        "Support should be calibrated to current readiness",
      ],
      designOpportunity:
        "Add three brief, high-value moments that reveal planning, checking and adaptation while keeping the original task central.",
      aiSubstitutionRisks: project.task.considerLearnerAi
        ? [
            "A polished AI-assisted output may conceal selection, checking and revision decisions",
          ]
        : [],
      cautions: [
        "Do not collect evidence that does not change professional judgement",
      ],
      tutorConfirmed: false,
    },
    moments: [
      {
        id: crypto.randomUUID(),
        title: "Name the first approach",
        timing: "Before substantial assistance",
        purpose: "Surface the learner’s initial framing and plan.",
        conditions: ["attempt", "question"] as const,
        learnerAction:
          "State the proposed approach, one important uncertainty and the first check they will use.",
        tutorMove:
          "Ask one focused question that tests the plan without prescribing it.",
        visibleEvidence:
          "A context-aware starting point that the learner can revisit.",
        weakOrMissingEvidence:
          "A generic plan disconnected from the actual task.",
        feedbackLoop:
          "The first attempt provides feedback; the learner identifies what should change next.",
        aiPosition,
        workloadFit: "Low — a short opening exchange.",
        source: "model" as const,
      },
      {
        id: crypto.randomUUID(),
        title: "Check a consequential decision",
        timing: "At the first meaningful decision point",
        purpose: "Make discipline-grounded checking visible.",
        conditions: ["check", "explain-judgement"] as const,
        learnerAction:
          "Use relevant evidence, standards or task signals to defend or revise one decision.",
        tutorMove:
          "Ask: “What would make you change this decision?”",
        visibleEvidence:
          "A judgement connected to the real standards and behaviour of the task.",
        weakOrMissingEvidence:
          "A claim of confidence without a relevant check.",
        feedbackLoop:
          "The check or follow-up question changes the learner’s next action.",
        aiPosition,
        workloadFit: "Low — sample one decision, not every step.",
        source: "model" as const,
      },
      {
        id: crypto.randomUUID(),
        title: "Adapt under a changed condition",
        timing: "After initial feedback",
        purpose: "Reveal transfer rather than repetition.",
        conditions: ["apply"] as const,
        learnerAction:
          "Adapt the approach when one authentic constraint, audience need or piece of evidence changes.",
        tutorMove:
          "Introduce one proportionate change and ask what should be preserved.",
        visibleEvidence:
          "An adaptation that remains aligned with the intended capability.",
        weakOrMissingEvidence:
          "Repeating the original response despite the changed condition.",
        feedbackLoop:
          "The changed outcome becomes feedback for the learner’s final refinement.",
        aiPosition,
        workloadFit: "Medium — one changed condition.",
        source: "model" as const,
      },
    ],
    plan: {
      evidenceShift: {
        from:
          project.task.currentEvidence ||
          "Finished product or performance alone",
        toward:
          "Finished work plus selected evidence of framing, checking and adaptation",
      },
      feedbackPattern:
        "Feedback is used at each selected moment to change what happens next.",
      implementationNotes: [
        "Use the moments inside the existing task rather than adding a parallel assessment.",
      ],
      cautions: [
        "This plan supports professional judgement; it does not prove capability.",
      ],
      useTomorrowSummary:
        "Add one opening frame, one discipline-grounded check and one changed-condition response.",
    },
  } satisfies VisibleThinkingProject;
}

export function TaskScreen() {
  const searchParams = useSearchParams();
  const source = (searchParams.get("source") || "blank") as ProjectSource;
  const initial = useMemo(
    () => (source === "blank" ? blankProject() : projectFromFixture(source)),
    [source],
  );
  const [project, setProject] = useState(initial);

  const updateTask = <K extends keyof VisibleThinkingProject["task"]>(
    key: K,
    value: VisibleThinkingProject["task"][K],
  ) =>
    setProject((current) => ({
      ...current,
      task: { ...current.task, [key]: value },
    }));

  const canContinue =
    project.task.description.trim().length >= 30 &&
    project.task.intendedCapability.trim().length >= 15;

  const continueToDiagnosis = () => {
    const ready = saveProject({
      ...makeGenericDesign(project),
      status: "clarifying",
      generation: createGenerationState(),
    });
    window.location.href = `/design/${ready.id}/diagnose`;
  };

  return (
    <AppShell
      eyebrow="Bring one real task"
      stage={1}
      title="Start with the work as it is."
    >
      <div className="guidance-banner">
        <strong>Use task-design information only.</strong>
        Do not enter learner names, contact details or identifiable records.
      </div>

      <div className="form-card">
        <div className="field-row two-column">
          <label>
            <span>Task title</span>
            <input
              maxLength={120}
              onChange={(event) => updateTask("title", event.target.value)}
              placeholder="e.g. Prepare a flat white during service"
              value={project.task.title}
            />
          </label>
          <label>
            <span>Learning setting</span>
            <select
              onChange={(event) =>
                updateTask(
                  "learningSetting",
                  event.target.value as LearningSetting,
                )
              }
              value={project.task.learningSetting}
            >
              <option value="vocational-trades">Vocational / trades</option>
              <option value="foundation-bridging">
                Foundation / bridging
              </option>
              <option value="professional-applied">
                Professional / applied
              </option>
              <option value="academic-degree">Academic / degree</option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>

        <label>
          <span>Describe the task</span>
          <small>What will the learner actually do?</small>
          <textarea
            maxLength={4000}
            onChange={(event) => updateTask("description", event.target.value)}
            placeholder="Paste the current instructions or describe the activity."
            rows={6}
            value={project.task.description}
          />
          <em>{project.task.description.length} / 4000</em>
        </label>

        <label>
          <span>What capability is this intended to develop?</span>
          <small>
            Name what the learner should understand, judge, perform, adapt or
            take responsibility for.
          </small>
          <textarea
            maxLength={1200}
            onChange={(event) =>
              updateTask("intendedCapability", event.target.value)
            }
            placeholder="Describe the consequential capability—not only the output."
            rows={3}
            value={project.task.intendedCapability}
          />
        </label>

        <div className="field-row two-column">
          <label>
            <span>What currently counts as evidence?</span>
            <textarea
              maxLength={800}
              onChange={(event) =>
                updateTask("currentEvidence", event.target.value)
              }
              placeholder="Optional, but useful"
              rows={3}
              value={project.task.currentEvidence}
            />
          </label>
          <label>
            <span>Assessment stakes</span>
            <select
              onChange={(event) =>
                updateTask(
                  "assessmentStakes",
                  event.target.value as AssessmentStakes,
                )
              }
              value={project.task.assessmentStakes}
            >
              <option value="learning-activity">Learning activity</option>
              <option value="formative">Formative assessment</option>
              <option value="summative">Summative assessment</option>
              <option value="workplace-practical">
                Workplace / practical observation
              </option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>

        <label>
          <span>Learner and context notes</span>
          <small>
            Include readiness, existing supports and constraints—never personal
            or identifying information.
          </small>
          <textarea
            maxLength={1200}
            onChange={(event) =>
              updateTask("learnerContextNotes", event.target.value)
            }
            rows={3}
            value={project.task.learnerContextNotes}
          />
        </label>

        <fieldset className="choice-field">
          <legend>
            Should the plan consider where AI belongs in the learner activity?
          </legend>
          <label className="inline-choice">
            <input
              checked={project.task.considerLearnerAi}
              onChange={(event) => {
                updateTask("considerLearnerAi", event.target.checked);
                updateTask(
                  "defaultAiPosition",
                  event.target.checked ? "help-me-decide" : "not-considered",
                );
              }}
              type="checkbox"
            />
            <span>
              Yes, make learner AI use an explicit design decision.
            </span>
          </label>

          {project.task.considerLearnerAi ? (
            <label className="nested-select">
              <span>Default learner-AI position</span>
              <select
                onChange={(event) =>
                  updateTask(
                    "defaultAiPosition",
                    event.target.value as AiPosition,
                  )
                }
                value={project.task.defaultAiPosition}
              >
                <option value="absent">Absent</option>
                <option value="available-with-boundaries">
                  Available with boundaries
                </option>
                <option value="deliberately-examined">
                  Deliberately used and examined
                </option>
                <option value="help-me-decide">Help me decide</option>
              </select>
            </label>
          ) : null}
        </fieldset>
      </div>

      <div className="action-row">
        <LinkButton href="/">Back</LinkButton>
        <button
          className="button primary"
          disabled={!canContinue}
          onClick={continueToDiagnosis}
          type="button"
        >
          Clarify this task <span aria-hidden="true">→</span>
        </button>
      </div>
    </AppShell>
  );
}

function LinkButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a className="button secondary" href={href}>
      {children}
    </a>
  );
}

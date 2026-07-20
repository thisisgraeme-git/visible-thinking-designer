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
  CapabilityDimension,
  EstimatedReadiness,
  LearningSetting,
  ProjectSource,
  UnderpinningDemand,
  VisibleThinkingProject,
} from "@/lib/types";

const capabilityDimensions: Array<{
  value: CapabilityDimension;
  label: string;
}> = [
  { value: "know", label: "Know" },
  { value: "do", label: "Do" },
  { value: "be-relate", label: "Be & Relate" },
];

const underpinningDemands: Array<{
  value: UnderpinningDemand;
  label: string;
}> = [
  { value: "technical-domain", label: "Technical / domain" },
  { value: "language-literacy", label: "Language & literacy" },
  { value: "numeracy", label: "Numeracy" },
  { value: "cultural-relational", label: "Cultural & relational" },
];

const capabilityStarter =
  "By the end of this task, learners should know…, be able to…, and demonstrate…";

function makeGenericDesign(project: VisibleThinkingProject) {
  if (project.diagnosis && project.moments.length > 0) return project;
  const aiPosition = project.task.considerLearnerAi
    ? project.task.defaultAiPosition
    : "not-relevant";
  const firstMomentId = crypto.randomUUID();
  const checkMomentId = crypto.randomUUID();
  const applyMomentId = crypto.randomUUID();
  return {
    ...project,
    diagnosis: {
      capabilitySummary: project.task.intendedCapability,
      capabilityLensNotes: (project.task.capabilityDimensions ?? []).map(
        (dimension) =>
          `${dimension === "be-relate" ? "Be & Relate" : dimension[0].toUpperCase() + dimension.slice(1)} is relevant to the intended capability.`,
      ),
      taskDemandNotes: (project.task.underpinningDemands ?? []).map(
        (demand) =>
          `${demand.replaceAll("-", " / ")} should be made explicit only where it changes support or evidence.`,
      ),
      culturalRelationalConsiderations: project.task.culturalRelationalContext
        ? [project.task.culturalRelationalContext]
        : [],
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
        project.task.estimatedReadiness === "ready-independently"
          ? "The tutor estimates learners are ready to attempt independently; use support responsively rather than by default."
          : project.task.estimatedReadiness === "not-yet-ready"
            ? "The tutor estimates learners are not yet ready; stage the attempt and preserve a later independent performance."
            : project.task.estimatedReadiness === "mixed-across-group"
              ? "Readiness is mixed across the group; make support adjustable without turning the estimate into a learner label."
              : "Support should be calibrated to the tutor's current readiness estimate.",
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
        id: firstMomentId,
        title: "Name the first approach",
        timing: "Before substantial assistance",
        purpose: "Surface the learner’s initial framing and plan.",
        journeyPhase: "before-task",
        conditions: ["attempt", "question"] as const,
        evidencePurposes: ["learning", "diagnosis"] as const,
        evidenceModes: ["live-explanation"] as const,
        learnerAction:
          "State the proposed approach, one important uncertainty and the first check they will use.",
        tutorMove:
          "Ask one focused question that tests the plan without prescribing it.",
        supportBoundary: {
          tutorMay:
            "Ask one focused question that tests the plan without prescribing it.",
          learnerResponsibility:
            "Frame the approach, name the uncertainty and choose the first check.",
        },
        visibleEvidence:
          "A context-aware starting point that the learner can revisit.",
        weakOrMissingEvidence:
          "A generic plan disconnected from the actual task.",
        feedbackLoop:
          "The first attempt provides feedback; the learner identifies what should change next.",
        feedbackUptake:
          "The learner revises the first approach or confirms it with a task-grounded reason.",
        exampleInContext: `For ${project.task.title || "this task"}, the learner names the first decision they will make and the signal they will check.`,
        aiPosition,
        retention: {
          level: "observe-and-use",
          note: "Use the response in the moment; no separate record is required.",
        },
        workload: {
          estimatedTime: "About 30–60 seconds",
          frequency: "Once before substantial assistance",
          recordingBurden: "None",
          activityRelationship: "embedded",
        },
        source: "model" as const,
      },
      {
        id: checkMomentId,
        title: "Check a consequential decision",
        timing: "At the first meaningful decision point",
        purpose: "Make discipline-grounded checking visible.",
        journeyPhase: "during-task",
        conditions: ["check", "explain-judgement"] as const,
        evidencePurposes: ["feedback", "judgement"] as const,
        evidenceModes: ["live-explanation", "tutor-observation"] as const,
        learnerAction:
          "Use relevant evidence, standards or task signals to defend or revise one decision.",
        tutorMove:
          "Ask: “What would make you change this decision?”",
        supportBoundary: {
          tutorMay:
            "Ask what evidence or task signal would change the decision.",
          learnerResponsibility:
            "Use the relevant standard or signal to defend or revise the decision.",
        },
        visibleEvidence:
          "A judgement connected to the real standards and behaviour of the task.",
        weakOrMissingEvidence:
          "A claim of confidence without a relevant check.",
        feedbackLoop:
          "The check or follow-up question changes the learner’s next action.",
        feedbackUptake:
          "The learner revises the decision or confirms it against the relevant check.",
        exampleInContext: `During ${project.task.title || "the task"}, the tutor samples one consequential decision and asks what evidence would reverse it.`,
        aiPosition,
        retention: {
          level: "observe-and-use",
          note: "Sample the decision without creating a parallel record.",
        },
        workload: {
          estimatedTime: "Embedded; about 1–2 minutes",
          frequency: "Sample one decision, not every step",
          recordingBurden: "None unless the task already requires a note",
          activityRelationship: "embedded",
        },
        source: "model" as const,
      },
      {
        id: applyMomentId,
        title: "Adapt under a changed condition",
        timing: "After initial feedback",
        purpose: "Reveal transfer rather than repetition.",
        journeyPhase: "changed-context",
        conditions: ["apply"] as const,
        evidencePurposes: ["feedback", "judgement", "verification"] as const,
        evidenceModes: ["changed-context-application"] as const,
        learnerAction:
          "Adapt the approach when one authentic constraint, audience need or piece of evidence changes.",
        tutorMove:
          "Introduce one proportionate change and ask what should be preserved.",
        supportBoundary: {
          tutorMay:
            "Introduce the single changed condition and ask what should remain stable.",
          learnerResponsibility:
            "Adapt the approach while preserving the intended capability and task standard.",
        },
        visibleEvidence:
          "An adaptation that remains aligned with the intended capability.",
        weakOrMissingEvidence:
          "Repeating the original response despite the changed condition.",
        feedbackLoop:
          "The changed outcome becomes feedback for the learner’s final refinement.",
        feedbackUptake:
          "The learner makes one final refinement and explains what the variation changed.",
        exampleInContext: `Repeat one part of ${project.task.title || "the task"} after changing an authentic constraint, then ask what the learner preserved and changed.`,
        aiPosition,
        retention: {
          level: "observe-and-use",
          note: "Use the changed application in the tutor’s judgement without extra capture.",
        },
        workload: {
          estimatedTime: "About 2–5 minutes",
          frequency: "One changed condition",
          recordingBurden: "No additional record planned",
          activityRelationship: "embedded",
        },
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
      evidencePatternRationale:
        "The pattern connects initial framing, one consequential check and one changed-context application so the learner’s decisions become visible without documenting every step.",
      feedbackPattern:
        "Feedback is used at each selected moment to change what happens next.",
      changedCondition: {
        momentId: applyMomentId,
        changes:
          "One authentic constraint, audience need or piece of evidence changes.",
        remainsConstant:
          "The intended capability, core task standard and learner responsibility remain constant.",
        rationale:
          "The single variation reveals whether the learner can adapt rather than repeat the original response.",
      },
      integrityWarnings: [],
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

  const toggleCapabilityDimension = (value: CapabilityDimension) => {
    const selected = project.task.capabilityDimensions ?? [];
    updateTask(
      "capabilityDimensions",
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    );
  };

  const toggleUnderpinningDemand = (value: UnderpinningDemand) => {
    const selected = project.task.underpinningDemands ?? [];
    updateTask(
      "underpinningDemands",
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    );
  };

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
            <span>Setting or context</span>
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

        <div className="field-group">
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
          <button
            className="sentence-starter"
            onClick={() => {
              if (!project.task.intendedCapability.trim()) {
                updateTask("intendedCapability", capabilityStarter);
              }
            }}
            type="button"
          >
            Use the optional sentence starter
          </button>
          <small className="sentence-starter-copy">{capabilityStarter}</small>
        </div>

        <div className="lens-layout">
          <fieldset className="choice-field lens-field">
            <legend>Capability dimensions</legend>
            <small>Choose any that help. These are lenses, not measures.</small>
            <div className="choice-grid three-up">
              {capabilityDimensions.map((option) => (
                <label className="chip-choice" key={option.value}>
                  <input
                    checked={(project.task.capabilityDimensions ?? []).includes(
                      option.value,
                    )}
                    onChange={() => toggleCapabilityDimension(option.value)}
                    type="checkbox"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
            <label className="inline-choice help-choice">
              <input
                checked={
                  project.task.helpIdentifyCapabilityDimensions ?? false
                }
                onChange={(event) =>
                  updateTask(
                    "helpIdentifyCapabilityDimensions",
                    event.target.checked,
                  )
                }
                type="checkbox"
              />
              <span>Help me identify this</span>
            </label>
          </fieldset>

          <fieldset className="choice-field lens-field">
            <legend>Underpinning demands</legend>
            <small>Select only demands that matter in this task.</small>
            <div className="choice-grid">
              {underpinningDemands.map((option) => (
                <label className="chip-choice" key={option.value}>
                  <input
                    checked={(project.task.underpinningDemands ?? []).includes(
                      option.value,
                    )}
                    onChange={() => toggleUnderpinningDemand(option.value)}
                    type="checkbox"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
            <label className="inline-choice help-choice">
              <input
                checked={project.task.helpIdentifyUnderpinningDemands ?? false}
                onChange={(event) =>
                  updateTask(
                    "helpIdentifyUnderpinningDemands",
                    event.target.checked,
                  )
                }
                type="checkbox"
              />
              <span>Help me identify this</span>
            </label>
          </fieldset>
        </div>

        <div className="field-row two-column">
          <label>
            <span>What currently counts as evidence?</span>
            <small>
              What is presently treated as evidence that the learner has
              completed the task or demonstrated the capability? This might be
              an assessment submission, finished product, observed performance,
              explanation, record or workplace outcome.
            </small>
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
          <div className="field-group">
            <label>
              <span>Stakes and consequences</span>
              <select
                onChange={(event) =>
                  updateTask(
                    "assessmentStakes",
                    event.target.value as AssessmentStakes,
                  )
                }
                value={project.task.assessmentStakes}
              >
                <option value="low-stakes-practice">Low-stakes practice</option>
                <option value="moderate-stakes-checkpoint">
                  Moderate-stakes checkpoint
                </option>
                <option value="high-stakes-final">
                  High-stakes or final performance
                </option>
                <option value="not-sure">Not sure</option>
              </select>
            </label>
            <div className="flag-stack">
              <label className="inline-choice">
                <input
                  checked={project.task.safetyCritical ?? false}
                  onChange={(event) =>
                    updateTask("safetyCritical", event.target.checked)
                  }
                  type="checkbox"
                />
                <span>Safety-critical</span>
              </label>
              <label className="inline-choice">
                <input
                  checked={
                    project.task.regulatedOrComplianceSensitive ?? false
                  }
                  onChange={(event) =>
                    updateTask(
                      "regulatedOrComplianceSensitive",
                      event.target.checked,
                    )
                  }
                  type="checkbox"
                />
                <span>Regulated or compliance-sensitive</span>
              </label>
            </div>
          </div>
        </div>

        <label>
          <span>Estimated readiness</span>
          <small>
            A tutor estimate for instructional design—not a learner diagnosis.
          </small>
          <select
            onChange={(event) =>
              updateTask(
                "estimatedReadiness",
                event.target.value as EstimatedReadiness,
              )
            }
            value={project.task.estimatedReadiness ?? "not-sure"}
          >
            <option value="ready-independently">
              Ready to attempt independently
            </option>
            <option value="ready-with-support">Ready with some support</option>
            <option value="not-yet-ready">Not yet ready</option>
            <option value="mixed-across-group">Mixed across the group</option>
            <option value="not-sure">Not sure</option>
          </select>
        </label>

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

        <label>
          <span>Cultural and relational intelligence</span>
          <small>
            Whose knowledge, language, values, responsibilities and ways of
            relating matter in this context?
          </small>
          <textarea
            maxLength={1200}
            onChange={(event) =>
              updateTask("culturalRelationalContext", event.target.value)
            }
            placeholder="Optional. Include only what is grounded in this task and context."
            rows={3}
            value={project.task.culturalRelationalContext ?? ""}
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

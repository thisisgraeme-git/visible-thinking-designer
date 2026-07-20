"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "./app-shell";
import { blankProject, projectFromFixture } from "@/lib/fixtures";
import {
  getSessionAttachment,
  removeSessionAttachment,
  setSessionAttachment,
} from "@/lib/client-attachments";
import {
  attachmentMetadata,
  FILE_ACCEPT,
  FILE_UPLOAD_MAX_LABEL,
  formatFileSize,
  validateFileMetadata,
} from "@/lib/file-intake";
import { createGenerationState } from "@/lib/model-state";
import { loadProject, saveProject } from "@/lib/storage";
import {
  getTaskDescriptionLimitMessage,
  TASK_DESCRIPTION_MAX,
} from "@/lib/task-input";
import {
  getSubstantiveTaskChanges,
  isLegacyUntitledTitle,
} from "@/lib/task-editing";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const source = (searchParams.get("source") || "blank") as ProjectSource;
  const projectId = searchParams.get("projectId");
  const returnTo = searchParams.get("return") === "home" ? "/" : "plan";
  const initial = useMemo(
    () => (source === "blank" ? blankProject() : projectFromFixture(source)),
    [source],
  );
  const [project, setProject] = useState(initial);
  const [original, setOriginal] = useState<VisibleThinkingProject>();
  const [submitted, setSubmitted] = useState(false);
  const [fileError, setFileError] = useState("");
  const [showChangeConfirmation, setShowChangeConfirmation] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!projectId) return;
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const stored = loadProject(projectId);
      if (stored) {
        setProject(stored);
        setOriginal(structuredClone(stored));
      }
    });
    return () => {
      active = false;
    };
  }, [projectId]);

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

  const titleMissing = !project.task.title.trim();
  const legacyUntitled = isLegacyUntitledTitle(project.task.title);
  const showTitleError = legacyUntitled || (submitted && titleMissing);
  const descriptionMissing = !project.task.description.trim();
  const descriptionTooShort =
    !descriptionMissing && project.task.description.trim().length < 30;
  const capabilityTooShort =
    project.task.intendedCapability.trim().length < 15;
  const canContinue =
    !titleMissing &&
    !legacyUntitled &&
    project.task.description.trim().length >= 30 &&
    project.task.description.length <= TASK_DESCRIPTION_MAX &&
    project.task.intendedCapability.trim().length >= 15;
  const descriptionLimitMessage = getTaskDescriptionLimitMessage(
    project.task.description,
  );

  const attachmentChanged =
    JSON.stringify(original?.sourceAttachment) !==
    JSON.stringify(project.sourceAttachment);
  const substantiveChanges = original
    ? [
        ...getSubstantiveTaskChanges(original.task, project.task),
        ...(attachmentChanged ? ["supporting source material"] : []),
      ]
    : [];
  const hasDownstreamDesign = Boolean(
    original?.diagnosis || (original?.moments.length ?? 0) > 0,
  );

  const routeAfterTitleOnlySave = (ready: VisibleThinkingProject) => {
    router.push(
      returnTo === "/" ? "/" : `/design/${ready.id}/${returnTo}`,
    );
  };

  const saveAndRegenerate = () => {
    const base = original ? project : makeGenericDesign(project);
    const ready = saveProject({
      ...base,
      status: "clarifying",
      designState:
        original && substantiveChanges.length > 0
          ? { stale: true, changedFields: substantiveChanges }
          : undefined,
      clarification: {
        sourceDigest: attachmentChanged
          ? undefined
          : project.clarification.sourceDigest,
        questions: [],
        completed: false,
      },
      generation: createGenerationState(),
    });
    router.push(`/design/${ready.id}/diagnose`);
  };

  const saveWithoutRegenerating = () => {
    const ready = saveProject({
      ...project,
      designState: {
        stale: true,
        changedFields: substantiveChanges,
      },
    });
    routeAfterTitleOnlySave(ready);
  };

  const continueToDiagnosis = () => {
    setSubmitted(true);
    if (!canContinue) return;
    if (original && substantiveChanges.length === 0) {
      routeAfterTitleOnlySave(saveProject(project));
      return;
    }
    if (original && hasDownstreamDesign) {
      setShowChangeConfirmation(true);
      return;
    }
    saveAndRegenerate();
  };

  const selectFile = (file?: File) => {
    if (!file) return;
    const validation = validateFileMetadata(file);
    if (validation) {
      setFileError(validation.message);
      return;
    }
    setFileError("");
    setSessionAttachment(project.id, file);
    setProject((current) => ({
      ...current,
      sourceAttachment: attachmentMetadata(file),
      clarification: {
        ...current.clarification,
        sourceDigest: undefined,
      },
    }));
  };

  const removeFile = () => {
    removeSessionAttachment(project.id);
    setFileError("");
    setProject((current) => ({
      ...current,
      sourceAttachment: undefined,
      clarification: {
        ...current.clarification,
        sourceDigest: undefined,
      },
    }));
    if (fileInput.current) fileInput.current.value = "";
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
              aria-describedby={
                showTitleError ? "task-title-error" : undefined
              }
              aria-invalid={showTitleError ? true : undefined}
              maxLength={120}
              onChange={(event) => updateTask("title", event.target.value)}
              placeholder="e.g. Prepare a flat white during service"
              value={project.task.title}
            />
            {showTitleError ? (
              <span className="field-error" id="task-title-error" role="alert">
                {legacyUntitled
                  ? "Name this task before continuing. The existing draft has been preserved."
                  : "Enter a task name before continuing."}
              </span>
            ) : null}
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
          <span>Describe the core task</span>
          <small>
            Describe what learners are being asked to do in one to four
            sentences. You can also attach the worksheet, assessment
            instructions, template or a photograph of the task.
          </small>
          <textarea
            aria-describedby={
              descriptionLimitMessage ||
              (submitted && (descriptionMissing || descriptionTooShort))
                ? "task-description-limit"
                : undefined
            }
            aria-invalid={
              descriptionLimitMessage ||
              (submitted && (descriptionMissing || descriptionTooShort))
                ? true
                : undefined
            }
            onChange={(event) => updateTask("description", event.target.value)}
            placeholder="Paste the current instructions or describe the activity."
            rows={6}
            value={project.task.description}
          />
          <em>
            {project.task.description.length.toLocaleString("en-NZ")} /{" "}
            {TASK_DESCRIPTION_MAX.toLocaleString("en-NZ")}
          </em>
          {descriptionLimitMessage ||
          (submitted && (descriptionMissing || descriptionTooShort)) ? (
            <span
              className="field-error"
              id="task-description-limit"
              role="alert"
            >
              {descriptionMissing
                ? "Describe the core learner task before continuing."
                : descriptionTooShort
                  ? "Add enough detail to make the learner action clear."
                  : descriptionLimitMessage}
            </span>
          ) : null}
        </label>

        <div className="field-group attachment-field">
          <div>
            <span className="field-label">Supporting source material</span>
            <small>
              Optional · one PDF, DOC, DOCX, JPG, JPEG or PNG · up to{" "}
              {FILE_UPLOAD_MAX_LABEL}
            </small>
          </div>
          <div
            className="file-drop"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              selectFile(event.dataTransfer.files[0]);
            }}
          >
            <input
              accept={FILE_ACCEPT}
              aria-label="Attach supporting source material"
              onChange={(event) => selectFile(event.target.files?.[0])}
              ref={fileInput}
              type="file"
            />
            <p>
              Drop one file here, or <strong>choose a file</strong>
            </p>
          </div>
          {project.sourceAttachment ? (
            <div className="attachment-summary">
              <div>
                <strong>{project.sourceAttachment.filename}</strong>
                <span>
                  {project.sourceAttachment.fileType} ·{" "}
                  {formatFileSize(project.sourceAttachment.size)}
                </span>
                {project.sourceAttachment.processed &&
                !getSessionAttachment(project.id) ? (
                  <small>
                    Processed context is available. The attachment itself was
                    not retained.
                  </small>
                ) : null}
              </div>
              <div>
                <button
                  className="toolbar-button"
                  onClick={() => fileInput.current?.click()}
                  type="button"
                >
                  Replace
                </button>
                <button
                  className="toolbar-button"
                  onClick={removeFile}
                  type="button"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : null}
          {fileError ? (
            <span className="field-error" role="alert">
              {fileError}
            </span>
          ) : null}
          <p className="privacy-warning">
            Do not upload learner names, identifying information or
            confidential records.
          </p>
        </div>

        <div className="field-group">
          <label>
            <span>What capability is this intended to develop?</span>
            <small>
              Name what the learner should understand, judge, perform, adapt or
              take responsibility for.
            </small>
            <textarea
              aria-describedby={
                submitted && capabilityTooShort
                  ? "task-capability-error"
                  : undefined
              }
              aria-invalid={
                submitted && capabilityTooShort ? true : undefined
              }
              maxLength={1200}
              onChange={(event) =>
                updateTask("intendedCapability", event.target.value)
              }
              placeholder="Describe the consequential capability—not only the output."
              rows={3}
              value={project.task.intendedCapability}
            />
            {submitted && capabilityTooShort ? (
              <span
                className="field-error"
                id="task-capability-error"
                role="alert"
              >
                Describe the intended capability before continuing.
              </span>
            ) : null}
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

      {showChangeConfirmation ? (
        <section className="change-confirmation" role="alert">
          <p>
            <strong>Review before applying these changes.</strong>
            These changes may affect the current design. Regenerate the design
            focus and moments to apply them.
          </p>
          <p>
            The existing plan will remain available until you explicitly
            replace it.
          </p>
          <div>
            <button
              className="button secondary"
              onClick={saveWithoutRegenerating}
              type="button"
            >
              Save without regenerating
            </button>
            <button
              className="button primary"
              onClick={saveAndRegenerate}
              type="button"
            >
              Regenerate design focus and moments
            </button>
          </div>
        </section>
      ) : null}

      <div className="action-row">
        <LinkButton
          href={
            original && returnTo !== "/"
              ? `/design/${project.id}/${returnTo}`
              : "/"
          }
        >
          Back
        </LinkButton>
        <button
          className="button primary"
          onClick={continueToDiagnosis}
          type="button"
        >
          {original ? "Save task details" : "Clarify this task"}{" "}
          <span aria-hidden="true">→</span>
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

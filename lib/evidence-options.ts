import type {
  ActivityRelationship,
  AiPosition,
  EvidenceMode,
  EvidencePurpose,
  EvidenceRetention,
  JourneyPhase,
} from "./types";

export const evidencePurposeLabels: Record<EvidencePurpose, string> = {
  learning: "Learning",
  diagnosis: "Diagnosis",
  feedback: "Feedback",
  judgement: "Judgement",
  verification: "Verification",
};

export const evidenceModeLabels: Record<EvidenceMode, string> = {
  "produced-artefact": "Produced artefact",
  "tutor-observation": "Tutor observation",
  "practical-performance": "Practical performance",
  "live-explanation": "Live explanation",
  "professional-conversation": "Professional conversation",
  "changed-context-application": "Changed-context application",
  "feedback-led-revision": "Feedback-led revision",
};

export const journeyPhaseLabels: Record<JourneyPhase, string> = {
  "before-task": "Before the task",
  "early-attempt": "Early attempt",
  "during-task": "During the task",
  "after-feedback": "After feedback",
  "changed-context": "Changed context",
};

export const journeyPhaseOrder: Record<JourneyPhase, number> = {
  "before-task": 0,
  "early-attempt": 1,
  "during-task": 2,
  "after-feedback": 3,
  "changed-context": 4,
};

export const retentionLabels: Record<EvidenceRetention, string> = {
  "observe-and-use": "Observe and use",
  "brief-note": "Briefly note",
  "formal-record": "Formally retain",
};

export const activityRelationshipLabels: Record<ActivityRelationship, string> = {
  embedded: "Embedded in existing activity",
  replaces: "Replaces existing activity",
  adds: "Adds activity",
};

export const aiPositionLabels: Record<AiPosition, string> = {
  "not-considered": "Not considered",
  absent: "Absent",
  "available-with-boundaries": "Available with boundaries",
  "deliberately-examined": "Deliberately examined",
  "help-me-decide": "Help me decide",
  "not-relevant": "Not relevant",
};

export const evidencePurposes = Object.keys(
  evidencePurposeLabels,
) as EvidencePurpose[];

export const evidenceModes = Object.keys(evidenceModeLabels) as EvidenceMode[];

export const journeyPhases = Object.keys(journeyPhaseLabels) as JourneyPhase[];

export const retentionLevels = Object.keys(
  retentionLabels,
) as EvidenceRetention[];

export const activityRelationships = Object.keys(
  activityRelationshipLabels,
) as ActivityRelationship[];

export const aiPositions = Object.keys(aiPositionLabels) as AiPosition[];

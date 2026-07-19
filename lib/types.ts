export type ProjectStatus =
  | "draft"
  | "clarifying"
  | "diagnosed"
  | "designing"
  | "planned";

export type ProjectSource =
  | "blank"
  | "flat-white"
  | "dissatisfied-client"
  | "short-report";

export type LearningSetting =
  | "vocational-trades"
  | "foundation-bridging"
  | "professional-applied"
  | "academic-degree"
  | "other";

export type AssessmentStakes =
  | "learning-activity"
  | "formative"
  | "summative"
  | "workplace-practical"
  | "other";

export type VisibleCondition =
  | "attempt"
  | "question"
  | "check"
  | "explain-judgement"
  | "apply";

export type AiPosition =
  | "not-considered"
  | "absent"
  | "available-with-boundaries"
  | "deliberately-examined"
  | "help-me-decide"
  | "not-relevant";

export interface ClarificationQuestion {
  id: string;
  question: string;
  whyItMatters: string;
  answer?: string;
  skipped: boolean;
}

export interface TaskDiagnosis {
  capabilitySummary: string;
  currentEvidenceReveals: string[];
  currentTaskStrengths: string[];
  invisibleThinking: string[];
  contextConstraints: string[];
  readinessAndScaffolding: string[];
  designOpportunity: string;
  aiSubstitutionRisks: string[];
  cautions: string[];
  tutorConfirmed: boolean;
}

export interface VisibleThinkingMoment {
  id: string;
  title: string;
  timing: string;
  purpose: string;
  conditions: VisibleCondition[];
  learnerAction: string;
  tutorMove: string;
  visibleEvidence: string;
  weakOrMissingEvidence: string;
  feedbackLoop: string;
  aiPosition: AiPosition;
  workloadFit: string;
  caution?: string;
  source: "model" | "tutor";
}

export interface VisibleThinkingProject {
  schemaVersion: "0.1";
  id: string;
  source: ProjectSource;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  task: {
    title: string;
    description: string;
    intendedCapability: string;
    learningSetting: LearningSetting;
    learnerContextNotes?: string;
    currentEvidence?: string;
    assessmentStakes: AssessmentStakes;
    considerLearnerAi: boolean;
    defaultAiPosition: AiPosition;
  };
  clarification: {
    taskReflection?: string;
    questions: ClarificationQuestion[];
    completed: boolean;
  };
  diagnosis?: TaskDiagnosis;
  moments: VisibleThinkingMoment[];
  plan: {
    evidenceShift?: {
      from: string;
      toward: string;
    };
    feedbackPattern?: string;
    implementationNotes: string[];
    cautions: string[];
    useTomorrowSummary?: string;
  };
}

export interface ScenarioFixture {
  source: Exclude<ProjectSource, "blank">;
  eyebrow: string;
  title: string;
  summary: string;
  project: Omit<
    VisibleThinkingProject,
    "id" | "createdAt" | "updatedAt" | "status"
  >;
}

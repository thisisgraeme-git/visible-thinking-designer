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
  | "low-stakes-practice"
  | "moderate-stakes-checkpoint"
  | "high-stakes-final"
  | "not-sure"
  | "learning-activity"
  | "formative"
  | "summative"
  | "workplace-practical"
  | "other";

export type CapabilityDimension = "know" | "do" | "be-relate";

export type UnderpinningDemand =
  | "technical-domain"
  | "language-literacy"
  | "numeracy"
  | "cultural-relational";

export type EstimatedReadiness =
  | "ready-independently"
  | "ready-with-support"
  | "not-yet-ready"
  | "mixed-across-group"
  | "not-sure";

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
  capabilityLensNotes: string[];
  taskDemandNotes: string[];
  culturalRelationalConsiderations: string[];
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
  exampleInContext: string;
  aiPosition: AiPosition;
  workloadFit: string;
  caution?: string;
  source: "model" | "tutor";
}

export type GenerationStatus =
  | "idle"
  | "loading"
  | "succeeded"
  | "failed"
  | "fallback";

export interface GenerationError {
  code:
    | "configuration_error"
    | "invalid_request"
    | "model_refusal"
    | "schema_error"
    | "rate_limited"
    | "service_unavailable"
    | "unknown_error";
  message: string;
  retryable: boolean;
}

export interface GenerationStage {
  status: GenerationStatus;
  error?: GenerationError;
}

export interface ProjectGeneration {
  promptVersion: string;
  model?: string;
  clarify: GenerationStage;
  diagnose: GenerationStage;
  moments: GenerationStage;
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
    capabilityDimensions?: CapabilityDimension[];
    helpIdentifyCapabilityDimensions?: boolean;
    underpinningDemands?: UnderpinningDemand[];
    helpIdentifyUnderpinningDemands?: boolean;
    learningSetting: LearningSetting;
    learnerContextNotes?: string;
    culturalRelationalContext?: string;
    currentEvidence?: string;
    assessmentStakes: AssessmentStakes;
    safetyCritical?: boolean;
    regulatedOrComplianceSensitive?: boolean;
    estimatedReadiness?: EstimatedReadiness;
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
  generation?: ProjectGeneration;
}

export interface ClarifyOutput {
  taskReflection: string;
  questions: Array<{
    id: string;
    question: string;
    whyItMatters: string;
  }>;
}

export type DiagnosisOutput = Omit<TaskDiagnosis, "tutorConfirmed">;

export interface MomentsOutput {
  evidenceShift: {
    from: string;
    toward: string;
  };
  feedbackPattern: string;
  moments: VisibleThinkingMoment[];
  implementationNotes: string[];
  cautions: string[];
  useTomorrowSummary: string;
}

export type ModelStage = "clarify" | "diagnose" | "moments";

export interface ModelSuccess<T> {
  ok: true;
  data: T;
  meta: {
    model: string;
    promptVersion: string;
  };
}

export interface ModelFailure {
  ok: false;
  error: GenerationError;
}

export type ModelResult<T> = ModelSuccess<T> | ModelFailure;

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

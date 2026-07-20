import { z } from "zod";

export const visibleConditionSchema = z.enum([
  "attempt",
  "question",
  "check",
  "explain-judgement",
  "apply",
]);

export const aiPositionSchema = z.enum([
  "not-considered",
  "absent",
  "available-with-boundaries",
  "deliberately-examined",
  "help-me-decide",
  "not-relevant",
]);

export const evidencePurposeSchema = z.enum([
  "learning",
  "diagnosis",
  "feedback",
  "judgement",
  "verification",
]);

export const evidenceModeSchema = z.enum([
  "produced-artefact",
  "tutor-observation",
  "practical-performance",
  "live-explanation",
  "professional-conversation",
  "changed-context-application",
  "feedback-led-revision",
]);

export const journeyPhaseSchema = z.enum([
  "before-task",
  "early-attempt",
  "during-task",
  "after-feedback",
  "changed-context",
]);

export const evidenceRetentionSchema = z.enum([
  "observe-and-use",
  "brief-note",
  "formal-record",
]);

export const activityRelationshipSchema = z.enum([
  "embedded",
  "replaces",
  "adds",
]);

export const taskSchema = z
  .object({
    title: z.string().max(120),
    description: z.string().min(30).max(4000),
    intendedCapability: z.string().min(15).max(1200),
    capabilityDimensions: z
      .array(z.enum(["know", "do", "be-relate"]))
      .max(3)
      .default([]),
    helpIdentifyCapabilityDimensions: z.boolean().default(false),
    underpinningDemands: z
      .array(
        z.enum([
          "technical-domain",
          "language-literacy",
          "numeracy",
          "cultural-relational",
        ]),
      )
      .max(4)
      .default([]),
    helpIdentifyUnderpinningDemands: z.boolean().default(false),
    learningSetting: z.enum([
      "vocational-trades",
      "foundation-bridging",
      "professional-applied",
      "academic-degree",
      "other",
    ]),
    learnerContextNotes: z.string().max(1200).optional(),
    culturalRelationalContext: z.string().max(1200).optional(),
    currentEvidence: z.string().max(800).optional(),
    assessmentStakes: z.enum([
      "low-stakes-practice",
      "moderate-stakes-checkpoint",
      "high-stakes-final",
      "not-sure",
      "learning-activity",
      "formative",
      "summative",
      "workplace-practical",
      "other",
    ]),
    safetyCritical: z.boolean().default(false),
    regulatedOrComplianceSensitive: z.boolean().default(false),
    estimatedReadiness: z
      .enum([
        "ready-independently",
        "ready-with-support",
        "not-yet-ready",
        "mixed-across-group",
        "not-sure",
      ])
      .default("not-sure"),
    considerLearnerAi: z.boolean(),
    defaultAiPosition: aiPositionSchema,
  })
  .strict();

export const clarifyRequestSchema = z
  .object({
    source: z.enum([
      "blank",
      "flat-white",
      "dissatisfied-client",
      "short-report",
    ]),
    task: taskSchema,
  })
  .strict();

export const clarifyOutputSchema = z
  .object({
    taskSummary: z.string().min(20).max(500),
    questions: z
      .array(
        z
          .object({
            id: z.string().min(2).max(80),
            question: z.string().min(10).max(300),
            whyItMatters: z.string().min(10).max(400),
          })
          .strict(),
      )
      .max(3),
  })
  .strict();

const clarificationQuestionSchema = z
  .object({
    id: z.string().max(80),
    question: z.string().max(300),
    whyItMatters: z.string().max(400),
    answer: z.string().max(1200).optional(),
    skipped: z.boolean(),
  })
  .strict();

export const diagnoseRequestSchema = z
  .object({
    task: taskSchema,
    clarification: z
      .object({
        taskSummary: z.string().max(500).optional(),
        taskReflection: z.string().max(700).optional(),
        questions: z.array(clarificationQuestionSchema).max(3),
        completed: z.boolean(),
      })
      .strict(),
  })
  .strict();

export const diagnosisOutputSchema = z
  .object({
    capabilitySummary: z.string().min(20).max(900),
    capabilityLensNotes: z.array(z.string().min(5).max(350)).max(4),
    taskDemandNotes: z.array(z.string().min(5).max(350)).max(5),
    culturalRelationalConsiderations: z
      .array(z.string().min(5).max(350))
      .max(4),
    currentEvidenceReveals: z.array(z.string().min(5).max(350)).min(1).max(5),
    currentTaskStrengths: z.array(z.string().min(5).max(350)).min(1).max(5),
    invisibleThinking: z.array(z.string().min(5).max(350)).min(2).max(7),
    contextConstraints: z.array(z.string().min(5).max(350)).max(5),
    readinessAndScaffolding: z.array(z.string().min(5).max(350)).max(5),
    designOpportunity: z.string().min(20).max(900),
    aiSubstitutionRisks: z.array(z.string().min(5).max(400)).max(4),
    cautions: z.array(z.string().min(5).max(400)).min(1).max(5),
  })
  .strict();

export const diagnosisSchema = diagnosisOutputSchema
  .extend({ tutorConfirmed: z.boolean() })
  .strict();

export const momentSchema = z
  .object({
    id: z.string().min(2).max(80),
    title: z.string().min(3).max(160),
    timing: z.string().min(5).max(280),
    purpose: z.string().min(10).max(500),
    journeyPhase: journeyPhaseSchema,
    conditions: z.array(visibleConditionSchema).min(1).max(3),
    evidencePurposes: z.array(evidencePurposeSchema).min(1).max(3),
    evidenceModes: z.array(evidenceModeSchema).min(1).max(3),
    learnerAction: z.string().min(10).max(700),
    tutorMove: z.string().min(10).max(700),
    supportBoundary: z
      .object({
        tutorMay: z.string().min(5).max(500),
        learnerResponsibility: z.string().min(5).max(500),
      })
      .strict(),
    visibleEvidence: z.string().min(10).max(700),
    weakOrMissingEvidence: z.string().min(10).max(700),
    feedbackLoop: z.string().min(10).max(700),
    feedbackUptake: z.string().min(10).max(700),
    exampleInContext: z.string().min(10).max(500),
    aiPosition: aiPositionSchema,
    retention: z
      .object({
        level: evidenceRetentionSchema,
        note: z.string().min(3).max(400),
      })
      .strict(),
    workload: z
      .object({
        estimatedTime: z.string().min(2).max(120),
        frequency: z.string().min(3).max(180),
        recordingBurden: z.string().min(3).max(220),
        activityRelationship: activityRelationshipSchema,
      })
      .strict(),
    caution: z.string().max(400),
    source: z.literal("model"),
  })
  .strict();

export const momentsRequestSchema = z
  .object({
    task: taskSchema,
    diagnosis: diagnosisSchema,
  })
  .strict();

export const momentsOutputSchema = z
  .object({
    evidenceShift: z
      .object({
        from: z.string().min(5).max(500),
        toward: z.string().min(5).max(600),
      })
      .strict(),
    evidencePatternRationale: z.string().min(20).max(900),
    feedbackPattern: z.string().min(10).max(700),
    changedCondition: z
      .object({
        momentId: z.string().min(2).max(80),
        changes: z.string().min(5).max(400),
        remainsConstant: z.string().min(5).max(400),
        rationale: z.string().min(10).max(500),
      })
      .strict(),
    integrityWarnings: z
      .array(
        z
          .object({
            code: z.enum([
              "fragmentation",
              "support-overreach",
              "capability-drift",
              "capture-burden",
              "changed-condition",
              "verification-gap",
              "text-heavy-evidence",
            ]),
            message: z.string().min(10).max(450),
            momentIds: z.array(z.string().min(2).max(80)).max(5),
            source: z.literal("model"),
          })
          .strict(),
      )
      .max(5),
    moments: z.array(momentSchema).min(3).max(5),
    implementationNotes: z.array(z.string().min(5).max(450)).min(1).max(5),
    cautions: z.array(z.string().min(5).max(450)).min(1).max(5),
    useTomorrowSummary: z.string().min(10).max(700),
  })
  .strict();

export type ClarifyRequest = z.infer<typeof clarifyRequestSchema>;
export type DiagnoseRequest = z.infer<typeof diagnoseRequestSchema>;
export type MomentsRequest = z.infer<typeof momentsRequestSchema>;

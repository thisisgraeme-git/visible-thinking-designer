import type {
  AiPosition,
  ScenarioFixture,
  VisibleThinkingMoment,
  VisibleThinkingProject,
} from "./types";

const moment = (
  id: string,
  title: string,
  timing: string,
  purpose: string,
  conditions: VisibleThinkingMoment["conditions"],
  learnerAction: string,
  tutorMove: string,
  visibleEvidence: string,
  weakOrMissingEvidence: string,
  feedbackLoop: string,
  workloadFit: string,
  aiPosition: AiPosition = "not-relevant",
  caution?: string,
): VisibleThinkingMoment => ({
  id,
  title,
  timing,
  purpose,
  conditions,
  learnerAction,
  tutorMove,
  visibleEvidence,
  weakOrMissingEvidence,
  feedbackLoop,
  exampleInContext: `For example, ${learnerAction.charAt(0).toLowerCase()}${learnerAction.slice(1)}`,
  aiPosition,
  workloadFit,
  caution,
  source: "model",
});

export const scenarioFixtures: ScenarioFixture[] = [
  {
    source: "flat-white",
    eyebrow: "Practical performance",
    title: "Flat white under pressure",
    summary:
      "Make sequencing, sensory checking and adaptation visible during a busy café service.",
    project: {
      schemaVersion: "0.1",
      source: "flat-white",
      task: {
        title: "Prepare a flat white during a busy café service",
        description:
          "Prepare and serve a flat white to workplace standard while managing the flow of other orders during a busy café service.",
        intendedCapability:
          "Produce a consistent drink while managing workflow, diagnosing quality problems and adapting under service pressure.",
        capabilityDimensions: ["know", "do", "be-relate"],
        helpIdentifyCapabilityDimensions: false,
        underpinningDemands: ["technical-domain", "numeracy"],
        helpIdentifyUnderpinningDemands: false,
        learningSetting: "vocational-trades",
        learnerContextNotes:
          "Learners have practised espresso extraction and milk texturing separately. The design should support developing confidence without removing responsibility for quality decisions.",
        currentEvidence:
          "The finished beverage and the tutor’s general observation of performance.",
        assessmentStakes: "moderate-stakes-checkpoint",
        safetyCritical: true,
        regulatedOrComplianceSensitive: false,
        estimatedReadiness: "ready-with-support",
        culturalRelationalContext:
          "Workplace service standards, customer expectations and respectful coordination with colleagues matter during the task.",
        considerLearnerAi: false,
        defaultAiPosition: "absent",
      },
      clarification: {
        taskReflection:
          "A practical service task where the finished drink matters, but the strongest evidence sits in how the learner sequences, checks and adapts.",
        questions: [
          {
            id: "fw-q1",
            question:
              "Which decisions should the learner be able to make without tutor prompting?",
            whyItMatters:
              "This sets the boundary between useful scaffolding and consequential learner responsibility.",
            skipped: false,
          },
          {
            id: "fw-q2",
            question:
              "What workplace signals can the learner use to judge drink quality in the moment?",
            whyItMatters:
              "Checking should be grounded in the product, equipment and service context.",
            skipped: false,
          },
        ],
        completed: false,
      },
      diagnosis: {
        capabilitySummary:
          "Coordinate production, judge quality and adapt workflow while maintaining a consistent café-standard result.",
        capabilityLensNotes: [
          "Know the café standard and the product signals that indicate quality.",
          "Do the coordinated technical performance under authentic service pressure.",
          "Be & Relate through responsible service and coordination with customers and colleagues.",
        ],
        taskDemandNotes: [
          "Technical and domain demands include extraction, milk texture, timing and equipment use.",
          "Numeracy matters through quantities, time and interpreting service parameters.",
        ],
        culturalRelationalConsiderations: [
          "Customer expectations and team responsibilities shape what counts as an appropriate service response.",
        ],
        currentEvidenceReveals: [
          "Whether the final beverage meets a visible quality standard",
          "Some aspects of pace and equipment handling",
        ],
        currentTaskStrengths: [
          "Authentic workplace pressure",
          "Immediate feedback from the product and equipment",
          "A clear standard that matters beyond the classroom",
        ],
        invisibleThinking: [
          "How the learner sequences competing demands",
          "Which sensory and technical signals they prioritise",
          "Why they adjust extraction, milk texture or timing",
          "How they adapt after an imperfect result",
        ],
        contextConstraints: [
          "Observation must not interrupt service",
          "Evidence capture must remain lighter than the task itself",
        ],
        readinessAndScaffolding: [
          "Prompting should reduce as routines stabilise",
          "Early attempts may use a short preparation cue",
        ],
        designOpportunity:
          "Embed three brief decision points in normal service so the tutor can see planning, checking and adaptation without turning performance into an oral exam.",
        aiSubstitutionRisks: [],
        cautions: [
          "Do not mistake confident explanation for competent performance",
          "Avoid recording every action",
        ],
        tutorConfirmed: false,
      },
      moments: [
        moment(
          "fw-m1",
          "Name the service plan",
          "Immediately before the order begins",
          "Surface sequencing and anticipated pressure points.",
          ["attempt", "question"],
          "Give a 20-second plan naming the order of operations and one likely point of risk.",
          "Ask: “What will you watch first if service pressure increases?”",
          "A workable sequence connected to equipment, customer and workflow constraints.",
          "A memorised procedure with no response to the actual service context.",
          "The tutor offers one cue only if the learner misses a safety or workflow constraint; the learner then restates the plan.",
          "Low — integrated into the service start.",
        ),
        moment(
          "fw-m2",
          "Read the product signals",
          "After extraction and before serving",
          "Make discipline-specific checking visible.",
          ["check", "explain-judgement"],
          "Use time, flow, crema, temperature and texture to decide whether to continue, adjust or remake.",
          "Ask one adaptive follow-up: “Which signal carried the most weight, and what would change your decision?”",
          "A decision tied to observable café-quality signals and trade-offs.",
          "A quality claim based only on appearance or tutor reassurance.",
          "The espresso, milk and tutor question provide feedback; the learner acts on it before service.",
          "Low — replaces a generic ‘looks good’ exchange.",
        ),
        moment(
          "fw-m3",
          "Adapt the next order",
          "On a changed follow-up order",
          "Reveal transfer under a meaningful change.",
          ["apply", "check"],
          "Adjust the workflow when the milk choice, order sequence or time pressure changes.",
          "Introduce one realistic change and observe what the learner preserves and alters.",
          "Adaptation that protects the required standard rather than simply repeating the previous routine.",
          "Repeating the same sequence when conditions now require a different decision.",
          "The result of the changed order becomes feedback; the learner names one change for the next attempt.",
          "Medium — use once, not on every order.",
        ),
      ],
      plan: {
        evidenceShift: {
          from: "Finished beverage plus general observation",
          toward:
            "Finished beverage plus selected evidence of planning, checking and adaptation",
        },
        feedbackPattern:
          "Product and tutor feedback are used immediately, then tested in the next changed order.",
        implementationNotes: [
          "Use the three moments during one authentic service window.",
          "Keep tutor prompts short enough that the task remains real.",
        ],
        cautions: [
          "This plan supports professional judgement; it does not prove capability by itself.",
          "Capture only the evidence that changes the tutor’s understanding.",
        ],
        useTomorrowSummary:
          "Add a 20-second service plan, one product-grounded judgement question and one changed follow-up order.",
      },
    },
  },
  {
    source: "dissatisfied-client",
    eyebrow: "Applied professional interaction",
    title: "A dissatisfied client",
    summary:
      "Reveal interpretation, emotional regulation and professional judgement inside a role-play.",
    project: {
      schemaVersion: "0.1",
      source: "dissatisfied-client",
      task: {
        title: "Respond to a dissatisfied client",
        description:
          "Respond to a dissatisfied client in a role-play, clarify the issue, propose an appropriate next action and complete a brief follow-up record.",
        intendedCapability:
          "Communicate professionally, interpret the issue, use policy and context, exercise judgement, adapt to the client response and document an appropriate next action.",
        capabilityDimensions: ["know", "do", "be-relate"],
        helpIdentifyCapabilityDimensions: false,
        underpinningDemands: [
          "technical-domain",
          "language-literacy",
          "cultural-relational",
        ],
        helpIdentifyUnderpinningDemands: false,
        learningSetting: "professional-applied",
        learnerContextNotes:
          "Learners know the service policy but have had limited practice managing emotionally charged conversations.",
        currentEvidence:
          "Completion of the role-play and the written follow-up record.",
        assessmentStakes: "low-stakes-practice",
        safetyCritical: false,
        regulatedOrComplianceSensitive: true,
        estimatedReadiness: "mixed-across-group",
        culturalRelationalContext:
          "The client’s language, expectations, values and preferred ways of relating should shape how the learner listens and responds within policy.",
        considerLearnerAi: true,
        defaultAiPosition: "available-with-boundaries",
      },
      clarification: {
        taskReflection:
          "A relational task where professional judgement is distributed across listening, policy checking, response selection and adaptation.",
        questions: [
          {
            id: "dc-q1",
            question:
              "Which policy boundary must the learner recognise without escalating immediately?",
            whyItMatters:
              "The strongest judgement moment depends on where discretion ends.",
            skipped: false,
          },
          {
            id: "dc-q2",
            question:
              "What change in the client’s response should require the learner to adapt?",
            whyItMatters:
              "A changed condition makes relational judgement observable.",
            skipped: false,
          },
        ],
        completed: false,
      },
      diagnosis: {
        capabilitySummary:
          "Interpret a client concern, regulate the interaction, use policy proportionately and adapt toward an appropriate resolution.",
        capabilityLensNotes: [
          "Know the service policy and scope of authority.",
          "Do the live interpretation, response and documentation work.",
          "Be & Relate through respect, emotional regulation and accountable professional judgement.",
        ],
        taskDemandNotes: [
          "Language and literacy demands include listening, clarifying and documenting the outcome.",
          "Cultural and relational demands shape how concern, respect and resolution are interpreted.",
          "Technical and domain demands include applying policy without hiding behind it.",
        ],
        culturalRelationalConsiderations: [
          "The learner should adapt to the client’s language and relational cues without treating one communication style as the professional norm.",
        ],
        currentEvidenceReveals: [
          "Whether the learner completes the interaction",
          "The surface professionalism of the follow-up record",
        ],
        currentTaskStrengths: [
          "Authentic relational pressure",
          "Opportunity to connect spoken judgement with documentation",
        ],
        invisibleThinking: [
          "How the learner interprets the real concern",
          "Which options they reject and why",
          "How emotional signals affect their next move",
          "Where policy constrains or enables discretion",
        ],
        contextConstraints: [
          "The role-play should remain psychologically safe",
          "Policy detail should be available for checking",
        ],
        readinessAndScaffolding: [
          "A brief pause point can support novices",
          "Experienced learners should respond without scripted language",
        ],
        designOpportunity:
          "Use one pause, one adaptive client response and one documentation check to expose judgement without over-scripting the conversation.",
        aiSubstitutionRisks: [
          "AI may generate polished scripts that conceal whether the learner can listen and adapt live",
        ],
        cautions: [
          "Do not assess emotional style as a proxy for professionalism",
          "Keep client details fictional and non-identifying",
        ],
        tutorConfirmed: false,
      },
      moments: [
        moment(
          "dc-m1",
          "Interpret before responding",
          "After the client’s opening concern",
          "Surface what the learner thinks the real issue is.",
          ["question", "explain-judgement"],
          "Ask one clarifying question, then briefly state the issue they believe needs resolving.",
          "Pause the role-play and ask: “What did you hear beneath the first request?”",
          "Interpretation grounded in the client’s words, tone and relevant context.",
          "A generic apology followed by an assumed solution.",
          "The client confirms, corrects or complicates the interpretation; the learner adapts the next response.",
          "Medium — one brief pause in the role-play.",
          "available-with-boundaries",
        ),
        moment(
          "dc-m2",
          "Check the response boundary",
          "Before committing to a resolution",
          "Connect judgement to policy and scope of authority.",
          ["check", "explain-judgement"],
          "Identify the relevant policy boundary and choose whether to act, offer options or escalate.",
          "Ask: “What can you decide here, and what must be checked?”",
          "A proportionate action linked to policy, client need and role authority.",
          "Quoting policy without connecting it to the situation.",
          "Policy and tutor follow-up provide feedback; the learner revises the proposed response if needed.",
          "Low — uses the normal policy check.",
          "available-with-boundaries",
        ),
        moment(
          "dc-m3",
          "Respond to a changed client signal",
          "When the client rejects the first option",
          "Reveal relational adaptation under pressure.",
          ["apply", "question"],
          "Adjust language, option or escalation path while preserving the professional boundary.",
          "Introduce a realistic refusal or new constraint.",
          "A changed response that addresses the new signal without abandoning policy or respect.",
          "Repeating the original script more forcefully.",
          "The client response shows whether the adaptation worked; the learner records what changed and why.",
          "Medium — one planned branch per role-play.",
          "not-relevant",
        ),
      ],
      plan: {
        evidenceShift: {
          from: "Completed role-play and polished follow-up",
          toward:
            "Selected evidence of interpretation, policy-grounded judgement and live adaptation",
        },
        feedbackPattern:
          "Client response, policy and tutor follow-up each change the learner’s next decision.",
        implementationNotes: [
          "Use fictional client information only.",
          "Brief the role-player on one planned change, not a fixed script.",
        ],
        cautions: [
          "The plan does not authenticate authorship or automate assessment.",
          "Judge the professional decision, not personality or confidence.",
        ],
        useTomorrowSummary:
          "Add one interpretation pause, one policy-boundary check and one changed client response.",
      },
    },
  },
  {
    source: "short-report",
    eyebrow: "Academic synthesis",
    title: "Workplace wellbeing report",
    summary:
      "Make framing, source selection, synthesis and revision visible around a short report.",
    project: {
      schemaVersion: "0.1",
      source: "short-report",
      task: {
        title: "Compare approaches to workplace wellbeing",
        description:
          "Write a short report comparing two approaches to improving workplace wellbeing and make an evidence-based recommendation.",
        intendedCapability:
          "Frame a problem, select and evaluate evidence, organise and synthesise ideas, explain judgement and revise a recommendation.",
        capabilityDimensions: ["know", "do"],
        helpIdentifyCapabilityDimensions: false,
        underpinningDemands: ["technical-domain", "language-literacy"],
        helpIdentifyUnderpinningDemands: false,
        learningSetting: "academic-degree",
        learnerContextNotes:
          "Learners have access to a curated reading set and may use generative AI for brainstorming and language support within declared boundaries.",
        currentEvidence: "The submitted polished report.",
        assessmentStakes: "high-stakes-final",
        safetyCritical: false,
        regulatedOrComplianceSensitive: false,
        estimatedReadiness: "ready-independently",
        culturalRelationalContext:
          "The report should identify whose definitions of wellbeing and workplace responsibilities shape the comparison.",
        considerLearnerAi: true,
        defaultAiPosition: "deliberately-examined",
      },
      clarification: {
        taskReflection:
          "A synthesis task where a polished report can hide framing, evidence selection, trade-offs and response to feedback.",
        questions: [
          {
            id: "sr-q1",
            question:
              "What makes a source sufficiently credible and relevant in this discipline?",
            whyItMatters:
              "Checking must use domain-relevant criteria rather than generic critical-thinking language.",
            skipped: false,
          },
          {
            id: "sr-q2",
            question:
              "Which aspect of the recommendation should remain open to revision after feedback?",
            whyItMatters:
              "The feedback loop needs a consequential decision, not cosmetic editing.",
            skipped: false,
          },
          {
            id: "sr-q3",
            question:
              "What AI use is permitted, and what intellectual work must remain visible?",
            whyItMatters:
              "The design should support the declared AI position without treating AI use as misconduct.",
            skipped: false,
          },
        ],
        completed: false,
      },
      diagnosis: {
        capabilitySummary:
          "Build and revise an evidence-based comparison that leads to a defensible contextual recommendation.",
        capabilityLensNotes: [
          "Know the relevant wellbeing approaches and disciplinary criteria for evidence.",
          "Do the framing, source evaluation, synthesis and revision work.",
        ],
        taskDemandNotes: [
          "Language and literacy demands include synthesis, comparison and a defensible recommendation.",
          "Technical and domain demands include judging source credibility and contextual relevance.",
        ],
        culturalRelationalConsiderations: [
          "Definitions of wellbeing and responsibility should be located in the workplace and knowledge contexts represented by the sources.",
        ],
        currentEvidenceReveals: [
          "The final organisation and clarity of the report",
          "The sources and claims that remain in the submitted version",
        ],
        currentTaskStrengths: [
          "Requires comparison rather than description",
          "Ends in a consequential recommendation",
        ],
        invisibleThinking: [
          "How the learner framed the wellbeing problem",
          "Why sources were included, weighted or rejected",
          "How competing criteria shaped the recommendation",
          "What changed after critique",
        ],
        contextConstraints: [
          "Process evidence must remain proportionate to a short report",
          "AI use should be examined only where it affects judgement",
        ],
        readinessAndScaffolding: [
          "A comparison frame may support learners new to synthesis",
          "Source-check prompts should fade as disciplinary judgement develops",
        ],
        designOpportunity:
          "Capture a concise framing note, one source decision and one revised recommendation so the report remains central while the consequential thinking becomes visible.",
        aiSubstitutionRisks: [
          "AI can propose a fluent comparison before the learner has selected or weighed evidence",
          "AI-generated citations or claims may appear plausible without disciplinary checking",
        ],
        cautions: [
          "Do not require complete prompt histories",
          "Do not treat a polished explanation as proof of independent capability",
        ],
        tutorConfirmed: false,
      },
      moments: [
        moment(
          "sr-m1",
          "Frame the decision",
          "Before drafting",
          "Make the comparison purpose and criteria visible.",
          ["attempt", "question"],
          "Write a 100-word framing note naming the workplace context, decision and two comparison criteria.",
          "Ask one question that tests whether the criteria fit the context.",
          "A revisable frame that will guide evidence selection and comparison.",
          "A broad topic statement with no decision or contextual criteria.",
          "Tutor or peer feedback challenges one criterion; the learner keeps, replaces or refines it with a reason.",
          "Low — a short note that replaces unfocused pre-writing.",
          "deliberately-examined",
          "AI may suggest options, but the learner must select and justify the frame.",
        ),
        moment(
          "sr-m2",
          "Defend a source decision",
          "During evidence selection",
          "Ground checking in relevance, credibility and use.",
          ["check", "explain-judgement"],
          "Select one included and one rejected source, then explain the decision against disciplinary criteria.",
          "Ask: “What claim would become weaker if this source were removed?”",
          "A source decision tied to the report’s frame, claim and evidence standard.",
          "A credibility label with no connection to how the source will be used.",
          "The follow-up exposes a gap or confirms the choice; the learner updates the evidence set.",
          "Medium — sample two decisions, not the entire research trail.",
          "deliberately-examined",
          "AI output must be checked against the source itself.",
        ),
        moment(
          "sr-m3",
          "Revise the recommendation",
          "After targeted critique",
          "Reveal feedback use and evaluative judgement.",
          ["apply", "explain-judgement"],
          "Revise the recommendation for a changed organisational constraint and annotate what changed.",
          "Introduce a new constraint such as budget, workforce composition or implementation time.",
          "A revised recommendation that reweights evidence and acknowledges trade-offs.",
          "Surface editing that leaves the underlying recommendation unchanged.",
          "The changed constraint and critique become feedback; the learner explains the consequential revision.",
          "Medium — one changed condition and one annotation.",
          "available-with-boundaries",
        ),
      ],
      plan: {
        evidenceShift: {
          from: "Polished report as the main evidence",
          toward:
            "Report plus selected evidence of framing, source judgement and consequential revision",
        },
        feedbackPattern:
          "Feedback challenges the frame, evidence choice and recommendation; the learner’s response is visible in changed decisions.",
        implementationNotes: [
          "Keep process evidence to three short, high-value moments.",
          "Use the same disciplinary criteria in teaching and tutor follow-up.",
        ],
        cautions: [
          "Do not require full prompt histories or surveillance logs.",
          "Generated recommendations remain subject to educator judgement.",
        ],
        useTomorrowSummary:
          "Add a 100-word decision frame, sample one source decision and revise the recommendation under one changed constraint.",
      },
    },
  },
];

export const blankProject = (): VisibleThinkingProject => {
  const now = new Date().toISOString();
  return {
    schemaVersion: "0.1",
    id: crypto.randomUUID(),
    source: "blank",
    status: "draft",
    createdAt: now,
    updatedAt: now,
    task: {
      title: "",
      description: "",
      intendedCapability: "",
      capabilityDimensions: [],
      helpIdentifyCapabilityDimensions: false,
      underpinningDemands: [],
      helpIdentifyUnderpinningDemands: false,
      learningSetting: "vocational-trades",
      learnerContextNotes: "",
      culturalRelationalContext: "",
      currentEvidence: "",
      assessmentStakes: "not-sure",
      safetyCritical: false,
      regulatedOrComplianceSensitive: false,
      estimatedReadiness: "not-sure",
      considerLearnerAi: false,
      defaultAiPosition: "not-considered",
    },
    clarification: {
      questions: [
        {
          id: "blank-q1",
          question:
            "Which learner decision or judgement matters most in this task?",
          whyItMatters:
            "This helps focus the design on consequential thinking rather than documenting everything.",
          skipped: false,
        },
        {
          id: "blank-q2",
          question:
            "What can the current final product or performance already show reliably?",
          whyItMatters:
            "The redesign should recognise existing strengths before adding evidence.",
          skipped: false,
        },
      ],
      completed: false,
    },
    moments: [],
    plan: {
      implementationNotes: [],
      cautions: [
        "This plan supports professional judgement; it does not prove capability.",
      ],
    },
  };
};

export const projectFromFixture = (
  source: ScenarioFixture["source"],
): VisibleThinkingProject => {
  const fixture = scenarioFixtures.find((item) => item.source === source);
  if (!fixture) return blankProject();
  const now = new Date().toISOString();
  return structuredClone({
    ...fixture.project,
    id: crypto.randomUUID(),
    status: "draft",
    createdAt: now,
    updatedAt: now,
  });
};

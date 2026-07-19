# 04 — VISIBLE THINKING DESIGNER

## Staged Build Plan and Codex Handoff v0.1 — READY FOR STAGE 1

**Status:** APPROVED FOR STAGED BUILD  
**Current gate:** Stage 0 complete; implementation has not begun  
**Next authorised action:** Stage 1 — static end-to-end prototype only  
**Product:** Visible Thinking Designer  
**Primary audience:** Tutors in post-school tertiary education, with vocational and applied educators at the centre

---

## 1. Purpose of this handoff

This document translates the approved product proposition into a staged, testable web-app build.

It defines:

- the MVP boundary;
- the primary audience and product constraints;
- the four-screen workbench;
- the product state and structured model-output schemas;
- the prompt and API architecture;
- the visual design system;
- the three canonical demonstration scenarios;
- validation and evaluation requirements;
- stage gates for Codex implementation; and
- the evidence that must be preserved for the final Devpost submission.

This document governs implementation alongside:

1. **01 — Visible Thinking Designer — Research-to-Build Handoff**
2. **02 — Visible Thinking Designer — Present State Handoff — Working v0.1**
3. **03 — Visible Thinking Designer — Devpost Revision and Submission Notes — Working v0.1**

When documents appear to conflict:

- Doc 01 governs research fidelity and the Five Conditions.
- Doc 02 governs the founding proposition, larger living system and product boundaries.
- Doc 03 governs Devpost evidence and submission requirements.
- Doc 04 governs staged implementation.

Do not silently resolve a material conflict by expanding scope. Surface it.

---

## 2. Foundation proposition

Visible Thinking Designer is a tutor-facing, AI-assisted design partner that helps an educator redesign one real learning task so consequential learner thinking becomes visible, supportable and usable as evidence of capability.

The first form is a public web app shared by URL.

A tutor should be able to:

1. bring one real task;
2. clarify the capability the task is intended to develop;
3. diagnose what consequential thinking is currently invisible;
4. select and edit three to five visible-thinking moments; and
5. leave with an editable Visible Thinking Plan they could use tomorrow.

The system must preserve enough structured state for the tutor to refresh, return and refine the plan in the same browser.

### Core audience constraint

Design primarily for tutors working in post-high-school tertiary education.

Vocational and applied educators are the core audience. The app may also be useful in foundation, bridging, professional and degree-level contexts, but it must not drift into a generic K–12 lesson planner or student essay-writing tool.

Assume that users:

- are educationally capable but may not be technically confident;
- are time-constrained;
- work with diverse adult and young-adult learners;
- teach practical, workplace, relational and written tasks;
- already make some thinking visible through conversations and observation;
- do not want additional administrative burden;
- hold legitimate and varied positions on learner use of AI; and
- expect their professional judgement to remain primary.

---

## 3. MVP boundaries

### The MVP is

- tutor-facing;
- designed for post-school tertiary and vocational settings;
- focused on one task at a time;
- structured as a calm design interaction rather than an open chatbot;
- usable without an account;
- shareable as a public app URL;
- capable of local browser persistence;
- able to produce an editable and print-friendly plan;
- explicit about uncertainty and professional judgement; and
- designed to work whether learner-facing AI is absent, available or deliberately examined.

### The MVP is not

- a learner-facing tutor;
- an AI-detection product;
- an automated assessor;
- a surveillance or learner-profiling system;
- a qualification-mapping platform;
- a curriculum-management system;
- a comprehensive learning-management system;
- a collaborative multi-user platform;
- a file-ingestion platform;
- a validated assessment instrument; or
- a claim that learning or capability has been proven.

### Explicit deferrals

Do not add during Stages 1–4 unless separately authorised:

- authentication;
- external database persistence;
- shareable individual plan URLs;
- PDF or DOCX parsing;
- student accounts or student views;
- analytics dashboards;
- team collaboration;
- qualification or standards mapping;
- institutional branding controls;
- automated scoring;
- model fine-tuning; or
- extensive settings and preferences.

---

## 4. Product language

### Landing proposition

**Design learning that leaves thinking visible.**

For tutors in post-school tertiary and vocational education. Bring one real task. Leave with a plan you can use tomorrow.

Primary action: **Start with your task**  
Secondary action: **Explore an example**

### Central question

**What thinking needs to remain with the learner?**

### AI-positioning explanation

**This tool uses AI to support your design. You decide whether AI belongs in the learner activity.**

### Model-status language

Use language such as:

> The Five Conditions are research-informed design language, not a checklist or validated assessment model.

Avoid claims that the system verifies learning, authenticates authorship, eliminates AI misuse or guarantees capability.

---

## 5. Product workflow versus pedagogical model

The web app has a staged product workflow. The Five Conditions do not.

Never present Attempt → Question → Check → Explain Judgement → Apply as a compulsory five-step sequence.

The conditions are recursive design language. A task may use some and not others. A single visible-thinking moment may combine more than one condition. Feedback connects the moments by changing what happens next.

The four workbench screens are:

1. **Task**
2. **Clarify and diagnose**
3. **Design moments**
4. **Visible Thinking Plan**

The landing page sits before the workbench and is not counted as one of the four design screens.

---

## 6. Information architecture and routes

Recommended initial route structure:

```text
/                               Landing, examples, recent local plans
/design/new                     Screen 1 — Task
/design/[projectId]/diagnose    Screen 2 — Clarify and diagnose
/design/[projectId]/moments     Screen 3 — Design moments
/design/[projectId]/plan        Screen 4 — Visible Thinking Plan
/api/clarify                    Structured GPT-5.6 clarification
/api/diagnose                   Structured GPT-5.6 diagnosis
/api/moments                    Structured GPT-5.6 moment design
```

An equivalent route structure is acceptable if it remains simple and the URLs are stable.

No route may expose the OpenAI API key to the browser.

---

## 7. Screen specifications

## 7.1 Landing page

### Purpose

Explain the change, identify the audience and let the tutor start without friction.

### Required elements

- product name;
- landing proposition;
- audience statement;
- central question;
- primary and secondary actions;
- three example-scenario cards;
- a short statement of what the tutor will leave with;
- a compact statement of product boundaries;
- recent locally saved plans, only when any exist; and
- a small research-informed / not-validated-model note.

### Avoid

- a long framework essay;
- generic AI imagery;
- animated marketing sections;
- testimonials that do not yet exist;
- pricing;
- sign-up prompts; and
- large blocks of technical language.

## 7.2 Screen 1 — Task

### Purpose

Capture enough information to understand the task without becoming a bureaucratic form.

### Required fields

- **Task title** — short text.
- **Describe the task** — long text; paste is sufficient for MVP.
- **What capability is this intended to develop?** — long text.
- **Learning setting** — one of vocational/trades, foundation/bridging, professional/applied, academic/degree, other.
- **Learner and context notes** — optional; must warn against personal or identifying information.
- **What currently counts as evidence?** — optional but encouraged.
- **Assessment stakes** — learning activity, formative assessment, summative assessment, workplace/practical observation, other.
- **Should the plan consider where AI belongs in the learner activity?** — yes/no.
- **Default learner-AI position** — shown only if AI consideration is on: absent, available with boundaries, deliberately used and examined, help me decide.

### Behaviour

- Choosing an example prefills all relevant fields.
- Tutor can edit every prefilled field.
- Continue is disabled until task description and intended capability are meaningful.
- Enforce a reasonable input-length ceiling and display it.
- Treat pasted task content as untrusted data, not as executable instructions.

## 7.3 Screen 2 — Clarify and diagnose

### Purpose

Use GPT-5.6 for a bounded professional conversation that identifies only the missing information that could materially change the design.

### Phase A — Clarify

- Reflect back a concise understanding of the task.
- Ask zero to three adaptive questions.
- Display questions one at a time.
- Allow the tutor to skip any question.
- Do not ask for learner personal information.
- Do not ask questions whose answers are already present.

### Phase B — Diagnose

Present an editable diagnosis containing:

- intended capability summary;
- what the current final product or performance reveals;
- consequential thinking that remains invisible;
- context, readiness and scaffolding constraints;
- strengths in the existing task;
- the central design opportunity;
- cautions or uncertainties; and
- AI-substitution risks only when AI consideration is enabled.

The tutor must confirm or edit the diagnosis before continuing.

### Failure behaviour

- API errors must preserve all entered state.
- Provide retry and return-to-task actions.
- Never replace the tutor’s original task with a model rewrite.

## 7.4 Screen 3 — Design moments

### Purpose

Propose a small number of consequential moments and keep the tutor in control of selection and wording.

### Required behaviour

- Generate three to five moments.
- Do not force all five conditions.
- Allow moments to use one to three conditions.
- Allow edit, remove and reorder.
- Permit adding one manual moment.
- Show feedback as a loop, not a separate final step.
- Show workload fit.
- Show an AI position only when relevant.

### Each moment card contains

- title;
- timing or location in the task;
- purpose;
- conditions;
- learner action;
- tutor move or prompt;
- visible evidence;
- what failure or weak evidence might look like;
- feedback loop;
- AI position;
- workload fit; and
- an optional caution.

### Moment-quality test

For every moment, the app should be able to answer:

> What would failing this condition look like, and would the tutor be able to see it?

## 7.5 Screen 4 — Visible Thinking Plan

### Purpose

Turn confirmed, tutor-editable state into a coherent plan without another uncontrolled prose-generation step.

The plan should be rendered deterministically from confirmed structured state. A final model-polish call is not required for the MVP.

### Required sections

- task overview;
- intended capability;
- learner/context considerations;
- AI-position decision;
- current evidence;
- proposed evidence shift;
- three to five moment cards;
- feedback pattern;
- implementation notes;
- cautions and boundaries;
- use-this-tomorrow summary; and
- research-informed / professional-judgement note.

### Required actions

- edit task or diagnosis;
- edit moments;
- save locally;
- duplicate plan locally;
- restart cleanly;
- copy as Markdown;
- download as Markdown or JSON;
- print through a dedicated print stylesheet; and
- return to recent plans from the landing page.

PDF generation is not required. Browser print-to-PDF is sufficient.

---

## 8. Canonical demonstration scenarios

The three scenarios are fixtures, demonstration paths and evaluation cases. They must remain editable examples rather than privileged hard-coded outputs.

## 8.1 Practical performance — Flat white

**Task:** Prepare a flat white during a busy café service.

**Intended capability:** Produce a consistent drink while managing workflow, diagnosing quality problems and adapting under service pressure.

**Current evidence:** The finished beverage and general observation of performance.

**Likely invisible thinking:** sequencing, sensory checking, diagnosis, trade-offs, response to changing conditions and reasons for adjustment.

## 8.2 Applied professional interaction — Dissatisfied client

**Task:** Respond to a dissatisfied client in a role-play and complete a brief follow-up record.

**Intended capability:** Communicate professionally, clarify the issue, use relevant policy or context, exercise judgement, adapt to the client response and document an appropriate next action.

**Current evidence:** Role-play completion and written follow-up.

**Likely invisible thinking:** interpretation, question selection, emotional regulation, policy checking, rejected options, judgement and adaptation.

## 8.3 Academic synthesis — Short report

**Task:** Write a short report comparing two approaches to improving workplace wellbeing and make an evidence-based recommendation.

**Intended capability:** Frame a problem, select and evaluate evidence, organise and synthesise ideas, explain judgement and revise a recommendation.

**Current evidence:** The polished report.

**Likely invisible thinking:** framing, source selection, checking, organisation, synthesis, trade-offs, feedback use and revision.

---

## 9. Product-state schema

Use TypeScript and runtime validation. Zod is recommended unless the chosen OpenAI SDK provides an equally clear validated schema route.

Field names may change for implementation clarity, but the semantics must remain.

```ts
type ProjectStatus =
  | "draft"
  | "clarifying"
  | "diagnosed"
  | "designing"
  | "planned";

type ProjectSource =
  | "blank"
  | "flat-white"
  | "dissatisfied-client"
  | "short-report";

type LearningSetting =
  | "vocational-trades"
  | "foundation-bridging"
  | "professional-applied"
  | "academic-degree"
  | "other";

type AssessmentStakes =
  | "learning-activity"
  | "formative"
  | "summative"
  | "workplace-practical"
  | "other";

type VisibleCondition =
  | "attempt"
  | "question"
  | "check"
  | "explain-judgement"
  | "apply";

type AiPosition =
  | "not-considered"
  | "absent"
  | "available-with-boundaries"
  | "deliberately-examined"
  | "help-me-decide"
  | "not-relevant";

interface VisibleThinkingProject {
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

interface ClarificationQuestion {
  id: string;
  question: string;
  whyItMatters: string;
  answer?: string;
  skipped: boolean;
}

interface TaskDiagnosis {
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

interface VisibleThinkingMoment {
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
```

### Data-minimisation rule

The project stores task-design information, not learner records.

Do not create fields for learner names, contact information, demographic profiling, behavioural logs, grades or assessment decisions.

---

## 10. Structured model outputs

Use the OpenAI Responses API with GPT-5.6 and structured outputs.

Recommended default environment variables:

```text
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.6
```

The API key must remain server-side.

### Call 1 — Clarify

Input:

- confirmed task data;
- example source if applicable; and
- system design rules.

Output:

```ts
interface ClarifyOutput {
  taskReflection: string;
  questions: Array<{
    id: string;
    question: string;
    whyItMatters: string;
  }>;
}
```

Constraints:

- zero to three questions;
- no repeated questions;
- no requests for personally identifying information;
- concise language; and
- questions only when the answer could materially change the design.

### Call 2 — Diagnose

Input:

- task data;
- clarification questions and answers; and
- system design rules.

Output: `TaskDiagnosis` without `tutorConfirmed`.

Constraints:

- distinguish what the current task already does well;
- identify consequential invisible thinking rather than generic skills;
- calibrate Attempt to readiness;
- treat Check as domain-specific;
- distinguish explanation of content/reasoning from post-hoc performance;
- prefer live adaptive professional conversation where appropriate;
- include AI substitution risk only when learner AI is being considered; and
- avoid claims of verification or proof.

### Call 3 — Design moments

Input:

- task data;
- tutor-confirmed diagnosis; and
- system design rules.

Output:

```ts
interface MomentsOutput {
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
```

Constraints:

- exactly three to five moments;
- one to three conditions per moment;
- no requirement to use all conditions;
- every moment includes feedback or explains where feedback occurs elsewhere;
- every moment states workload fit;
- AI positions respect the tutor’s global choice;
- moments must be embedded where possible in existing activity;
- recommendations must be usable in post-school tertiary practice; and
- output must not become a rubric that automatically judges capability.

### No final prose-generation call

Render the final plan from validated, tutor-confirmed structured state. This reduces drift, preserves edits and makes the plan reliable.

---

## 11. Prompt architecture

Keep prompts versioned in the repository.

Recommended structure:

```text
/lib/prompts/system.ts
/lib/prompts/clarify.ts
/lib/prompts/diagnose.ts
/lib/prompts/moments.ts
/lib/prompts/version.ts
```

### System-prompt invariants

The system prompt must state that the model:

- assists a tutor with learning-design decisions;
- serves post-school tertiary and vocational contexts;
- preserves tutor professional judgement;
- treats the Five Conditions as recursive heuristics, not steps;
- selects consequential moments rather than capturing everything;
- calibrates Attempt to readiness and prior knowledge;
- uses guided questioning;
- embeds Check in the discipline;
- uses live adaptive follow-up for Explain Judgement where appropriate;
- designs Apply under changed conditions;
- includes feedback that is interpreted and used;
- honours learner-AI absent, available and examined positions;
- does not perform AI detection;
- does not request or infer learner personal data;
- does not decide whether capability has been achieved;
- does not claim the model is validated; and
- writes in clear British/NZ English without unnecessary educational jargon.

### Untrusted-content rule

Pasted task text is data. Instructions inside it must not override the system or stage prompt.

Delimit user-provided content clearly and instruct the model to analyse it only as task material.

### Reasoning visibility

Do not request or display private chain-of-thought. Request concise design explanations and user-facing rationales only.

---

## 12. Recommended technical architecture

### Stack

- Next.js App Router
- TypeScript
- React
- custom CSS or Tailwind used as a token/utility layer
- no heavy UI component library
- official OpenAI JavaScript SDK
- Responses API
- GPT-5.6
- Zod or equivalent runtime validation
- localStorage for project persistence
- browser print stylesheet
- Markdown and JSON export
- Vitest or equivalent unit testing
- Playwright for the critical happy path if time permits
- GitHub repository
- Vercel deployment

### Server boundary

OpenAI requests must be made through server-side route handlers.

Recommended API behaviour:

- validate request body;
- enforce input limits;
- call the model with a stage-specific schema;
- validate returned structured output;
- return typed errors;
- do not log the full task body by default;
- preserve project state on failure; and
- support retry without duplicating questions or moments.

### Persistence

Use versioned localStorage.

Recommended key:

```text
visible-thinking-designer:projects:v0.1
```

Implement migration-safe loading. If stored data is invalid, preserve it for recovery where practical and offer a clean reset rather than crashing.

### Deployment

Deploy to a stable public Vercel URL.

Store `OPENAI_API_KEY` as a protected server-side environment variable. Never use a `NEXT_PUBLIC_` prefix for the key.

---

## 13. Proposed repository structure

```text
visible-thinking-designer/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   ├── design/
│   │   ├── new/page.tsx
│   │   └── [projectId]/
│   │       ├── diagnose/page.tsx
│   │       ├── moments/page.tsx
│   │       └── plan/page.tsx
│   └── api/
│       ├── clarify/route.ts
│       ├── diagnose/route.ts
│       └── moments/route.ts
├── components/
│   ├── app-shell/
│   ├── forms/
│   ├── diagnosis/
│   ├── moments/
│   └── plan/
├── lib/
│   ├── examples.ts
│   ├── schemas.ts
│   ├── storage.ts
│   ├── export.ts
│   ├── openai.ts
│   └── prompts/
├── tests/
│   ├── fixtures/
│   ├── schemas.test.ts
│   ├── storage.test.ts
│   └── prompt-contracts.test.ts
├── public/
├── .env.example
├── README.md
└── package.json
```

Codex may adjust this structure when justified by the actual framework scaffold. Do not collapse clear domain boundaries merely to reduce file count.

---

## 14. Visual design system

### Intent

Minimal, elegant, editorial and architecturally inspired.

The product should feel like a calm design studio, not a corporate dashboard or generic AI chat interface.

### Initial tokens

```css
:root {
  --canvas: #f7f4ed;
  --surface: #fffefb;
  --ink: #102b46;
  --text: #344657;
  --muted: #6b7884;
  --teal: #0b6e73;
  --blue: #276c9a;
  --amber: #c87a2a;
  --green: #4f9664;
  --line: #d7dfe1;
  --line-strong: #aac0c4;
  --danger: #9f3f35;
  --radius-card: 18px;
  --radius-small: 10px;
  --content-max: 1180px;
}
```

These values are starting points, not an instruction to reproduce the territory-map image literally.

### Typography

- Serif display face for major headings.
- Quiet sans-serif for body, controls and labels.
- Prefer `next/font`.
- Avoid tiny captions and excessive uppercase.
- Use generous line height and strong hierarchy.

### Composition

- warm off-white canvas;
- large margins and negative space;
- fine rules;
- rounded white cards;
- restrained teal, blue and amber accents;
- minimal icon use;
- subtle orbital or cyclical motifs only where conceptually useful;
- a thin stage indicator rather than a heavy wizard component; and
- single primary action per screen.

### Avoid

- chat bubbles;
- AI sparkle icons;
- robots, brains and lightbulbs;
- glossy gradients;
- dashboard density;
- gamification;
- celebratory confetti;
- arbitrary illustrations; and
- motion that delays work.

### Accessibility

- keyboard-accessible controls;
- visible focus states;
- WCAG-appropriate contrast;
- semantic headings and landmarks;
- clear validation messages;
- reduced-motion support;
- readable print output; and
- responsive behaviour down to mobile, while optimising the workbench for laptop/desktop use.

---

## 15. Evaluation fixtures and contract tests

The three canonical scenarios must exist as typed fixtures and be used during every stage.

### Structured-output assertions

- Clarify returns no more than three questions.
- Diagnosis includes strengths as well as gaps.
- Moments returns three to five items.
- Each moment uses one to three conditions.
- The app does not force all five conditions.
- Feedback fields are non-empty.
- Workload-fit fields are non-empty.
- AI-off tasks do not receive learner-facing AI suggestions.
- No output claims to prove learning or authorship.
- No output recommends surveillance or AI detection.
- No output requests learner-identifying information.
- Explain Judgement prefers live adaptive follow-up when the task supports it.
- Check is expressed in the task’s domain rather than as generic critical thinking.
- Apply involves changed or authentic conditions rather than repetition alone.

### Product-quality rubric

For each scenario, evaluate:

1. **Usefulness:** Could a tutor use this tomorrow?
2. **Evidence clarity:** Is the consequential thinking genuinely more visible?
3. **Feasibility:** Does the design fit existing teaching rather than create disproportionate work?
4. **Research fidelity:** Are the Five Conditions used accurately and selectively?
5. **Professional judgement:** Does the tutor remain the decision-maker?
6. **AI positioning:** Is learner AI use treated as a design decision rather than a moral default?
7. **Boundary integrity:** Does the plan avoid surveillance, detection and automated assessment?
8. **Range:** Do the three scenarios produce meaningfully different designs?

### Minimum acceptance threshold

No stage is complete merely because the app runs. The relevant stage must pass its functional gate and the product-quality rubric must reveal no critical boundary violation.

---

## 16. Staged Codex execution plan

Codex must stop at each gate and provide:

- files changed;
- commands and tests run;
- screenshots or preview evidence where relevant;
- unresolved risks;
- build-evidence notes for Devpost; and
- a recommendation on whether to proceed.

Do not proceed to the next stage without user approval.

## Stage 1 — Static end-to-end prototype

### Build

- initialise repository and README;
- scaffold the Next.js TypeScript app;
- implement visual tokens and application shell;
- build landing page;
- build all four workbench screens;
- add the three typed scenario fixtures;
- add mock clarification, diagnosis and moment data;
- render an editable mock plan;
- implement local project creation and navigation;
- add initial local persistence;
- add print styling; and
- create the first preview deployment if credentials and repository access are available.

### Do not build in Stage 1

- OpenAI integration;
- final prompts;
- external database;
- accounts;
- file upload; or
- submission media.

### Gate 1

A user can traverse the entire experience using mock data for all three examples and reach a coherent plan. The product looks intentional, state survives normal navigation, and the Five Conditions are not presented as sequential steps.

## Stage 2 — GPT-5.6 core

### Build

- server-side OpenAI client;
- environment-variable contract;
- versioned prompts;
- structured schemas;
- clarify endpoint;
- diagnose endpoint;
- moments endpoint;
- loading, retry and typed error states;
- schema validation; and
- prompt-contract tests.

### Gate 2

All three scenarios produce schema-valid, meaningfully different results that pass the boundary assertions. User state survives API failure.

## Stage 3 — Tutor control, persistence and export

### Build

- diagnosis editing and confirmation;
- moment editing, removal and reorder;
- one manual moment;
- versioned localStorage;
- recent plans;
- duplicate and restart;
- Markdown and JSON export;
- print refinement; and
- deterministic final-plan rendering.

### Gate 3

Refreshing and reopening preserves the design. A tutor can change model suggestions and produce an export that reflects those changes exactly.

## Stage 4 — Evaluation and hardening

### Build/test

- run all fixture and contract tests;
- complete three manual scenario walkthroughs;
- test AI-consideration off;
- test skipped clarification questions;
- test long and weak task inputs;
- test malformed model output and retry;
- test localStorage corruption/reset;
- test keyboard flow, mobile layout and print;
- remove dead code and visual inconsistency; and
- capture actual challenges, changes and learning.

### Gate 4

The happy path is reliable, errors recover cleanly, boundaries hold and the output is demonstrably usable.

## Stage 5 — Submission evidence and release

### Complete

- production deployment;
- repository sharing;
- README setup and judge testing path;
- explicit explanation of Codex and GPT-5.6 use;
- `/feedback` session and Session ID;
- curated screenshots;
- 3:2 thumbnail;
- public YouTube demo under three minutes, targeting approximately 2:30;
- first-person contribution statement;
- Devpost copy revision;
- category and team verification; and
- final judge-perspective preview.

### Gate 5

Every item in Doc 03’s submission-specific Definition of Done is verified. No provisional marker remains. Only then is submission authorised.

---

## 17. README evidence requirements from the first commit

The README should evolve with the product rather than be reconstructed at the end.

Maintain:

- product proposition;
- intended audience;
- local setup;
- environment variables;
- development and test commands;
- architecture summary;
- model and API use;
- prompt/schema approach;
- persistence approach;
- ethical/product boundaries;
- canonical demo scenarios;
- staged build record;
- known limitations; and
- judge testing path.

Never commit real secrets or `.env.local`.

---

## 18. Build evidence log

At every stage, append concise notes covering:

- what changed;
- why it changed;
- what Codex contributed;
- how GPT-5.6 is being used;
- a failed or rejected approach;
- an implementation trade-off;
- what was tested;
- what remains uncertain; and
- any new material suitable for Devpost’s Challenges, Accomplishments or What we learned sections.

This can live in `docs/build-log.md` or an equivalent clearly named file.

---

## 19. Stage 1 Codex start instruction

Use the following as the initial execution instruction after this handoff is placed in the build workspace:

> Read Docs 01–04 before changing files. Implement Stage 1 only: a static, end-to-end Next.js TypeScript prototype using the approved visual language, four-screen workbench, three canonical scenario fixtures and mock structured data. Do not integrate OpenAI yet. Do not add authentication, database persistence or file upload. Create the repository structure, README and build-evidence log from the beginning. Verify the full mock journey for all three scenarios, run the relevant build/lint/tests, and stop at Gate 1 with screenshots, evidence and a concise handoff. Do not proceed to Stage 2 without explicit approval.

---

## 20. Re-entry state

### Decided

- public URL-based web app;
- post-school tertiary tutors as the primary audience;
- vocational and applied educators at the centre;
- minimalist architectural design;
- no-login MVP;
- local browser persistence;
- paste text rather than file upload;
- flat white, dissatisfied client and short report scenarios;
- GPT-5.6 through the Responses API;
- structured outputs;
- deterministic plan rendering;
- staged Codex build; and
- explicit approval between stages.

### Open only if implementation reveals a blocker

- exact Next.js package versions;
- exact font pair;
- exact field wording;
- whether Stage 1 includes a live preview deployment;
- whether drag-and-drop reorder is worth its complexity; and
- whether Markdown download alone is sufficient alongside print and JSON.

### Next move

Place Docs 01–04 in the Codex build context and issue the Stage 1 start instruction.

---

## 21. Definition of done for the MVP

Visible Thinking Designer is done for the hackathon when:

1. A tutor can open a public URL without creating an account.
2. They can start blank or choose one of three scenarios.
3. They can describe one real post-school tertiary learning task and intended capability.
4. GPT-5.6 asks no more than three purposeful clarification questions.
5. The tutor can confirm or edit a diagnosis of what thinking is currently invisible.
6. The app proposes three to five selective, research-faithful visible-thinking moments.
7. The tutor can edit, remove and reorder those moments.
8. The app produces an editable Visible Thinking Plan with feedback and explicit AI positioning where relevant.
9. The plan survives refresh and can be reopened in the same browser.
10. The plan can be copied, printed and downloaded.
11. The app does not request learner personal data, perform detection or claim to prove capability.
12. The three demonstration scenarios produce meaningfully different results.
13. The repository, README, tests, feedback Session ID, demo video and Devpost submission satisfy the final submission gate.

The central qualitative test remains:

> A tutor brings one real task, completes a purposeful interaction and leaves with a plan they could use tomorrow.


# Visible Thinking Designer build evidence log

## Stage 1 — Static end-to-end prototype

### Gate

Authorised by Graeme on 19 July 2026. Stage 2 remains unauthorised.

### What changed

- Initialised the local repository and Next.js TypeScript scaffold.
- Built the landing page and four workbench screens.
- Added three typed canonical scenario fixtures.
- Added deterministic mock clarification, diagnosis and moment structures.
- Added editable task, diagnosis, moment and implementation-note surfaces.
- Added moment reorder, removal and one manual tutor moment.
- Added versioned browser-local persistence, recent plans and duplication.
- Added responsive and print styling.
- Added source hierarchy, project documentation and contract checks.

### Why

Stage 1 must prove the complete tutor journey before model integration. The prototype therefore prioritises the path:

**Task → bounded clarification → editable diagnosis → selected moments → coherent plan**

### Codex contribution

Codex translated Docs 01–04 into the local architecture, typed fixture model, interface, interactions, validation checks and project documentation.

### GPT-5.6 use

None in Stage 1. All visible outputs are deterministic fixture or local mock data. GPT-5.6 integration belongs to Stage 2.

### Rejected approaches

- A generic chatbot interface was rejected because the product is a structured professional design interaction.
- A five-step framework wizard was rejected because the Five Conditions are recursive and selective.
- File upload, external persistence and model calls were rejected as Stage 1 scope expansion.
- Full process capture was rejected in favour of three to five consequential moments.

### Implementation trade-offs

- Browser-local persistence provides return and refinement without creating account or database scope.
- The final plan is rendered from structured state rather than generated as uncontrolled prose.
- The prototype supports one manual moment and button-based ordering; drag-and-drop remains an open implementation choice.
- Browser print-to-PDF is used instead of custom PDF generation.

### Tested

- Production build.
- TypeScript application type-check.
- Contract checks for all three canonical fixtures.
- Full mock journey for each scenario.
- Local persistence across navigation and page reload.
- Editing and reordering.
- Print-ready plan structure.
- Five Conditions presented as selectable labels rather than sequential stages.

### Captured evidence

- `docs/evidence/stage1-landing.png` — landing proposition, non-linear Five
  Conditions and three contrasting entry scenarios.
- `docs/evidence/stage1-flat-white-plan.png` — locally saved, editable plan
  produced by the practical-performance journey.
- `public/visible-thinking-designer-og.png` — stable social preview asset for
  the Stage 1 build.

### Current uncertainty

- Exact package versions and font pair can be revisited only if implementation reveals a reason.
- Model behaviour, schema repair and API failure recovery remain Stage 2 work.
- External educator feedback remains to be captured during later evaluation.

### Devpost evidence

- The prototype now provides a concrete before → interaction → after transformation.
- The three scenarios demonstrate range across practical, relational and written work.
- Product boundaries are visible in the interface.
- Stage 1 establishes a screenshot-ready happy path and an actual Visible Thinking Plan.

## Stage 2 — GPT-5.6 core

### Gate

Authorised by Graeme on 19 July 2026. Gate 2 passed on 19 July 2026 after all
three scenarios produced schema-valid, meaningfully different GPT-5.6 results
that satisfied the boundary assertions.

### What changed

- Added the official OpenAI JavaScript SDK and Responses API integration.
- Added versioned system, clarify, diagnose and moments prompts.
- Added strict Zod request and structured-output schemas.
- Added server-side clarify, diagnose and moments endpoints.
- Added loading, retry, typed error and local-draft recovery states.
- Preserved browser-local project state before, during and after API failure.
- Added prompt-contract and schema-contract tests across all three scenarios.

### Why

The model is used for bounded learning-design reasoning, while the tutor-edited
structured project remains authoritative. The final plan is still rendered
deterministically; there is no final prose-generation call.

### GPT-5.6 use

GPT-5.6 is configured to:

- ask zero to three material clarification questions;
- diagnose consequential invisible thinking without claiming proof;
- propose three to five selective visible-thinking moments; and
- respect workload, learner-AI position, data minimisation and professional
  judgement boundaries.

Task material is explicitly delimited as untrusted data. Requests use
`store: false`, and the application does not log full task bodies.

### Tested

- Production build and TypeScript compilation.
- Prompt and structured-output contracts for all three canonical scenarios.
- Boundary assertions for question and moment counts, selective Conditions,
  feedback loops, workload fit and differentiated scenario outputs.
- Runtime rejection of malformed requests.
- Runtime missing-key failure response and state-preserving fallback contract.
- Live GPT-5.6 clarify, diagnose and moments calls for all three scenarios.
- Flat white: two clarification questions and three moments.
- Dissatisfied client: three clarification questions and four moments.
- Short report: three clarification questions and three moments.
- Distinct selective Condition patterns across all three outputs.
- Hosted secret stored as a masked runtime value and never committed.

### Failed or rejected approaches

- The first live run surfaced `absent` as the moment-level AI position when the
  tutor had not asked the plan to consider learner AI. The prompt was tightened
  and a deterministic server boundary now enforces `not-relevant`, preventing
  “not considered” from becoming an inferred prohibition.
- An early evaluator regex incorrectly treated explicit cautions such as “do
  not use AI detection” as violations. It was replaced with a semantic
  assertion requiring safeguard or professional-judgement language while
  rejecting only affirmative automatic-proof claims.

### Gate 2 evidence

The machine-readable result is stored in
`docs/evidence/gate2-live-results.json`. It records counts, Condition patterns
and boundary outcomes without storing generated task content or secrets.

### Devpost evidence

- The implementation now demonstrates non-trivial, three-stage GPT-5.6 use
  behind a structured professional interaction.
- Prompt versioning, runtime validation, failure recovery and deterministic
  rendering are concrete technical decisions suitable for the submission.

## Stage 2.5A — Tutor Support and Capability-Lens Revision

### Gate

Authorised by Graeme on 20 July 2026. This revision is bounded to Stage 2.5A.
Stage 2.5B file intake and Stage 3 persistence/export remain unauthorised and
were not started.

### What changed

- Refined the landing and workbench copy for tertiary and vocational educators.
- Raised informative and interactive text to approximately 15px or larger while
  preserving the existing hierarchy and visual language.
- Added optional, editable and non-measured Know, Do and Be & Relate capability
  dimensions.
- Added optional technical/domain, language and literacy, numeracy, and
  cultural/relational task-demand lenses.
- Added “Help me identify this” support and the optional capability sentence
  starter.
- Added current-evidence guidance, four stakes settings, safety and regulation
  flags, and five tutor-estimated readiness settings.
- Added grounded cultural and relational context input using the consolidated
  review prompt.
- Extended the structured diagnosis with selective capability, task-demand and
  cultural/relational notes.
- Extended every Visible Thinking Moment with `exampleInContext`, rendered
  behind an editable “Show an example in context” disclosure.
- Moved the feedback principle above the moment cards and increased its visual
  prominence.
- Added deterministic boundaries for AI-off mode, tutor-estimated readiness and
  safety-critical evidence.

### GPT-5.6 use

Prompt version `vtd-2026-07-20.3` asks the model to suggest relevant missing
lenses during clarification when the tutor requests help or is unsure. Lenses
must remain selective and task-grounded; empty diagnosis arrays are preferable
to invented relevance. Stakes, readiness and safety shape clarification,
design focus, tutor moves and evidence. Safety-critical work must include
directly observed performance or task-result evidence.

### Tested

- Completed the blank-task journey in the browser with AI left off.
- Confirmed the clarification stage asked about regulation, readiness and
  relevant missing capability/task-demand lenses.
- Confirmed the design focus treated readiness as a tutor estimate, made the
  selected lenses visible, and required performance-grounded safety evidence.
- Confirmed task-specific examples are editable behind the requested disclosure
  and the feedback principle appears above the cards.
- Ran live GPT-5.6 clarify, diagnose and moments calls for the completed blank
  task and all three canonical demonstration scenarios.
- Each live scenario produced four moments with distinct selective Condition
  patterns.
- Ran a same-task comparison that changed stakes, readiness, selected lenses and
  the safety flag; the diagnosis and moment designs changed materially.
- Confirmed AI-off moments are deterministically `not-relevant`.
- Confirmed no capability-assurance or automated-assessment claims were
  introduced.
- Passed 19 static/contract tests, type-check and lint before the production
  build.

### Evidence

Machine-readable results are stored in
`docs/evidence/stage25a-live-results.json`. They contain counts, Condition
patterns and boundary outcomes only—no generated task content or secrets.

### Boundary confirmation

- No file upload or file-intake route, storage or interface was added.
- No database, account, external persistence or new export mechanism was added.
- Existing browser-local drafts and the existing print surface were preserved,
  not expanded.
- This build stops at the Stage 2.5A owner review gate.

## Stage 2.5C — Evidence Pattern and Proportionate Verification Architecture

### Gate

Authorised by Graeme on 20 July 2026. This implementation is bounded to the
pre-hackathon Stage 2.5C slice. Stage 2.5B task-file intake remains separately
planned. Stage 3 persistence and export remain unauthorised and were not
started.

### What changed

- Extended each moment with selective evidence purposes, evidence modes,
  journey phase, tutor/learner support boundary, visibility and retention,
  feedback uptake, and concrete workload properties.
- Added one evidence-pattern rationale and exactly one changed condition with
  an explicit variation, held-constant demands and capability rationale.
- Preserved task-level learner-AI intent while allowing relevant moment-level
  AI positions through the existing moments endpoint.
- Added model-generated professional-review suggestions without adding a
  second review call.
- Added a shared deterministic integrity checker for chronology, exact
  duplication, text-heavy verification, unsupported verification, missing
  feedback uptake, unnecessary retained capture, incomplete support boundaries,
  changed-condition linkage and safety-critical grounding.
- Recalculate deterministic points after moment editing, reordering and
  deletion. Tutor-facing language uses “Points to review” and “Review before
  use”; checks are not presented as failures or verified findings.
- Kept detailed properties in a collapsed “Evidence details” disclosure and
  retained the existing four-stage workflow and three-to-five moment limit.
- Completed the final-plan renderer for pattern rationale, feedback pattern,
  purposes, modes, support boundaries, retention, workload, moment-level AI,
  feedback uptake, changed condition and review points.
- Normalised existing Stage 2.5A browser-local drafts at read/save time without
  changing the `0.1` project-storage schema or creating a persistence migration.

### GPT-5.6 use

Prompt version `vtd-2026-07-20.4` asks the existing moments-generation call to
construct a coherent, proportionate pattern before returning three to five
moments. It distinguishes developmental evidence from judgement and
verification, allows AI-producible developmental work, and pairs consequential
verification with grounded modes where needed.

The model generates concise professional-review suggestions for semantic
questions such as fragmentation, scaffolding overreach, unnecessary capture,
capability drift and overloaded variation. These suggestions remain separate
from deterministic structural checks and do not constitute assurance.

### Tested

- Passed 28 static, schema, safeguard, compatibility, renderer and integrity
  tests.
- Passed TypeScript type checking and lint.
- Passed the production build across all app and API routes.
- Ran live GPT-5.6 clarification, diagnosis and enriched moments calls for the
  completed blank task and all three canonical demonstrations.
- Live outputs returned three or four moments, one changed condition linked to
  Apply, selective purpose/mode combinations and distinct evidence patterns.
- Ran a same-task comparison changing stakes, readiness, lenses and the safety
  flag; the design changed materially.
- Confirmed AI-off moments remain deterministically `not-relevant`.
- Confirmed safety-critical work retains directly observed performance or
  task-result evidence.
- Confirmed developmental AI-producible text is allowed while unsupported
  judgement or verification produces a review point.
- Confirmed no scoring, evidence-strength ratings, confidence percentages,
  assurance status, learner records, capability-assurance or automated
  assessment claims were introduced.

### Evidence

Machine-readable live results are stored in
`docs/evidence/stage25c-live-results.json`. They contain counts, Condition
patterns and evidence-purpose/mode patterns only—no generated task content,
learner information or secrets.

### Compatibility and boundary confirmation

- The local project schema and storage key remain `0.1`. Missing Stage 2.5C
  moment properties are conservatively normalised for older Stage 2.5A drafts;
  old drafts do not receive an invented evidence-pattern rationale or changed
  condition.
- No file upload, file parser, intake route or file storage was added.
- No database, account, learner record, external persistence or new export
  mechanism was added.
- No second model reviewer, score, confidence percentage, strength rating or
  assurance state was added.
- This build stops at the Stage 2.5C owner review gate.

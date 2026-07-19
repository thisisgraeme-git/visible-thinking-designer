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

Authorised by Graeme on 19 July 2026. Implementation is complete. Gate 2
remains open until all three scenarios have been exercised against GPT-5.6
with a configured server-side API key.

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

### Current uncertainty

No `OPENAI_API_KEY` is available in the local or hosted environment. Therefore
live GPT-5.6 outputs have not yet been claimed as verified, and Gate 2 remains
open.

### Devpost evidence

- The implementation now demonstrates non-trivial, three-stage GPT-5.6 use
  behind a structured professional interaction.
- Prompt versioning, runtime validation, failure recovery and deterministic
  rendering are concrete technical decisions suitable for the submission.

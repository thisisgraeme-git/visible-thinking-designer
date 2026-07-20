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

## Stage 2.5C — Owner-review repair

### Gate

Authorised by Graeme on 20 July 2026 as a bounded Stage 2.5C repair. Stage 2.5B
task-file intake and Stage 3 persistence/export remain outside scope and were
not started.

### What changed

- Made plain, direct British/NZ English the default across the system,
  clarification, design-focus and moments prompt contracts. Conceptual and
  disciplinary depth still adapts to the task and qualification level.
- Replaced remaining tutor-facing navigation references to diagnosis with
  “design focus”, while retaining the separate learner-diagnosis safeguard.
- Added a required `taskSummary` to the existing clarification output contract.
  It is approximately 40–60 words, stored separately from the raw task, and
  used on clarification and final-plan summary surfaces.
- Added a conservative summary fallback for Stage 2.5A/C browser-local drafts
  that have only the legacy `taskReflection` or no model summary.
- Removed the raw task description from the final-plan hero.
- Replaced the silent 4,000-character input cap with a clear, non-destructive
  over-limit message. The full pasted text remains in the form until the tutor
  shortens it.
- Added a deterministic clarification boundary for template-like, reference,
  multi-activity or incomplete input. It prioritises “Which specific learner
  task do you want to redesign?” without adding a model call.
- Compressed the final plan to learner action, tutor move, visible evidence,
  feedback uptake, support boundary, approximate workload and justified
  retention, plus the evidence-pattern rationale, one changed condition and
  points to review.
- Added four rotating, non-percentage generation messages for the evidence
  pattern and working-plan transition.

### GPT-5.6 use

Prompt version `vtd-2026-07-20.5` retains the existing clarify, diagnose and
moments endpoints. It asks for short fields, plain tutor-facing language and
degree-appropriate conceptual depth without inflated academic phrasing. No
review endpoint or additional model call was added.

### Tested

- Passed 38 static, schema, safeguard, compatibility, language, source-text,
  renderer and wait-state tests.
- Passed TypeScript type checking and lint.
- Completed a live degree-scenario journey through clarification, editable
  design focus, moment generation and the final plan.
- Confirmed the live task summary was concise, direct and conceptually
  appropriate for degree-level work.
- Confirmed the final-plan hero used the task summary rather than raw source
  text, and retained the operational evidence details requested for use.
- Confirmed 4,037 pasted characters remained intact, the exact over-limit
  message appeared, and progression stayed disabled until the input is within
  the limit.
- Confirmed the generation wait state appeared and resolved into four
  consequential moments without a fabricated percentage.

### Compatibility and boundary confirmation

- The browser-local project schema and storage key remain `0.1`.
  `clarification.taskReflection` remains readable as a legacy fallback.
- No file upload, parser, task-file intake, database, account, external
  persistence or new export mechanism was added.
- No capability-assurance, automated-assessment, scoring or learner-record
  claim was introduced.
- This repair stops at the Stage 2.5C owner-review gate.

## Stage 2.5B — Task File Intake

### Gate

Gate 2.5C was closed by Graeme after owner review on 20 July 2026. Stage 2.5B
task-file intake was then authorised as the only implementation scope. Stage 3
persistence/export and unrelated polish remain outside scope.

### What changed

- Renamed the primary intake field to “Describe the core task” and kept the
  tutor’s one-to-four-sentence description as the authoritative statement of
  intent.
- Added one optional drag-and-drop file picker for PDF, DOC, DOCX, JPG, JPEG or
  PNG files, with filename, type, size, remove/replace controls and an 8 MB
  limit.
- Added client and server validation for unsupported, oversized, empty and
  corrupt or mismatched files. Files are either processed in full or rejected;
  none are silently truncated or partially processed.
- Extended the existing clarification request to carry a document as
  `input_file` or an image as `input_image`. No extraction endpoint, second
  model call, database or durable file store was added.
- Added a concise internal `sourceDigest` containing the apparent learner task,
  important instructions and constraints, relevant criteria or required
  evidence, ambiguity warnings and source fit.
- Passed the processed digest to the existing design-focus and moments
  contracts. The raw file is not resent and the digest is not rendered in the
  final plan.
- Added deterministic clarification for multi-task documents, templates,
  tutor/source conflict and unreadable material. Attachment instructions remain
  untrusted and cannot override the application prompt or tutor intent.
- Added required task name and core-task validation. New projects can no longer
  be stored as “Untitled task”; legacy untitled drafts remain accessible and
  prompt for a name.
- Added “Edit task details” from stored-project cards and final plans. Title-only
  changes update immediately; substantive changes preserve the plan, mark it
  stale and require explicit confirmation before regeneration.
- Added attachment-aware progress and recovery copy. A selected file remains
  available for an in-session retry after processing failure.

### Privacy and retention

- Raw file bytes remain in browser session memory only until clarification
  succeeds. They are not written to local storage, the repository, the final
  plan or application logs.
- After processing, only filename/type/size metadata and the processed
  `sourceDigest` are retained in the browser-local draft.
- Reopened drafts clearly state that the original attachment was not retained.
  The processed digest remains available for renaming or clarification without
  re-upload. Reprocessing is required only when the attachment is replaced.
- The intake warns: “Do not upload learner names, identifying information or
  confidential records.”

### GPT-5.6 use

Prompt version `vtd-2026-07-20.6` retains the existing clarification,
design-focus and moments endpoints. The clarification call performs the only
attachment reading and returns both the existing short `taskSummary` and the
internal source digest. `store: false` remains set on Responses API calls.

### Tested

- Passed 50 static, schema, safeguard, file-validation, privacy, compatibility,
  editing, rendering and wait-state tests.
- Passed TypeScript type checking, lint and the production build.
- Live-validated an assessment PDF plus a short tutor description. The model
  returned a source digest and correctly surfaced a genuine difference between
  the tutor description and the attachment for human confirmation.
- Live-validated an image-based workshop task. The model returned an aligned
  digest and needed no clarification question.
- Live-validated a text-only professional task through the unchanged JSON
  clarification path with no source digest.
- Confirmed application logs contained only request method, route, response
  status and duration—not source content.
- Machine-readable results are in
  `docs/evidence/stage25b-live-results.json`; they contain no attachment or
  processed source text.

### Compatibility and boundary confirmation

- The browser-local project schema and storage key remain `0.1`. Stage 2.5A/C
  drafts remain readable; new attachment and stale-design properties are
  optional.
- No raw attachment, learner record, database, account, durable file storage,
  new authentication or export architecture was introduced.
- No capability-assurance, automated-assessment, AI-detection, scoring or
  confidence claim was introduced.
- This implementation stops at the Stage 2.5B owner-review gate. Stage 3 has
  not begun.

## Stage 2.5B — Owner-review repair: image processing and recovery

### Gate

Authorised by Graeme on 20 July 2026 as a bounded Stage 2.5B repair. Stage 3
persistence/export remains outside scope and was not started.

### Exact failure diagnosis

- The supplied uppercase `IMG_2098.JPG` passed filename normalisation, MIME,
  JPEG-signature and application metadata validation.
- The current Downloads original is a full-resolution 3,591,989-byte phone
  JPEG. A request-size probe found that the local and hosted route architecture
  rejects a multipart body at approximately 1 MiB before the clarification
  route runs. The original therefore received a plain-text HTTP 413 before
  OpenAI or structured-output parsing.
- The unchanged original succeeded when passed directly through the existing
  OpenAI `input_image` data-URL contract. It returned a valid typed
  clarification result and source digest. Image construction, Base64 encoding
  and schema parsing were therefore not the cause.
- The client expected JSON for every response. It treated the platform’s
  plain-text 413 as a generic processing failure.
- Retry retained and resent the original file, but the unchanged body exceeded
  the same limit again.
- The local-draft fallback entered clarification with no questions and no
  forward action. Its statement that designing could continue was therefore a
  genuine dead end.

### What changed

- Phone images are now decoded and prepared in the browser before upload.
  Browser decoding honours image orientation metadata when available; the
  tutor can also use Rotate left or Rotate right when the pixels remain
  sideways.
- Rotation is applied to the processing copy sent to clarification—not only to
  its preview. The source image remains in session memory for Retry or Replace.
- Image processing uses a maximum 2,048-pixel dimension and staged JPEG
  encoding, with a hard 850 KB transmission ceiling. No OCR or general image
  editor was introduced.
- The intake now shows a compact preview, Rotate left, Rotate right, Replace and
  Remove.
- Source images may be selected up to 8 MB because they are prepared before
  transmission. PDF, DOC and DOCX intake is now capped conservatively at
  900 KB so documents are rejected clearly before the hosted body ceiling.
- Non-JSON 413 responses now produce a typed, actionable file-size error.
- When the tutor’s required written task fields are sufficient, attachment
  failure offers a prominent “Continue without using the attachment” action.
  It stores a conservative task summary, omits the source digest, states that
  the attachment was not processed and proceeds through the existing
  design-focus call.
- When the written task is insufficient, continuation is withheld. Retry,
  Replace attachment and Return to task details remain visible; Retry is
  disabled only when the original session file is no longer available.
- The no-question local clarification state now has an explicit “Continue to
  design focus” action, removing the underlying dead-end class.

### Tested

- Passed 58 static, schema, safeguard, compatibility, privacy, image,
  fallback, rendering and workflow tests, including the exact external
  uppercase image.
- Passed TypeScript type checking, lint and the production build.
- Confirmed the exact image produced a non-black, readable 1,536 × 2,048
  preview after orientation-aware preparation. Rotate right produced a
  2,048 × 1,536 processing copy.
- Confirmed the exact rotated image produced a 378,818-byte multipart request,
  reached clarification and returned an aligned source digest.
- Forced the first request to fail, then confirmed Retry used the retained
  source and completed successfully.
- Forced attachment failure with a lowercase `.jpg`, then confirmed text-only
  continuation completed the design focus with no source digest and an
  explicit attachment-not-used state.
- Confirmed the insufficient-description gate, retained-file Retry contract,
  EXIF-aware decode contract, local-storage exclusion and final-plan exclusion.
- No raw image bytes, Base64 data or source content were written to application
  logs or retained in local storage.

### Compatibility and boundary confirmation

- The browser-local schema and storage key remain `0.1`.
  `sourceAttachment.notUsedForDesign` is optional, so Stage 2.5A/C and earlier
  Stage 2.5B drafts continue to render.
- The existing clarification, design-focus and moments endpoints and prompt
  version remain unchanged. No extraction call, OCR service, database, durable
  file store, authentication change or learner record was added.
- No capability-assurance, automated-assessment, scoring, confidence or
  AI-detection claim was introduced.
- Stage 2.5B remains open for owner review. Stage 3 has not begun.

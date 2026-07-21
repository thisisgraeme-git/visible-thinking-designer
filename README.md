# Visible Thinking Designer

Visible Thinking Designer is a tutor-facing learning-design workbench for tertiary and vocational education.

It helps an educator redesign one real task so consequential learner thinking becomes visible across the learning journey—not only in the finished product.

**Live application:** [visible-thinking-designer.thisisgraeme.chatgpt.site](https://visible-thinking-designer.thisisgraeme.chatgpt.site)

## Current build status

Stages 1–3 are complete. Gate 2.5B closed after owner validation on 21 July
2026. The public submission candidate is deployed at
[visible-thinking-designer.thisisgraeme.chatgpt.site](https://visible-thinking-designer.thisisgraeme.chatgpt.site).
The deployed application code corresponds to locked application commit
`097312c`. The model contracts use prompt version `vtd-2026-07-20.6`.

Included:

- landing page and four-screen workbench;
- blank-task entry and three canonical scenarios;
- typed project, diagnosis and moment structures;
- server-side OpenAI Responses API integration;
- versioned clarify, diagnose and moments prompts;
- strict structured-output and request schemas;
- loading, retry, typed failure and local-draft recovery states;
- deterministic mock data retained as the safe fallback;
- optional PDF, DOC, DOCX, JPG, JPEG and PNG task-source intake;
- editable design focus, moments and plan;
- browser-local project persistence;
- recent plans, safe duplication and new-task restart;
- copy, Markdown, JSON and print/PDF output;
- responsive and print-friendly presentation;
- contract checks for the three scenarios.

Not included:

- accounts or external databases;
- retained attachments or durable file storage;
- learner records;
- automated assessment; or
- submission media.

## Product proposition

**Design learning that leaves thinking visible.**

A tutor brings one real task, identifies where capability is currently difficult to see, selects three to five high-value visible-thinking moments and leaves with an editable plan they could use tomorrow.

## Intended audience

The primary audience is tutors in post-school tertiary education, with vocational and applied educators at the centre.

The prototype assumes that tutors:

- are educationally capable but may not be technically confident;
- are time-constrained;
- work across practical, workplace, relational and written tasks;
- already make some thinking visible through observation and conversation;
- hold legitimate and varied positions on learner AI use; and
- expect professional judgement to remain primary.

## Local development

Requirements:

- Node.js 22.13 or later;
- pnpm 11.

Install, configure and run:

```bash
pnpm install
cp .env.example .env.local
# Add OPENAI_API_KEY to .env.local
pnpm dev
```

Then open `http://localhost:3000`.

`OPENAI_MODEL` defaults to `gpt-5.6`. The API key is read only by server-side
route handlers. If it is absent or the API is unavailable, the application
preserves the project and offers the deterministic local draft.

Validation:

```bash
pnpm test
pnpm lint
pnpm build
```

With the development server running and an API key configured, repeat the live
Gate 2 contract:

```bash
pnpm test:live
```

## Current architecture

- Next.js App Router with TypeScript and React
- vinext/Vite deployment build
- official OpenAI JavaScript SDK and Responses API
- Zod runtime validation and structured outputs
- three server-side design endpoints under `app/api/design`
- versioned prompts under `lib/prompts`
- typed fixture data in `lib/fixtures.ts`
- versioned local browser storage in `lib/storage.ts`
- deterministic plan rendering from confirmed structured state
- browser-side image orientation and request-size preparation
- Markdown and privacy-bounded JSON plan export
- CSS tokens and print styling in `app/globals.css`

No task body is logged by the application. Model requests set `store: false`.

## How Codex and GPT-5.6 were used

Codex translated the four governing source documents into the staged product
architecture, implemented the local application, maintained the gate
boundaries, diagnosed failures against exact test artefacts and built the
repeatable schema, safeguard, workflow and production-build checks.

GPT-5.6 is used inside the product for three bounded server-side design calls:
clarification/source reading, the editable design focus and the proposed
visible-thinking moments. Every call uses a versioned prompt and validated
structured output. The tutor-edited project remains authoritative, and the
final plan is rendered deterministically without a separate prose-generation
call.

## Canonical demonstration scenarios

1. **Flat white under pressure** — practical performance and product-grounded checking.
2. **A dissatisfied client** — applied professional interaction and relational adaptation.
3. **Workplace wellbeing report** — academic synthesis, evidence selection and revision.

Each scenario is editable and produces a materially different design. They are evaluation fixtures, not privileged templates.

## Product and ethical boundaries

The prototype:

- stores task-design information in the current browser only;
- does not request learner names or identifiable records;
- does not perform AI or authorship detection;
- does not make assessment decisions;
- does not claim to verify learning or capability;
- treats the Five Conditions as recursive design language, not five compulsory steps; and
- keeps tutor editing and professional judgement explicit.

## Project documentation

- [Source pack and authority hierarchy](docs/README.md)
- [Stage 1 build evidence](docs/build-log.md)
- [Gate 2 live results](docs/evidence/gate2-live-results.json)

## Judge testing path

With `OPENAI_API_KEY` configured:

1. Open the landing page and choose **Start with your task** or one of the
   three example scenarios.
2. Enter a task name, a one-to-four-sentence core task description and the
   intended capability. Optionally attach one supported task source.
3. Confirm or correct **Our current understanding**, then answer or skip the
   bounded clarification questions.
4. Edit the design focus and choose **Use this design focus**.
5. Edit, remove or reorder the three-to-five proposed moments. Open
   **Evidence pattern details** to inspect the rationale and changed condition.
6. Build the final plan. Confirm that tutor edits appear in the rendered plan.
7. Use **Copy plan**, **Download Markdown**, **Download JSON** or
   **Print / Save PDF**.
8. Return home and reopen the locally saved plan. Use **Duplicate** to create a
   safe copy or **Start another task** without replacing the existing plan.

Supported source files: one PDF, DOC or DOCX up to 900 KB, or one JPG, JPEG or
PNG up to 8 MB. Phone images are prepared below the hosted request ceiling;
Rotate left/right is available before processing. Attachments are not retained.

To test failure recovery, temporarily omit the API key or interrupt the model
request. The task remains saved and the interface offers retry or continuation
with the local draft. If attachment processing fails and the written task is
sufficient, **Continue without using the attachment** remains available.

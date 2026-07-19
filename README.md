# Visible Thinking Designer

Visible Thinking Designer is a tutor-facing learning-design workbench for post-school tertiary and vocational education.

It helps an educator redesign one real task so consequential learner thinking becomes visible across the learning journey—not only in the finished product.

## Stage 1 status

This repository currently contains the static end-to-end prototype authorised by Doc 04.

Included:

- landing page and four-screen workbench;
- blank-task entry and three canonical scenarios;
- typed project, diagnosis and moment structures;
- deterministic mock clarification, diagnosis and moment data;
- editable moments and plan;
- browser-local project persistence;
- recent plans and duplication;
- responsive and print-friendly presentation; and
- contract checks for the three scenarios.

Not included:

- OpenAI or GPT-5.6 integration;
- final prompts;
- file upload;
- accounts or external databases;
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

Install and run:

```bash
pnpm install
pnpm dev
```

Then open `http://localhost:3000`.

Validation:

```bash
pnpm test
pnpm lint
pnpm build
```

## Stage 1 architecture

- Next.js App Router with TypeScript and React
- vinext/Vite deployment build
- typed fixture data in `lib/fixtures.ts`
- versioned local browser storage in `lib/storage.ts`
- deterministic plan rendering from confirmed structured state
- CSS tokens and print styling in `app/globals.css`

The OpenAI API key is not required in Stage 1. No model request is made.

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

## Judge testing path

For Stage 1:

1. Open the landing page.
2. Select each of the three example scenarios in turn.
3. Review or edit the task.
4. Answer or skip the bounded clarification questions.
5. Confirm the editable diagnosis.
6. Edit or reorder the proposed visible-thinking moments.
7. Open the final plan.
8. Return home and reopen the locally saved plan.

The Stage 2 GPT-5.6 path is intentionally unavailable until separately authorised.

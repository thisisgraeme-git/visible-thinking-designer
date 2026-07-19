# Visible Thinking Designer source pack

## Current gate

Stage 0 is complete. Implementation has not begun.

The only next authorised build stage is **Stage 1 — static end-to-end prototype**, and it remains paused until Graeme says **go** in this local build thread.

## Source hierarchy

1. [Doc 01 — Research-to-Build Handoff](source-pack/01-research-to-build-handoff.md) governs research fidelity and the Five Conditions.
2. [Doc 02 — Present State Handoff](source-pack/02-present-state-handoff.md) governs the founding proposition, larger living system and product boundaries.
3. [Doc 03 — Devpost Revision and Submission Notes](source-pack/03-devpost-submission-notes.md) governs Devpost evidence and submission requirements.
4. [Doc 04 — Staged Build Plan and Codex Handoff](source-pack/04-staged-build-plan.md) governs staged implementation.

Material conflicts must be surfaced. They must not be silently resolved by expanding scope.

## Exact authorised Stage 1 scope

Build:

- initialise the repository and README;
- scaffold the Next.js TypeScript app;
- implement visual tokens and the application shell;
- build the landing page;
- build all four workbench screens;
- add the three typed scenario fixtures;
- add mock clarification, diagnosis and moment data;
- render an editable mock plan;
- implement local project creation and navigation;
- add initial local persistence;
- add print styling; and
- create the first preview deployment if credentials and repository access are available.

Do not build in Stage 1:

- OpenAI integration;
- final prompts;
- external database;
- accounts;
- file upload; or
- submission media.

Gate 1 is reached only when a user can traverse the whole mock experience for all three examples and reach a coherent plan; the product looks intentional; state survives normal navigation; and the Five Conditions are not presented as sequential steps.

## Source provenance and integrity

Source folder: <https://drive.google.com/drive/folders/1kfKAVbqft1f5kBGatH8Al98D85IFhYN5>

| Local file | Drive file ID | SHA-256 |
| --- | --- | --- |
| `01-research-to-build-handoff.md` | `11pOoHlakjK2irMeXHXRRxEYmG-bTz_qR` | `cba51be8c2f534c7495e7c3da10069cd8c1d16108306675309b74fa39c198a5e` |
| `02-present-state-handoff.md` | `1CppojZjoJdeu3KZfoD57LnDD5WfCI-qIvt14poZGpgs` | `44ac4490392071bca596ab84e490a46602a08da9a19f200738eea2a8be9803ea` |
| `03-devpost-submission-notes.md` | `1_SxbS29zFTlOTOMSgDw-GtVhV5CJeV1n5ZjVZIqakOU` | `9b2e5913dc6a38eb809fae54d3a59bd85fac3748308c44d20d20c9297eb17aab` |
| `04-staged-build-plan.md` | `153AVJuulfAmaCxXUnNngmYJZYoGxZzZd` | `5d2b8834b14274af560aee8b0a074b301d4eca24e5cafc5373f7c652006fba26` |

Docs 01 and 04 were stored in Drive as Markdown. Docs 02 and 03 were exported from native Google Docs to Markdown.

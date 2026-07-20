import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  attachmentMetadata,
  DOCUMENT_UPLOAD_MAX_BYTES,
  FILE_UPLOAD_MAX_BYTES,
  validateFileBytes,
  validateFileMetadata,
} from "../lib/file-intake.ts";
import {
  clarifyOutputSchema,
  clarifyRequestSchema,
  diagnoseRequestSchema,
  momentsRequestSchema,
  taskSchema,
} from "../lib/model-schemas.ts";
import {
  enforceClarificationBoundaries,
} from "../lib/server/boundaries.ts";
import {
  getSubstantiveTaskChanges,
  isLegacyUntitledTitle,
} from "../lib/task-editing.ts";
import { blankProject, scenarioFixtures } from "../lib/fixtures.ts";
import { SYSTEM_PROMPT } from "../lib/prompts/system.ts";
import { CLARIFY_PROMPT } from "../lib/prompts/clarify.ts";
import {
  ATTACHMENT_CLARIFICATION_MESSAGES,
} from "../lib/generation-copy.ts";

const root = new URL("../", import.meta.url);
const source = (path) => readFileSync(new URL(path, root), "utf8");

function bytes(text, prefix = [], suffix = []) {
  return new Uint8Array([
    ...prefix,
    ...new TextEncoder().encode(text),
    ...suffix,
  ]);
}

const png = bytes("IEND", [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const jpeg = bytes("task photo", [0xff, 0xd8, 0xff], [0xff, 0xd9]);
const pdf = bytes(" assessment instructions %%EOF", [
  0x25, 0x50, 0x44, 0x46, 0x2d,
]);
const doc = bytes("legacy task", [
  0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1,
]);
const docx = bytes(
  "[Content_Types].xml word/document.xml",
  [0x50, 0x4b, 0x03, 0x04],
);

test("accepts the bounded PDF, Word and image formats", () => {
  for (const [filename, content] of [
    ["assessment.pdf", pdf],
    ["assessment.doc", doc],
    ["assessment.docx", docx],
    ["task.jpg", jpeg],
    ["task.jpeg", jpeg],
    ["task.png", png],
  ]) {
    assert.equal(validateFileBytes(filename, content), null, filename);
    const metadata = attachmentMetadata({
      name: filename,
      size: content.length,
    });
    assert.equal(metadata.processed, false);
    assert.equal("bytes" in metadata, false);
  }
  assert.equal(FILE_UPLOAD_MAX_BYTES, 8 * 1024 * 1024);
  assert.equal(DOCUMENT_UPLOAD_MAX_BYTES, 900 * 1024);
});

test("rejects unsupported, oversized, empty and corrupt files without partial processing", () => {
  assert.equal(
    validateFileMetadata({ name: "task.txt", size: 20 })?.code,
    "unsupported_file",
  );
  assert.equal(
    validateFileMetadata({
      name: "task.pdf",
      size: DOCUMENT_UPLOAD_MAX_BYTES + 1,
    })?.code,
    "file_too_large",
  );
  assert.equal(
    validateFileMetadata({ name: "task.pdf", size: 0 })?.code,
    "empty_file",
  );
  assert.equal(
    validateFileBytes("task.pdf", bytes("not a pdf"))?.code,
    "corrupt_file",
  );
});

test("text-only clarification remains valid and file context is optional", () => {
  const project = blankProject();
  project.task.title = "Calibrate the espresso grinder";
  project.task.description =
    "Learners calibrate the grinder for the service conditions and explain the adjustment they make.";
  project.task.intendedCapability =
    "Adjust grind settings using extraction evidence and service requirements.";

  assert.equal(
    clarifyRequestSchema.safeParse({
      source: project.source,
      task: project.task,
    }).success,
    true,
  );
  const output = clarifyOutputSchema.parse({
    taskSummary:
      "Learners calibrate an espresso grinder for current service conditions and explain how extraction evidence informed the adjustment.",
    questions: [],
  });
  assert.equal(output.sourceDigest, null);
});

test("source digest reaches diagnosis and moments without resending raw source", () => {
  const project = scenarioFixtures[0].project;
  const sourceDigest = {
    apparentLearnerTask: "Prepare a flat white during service.",
    importantInstructionsAndConstraints: ["Work during normal service."],
    criteriaOrRequiredEvidence: ["Extraction and milk texture meet the standard."],
    warnings: [],
    sourceFit: "aligned",
  };
  assert.equal(
    diagnoseRequestSchema.safeParse({
      task: project.task,
      clarification: {
        ...project.clarification,
        sourceDigest,
      },
    }).success,
    true,
  );
  assert.equal(
    momentsRequestSchema.safeParse({
      task: project.task,
      diagnosis: project.diagnosis,
      sourceDigest,
    }).success,
    true,
  );
});

test("multi-task, template, conflict and unreadable source states force targeted clarification", () => {
  const task = scenarioFixtures[0].project.task;
  const base = {
    taskSummary: "A concise summary of the target learner task and context.",
    questions: [],
  };
  for (const [sourceFit, pattern] of [
    ["multiple-tasks", /Which specific learner task/],
    ["template-or-reference", /Which specific learner task/],
    ["conflicts", /Which task should guide this design/],
    ["unreadable", /could not be read clearly/],
  ]) {
    const result = enforceClarificationBoundaries(
      task,
      {
        ...base,
        sourceDigest: {
          apparentLearnerTask: "The source does not identify one clear task.",
          importantInstructionsAndConstraints: [],
          criteriaOrRequiredEvidence: [],
          warnings: ["Review the source."],
          sourceFit,
        },
      },
      true,
    );
    assert.match(result.questions[0].question, pattern);
  }
});

test("attachment instructions are explicitly untrusted and cannot redefine tutor intent", () => {
  const prompt = `${SYSTEM_PROMPT}\n${CLARIFY_PROMPT}`;
  assert.match(prompt, /attached[\s\S]*untrusted data/i);
  assert.match(prompt, /prompt-like directions[\s\S]*ignore/i);
  assert.match(prompt, /description is the primary statement of intent/i);
  assert.match(prompt, /never let it silently redefine/i);
});

test("raw attachment data is absent from persisted and rendered project surfaces", () => {
  const storage = source("lib/storage.ts");
  const plan = source("components/plan-screen.tsx");
  const planDocument = plan.slice(
    plan.indexOf('<article className="plan-document">'),
    plan.indexOf("</article>", plan.indexOf('<article className="plan-document">')),
  );
  const route = source("app/api/design/clarify/route.ts");
  const clientAttachments = source("lib/client-attachments.ts");

  assert.doesNotMatch(storage, /arrayBuffer|file_data|base64|File\b/);
  assert.doesNotMatch(
    planDocument,
    /sourceDigest|sourceAttachment|file_data|base64/,
  );
  assert.doesNotMatch(route, /console\.|logger|localStorage/);
  assert.match(clientAttachments, /new Map<string, SessionAttachment>/);
  assert.match(source("lib/server/openai.ts"), /store: false/);
});

test("file failure and retry copy preserves tutor work and the selected in-session file", () => {
  const diagnose = source("components/diagnose-screen.tsx");
  assert.match(diagnose, /removeSessionAttachment\(succeeded\.id\)/);
  assert.doesNotMatch(
    diagnose.slice(
      diagnose.indexOf("if (!result.ok)"),
      diagnose.indexOf("const completed"),
    ),
    /removeSessionAttachment/,
  );
  assert.deepEqual(ATTACHMENT_CLARIFICATION_MESSAGES, [
    "Reading the attached task material…",
    "Identifying the target task and constraints…",
    "Preparing the design conversation…",
  ]);
});

test("task identity is required and legacy untitled drafts remain renameable", () => {
  const task = structuredClone(scenarioFixtures[0].project.task);
  assert.equal(taskSchema.safeParse({ ...task, title: "   " }).success, false);
  assert.equal(
    taskSchema.safeParse({ ...task, description: "   " }).success,
    false,
  );
  assert.equal(blankProject().task.title, "");
  assert.equal(isLegacyUntitledTitle("Untitled task"), true);
  assert.equal(isLegacyUntitledTitle("Named task"), false);
});

test("title-only edits do not invalidate design but substantive edits do", () => {
  const before = structuredClone(scenarioFixtures[1].project.task);
  assert.deepEqual(
    getSubstantiveTaskChanges(before, {
      ...before,
      title: "Revised task name",
    }),
    [],
  );
  assert.deepEqual(
    getSubstantiveTaskChanges(before, {
      ...before,
      assessmentStakes: "high-stakes-final",
    }),
    ["stakes"],
  );
});

test("editing and regeneration remain explicit across cards and final plans", () => {
  const taskScreen = source("components/task-screen.tsx");
  const landing = source("components/landing-page.tsx");
  const plan = source("components/plan-screen.tsx");

  assert.match(taskScreen, /These changes may affect the current design/);
  assert.match(taskScreen, /Save without regenerating/);
  assert.match(taskScreen, /Regenerate design focus and moments/);
  assert.match(landing, /Edit task details/);
  assert.match(plan, /Edit task details/);
  assert.match(plan, /window\.print\(\)/);
  assert.match(plan, /<h2>\{project\.task\.title\}<\/h2>/);
});

test("demonstration scenario identities and task descriptions remain unchanged", () => {
  assert.deepEqual(
    scenarioFixtures.map(({ project }) => [
      project.task.title,
      project.task.description,
    ]),
    [
      [
        "Prepare a flat white during a busy café service",
        "Prepare and serve a flat white to workplace standard while managing the flow of other orders during a busy café service.",
      ],
      [
        "Respond to a dissatisfied client",
        "Respond to a dissatisfied client in a role-play, clarify the issue, propose an appropriate next action and complete a brief follow-up record.",
      ],
      [
        "Compare approaches to workplace wellbeing",
        "Write a short report comparing two approaches to improving workplace wellbeing and make an evidence-based recommendation.",
      ],
    ],
  );
});

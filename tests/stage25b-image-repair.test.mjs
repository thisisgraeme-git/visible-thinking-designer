import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import {
  DOCUMENT_UPLOAD_MAX_BYTES,
  FILE_UPLOAD_MAX_BYTES,
  validateFileBytes,
  validateFileMetadata,
} from "../lib/file-intake.ts";
import {
  PREPARED_IMAGE_MAX_BYTES,
  preparedImageDimensions,
  rotateQuarterTurns,
} from "../lib/image-preparation.ts";
import { hasSufficientWrittenTask } from "../lib/task-input.ts";

const root = new URL("../", import.meta.url);
const source = (path) => readFileSync(new URL(path, root), "utf8");
const exactImagePath = process.env.VTD_EXACT_IMAGE_PATH;

test(
  "the exact supplied uppercase IMG_2098.JPG passes intake validation",
  { skip: !exactImagePath || !existsSync(exactImagePath) },
  () => {
    const exact = new Uint8Array(readFileSync(exactImagePath));
    assert.equal(validateFileBytes("IMG_2098.JPG", exact), null);
    assert.equal(validateFileBytes("img_2098.jpg", exact), null);
    assert.ok(exact.byteLength < FILE_UPLOAD_MAX_BYTES);
  },
);

test("image rotation is reversible and swaps the transmitted dimensions", () => {
  assert.equal(rotateQuarterTurns(0, "right"), 1);
  assert.equal(rotateQuarterTurns(1, "left"), 0);
  assert.equal(rotateQuarterTurns(0, "left"), 3);
  assert.deepEqual(preparedImageDimensions(1536, 2048, 0), {
    width: 1536,
    height: 2048,
  });
  assert.deepEqual(preparedImageDimensions(1536, 2048, 1), {
    width: 2048,
    height: 1536,
  });
});

test("phone images are orientation-aware and prepared below the request ceiling", () => {
  const preparation = source("lib/image-preparation.ts");
  assert.match(preparation, /imageOrientation: "from-image"/);
  assert.match(preparation, /context\.rotate/);
  assert.match(preparation, /canvasToBlob/);
  assert.equal(PREPARED_IMAGE_MAX_BYTES, 850 * 1024);
  assert.ok(PREPARED_IMAGE_MAX_BYTES < DOCUMENT_UPLOAD_MAX_BYTES);
});

test("the retained original drives Retry and every selected rotation", () => {
  const attachments = source("lib/client-attachments.ts");
  assert.match(attachments, /original: File/);
  assert.match(
    attachments,
    /prepareImageForUpload\(\s*attachment\.original,\s*attachment\.quarterTurns/,
  );
  assert.match(attachments, /attachment\.prepared = undefined/);
  assert.doesNotMatch(attachments, /localStorage/);
});

test("written-task sufficiency gates continuation without an attachment", () => {
  const sufficient = {
    title: "Explain a treatment brochure",
    description:
      "Learners explain the treatment preparation and aftercare choices to a patient using the written task brief.",
    intendedCapability:
      "Explain treatment choices accurately and responsively.",
  };
  assert.equal(hasSufficientWrittenTask(sufficient), true);
  assert.equal(
    hasSufficientWrittenTask({ ...sufficient, description: "Use brochure." }),
    false,
  );
  assert.equal(
    hasSufficientWrittenTask({ ...sufficient, title: "Untitled task" }),
    false,
  );
});

test("attachment failure offers a real continuation or recovery actions, never a dead end", () => {
  const diagnose = source("components/diagnose-screen.tsx");
  assert.match(diagnose, /Continue without using the attachment/);
  assert.match(diagnose, /Replace attachment/);
  assert.match(diagnose, /Return to task details/);
  assert.match(diagnose, /canContinueWithoutAttachment \?/);
  assert.match(diagnose, /disabled=\{!retainedAttachment\}/);
  assert.match(diagnose, /Continue to design focus/);
  assert.match(diagnose, /notUsedForDesign: true/);
});

test("runtime-aware limits reject documents before the platform body ceiling", () => {
  assert.equal(DOCUMENT_UPLOAD_MAX_BYTES, 900 * 1024);
  assert.equal(
    validateFileMetadata({
      name: "large-assessment.pdf",
      size: DOCUMENT_UPLOAD_MAX_BYTES + 1,
    })?.code,
    "file_too_large",
  );
  assert.equal(
    validateFileMetadata({
      name: "phone-photo.JPG",
      size: 3_591_989,
    }),
    null,
  );
});

test("fallback and preview contracts do not persist or render raw file content", () => {
  const storage = source("lib/storage.ts");
  const plan = source("components/plan-screen.tsx");
  const clarifyRoute = source("app/api/design/clarify/route.ts");
  assert.doesNotMatch(storage, /arrayBuffer|file_data|base64|File\b/);
  assert.doesNotMatch(plan, /file_data|base64|arrayBuffer/);
  assert.doesNotMatch(clarifyRoute, /console\.|logger|localStorage/);
});

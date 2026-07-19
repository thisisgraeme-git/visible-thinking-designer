import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Visible Thinking Designer landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Visible Thinking Designer<\/title>/i);
  assert.match(html, /Design learning that leaves thinking visible/);
  assert.match(html, /What thinking needs to remain with the learner/);
  assert.match(html, /Flat white under pressure/);
  assert.match(html, /A dissatisfied client/);
  assert.match(html, /Workplace wellbeing report/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("server-renders the new design route", async () => {
  const response = await render("/design/new");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Start with the work as it is/);
  assert.match(html, /Do not enter learner names/);
  assert.match(html, /class="stage-count">Stage/);
  assert.match(html, /of 4<\/span>/);
});

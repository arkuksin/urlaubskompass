import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the Urlaubskompass product shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  const pageSource = await readFile(new URL("app/page.tsx", templateRoot), "utf8");
  assert.match(html, /<html[^>]+lang="de"/i);
  assert.match(html, /Urlaubskompass/);
  assert.match(html, /Was passt/);
  assert.match(html, /Wie sieht es draußen aus/);
  assert.match(html, /Alle elf Ausflüge/);
  assert.match(pageSource, /Namur als Reisepause/);
  assert.match(pageSource, /nicht im Ausflugsranking/);
  assert.match(pageSource, /Ein ganzer Tag Nigloland/);
  assert.match(pageSource, /Mittelalterstadt Provins/);
  assert.match(pageSource, /Bewertungen für/);
  assert.match(pageSource, /Tripadvisor/);
  assert.match(pageSource, /19\.557/);
  assert.match(pageSource, /kein eigener Eintrag/);
  assert.match(pageSource, /Route ab Ferienhaus/);
  assert.match(pageSource, /17 Rue du Moulin/);
  assert.equal((pageSource.match(/mapQuery:/g) ?? []).length, 13);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

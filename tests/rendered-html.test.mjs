import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
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
  const votesApiSource = await readFile(new URL("app/api/votes/route.ts", templateRoot), "utf8");
  const hostingConfig = JSON.parse(await readFile(new URL(".openai/hosting.json", templateRoot), "utf8"));
  const votesMigration = await readFile(new URL("drizzle/0000_odd_red_skull.sql", templateRoot), "utf8");
  const activityImages = await readdir(new URL("public/activities/", templateRoot));
  assert.match(html, /<html[^>]+lang="de"/i);
  assert.match(html, /Urlaubskompass/);
  assert.match(html, /Alle Ziele/);
  assert.match(html, /Euer Urlaub auf der Karte/);
  assert.match(html, /Alle dreizehn Ziele/);
  assert.doesNotMatch(html, /Wie sieht es draußen aus|Was braucht ihr heute|Wie groß darf der Tag werden/);
  assert.match(pageSource, /Namur als Reisepause/);
  assert.match(pageSource, /kein Ausflug ab Ferienhaus/);
  assert.match(pageSource, /Ein ganzer Tag Nigloland/);
  assert.match(pageSource, /Mittelalterstadt Provins/);
  assert.match(pageSource, /Königsstadt Reims/);
  assert.match(pageSource, /Paris & Eiffelturm/);
  assert.match(pageSource, /DestinationMap/);
  assert.match(html, /Noch nicht besucht/);
  assert.match(pageSource, /urlaub-besucht/);
  assert.match(pageSource, /Als besucht markieren/);
  assert.match(pageSource, /von 13 besucht/);
  assert.match(pageSource, /visitedIds/);
  assert.match(html, /Gemeinsame Wunschliste/);
  assert.match(html, /Will ich/);
  assert.match(html, /Meine Frau/);
  assert.match(pageSource, /Volltreffer/);
  assert.match(votesApiSource, /ON CONFLICT/);
  assert.match(votesMigration, /CREATE TABLE `destination_votes`/);
  assert.equal(hostingConfig.d1, "DB");
  assert.match(pageSource, /Bewertungen für/);
  assert.match(pageSource, /Tripadvisor/);
  assert.match(pageSource, /19\.557/);
  assert.match(pageSource, /kein eigener Eintrag/);
  assert.match(pageSource, /\/activities\/lac-tretboot\.webp/);
  assert.match(pageSource, /imageAlt/);
  assert.equal(activityImages.filter((name) => name.endsWith(".webp")).length, 14);
  assert.match(pageSource, /Route ab Ferienhaus/);
  assert.match(pageSource, /17 Rue du Moulin/);
  assert.equal((pageSource.match(/mapQuery:/g) ?? []).length, 18);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

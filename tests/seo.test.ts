import test from "node:test";
import assert from "node:assert/strict";
import robots from "../src/app/robots";
import sitemap from "../src/app/sitemap";
import { publicOrigin } from "../src/lib/seo";

test("production origin requires HTTPS and cannot leak credentials, paths or queries", () => {
  assert.equal(publicOrigin("https://seekursor.vercel.app/"), "https://seekursor.vercel.app");
  for (const value of ["", "http://example.com", "https://user:secret@example.com", "https://example.com/staging", "https://example.com/?token=secret", "https://example.com/#preview"]) {
    assert.throws(() => publicOrigin(value));
  }
});

test("sitemap lists only the three canonical locales with reciprocal alternates and stable dates", () => {
  const entries = sitemap();
  const origin = publicOrigin();
  assert.deepEqual(entries.map(entry => entry.url), ["fr", "en", "ht"].map(locale => `${origin}/${locale}`));
  for (const entry of entries) {
    assert.match(String(entry.lastModified), /^\d{4}-\d{2}-\d{2}$/);
    assert.deepEqual(entry.alternates?.languages, {fr: `${origin}/fr`, en: `${origin}/en`, ht: `${origin}/ht`, "x-default": `${origin}/fr`});
  }
  assert.deepEqual(robots(), {rules: {userAgent: "*", allow: "/"}, sitemap: `${origin}/sitemap.xml`});
});

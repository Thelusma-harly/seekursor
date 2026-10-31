import test from "node:test";
import assert from "node:assert/strict";
import robots from "../src/app/robots";
import sitemap from "../src/app/sitemap";
import { brandStructuredData, pageMetadata, publicOrigin, serializeJsonLd } from "../src/lib/seo";
import { siteConfig } from "../src/data/siteConfig";
import fr from "../messages/fr.json";
import en from "../messages/en.json";
import ht from "../messages/ht.json";

test("production origin requires HTTPS and cannot leak credentials, paths or queries", () => {
  assert.equal(publicOrigin("https://seekursor.vercel.app/"), "https://seekursor.vercel.app");
  for (const value of ["", "http://example.com", "https://user:secret@example.com", "https://example.com/staging", "https://example.com/?token=secret", "https://example.com/#preview"]) {
    assert.throws(() => publicOrigin(value));
  }
});

for (const [locale, messages] of Object.entries({ fr, en, ht })) {
  test(`${locale}: unique localized metadata has absolute canonical/share URLs and correct language alternates`, () => {
    const copy = messages.Metadata;
    assert.ok(copy.title.includes("Seekursor") && copy.title.length < 60);
    assert.ok(copy.description.length >= 120 && copy.description.length <= 160);
    const meta = pageMetadata(locale as "fr" | "en" | "ht", copy);
    const origin = publicOrigin();
    assert.equal(meta.alternates?.canonical, `${origin}/${locale}`);
    assert.deepEqual(meta.alternates?.languages, { fr: `${origin}/fr`, en: `${origin}/en`, ht: `${origin}/ht`, "x-default": `${origin}/fr` });
    assert.equal((meta.openGraph as {url: string}).url, `${origin}/${locale}`);
    assert.equal((meta.twitter as {card: string}).card, "summary_large_image");
    assert.deepEqual(meta.openGraph?.images, [{url: `${origin}/og/seekursor-${locale}.png`, width: 1200, height: 630, alt: "Seekursor logo"}]);
  });

  test(`${locale}: brand schema uses known facts, one organization and one website, and safely round-trips`, () => {
    const data = brandStructuredData(messages.Metadata);
    assert.deepEqual(JSON.parse(serializeJsonLd(data)), data);
    const [organization, website] = data["@graph"];
    assert.equal(organization["@type"], "Organization");
    assert.equal(website["@type"], "WebSite");
    assert.equal(organization.name, "Seekursor");
    assert.equal(organization.url, publicOrigin());
    assert.equal(organization.telephone, "+50947109401");
    assert.equal(organization.areaServed?.name, "Haiti");
    assert.deepEqual(organization.sameAs, ["https://www.instagram.com/seekursor/", "https://www.tiktok.com/@seekursor"]);
    assert.equal(organization.email, siteConfig.email || undefined);
    assert.ok(!("address" in organization) && !("review" in organization) && !("aggregateRating" in organization));
    assert.equal(organization.logo?.width, 512);
    assert.match(organization.logo?.url ?? "", /^https:\/\//);
    assert.ok(!("alternateName" in website) && !("potentialAction" in website));
  });
}

test("JSON-LD cannot terminate its script element", () => {
  const value = { name: "</script><script>alert('test')</script>" };
  const serialized = serializeJsonLd(value);
  assert.ok(!serialized.includes("<"));
  assert.deepEqual(JSON.parse(serialized), value);
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

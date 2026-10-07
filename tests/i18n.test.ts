import test from "node:test";
import assert from "node:assert/strict";
import { createTranslator, type AbstractIntlMessages } from "next-intl";
import { NextRequest } from "next/server";
import fr from "../messages/fr.json";
import en from "../messages/en.json";
import ht from "../messages/ht.json";
import proxy from "../src/proxy";
import { buildWhatsAppUrl, createCalDestination, createTallyDestination } from "../src/lib/acquisition";

function leaves(value: unknown, prefix = ""): Record<string, string> {
  if (typeof value === "string") return {[prefix]: value};
  return Object.fromEntries(Object.entries(value as Record<string, unknown>)
    .flatMap(([key, child]) => Object.entries(leaves(child, prefix ? `${prefix}.${key}` : key))));
}
const source = leaves(fr);
for (const [locale, messages] of Object.entries({fr, en, ht})) {
  test(`${locale}: complete message structure, matching ICU variables and valid messages`, () => {
    const translated = leaves(messages);
    assert.deepEqual(Object.keys(translated).sort(), Object.keys(source).sort());
    const t = createTranslator({locale, messages: messages as unknown as AbstractIntlMessages,
      onError(error) {throw error;}});
    // Keys are enumerated from each runtime catalogue rather than a compile-time namespace.
    const translate = t as unknown as (key: string, values: Record<string, string | number>) => string;
    for (const [key, message] of Object.entries(translated)) {
      assert.ok(message.trim(), key);
      const variables = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort();
      assert.deepEqual(variables(message), variables(source[key]), key);
      assert.ok(translate(key, {title: "Example", year: 2026, number: "01", provider: "Cal.com"}));
    }
  });
  test(`${locale}: localizes WhatsApp without changing acquisition destinations`, () => {
    const url = new URL(buildWhatsAppUrl("50947109401", messages.WhatsApp.default));
    assert.equal(url.pathname, "/50947109401");
    assert.equal(url.searchParams.get("text"), messages.WhatsApp.default);
    const cal = createCalDestination("https://cal.com/thelusma-harly/30min", {}, "dark", messages.Acquisition.calTitle)!;
    assert.equal(cal.hostedUrl, "https://cal.com/thelusma-harly/30min");
    assert.equal((cal.config.iframeAttrs as Record<string,string>).title, messages.Acquisition.calTitle);
    assert.equal(createTallyDestination("https://tally.so/r/Gx2yBz", {})?.hostedUrl, "https://tally.so/r/Gx2yBz");
  });
}
test("First visits default to French even when the browser prefers English", () => {
  const response = proxy(new NextRequest("https://seekursor.test/", {headers:{"accept-language":"en-US,en;q=0.9"}}));
  assert.equal(response.headers.get("location"), "https://seekursor.test/fr");
});
test("next-intl's locale cookie persists explicit language selection", () => {
  for (const locale of ["en", "ht"]) {
    const response = proxy(new NextRequest("https://seekursor.test/", {headers:{cookie:`NEXT_LOCALE=${locale}`}}));
    assert.equal(response.headers.get("location"), `https://seekursor.test/${locale}`);
  }
});
test("Explicit locale paths override a previous selection", () => {
  const response = proxy(new NextRequest("https://seekursor.test/fr", {headers:{cookie:"NEXT_LOCALE=en"}}));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("location"), null);
  assert.ok(response.headers.get("set-cookie")?.includes("NEXT_LOCALE=fr"));
});

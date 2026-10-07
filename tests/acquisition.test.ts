import test from "node:test";
import assert from "node:assert/strict";
import { buildWhatsAppUrl, collectAttribution, createCalDestination, createTallyDestination, DEFAULT_WHATSAPP_MESSAGE, validateProviderUrl, validateWhatsAppNumber } from "../src/lib/acquisition";

test("WhatsApp rejects missing, placeholder and malformed numbers", () => {
  for (const value of ["", "undefined", "509XXXXXXXX", "<YOUR_WHATSAPP_NUMBER>", "+50912345678", "509 12345678", "0123456789", "123", "1234567890123456"]) {
    assert.equal(validateWhatsAppNumber(value), "");
    assert.equal(buildWhatsAppUrl(value), "");
  }
});
test("WhatsApp encodes the approved message and contextual Unicode", () => {
  // Synthetic test number only; never configured on the site or opened.
  const number = "12345678901";
  const defaultUrl = new URL(buildWhatsAppUrl(number));
  assert.equal(defaultUrl.origin + defaultUrl.pathname, "https://wa.me/" + number);
  assert.equal(defaultUrl.searchParams.get("text"), DEFAULT_WHATSAPP_MESSAGE);
  const message = "Bonjour, café & catalogue « Haïti » ?";
  assert.equal(new URL(buildWhatsAppUrl(number, message)).searchParams.get("text"), message);
});
test("Provider configuration rejects dangerous URLs and placeholders", () => {
  for (const provider of ["cal", "tally"] as const) {
    for (const value of ["", "undefined", "<YOUR_CAL_BOOKING_URL>", "javascript:alert(1)", "http://cal.com/studio/discovery", "https://cal.com.evil.test/studio/discovery", "https://user:secret@cal.com/studio/discovery", "https://cal.com:4430/studio/discovery"]) {
      assert.equal(validateProviderUrl(value, provider), "");
    }
  }
  assert.equal(validateProviderUrl("https://cal.com/USERNAME/EVENT", "cal"), "");
  assert.equal(validateProviderUrl("https://tally.so/r/<form-id>", "tally"), "");
});
test("Provider paths accept published user/team events and standard Tally links", () => {
  assert.equal(validateProviderUrl("https://cal.com/studio/discovery/", "cal"), "https://cal.com/studio/discovery");
  assert.equal(validateProviderUrl("https://cal.com/team/studio/events", "cal"), "https://cal.com/team/studio/events");
  assert.equal(validateProviderUrl("https://cal.com/team/studio", "cal"), "");
  assert.equal(validateProviderUrl("https://tally.so/r/Ab123", "tally"), "https://tally.so/r/Ab123");
  assert.equal(validateProviderUrl("https://tally.so/embed/Ab123", "tally"), "https://tally.so/embed/Ab123");
  assert.equal(validateProviderUrl("https://tally.so/forms/Ab123", "tally"), "");
});
test("Attribution forwards only approved tags and safe page/referral context", () => {
  const fields = collectAttribution("https://seekursor.example/?utm_source=instagram&utm_medium=dm&utm_campaign=launch&utm_content=hero&token=private&email=private#secret", "https://referral.example/path?key=private", "Restaurant");
  assert.deepEqual(fields, {
    utm_source: "instagram", utm_medium: "dm", utm_campaign: "launch", utm_content: "hero",
    originPage: "https://seekursor.example/", referral: "https://referral.example", project_context: "Restaurant",
  });
});
test("Attribution handles direct visits, invalid values and long tags", () => {
  assert.deepEqual(collectAttribution("invalid", "javascript:alert(1)"), {});
  assert.equal(collectAttribution("https://seekursor.example/?utm_source=" + "x".repeat(500)).utm_source.length, 200);
});
test("Cal uses the global theme and preserves only supported tracking parameters", () => {
  for (const theme of ["light", "dark"] as const) {
    const destination = createCalDestination("https://cal.com/studio/discovery?token=private", { utm_source: "instagram", originPage: "internal", token: "private" }, theme)!;
    assert.equal(destination.calLink, "studio/discovery");
    assert.equal(destination.config.theme, theme);
    assert.equal(destination.config.utm_source, "instagram");
    assert.equal(new URL(destination.hostedUrl).searchParams.get("utm_source"), "instagram");
    assert.equal(new URL(destination.hostedUrl).searchParams.has("token"), false);
    assert.equal("originPage" in destination.config, false);
  }
});
test("Tally generates an official iframe URL and hidden field attribution", () => {
  const result = createTallyDestination("https://tally.so/r/Ab123?token=private", { utm_source: "referral", originPage: "https://seekursor.example/", referral: "https://referral.example", project_context: "Catalogue", token: "private" })!;
  const iframe = new URL(result.embedUrl);
  assert.equal(iframe.pathname, "/embed/Ab123");
  assert.equal(iframe.searchParams.get("alignLeft"), "1");
  assert.equal(iframe.searchParams.get("hideTitle"), "1");
  assert.equal(iframe.searchParams.get("project_context"), "Catalogue");
  assert.equal(iframe.searchParams.has("token"), false);
  assert.equal(iframe.searchParams.has("theme"), false);
  assert.equal(new URL(result.hostedUrl).pathname, "/r/Ab123");
});
test("Missing provider values never create an iframe URL", () => {
  assert.equal(createCalDestination("", {}, "light"), null);
  assert.equal(createTallyDestination("", {}), null);
});

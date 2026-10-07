import frenchMessages from "../../messages/fr.json";
export const DEFAULT_WHATSAPP_MESSAGE = frenchMessages.WhatsApp.default;

export type AcquisitionChannel = "whatsapp" | "booking" | "inquiry";
export type OpenAcquisition = (channel: AcquisitionChannel, trigger?: HTMLElement, context?: string) => void;
export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export function validateWhatsAppNumber(value = "") {
  const number = value.trim();
  return /^[1-9]\d{7,14}$/.test(number) ? number : "";
}

export function validateProviderUrl(value: string | undefined, provider: "cal" | "tally") {
  if (!value?.trim()) return "";
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || url.username || url.password || url.port) return "";
    const path = url.pathname.replace(/\/$/, "");
    if (/YOUR_|[<>]/i.test(path) || path.split("/").some(part => /^(USERNAME|EVENT)$/i.test(part))) return "";
    if (provider === "cal") {
      if (url.hostname !== "cal.com" || !/^\/[a-z\d_-]+\/[a-z\d_-]+(?:\/[a-z\d_-]+)?$/i.test(path)) return "";
      if (path.startsWith("/team/") && path.split("/").length !== 4) return "";
    } else if (url.hostname !== "tally.so" || !/^\/(r|embed)\/[a-z\d]+$/i.test(path)) return "";
    // Public event/form links only. Site query strings are separately allowlisted.
    return url.origin + path;
  } catch { return ""; }
}

export function buildWhatsAppUrl(number: string, message = DEFAULT_WHATSAPP_MESSAGE) {
  const validNumber = validateWhatsAppNumber(number);
  return validNumber ? `https://wa.me/${validNumber}?text=${encodeURIComponent(message)}` : "";
}

export function collectAttribution(pageUrl: string, referrer = "", context = "") {
  const fields: Record<string, string> = {};
  try {
    const page = new URL(pageUrl);
    for (const key of UTM_KEYS) {
      const value = page.searchParams.get(key)?.trim().slice(0, 200);
      if (value) fields[key] = value;
    }
    fields.originPage = page.origin + page.pathname;
  } catch { /* No attribution for an invalid page URL. */ }
  try {
    const referral = new URL(referrer);
    if (["https:", "http:"].includes(referral.protocol)) fields.referral = referral.origin;
  } catch { /* Direct visit. */ }
  if (context.trim()) fields.project_context = context.trim().slice(0, 200);
  return fields;
}

export function createCalDestination(url: string, attribution: Record<string, string>, theme: "light" | "dark", iframeTitle = frenchMessages.Acquisition.calTitle) {
  const valid = validateProviderUrl(url, "cal");
  if (!valid) return null;
  const hosted = new URL(valid);
  // Cal recognizes UTM parameters; arbitrary hidden fields belong in Tally only.
  const tracking = Object.fromEntries(UTM_KEYS.filter(key => attribution[key]).map(key => [key, attribution[key]]));
  for (const [key, value] of Object.entries(tracking)) hosted.searchParams.set(key, value);
  const config: Record<string, string | Record<string, string>> & { theme: "light" | "dark"; layout: "month_view" } = {
    ...tracking, theme, layout: "month_view", iframeAttrs: { title: iframeTitle },
  };
  return {
    hostedUrl: hosted.href,
    calLink: hosted.pathname.slice(1),
    config,
  };
}

export function createTallyDestination(url: string, attribution: Record<string, string>) {
  const valid = validateProviderUrl(url, "tally");
  if (!valid) return null;
  const formId = new URL(valid).pathname.split("/").pop()!;
  const hosted = new URL(`https://tally.so/r/${formId}`);
  const allowed = [...UTM_KEYS, "originPage", "referral", "project_context"];
  for (const key of allowed) if (attribution[key]) hosted.searchParams.set(key, attribution[key]);
  const embed = new URL(hosted.href);
  embed.pathname = `/embed/${formId}`;
  embed.searchParams.set("alignLeft", "1");
  embed.searchParams.set("hideTitle", "1");
  return { hostedUrl: hosted.href, embedUrl: embed.href };
}

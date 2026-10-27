import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en", "ht"],
  defaultLocale: "fr",
  localePrefix: "always",
  // Metadata and sitemap emit the canonical HTTPS language URLs from siteConfig.
  // Avoid a second, request-host-derived set in middleware's Link header.
  alternateLinks: false,
  localeCookie: { maxAge: 60 * 60 * 24 * 365, sameSite: "lax" },
});
export type Locale = (typeof routing.locales)[number];

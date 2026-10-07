import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en", "ht"],
  defaultLocale: "fr",
  localePrefix: "always",
  localeCookie: { maxAge: 60 * 60 * 24 * 365, sameSite: "lax" },
});
export type Locale = (typeof routing.locales)[number];

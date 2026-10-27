import type { MetadataRoute } from "next";
import { routing } from "../i18n/routing";
import { contentLastModified, publicOrigin } from "../lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = publicOrigin();
  const languages = Object.fromEntries(routing.locales.map(locale => [locale, `${origin}/${locale}`]));
  return routing.locales.map(locale => ({
    url: `${origin}/${locale}`,
    lastModified: contentLastModified,
    alternates: { languages: { ...languages, "x-default": `${origin}/fr` } },
  }));
}

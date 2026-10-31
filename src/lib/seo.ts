import { siteConfig } from "../data/siteConfig";
import type { Metadata } from "next";
import { routing } from "../i18n/routing";

// Fail a misconfigured build rather than publishing HTTP or staging canonicals.
export function publicOrigin(value = siteConfig.domain): string {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password ||
      url.pathname !== "/" || url.search || url.hash) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an HTTPS origin without a path, query or credentials.");
  }
  return url.origin;
}

// Update only when these pages materially change; never use the build/request time.
export const contentLastModified = "2026-10-30";

type Locale = (typeof routing.locales)[number];
type MetadataCopy = {
  title: string;
  description: string;
  socialDescription: string;
  twitterDescription: string;
};
const socialLocales = { fr: "fr_FR", en: "en_US", ht: "ht_HT" };

export function pageMetadata(locale: Locale, copy: MetadataCopy): Metadata {
  const origin = publicOrigin();
  const url = `${origin}/${locale}`;
  const image = { url: `${origin}/og/seekursor-${locale}.png`, width: 1200, height: 630, alt: "Seekursor logo" };
  const languages = Object.fromEntries(routing.locales.map(code => [code, `${origin}/${code}`]));
  return {
    metadataBase: new URL(origin),
    title: copy.title,
    description: copy.description,
    alternates: { canonical: url, languages: { ...languages, "x-default": `${origin}/fr` } },
    icons: {
      icon: [
        { url: "/brand/seekursor-favicon.ico", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
        { url: "/brand/seekursor-icon-48.png", sizes: "48x48", type: "image/png" },
        { url: "/brand/seekursor-icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/brand/seekursor-icon-180.png", sizes: "180x180", type: "image/png" }],
    },
    openGraph: {
      type: "website", siteName: siteConfig.name, url,
      title: copy.title, description: copy.socialDescription,
      locale: socialLocales[locale],
      alternateLocale: routing.locales.filter(code => code !== locale).map(code => socialLocales[code]),
      images: [image],
    },
    twitter: { card: "summary_large_image", title: copy.title, description: copy.twitterDescription, images: [image] },
  };
}

export function brandStructuredData(copy: { structuredDescription: string; founderRole: string }) {
  const origin = publicOrigin();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization", "@id": `${origin}/#organization`,
        name: siteConfig.name, url: origin,
        logo: { "@type": "ImageObject", "@id": `${origin}/#logo`, url: `${origin}/brand/seekursor-icon-512.png`, width: 512, height: 512 },
        description: copy.structuredDescription,
        telephone: siteConfig.phoneLabel.replace(/\s/g, ""),
        ...(siteConfig.email ? { email: siteConfig.email } : {}),
        sameAs: [siteConfig.instagramUrl, siteConfig.tiktokUrl],
        areaServed: { "@type": "Country", name: "Haiti" },
        founder: { "@type": "Person", name: siteConfig.founderName, jobTitle: copy.founderRole },
      },
      {
        "@type": "WebSite", "@id": `${origin}/#website`,
        name: siteConfig.name, url: origin,
        inLanguage: routing.locales,
        publisher: { "@id": `${origin}/#organization` },
      },
    ] as const,
  };
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

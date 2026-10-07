import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import App from "../../App";
import { routing } from "../../i18n/routing";
import { siteConfig } from "../../data/siteConfig";

type Props = {params: Promise<{locale: string}>};
function publicOrigin() {
  try {
    const url = new URL(siteConfig.domain);
    return /^https?:$/.test(url.protocol) ? url.origin : undefined;
  } catch { return undefined; }
}
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({locale, namespace: "Metadata"});
  const origin = publicOrigin();
  const languages = Object.fromEntries(routing.locales.map(code => [code, `${origin ?? ""}/${code}`]));
  return {
    ...(origin ? {metadataBase: new URL(origin)} : {}),
    title: t("title"), description: t("description"),
    alternates: {canonical: `${origin ?? ""}/${locale}`, languages: {...languages, "x-default": `${origin ?? ""}/fr`}},
    icons: {icon: [{url: "/favicon.png", type: "image/png"}], apple: "/favicon.png"},
    openGraph: {type: "website", siteName: siteConfig.name, title: t("title"), description: t("socialDescription"),
      locale: {fr: "fr_FR", en: "en_US", ht: "ht_HT"}[locale],
      alternateLocale: routing.locales.filter(code => code !== locale).map(code => ({fr: "fr_FR", en: "en_US", ht: "ht_HT"}[code])),
      ...(origin ? {images: [siteConfig.logo]} : {})},
    twitter: {card: "summary", title: t("title"), description: t("twitterDescription"), ...(origin ? {images: [siteConfig.logo]} : {})},
  };
}
export default async function Page({params}: Props) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({locale, namespace: "Metadata"});
  const structuredData = {"@context": "https://schema.org", "@type": "ProfessionalService", name: siteConfig.name,
    description: t("structuredDescription"), inLanguage: locale,
    founder: {"@type": "Person", name: siteConfig.founderName, jobTitle: t("founderRole")}};
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData).replace(/</g, "\\u003c")}} /><App /></>;
}

import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import App from "../../App";
import { routing } from "../../i18n/routing";
import { pageMetadata } from "../../lib/seo";

type Props = {params: Promise<{locale: string}>};
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({locale, namespace: "Metadata"});
  return pageMetadata(locale, { title: t("title"), description: t("description"),
    socialDescription: t("socialDescription"), twitterDescription: t("twitterDescription") });
}
export default async function Page({params}: Props) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return <App />;
}

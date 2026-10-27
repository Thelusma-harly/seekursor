import type { ReactNode } from "react";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import { routing } from "../../i18n/routing";
import { brandStructuredData, serializeJsonLd } from "../../lib/seo";
import { inter, spaceGrotesk } from "../fonts";
import "../../index.css";

export function generateStaticParams() {
  return routing.locales.map(locale => ({locale}));
}
const themeScript = `try { document.documentElement.classList.toggle('dark', localStorage.getItem('seekursor-theme') === 'dark'); } catch { document.documentElement.classList.remove('dark'); } document.documentElement.style.colorScheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';`;

export default async function LocaleLayout({children, params}: {
  children: ReactNode; params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const structuredData = brandStructuredData({ structuredDescription: t("structuredDescription"), founderRole: t("founderRole") });
  return (
    <html lang={locale} className={`scroll-smooth ${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />
        <Script id="seekursor-theme" strategy="beforeInteractive" dangerouslySetInnerHTML={{__html: themeScript}} />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <div id="root">{children}</div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

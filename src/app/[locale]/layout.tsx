import type { ReactNode } from "react";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import { routing } from "../../i18n/routing";
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
  return (
    <html lang={locale} className="scroll-smooth" suppressHydrationWarning>
      <head>
        <Script id="seekursor-theme" strategy="beforeInteractive" dangerouslySetInnerHTML={{__html: themeScript}} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <div id="root">{children}</div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

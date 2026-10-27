import type { Metadata } from "next";
import "../index.css";

export const metadata: Metadata = { title: "404 | Seekursor" };

export default function GlobalNotFound() {
  return (
    <html lang="fr">
      <body className="bg-page text-ink">
        <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-6 px-6 py-16">
          <p className="font-display text-lg font-semibold">Seekursor · 404</p>
          <h1 className="font-display text-3xl font-semibold">Page introuvable</h1>
          <p>Cette page n’existe pas. Retrouvez Seekursor dans votre langue :</p>
          <nav aria-label="Retour à l’accueil" className="flex flex-wrap gap-3">
            <a href="/fr" lang="fr" className="inline-flex min-h-12 items-center rounded-xl border border-line px-4 underline">Accueil en français</a>
            <a href="/en" lang="en" className="inline-flex min-h-12 items-center rounded-xl border border-line px-4 underline">English homepage</a>
            <a href="/ht" lang="ht" className="inline-flex min-h-12 items-center rounded-xl border border-line px-4 underline">Akèy an kreyòl</a>
          </nav>
        </main>
      </body>
    </html>
  );
}

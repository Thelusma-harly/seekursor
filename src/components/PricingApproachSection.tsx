import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { WhatsAppCTA } from "./WhatsAppCTA";
import type { OpenAcquisition } from "../lib/acquisition";

export function PricingApproachSection({ onAcquire }: { onAcquire: OpenAcquisition }) {
  const t = useTranslations("Pricing");
  const steps = t.raw("steps") as string[];

  return (
    <section id="tarifs" aria-labelledby="pricing-title" className="border-b border-line bg-page py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[.18em] text-brand-ink">{t("eyebrow")}</p>
          <h2 id="pricing-title" className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-secondary sm:text-lg">{t("description")}</p>
        </div>
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step} className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
              <span aria-hidden="true" className="text-xs font-medium tracking-wider text-brand-ink">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-4 leading-relaxed text-ink">{step}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-4xl text-sm leading-relaxed text-ink-secondary">{t("recurring")}</p>
        <WhatsAppCTA onUnavailable={onAcquire} className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 font-medium text-white hover:bg-brand-hover">
          {t("discuss")} <ArrowUpRight size={18} aria-hidden="true" />
        </WhatsAppCTA>
      </div>
    </section>
  );
}

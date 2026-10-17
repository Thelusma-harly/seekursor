import { useTranslations } from "next-intl";
import { ArrowUpRight, MessageCircle, ListChecks, FileCheck2 } from "lucide-react";
import { WhatsAppCTA } from "./WhatsAppCTA";
import type { OpenAcquisition } from "../lib/acquisition";

const stepIcons = [MessageCircle, ListChecks, FileCheck2];

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
        <ol className="mt-10 grid list-none gap-5 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = stepIcons[index];
            return (
              <li key={step} className="group flex flex-col gap-6 rounded-2xl border border-line bg-surface p-6 shadow-sm shadow-ink/5 transition-[border-color,box-shadow,translate] duration-200 hover:border-brand/40 hover:shadow-md hover:shadow-ink/5 motion-safe:hover:-translate-y-1 sm:p-7">
                <div aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-xl border border-brand/10 bg-brand-tint text-brand-ink">
                  <Icon size={21} strokeWidth={1.7} />
                </div>
                <p className="font-display text-lg font-medium leading-snug text-ink sm:text-xl">{step}</p>
              </li>
            );
          })}
        </ol>
        <div className="mt-8 flex flex-col items-start gap-6 border-t border-line pt-6 lg:flex-row lg:justify-between">
          <p className="max-w-3xl text-sm leading-relaxed text-ink-secondary">{t("recurring")}</p>
          <WhatsAppCTA onUnavailable={onAcquire} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 font-medium text-white hover:bg-brand-hover">
            {t("discuss")} <ArrowUpRight size={18} aria-hidden="true" />
          </WhatsAppCTA>
        </div>
      </div>
    </section>
  );
}

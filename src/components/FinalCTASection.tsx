import { useTranslations } from "next-intl";
import { ArrowUpRight, CalendarDays, ArrowRight } from "lucide-react";
import { WhatsAppCTA } from "./WhatsAppCTA";
import type { OpenAcquisition } from "../lib/acquisition";

export function FinalCTASection({ onAcquire }: { onAcquire: OpenAcquisition }) {
  const t = useTranslations();
  return (
    <section className="border-b border-line bg-page py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[.18em] text-brand-ink">{t("FinalCTA.eyebrow")}</p>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">{t("FinalCTA.title")}</h2>
        <p className="mx-auto mt-5 max-w-xl leading-relaxed text-ink-secondary">
          {t("FinalCTA.description")}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <WhatsAppCTA onUnavailable={onAcquire} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 font-medium text-white hover:bg-brand-hover">
            {t("Common.talk")} <ArrowUpRight size={18} aria-hidden="true" />
          </WhatsAppCTA>
          <button type="button" aria-haspopup="dialog" data-acquisition="booking" onClick={event => onAcquire("booking", event.currentTarget)}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-6 py-3 font-medium text-ink hover:bg-surface-secondary">
            {t("Common.booking")} <CalendarDays size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="mx-auto mt-8 max-w-md border-t border-line pt-6">
          <button type="button" aria-haspopup="dialog" data-acquisition="inquiry" onClick={event => onAcquire("inquiry", event.currentTarget)}
            className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-brand-ink hover:underline">
            {t("Common.inquiry")} <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

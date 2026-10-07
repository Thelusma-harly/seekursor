import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { useSeekursorConfig } from "../data/seekursorConfig";
import { WhatsAppCTA } from "./WhatsAppCTA";
import type { OpenAcquisition } from "../lib/acquisition";
export function FounderSection({
  onAcquire,
}: {
  onAcquire: OpenAcquisition;
}) {
  const founder = useSeekursorConfig().founder;
  const t = useTranslations();
  return (
    <section
      id="a-propos"
      className="border-b border-line bg-surface py-20 sm:py-28"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <figure>
          <img
            src={founder.image}
            alt={t("Founder.imageAlt")}
            loading="lazy"
            width={1024}
            height={1024}
            className="aspect-[4/3] w-full rounded-2xl object-cover"
          />
        </figure>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[.18em] text-brand-ink">
            {t("Founder.eyebrow")}
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {t("Founder.title")}
          </h2>
          <div className="mt-6 space-y-4 leading-relaxed text-ink-secondary">
            <p>{founder.statement1}</p>
            <p>{founder.statement2}</p>
          </div>
          <div className="mt-7 border-t border-line pt-6">
            <p className="font-display text-lg font-semibold text-ink">
              {founder.name}
            </p>
            <p className="mt-1 text-sm text-ink-muted">{founder.role}</p>
          </div>
          <WhatsAppCTA onUnavailable={onAcquire} message={t("WhatsApp.founder")} className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-xl bg-brand px-5 py-3 font-medium text-white hover:bg-brand-hover">
            {t("Common.writeWhatsApp")} <ArrowUpRight size={18} aria-hidden="true" />
          </WhatsAppCTA>
        </div>
      </div>
    </section>
  );
}

import { useTranslations } from "next-intl";
import { FounderPortrait } from "./visuals/FounderPortrait";
import { ArrowUpRight } from "lucide-react";
import { useSeekursorConfig } from "../data/seekursorConfig";
import { WhatsAppCTA } from "./WhatsAppCTA";
import { Reveal } from "./ui/Reveal";
import type { OpenAcquisition } from "../lib/acquisition";
export function FounderSection({ onAcquire }: { onAcquire: OpenAcquisition }) {
  const { founder } = useSeekursorConfig();
  const t = useTranslations();
  return (
    <section id="a-propos" className="section-space founder-section">
      <div className="page-shell founder-layout">
        <Reveal>
          <figure className="founder-frame">
            <FounderPortrait src={founder.image} alt={t("Founder.imageAlt")} />
            <figcaption>
              <span className="status-dot" />
              <div>
                <strong>{founder.name}</strong>
                <span>{founder.role}</span>
              </div>
            </figcaption>
          </figure>
        </Reveal>
        <Reveal className="founder-copy" delay={0.1}>
          <p className="eyebrow">{t("Founder.eyebrow")}</p>
          <h2>{t("Founder.title")}</h2>
          <div className="founder-statement">
            <p>{founder.statement1}</p>
            <p>{founder.statement2}</p>
          </div>
          <WhatsAppCTA
            onUnavailable={onAcquire}
            message={t("WhatsApp.founder")}
            className=""
          >
            {t("Common.writeWhatsApp")}
            <ArrowUpRight size={18} aria-hidden="true" />
          </WhatsAppCTA>
        </Reveal>
      </div>
    </section>
  );
}

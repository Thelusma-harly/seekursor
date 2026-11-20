import { useTranslations } from "next-intl";
import { ArrowUpRight, CalendarDays, ArrowRight } from "lucide-react";
import { WhatsAppCTA } from "./WhatsAppCTA";
import { CubeButton } from "./ui/CubeButton";
import { Reveal } from "./ui/Reveal";
import type { OpenAcquisition } from "../lib/acquisition";
export function FinalCTASection({ onAcquire }: { onAcquire: OpenAcquisition }) {
  const t = useTranslations();
  return (
    <section className="footer-cta" aria-labelledby="final-cta-title">
      <div className="footer-cta-beams" aria-hidden="true" />
      <Reveal>
        <p className="eyebrow">
          <span className="status-dot" />
          {t("FinalCTA.eyebrow")}
        </p>
        <h2 id="final-cta-title">{t("FinalCTA.title")}</h2>
        <p className="footer-cta-description">{t("FinalCTA.description")}</p>
        <div className="hero-actions">
          <WhatsAppCTA onUnavailable={onAcquire} className="">
            {t("Common.talk")}
            <ArrowUpRight size={18} aria-hidden="true" />
          </WhatsAppCTA>
          <CubeButton
            variant="light"
            aria-haspopup="dialog"
            data-acquisition="booking"
            onClick={(event) => onAcquire("booking", event.currentTarget)}
          >
            {t("Common.booking")}
            <CalendarDays size={17} aria-hidden="true" />
          </CubeButton>
        </div>
        <button
          type="button"
          aria-haspopup="dialog"
          data-acquisition="inquiry"
          onClick={(event) => onAcquire("inquiry", event.currentTarget)}
          className="footer-inquiry"
        >
          {t("Common.inquiry")}
          <ArrowRight size={17} aria-hidden="true" />
        </button>
      </Reveal>
    </section>
  );
}
